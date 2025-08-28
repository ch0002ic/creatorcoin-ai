import React, { useEffect, useState, ReactNode } from 'react';
import { Lynx, LynxStyle, LynxGesture } from './core';

// Lynx-inspired React component wrapper
export interface LynxReactProps {
  children?: ReactNode;
  style?: LynxStyle;
  onGesture?: (gesture: LynxGesture) => void;
  onPress?: () => void;
  animate?: boolean;
  className?: string;
  id?: string;
}

// Base Lynx React component
export const LynxView: React.FC<LynxReactProps> = ({ 
  children, 
  style = {}, 
  onGesture,
  onPress,
  animate = false,
  className = '',
  id,
  ...props 
}) => {
  const [gestureManager] = useState(() => new Lynx.GestureManager());
  
  useEffect(() => {
    if (onGesture && id) {
      gestureManager.register(id, onGesture);
    }
  }, [onGesture, id, gestureManager]);
  
  const responsiveStyle = Lynx.createResponsiveStyle(style);
  
  return (
    <div
      id={id}
      className={`lynx-view ${className}`}
      onClick={onPress}
      style={{
        display: responsiveStyle.display || 'flex',
        flexDirection: responsiveStyle.flexDirection || 'column',
        justifyContent: responsiveStyle.justifyContent,
        alignItems: responsiveStyle.alignItems,
        padding: responsiveStyle.padding,
        margin: responsiveStyle.margin,
        backgroundColor: responsiveStyle.backgroundColor,
        borderRadius: responsiveStyle.borderRadius,
        width: responsiveStyle.width,
        height: responsiveStyle.height,
        opacity: responsiveStyle.opacity,
        transform: responsiveStyle.transform,
        cursor: onPress ? 'pointer' : undefined,
        fontSize: responsiveStyle.fontSize,
        fontWeight: responsiveStyle.fontWeight,
        color: responsiveStyle.color,
        ...responsiveStyle,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Lynx-inspired Text component
export const LynxText: React.FC<LynxReactProps & { 
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  weight?: 'normal' | 'bold' | '300' | '400' | '500' | '600' | '700';
}> = ({ 
  children, 
  variant = 'body', 
  weight = 'normal',
  style = {},
  ...props 
}) => {
  const getVariantStyle = (): LynxStyle => {
    const platform = Lynx.detectPlatform();
    const baseStyles = {
      h1: { fontSize: platform === 'web' ? 32 : 28, fontWeight: 'bold' as const },
      h2: { fontSize: platform === 'web' ? 24 : 22, fontWeight: '600' as const },
      h3: { fontSize: platform === 'web' ? 20 : 18, fontWeight: '500' as const },
      body: { fontSize: platform === 'web' ? 16 : 14, fontWeight: 'normal' as const },
      caption: { fontSize: platform === 'web' ? 12 : 11, fontWeight: 'normal' as const },
    };
    
    return { ...baseStyles[variant], fontWeight: weight as any };
  };
  
  const variantStyle = getVariantStyle();
  const combinedStyle = { ...variantStyle, ...style };
  
  return (
    <LynxView style={combinedStyle} {...props}>
      {children}
    </LynxView>
  );
};

// Lynx-inspired Button component
export const LynxButton: React.FC<LynxReactProps & {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
}> = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onPress,
  style = {},
  ...props 
}) => {
  const getButtonStyle = (): LynxStyle => {
    const platform = Lynx.detectPlatform();
    
    const variants = {
      primary: {
        backgroundColor: disabled ? '#cccccc' : '#1DA1F2',
        color: '#ffffff',
        borderRadius: platform === 'ios' ? 8 : platform === 'android' ? 6 : 8,
      },
      secondary: {
        backgroundColor: 'transparent',
        color: '#1DA1F2',
        borderRadius: platform === 'ios' ? 8 : platform === 'android' ? 6 : 8,
      },
      text: {
        backgroundColor: 'transparent',
        color: '#1DA1F2',
        borderRadius: 0,
      }
    };
    
    const sizes = {
      small: { padding: '8px 16px', fontSize: 14 },
      medium: { padding: '12px 24px', fontSize: 16 },
      large: { padding: '16px 32px', fontSize: 18 },
    };
    
    return {
      ...variants[variant],
      ...sizes[size],
      justifyContent: 'center',
      alignItems: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
    };
  };
  
  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };
  
  const buttonStyle = getButtonStyle();
  const combinedStyle = { ...buttonStyle, ...style };
  
  return (
    <LynxView 
      style={combinedStyle} 
      onPress={handlePress}
      {...props}
    >
      {loading ? (
        <LynxText style={{ color: combinedStyle.color }}>Loading...</LynxText>
      ) : (
        <LynxText style={{ color: combinedStyle.color, fontWeight: '500' }}>
          {children}
        </LynxText>
      )}
    </LynxView>
  );
};

// Lynx-inspired Card component
export const LynxCard: React.FC<LynxReactProps & {
  elevated?: boolean;
  interactive?: boolean;
  onPress?: () => void;
}> = ({ 
  children, 
  elevated = true,
  interactive = false,
  onPress,
  style = {},
  ...props 
}) => {
  const platform = Lynx.detectPlatform();
  
  const cardStyle: LynxStyle = {
    backgroundColor: '#ffffff',
    borderRadius: platform === 'ios' ? 12 : platform === 'android' ? 8 : 12,
    padding: 16,
    ...(elevated && platform === 'web' && {
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }),
    ...(interactive && {
      cursor: 'pointer',
    }),
    ...style
  };
  
  const handlePress = () => {
    if (interactive && onPress) {
      onPress();
    }
  };
  
  return (
    <LynxView 
      style={cardStyle}
      onGesture={(gesture) => gesture.type === 'tap' && handlePress()}
      {...props}
    >
      {children}
    </LynxView>
  );
};

// Lynx-inspired Input component
export const LynxInput: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'password' | 'email' | 'number';
  style?: LynxStyle;
  disabled?: boolean;
}> = ({ 
  placeholder,
  value,
  onChange,
  type = 'text',
  style = {},
  disabled = false 
}) => {
  const platform = Lynx.detectPlatform();
  
  const inputStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: platform === 'ios' ? 8 : platform === 'android' ? 6 : 8,
    border: '1px solid #e1e8ed',
    fontSize: 16,
    backgroundColor: disabled ? '#f7f9fa' : '#ffffff',
    color: disabled ? '#657786' : '#14171a',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    ...style,
  };
  
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      style={inputStyle}
    />
  );
};

// Lynx-inspired List component
export const LynxList: React.FC<LynxReactProps & {
  data: any[];
  renderItem: (item: any, index: number) => ReactNode;
  keyExtractor?: (item: any, index: number) => string;
  horizontal?: boolean;
  spacing?: number;
}> = ({ 
  data,
  renderItem,
  keyExtractor,
  horizontal = false,
  spacing = 8,
  style = {},
  ...props 
}) => {
  const listStyle: LynxStyle = {
    display: 'flex',
    flexDirection: horizontal ? 'row' : 'column',
    gap: spacing,
    ...style
  };
  
  return (
    <LynxView style={listStyle} {...props}>
      {data.map((item, index) => (
        <div key={keyExtractor ? keyExtractor(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </LynxView>
  );
};

// Export all Lynx-inspired components
export const LynxComponents = {
  View: LynxView,
  Text: LynxText,
  Button: LynxButton,
  Card: LynxCard,
  Input: LynxInput,
  List: LynxList,
};

export default LynxComponents;
