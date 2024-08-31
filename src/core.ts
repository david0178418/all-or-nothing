import { moveAndOverwriteItem, randomizeArray } from './utils';
import Dexie, { EntityTable } from 'dexie';
import {
	DbCollectionItemNameGameDataShuffleCount,
	DbCollectionItemNameGameDataTime,
	DbCollectionItemNameSetOrdersDeck,
	DbCollectionItemNameSetOrdersDiscard,
	DbName,
	SavedGameKey,
} from './constants';
import {
	BitwiseValue,
	Card,
	Colors,
	Counts,
	Fills,
	SetOrders,
	Shapes,
} from './types';

export
function setExists(cards: Card[]) {
	if(cards.length < 3) {
		return false;
	}

	for(let a = 0; a < cards.length - 2; a++) {
		for(let b = a + 1; b < cards.length - 1; b++) {
			for(let c = b + 1; c < cards.length; c++) {
				// @ts-ignore
				if(isSet(cards[a], cards[b], cards[c])) {
					return true;
				}
			}
		}
	}

	return false;
}

export
function isSet(a: Card, b: Card, c: Card) {
	return (
		allSameOrDifferent(a.color, b.color, c.color) &&
		allSameOrDifferent(a.fill, b.fill, c.fill) &&
		allSameOrDifferent(a.shape, b.shape, c.shape) &&
		allSameOrDifferent(a.count, b.count, c.count)
	);
}

export
function allSameOrDifferent(a: BitwiseValue, b: BitwiseValue, c: BitwiseValue) {
	return (
		// all are the same (bits AND to 'a'")
		((a & b & c) == a) ||
		// all are different (bits OR to '111' (7)")
		((a | b | c) == 7)
	);
}


const db = new Dexie(DbName) as Dexie & {
	setorders: EntityTable<
		SetOrders,
		'name'
	>;
	gamedata: EntityTable<
		{id: string; value: number;},
		'id'
	>
};
await initDb();

export
function getDb() {
	return db;
}

async function initDb() {;
// Schema declaration:
	db.version(1).stores({
		setorders: '++name, order', // primary key "id" (for the runtime!)
		gamedata: '++id, value',
	});

	if(await db.setorders.get(DbCollectionItemNameSetOrdersDeck)) {
		return;
	}

	db.gamedata.add({
		id: DbCollectionItemNameGameDataTime,
		value: 0,
	});
	db.gamedata.add({
		id: DbCollectionItemNameGameDataShuffleCount,
		value: 0,
	});
	db.setorders.add({
		name: DbCollectionItemNameSetOrdersDeck,
		order: generateDeck(),
	});
	db.setorders.add({
		name: DbCollectionItemNameSetOrdersDiscard,
		order: generateDeck(),
	});

	return db;
}

export
async function resetGameCore() {
	localStorage.removeItem(SavedGameKey);
	await Promise.all([
		db.gamedata.update(DbCollectionItemNameGameDataTime, { value: 0 }),
		db.gamedata.update(DbCollectionItemNameGameDataShuffleCount, { value: 0 }),
		db.setorders.update(DbCollectionItemNameSetOrdersDeck, { order: generateDeck() }),
		db.setorders.update(DbCollectionItemNameSetOrdersDiscard, { order: generateDeck() }),
	])
}

export
async function updateTime(newTime: number) {
	await db.gamedata.update(DbCollectionItemNameGameDataTime, {
		value: newTime,
	});

	localStorage.setItem(SavedGameKey, newTime.toString());
}

export
async function shuffleDeck() {
	const deck = await db.setorders.get(DbCollectionItemNameSetOrdersDeck);
	const shuffleCount = await db.gamedata.get(DbCollectionItemNameGameDataShuffleCount);

	if(!(deck && shuffleCount)) {
		return;
	}

	await Promise.all([
		db.setorders.update(DbCollectionItemNameSetOrdersDeck, {
			order: randomizeArray(deck.order),
		}),
		db.gamedata.update(DbCollectionItemNameGameDataShuffleCount, {
			value: shuffleCount.value + 1,
		}),
	]);
}

export
async function discardCards(discardCardIds: string[], boardSize: number) {
	const deckOrder = await db.setorders.get(DbCollectionItemNameSetOrdersDeck);
	const discardPile = await db.setorders.get(DbCollectionItemNameSetOrdersDiscard);

	if(!(deckOrder && discardPile)) {
		return;
	}

	const selectedIndexes = discardCardIds.map(selectedId => deckOrder.order.indexOf(selectedId) || 0) as [number, number, number];

	await Promise.all([
		db.setorders.update(DbCollectionItemNameSetOrdersDeck, {
			order: deckOrder.order.length > boardSize ?
				dealNewCards(deckOrder.order, selectedIndexes, boardSize):
				deckOrder.order.filter(id => !discardCardIds.includes(id)),
		}),
		db.setorders.update(DbCollectionItemNameSetOrdersDiscard, {
			order: [...discardPile.order, ...discardCardIds]
		}),
	]);
}

function dealNewCards(cardOrderIds: string[], removeCardIndexes: [number, number, number], dealtCardCount: number) {
	const foo1 = moveAndOverwriteItem(cardOrderIds, dealtCardCount, removeCardIndexes[0]);
	const foo2 = moveAndOverwriteItem(foo1, dealtCardCount, removeCardIndexes[1]);
	return moveAndOverwriteItem(foo2, dealtCardCount, removeCardIndexes[2]);
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
