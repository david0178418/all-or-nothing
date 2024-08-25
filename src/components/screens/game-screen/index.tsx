import Toast from '@/components/toast';
import ReactGA from "react-ga4";
import HelpDialogTrigger from '@/components/help-dialog-trigger';
import { Provider } from 'rxdb-hooks';
import { useState } from 'react';
import { getDb } from '@/core';
import PauseDialog from '@/components/pause-dialog';
import GamePlayArea from './game-play-area';

const {
	DEV,
	PROD,
	VITE_GOOGLE_ANALYTICS_ID = '',
} = import.meta.env;

if (PROD && VITE_GOOGLE_ANALYTICS_ID) {
	ReactGA.initialize(VITE_GOOGLE_ANALYTICS_ID);
}

if(DEV) {
	Promise.all([
		import('rxdb/plugins/dev-mode'),
		import('rxdb'),
	]).then(([{ RxDBDevModePlugin }, { addRxPlugin }]) => {
		console.log('Adding RxDB dev mode plugin');
		addRxPlugin(RxDBDevModePlugin);
	});
}

export default
function Game() {
	const [db] = useState(getDb);

	return (
		<Provider db={db}>
			<GamePlayArea />
			<Toast />
			<PauseDialog/>
			<HelpDialogTrigger />
		</Provider>
	);
}
