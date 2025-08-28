/// <reference types="@lynx-js/rspeedy/client" />

import * as ReactLynx from "@lynx-js/react";
import * as Lynx from "@lynx-js/types";

declare global {
  namespace JSX {
    interface IntrinsicElements extends ReactLynx.JSX.IntrinsicElements {
      view: Lynx.StandardProps;
      text: Lynx.StandardProps & { children?: React.ReactNode };
      image: Lynx.StandardProps & { src?: string; alt?: string };
      input: Lynx.StandardProps & {
        value?: string;
        placeholder?: string;
        bindinput?: Lynx.EventHandler<Lynx.BaseEvent<"input", { value: string }>>;
      };
    }
  }
}
