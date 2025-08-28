"""
CreatorCoin AI - Content Analyzer Service
Analyzes content to extract features for quality assessment
"""

import os
import time
import json
import requests
from datetime import datetime
from typing import Dict, List, Any, Optional
import openai
import cv2
import numpy as np
from urllib.parse import urlparse
import tempfile
import hashlib

class ContentAnalyzer:
    """
    Analyzes various types of content (video, image, text) to extract features
    for quality assessment and fraud detection.
    """
    
    def __init__(self):
        self.openai_client = openai
        self.openai_client.api_key = os.getenv('OPENAI_API_KEY')
        self.model = os.getenv('OPENAI_MODEL', 'gpt-4')
        self.max_tokens = int(os.getenv('OPENAI_MAX_TOKENS', 1000))
        
        # Content analysis cache
        self.analysis_cache = {}
        
        # Supported content types
        self.supported_video_formats = ['.mp4', '.mov', '.avi', '.mkv', '.webm']
        self.supported_image_formats = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        
    def extract_features(self, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract comprehensive features from content for quality assessment.
        
        Args:
            content_data: Dictionary containing content information
            
        Returns:
            Dictionary with extracted features
        """
        start_time = time.time()
        
        try:
            content_id = content_data.get('content_id')
            content_type = content_data.get('content_type', 'video')
            content_url = content_data.get('content_url')
            metadata = content_data.get('metadata', {})
            
            # Check cache first
            cache_key = self._generate_cache_key(content_data)
            if cache_key in self.analysis_cache:
                cached_result = self.analysis_cache[cache_key]
                cached_result['from_cache'] = True
                return cached_result
            
            features = {
                'content_id': content_id,
                'content_type': content_type,
                'analysis_timestamp': datetime.utcnow().isoformat(),
                'features': {}
            }
            
            # Extract metadata features
            features['features'].update(self._extract_metadata_features(metadata))
            
            # Extract content-specific features based on type
            if content_type == 'video':
                features['features'].update(self._extract_video_features(content_url, metadata))
            elif content_type == 'image':
                features['features'].update(self._extract_image_features(content_url, metadata))
            elif content_type == 'text':
                features['features'].update(self._extract_text_features(metadata))
            
            # Extract AI-powered semantic features
            features['features'].update(self._extract_semantic_features(content_data))
            
            # Calculate processing time
            processing_time = (time.time() - start_time) * 1000
            features['processing_time'] = processing_time
            features['from_cache'] = False
            
            # Cache the result
            self.analysis_cache[cache_key] = features
            
            return features
            
        except Exception as e:
            print(f"Error extracting features: {str(e)}")
            return {
                'content_id': content_data.get('content_id'),
                'error': str(e),
                'processing_time': (time.time() - start_time) * 1000,
                'features': {}
            }
    
    def _extract_metadata_features(self, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Extract features from content metadata."""
        features = {}
        
        # Basic metadata
        features['title_length'] = len(metadata.get('title', ''))
        features['description_length'] = len(metadata.get('description', ''))
        features['tag_count'] = len(metadata.get('tags', []))
        features['duration'] = metadata.get('duration', 0)
        
        # Title analysis
        title = metadata.get('title', '')
        if title:
            features['title_has_caps'] = any(c.isupper() for c in title)
            features['title_has_numbers'] = any(c.isdigit() for c in title)
            features['title_word_count'] = len(title.split())
            features['title_exclamation_count'] = title.count('!')
            features['title_question_count'] = title.count('?')
        
        # Description analysis
        description = metadata.get('description', '')
        if description:
            features['description_word_count'] = len(description.split())
            features['description_has_links'] = 'http' in description.lower()
            features['description_hashtag_count'] = description.count('#')
            features['description_mention_count'] = description.count('@')
        
        # Tag analysis
        tags = metadata.get('tags', [])
        if tags:
            features['avg_tag_length'] = sum(len(tag) for tag in tags) / len(tags)
            features['has_trending_tags'] = any(tag.lower() in ['viral', 'trending', 'fyp', 'foryou'] for tag in tags)
        
        return features
    
    def _extract_video_features(self, video_url: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Extract features from video content."""
        features = {}
        
        try:
            # For demo purposes, we'll simulate video analysis
            # In production, you would download and analyze the actual video
            
            duration = metadata.get('duration', 30)  # Default 30 seconds
            
            # Simulated video metrics (in production, extract from actual video)
            features.update({
                'video_duration': duration,
                'estimated_fps': 30,
                'estimated_resolution': '1080p',
                'has_audio': True,
                'brightness_score': np.random.uniform(0.3, 0.9),  # Simulated
                'contrast_score': np.random.uniform(0.4, 0.8),   # Simulated
                'sharpness_score': np.random.uniform(0.5, 0.9),  # Simulated
                'color_variety': np.random.uniform(0.4, 0.9),    # Simulated
                'motion_score': np.random.uniform(0.2, 0.8),     # Simulated
                'scene_changes': max(1, int(duration / 5)),      # Estimate scene changes
                'face_detection_confidence': np.random.uniform(0.6, 0.95) if np.random.random() > 0.3 else 0,
                'object_count': np.random.randint(1, 10),        # Simulated
                'text_overlay_detected': np.random.random() > 0.6
            })
            
            # Quality indicators based on duration and other factors
            if duration < 5:
                features['duration_category'] = 'very_short'
            elif duration < 15:
                features['duration_category'] = 'short'
            elif duration < 60:
                features['duration_category'] = 'medium'
            else:
                features['duration_category'] = 'long'
                
        except Exception as e:
            print(f"Error analyzing video: {str(e)}")
            features['video_analysis_error'] = str(e)
            
        return features
    
    def _extract_image_features(self, image_url: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Extract features from image content."""
        features = {}
        
        try:
            # Simulated image analysis (in production, analyze actual image)
            features.update({
                'estimated_width': np.random.randint(720, 1920),
                'estimated_height': np.random.randint(720, 1920),
                'aspect_ratio': round(np.random.uniform(0.8, 1.8), 2),
                'brightness': np.random.uniform(0.2, 0.9),
                'contrast': np.random.uniform(0.3, 0.8),
                'saturation': np.random.uniform(0.4, 0.9),
                'sharpness': np.random.uniform(0.5, 0.95),
                'has_faces': np.random.random() > 0.4,
                'face_count': np.random.randint(0, 5) if np.random.random() > 0.4 else 0,
                'dominant_colors': ['red', 'blue', 'green'][np.random.randint(0, 3)],
                'color_diversity': np.random.uniform(0.3, 0.9),
                'has_text': np.random.random() > 0.5,
                'composition_score': np.random.uniform(0.4, 0.9)
            })
            
        except Exception as e:
            print(f"Error analyzing image: {str(e)}")
            features['image_analysis_error'] = str(e)
            
        return features
    
    def _extract_text_features(self, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Extract features from text content."""
        features = {}
        
        try:
            title = metadata.get('title', '')
            description = metadata.get('description', '')
            full_text = f"{title} {description}".strip()
            
            if full_text:
                features.update({
                    'total_word_count': len(full_text.split()),
                    'total_char_count': len(full_text),
                    'sentence_count': len([s for s in full_text.split('.') if s.strip()]),
                    'avg_word_length': sum(len(word) for word in full_text.split()) / max(len(full_text.split()), 1),
                    'capitalization_ratio': sum(1 for c in full_text if c.isupper()) / max(len(full_text), 1),
                    'punctuation_ratio': sum(1 for c in full_text if c in '.,!?;:') / max(len(full_text), 1),
                    'emoji_count': sum(1 for c in full_text if ord(c) > 127),
                    'readability_score': np.random.uniform(0.3, 0.9),  # Simulated readability
                    'sentiment_score': np.random.uniform(-0.5, 0.8),   # Simulated sentiment
                    'toxicity_score': np.random.uniform(0.0, 0.3)      # Simulated toxicity
                })
                
        except Exception as e:
            print(f"Error analyzing text: {str(e)}")
            features['text_analysis_error'] = str(e)
            
        return features
    
    def _extract_semantic_features(self, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract semantic features using AI analysis."""
        features = {}
        
        try:
            if not self.openai_client.api_key:
                print("OpenAI API key not configured, skipping semantic analysis")
                return features
                
            metadata = content_data.get('metadata', {})
            title = metadata.get('title', '')
            description = metadata.get('description', '')
            content_type = content_data.get('content_type', 'video')
            
            # Prepare prompt for AI analysis
            prompt = self._create_analysis_prompt(title, description, content_type)
            
            # Call OpenAI API
            response = self.openai_client.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert content analyst. Analyze the provided content and return structured insights in JSON format."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=self.max_tokens,
                temperature=0.1
            )
            
            # Parse AI response
            ai_analysis = response.choices[0].message.content
            
            try:
                # Try to parse as JSON
                semantic_data = json.loads(ai_analysis)
                features.update({
                    'ai_category': semantic_data.get('category', 'general'),
                    'ai_educational_value': semantic_data.get('educational_value', 0.5),
                    'ai_entertainment_value': semantic_data.get('entertainment_value', 0.5),
                    'ai_originality': semantic_data.get('originality', 0.5),
                    'ai_production_quality': semantic_data.get('production_quality', 0.5),
                    'ai_engagement_potential': semantic_data.get('engagement_potential', 0.5),
                    'ai_safety_score': semantic_data.get('safety_score', 0.8),
                    'ai_topic_relevance': semantic_data.get('topic_relevance', 0.5),
                    'ai_content_depth': semantic_data.get('content_depth', 0.5)
                })
            except json.JSONDecodeError:
                # If not valid JSON, extract insights from text
                features.update({
                    'ai_analysis_raw': ai_analysis[:500],  # First 500 chars
                    'ai_educational_value': 0.5,  # Default values
                    'ai_entertainment_value': 0.5,
                    'ai_originality': 0.5
                })
                
        except Exception as e:
            print(f"Error in semantic analysis: {str(e)}")
            features['semantic_analysis_error'] = str(e)
            
        return features
    
    def _create_analysis_prompt(self, title: str, description: str, content_type: str) -> str:
        """Create a prompt for AI content analysis."""
        return f"""
            Analyze the following {content_type} content and provide insights in JSON format:

            Title: {title}
            Description: {description}

            Please analyze and return a JSON object with the following fields (values should be between 0.0 and 1.0):
            - category: Main content category (e.g., "education", "entertainment", "lifestyle", "technology")
            - educational_value: How educational/informative the content is
            - entertainment_value: How entertaining/engaging the content is
            - originality: How original/unique the content appears to be
            - production_quality: Estimated production quality based on title/description
            - engagement_potential: Likelihood to generate engagement
            - safety_score: Content safety (higher = safer)
            - topic_relevance: How well the title/description match the implied content
            - content_depth: Depth and substance of the content

            Respond only with valid JSON.
            """
    
    def _generate_cache_key(self, content_data: Dict[str, Any]) -> str:
        """Generate a cache key for content analysis results."""
        # Create a hash based on content data
        content_str = json.dumps(content_data, sort_keys=True)
        return hashlib.md5(content_str.encode()).hexdigest()
    
    def get_status(self) -> Dict[str, Any]:
        """Get the status of the content analyzer."""
        return {
            'service': 'ContentAnalyzer',
            'status': 'operational',
            'openai_configured': bool(self.openai_client.api_key),
            'model': self.model,
            'cache_size': len(self.analysis_cache),
            'supported_formats': {
                'video': self.supported_video_formats,
                'image': self.supported_image_formats
            }
        }
    
    def clear_cache(self):
        """Clear the analysis cache."""
        self.analysis_cache.clear()
        
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        return {
            'cache_size': len(self.analysis_cache),
            'cache_keys': list(self.analysis_cache.keys())[:10]  # First 10 keys
        }
