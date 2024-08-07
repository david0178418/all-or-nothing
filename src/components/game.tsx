import { useState } from 'react';
import PlayingCard from './playing-card';
import { usePushToastMsg } from '@/atoms';
import { useRxData, } from 'rxdb-hooks';
import { shuffleArray } from 'rxdb';
import { generateDeck, isSet, setExists } from '@/core';
import { Card, SetOrders } from '@/types';
import {
	Grid,
	Box,
	Button,
	ButtonGroup,
	Container,
	Typography,
} from '@mui/material';

export default
function Game() {
	const { result: setOrders, isFetching } = useRxData<SetOrders>('setorders', collection => collection.find());
	const pushToastMsg = usePushToastMsg();
	const [selectedCards, setSelectedCards] = useState<string[]>([]);

	if(!setOrders || isFetching) {
		return null;
	}

	const deckOrder = setOrders.find(order => order.name === 'deck');
	const discardOrder = setOrders.find(order => order.name === 'discard');

	if(!(deckOrder && discardOrder)) {
		return null;
	}

	const deck = deckOrder.order.map<Card>(id => ({ id, ...JSON.parse(id) }));

	const dealtCards = deck.slice(0, 12);

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
					columns={{ xs: 1, sm: 2 }}
				>
					<Grid item xs={1} textAlign={{ xs: 'center', sm: 'left' }}>
						<Typography variant="subtitle1" sx={{marginTop: 1}}>
							{deck.length} cards left in the deck
						</Typography>
					</Grid>
					<Grid item xs={1} textAlign={{ xs: 'center', sm: 'right' }}>
						<Box width="100%">
							<ButtonGroup variant="contained">
								<Button onClick={handleReshuffle}>
									Shuffle
								</Button>
								<Button onClick={() => handleHintMessage(dealtCards)}>
									Set Exists?
								</Button>
								<Button onClick={async () => {
									await Promise.all([
											deckOrder?.patch({
											order: generateDeck(),
										}),
										discardOrder?.patch({
											order: [],
										})
									]);
									setSelectedCards([]);
								}}>
									New Game
								</Button>
							</ButtonGroup>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</>
	);

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
			.filter(card => newSelectedCardIds.includes(card.id)) as [Card, Card, Card];

		if(isSet(...newSelectedCards)) {
			// setDiscardPile([...discardPile, ...newSelectedCards]);
			// setDeck(deck.filter(card => !newSelectedCardIds.includes(card.id)));
			deckOrder?.patch({
				order: deckOrder.order.filter(id => !newSelectedCardIds.includes(id)),
			});
			discardOrder?.patch({
				order: [...discardOrder.order, ...newSelectedCardIds],
			});
			pushToastMsg('Set found!');
		} else {
			setSelectedCards(newSelectedCardIds);
			pushToastMsg('Not a set.');
		}

		setSelectedCards([]);


		setSelectedCards(newSelectedCardIds);
	}
	function handleHintMessage(cards: Card[]) {
		setExists(cards) ?
			pushToastMsg('A set exists!') :
			pushToastMsg('No set exists.');
	}
}
