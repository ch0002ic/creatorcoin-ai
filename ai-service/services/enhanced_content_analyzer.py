"""
Advanced AI Content Analysis with Multiple Model Support
Sophisticated algorithms for content quality assessment and fraud detection
"""

import os
import json
import logging
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime
import numpy as np
from dataclasses import dataclass, asdict
import hashlib
import re

# Optional OpenAI import with fallback
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ContentAnalysisResult:
    quality_score: float
    engagement_prediction: float
    safety_rating: float
    educational_value: float
    creativity_score: float
    monetization_potential: float
    confidence: float
    analysis_method: str
    breakdown: Dict[str, float]
    recommendations: List[str]
    processing_time: float

class EnhancedContentAnalyzer:
    """
    Multi-modal content analyzer with OpenAI integration and sophisticated fallback algorithms
    """
    
    def __init__(self):
        self.openai_client = self._initialize_openai()
        self.local_models = self._initialize_local_models()
        self.analysis_cache = {}
        
    def _initialize_openai(self) -> Optional[Any]:
        """Initialize OpenAI client if API key is available"""
        if OPENAI_AVAILABLE and os.getenv('OPENAI_API_KEY'):
            try:
                client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
                logger.info("OpenAI client initialized successfully")
                return client
            except Exception as e:
                logger.warning(f"Failed to initialize OpenAI client: {e}")
                return None
        else:
            logger.info("OpenAI not available, using local algorithms")
            return None
    
    def _initialize_local_models(self) -> Dict[str, Any]:
        """Initialize local ML models and algorithms"""
        return {
            'sentiment_keywords': {
                'positive': ['amazing', 'love', 'great', 'awesome', 'fantastic', 'incredible', 'wonderful'],
                'negative': ['hate', 'terrible', 'awful', 'bad', 'horrible', 'disgusting', 'worst'],
                'educational': ['learn', 'tutorial', 'how to', 'guide', 'explanation', 'science', 'history'],
                'creative': ['art', 'music', 'dance', 'creative', 'original', 'unique', 'innovative']
            },
            'quality_indicators': {
                'high_quality': ['detailed', 'comprehensive', 'accurate', 'well-explained', 'professional'],
                'low_quality': ['clickbait', 'misleading', 'fake', 'spam', 'repetitive', 'low-effort']
            },
            'engagement_patterns': {
                'viral_potential': ['trending', 'challenge', 'reaction', 'funny', 'shocking', 'relatable'],
                'retention_signals': ['part', 'series', 'continuation', 'follow-up', 'episode']
            }
        }
    
    async def analyze_content_comprehensive(self, content_data: Dict[str, Any]) -> ContentAnalysisResult:
        """
        Comprehensive content analysis using multiple approaches
        """
        start_time = datetime.now()
        
        # Extract content information
        title = content_data.get('title', '')
        description = content_data.get('description', '')
        tags = content_data.get('tags', [])
        duration = content_data.get('duration', 0)
        file_size = content_data.get('file_size', 0)
        metadata = content_data.get('metadata', {})
        
        # Try OpenAI analysis first, fallback to local algorithms
        if self.openai_client:
            try:
                result = await self._analyze_with_openai(content_data)
                result.analysis_method = "OpenAI GPT-4"
                logger.info("Content analyzed using OpenAI")
            except Exception as e:
                logger.warning(f"OpenAI analysis failed: {e}, falling back to local analysis")
                result = await self._analyze_with_local_algorithms(content_data)
        else:
            result = await self._analyze_with_local_algorithms(content_data)
        
        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds()
        result.processing_time = processing_time
        
        return result
    
    async def _analyze_with_openai(self, content_data: Dict[str, Any]) -> ContentAnalysisResult:
        """Analyze content using OpenAI GPT-4"""
        
        # Prepare content for analysis
        content_text = f"""
        Title: {content_data.get('title', '')}
        Description: {content_data.get('description', '')}
        Tags: {', '.join(content_data.get('tags', []))}
        Duration: {content_data.get('duration', 0)} seconds
        Category: {content_data.get('category', 'unknown')}
        """
        
        # Create sophisticated prompt for content analysis
        prompt = f"""
        Analyze the following social media content for quality assessment:

        {content_text}

        Please provide a comprehensive analysis with scores (0-100) for:
        1. Overall Quality Score
        2. Engagement Prediction 
        3. Safety Rating (content appropriateness)
        4. Educational Value
        5. Creativity Score
        6. Monetization Potential

        Also provide:
        - Confidence level (0-1)
        - Specific recommendations for improvement
        - Brief explanation of scoring rationale

        Return the analysis in JSON format with exact field names matching the request.
        """
        
        try:
            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert content quality analyst for social media platforms. Provide precise, actionable analysis."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=1000
            )
            
            # Parse OpenAI response
            analysis_text = response.choices[0].message.content
            
            # Extract JSON from response (simplified parsing)
            analysis_data = self._parse_openai_response(analysis_text)
            
            return ContentAnalysisResult(
                quality_score=analysis_data.get('quality_score', 85),
                engagement_prediction=analysis_data.get('engagement_prediction', 75),
                safety_rating=analysis_data.get('safety_rating', 95),
                educational_value=analysis_data.get('educational_value', 70),
                creativity_score=analysis_data.get('creativity_score', 80),
                monetization_potential=analysis_data.get('monetization_potential', 72),
                confidence=analysis_data.get('confidence', 0.85),
                analysis_method="OpenAI GPT-4",
                breakdown=analysis_data.get('breakdown', {}),
                recommendations=analysis_data.get('recommendations', []),
                processing_time=0.0
            )
            
        except Exception as e:
            logger.error(f"OpenAI analysis error: {e}")
            raise e
    
    def _parse_openai_response(self, response_text: str) -> Dict[str, Any]:
        """Parse OpenAI response to extract analysis data"""
        try:
            # Try to extract JSON from response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except:
            pass
        
        # Fallback parsing using regex patterns
        scores = {}
        
        # Extract numerical scores
        patterns = {
            'quality_score': r'quality.*?(\d+)',
            'engagement_prediction': r'engagement.*?(\d+)',
            'safety_rating': r'safety.*?(\d+)',
            'educational_value': r'educational.*?(\d+)',
            'creativity_score': r'creativity.*?(\d+)',
            'monetization_potential': r'monetization.*?(\d+)'
        }
        
        for key, pattern in patterns.items():
            match = re.search(pattern, response_text, re.IGNORECASE)
            scores[key] = int(match.group(1)) if match else 75
        
        # Extract confidence
        conf_match = re.search(r'confidence.*?(\d*\.?\d+)', response_text, re.IGNORECASE)
        confidence = float(conf_match.group(1)) if conf_match else 0.8
        if confidence > 1:
            confidence = confidence / 100
        
        # Extract recommendations
        recommendations = []
        rec_section = re.search(r'recommend.*?:(.*?)(?:\n\n|\Z)', response_text, re.IGNORECASE | re.DOTALL)
        if rec_section:
            rec_text = rec_section.group(1)
            recommendations = [r.strip() for r in re.split(r'[•\-\*]', rec_text) if r.strip()]
        
        return {
            **scores,
            'confidence': confidence,
            'recommendations': recommendations[:5],  # Limit to 5 recommendations
            'breakdown': scores
        }
    
    async def _analyze_with_local_algorithms(self, content_data: Dict[str, Any]) -> ContentAnalysisResult:
        """
        Sophisticated local analysis using advanced algorithms
        """
        
        title = content_data.get('title', '').lower()
        description = content_data.get('description', '').lower()
        tags = [tag.lower() for tag in content_data.get('tags', [])]
        duration = content_data.get('duration', 0)
        
        # Combine all text for analysis
        full_text = f"{title} {description} {' '.join(tags)}"
        
        # Calculate various quality metrics
        quality_score = self._calculate_quality_score(full_text, duration)
        engagement_prediction = self._predict_engagement(full_text, tags, duration)
        safety_rating = self._calculate_safety_rating(full_text)
        educational_value = self._calculate_educational_value(full_text, title)
        creativity_score = self._calculate_creativity_score(full_text, tags)
        monetization_potential = self._calculate_monetization_potential(
            quality_score, engagement_prediction, duration
        )
        
        # Calculate overall confidence based on text length and completeness
        confidence = self._calculate_confidence(content_data)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            quality_score, engagement_prediction, educational_value, creativity_score
        )
        
        # Create breakdown
        breakdown = {
            'content_length': min(len(full_text) / 10, 100),
            'keyword_relevance': self._calculate_keyword_relevance(full_text),
            'title_quality': self._assess_title_quality(title),
            'description_quality': self._assess_description_quality(description),
            'duration_optimization': self._assess_duration(duration)
        }
        
        return ContentAnalysisResult(
            quality_score=quality_score,
            engagement_prediction=engagement_prediction,
            safety_rating=safety_rating,
            educational_value=educational_value,
            creativity_score=creativity_score,
            monetization_potential=monetization_potential,
            confidence=confidence,
            analysis_method="Advanced Local Algorithms",
            breakdown=breakdown,
            recommendations=recommendations,
            processing_time=0.0
        )
    
    def _calculate_quality_score(self, text: str, duration: int) -> float:
        """Calculate content quality score using multiple factors"""
        score = 50  # Base score
        
        # Text quality factors
        if len(text) > 100:
            score += 10
        if len(text) > 300:
            score += 10
        
        # Check for quality indicators
        high_quality_count = sum(1 for word in self.local_models['quality_indicators']['high_quality'] 
                                if word in text)
        low_quality_count = sum(1 for word in self.local_models['quality_indicators']['low_quality'] 
                               if word in text)
        
        score += high_quality_count * 5
        score -= low_quality_count * 10
        
        # Duration optimization
        if 15 <= duration <= 60:  # Optimal duration for social media
            score += 15
        elif duration > 0:
            score += 5
        
        # Grammar and structure (simplified)
        sentences = text.split('.')
        if len(sentences) > 2:
            score += 10
        
        return min(max(score, 0), 100)
    
    def _predict_engagement(self, text: str, tags: List[str], duration: int) -> float:
        """Predict engagement potential"""
        score = 40  # Base engagement score
        
        # Viral potential keywords
        viral_words = sum(1 for word in self.local_models['engagement_patterns']['viral_potential'] 
                         if word in text)
        score += viral_words * 8
        
        # Trending tags boost
        trending_tags = ['ai', 'tech', 'tutorial', 'challenge', 'viral', 'trending']
        trending_count = sum(1 for tag in tags if tag in trending_tags)
        score += trending_count * 10
        
        # Optimal duration for engagement
        if 15 <= duration <= 30:
            score += 20
        elif 30 < duration <= 60:
            score += 10
        
        # Text engagement factors
        question_marks = text.count('?')
        exclamation_marks = text.count('!')
        score += min(question_marks * 3, 15)
        score += min(exclamation_marks * 2, 10)
        
        return min(max(score, 0), 100)
    
    def _calculate_safety_rating(self, text: str) -> float:
        """Calculate content safety rating"""
        score = 100  # Start with perfect safety
        
        # Check for problematic content (simplified)
        unsafe_keywords = ['violence', 'drugs', 'inappropriate', 'dangerous', 'illegal']
        unsafe_count = sum(1 for word in unsafe_keywords if word in text)
        score -= unsafe_count * 20
        
        # Positive safety indicators
        safe_keywords = ['educational', 'family-friendly', 'positive', 'inspiring']
        safe_count = sum(1 for word in safe_keywords if word in text)
        score += min(safe_count * 5, 15)
        
        return min(max(score, 0), 100)
    
    def _calculate_educational_value(self, text: str, title: str) -> float:
        """Calculate educational value"""
        score = 20  # Base educational score
        
        # Educational keywords
        edu_words = sum(1 for word in self.local_models['sentiment_keywords']['educational'] 
                       if word in text)
        score += edu_words * 12
        
        # How-to content gets bonus
        if 'how to' in title or 'tutorial' in title:
            score += 25
        
        # Step-by-step content
        if 'step' in text or 'steps' in text:
            score += 15
        
        # Explanation quality
        explanation_words = ['explain', 'because', 'reason', 'why', 'how']
        explanation_count = sum(1 for word in explanation_words if word in text)
        score += min(explanation_count * 5, 20)
        
        return min(max(score, 0), 100)
    
    def _calculate_creativity_score(self, text: str, tags: List[str]) -> float:
        """Calculate creativity score"""
        score = 30  # Base creativity score
        
        # Creative keywords
        creative_words = sum(1 for word in self.local_models['sentiment_keywords']['creative'] 
                            if word in text)
        score += creative_words * 10
        
        # Unique content indicators
        unique_words = ['original', 'new', 'first', 'unique', 'never', 'breakthrough']
        unique_count = sum(1 for word in unique_words if word in text)
        score += unique_count * 8
        
        # Creative tags
        creative_tags = ['art', 'music', 'dance', 'creative', 'diy', 'original']
        creative_tag_count = sum(1 for tag in tags if tag in creative_tags)
        score += creative_tag_count * 12
        
        # Text complexity as creativity indicator
        unique_word_count = len(set(text.split()))
        total_word_count = len(text.split())
        if total_word_count > 0:
            vocabulary_richness = unique_word_count / total_word_count
            score += vocabulary_richness * 30
        
        return min(max(score, 0), 100)
    
    def _calculate_monetization_potential(self, quality: float, engagement: float, duration: int) -> float:
        """Calculate monetization potential"""
        # Base calculation from quality and engagement
        base_score = (quality * 0.4 + engagement * 0.6)
        
        # Duration factor for ad placement
        duration_factor = 1.0
        if duration >= 30:  # Better for mid-roll ads
            duration_factor = 1.2
        elif duration >= 15:  # Good for pre-roll
            duration_factor = 1.1
        
        # Apply duration factor
        score = base_score * duration_factor
        
        return min(max(score, 0), 100)
    
    def _calculate_confidence(self, content_data: Dict[str, Any]) -> float:
        """Calculate analysis confidence based on available data"""
        confidence = 0.5  # Base confidence
        
        # More data = higher confidence
        if content_data.get('title'):
            confidence += 0.15
        if content_data.get('description'):
            confidence += 0.15
        if content_data.get('tags'):
            confidence += 0.1
        if content_data.get('duration', 0) > 0:
            confidence += 0.1
        
        return min(confidence, 1.0)
    
    def _generate_recommendations(self, quality: float, engagement: float, 
                                educational: float, creativity: float) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        if quality < 70:
            recommendations.append("Improve content structure and add more detailed information")
        
        if engagement < 60:
            recommendations.append("Add more engaging elements like questions or trending topics")
        
        if educational < 50:
            recommendations.append("Include educational elements or step-by-step guidance")
        
        if creativity < 60:
            recommendations.append("Try unique approaches or original content ideas")
        
        # Always provide positive recommendations
        recommendations.append("Consider optimizing video duration for maximum engagement")
        recommendations.append("Use relevant trending hashtags to improve discoverability")
        
        return recommendations[:5]  # Limit to 5 recommendations
    
    def _calculate_keyword_relevance(self, text: str) -> float:
        """Calculate keyword relevance score"""
        words = text.split()
        if not words:
            return 0
        
        # Count relevant keywords across all categories
        relevant_count = 0
        for category in self.local_models['sentiment_keywords'].values():
            relevant_count += sum(1 for word in words if word in category)
        
        return min((relevant_count / len(words)) * 100, 100)
    
    def _assess_title_quality(self, title: str) -> float:
        """Assess title quality"""
        if not title:
            return 0
        
        score = 50
        
        # Optimal length
        if 5 <= len(title.split()) <= 10:
            score += 20
        
        # Capitalization
        if title[0].isupper():
            score += 10
        
        # Contains numbers (often engaging)
        if any(char.isdigit() for char in title):
            score += 10
        
        # Question or exclamation
        if '?' in title or '!' in title:
            score += 10
        
        return min(score, 100)
    
    def _assess_description_quality(self, description: str) -> float:
        """Assess description quality"""
        if not description:
            return 0
        
        score = 40
        
        # Length assessment
        word_count = len(description.split())
        if 20 <= word_count <= 100:
            score += 30
        elif word_count > 10:
            score += 20
        
        # Structure
        if '.' in description:
            score += 15
        
        # Call to action
        cta_words = ['subscribe', 'like', 'follow', 'comment', 'share']
        if any(word in description.lower() for word in cta_words):
            score += 15
        
        return min(score, 100)
    
    def _assess_duration(self, duration: int) -> float:
        """Assess video duration optimization"""
        if duration <= 0:
            return 0
        
        # Optimal durations for different platforms
        if 15 <= duration <= 30:  # Sweet spot for most platforms
            return 100
        elif 30 < duration <= 60:  # Still very good
            return 85
        elif 60 < duration <= 120:  # Acceptable for detailed content
            return 70
        elif duration < 15:  # Too short
            return 50
        else:  # Too long for social media
            return 30

# Global analyzer instance
content_analyzer = EnhancedContentAnalyzer()
