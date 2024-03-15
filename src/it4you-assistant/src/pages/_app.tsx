import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import * as React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import 'regenerator-runtime/runtime';
import PrivacyPolicyPopup from '@/lib/components/PrivacyPolicyPopup';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <NextUIProvider>
          <PrivacyPolicyPopup />
            <Component {...pageProps} />
        </NextUIProvider>
    );
}
