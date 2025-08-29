import { root } from "@lynx-js/react";
import App from './App.tsx'
import AppSimple from './AppSimple.tsx'
import './index.css'

// Use simplified version to avoid framework crashes in mobile simulator
// Web version works perfectly with full App.tsx
const isWebEnv = typeof window !== 'undefined' && window.location.protocol === 'http:';
root.render(isWebEnv ? <App /> : <AppSimple />);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
