import './styles.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { createRoot } from 'react-dom/client';
import Game from './components/game';

const appEl = document.getElementById('app');

const root = appEl && createRoot(appEl);

root?.render(<Game />);
