import { useState } from 'react';
import { useIsPaused, usePushToastMsg } from '@/atoms';
import { Card } from '@/types';
import AdLinkSection from '@/components/ad-link-section';
import GameOverDialog from './game-over-dialog';
import { discardCards, getDb, isSet, setExists, shuffleDeck} from '@/core';
import GameTimer from './game-timer';
import GameOptions from './game-options';
import GameOptionsMobile from './game-options-mobile';
import GameCardArea from './game-card-area';
import { useLiveQuery } from 'dexie-react-hooks';
import {
	Box,
	Container,
	Typography,
} from '@mui/material';
import {
	DbCollectionItemNameGameDataShuffleCount,
	DbCollectionItemNameGameDataTime,
	DbCollectionItemNameSetOrdersDeck,
	DbCollectionItemNameSetOrdersDiscard,
} from '@/constants';

const {
	VITE_AD_CONTENT_URL = '',
} = import.meta.env;

const BoardCardCount = 12
const db = getDb();

export default
function GamePlayArea() {
	const deck = useDeck();
	const time = useTime();
	const shuffleCount = useShuffleCount();
	const paused = useIsPaused();
	const setOrders = useLiveQuery(() => db.setorders.toArray());
	const pushToastMsg = usePushToastMsg();
	const [selectedCards, setSelectedCards] = useState<string[]>([]);
	const deckOrder = setOrders?.find(order => order.name === DbCollectionItemNameSetOrdersDeck);
	const discardCards = setOrders?.find(order => order.name === DbCollectionItemNameSetOrdersDiscard);
	const dealtCards = deck?.slice(0, BoardCardCount);
	const canShuffle = (deckOrder?.order.length || 0) > BoardCardCount;

	const gameComplete = (
		!!discardCards &&
		discardCards.order.length > 10 &&
		!!deck &&
		deck.length <= 12 &&
		!setExists(dealtCards)
	);

	return (
		<>
			<Container
				maxWidth="md"
				sx={{
					padding: 0,
					marginTop: {
						xs: 3,
						sm: 10,
					},
					overflow: {
						xs: 'hidden',
						sm: 'visible',
					},
				}}
			>
				<Box>
					<GameCardArea
						shuffleCount={shuffleCount}
						cards={dealtCards}
						selectedCards={selectedCards}
						paused={paused}
						onSelected={card => card.id && toggleSelected(card.id)}
					/>
				</Box>
				<Box
					paddingTop={3}
					textAlign={{ xs: 'center', sm: 'left' }}
				>
					<GameTimer gameComplete={gameComplete} />
					<Typography variant="subtitle1" sx={{marginTop: 1}}>
						{deck.length} cards left in the deck
					</Typography>
				</Box>
				<GameOptions
					canShuffle={canShuffle}
					onReshuffle={handleReshuffle}
					onHintMessage={() => handleHintMessage(dealtCards)}
				/>
			</Container>
			<GameOptionsMobile
				onReshuffle={handleReshuffle}
				onHintMessage={() => handleHintMessage(dealtCards)}
			/>
			<GameOverDialog
				remainingCards={dealtCards.length}
				isGameOver={gameComplete}
				time={time}
			/>
			{VITE_AD_CONTENT_URL && (
				<AdLinkSection
					open={gameComplete || paused}
					contentUrl={VITE_AD_CONTENT_URL}
				/>
			)}
		</>
	);

	function handleReshuffle() {
		setSelectedCards([]);
		shuffleDeck();
	}
	function toggleSelected(cardId: string) {
		if(!(deckOrder && dealtCards)) {
			return;
		}

		const selected = selectedCards.includes(cardId);

		if (!selected && selectedCards.length >= 3) {
			return;
		}

		const newSelectedCardIds = selected ?
			selectedCards.filter(id => id !== cardId):
			[...selectedCards, cardId];

		if (newSelectedCardIds.length !== 3) {
			setSelectedCards(newSelectedCardIds);
			return;
		}

		const newSelectedCards = dealtCards.filter(
			card => !!card.id && newSelectedCardIds.includes(card.id)
		) as [Card, Card, Card];

		if(isSet(...newSelectedCards)) {
			discardCards(newSelectedCardIds, BoardCardCount);
			pushToastMsg('Set found!');
			setSelectedCards([]);
		} else {
			setSelectedCards(newSelectedCardIds);
			pushToastMsg('Not a set.');
		}
	}
	function handleHintMessage(cards: Card[]) {
		setExists(cards) ?
			pushToastMsg('A set exists!') :
			pushToastMsg('No set exists.');
	}
}

function useDeck() {
	const result = useLiveQuery(() => db.setorders.get(DbCollectionItemNameSetOrdersDeck));
	return result?.order.map<Card>(id => ({ id, ...JSON.parse(id) })) || [];
}

export
function useTime() {
	return useLiveQuery(() => db.gamedata.get(DbCollectionItemNameGameDataTime))?.value || 0;
}

function useShuffleCount() {
	return useLiveQuery(() => db.gamedata.get(DbCollectionItemNameGameDataShuffleCount))?.value || 0;
}
