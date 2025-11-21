import { createRoot } from 'react-dom/client';
import App from './app';
import { registerSW } from './register-sw';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

if(import.meta.env.NODE_ENV === 'production') {
	registerSW();
}

const appEl = document.getElementById('app');

const root = appEl && createRoot(appEl);

root?.render(
	<ThemeProvider theme={theme}>
		<App />
	</ThemeProvider>
);
