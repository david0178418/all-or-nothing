import { useState } from 'react';
import PlayingCard from './playing-card';
import { usePushToastMsg } from '../atoms';
import { useRxData, } from 'rxdb-hooks';
import { generateDeck } from '../app';
import {
	BitwiseValue,
	Card,
	SetOrders,
} from '../types';
import {
	Grid,
	Box,
	Button,
	ButtonGroup,
	Container,
	Typography,
} from '@mui/material';
import { shuffleArray } from 'rxdb';

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

	const deck = deckOrder.order.map(id => ({ id, ...JSON.parse(id) }));

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
				<Typography variant="subtitle1" sx={{marginTop: 1}}>
					{deck.length} cards left in the deck
				</Typography>
				<Box sx={{
					paddingY: 2,
					paddingX: {
						xs: 0,
						md: 10,
					},
				}}>
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

function isSet(a: Card, b: Card, c: Card) {
	return (
		allSameOrDifferent(a.color, b.color, c.color) &&
		allSameOrDifferent(a.fill, b.fill, c.fill) &&
		allSameOrDifferent(a.shape, b.shape, c.shape) &&
		allSameOrDifferent(a.count, b.count, c.count)
	);
}

function allSameOrDifferent(a: BitwiseValue, b: BitwiseValue, c: BitwiseValue) {
	return (
		// all are the same (bits AND to 'a'")
		((a & b & c) == a) ||
		// all are different (bits OR to '111' (7)")
		((a | b | c) == 7)
	);
}
