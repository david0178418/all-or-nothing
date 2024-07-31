import './styles.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Game from './components/game';
import Toast from './components/toast';
import ReactGA from "react-ga4";
import HelpDialogTrigger from './components/help-dialog-trigger';
import AdLinkSection from './components/ad-link-section';

const {
	NODE_ENV = 'development',
	GOOGLE_ANALYTICS_ID = '',
	AD_CONTENT_URL = '',
} = process.env;

if (NODE_ENV === "production" && GOOGLE_ANALYTICS_ID) {
	ReactGA.initialize(GOOGLE_ANALYTICS_ID);
}


export default
function App() {
	return (
		<>
			{AD_CONTENT_URL && <AdLinkSection contentUrl={AD_CONTENT_URL} />}
			<Game />
			<Toast />
			<HelpDialogTrigger />
		</>
	);
}
