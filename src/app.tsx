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
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { Provider } from 'rxdb-hooks';
import { useEffect, useState } from 'react';
import { AsyncReturnType } from './types';
import { addRxPlugin } from 'rxdb';
import { initialize } from './core';

const {
	DEV,
	PROD,
	VITE_GOOGLE_ANALYTICS_ID = '',
	VITE_AD_CONTENT_URL = '',
} = import.meta.env;

if (PROD && VITE_GOOGLE_ANALYTICS_ID) {
	ReactGA.initialize(VITE_GOOGLE_ANALYTICS_ID);
}

if(DEV) {
	addRxPlugin(RxDBDevModePlugin);
}

export default
function App() {
	const [db, setDb] = useState<AsyncReturnType<typeof initialize>>();

	useEffect(() => {
	  // RxDB instantiation can be asynchronous
		initialize().then(setDb);
	}, []);

	return (
		<Provider db={db}>
			{VITE_AD_CONTENT_URL && <AdLinkSection contentUrl={VITE_AD_CONTENT_URL} />}
			<Game />
			<Toast />
			<HelpDialogTrigger />
		</Provider>
	);
}
