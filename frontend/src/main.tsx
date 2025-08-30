import { root, createElement } from "@lynx-js/react";
import App_test from './App_test'; // FINAL: Production-ready CreatorCoin AI - Full features

// NOTE: Touch events and scrolling don't work in iOS Simulator (Lynx limitation)
// App is fully functional on real devices
root.render(createElement(App_test));

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
