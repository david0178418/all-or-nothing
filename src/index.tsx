import { createRoot } from 'react-dom/client';
import App from './app';
import { registerSW } from 'virtual:pwa-register';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { PlatformProvider, createNoopPlatformService, createMockPlatformService } from '@/platform';
import { createSteamPlatformService } from '@/platform/steam-platform-service';

registerSW({ immediate: true });

const platformService = window.electronAPI
	? createSteamPlatformService()
	: import.meta.env.VITE_MOCK_PLATFORM
		? createMockPlatformService()
		: createNoopPlatformService();

const appEl = document.getElementById('app');

const root = appEl && createRoot(appEl);

root?.render(
	<ThemeProvider theme={theme}>
		<PlatformProvider service={platformService}>
			<App />
		</PlatformProvider>
	</ThemeProvider>
);
