/**
 * AI-Era UI Components - Advanced patterns for AI interaction
 * Built with Lynx framework for cross-platform compatibility
 */

import React, { useState, useEffect, useRef } from 'react';
import { usePlatform, usePlatformStyles, useResponsive } from '../react/LynxReact';

// AI Chat Interface with sophisticated interaction patterns
export const AIChat: React.FC<{
  messages: Array<{ id: string; type: 'user' | 'ai'; content: string; confidence?: number; timestamp: Date }>;
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  showConfidence?: boolean;
}> = ({ messages, onSendMessage, isLoading = false, showConfidence = true }) => {
  const [input, setInput] = useState('');
  const platform = usePlatform();
  const { getStyle } = usePlatformStyles();
  const { isMobile } = useResponsive();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const containerStyle = getStyle({
    ios: { fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
    android: { fontFamily: 'Roboto, sans-serif' },
    web: { fontFamily: 'system-ui, sans-serif' },
    default: { 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      backgroundColor: platform.native ? '#000' : '#f5f5f5'
    }
  });

  return (
    <div style={containerStyle}>
      {/* Messages Container */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: isMobile ? '10px' : '20px',
        maxHeight: 'calc(100vh - 120px)'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: '15px',
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: platform.ios ? '18px' : '12px',
                backgroundColor: message.type === 'user' 
                  ? (platform.ios ? '#007AFF' : '#1976D2')
                  : (platform.native ? '#333' : '#fff'),
                color: message.type === 'user' ? '#fff' : (platform.native ? '#fff' : '#000'),
                boxShadow: platform.web ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <div>{message.content}</div>
              {showConfidence && message.type === 'ai' && message.confidence && (
                <div style={{ 
                  fontSize: '12px', 
                  opacity: 0.7, 
                  marginTop: '5px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span>Confidence: {Math.round(message.confidence * 100)}%</span>
                  <div style={{
                    width: '40px',
                    height: '4px',
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    borderRadius: '2px',
                    marginLeft: '8px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${message.confidence * 100}%`,
                      height: '100%',
                      backgroundColor: message.confidence > 0.8 ? '#4CAF50' : 
                                     message.confidence > 0.6 ? '#FF9800' : '#F44336',
                      borderRadius: '2px'
                    }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: platform.ios ? '18px' : '12px',
              backgroundColor: platform.native ? '#333' : '#fff',
              color: platform.native ? '#fff' : '#000'
            }}>
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div style={{
        padding: isMobile ? '10px' : '20px',
        backgroundColor: platform.native ? '#111' : '#fff',
        borderTop: `1px solid ${platform.native ? '#333' : '#eee'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: platform.ios ? '20px' : '8px',
            border: platform.web ? '1px solid #ddd' : 'none',
            backgroundColor: platform.native ? '#222' : '#f8f8f8',
            color: platform.native ? '#fff' : '#000',
            fontSize: '16px',
            outline: 'none'
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          style={{
            padding: '12px 20px',
            borderRadius: platform.ios ? '20px' : '8px',
            border: 'none',
            backgroundColor: platform.ios ? '#007AFF' : '#1976D2',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
            opacity: (!input.trim() || isLoading) ? 0.5 : 1
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

// Typing indicator animation
const TypingIndicator: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span>AI is thinking</span>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            animation: `typing 1.4s infinite ${i * 0.2}s`
          }}
        />
      ))}
    </div>
  );
};

// AI Quality Score Visualization
export const QualityScoreCard: React.FC<{
  score: number;
  breakdown: { [key: string]: number };
  showDetails?: boolean;
}> = ({ score, breakdown, showDetails = false }) => {
  const platform = usePlatform();
  const { getStyle } = usePlatformStyles();
  const [expanded, setExpanded] = useState(showDetails);

  const cardStyle = getStyle({
    ios: { borderRadius: '12px', backgroundColor: '#1C1C1E' },
    android: { borderRadius: '8px', backgroundColor: '#121212', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' },
    web: { borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    default: { padding: '16px', margin: '8px 0' }
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, color: platform.native ? '#fff' : '#000' }}>
          Quality Score
        </h3>
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: getScoreColor(score)
        }}>
          {score}/100
        </div>
      </div>

      {/* Circular Progress */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <CircularProgress value={score} color={getScoreColor(score)} />
      </div>

      {/* Breakdown Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: 'none',
          border: 'none',
          color: platform.ios ? '#007AFF' : '#1976D2',
          cursor: 'pointer',
          fontSize: '14px',
          width: '100%',
          textAlign: 'center'
        }}
      >
        {expanded ? 'Hide Details' : 'Show Breakdown'}
      </button>

      {/* Detailed Breakdown */}
      {expanded && (
        <div style={{ marginTop: '16px' }}>
          {Object.entries(breakdown).map(([category, value]) => (
            <div key={category} style={{ marginBottom: '12px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px',
                color: platform.native ? '#fff' : '#000'
              }}>
                <span style={{ textTransform: 'capitalize' }}>{category}</span>
                <span>{value}/100</span>
              </div>
              <div style={{
                height: '6px',
                backgroundColor: platform.native ? '#333' : '#f0f0f0',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${value}%`,
                  height: '100%',
                  backgroundColor: getScoreColor(value),
                  borderRadius: '3px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Circular Progress Component
const CircularProgress: React.FC<{ value: number; color: string; size?: number }> = ({ 
  value, 
  color, 
  size = 80 
}) => {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${value / 100 * circumference} ${circumference}`;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e6e6e6"
        strokeWidth="8"
        fill="transparent"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth="8"
        fill="transparent"
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.35s' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.3em"
        fontSize="18"
        fontWeight="bold"
        fill={color}
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
      >
        {value}
      </text>
    </svg>
  );
};

// Real-time Analytics Dashboard
export const RealtimeAnalytics: React.FC<{
  metrics: {
    views: number;
    revenue: number;
    engagement: number;
    qualityScore: number;
  };
  trend: 'up' | 'down' | 'stable';
}> = ({ metrics, trend }) => {
  const platform = usePlatform();
  const { isMobile } = useResponsive();

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return '#4CAF50';
      case 'down': return '#F44336';
      default: return '#FF9800';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
      gap: '16px',
      padding: '16px',
      backgroundColor: platform.native ? '#000' : '#f5f5f5'
    }}>
      {Object.entries(metrics).map(([key, value]) => (
        <div
          key={key}
          style={{
            padding: '16px',
            borderRadius: platform.ios ? '12px' : '8px',
            backgroundColor: platform.native ? '#1C1C1E' : '#fff',
            boxShadow: platform.web ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            textAlign: 'center'
          }}
        >
          <div style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            color: platform.native ? '#8E8E93' : '#666',
            marginBottom: '8px'
          }}>
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: platform.native ? '#fff' : '#000',
            marginBottom: '4px'
          }}>
            {key === 'revenue' ? `$${value.toFixed(2)}` : 
             key === 'qualityScore' ? `${value}/100` : 
             value.toLocaleString()}
          </div>
          <div style={{
            fontSize: '14px',
            color: getTrendColor(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ marginRight: '4px' }}>{getTrendIcon()}</span>
            <span>{trend}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default {
  AIChat,
  QualityScoreCard,
  RealtimeAnalytics
};
