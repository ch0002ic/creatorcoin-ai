import os
from typing import Dict, Any

class Config:
    """Configuration management for CreatorCoin AI Service"""
    
    # Flask settings
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
    TESTING = os.getenv('TESTING', 'False').lower() == 'true'
    
    # Server settings
    HOST = os.getenv('AI_SERVICE_HOST', '0.0.0.0')
    PORT = int(os.getenv('AI_SERVICE_PORT', '5000'))
    
    # OpenAI settings
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
    OPENAI_MODEL = os.getenv('OPENAI_MODEL', 'gpt-4')
    OPENAI_MAX_TOKENS = int(os.getenv('OPENAI_MAX_TOKENS', '2048'))
    
    # Content analysis settings
    _max_file_size_str = os.getenv('MAX_FILE_SIZE', '100')
    if _max_file_size_str.upper().endswith('MB'):
        MAX_FILE_SIZE = int(_max_file_size_str[:-2]) * 1024 * 1024
    elif _max_file_size_str.upper().endswith('GB'):
        MAX_FILE_SIZE = int(_max_file_size_str[:-2]) * 1024 * 1024 * 1024
    elif _max_file_size_str.upper().endswith('KB'):
        MAX_FILE_SIZE = int(_max_file_size_str[:-2]) * 1024
    else:
        MAX_FILE_SIZE = int(_max_file_size_str) * 1024 * 1024  # Default to MB
    SUPPORTED_VIDEO_FORMATS = ['mp4', 'avi', 'mov', 'mkv', 'webm']
    SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    SUPPORTED_AUDIO_FORMATS = ['mp3', 'wav', 'aac', 'ogg', 'flac']
    
    # Quality scoring weights
    QUALITY_WEIGHTS = {
        'engagement': 0.25,
        'educational': 0.20,
        'creativity': 0.20,
        'safety': 0.20,
        'production': 0.15
    }
    
    # Cache settings
    CACHE_TTL = int(os.getenv('CACHE_TTL', '3600'))  # 1 hour
    CACHE_CLEANUP_INTERVAL = int(os.getenv('CACHE_CLEANUP_INTERVAL', '1800'))  # 30 minutes
    
    # Redis settings (for future use)
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    REDIS_PASSWORD = os.getenv('REDIS_PASSWORD', '')
    
    # Database settings (for future use)
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://localhost:5432/creatorcoin_ai')
    
    # API rate limiting
    RATE_LIMIT_PER_MINUTE = int(os.getenv('RATE_LIMIT_PER_MINUTE', '60'))
    RATE_LIMIT_PER_HOUR = int(os.getenv('RATE_LIMIT_PER_HOUR', '1000'))
    
    # Content moderation thresholds
    MODERATION_THRESHOLDS = {
        'violence': 0.8,
        'adult_content': 0.8,
        'hate_speech': 0.7,
        'spam': 0.6,
        'misinformation': 0.7
    }
    
    # Quality score thresholds
    QUALITY_THRESHOLDS = {
        'excellent': 90,
        'good': 75,
        'average': 60,
        'poor': 40
    }
    
    # Fraud detection settings
    FRAUD_DETECTION_ENABLED = os.getenv('FRAUD_DETECTION_ENABLED', 'True').lower() == 'true'
    FRAUD_CONFIDENCE_THRESHOLD = float(os.getenv('FRAUD_CONFIDENCE_THRESHOLD', '0.7'))
    
    # Logging settings
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'ai_service.log')
    
    # Security settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    API_KEY_HEADER = 'X-API-Key'
    
    # External service URLs
    BACKEND_API_URL = os.getenv('BACKEND_API_URL', 'http://localhost:3001')
    BLOCKCHAIN_SERVICE_URL = os.getenv('BLOCKCHAIN_SERVICE_URL', 'http://localhost:8000')
    
    # Feature flags
    FEATURES = {
        'content_analysis': True,
        'quality_scoring': True,
        'fraud_detection': True,
        'trend_analysis': True,
        'personalization': True,
        'batch_processing': False,
        'real_time_analysis': True
    }
    
    @classmethod
    def get_config(cls) -> Dict[str, Any]:
        """Get all configuration as a dictionary"""
        config = {}
        for attr in dir(cls):
            if not attr.startswith('_') and not callable(getattr(cls, attr)):
                config[attr] = getattr(cls, attr)
        return config
    
    @classmethod
    def validate_config(cls) -> bool:
        """Validate critical configuration settings"""
        errors = []
        
        # Check OpenAI API key
        if not cls.OPENAI_API_KEY:
            errors.append("OPENAI_API_KEY is required")
        
        # Check port is valid
        if not (1 <= cls.PORT <= 65535):
            errors.append(f"Invalid port: {cls.PORT}")
        
        # Check quality weights sum to 1.0
        weight_sum = sum(cls.QUALITY_WEIGHTS.values())
        if abs(weight_sum - 1.0) > 0.01:
            errors.append(f"Quality weights must sum to 1.0, got {weight_sum}")
        
        if errors:
            print("Configuration errors:")
            for error in errors:
                print(f"  - {error}")
            return False
        
        return True

# Create a default config instance
config = Config()

# Validate configuration on import
if not config.validate_config():
    print("Warning: Configuration validation failed. Some features may not work correctly.")
