import { createRoot } from 'react-dom/client';
import App from './app';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true })

const appEl = document.getElementById('app');

const root = appEl && createRoot(appEl);

root?.render(<App />);
