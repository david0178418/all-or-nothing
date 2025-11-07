import { useState, useEffect } from 'react';
import { useIsPaused, usePushToastMsg, useSetIsPaused } from '@/atoms';
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
import { useSoundEffects } from '@/hooks';
import { getGamepadManager } from '@/input/gamepad-manager';
import { getKeyboardManager } from '@/input/keyboard-manager';
import { InputAction, InputEvent } from '@/input/input-types';

const {
	VITE_AD_CONTENT_URL = '',
} = import.meta.env;

const BoardCardCount = 12
const db = getDb();

export default
function GamePlayArea() {
	const deck = useDeck();
	const time = useTime();
	const soundEffects = useSoundEffects();
	const shuffleCount = useShuffleCount();
	const paused = useIsPaused();
	const setIsPaused = useSetIsPaused();
	const setOrders = useLiveQuery(() => db.setorders.toArray());
	const pushToastMsg = usePushToastMsg();
	const [selectedCards, setSelectedCards] = useState<string[]>([]);
	const deckOrder = setOrders?.find(order => order.name === DbCollectionItemNameSetOrdersDeck);
	const discardPile = setOrders?.find(order => order.name === DbCollectionItemNameSetOrdersDiscard);
	const dealtCards = deck?.slice(0, BoardCardCount);
	const canShuffle = (deckOrder?.order.length || 0) > BoardCardCount;

	const gameComplete = (
		!!discardPile &&
		// TODO This is an arbitrary limit. But basically, it's a placeholder for
		// "the game has loaded" flag since "deck" will initially be an empty array.
		// But this works well enough for now.
		discardPile.order.length > 10 &&
		!!deck &&
		deck.length <= 12 &&
		!setExists(dealtCards)
	);

	// Handle controller/keyboard input for game actions
	useEffect(() => {
		const gamepadManager = getGamepadManager();
		const keyboardManager = getKeyboardManager();

		const handleGameInput = (event: InputEvent) => {
			const { action } = event;

			switch (action) {
				case InputAction.PAUSE:
					setIsPaused(!paused);
					break;
				case InputAction.HINT:
					if (!paused) {
						handleHintMessage(dealtCards);
					}
					break;
				case InputAction.SHUFFLE:
					if (!paused && canShuffle) {
						handleReshuffle();
					}
					break;
			}
		};

		gamepadManager.addListener(handleGameInput);
		keyboardManager.addListener(handleGameInput);

		return () => {
			gamepadManager.removeListener(handleGameInput);
			keyboardManager.removeListener(handleGameInput);
		};
	}, [paused, canShuffle, dealtCards]);

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
			soundEffects('success');
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
