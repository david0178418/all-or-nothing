import Toast from '@/components/toast';
import ReactGA from "react-ga4";
import HelpDialogTrigger from '@/components/help-dialog-trigger';
import { Provider } from 'rxdb-hooks';
import { useEffect, useState } from 'react';
import { AsyncReturnType } from '@/types';
import { initialize } from '@/core';
import PauseDialog from '@/components/pause-dialog';
import GameBoard from './game-board';

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

interface Props {
	loadSavedGame?: boolean;
}

export default
function Game(props: Props) {
	// const { loadSavedGame } = props;
	const [db, setDb] = useState<AsyncReturnType<typeof initialize>>();

	useEffect(() => {
		initialize().then(setDb);
	}, []);

	return (
		<Provider db={db}>
			<GameBoard />
			<Toast />
			<PauseDialog/>
			<HelpDialogTrigger />
		</Provider>
	);
}
