import { createRoot } from 'react-dom/client';
import App from './app';
import { registerSW } from 'virtual:pwa-register';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { PlatformProvider } from '@/platform/platform-context';
import { createSteamPlatformService } from '@/platform/steam-platform-service';
import { createNoopPlatformService } from '@/platform/noop-platform-service';

registerSW({ immediate: true })

const platformService = window.electronAPI
	? createSteamPlatformService()
	: createNoopPlatformService();

platformService.init();

const appEl = document.getElementById('app');

const root = appEl && createRoot(appEl);

root?.render(
	<ThemeProvider theme={theme}>
		<PlatformProvider service={platformService}>
			<App />
		</PlatformProvider>
	</ThemeProvider>
);
