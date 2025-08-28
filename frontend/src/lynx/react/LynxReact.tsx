/**
 * LynxReact - Advanced React Integration for Lynx Framework
 * Provides React hooks and components for cross-platform development
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import LynxRuntime, { LynxPlatform, LynxBridge } from '../core/LynxRuntime';

// Context for Lynx runtime
const LynxContext = createContext<{
  runtime: typeof LynxRuntime;
  platform: LynxPlatform;
  bridge: LynxBridge;
}>({
  runtime: LynxRuntime,
  platform: LynxRuntime.getPlatform(),
  bridge: LynxRuntime.getBridge()
});

// Provider component
export const LynxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [platform] = useState(LynxRuntime.getPlatform());
  const [bridge] = useState(LynxRuntime.getBridge());

  return (
    <LynxContext.Provider value={{ runtime: LynxRuntime, platform, bridge }}>
      {children}
    </LynxContext.Provider>
  );
};

// Hook to access Lynx runtime
export const useLynx = () => {
  const context = useContext(LynxContext);
  if (!context) {
    throw new Error('useLynx must be used within a LynxProvider');
  }
  return context;
};

// Hook for platform detection
export const usePlatform = () => {
  const { platform } = useLynx();
  return platform;
};

// Hook for device capabilities
export const useCapabilities = () => {
  const { bridge } = useLynx();
  return bridge.capabilities;
};

// Hook for safe area insets
export const useSafeArea = () => {
  const { bridge } = useLynx();
  return bridge.deviceInfo.safeAreaInsets;
};

// Hook for device info
export const useDeviceInfo = () => {
  const { bridge } = useLynx();
  return bridge.deviceInfo;
};

// Hook for native method execution
export const useNativeMethod = () => {
  const { runtime } = useLynx();
  return runtime.executeNativeMethod.bind(runtime);
};

// Cross-platform responsive hook
export const useResponsive = () => {
  const { bridge } = useLynx();
  const [dimensions, setDimensions] = useState({
    width: bridge.deviceInfo.screenWidth,
    height: bridge.deviceInfo.screenHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth || bridge.deviceInfo.screenWidth,
        height: window.innerHeight || bridge.deviceInfo.screenHeight
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [bridge.deviceInfo]);

  const isTablet = dimensions.width >= 768;
  const isDesktop = dimensions.width >= 1024;
  const isMobile = dimensions.width < 768;

  return {
    dimensions,
    isTablet,
    isDesktop,
    isMobile,
    orientation: dimensions.width > dimensions.height ? 'landscape' : 'portrait'
  };
};

// Advanced platform-specific styling hook
export const usePlatformStyles = () => {
  const platform = usePlatform();
  
  return {
    platform: platform.ios ? 'ios' : platform.android ? 'android' : 'web',
    getStyle: (styles: {
      ios?: React.CSSProperties;
      android?: React.CSSProperties;
      web?: React.CSSProperties;
      default?: React.CSSProperties;
    }) => {
      if (platform.ios && styles.ios) return styles.ios;
      if (platform.android && styles.android) return styles.android;
      if (platform.web && styles.web) return styles.web;
      return styles.default || {};
    }
  };
};

export default {
  LynxProvider,
  useLynx,
  usePlatform,
  useCapabilities,
  useSafeArea,
  useDeviceInfo,
  useNativeMethod,
  useResponsive,
  usePlatformStyles
};
