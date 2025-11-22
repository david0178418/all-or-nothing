import { createRoot } from 'react-dom/client';
import App from './app';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

const appEl = document.getElementById('app');

const root = appEl && createRoot(appEl);

root?.render(
	<ThemeProvider theme={theme}>
		<App />
	</ThemeProvider>
);
