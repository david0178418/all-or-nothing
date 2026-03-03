import { createRoot } from 'react-dom/client';
import App from './app';
import { registerSW } from 'virtual:pwa-register';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { PlatformProvider, createNoopPlatformService } from '@/platform';

registerSW({ immediate: true })

const appEl = document.getElementById('app');

const root = appEl && createRoot(appEl);

const platformService = createNoopPlatformService();

root?.render(
	<ThemeProvider theme={theme}>
		<PlatformProvider service={platformService}>
			<App />
		</PlatformProvider>
	</ThemeProvider>
);
