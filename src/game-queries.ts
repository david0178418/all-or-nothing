import { useLiveQuery } from 'dexie-react-hooks';
import { getDb } from '@/core';
import { Card } from '@/types';
import {
	DbCollectionItemNameGameDataTime,
	DbCollectionItemNameGameDataShuffleCount,
	DbCollectionItemNameGameDataScore,
	DbCollectionItemNameGameDataScoreValue,
	DbCollectionItemNameGameDataComboCount,
	DbCollectionItemNameGameDataLastMatchTime,
	DbCollectionItemNameSetOrdersDeck,
	DbCollectionItemNameSetOrdersDiscard,
} from '@/constants';

const db = getDb();

export function useDeck() {
	const result = useLiveQuery(() => db.setorders.get(DbCollectionItemNameSetOrdersDeck));
	return result?.order.map<Card>(id => ({ id, ...JSON.parse(id) })) || [];
}

export function useTime() {
	return useLiveQuery(() => db.gamedata.get(DbCollectionItemNameGameDataTime))?.value || 0;
}

export function useShuffleCount() {
	return useLiveQuery(() => db.gamedata.get(DbCollectionItemNameGameDataShuffleCount))?.value || 0;
}

export function useDeckOrder() {
	return useLiveQuery(() => db.setorders.get(DbCollectionItemNameSetOrdersDeck));
}

export function useDiscardPile() {
	return useLiveQuery(() => db.setorders.get(DbCollectionItemNameSetOrdersDiscard));
}

export function useScore() {
	return useLiveQuery(() => db.gamedata.get(DbCollectionItemNameGameDataScore))?.value || 0;
}

export function useScoreValue() {
	return useLiveQuery(() => db.gamedata.get(DbCollectionItemNameGameDataScoreValue))?.value || 1000;
}

export function useComboCount() {
	return useLiveQuery(() => db.gamedata.get(DbCollectionItemNameGameDataComboCount))?.value || 0;
}

export function useLastMatchTime() {
	return useLiveQuery(() => db.gamedata.get(DbCollectionItemNameGameDataLastMatchTime))?.value || 0;
}
