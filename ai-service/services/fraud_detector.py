import logging
import numpy as np
from typing import Dict, List, Any, Optional
import hashlib
import time
from datetime import datetime, timedelta
import json

class FraudDetector:
    """Advanced fraud detection system for content and user behavior analysis"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.content_hashes = set()
        self.user_behavior_patterns = {}
        self.known_fraudulent_patterns = []
        
        # Enhanced fraud detection thresholds
        self.SIMILARITY_THRESHOLD = 0.85
        self.UPLOAD_RATE_LIMIT = 10  # max uploads per hour
        self.QUALITY_DROP_THRESHOLD = 0.3
        self.ENGAGEMENT_ANOMALY_THRESHOLD = 5.0  # Standard deviations
        self.AI_CONTENT_CONFIDENCE_THRESHOLD = 0.8
        
        # Machine learning model placeholders (in production, load trained models)
        self.content_similarity_model = None
        self.behavior_analysis_model = None
        self.engagement_prediction_model = None
        
    def detect_content_fraud(self, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Comprehensive content fraud detection with advanced AI analysis
        
        Args:
            content_data: Dictionary containing content information and features
            
        Returns:
            Dictionary with detailed fraud detection results
        """
        try:
            fraud_indicators = []
            confidence_score = 0.0
            risk_level = 'low'
            
            content_id = content_data.get('content_id', '')
            creator_id = content_data.get('creator_id', '')
            metadata = content_data.get('metadata', {})
            
            # 1. Duplicate content detection
            duplicate_score = self._check_duplicate_content(content_data)
            if duplicate_score > self.SIMILARITY_THRESHOLD:
                fraud_indicators.append({
                    'type': 'duplicate_content',
                    'score': round(duplicate_score, 3),
                    'description': f'Content appears to be {duplicate_score:.1%} similar to existing content',
                    'severity': 'high' if duplicate_score > 0.95 else 'medium'
                })
                confidence_score += 0.4
                
            # 2. AI-generated content detection
            ai_detection_score = self._detect_undisclosed_ai_content(content_data)
            if ai_detection_score > self.AI_CONTENT_CONFIDENCE_THRESHOLD:
                fraud_indicators.append({
                    'type': 'undisclosed_ai_content',
                    'score': round(ai_detection_score, 3),
                    'description': f'Content likely AI-generated ({ai_detection_score:.1%} confidence) without proper disclosure',
                    'severity': 'medium'
                })
                confidence_score += 0.25
                
            # 3. Engagement manipulation detection
            engagement_fraud = self._detect_engagement_fraud(content_data)
            if engagement_fraud['detected']:
                fraud_indicators.append({
                    'type': 'engagement_manipulation',
                    'score': engagement_fraud['confidence'],
                    'description': engagement_fraud['description'],
                    'severity': 'high' if engagement_fraud['confidence'] > 0.8 else 'medium',
                    'details': engagement_fraud['details']
                })
                confidence_score += 0.5
                
            # 4. Creator behavior analysis
            behavior_fraud = self._analyze_creator_behavior(creator_id, content_data)
            if behavior_fraud['suspicious']:
                fraud_indicators.append({
                    'type': 'suspicious_behavior',
                    'score': behavior_fraud['score'],
                    'description': behavior_fraud['description'],
                    'severity': behavior_fraud['severity'],
                    'patterns': behavior_fraud['patterns']
                })
                confidence_score += 0.3
                
            # 5. Content quality consistency analysis
            quality_fraud = self._detect_quality_inconsistency(creator_id, content_data)
            if quality_fraud['detected']:
                fraud_indicators.append({
                    'type': 'quality_inconsistency',
                    'score': quality_fraud['score'],
                    'description': quality_fraud['description'],
                    'severity': 'medium'
                })
                confidence_score += 0.2
                
            # 6. Metadata manipulation detection
            metadata_fraud = self._detect_metadata_manipulation(metadata)
            if metadata_fraud['detected']:
                fraud_indicators.append({
                    'type': 'metadata_manipulation',
                    'score': metadata_fraud['score'],
                    'description': metadata_fraud['description'],
                    'severity': 'low'
                })
                confidence_score += 0.1
            
            # Determine overall risk level
            if confidence_score > 0.7:
                risk_level = 'high'
            elif confidence_score > 0.4:
                risk_level = 'medium'
            else:
                risk_level = 'low'
            
            # Calculate final fraud probability
            fraud_probability = min(1.0, confidence_score)
            
            # Generate recommendations
            recommendations = self._generate_fraud_recommendations(fraud_indicators, risk_level)
            
            # Log detection results
            self.logger.info(f"Fraud detection completed for {content_id}: {risk_level} risk, {len(fraud_indicators)} indicators")
            
            return {
                'content_id': content_id,
                'timestamp': datetime.now().isoformat(),
                'fraud_detected': len(fraud_indicators) > 0,
                'fraud_probability': round(fraud_probability, 3),
                'risk_level': risk_level,
                'confidence_score': round(confidence_score, 3),
                'fraud_indicators': fraud_indicators,
                'recommendations': recommendations,
                'analysis_details': {
                    'duplicate_check': duplicate_score,
                    'ai_content_check': ai_detection_score,
                    'engagement_analysis': engagement_fraud,
                    'behavior_analysis': behavior_fraud,
                    'quality_analysis': quality_fraud,
                    'metadata_analysis': metadata_fraud
                }
            }
            
        except Exception as e:
            self.logger.error(f"Fraud detection failed for {content_data.get('content_id', 'unknown')}: {str(e)}")
            return self._get_fallback_fraud_result(content_data)
    
    def _detect_engagement_fraud(self, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """Detect artificial engagement manipulation"""
        try:
            engagement_data = content_data.get('engagement', {})
            views = engagement_data.get('views', 0)
            likes = engagement_data.get('likes', 0)
            comments = engagement_data.get('comments', 0)
            shares = engagement_data.get('shares', 0)
            
            # Calculate engagement ratios
            if views > 0:
                like_ratio = likes / views
                comment_ratio = comments / views
                share_ratio = shares / views
            else:
                like_ratio = comment_ratio = share_ratio = 0
            
            # Detect anomalous engagement patterns
            anomalies = []
            confidence = 0.0
            
            # Unusually high engagement ratios
            if like_ratio > 0.3:  # More than 30% like rate is suspicious
                anomalies.append('high_like_ratio')
                confidence += 0.4
                
            if comment_ratio > 0.1:  # More than 10% comment rate is unusual
                anomalies.append('high_comment_ratio')
                confidence += 0.3
                
            # Engagement velocity analysis (simulated)
            velocity_score = np.random.uniform(0.0, 1.0)
            if velocity_score > 0.8:
                anomalies.append('artificial_velocity')
                confidence += 0.5
                
            return {
                'detected': confidence > 0.5,
                'confidence': round(confidence, 3),
                'description': f'Suspicious engagement patterns detected: {", ".join(anomalies)}' if anomalies else 'Normal engagement patterns',
                'details': {
                    'like_ratio': round(like_ratio, 4),
                    'comment_ratio': round(comment_ratio, 4),
                    'share_ratio': round(share_ratio, 4),
                    'anomalies': anomalies
                }
            }
        except Exception as e:
            self.logger.error(f"Engagement fraud detection failed: {e}")
            return {'detected': False, 'confidence': 0.0, 'description': 'Analysis failed'}
    
    def _analyze_creator_behavior(self, creator_id: str, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze creator behavior patterns for fraud indicators"""
        try:
            # Get creator's historical data (simulated)
            creator_history = self.user_behavior_patterns.get(creator_id, {
                'upload_frequency': [],
                'quality_scores': [],
                'engagement_patterns': [],
                'content_types': []
            })
            
            suspicious_patterns = []
            score = 0.0
            
            # Check upload frequency patterns
            current_time = time.time()
            recent_uploads = [t for t in creator_history.get('upload_frequency', []) 
                            if current_time - t < 3600]  # Last hour
            
            if len(recent_uploads) > 10:  # More than 10 uploads in an hour
                suspicious_patterns.append('excessive_upload_rate')
                score += 0.4
                
            # Check quality consistency
            quality_scores = creator_history.get('quality_scores', [])
            if len(quality_scores) > 5:
                quality_variance = np.var(quality_scores)
                if quality_variance > 0.3:  # High variance in quality
                    suspicious_patterns.append('inconsistent_quality')
                    score += 0.2
                    
            # Add current content data
            creator_history['upload_frequency'].append(current_time)
            current_quality = content_data.get('quality_score', 0.5)
            creator_history['quality_scores'].append(current_quality)
            
            # Keep only recent data
            cutoff_time = current_time - 86400 * 7  # Last 7 days
            creator_history['upload_frequency'] = [t for t in creator_history['upload_frequency'] if t > cutoff_time]
            creator_history['quality_scores'] = creator_history['quality_scores'][-20:]  # Keep last 20
            
            self.user_behavior_patterns[creator_id] = creator_history
            
            severity = 'high' if score > 0.6 else 'medium' if score > 0.3 else 'low'
            
            return {
                'suspicious': score > 0.3,
                'score': round(score, 3),
                'description': f'Creator behavior analysis: {", ".join(suspicious_patterns)}' if suspicious_patterns else 'Normal behavior patterns',
                'severity': severity,
                'patterns': suspicious_patterns
            }
        except Exception as e:
            self.logger.error(f"Creator behavior analysis failed: {e}")
            return {'suspicious': False, 'score': 0.0, 'description': 'Analysis failed', 'severity': 'low', 'patterns': []}
    
    def _detect_quality_inconsistency(self, creator_id: str, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """Detect sudden quality changes that might indicate fraud"""
        try:
            creator_history = self.user_behavior_patterns.get(creator_id, {})
            quality_scores = creator_history.get('quality_scores', [])
            current_quality = content_data.get('quality_score', 0.5)
            
            if len(quality_scores) < 3:  # Need historical data
                return {'detected': False, 'score': 0.0, 'description': 'Insufficient historical data'}
                
            avg_quality = np.mean(quality_scores[-5:])  # Average of last 5
            quality_drop = avg_quality - current_quality
            
            if quality_drop > self.QUALITY_DROP_THRESHOLD:
                return {
                    'detected': True,
                    'score': round(quality_drop, 3),
                    'description': f'Significant quality drop detected: {quality_drop:.2f} points below recent average'
                }
                
            return {'detected': False, 'score': 0.0, 'description': 'Quality consistent with historical pattern'}
            
        except Exception as e:
            self.logger.error(f"Quality inconsistency detection failed: {e}")
            return {'detected': False, 'score': 0.0, 'description': 'Analysis failed'}
    
    def _detect_metadata_manipulation(self, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Detect metadata manipulation"""
        try:
            manipulation_score = 0.0
            issues = []
            
            # Check timestamp consistency
            creation_time = metadata.get('creation_time')
            upload_time = metadata.get('upload_time')
            
            if creation_time and upload_time:
                time_diff = abs(upload_time - creation_time)
                if time_diff > 86400 * 30:  # More than 30 days
                    issues.append('timestamp_inconsistency')
                    manipulation_score += 0.3
                    
            # Check for suspicious edit patterns
            edit_count = metadata.get('edit_count', 0)
            if edit_count > 20:
                issues.append('excessive_edits')
                manipulation_score += 0.2
                
            # Check metadata completeness
            required_fields = ['title', 'description', 'duration']
            missing_fields = [field for field in required_fields if not metadata.get(field)]
            if len(missing_fields) > 1:
                issues.append('incomplete_metadata')
                manipulation_score += 0.1
                
            return {
                'detected': manipulation_score > 0.2,
                'score': round(manipulation_score, 3),
                'description': f'Metadata issues: {", ".join(issues)}' if issues else 'Metadata appears normal',
                'issues': issues
            }
        except Exception as e:
            self.logger.error(f"Metadata analysis failed: {e}")
            return {'detected': False, 'score': 0.0, 'description': 'Analysis failed', 'issues': []}
    
    def _generate_fraud_recommendations(self, fraud_indicators: List[Dict], risk_level: str) -> List[str]:
        """Generate actionable fraud prevention recommendations"""
        recommendations = []
        
        if risk_level == 'high':
            recommendations.append('Suspend content pending manual review')
            recommendations.append('Flag creator account for investigation')
            recommendations.append('Implement additional verification requirements')
            
        elif risk_level == 'medium':
            recommendations.append('Require manual review before monetization')
            recommendations.append('Implement enhanced monitoring')
            recommendations.append('Request additional creator verification')
            
        else:  # low risk
            recommendations.append('Continue standard monitoring')
            recommendations.append('No immediate action required')
            
        # Add specific recommendations based on fraud types
        fraud_types = [indicator['type'] for indicator in fraud_indicators]
        
        if 'duplicate_content' in fraud_types:
            recommendations.append('Implement content fingerprinting')
            recommendations.append('Check against copyright databases')
            
        if 'engagement_manipulation' in fraud_types:
            recommendations.append('Audit engagement patterns')
            recommendations.append('Implement engagement velocity limits')
            
        if 'undisclosed_ai_content' in fraud_types:
            recommendations.append('Require AI content disclosure')
            recommendations.append('Implement AI detection watermarking')
            
        return recommendations
    
    def _get_fallback_fraud_result(self, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """Provide fallback result when fraud detection fails"""
        return {
            'content_id': content_data.get('content_id', ''),
            'timestamp': datetime.now().isoformat(),
            'fraud_detected': False,
            'fraud_probability': 0.5,  # Unknown, assume moderate risk
            'risk_level': 'medium',
            'confidence_score': 0.0,
            'fraud_indicators': [],
            'recommendations': ['Manual review recommended due to analysis failure'],
            'analysis_details': {
                'error': 'Fraud detection analysis failed',
                'fallback_mode': True
            }
        }
    
    def detect_user_fraud(self, user_id: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        User behavior fraud detection
        
        Args:
            user_id: User identifier
            user_data: User behavior and profile data
            
        Returns:
            Dictionary with user fraud detection results
        """
        try:
            fraud_indicators = []
            confidence_score = 0.0
            
            # Check upload rate abuse
            upload_abuse_score = self._check_upload_rate_abuse(user_id, user_data)
            if upload_abuse_score > 0.7:
                fraud_indicators.append({
                    'type': 'upload_rate_abuse',
                    'score': upload_abuse_score,
                    'description': 'Unusually high upload rate detected'
                })
                confidence_score += 0.3
                
            # Check for bot-like behavior
            bot_score = self._detect_bot_behavior(user_data)
            if bot_score > 0.8:
                fraud_indicators.append({
                    'type': 'bot_behavior',
                    'score': bot_score,
                    'description': 'User behavior patterns suggest automated activity'
                })
                confidence_score += 0.4
                
            # Check for fake engagement
            fake_engagement_score = self._detect_fake_engagement(user_data)
            if fake_engagement_score > 0.6:
                fraud_indicators.append({
                    'type': 'fake_engagement',
                    'score': fake_engagement_score,
                    'description': 'Suspicious engagement patterns detected'
                })
                confidence_score += 0.3
                
            # Check account authenticity
            account_authenticity_score = self._check_account_authenticity(user_data)
            if account_authenticity_score < 0.4:
                fraud_indicators.append({
                    'type': 'fake_account',
                    'score': 1.0 - account_authenticity_score,
                    'description': 'Account appears to be fake or compromised'
                })
                confidence_score += 0.4
                
            risk_level = self._calculate_risk_level(confidence_score)
            
            return {
                'is_fraudulent': confidence_score > 0.5,
                'confidence_score': min(confidence_score, 1.0),
                'risk_level': risk_level,
                'fraud_indicators': fraud_indicators,
                'recommended_action': self._get_recommended_action(risk_level),
                'analysis_timestamp': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Error in user fraud detection: {str(e)}")
            return {
                'is_fraudulent': False,
                'confidence_score': 0.0,
                'risk_level': 'unknown',
                'fraud_indicators': [],
                'recommended_action': 'manual_review',
                'error': str(e)
            }
    
    def _check_duplicate_content(self, content_data: Dict[str, Any]) -> float:
        """Check for duplicate or near-duplicate content"""
        try:
            content_hash = self._generate_content_hash(content_data)
            
            # Check exact duplicates
            if content_hash in self.content_hashes:
                return 1.0
                
            # Mock perceptual hashing for near-duplicate detection - hackathon demonstration
            # For now, return a mock similarity score
            similarity_score = np.random.uniform(0.0, 0.3)  # Mock implementation
            
            # Store hash for future comparisons
            self.content_hashes.add(content_hash)
            
            return similarity_score
            
        except Exception as e:
            self.logger.error(f"Error checking duplicate content: {str(e)}")
            return 0.0
    
    def _detect_undisclosed_ai_content(self, content_data: Dict[str, Any]) -> float:
        """Detect AI-generated content that's not properly disclosed"""
        try:
            # Check for AI-related indicators in metadata
            ai_indicators = [
                'generated', 'artificial', 'synthetic', 'ai-created',
                'machine-generated', 'automated', 'algorithmic'
            ]
            
            description = content_data.get('description', '').lower()
            title = content_data.get('title', '').lower()
            tags = [tag.lower() for tag in content_data.get('tags', [])]
            
            # Check if AI disclosure is present
            has_ai_disclosure = any(indicator in description + title + ' '.join(tags) 
                                  for indicator in ai_indicators)
            
            # Mock AI content detection using ML models - hackathon demonstration
            # For now, return a mock score
            ai_content_probability = np.random.uniform(0.1, 0.4)
            
            if ai_content_probability > 0.7 and not has_ai_disclosure:
                return ai_content_probability
            
            return 0.0
            
        except Exception as e:
            self.logger.error(f"Error detecting AI content: {str(e)}")
            return 0.0
    
    def _check_copyright_infringement(self, content_data: Dict[str, Any]) -> float:
        """Check for potential copyright infringement"""
        try:
            # Mock copyright detection using content fingerprinting - hackathon demonstration
            # For now, return a mock score based on content characteristics
            
            # Check for copyrighted music indicators
            audio_features = content_data.get('audio_features', {})
            if audio_features.get('has_music', False):
                music_copyright_score = np.random.uniform(0.0, 0.3)
            else:
                music_copyright_score = 0.0
                
            # Check for copyrighted visual content
            visual_features = content_data.get('visual_features', {})
            if visual_features.get('has_logos', False) or visual_features.get('has_watermarks', False):
                visual_copyright_score = np.random.uniform(0.2, 0.5)
            else:
                visual_copyright_score = 0.0
                
            return max(music_copyright_score, visual_copyright_score)
            
        except Exception as e:
            self.logger.error(f"Error checking copyright: {str(e)}")
            return 0.0
    
    def _check_metadata_manipulation(self, content_data: Dict[str, Any]) -> float:
        """Check for metadata manipulation or tampering"""
        try:
            metadata = content_data.get('metadata', {})
            
            # Check for inconsistencies in timestamps
            creation_time = metadata.get('creation_time')
            upload_time = metadata.get('upload_time')
            
            if creation_time and upload_time:
                time_diff = abs(upload_time - creation_time)
                if time_diff > 86400 * 30:  # More than 30 days difference
                    return 0.6
                    
            # Check for suspicious editing patterns
            edit_count = metadata.get('edit_count', 0)
            if edit_count > 50:  # Unusually high edit count
                return 0.4
                
            return 0.0
            
        except Exception as e:
            self.logger.error(f"Error checking metadata manipulation: {str(e)}")
            return 0.0
    
    def _check_upload_rate_abuse(self, user_id: str, user_data: Dict[str, Any]) -> float:
        """Check for upload rate abuse"""
        try:
            current_time = time.time()
            user_pattern = self.user_behavior_patterns.get(user_id, {
                'uploads': [],
                'last_quality_scores': []
            })
            
            # Remove old uploads (older than 1 hour)
            user_pattern['uploads'] = [
                upload_time for upload_time in user_pattern['uploads']
                if current_time - upload_time < 3600
            ]
            
            # Add current upload
            user_pattern['uploads'].append(current_time)
            
            # Check if rate limit exceeded
            if len(user_pattern['uploads']) > self.UPLOAD_RATE_LIMIT:
                return 0.8
                
            # Update patterns
            self.user_behavior_patterns[user_id] = user_pattern
            
            return 0.0
            
        except Exception as e:
            self.logger.error(f"Error checking upload rate abuse: {str(e)}")
            return 0.0
    
    def _detect_bot_behavior(self, user_data: Dict[str, Any]) -> float:
        """Detect bot-like behavior patterns"""
        try:
            # Check for regular timing patterns
            upload_times = user_data.get('upload_times', [])
            if len(upload_times) > 5:
                intervals = [upload_times[i] - upload_times[i-1] for i in range(1, len(upload_times))]
                interval_variance = np.var(intervals) if intervals else 0
                
                # Very regular intervals suggest bot behavior
                if interval_variance < 100:  # Very low variance
                    return 0.7
                    
            # Check for identical content patterns
            content_similarities = user_data.get('content_similarities', [])
            if content_similarities and np.mean(content_similarities) > 0.9:
                return 0.8
                
            return 0.0
            
        except Exception as e:
            self.logger.error(f"Error detecting bot behavior: {str(e)}")
            return 0.0
    
    def _detect_fake_engagement(self, user_data: Dict[str, Any]) -> float:
        """Detect fake engagement patterns"""
        try:
            engagement_data = user_data.get('engagement', {})
            
            # Check for suspicious engagement ratios
            views = engagement_data.get('total_views', 0)
            likes = engagement_data.get('total_likes', 0)
            comments = engagement_data.get('total_comments', 0)
            
            if views > 0:
                like_ratio = likes / views
                comment_ratio = comments / views
                
                # Unusually high engagement ratios
                if like_ratio > 0.5 or comment_ratio > 0.1:
                    return 0.7
                    
            return 0.0
            
        except Exception as e:
            self.logger.error(f"Error detecting fake engagement: {str(e)}")
            return 0.0
    
    def _check_account_authenticity(self, user_data: Dict[str, Any]) -> float:
        """Check account authenticity"""
        try:
            profile = user_data.get('profile', {})
            
            # Check profile completeness
            completeness_score = 0.0
            if profile.get('avatar'):
                completeness_score += 0.2
            if profile.get('bio'):
                completeness_score += 0.2
            if profile.get('verified_email'):
                completeness_score += 0.3
            if profile.get('social_links'):
                completeness_score += 0.3
                
            # Check account age
            account_age = user_data.get('account_age_days', 0)
            age_score = min(account_age / 30, 1.0)  # Full score after 30 days
            
            return (completeness_score + age_score) / 2
            
        except Exception as e:
            self.logger.error(f"Error checking account authenticity: {str(e)}")
            return 0.5
    
    def _generate_content_hash(self, content_data: Dict[str, Any]) -> str:
        """Generate a hash for content identification"""
        try:
            # Create a simple hash based on content features
            content_string = f"{content_data.get('title', '')}{content_data.get('description', '')}"
            return hashlib.md5(content_string.encode()).hexdigest()
        except Exception:
            return ""
    
    def _calculate_risk_level(self, confidence_score: float) -> str:
        """Calculate risk level based on confidence score"""
        if confidence_score >= 0.8:
            return 'high'
        elif confidence_score >= 0.5:
            return 'medium'
        elif confidence_score >= 0.3:
            return 'low'
        else:
            return 'minimal'
    
    def _get_recommended_action(self, risk_level: str) -> str:
        """Get recommended action based on risk level"""
        actions = {
            'high': 'block_content',
            'medium': 'flag_for_review',
            'low': 'monitor',
            'minimal': 'allow',
            'unknown': 'manual_review'
        }
        return actions.get(risk_level, 'manual_review')
