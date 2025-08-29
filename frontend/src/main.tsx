import { root } from "@lynx-js/react";
import AppSimple from './AppSimple.tsx'
import './index.css'

// For now, use AppSimple for both web and mobile until we fix the full version
// This ensures stability across all platforms
root.render(<AppSimple />);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
