import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
	palette: {
	  primary: {
		main: '#556cd6',
		light: '#add8e6', // You should define the light color here
	  },
	  // ... other theme properties
	},
  });

export default function App({ Component, pageProps }: AppProps) {
  return (
	<ThemeProvider theme={theme}>
      <Component {...pageProps} />
	  </ThemeProvider>
  );
}
