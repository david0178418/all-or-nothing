import { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { QuestionMark } from '@mui/icons-material';
import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Fab,
	Typography,
} from '@mui/material';
import { randomizeArray } from 'src/utils';
import { BitwiseValue, Card, Colors, Counts, Fills, Shapes } from 'src/types';
import PlayingCard from './playing-card';
import { usePushToastMsg } from 'src/atoms';

export default
function Game() {
	const pushToastMsg = usePushToastMsg();
	const [deck, setDeck] = useState<Card[]>(createDeck);
	const [discardPile, setDiscardPile] = useState<Card[]>([]);
	const [selectedCards, setSelectedCards] = useState<string[]>([]);
	const dealtCards = deck.slice(0, 12);

	return (
		<>
			<Container
				maxWidth="md"
				sx={{ xs: { padding: 0 } }}
			>
				<Box sx={{
					// backgroundColor: '#a9a9a9',
					// border: '2px solid black',
					// borderRadius: 1,
					// paddingY: 2,
				}}>
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
						<Button onClick={handleRestart}>
							New Game
						</Button>
					</ButtonGroup>
				</Box>
				<Fab
					href="https://web.archive.org/web/20110702055910/http://www.davidgranado.com/2010/11/make-a-set-game/"
					color="primary"
					target="_blank"
					size="small"
					sx={{
						position: 'fixed',
						bottom: 16,
						right: 16,
					}}
				>
					<QuestionMark />
				</Fab>
			</Container>
		</>
	);

	function handleReshuffle() {
		setSelectedCards([]);
		setDeck(randomizeArray(deck));
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
			setDiscardPile([...discardPile, ...newSelectedCards]);
			setDeck(deck.filter(card => !newSelectedCardIds.includes(card.id)));
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
	function handleRestart() {
		setDiscardPile([]);
		setSelectedCards([]);
		setDeck(createDeck());
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

function createDeck() {
	const newDeck: Card[] = [];

	Object.values(Fills).forEach(fill => {
		Object.values(Colors).forEach(color => {
			Object.values(Shapes).forEach(shape => {
				Object.values(Counts).forEach(count => {
					newDeck.push({
						id: `fill${fill}-color${color}-shape${shape}-count${count}`,
						fill,
						color,
						shape,
						count,
					});
				});
			});
		});
	});

	return randomizeArray(newDeck);
}
