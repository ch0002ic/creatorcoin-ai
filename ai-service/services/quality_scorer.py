"""
CreatorCoin AI - Quality Scorer Service
Calculates quality scores based on content features
"""

import os
import json
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import pickle
from collections import defaultdict

class QualityScorer:
    """
    Calculates comprehensive quality scores for content based on extracted features.
    Uses a combination of rule-based scoring and machine learning models.
    """
    
    def __init__(self):
        # Weight configuration for different quality dimensions
        self.weights = {
            'engagement': 0.25,      # Likelihood to generate engagement
            'educational': 0.20,     # Educational/informative value
            'creativity': 0.20,      # Originality and creativity
            'safety': 0.15,          # Content safety and compliance
            'production': 0.20       # Technical production quality
        }
        
        # Historical data for trend analysis
        self.quality_history = defaultdict(list)
        
        # Scoring thresholds
        self.thresholds = {
            'excellent': 0.8,
            'good': 0.6,
            'fair': 0.4,
            'poor': 0.2
        }
        
        # Load any pre-trained models (for demo, we'll use rule-based scoring)
        self.model = None
        
    def calculate_scores(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate comprehensive quality scores based on extracted features.
        
        Args:
            features: Dictionary containing extracted content features
            
        Returns:
            Dictionary with quality scores and recommendations
        """
        try:
            content_features = features.get('features', {})
            content_id = features.get('content_id')
            
            # Calculate individual dimension scores
            engagement_score = self._calculate_engagement_score(content_features)
            educational_score = self._calculate_educational_score(content_features)
            creativity_score = self._calculate_creativity_score(content_features)
            safety_score = self._calculate_safety_score(content_features)
            production_score = self._calculate_production_score(content_features)
            
            # Calculate weighted overall score
            overall_score = (
                engagement_score * self.weights['engagement'] +
                educational_score * self.weights['educational'] +
                creativity_score * self.weights['creativity'] +
                safety_score * self.weights['safety'] +
                production_score * self.weights['production']
            )
            
            # Generate quality rating
            quality_rating = self._get_quality_rating(overall_score)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(
                content_features, 
                {
                    'engagement': engagement_score,
                    'educational': educational_score,
                    'creativity': creativity_score,
                    'safety': safety_score,
                    'production': production_score
                }
            )
            
            # Store in history for trend analysis
            if content_id:
                self._store_quality_history(content_id, overall_score, content_features)
            
            result = {
                'overall_score': round(overall_score, 3),
                'quality_rating': quality_rating,
                'engagement': round(engagement_score, 3),
                'educational': round(educational_score, 3),
                'creativity': round(creativity_score, 3),
                'safety': round(safety_score, 3),
                'production': round(production_score, 3),
                'recommendations': recommendations,
                'scoring_timestamp': datetime.utcnow().isoformat(),
                'weights_used': self.weights.copy()
            }
            
            return result
            
        except Exception as e:
            print(f"Error calculating quality scores: {str(e)}")
            return {
                'overall_score': 0.5,
                'quality_rating': 'fair',
                'error': str(e),
                'scoring_timestamp': datetime.utcnow().isoformat()
            }
    
    def _calculate_engagement_score(self, features: Dict[str, Any]) -> float:
        """Calculate engagement potential score."""
        score = 0.5  # Base score
        
        try:
            # Title factors
            title_length = features.get('title_length', 0)
            if 10 <= title_length <= 60:  # Optimal title length
                score += 0.1
            
            if features.get('title_has_caps', False):
                score += 0.05  # Caps can increase engagement
            
            if features.get('title_exclamation_count', 0) > 0:
                score += 0.05
                
            if features.get('title_question_count', 0) > 0:
                score += 0.05
            
            # Content type specific factors
            if features.get('video_duration'):
                duration = features['video_duration']
                if 15 <= duration <= 60:  # Sweet spot for engagement
                    score += 0.15
                elif duration < 5:
                    score -= 0.1  # Too short might lack substance
                elif duration > 180:
                    score -= 0.1  # Too long might lose attention
            
            # Visual quality factors
            if features.get('brightness_score', 0) > 0.5:
                score += 0.05
            if features.get('contrast_score', 0) > 0.6:
                score += 0.05
            if features.get('color_variety', 0) > 0.6:
                score += 0.05
            
            # AI-powered engagement prediction
            ai_engagement = features.get('ai_engagement_potential', 0.5)
            score = (score + ai_engagement) / 2  # Average with AI prediction
            
            # Motion and dynamic content
            motion_score = features.get('motion_score', 0)
            if motion_score > 0.3:
                score += 0.1
            
            # Face detection (can increase engagement)
            if features.get('face_detection_confidence', 0) > 0.7:
                score += 0.05
            
            # Hashtag usage
            hashtag_count = features.get('description_hashtag_count', 0)
            if 2 <= hashtag_count <= 10:  # Optimal hashtag range
                score += 0.05
            
        except Exception as e:
            print(f"Error calculating engagement score: {str(e)}")
        
        return max(0.0, min(1.0, score))
    
    def _calculate_educational_score(self, features: Dict[str, Any]) -> float:
        """Calculate educational value score."""
        score = 0.3  # Base score
        
        try:
            # AI educational assessment
            ai_educational = features.get('ai_educational_value', 0.3)
            score = (score + ai_educational) / 2
            
            # Description depth
            desc_length = features.get('description_length', 0)
            if desc_length > 100:  # Detailed descriptions often indicate educational content
                score += 0.15
            if desc_length > 300:
                score += 0.1
            
            # Word count and complexity
            word_count = features.get('description_word_count', 0)
            if word_count > 50:
                score += 0.1
            
            avg_word_length = features.get('avg_word_length', 0)
            if avg_word_length > 5:  # Longer words might indicate more complex content
                score += 0.05
            
            # Content depth analysis
            ai_content_depth = features.get('ai_content_depth', 0.3)
            score = (score + ai_content_depth) / 2
            
            # Links in description (might indicate additional resources)
            if features.get('description_has_links', False):
                score += 0.1
            
            # Duration for video content (educational content often longer)
            if features.get('video_duration', 0) > 60:
                score += 0.1
            
            # Category bonus
            ai_category = features.get('ai_category', '')
            if ai_category in ['education', 'technology', 'science', 'tutorial']:
                score += 0.2
            
        except Exception as e:
            print(f"Error calculating educational score: {str(e)}")
        
        return max(0.0, min(1.0, score))
    
    def _calculate_creativity_score(self, features: Dict[str, Any]) -> float:
        """Calculate creativity and originality score."""
        score = 0.4  # Base score
        
        try:
            # AI originality assessment
            ai_originality = features.get('ai_originality', 0.4)
            score = (score + ai_originality) / 2
            
            # Color diversity (creative content often more colorful)
            color_variety = features.get('color_variety', 0)
            if color_variety > 0.7:
                score += 0.1
            
            color_diversity = features.get('color_diversity', 0)
            if color_diversity > 0.6:
                score += 0.05
            
            # Scene changes (dynamic content can be more creative)
            scene_changes = features.get('scene_changes', 0)
            duration = features.get('video_duration', 30)
            if duration > 0 and scene_changes / duration > 0.1:  # Good scene variety
                score += 0.1
            
            # Text overlay (creative editing)
            if features.get('text_overlay_detected', False):
                score += 0.05
            
            # Unique title characteristics
            if features.get('title_word_count', 0) > 8:  # Detailed titles
                score += 0.05
            
            # Emoji usage (can indicate creativity)
            emoji_count = features.get('emoji_count', 0)
            if 1 <= emoji_count <= 5:  # Moderate emoji use
                score += 0.05
            
            # Production composition
            composition_score = features.get('composition_score', 0)
            if composition_score > 0.7:
                score += 0.1
            
            # Aspect ratio creativity (non-standard can be creative)
            aspect_ratio = features.get('aspect_ratio', 1.0)
            if not (0.9 <= aspect_ratio <= 1.1):  # Non-square format
                score += 0.05
            
        except Exception as e:
            print(f"Error calculating creativity score: {str(e)}")
        
        return max(0.0, min(1.0, score))
    
    def _calculate_safety_score(self, features: Dict[str, Any]) -> float:
        """Calculate content safety score."""
        score = 0.8  # Start with high safety assumption
        
        try:
            # AI safety assessment
            ai_safety = features.get('ai_safety_score', 0.8)
            score = (score + ai_safety) / 2
            
            # Toxicity detection
            toxicity_score = features.get('toxicity_score', 0)
            score -= toxicity_score * 0.5  # Reduce score based on toxicity
            
            # Excessive caps (might indicate shouting)
            cap_ratio = features.get('capitalization_ratio', 0)
            if cap_ratio > 0.3:
                score -= 0.1
            
            # Excessive exclamation marks
            exclamation_count = features.get('title_exclamation_count', 0)
            if exclamation_count > 3:
                score -= 0.05
            
            # Sentiment analysis
            sentiment = features.get('sentiment_score', 0)
            if sentiment < -0.3:  # Very negative sentiment
                score -= 0.1
            elif sentiment > 0.3:  # Positive sentiment
                score += 0.05
            
            # Brightness and visual comfort
            brightness = features.get('brightness_score', 0.5)
            if brightness < 0.2 or brightness > 0.9:  # Too dark or bright
                score -= 0.05
            
        except Exception as e:
            print(f"Error calculating safety score: {str(e)}")
        
        return max(0.0, min(1.0, score))
    
    def _calculate_production_score(self, features: Dict[str, Any]) -> float:
        """Calculate technical production quality score."""
        score = 0.5  # Base score
        
        try:
            # AI production quality assessment
            ai_production = features.get('ai_production_quality', 0.5)
            score = (score + ai_production) / 2
            
            # Visual quality metrics
            sharpness = features.get('sharpness_score', 0)
            if sharpness > 0.7:
                score += 0.15
            elif sharpness < 0.3:
                score -= 0.1
            
            brightness = features.get('brightness_score', 0.5)
            if 0.3 <= brightness <= 0.8:  # Good brightness range
                score += 0.05
            
            contrast = features.get('contrast_score', 0)
            if contrast > 0.5:
                score += 0.05
            
            # Resolution indicators
            if features.get('estimated_resolution') == '1080p':
                score += 0.1
            elif features.get('estimated_resolution') == '4K':
                score += 0.15
            
            # Audio presence (for video)
            if features.get('has_audio', False):
                score += 0.05
            
            # Composition quality
            composition = features.get('composition_score', 0)
            if composition > 0.6:
                score += 0.1
            
            # Frame rate (estimated)
            fps = features.get('estimated_fps', 0)
            if fps >= 30:
                score += 0.05
            
            # Face detection quality (if faces present)
            face_confidence = features.get('face_detection_confidence', 0)
            if face_confidence > 0.8:
                score += 0.05
            
        except Exception as e:
            print(f"Error calculating production score: {str(e)}")
        
        return max(0.0, min(1.0, score))
    
    def _get_quality_rating(self, score: float) -> str:
        """Convert numerical score to quality rating."""
        if score >= self.thresholds['excellent']:
            return 'excellent'
        elif score >= self.thresholds['good']:
            return 'good'
        elif score >= self.thresholds['fair']:
            return 'fair'
        else:
            return 'poor'
    
    def _generate_recommendations(self, features: Dict[str, Any], scores: Dict[str, float]) -> List[str]:
        """Generate improvement recommendations based on scores."""
        recommendations = []
        
        try:
            # Engagement recommendations
            if scores['engagement'] < 0.6:
                if features.get('title_length', 0) < 10:
                    recommendations.append("Consider making your title more descriptive and engaging")
                if features.get('video_duration', 0) < 10:
                    recommendations.append("Try creating longer content to provide more value")
                if features.get('motion_score', 0) < 0.3:
                    recommendations.append("Add more dynamic elements or movement to increase engagement")
            
            # Educational recommendations
            if scores['educational'] < 0.5:
                if features.get('description_length', 0) < 50:
                    recommendations.append("Add more detailed descriptions to increase educational value")
                recommendations.append("Consider adding educational elements or explaining concepts")
            
            # Creativity recommendations
            if scores['creativity'] < 0.5:
                recommendations.append("Try experimenting with unique angles or creative approaches")
                if features.get('color_variety', 0) < 0.5:
                    recommendations.append("Consider using more diverse colors or visual elements")
            
            # Production recommendations
            if scores['production'] < 0.6:
                if features.get('sharpness_score', 0) < 0.5:
                    recommendations.append("Improve image sharpness and focus")
                if features.get('brightness_score', 0) < 0.3:
                    recommendations.append("Increase lighting for better visibility")
                if features.get('brightness_score', 0) > 0.9:
                    recommendations.append("Reduce overexposure for better visual quality")
            
            # Safety recommendations
            if scores['safety'] < 0.7:
                if features.get('toxicity_score', 0) > 0.3:
                    recommendations.append("Review content for potentially harmful language")
                recommendations.append("Ensure content follows community guidelines")
            
            # General recommendations
            if len(recommendations) == 0:
                recommendations.append("Great work! Your content shows good quality across all dimensions")
            
        except Exception as e:
            print(f"Error generating recommendations: {str(e)}")
            recommendations.append("Unable to generate specific recommendations at this time")
        
        return recommendations
    
    def _store_quality_history(self, content_id: str, score: float, features: Dict[str, Any]):
        """Store quality score in history for trend analysis."""
        try:
            creator_id = features.get('creator_id', 'unknown')
            
            history_entry = {
                'content_id': content_id,
                'score': score,
                'timestamp': datetime.utcnow().isoformat(),
                'content_type': features.get('content_type', 'unknown')
            }
            
            self.quality_history[creator_id].append(history_entry)
            
            # Keep only last 100 entries per creator
            if len(self.quality_history[creator_id]) > 100:
                self.quality_history[creator_id] = self.quality_history[creator_id][-100:]
                
        except Exception as e:
            print(f"Error storing quality history: {str(e)}")
    
    def get_quality_trends(self, creator_id: Optional[str] = None, time_range: str = '7d') -> Dict[str, Any]:
        """Get quality trends for a creator or overall."""
        try:
            # Parse time range
            days = int(time_range.rstrip('d'))
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            if creator_id:
                history = self.quality_history.get(creator_id, [])
            else:
                # Aggregate all creators
                history = []
                for creator_history in self.quality_history.values():
                    history.extend(creator_history)
            
            # Filter by time range
            recent_history = [
                entry for entry in history
                if datetime.fromisoformat(entry['timestamp'].replace('Z', '+00:00')) > cutoff_date
            ]
            
            if not recent_history:
                return {
                    'creator_id': creator_id,
                    'time_range': time_range,
                    'trends': {},
                    'message': 'No data available for the specified time range'
                }
            
            # Calculate trends
            scores = [entry['score'] for entry in recent_history]
            
            trends = {
                'average_score': round(np.mean(scores), 3),
                'highest_score': round(max(scores), 3),
                'lowest_score': round(min(scores), 3),
                'score_trend': 'improving' if len(scores) > 1 and scores[-1] > scores[0] else 'stable',
                'total_content': len(recent_history),
                'score_distribution': {
                    'excellent': len([s for s in scores if s >= 0.8]),
                    'good': len([s for s in scores if 0.6 <= s < 0.8]),
                    'fair': len([s for s in scores if 0.4 <= s < 0.6]),
                    'poor': len([s for s in scores if s < 0.4])
                }
            }
            
            return {
                'creator_id': creator_id,
                'time_range': time_range,
                'trends': trends,
                'analysis_timestamp': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            print(f"Error getting quality trends: {str(e)}")
            return {
                'error': str(e),
                'creator_id': creator_id,
                'time_range': time_range
            }
    
    def get_status(self) -> Dict[str, Any]:
        """Get the status of the quality scorer."""
        return {
            'service': 'QualityScorer',
            'status': 'operational',
            'weights': self.weights,
            'thresholds': self.thresholds,
            'history_size': sum(len(history) for history in self.quality_history.values()),
            'creators_tracked': len(self.quality_history)
        }
