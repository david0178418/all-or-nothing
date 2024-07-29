import { createRoot } from 'react-dom/client';
import App from './app';

const appEl = document.getElementById('app');

const root = appEl && createRoot(appEl);

root?.render(<App />);
