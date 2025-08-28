/**
 * LynxCore - Advanced Cross-Platform Runtime Implementation
 * Simulates actual Lynx framework capabilities for TikTok TechJam 2025
 */

export interface LynxPlatform {
  ios: boolean;
  android: boolean;
  web: boolean;
  native: boolean;
}

export interface LynxBridge {
  platform: LynxPlatform;
  deviceInfo: {
    screenWidth: number;
    screenHeight: number;
    pixelDensity: number;
    safeAreaInsets: { top: number; bottom: number; left: number; right: number; };
  };
  capabilities: {
    camera: boolean;
    hapticFeedback: boolean;
    notifications: boolean;
    biometrics: boolean;
  };
}

class LynxRuntime {
  private static instance: LynxRuntime;
  private platform: LynxPlatform;
  private bridge: LynxBridge;
  private components: Map<string, any> = new Map();

  private constructor() {
    this.platform = this.detectPlatform();
    this.bridge = this.initializeBridge();
    this.registerNativeComponents();
  }

  public static getInstance(): LynxRuntime {
    if (!LynxRuntime.instance) {
      LynxRuntime.instance = new LynxRuntime();
    }
    return LynxRuntime.instance;
  }

  private detectPlatform(): LynxPlatform {
    // Advanced platform detection using multiple indicators
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isWeb = typeof window !== 'undefined';
    const isNative = !isWeb && (isIOS || isAndroid);

    // Check for React Native environment
    const isReactNative = typeof navigator !== 'undefined' && 
                         navigator.product === 'ReactNative';

    // Check for Capacitor/Cordova
    const isHybrid = typeof window !== 'undefined' && 
                     (window.hasOwnProperty('Capacitor') || window.hasOwnProperty('cordova'));

    return {
      ios: isIOS || (isReactNative && isIOS),
      android: isAndroid || (isReactNative && isAndroid),
      web: isWeb && !isReactNative && !isHybrid,
      native: isNative || isReactNative || isHybrid
    };
  }

  private initializeBridge(): LynxBridge {
    const getScreenDimensions = () => {
      if (typeof window !== 'undefined') {
        return {
          screenWidth: window.innerWidth || window.screen.width,
          screenHeight: window.innerHeight || window.screen.height,
          pixelDensity: window.devicePixelRatio || 1
        };
      }
      return { screenWidth: 375, screenHeight: 812, pixelDensity: 2 };
    };

    const getSafeAreaInsets = () => {
      // Simulate safe area detection for different devices
      if (this.platform.ios) {
        return { top: 44, bottom: 34, left: 0, right: 0 }; // iPhone notch
      } else if (this.platform.android) {
        return { top: 24, bottom: 0, left: 0, right: 0 }; // Android status bar
      }
      return { top: 0, bottom: 0, left: 0, right: 0 };
    };

    const getCapabilities = () => {
      const hasMediaDevices = typeof navigator !== 'undefined' && 
                              navigator.mediaDevices && 
                              navigator.mediaDevices.getUserMedia;
      
      const hasVibration = typeof navigator !== 'undefined' && 
                          'vibrate' in navigator;

      const hasNotifications = typeof Notification !== 'undefined';

      const hasBiometrics = this.platform.native && 
                           (this.platform.ios || this.platform.android);

      return {
        camera: Boolean(hasMediaDevices),
        hapticFeedback: hasVibration || this.platform.native,
        notifications: hasNotifications,
        biometrics: hasBiometrics
      };
    };

    return {
      platform: this.platform,
      deviceInfo: {
        ...getScreenDimensions(),
        safeAreaInsets: getSafeAreaInsets()
      },
      capabilities: getCapabilities()
    };
  }

  private registerNativeComponents(): void {
    // Register platform-specific components with lazy loading
    this.components.set('Camera', this.platform.native ? 'native' : 'web');
    this.components.set('Biometric', this.platform.native ? 'native' : 'web');
    this.components.set('Haptic', this.platform.native ? 'native' : 'web');
  }

  public getPlatform(): LynxPlatform {
    return this.platform;
  }

  public getBridge(): LynxBridge {
    return this.bridge;
  }

  public async loadComponent(componentName: string): Promise<any> {
    const componentLoader = this.components.get(componentName);
    if (componentLoader) {
      return await componentLoader();
    }
    throw new Error(`Component ${componentName} not found`);
  }

  public executeNativeMethod(method: string, params: any = {}): Promise<any> {
    return new Promise((resolve) => {
      if (this.platform.native) {
        // Simulate native bridge communication
        setTimeout(() => {
          const result = this.simulateNativeCall(method, params);
          resolve(result);
        }, 100);
      } else {
        // Web fallback
        const result = this.simulateWebCall(method, params);
        resolve(result);
      }
    });
  }

  private simulateNativeCall(method: string, _params: any): any {
    switch (method) {
      case 'hapticFeedback':
        return { success: true, method: 'native_haptic' };
      case 'biometricAuth':
        return { success: true, authenticated: true, method: 'native_biometric' };
      case 'cameraCapture':
        return { success: true, imageUri: 'native://captured_image.jpg' };
      case 'deviceInfo':
        return { 
          success: true, 
          info: {
            model: this.platform.ios ? 'iPhone 14 Pro' : 'Samsung Galaxy S23',
            os: this.platform.ios ? 'iOS 17.0' : 'Android 13',
            version: '1.0.0'
          }
        };
      default:
        return { success: false, error: 'Method not implemented' };
    }
  }

  private simulateWebCall(method: string, params: any): any {
    switch (method) {
      case 'hapticFeedback':
        if (navigator.vibrate) {
          navigator.vibrate(params.duration || 100);
          return { success: true, method: 'web_vibrate' };
        }
        return { success: false, error: 'Vibration not supported' };
      case 'biometricAuth':
        return { success: true, authenticated: true, method: 'web_fallback' };
      case 'cameraCapture':
        return { success: true, imageUri: 'data:image/jpeg;base64,simulated' };
      case 'deviceInfo':
        return { 
          success: true, 
          info: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
          }
        };
      default:
        return { success: false, error: 'Method not implemented' };
    }
  }
}

export default LynxRuntime.getInstance();
