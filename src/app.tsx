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
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { useEffect, useState } from 'react';
import { randomizeArray } from './utils';
import {
	AsyncReturnType,
	Colors,
	Counts,
	Fills,
	SetOrders,
	Shapes,
} from './types';
import {
	addRxPlugin,
	createRxDatabase,
	RxCollection,
	RxJsonSchema,
} from 'rxdb';

const {
	NODE_ENV = 'development',
	VITE_GOOGLE_ANALYTICS_ID = '',
	VITE_AD_CONTENT_URL = '',
	// @ts-ignore
} = import.meta.env;

if (NODE_ENV === "production" && VITE_GOOGLE_ANALYTICS_ID) {
	ReactGA.initialize(VITE_GOOGLE_ANALYTICS_ID);
}

if(NODE_ENV === 'development') {
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

interface DbCollections {
	setorders: RxCollection<SetOrders>;
}

async function initialize() {
	const SetOrdersSchema: RxJsonSchema<SetOrders> = {
		version: 0,
		primaryKey: 'name',
		type: 'object',
		properties: {
			name: {
				type: 'string',
				maxLength: 12,
			},
			order: {
				type: 'array',
				items: {
					type: 'string',
				},
			},
		},
	};

	const db = await createRxDatabase<DbCollections>({
		name: 'mydatabase',
		storage: getRxStorageDexie()
	});

	console.log('db.collections', )

	if(db.collections.setorders) {
		console.log('foo');
		return db;
	}

	await db.addCollections({
		setorders: {
			schema: SetOrdersSchema,
		},
	});

	if(await db.setorders.count().exec()) {
		return db;
	}

	db.setorders.insert({
		name: 'deck',
		order: generateDeck(),
	});

	db.setorders.insert({
		name: 'discard',
		order: [],
	});

	return db;
}

export
function generateDeck() {
	const newDeck: string[] = [];

	Object.values(Fills).forEach(fill => {
		Object.values(Colors).forEach(color => {
			Object.values(Shapes).forEach(shape => {
				Object.values(Counts).forEach(count => {
					newDeck.push(
						JSON.stringify({
							fill,
							color,
							shape,
							count,
						}),
					);
				});
			});
		});
	});

	return randomizeArray(newDeck);
}
