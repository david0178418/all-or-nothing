import './styles.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Game from './components/game';
import Toast from './components/toast';
import ReactGA from "react-ga4";

if (process.env.NODE_ENV === "production" && process.env.GOOGLE_ANALYTICS_ID) {
	ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID);
}

export default
function App() {
	return (
		<>
			<Game />
			<Toast />
		</>
	);
}
