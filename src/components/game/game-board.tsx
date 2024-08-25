import { useState } from 'react';
import PlayingCard from '@/components/playing-card';
import { usePausedState, usePushToastMsg } from '@/atoms';
import { useRxData, } from 'rxdb-hooks';
import { shuffleArray } from 'rxdb';
import { Card, SetOrders } from '@/types';
import { useInterval } from '@/hooks';
import FormattedTime from '@/components/formatted-time';
import AdLinkSection from '@/components/ad-link-section';
import GameOverDialog from './game-over-dialog';
import { isSet, setExists } from '@/core';
import {
	Menu as MenuIcon,
	Pause as PauseIcon,
	QuestionMark as QuestionMarkIcon,
	Shuffle as ShuffleIcon,
} from '@mui/icons-material';
import {
	Grid,
	Box,
	Button,
	ButtonGroup,
	Container,
	Typography,
	Fab,
	SwipeableDrawer,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	ListItemIcon,
} from '@mui/material';

const {
	VITE_AD_CONTENT_URL = '',
} = import.meta.env;

export default
function GameBoard() {
	const [paused] = usePausedState();
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
										selected={!!card.id && selectedCards.includes(card.id)}
										onClick={() => card.id && toggleSelected(card.id)}
									/>
								</Box>
							</Grid>
						))}
					</Grid>
				</Box>
				<Box
					paddingTop={3}
					textAlign={{ xs: 'center', sm: 'left' }}
				>
					<Timer gameComplete={gameComplete} />
					<Typography variant="subtitle1" sx={{marginTop: 1}}>
						{deck.length} cards left in the deck
					</Typography>
				</Box>
				<Bar
					onReshuffle={handleReshuffle}
					onHintMessage={() => handleHintMessage(dealtCards)}
				/>
			</Container>
			<Foo
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
			?.filter(card => !!card.id && newSelectedCardIds.includes(card.id)) as [Card, Card, Card];

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

interface BarProps {
	onReshuffle(): void;
	onHintMessage(): void;
}

function Bar(props: BarProps) {
	const [, setIsPaused] = usePausedState();
	const {
		onReshuffle,
		onHintMessage,
	} = props;

	return (
		<Box
			paddingTop={3}
			paddingBottom={20}
			textAlign="center"
			display={{
				xs: 'none',
				sm: 'block',
			}}
		>
			<ButtonGroup variant="outlined">
				<Button onClick={() => setIsPaused(true)} startIcon={<PauseIcon/>}>
					Pause
				</Button>
				<Button onClick={onHintMessage} startIcon={<QuestionMarkIcon />}>
					Hint
				</Button>
				<Button onClick={onReshuffle} startIcon={<ShuffleIcon />}>
					Shuffle
				</Button>
			</ButtonGroup>
		</Box>
	);
}

interface Props {
	gameComplete?: boolean;
}

function Timer(props: Props) {
	const { gameComplete } = props;
	const [paused] = usePausedState();
	const { result: gameData  } = useRxData<{id: string; value: number}>('gamedata', collection => collection.find({ selector: { id: 'time' } }));
	const time = gameData?.find(doc => doc.id === 'time');
	const runTimer = time && !gameComplete && !paused;

	useInterval(() => {
		time?.patch({
			value: time.value + 1,
		});
	}, runTimer ? 1000 : null);

	if(!time) {
		return null;
	}

	return (
		<FormattedTime label="Time:" value={time.value} />
	);
}

interface FooProps {
	onReshuffle(): void;
	onHintMessage(): void;
}

function Foo(props: FooProps) {
	const [, setIsPaused] = usePausedState();
	const [isOpen, setIsOpen] = useState(false);
	const {
		onReshuffle,
		onHintMessage,
	} = props;

	return (
		<>
			<Fab
				color="primary"
				size="small"
				sx={{
					position: 'fixed',
					bottom: 16,
					left: 16,
					display: {
						// xs: 'inline-flex',
						sm: 'none',
					}
				}}
				onClick={() => setIsOpen(true)}
			>
				<MenuIcon />
			</Fab>
			<SwipeableDrawer
				anchor="bottom"
				open={isOpen}
				onClose={() => setIsOpen(false)}
				onOpen={() => {}}

			>
				<List sx={{paddingBottom: 5}}>
					<ListItem>
						<ListItemButton
							onClick={() => {
								setIsOpen(false);
								setIsPaused(true);
							}}
						>
							<ListItemIcon>
								<PauseIcon />
							</ListItemIcon>
							<ListItemText>
								Pause
							</ListItemText>
						</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton
							onClick={() => {
								setIsOpen(false);
								onHintMessage();
							}}
						>
							<ListItemIcon>
								<QuestionMarkIcon />
							</ListItemIcon>
							<ListItemText>
								Hint
							</ListItemText>
						</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton
							onClick={() => {
								setIsOpen(false);
								onReshuffle();
							}}
						>
							<ListItemIcon>
								<ShuffleIcon />
							</ListItemIcon>
							<ListItemText>
								Sufffle
							</ListItemText>
						</ListItemButton>
					</ListItem>
				</List>
			</SwipeableDrawer>
		</>
	);
}
