// Lynx Cross-Platform Configuration
// This simulates Lynx-style cross-platform development for CreatorCoin AI

export interface LynxConfig {
  platform: 'web' | 'ios' | 'android';
  theme: 'light' | 'dark' | 'auto';
  locale: string;
  screenSize: {
    width: number;
    height: number;
  };
  devicePixelRatio: number;
}

export interface LynxElement {
  type: string;
  props: Record<string, any>;
  children?: LynxElement[];
  style?: LynxStyle;
}

export interface LynxStyle {
  backgroundColor?: string;
  color?: string;
  fontSize?: number | string;
  fontWeight?: string | number;
  padding?: number | string;
  paddingTop?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  paddingRight?: number | string;
  paddingVertical?: number | string;
  paddingHorizontal?: number | string;
  margin?: number | string;
  marginTop?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;
  marginVertical?: number | string;
  marginHorizontal?: number | string;
  borderRadius?: number | string;
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  display?: 'none' | 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  flex?: number;
  flexDirection?: 'row' | 'column';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  zIndex?: number;
  opacity?: number;
  transform?: string;
  transition?: string;
  boxShadow?: string;
  border?: string;
  borderWidth?: number | string;
  borderColor?: string;
  borderTopWidth?: number | string;
  borderBottomWidth?: number | string;
  borderLeftWidth?: number | string;
  borderRightWidth?: number | string;
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  cursor?: 'auto' | 'pointer' | 'default' | 'text' | 'move' | 'not-allowed' | 'crosshair' | 'grab' | 'grabbing';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: string;
  lineHeight?: number | string;
  letterSpacing?: number | string;
  gap?: number | string;
  // CSS Grid and Flexbox
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumn?: string;
  gridRow?: string;
  // Background and gradients
  background?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  // Webkit specific
  WebkitBackgroundClip?: string;
  WebkitTextFillColor?: string;
  // React Native style properties
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
}

// Lynx-inspired platform detection
export const detectPlatform = (): 'web' | 'ios' | 'android' => {
  if (typeof window === 'undefined') return 'web';
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  
  if (/android/.test(userAgent)) {
    return 'android';
  } else if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  }
  
  return 'web';
};

// Lynx-style responsive design
export const createResponsiveStyle = (
  webStyle: LynxStyle,
  mobileStyle: LynxStyle = {},
  tabletStyle: LynxStyle = {}
): LynxStyle => {
  const platform = detectPlatform();
  const screenWidth = window.innerWidth;
  
  // Mobile-first approach like Lynx
  if (platform === 'ios' || platform === 'android' || screenWidth < 768) {
    return { ...webStyle, ...mobileStyle };
  } else if (screenWidth >= 768 && screenWidth < 1024) {
    return { ...webStyle, ...tabletStyle };
  }
  
  return webStyle;
};

// Lynx-inspired component system
export class LynxComponent {
  config: LynxConfig;
  
  constructor(config: Partial<LynxConfig> = {}) {
    this.config = {
      platform: detectPlatform(),
      theme: 'auto',
      locale: 'en-US',
      screenSize: {
        width: window.innerWidth || 375,
        height: window.innerHeight || 667
      },
      devicePixelRatio: window.devicePixelRatio || 1,
      ...config
    };
  }
  
  // Lynx-style cross-platform rendering
  render(element: LynxElement): string {
    const { type, props, children, style } = element;
    const platformStyle = this.getPlatformStyle(style);
    
    return `
      <${type} 
        ${this.renderProps(props)} 
        style="${this.renderStyle(platformStyle)}"
      >
        ${children ? children.map(child => this.render(child)).join('') : ''}
      </${type}>
    `;
  }
  
  private getPlatformStyle(style?: LynxStyle): LynxStyle {
    if (!style) return {};
    
    // Platform-specific style adjustments (Lynx-inspired)
    const baseStyle = { ...style };
    
    switch (this.config.platform) {
      case 'ios':
        if (typeof baseStyle.fontSize === 'number') {
          baseStyle.fontSize = Math.round(baseStyle.fontSize * 0.95); // iOS prefers slightly smaller fonts
        }
        break;
        
      case 'android':
        if (typeof baseStyle.borderRadius === 'number') {
          baseStyle.borderRadius = Math.min(baseStyle.borderRadius, 8); // Android prefers smaller border radius
        }
        break;
      case 'web':
        // Web-specific adjustments
        break;
    }
    
    return baseStyle;
  }
  
  private renderProps(props: Record<string, any>): string {
    return Object.entries(props)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
  }
  
  private renderStyle(style: LynxStyle): string {
    return Object.entries(style)
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${cssKey}: ${value}`;
      })
      .join('; ');
  }
}

// Lynx-inspired gesture handling
export interface LynxGesture {
  type: 'tap' | 'long-press' | 'swipe' | 'pinch' | 'rotate';
  data: any;
}

export class LynxGestureManager {
  private handlers: Map<string, (gesture: LynxGesture) => void> = new Map();
  
  register(elementId: string, handler: (gesture: LynxGesture) => void) {
    this.handlers.set(elementId, handler);
    
    const element = document.getElementById(elementId);
    if (element) {
      this.attachGestureListeners(element, handler);
    }
  }
  
  private attachGestureListeners(element: HTMLElement, handler: (gesture: LynxGesture) => void) {
    // Touch gestures for mobile (Lynx-style)
    let touchStartTime = 0;
    let touchStartPos = { x: 0, y: 0 };
    
    element.addEventListener('touchstart', (e) => {
      touchStartTime = Date.now();
      const touch = e.touches[0];
      touchStartPos = { x: touch.clientX, y: touch.clientY };
    });
    
    element.addEventListener('touchend', (e) => {
      const duration = Date.now() - touchStartTime;
      const touch = e.changedTouches[0];
      const endPos = { x: touch.clientX, y: touch.clientY };
      
      const distance = Math.sqrt(
        Math.pow(endPos.x - touchStartPos.x, 2) + 
        Math.pow(endPos.y - touchStartPos.y, 2)
      );
      
      if (duration < 200 && distance < 10) {
        handler({ type: 'tap', data: { position: endPos } });
      } else if (duration > 500 && distance < 10) {
        handler({ type: 'long-press', data: { position: endPos } });
      } else if (distance > 50) {
        const direction = this.getSwipeDirection(touchStartPos, endPos);
        handler({ type: 'swipe', data: { direction, distance } });
      }
    });
    
    // Mouse events for web
    element.addEventListener('click', (e) => {
      handler({ type: 'tap', data: { position: { x: e.clientX, y: e.clientY } } });
    });
  }
  
  private getSwipeDirection(start: { x: number; y: number }, end: { x: number; y: number }): string {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }
}

// Lynx-inspired animation system
export interface LynxAnimation {
  property: string;
  from: any;
  to: any;
  duration: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  delay?: number;
}

export class LynxAnimator {
  animate(elementId: string, animations: LynxAnimation[]): Promise<void> {
    return new Promise((resolve) => {
      const element = document.getElementById(elementId);
      if (!element) {
        resolve();
        return;
      }
      
      const totalDuration = Math.max(...animations.map(a => (a.delay || 0) + a.duration));
      
      animations.forEach(animation => {
        setTimeout(() => {
          (element.style as any)[animation.property] = animation.from;
          element.style.transition = `${animation.property} ${animation.duration}ms ${animation.easing || 'ease-out'}`;
          
          requestAnimationFrame(() => {
            (element.style as any)[animation.property] = animation.to;
          });
        }, animation.delay || 0);
      });
      
      setTimeout(resolve, totalDuration);
    });
  }
}

// Export the main Lynx-inspired API
export const Lynx = {
  Component: LynxComponent,
  GestureManager: LynxGestureManager,
  Animator: LynxAnimator,
  detectPlatform,
  createResponsiveStyle
};

export default Lynx;
