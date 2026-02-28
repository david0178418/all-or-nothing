import { useState, useEffect, useRef, useMemo } from 'react';
import { useIsPaused, usePushToastMsg, useSetIsPaused } from '@/atoms';
import { Card } from '@/types';
import AdLinkSection from '@/components/ad-link-section';
import GameOverDialog from './game-over-dialog';
import {
	discardCards,
	getDb,
	isSet,
	setExists,
	shuffleDeck,
	awardMatchScore,
	penalizeInvalidSet,
	penalizeUnnecessaryShuffle,
	resetComboState,
} from '@/core';
import GameTimer from './game-timer';
import GameScore from './game-score';
import GameOptions from './game-options';
import GameOptionsMobile from './game-options-mobile';
import GameCardArea from './game-card-area';
import GameComboIndicator from './game-combo-indicator';
import { useLiveQuery } from 'dexie-react-hooks';
import {
	Box,
	Container,
	Typography,
} from '@mui/material';
import {
	DbCollectionItemNameGameDataShuffleCount,
	DbCollectionItemNameGameDataTime,
	DbCollectionItemNameGameDataScore,
	DbCollectionItemNameGameDataScoreValue,
	DbCollectionItemNameGameDataComboCount,
	DbCollectionItemNameGameDataLastMatchTime,
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
	const score = useScore();
	const soundEffects = useSoundEffects();
	const shuffleCount = useShuffleCount();
	const paused = useIsPaused();
	const setIsPaused = useSetIsPaused();
	const pushToastMsg = usePushToastMsg();
	const [selectedCards, setSelectedCards] = useState<string[]>([]);
	const [discardingCards, setDiscardingCards] = useState<string[]>([]);
	const [gameGeneration, setGameGeneration] = useState(0);
	const prevDiscardLengthRef = useRef<number | null>(null);
	const deckOrder = useDeckOrder();
	const discardPile = useDiscardPile();
	const dealtCards = deck?.slice(0, BoardCardCount);
	const canShuffle = (deckOrder?.order.length || 0) > BoardCardCount;

	// Memoize based on serialized card IDs to avoid running O(n³) setExists
	// on every render caused by selectedCards/discardingCards/paused changes
	const dealtCardKey = dealtCards.map(c => c.id).join(',');
	const gameComplete = useMemo(() => (
		!!discardPile &&
		// TODO This is an arbitrary limit. But basically, it's a placeholder for
		// "the game has loaded" flag since "deck" will initially be an empty array.
		// But this works well enough for now.
		discardPile.order.length > 10 &&
		!!deck &&
		deck.length <= 12 &&
		!setExists(dealtCards)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	), [discardPile?.order.length, deck.length, dealtCardKey]);

	// Reset combo state when the game screen mounts (continuing a game should not preserve combo)
	useEffect(() => {
		resetComboState();
	}, []);

	// Detect new game start (discard pile reset) and clear local state
	useEffect(() => {
		const currentLength = discardPile?.order.length ?? null;
		const prevLength = prevDiscardLengthRef.current;

		// Discard pile going from non-empty to empty only happens on game reset
		if (prevLength !== null && prevLength > 0 && currentLength === 0) {
			setSelectedCards([]);
			setDiscardingCards([]);
			setGameGeneration(g => g + 1);
		}

		prevDiscardLengthRef.current = currentLength;
	}, [discardPile?.order.length]);

	// Keep input handler in a ref so listeners don't need re-registration
	// when paused/canShuffle/dealtCards change
	const gameInputHandlerRef = useRef<(event: InputEvent) => void>(() => {});
	gameInputHandlerRef.current = (event: InputEvent) => {
		const { action } = event;

		if (action === InputAction.PAUSE) {
			setIsPaused(!paused);
		}

		if (action === InputAction.HINT && !paused) {
			handleHintMessage(dealtCards);
		}

		if (action === InputAction.SHUFFLE && !paused && canShuffle) {
			handleReshuffle();
		}
	};

	// Register listeners once; the ref always points to the latest handler
	useEffect(() => {
		const gamepadManager = getGamepadManager();
		const keyboardManager = getKeyboardManager();

		const handleGameInput = (event: InputEvent) => {
			gameInputHandlerRef.current(event);
		};

		gamepadManager.addListener(handleGameInput);
		keyboardManager.addListener(handleGameInput);

		return () => {
			gamepadManager.removeListener(handleGameInput);
			keyboardManager.removeListener(handleGameInput);
		};
	}, []);

	return (
		<>
			<Container
				maxWidth="xl"
				sx={{
					position: 'relative',
					padding: 0,
					marginTop: {
						xs: 0,
						sm: 5,
					},
					height: {
						xs: '100vh',
						sm: 'auto',
					},
					display: {
						xs: 'flex',
						sm: 'block',
					},
					flexDirection: {
						xs: 'column',
						sm: 'row',
					},
				}}
			>
				<Box
					sx={{
						flexGrow: {
							xs: 1,
							sm: 'unset',
						},
						flexShrink: {
							xs: 1,
							sm: 'unset',
						},
						minHeight: {
							xs: 0,
							sm: 'auto',
						},
						overflowY: 'visible',
						paddingTop: {
							xs: 2,
							sm: 0,
						},
						paddingBottom: {
							xs: 2,
							sm: 0,
						},
					}}
				>
					<GameCardArea
						key={gameGeneration}
						shuffleCount={shuffleCount}
						cards={dealtCards}
						selectedCards={selectedCards}
						discardingCardIds={discardingCards}
						paused={paused}
						onSelected={card => card.id && toggleSelected(card.id)}
						onDiscardAnimationComplete={cardIds => {
							setDiscardingCards(prev => prev.filter(id => !cardIds.includes(id)));
						}}
					/>
				</Box>
				<GameComboIndicator />
				<Box
					paddingX={1}
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					sx={{
						paddingTop: {
							xs: 2,
							sm: 1,
						},
						paddingBottom: {
							xs: 2,
							sm: 0,
						},
						marginBottom: {
							xs: '72px',
							sm: 0,
						},
						flexShrink: {
							xs: 0,
							sm: 'unset',
						},
						backgroundColor: {
							xs: 'background.default',
							sm: 'transparent',
						},
					}}
				>
					<GameTimer gameComplete={gameComplete} />
					<GameScore gameComplete={gameComplete} />
					<Typography variant="h5">
						{deck.length} cards left
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
				score={score}
			/>
			{VITE_AD_CONTENT_URL && (
				<AdLinkSection
					open={gameComplete || paused}
					contentUrl={VITE_AD_CONTENT_URL}
				/>
			)}
		</>
	);

	async function handleReshuffle() {
		if (!(dealtCards && deckOrder)) {
			return;
		}

		const hasSet = setExists(dealtCards);

		if (hasSet) {
			await penalizeUnnecessaryShuffle();
		} else {
			await awardMatchScore(time);
		}

		setSelectedCards([]);
		await shuffleDeck();
	}
	async function toggleSelected(cardId: string) {
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
			await awardMatchScore(time);
			setDiscardingCards(prev => [...prev, ...newSelectedCardIds]);
			await discardCards(newSelectedCardIds, BoardCardCount);
			pushToastMsg('Set found!');
			soundEffects('success');
			setSelectedCards([]);
		} else {
			await penalizeInvalidSet();
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

function useDeckOrder() {
	return useLiveQuery(() => db.setorders.get(DbCollectionItemNameSetOrdersDeck));
}

export
function useDiscardPile() {
	return useLiveQuery(() => db.setorders.get(DbCollectionItemNameSetOrdersDiscard));
}

export
function useScore() {
	return useLiveQuery(() => db.gamedata.get(DbCollectionItemNameGameDataScore))?.value || 0;
}

export
function useScoreValue() {
	return useLiveQuery(() => db.gamedata.get(DbCollectionItemNameGameDataScoreValue))?.value || 1000;
}

export
function useComboCount() {
	return useLiveQuery(() => db.gamedata.get(DbCollectionItemNameGameDataComboCount))?.value || 0;
}

export
function useLastMatchTime() {
	return useLiveQuery(() => db.gamedata.get(DbCollectionItemNameGameDataLastMatchTime))?.value || 0;
}

// Debug
(window as any).db = db
