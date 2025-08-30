import time
import json
import hashlib
from typing import Any, Optional, Dict
from datetime import datetime, timedelta
import logging

class CacheManager:
    """Simple in-memory cache manager for AI service results"""
    
    def __init__(self, default_ttl: int = 3600):
        """
        Initialize cache manager
        
        Args:
            default_ttl: Default time-to-live in seconds (1 hour)
        """
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.default_ttl = default_ttl
        self.logger = logging.getLogger(__name__)
        
    def get(self, key: str) -> Optional[Any]:
        """
        Get value from cache
        
        Args:
            key: Cache key
            
        Returns:
            Cached value or None if not found/expired
        """
        try:
            if key not in self.cache:
                return None
                
            cache_entry = self.cache[key]
            
            # Check if expired
            if time.time() > cache_entry['expires_at']:
                del self.cache[key]
                return None
                
            cache_entry['last_accessed'] = time.time()
            return cache_entry['value']
            
        except Exception as e:
            self.logger.error(f"Error getting cache key {key}: {str(e)}")
            return None
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """
        Set value in cache
        
        Args:
            key: Cache key
            value: Value to cache
            ttl: Time-to-live in seconds (uses default if None)
            
        Returns:
            True if successful, False otherwise
        """
        try:
            if ttl is None:
                ttl = self.default_ttl
                
            self.cache[key] = {
                'value': value,
                'created_at': time.time(),
                'last_accessed': time.time(),
                'expires_at': time.time() + ttl,
                'ttl': ttl
            }
            
            return True
            
        except Exception as e:
            self.logger.error(f"Error setting cache key {key}: {str(e)}")
            return False
    
    def delete(self, key: str) -> bool:
        """
        Delete key from cache
        
        Args:
            key: Cache key to delete
            
        Returns:
            True if key existed and was deleted, False otherwise
        """
        try:
            if key in self.cache:
                del self.cache[key]
                return True
            return False
            
        except Exception as e:
            self.logger.error(f"Error deleting cache key {key}: {str(e)}")
            return False
    
    def clear(self) -> bool:
        """
        Clear all cache entries
        
        Returns:
            True if successful
        """
        try:
            self.cache.clear()
            return True
            
        except Exception as e:
            self.logger.error(f"Error clearing cache: {str(e)}")
            return False
    
    def cleanup_expired(self) -> int:
        """
        Remove expired cache entries
        
        Returns:
            Number of expired entries removed
        """
        try:
            current_time = time.time()
            expired_keys = [
                key for key, entry in self.cache.items()
                if current_time > entry['expires_at']
            ]
            
            for key in expired_keys:
                del self.cache[key]
                
            if expired_keys:
                self.logger.info(f"Cleaned up {len(expired_keys)} expired cache entries")
                
            return len(expired_keys)
            
        except Exception as e:
            self.logger.error(f"Error cleaning up expired cache entries: {str(e)}")
            return 0
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get cache statistics
        
        Returns:
            Dictionary with cache statistics
        """
        try:
            current_time = time.time()
            total_entries = len(self.cache)
            expired_entries = sum(
                1 for entry in self.cache.values()
                if current_time > entry['expires_at']
            )
            
            total_size = sum(
                len(str(entry['value'])) for entry in self.cache.values()
            )
            
            return {
                'total_entries': total_entries,
                'active_entries': total_entries - expired_entries,
                'expired_entries': expired_entries,
                'estimated_size_bytes': total_size,
                'hit_rate': self._calculate_hit_rate(),
                'oldest_entry': self._get_oldest_entry_age(),
                'newest_entry': self._get_newest_entry_age()
            }
            
        except Exception as e:
            self.logger.error(f"Error getting cache stats: {str(e)}")
            return {}
    
    def generate_key(self, *args, **kwargs) -> str:
        """
        Generate a cache key from arguments
        
        Args:
            *args: Positional arguments
            **kwargs: Keyword arguments
            
        Returns:
            SHA-256 hash of the arguments
        """
        try:
            # Create a string representation of all arguments
            key_data = {
                'args': args,
                'kwargs': sorted(kwargs.items()) if kwargs else {}
            }
            
            key_string = json.dumps(key_data, sort_keys=True, default=str)
            return hashlib.sha256(key_string.encode()).hexdigest()
            
        except Exception as e:
            self.logger.error(f"Error generating cache key: {str(e)}")
            return f"error_key_{time.time()}"
    
    def _calculate_hit_rate(self) -> float:
        """Calculate cache hit rate (placeholder implementation)"""
        # This would require tracking hits/misses over time
        # For now, return a placeholder value
        return 0.0
    
    def _get_oldest_entry_age(self) -> Optional[float]:
        """Get age of oldest cache entry in seconds"""
        if not self.cache:
            return None
            
        oldest_time = min(entry['created_at'] for entry in self.cache.values())
        return time.time() - oldest_time
    
    def _get_newest_entry_age(self) -> Optional[float]:
        """Get age of newest cache entry in seconds"""
        if not self.cache:
            return None
            
        newest_time = max(entry['created_at'] for entry in self.cache.values())
        return time.time() - newest_time

    def get_analysis(self, content_id: str) -> Optional[Any]:
        """Get analysis result from cache"""
        cache_key = f"analysis:{content_id}"
        return self.get(cache_key)
    
    def set_analysis(self, content_id: str, analysis: Any, ttl: Optional[int] = None) -> bool:
        """Cache analysis result"""
        cache_key = f"analysis:{content_id}"
        return self.set(cache_key, analysis, ttl)
    
    def get_status(self) -> Dict[str, Any]:
        """Get cache status and statistics"""
        try:
            current_time = time.time()
            active_entries = 0
            expired_entries = 0
            
            for key, entry in self.cache.items():
                if current_time > entry['expires_at']:
                    expired_entries += 1
                else:
                    active_entries += 1
            
            return {
                'status': 'operational',
                'active_entries': active_entries,
                'expired_entries': expired_entries,
                'total_entries': len(self.cache),
                'default_ttl': self.default_ttl,
                'last_updated': datetime.utcnow().isoformat()
            }
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }

# Global cache instance
cache_manager = CacheManager()
