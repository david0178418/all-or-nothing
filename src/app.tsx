import './styles.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import TitleScreen from './components/screens/title-screen';
import { Screens } from './types';
import { lazy, Suspense, useMemo } from 'react';
import Loader from './components/loader';
import { useGamepadManager, useKeyboardManager } from './input/input-hooks';
import { useEventListener } from 'usehooks-ts';
import { InputEvent, NavigationDirection, PrimaryInputAction } from './input/input-types';
import { isIn } from './utils';
import {
	useActiveScreen,
	useSetActiveController,
	useUsingNavigationalInput,
	useNavigate,
	useSelectCurrent,
} from './atoms';

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
	const setActiveController = useSetActiveController();
	const usingNavigationalInput = useUsingNavigationalInput();
	const navigate = useNavigate();
	const selectCurrent = useSelectCurrent();

	const ActiveScreenComponent = ScreenComponents[activeScreen];

	const actionHandlers = useMemo(() => ({
		[PrimaryInputAction.NAVIGATE_UP]: () => navigate(NavigationDirection.UP),
		[PrimaryInputAction.NAVIGATE_DOWN]: () => navigate(NavigationDirection.DOWN),
		[PrimaryInputAction.NAVIGATE_LEFT]: () => navigate(NavigationDirection.LEFT),
		[PrimaryInputAction.NAVIGATE_RIGHT]: () => navigate(NavigationDirection.RIGHT),
		[PrimaryInputAction.SELECT]: () => selectCurrent(),
	} as const), [navigate, selectCurrent]);

	useGamepadManager(handleInput);
	useKeyboardManager(handleInput);
	useEventListener('mousedown', handleMouseOrTouch);
	useEventListener('touchstart', handleMouseOrTouch);

	function handleInput(event: InputEvent) {
		setActiveController(event.source);

		if (!usingNavigationalInput) return;

		const { action } = event;
		if (!isIn(action, PrimaryInputAction)) return;

		actionHandlers[action]();
	}

	function handleMouseOrTouch() {
		setActiveController(null);
	}

	return (
		<Suspense fallback={<Loader/>}>
			<ActiveScreenComponent />
		</Suspense>
	);
}
