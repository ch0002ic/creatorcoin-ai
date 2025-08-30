/// <reference types="@lynx-js/rspeedy/client" />

import * as ReactLynx from "@lynx-js/react";
import * as Lynx from "@lynx-js/types";

declare global {
  namespace JSX {
    interface IntrinsicElements extends ReactLynx.JSX.IntrinsicElements {
      view: Lynx.StandardProps & {
        bindtap?: Lynx.EventHandler<Lynx.BaseEvent<"tap">>;
        children?: React.ReactNode;
      };
      text: Lynx.StandardProps & { 
        children?: React.ReactNode;
        bindtap?: Lynx.EventHandler<Lynx.BaseEvent<"tap">>;
      };
      image: Lynx.StandardProps & { 
        src?: string; 
        alt?: string;
        bindtap?: Lynx.EventHandler<Lynx.BaseEvent<"tap">>;
      };
      input: Lynx.StandardProps & {
        value?: string;
        placeholder?: string;
        bindinput?: Lynx.EventHandler<Lynx.BaseEvent<"input", { value: string }>>;
      };
    }
  }
}
