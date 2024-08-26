import { useEffect, useState } from 'react';
import { usePausedState, usePushToastMsg } from '@/atoms';
import { useRxData, } from 'rxdb-hooks';
import { shuffleArray } from 'rxdb';
import { Card, SetOrders } from '@/types';
import AdLinkSection from '@/components/ad-link-section';
import GameOverDialog from './game-over-dialog';
import { isSet, setExists } from '@/core';
import GameTimer from './game-timer';
import GameOptions from './game-options';
import GameOptionsMobile from './game-options-mobile';
import GameCardArea from './game-card-area';
import {
	Box,
	Container,
	Typography,
} from '@mui/material';
import { moveAndOverwriteItem } from '@/utils';

const {
	VITE_AD_CONTENT_URL = '',
} = import.meta.env;

const BoardCardCount = 12

export default
function GamePlayArea() {
	const [paused] = usePausedState();
	const { result: setOrders } = useRxData<SetOrders>('setorders', collection => collection.find());
	const { result: gameData  } = useRxData<{id: string; value: number}>('gamedata', collection => collection.find({ selector: { id: 'time' } }));
	const pushToastMsg = usePushToastMsg();
	const [selectedCards, setSelectedCards] = useState<string[]>([]);
	const time = gameData?.find(doc => doc.id === 'time');
	const deckOrder = setOrders.find(order => order.name === 'deck');
	const discardOrder = setOrders.find(order => order.name === 'discard');
	const deck = deckOrder?.order.map<Card>(id => ({ id, ...JSON.parse(id) }));
	const [dealtCards, setDealtCards] = useState(() => deck?.slice(0, BoardCardCount));
	// const dealtCards = deck?.slice(0, BoardCardCount);
	// Todo: Clean this all up.

	useEffect(() => {
		setDealtCards(deck?.slice(0, BoardCardCount));
	}, [setOrders]);

	const gameComplete = !deckOrder?.order.length || (
		(!!deck && deck.length <= 12) && !!dealtCards && !setExists(dealtCards)
	);

	if(!(deckOrder && discardOrder && time && dealtCards && deck)) {
		return null;
	}

	return (
		<>
			<Container
				maxWidth="md"
				sx={{ xs: { padding: 0 } }}
			>
				<Box>
					<GameCardArea
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
				time={time.value}
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
		deckOrder?.patch({
			order: shuffleArray(deckOrder.order),
		});
	}
	function toggleSelected(cardId: string) {
		if(!(deckOrder && discardOrder && dealtCards)) {
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
			const selectedIndexes = newSelectedCardIds.map(selectedId => deckOrder.order.indexOf(selectedId) || 0) as [number, number, number];

			deckOrder.patch({
				order: deckOrder.order.length > BoardCardCount ?
					dealNewCards(deckOrder.order, selectedIndexes, BoardCardCount):
					deckOrder.order.filter(id => !newSelectedCardIds.includes(id)),
			});
			discardOrder.patch({
				order: [...discardOrder.order, ...newSelectedCardIds],
			});
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

function dealNewCards(cardOrderIds: string[], removeCardIndexes: [number, number, number], dealtCardCount: number) {
	const foo1 = moveAndOverwriteItem(cardOrderIds, dealtCardCount, removeCardIndexes[0]);
	const foo2 = moveAndOverwriteItem(foo1, dealtCardCount, removeCardIndexes[1]);
	return moveAndOverwriteItem(foo2, dealtCardCount, removeCardIndexes[2]);
}
