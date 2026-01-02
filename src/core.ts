import { moveAndOverwriteItem, randomizeArray } from './utils';
import Dexie, { EntityTable } from 'dexie';
import {
	DbCollectionItemNameGameDataShuffleCount,
	DbCollectionItemNameGameDataTime,
	DbCollectionItemNameGameDataSoundEnabled,
	DbCollectionItemNameGameDataMusicEnabled,
	DbCollectionItemNameGameDataScore,
	DbCollectionItemNameGameDataScoreValue,
	DbCollectionItemNameGameDataLastMatchTime,
	DbCollectionItemNameGameDataComboCount,
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

// Scoring system configuration
const SCORE_CONFIG = {
	BASE_VALUE: 10_000,
	DECAY_PER_SECOND: 10,
	COMBO_THRESHOLD_SECONDS: 3,
	COMBO_BONUS_BASE: 100,
	INVALID_SET_PENALTY: 100,
	SHUFFLE_WITH_SET_PENALTY: 200,
	MINIMUM_VALUE: 100,
	ROUNDING_FACTOR: 10,
} as const;

// Pure scoring calculation functions
function roundToNearest(value: number, multiple: number) {
	return Math.round(value / multiple) * multiple;
}

export
function calculateDecayedScoreValue(currentValue: number, secondsElapsed: number) {
	const decayed = currentValue - (SCORE_CONFIG.DECAY_PER_SECOND * secondsElapsed);
	return roundToNearest(Math.max(decayed, SCORE_CONFIG.MINIMUM_VALUE), SCORE_CONFIG.ROUNDING_FACTOR);
}

export
function calculateComboBonus(comboCount: number) {
	if (comboCount === 0) return 0;

	const multiplier = comboCount === 1 ? 1 : (comboCount - 1) * 0.5 + 1;
	return roundToNearest(SCORE_CONFIG.COMBO_BONUS_BASE * multiplier, SCORE_CONFIG.ROUNDING_FACTOR);
}

export
function calculateScoreValueWithCombo(currentValue: number, comboCount: number) {
	const bonus = calculateComboBonus(comboCount);
	return roundToNearest(currentValue + bonus, SCORE_CONFIG.ROUNDING_FACTOR);
}

export
function applyPenalty(currentValue: number, penalty: number) {
	const penalized = currentValue - penalty;
	return roundToNearest(Math.max(penalized, SCORE_CONFIG.MINIMUM_VALUE), SCORE_CONFIG.ROUNDING_FACTOR);
}

export
function isComboEligible(currentTime: number, lastMatchTime: number) {
	return (currentTime - lastMatchTime) <= SCORE_CONFIG.COMBO_THRESHOLD_SECONDS;
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
	db.gamedata.add({
		id: DbCollectionItemNameGameDataSoundEnabled,
		value: 1,
	});
	db.gamedata.add({
		id: DbCollectionItemNameGameDataMusicEnabled,
		value: 1,
	});
	db.gamedata.add({
		id: DbCollectionItemNameGameDataScore,
		value: 0,
	});
	db.gamedata.add({
		id: DbCollectionItemNameGameDataScoreValue,
		value: 1000,
	});
	db.gamedata.add({
		id: DbCollectionItemNameGameDataLastMatchTime,
		value: 0,
	});
	db.gamedata.add({
		id: DbCollectionItemNameGameDataComboCount,
		value: 0,
	});
	db.setorders.add({
		name: DbCollectionItemNameSetOrdersDeck,
		order: generateDeck(),
	});
	db.setorders.add({
		name: DbCollectionItemNameSetOrdersDiscard,
		order: [],
	});

	return db;
}

export
async function resetGameCore() {
	localStorage.removeItem(SavedGameKey);
	await Promise.all([
		db.gamedata.update(DbCollectionItemNameGameDataTime, { value: 0 }),
		db.gamedata.update(DbCollectionItemNameGameDataShuffleCount, { value: 0 }),
		db.gamedata.update(DbCollectionItemNameGameDataScore, { value: 0 }),
		db.gamedata.update(DbCollectionItemNameGameDataScoreValue, { value: 1000 }),
		db.gamedata.update(DbCollectionItemNameGameDataLastMatchTime, { value: 0 }),
		db.gamedata.update(DbCollectionItemNameGameDataComboCount, { value: 0 }),
		db.setorders.update(DbCollectionItemNameSetOrdersDeck, { order: generateDeck() }),
		db.setorders.update(DbCollectionItemNameSetOrdersDiscard, { order: [] }),
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
async function getSoundEnabled() {
	const result = await db.gamedata.get(DbCollectionItemNameGameDataSoundEnabled);
	return result?.value === 1;
}

export
async function updateSoundEnabled(enabled: boolean) {
	await db.gamedata.update(DbCollectionItemNameGameDataSoundEnabled, {
		value: enabled ? 1 : 0,
	});
}

export
async function getMusicEnabled() {
	const result = await db.gamedata.get(DbCollectionItemNameGameDataMusicEnabled);
	return result?.value === 1;
}

export
async function updateMusicEnabled(enabled: boolean) {
	await db.gamedata.update(DbCollectionItemNameGameDataMusicEnabled, {
		value: enabled ? 1 : 0,
	});
}

// Scoring database update functions
export
async function awardMatchScore(currentTime: number) {
	const [scoreData, scoreValueData, lastMatchData, comboData] = await Promise.all([
		db.gamedata.get(DbCollectionItemNameGameDataScore),
		db.gamedata.get(DbCollectionItemNameGameDataScoreValue),
		db.gamedata.get(DbCollectionItemNameGameDataLastMatchTime),
		db.gamedata.get(DbCollectionItemNameGameDataComboCount),
	]);

	if (!(scoreData && scoreValueData && lastMatchData && comboData)) {
		return;
	}

	const isCombo = isComboEligible(currentTime, lastMatchData.value);
	const newComboCount = isCombo ? comboData.value + 1 : 0;
	const currentScoreValue = scoreValueData.value;
	const newScore = scoreData.value + currentScoreValue;
	const newScoreValue = calculateScoreValueWithCombo(
		currentScoreValue,
		newComboCount
	);

	await Promise.all([
		db.gamedata.update(DbCollectionItemNameGameDataScore, { value: newScore }),
		db.gamedata.update(DbCollectionItemNameGameDataScoreValue, { value: newScoreValue }),
		db.gamedata.update(DbCollectionItemNameGameDataLastMatchTime, { value: currentTime }),
		db.gamedata.update(DbCollectionItemNameGameDataComboCount, { value: newComboCount }),
	]);
}

export
async function decayScoreValue(secondsElapsed: number) {
	const scoreValueData = await db.gamedata.get(DbCollectionItemNameGameDataScoreValue);

	if (!scoreValueData || secondsElapsed <= 0) {
		return;
	}

	const newValue = calculateDecayedScoreValue(scoreValueData.value, secondsElapsed);

	await db.gamedata.update(DbCollectionItemNameGameDataScoreValue, {
		value: newValue,
	});
}

export
async function penalizeInvalidSet() {
	const scoreValueData = await db.gamedata.get(DbCollectionItemNameGameDataScoreValue);

	if (!scoreValueData) {
		return;
	}

	const newValue = applyPenalty(scoreValueData.value, SCORE_CONFIG.INVALID_SET_PENALTY);

	await db.gamedata.update(DbCollectionItemNameGameDataScoreValue, {
		value: newValue,
	});
}

export
async function penalizeUnnecessaryShuffle() {
	const scoreValueData = await db.gamedata.get(DbCollectionItemNameGameDataScoreValue);

	if (!scoreValueData) {
		return;
	}

	const newValue = applyPenalty(scoreValueData.value, SCORE_CONFIG.SHUFFLE_WITH_SET_PENALTY);

	await db.gamedata.update(DbCollectionItemNameGameDataScoreValue, {
		value: newValue,
	});
}

export
async function resetComboIfExpired(currentTime: number) {
	const [lastMatchData, comboData, scoreValueData] = await Promise.all([
		db.gamedata.get(DbCollectionItemNameGameDataLastMatchTime),
		db.gamedata.get(DbCollectionItemNameGameDataComboCount),
		db.gamedata.get(DbCollectionItemNameGameDataScoreValue),
	]);

	if (!(lastMatchData && comboData && scoreValueData)) {
		return;
	}

	if (comboData.value > 0 && !isComboEligible(currentTime, lastMatchData.value)) {
		await Promise.all([
			db.gamedata.update(DbCollectionItemNameGameDataComboCount, { value: 0 }),
			db.gamedata.update(DbCollectionItemNameGameDataScoreValue, { value: SCORE_CONFIG.BASE_VALUE }),
		]);
	}
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
