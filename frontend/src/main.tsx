import { root, createElement } from "@lynx-js/react";
import App from './App'; // CreatorCoin AI - Submission-ready with advanced features

// NOTE: Touch events and scrolling don't work in iOS Simulator (Lynx limitation)
// App is fully functional on real devices
root.render(createElement(App));

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
