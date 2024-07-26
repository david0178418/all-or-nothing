import './styles.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { createRoot } from 'react-dom/client';
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

type Enum<T extends object> = T[keyof T];

type BitwiseValue = Enum<typeof BitwiseValues>;

const BitwiseValues = {
	One: 1,
	Two: 2,
	Three: 4,
} as const;

const appEl = document.getElementById('app');

const root = appEl && createRoot(appEl);

root?.render(<Game />);

function Game() {
	const [deck, setDeck] = useState<Card[]>(createDeck);
	const [discardPile, setDiscardPile] = useState<Card[]>([]);
	const [selectedCards, setSelectedCards] = useState<string[]>([]);
	const dealtCards = deck.slice(0, 12);

	return (
		<>
			<Container maxWidth="md" sx={{textAlign: 'center'}}>
				<Box sx={{
					backgroundColor: '#a9a9a9',
					border: '2px solid black',
					borderRadius: 1,
					paddingY: 2,
				}}>
					<Grid
						container
						rowSpacing={1}
						columns={{
							xs: 2,
							sm: 4,
							md: 6,
						}}
					>
						{dealtCards.map(card => (
							<Grid
								xs={1}
								key={card.id}
								display="flex"
								justifyContent="center"
							>
								<Card
									card={card}
									selected={selectedCards.includes(card.id)}
									onClick={() => toggleSelected(card.id)}
								/>
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
		setDeck(shuffle(deck));
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
			setSelectedCards([]);
			setDiscardPile([...discardPile, ...newSelectedCards]);
			setDeck(deck.filter(card => !newSelectedCardIds.includes(card.id)));
		} else {
			setSelectedCards(newSelectedCardIds);
		}


		setSelectedCards(newSelectedCardIds);
	}
	function handleHintMessage(cards: Card[]) {
		setExists(cards) ?
			alert('A set exists!') :
			alert('No set exists.');
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

	return shuffle(newDeck);
}

function shuffle<T>(array: T[]): T[] {
	const newArray = array.slice();

	// Fisher-Yates Shuffle
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		// @ts-ignore
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}

	return newArray;
}

const Shapes = {
	triangle: BitwiseValues.One,
	circle: BitwiseValues.Two,
	square: BitwiseValues.Three,
} as const;
const ShapeValues = {
	[BitwiseValues.One]: 'triangle',
	[BitwiseValues.Two]: 'circle',
	[BitwiseValues.Three]: 'square',
} as const;

const Colors = {
	red: 1,
	green: 2,
	blue: 4,
} as const;
const ColorValues = {
	[BitwiseValues.One]: '#FF0000',
	[BitwiseValues.Two]: '#00FF00',
	[BitwiseValues.Three]: '#0000FF',
} as const;

const Fills = {
	outline: BitwiseValues.One,
	solid: BitwiseValues.Two,
	filled: BitwiseValues.Three,
} as const;
const FillValues = {
	[BitwiseValues.One]: 'outline',
	[BitwiseValues.Two]: 'solid',
	[BitwiseValues.Three]: 'filled',
} as const;

const Counts = {
	one: BitwiseValues.One,
	two: BitwiseValues.Two,
	three: BitwiseValues.Three,
} as const;
const CountValues = {
	[BitwiseValues.One]: 1,
	[BitwiseValues.Two]: 2,
	[BitwiseValues.Three]: 3,
} as const;

interface Card {
	id: string;
	shape: Enum<typeof Shapes>;
	color: Enum<typeof Colors>;
	fill: Enum<typeof Fills>;
	count: Enum<typeof Counts>;
}

interface CardProps {
	card: Card;
	selected: boolean;
	onClick(): void;
}

function Card(props: CardProps) {
	const {
		onClick,
		selected,
		card: {
			color,
			count,
			fill,
			shape,
		}
	} = props;

	return (
		<Box
			width="108px"
			height="160px"
			border="2px solid black"
			padding="5px"
			display="flex"
			borderRadius="10px"
			boxShadow="3px 3px 4px #000"
			onClick={onClick}
			sx={{ cursor: 'pointer' }}
			bgcolor={selected ? 'red' : 'white'}
		>
			<Box
				flex="1"
				bgcolor="white"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
			>
				{Array(CountValues[count]).fill(0).map((_, i) => (
					<Shape
						key={i}
						color={ColorValues[color]}
						fill={FillValues[fill]}
						type={ShapeValues[shape]}
					/>
				))}
			</Box>
		</Box>
	);
}

interface ShapeProps {
	color: string;
	fill: 'outline' | 'solid' | 'filled';
	type: 'triangle' | 'circle' | 'square';
}

function Shape(props: ShapeProps) {
	const {
		color,
		fill,
		type,
	} = props;
	const fillColor = (fill === 'outline' ? 'none' : color);
	const opacity = fill === 'filled' ? '59' : '';

	return (
		<Box
			width={50}
			height={50}
			textAlign="center"
		>
			{type === 'triangle' && (
				<Triangle
					stroke={color}
					fill={fillColor+opacity}
				/>
			)}
			{type === 'circle' && (
				<Circle
					stroke={color}
					fill={fillColor+opacity}
				/>
			)}
			{type === 'square' && (
				<Square
					stroke={color}
					fill={fillColor+opacity}
				/>
			)}
		</Box>
	);
}

interface FooProps {
	stroke: string;
	fill: string;
}

function Triangle(props: FooProps) {
	const { fill, stroke } = props;
	return (
		<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
			<polygon
				points="50,15 90,85 10,85"
				fill={fill}
				stroke={stroke}
				strokeWidth={4}
			/>
		</svg>
	);
}

function Circle(props: FooProps) {
	const { fill, stroke } = props;
	return (
		<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
			<circle
				cx="50"
				cy="50"
				r="40"
				fill={fill}
				stroke={stroke}
				strokeWidth={4}
			/>
		</svg>
	);
}

function Square(props: FooProps) {
	const { fill, stroke } = props;
	return (
		<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
			<rect
				x="10"
				y="10"
				width="80"
				height="80"
				fill={fill}
				stroke={stroke}
				strokeWidth={4}
			/>
		</svg>
	);
}
