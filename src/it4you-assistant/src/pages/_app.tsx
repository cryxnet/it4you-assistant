import "@/styles/globals.css";
import type { AppProps } from "next/app";
import * as React from "react";
import {NextUIProvider} from "@nextui-org/react";
import 'regenerator-runtime/runtime'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <Component {...pageProps} />
	  </NextUIProvider>
  );
}
