#!/usr/bin/env python3
"""
CreatorCoin AI - Content Quality Assessment Service
Main application entry point for the AI microservice
"""

import os
import sys
import logging
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import redis
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import custom modules
from services.content_analyzer import ContentAnalyzer
from services.quality_scorer import QualityScorer
from services.fraud_detector import FraudDetector
from utils.logger import setup_logger
from utils.cache import CacheManager
from config import Config

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)
CORS(app, origins=[os.getenv('CORS_ORIGIN', 'http://localhost:3000')])

# Setup logging
logger = setup_logger(__name__)

# Initialize services
content_analyzer = ContentAnalyzer()
quality_scorer = QualityScorer()
fraud_detector = FraudDetector()
cache_manager = CacheManager()

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'CreatorCoin AI Service',
        'version': '1.0.0',
        'timestamp': datetime.utcnow().isoformat(),
        'uptime': app.config.get('START_TIME', datetime.utcnow()).isoformat()
    }), 200

@app.route('/api/analyze/content', methods=['POST'])
def analyze_content():
    """
    Analyze content and return quality assessment
    
    Expected payload:
    {
        "content_id": "unique_content_id",
        "content_type": "video|image|text",
        "content_url": "url_to_content",
        "metadata": {
            "title": "content_title",
            "description": "content_description",
            "tags": ["tag1", "tag2"],
            "duration": 30,
            "creator_id": "creator_id"
        }
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['content_id', 'content_type', 'content_url']
        if not all(field in data for field in required_fields):
            return jsonify({
                'error': 'Missing required fields',
                'required': required_fields,
                'received': list(data.keys())
            }), 400

        content_id = data['content_id']
        
        # Check cache first
        cached_result = cache_manager.get_analysis(content_id)
        if cached_result:
            logger.info(f"Returning cached analysis for content {content_id}")
            return jsonify(cached_result), 200

        # Perform content analysis
        logger.info(f"Starting analysis for content {content_id}")
        
        # Extract content features
        features = content_analyzer.extract_features(data)
        
        # Calculate quality scores
        quality_scores = quality_scorer.calculate_scores(features)
        
        # Run fraud detection
        fraud_score = fraud_detector.assess_risk(data, features)
        
        # Compile final assessment
        assessment = {
            'content_id': content_id,
            'quality_index': quality_scores['overall_score'],
            'scores': {
                'engagement_potential': quality_scores['engagement'],
                'educational_value': quality_scores['educational'],
                'creativity_score': quality_scores['creativity'],
                'safety_rating': quality_scores['safety'],
                'production_quality': quality_scores['production']
            },
            'fraud_risk': {
                'risk_level': fraud_score['risk_level'],
                'confidence': fraud_score['confidence'],
                'indicators': fraud_score.get('indicators', 0),
                'action': fraud_score.get('action', 'allow')
            },
            'recommendations': quality_scores.get('recommendations', []),
            'analysis_timestamp': datetime.utcnow().isoformat(),
            'processing_time_ms': features.get('processing_time', 0)
        }

        # Cache the result
        cache_manager.set_analysis(content_id, assessment)
        
        logger.info(f"Analysis completed for content {content_id} with quality index {assessment['quality_index']}")
        
        return jsonify(assessment), 200

    except Exception as e:
        logger.error(f"Error analyzing content: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.route('/api/analyze/batch', methods=['POST'])
def analyze_batch():
    """
    Analyze multiple pieces of content in batch
    
    Expected payload:
    {
        "contents": [
            {content_object_1},
            {content_object_2},
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        contents = data.get('contents', [])
        
        if not contents:
            return jsonify({'error': 'No contents provided'}), 400
        
        if len(contents) > 50:  # Limit batch size
            return jsonify({'error': 'Batch size too large (max 50)'}), 400
        
        results = []
        
        for content in contents:
            try:
                # Use the same analysis logic as single content
                content_id = content.get('content_id')
                
                # Check cache first
                cached_result = cache_manager.get_analysis(content_id)
                if cached_result:
                    results.append(cached_result)
                    continue
                
                # Perform analysis
                features = content_analyzer.extract_features(content)
                quality_scores = quality_scorer.calculate_scores(features)
                fraud_score = fraud_detector.assess_risk(content, features)
                
                assessment = {
                    'content_id': content_id,
                    'quality_index': quality_scores['overall_score'],
                    'scores': quality_scores,
                    'fraud_risk': fraud_score,
                    'analysis_timestamp': datetime.utcnow().isoformat()
                }
                
                results.append(assessment)
                cache_manager.set_analysis(content_id, assessment)
                
            except Exception as e:
                logger.error(f"Error analyzing content {content.get('content_id', 'unknown')}: {str(e)}")
                results.append({
                    'content_id': content.get('content_id', 'unknown'),
                    'error': str(e)
                })
        
        return jsonify({
            'batch_results': results,
            'total_processed': len(results),
            'timestamp': datetime.utcnow().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"Error in batch analysis: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/api/quality/trends', methods=['GET'])
def get_quality_trends():
    """Get quality trends and analytics"""
    try:
        # Get query parameters
        creator_id = request.args.get('creator_id')
        time_range = request.args.get('time_range', '7d')  # 1d, 7d, 30d
        
        trends = quality_scorer.get_quality_trends(creator_id, time_range)
        
        return jsonify(trends), 200

    except Exception as e:
        logger.error(f"Error getting quality trends: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/fraud/report', methods=['POST'])
def report_fraud():
    """Report suspicious activity for investigation"""
    try:
        data = request.get_json()
        
        report = fraud_detector.create_report(data)
        
        return jsonify(report), 200

    except Exception as e:
        logger.error(f"Error creating fraud report: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/models/status', methods=['GET'])
def model_status():
    """Get status of AI models"""
    try:
        status = {
            'content_analyzer': content_analyzer.get_status(),
            'quality_scorer': quality_scorer.get_status(),
            'fraud_detector': fraud_detector.get_status(),
            'openai_connection': _check_openai_connection(),
            'cache_status': cache_manager.get_status()
        }
        
        return jsonify(status), 200

    except Exception as e:
        logger.error(f"Error getting model status: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Frontend-friendly route aliases
@app.route('/api/analyze', methods=['POST'])
def analyze_content_simple():
    """Simplified analyze endpoint for frontend compatibility"""
    try:
        data = request.get_json()
        logger.info(f"🎯 Received analyze request: {data}")
        
        # Mock response for demo
        mock_analysis = {
            'content_type': data.get('content_type', 'dance'),
            'quality_score': 9.2,
            'viral_potential': 85,
            'predicted_views': '125K-250K',
            'suggestions': [
                'Add trending music',
                'Optimize timing to 6-8 PM',
                'Use hashtags: #fyp #dance #viral'
            ],
            'engagement_prediction': {
                'likes': '8.5K - 12K',
                'comments': '450 - 680',
                'shares': '320 - 580'
            },
            'timestamp': datetime.utcnow().isoformat()
        }
        
        logger.info(f"✅ Analysis complete: {mock_analysis}")
        return jsonify(mock_analysis), 200
        
    except Exception as e:
        logger.error(f"Error in simple analyze: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """AI-powered content recommendations"""
    try:
        data = request.get_json()
        logger.info(f"🤖 Received recommendations request: {data}")
        
        # Mock recommendations for demo
        mock_recommendations = {
            'trending_topics': [
                {'topic': 'Dance challenges', 'engagement_boost': '+45%'},
                {'topic': 'Quick tutorials', 'retention_boost': '+32%'},
                {'topic': 'Behind-the-scenes', 'authenticity_score': 9.1}
            ],
            'optimal_timing': {
                'best_time': '6-8 PM EST',
                'timezone_adjustments': True,
                'audience_peak': '7:30 PM'
            },
            'hashtag_strategy': {
                'trending': ['#fyp', '#trending', '#viral'],
                'niche': ['#tutorial', '#creator', '#ai'],
                'predicted_reach': '50K-100K views'
            },
            'content_ideas': [
                'Dance tutorial with trending music',
                'Day-in-the-life creator content',
                'Q&A with audience interaction',
                'Collaboration with other creators'
            ],
            'audience_insights': {
                'primary_demographic': 'Gen Z (18-24)',
                'engagement_preferences': 'Interactive content',
                'growth_opportunity': '+28% potential reach'
            },
            'timestamp': datetime.utcnow().isoformat()
        }
        
        logger.info(f"✅ Recommendations generated: {mock_recommendations}")
        return jsonify(mock_recommendations), 200
        
    except Exception as e:
        logger.error(f"Error generating recommendations: {str(e)}")
        return jsonify({'error': str(e)}), 500

def _check_openai_connection():
    """Check OpenAI API connection"""
    try:
        # For demo purposes, simulate API check
        # In production with openai>=1.0, use: client = openai.OpenAI(); client.models.list()
        api_key = os.getenv('OPENAI_API_KEY')
        
        if not api_key:
            return {
                'status': 'no_api_key',
                'message': 'OpenAI API key not configured'
            }
        
        # Mock successful connection for demo
        return {
            'status': 'connected',
            'models_available': 10,
            'primary_model': os.getenv('OPENAI_MODEL', 'gpt-4'),
            'note': 'Mock connection for demo'
        }
    except Exception as e:
        return {
            'status': 'error',
            'error': str(e)
        }

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Not Found',
        'message': 'The requested endpoint was not found',
        'timestamp': datetime.utcnow().isoformat()
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal Server Error',
        'message': 'An unexpected error occurred',
        'timestamp': datetime.utcnow().isoformat()
    }), 500

if __name__ == '__main__':
    # Set start time for uptime calculation
    app.config['START_TIME'] = datetime.utcnow()
    
    # Get configuration
    port = int(os.getenv('AI_SERVICE_PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    logger.info(f"🤖 Starting CreatorCoin AI Service on port {port}")
    logger.info(f"🔗 Health check available at http://localhost:{port}/health")
    logger.info(f"📊 API endpoints available at http://localhost:{port}/api")
    
    # Run the application
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug,
        threaded=True
    )
