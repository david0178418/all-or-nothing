import { useState } from 'react';
import PlayingCard from './playing-card';
import { usePushToastMsg } from '@/atoms';
import { useRxData, } from 'rxdb-hooks';
import { shuffleArray } from 'rxdb';
import { Card, SetOrders } from '@/types';
import { useInterval } from '../hooks';
import FormattedTime from './formatted-time';
import AdLinkSection from './ad-link-section';
import PauseDialog from './pause-dialog';
import GameOverDialog from './game-over-dialog';
import { generateDeck, isSet, setExists } from '@/core';
import {
	Grid,
	Box,
	Button,
	ButtonGroup,
	Container,
	Typography,
} from '@mui/material';

const {
	VITE_AD_CONTENT_URL = '',
} = import.meta.env;

export default
function Game() {
	const [paused, setPaused] = useState(false);
	const { result: setOrders } = useRxData<SetOrders>('setorders', collection => collection.find());
	const { result: gameData  } = useRxData<{id: string; value: number}>('gamedata', collection => collection.find({ selector: { id: 'time' } }));
	const pushToastMsg = usePushToastMsg();
	const [selectedCards, setSelectedCards] = useState<string[]>([]);
	const time = gameData?.find(doc => doc.id === 'time');
	const deckOrder = setOrders.find(order => order.name === 'deck');
	const discardOrder = setOrders.find(order => order.name === 'discard');
	const deck = deckOrder?.order.map<Card>(id => ({ id, ...JSON.parse(id) }));
	const dealtCards = deck?.slice(0, 12);
	// Todo: Clean this all up.
	const gameComplete = !deckOrder?.order.length || (
		(!!deck && deck.length <= 12) && !!dealtCards && !setExists(dealtCards)
	);
	const runTimer = time && !gameComplete && !paused;

	useInterval(() => {
		time?.patch({
			value: time.value + 1,
		});
	}, runTimer ? 1000 : null);

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
					<Grid
						container
						rowSpacing={1}
						columns={{
							xs: 3,
							sm: 6,
						}}
					>
						{dealtCards.map(card => (
							<Grid
								item
								xs={1}
								key={card.id}
								display="flex"
								justifyContent="center"
							>
								<Box maxWidth="80%">
									<PlayingCard
										flipped={paused}
										card={card}
										selected={selectedCards.includes(card.id)}
										onClick={() => toggleSelected(card.id)}
									/>
								</Box>
							</Grid>
						))}
					</Grid>
				</Box>
				<Grid
					container
					paddingTop={3}
					paddingBottom={20}
					columns={{
						xs: 1,
						sm: 2,
					}}
				>
					<Grid item xs={1} textAlign={{ xs: 'center', sm: 'left' }}>
						<FormattedTime label="Time:" value={time.value} />
						<Typography variant="subtitle1" sx={{marginTop: 1}}>
							{deck.length} cards left in the deck
						</Typography>
					</Grid>
					<Grid item xs={1} textAlign={{ xs: 'center', sm: 'right' }}>
						<Box width="100%">
							<ButtonGroup variant="contained">
								<PauseDialog
									paused={paused}
									onPause={() => setPaused(true)}
									onUnpause={() => setPaused(false)}
								/>
								<Button onClick={() => handleHintMessage(dealtCards)}>
									Set Exists?
								</Button>
								<Button onClick={handleReshuffle}>
									Shuffle
								</Button>
								<Button onClick={handleReset}>
									New Game
								</Button>
							</ButtonGroup>
						</Box>
					</Grid>
				</Grid>
			</Container>
			<GameOverDialog
				remainingCards={dealtCards.length}
				isGameOver={gameComplete}
				time={time.value}
				onRestart={handleReset}
			/>
			{VITE_AD_CONTENT_URL && (
				<AdLinkSection
					open={gameComplete || paused}
					contentUrl={VITE_AD_CONTENT_URL}
				/>
			)}
		</>
	);

	function handleReset() {
		deckOrder?.patch({
			order: generateDeck(),
		});
		discardOrder?.patch({
			order: [],
		});
		time?.patch({
			value: 0,
		});
		setSelectedCards([]);
	}

	function handleReshuffle() {
		setSelectedCards([]);
		deckOrder?.patch({
			order: shuffleArray(deckOrder.order),
		});
	}
	function toggleSelected(cardId: string) {
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

		const newSelectedCards = dealtCards
			?.filter(card => newSelectedCardIds.includes(card.id)) as [Card, Card, Card];

		if(isSet(...newSelectedCards)) {
			deckOrder?.patch({
				order: deckOrder.order.filter(id => !newSelectedCardIds.includes(id)),
			});
			discardOrder?.patch({
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
