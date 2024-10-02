import './styles.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import TitleScreen from './components/screens/title-screen';
import { useActiveScreen } from './atoms';
import { Screens } from './types';
import { lazy, Suspense } from 'react';
import Loader from './components/loader';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
const Game = lazy(() => import('./components/screens/game-screen'));
const About = lazy(() => import('./components/screens/about-screen'));
const Help = lazy(() => import('./components/screens/help-screen'));

const ScreenComponents = {
	[Screens.Title]: TitleScreen,
	[Screens.Game]: Game,
	[Screens.About]: About,
	[Screens.Help]: Help,
} as const;

export default
function App() {
	const activeScreen = useActiveScreen();
	const ActiveScreenComponent = ScreenComponents[activeScreen];

	return (
		<ThemeProvider theme={theme}>
			<Suspense fallback={<Loader/>}>
				<ActiveScreenComponent />
			</Suspense>
		</ThemeProvider>
	);
}


const theme = createTheme({
	palette: {
		primary: {
			main: '#EB6123',
			light: '#85E21F',
			dark: '#881EE4',
			contrastText: '#fff',
		}
	},
});;
