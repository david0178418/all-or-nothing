import PlayingCard from '@/components/playing-card';
import { Card } from '@/types';
import { useInterval } from '@/utils';
import { Grid, Box } from '@mui/material';
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebouncedValue } from '@/hooks';
import { useFocusable } from '@/focus/useFocusable';
import { useSetActiveGroup } from '@/atoms';
import { useDiscardPile } from './game-play-area';

interface Props {
	shuffleCount: number;
	cards: Card[];
	selectedCards: string[];
	raised?: boolean;
	paused?: boolean;
	onSelected(card: Card): void;
}

// Wrapper component for individual card with focus support
function FocusableCard({
	card,
	paused,
	raised,
	selected,
	dealt,
	onSelected,
	gridPosition,
}: {
	card: Card;
	paused: boolean;
	selected: boolean;
	raised?: boolean;
	dealt: boolean;
	onSelected: (card: Card) => void;
	gridPosition: { row: number; col: number };
}) {
	// Prevent double-activation from mouse and keyboard/controller
	const isActivatingRef = useRef(false);

	const handleCardSelection = useCallback(() => {
		// Prevent double execution
		if (isActivatingRef.current) {
			return;
		}

		isActivatingRef.current = true;
		onSelected(card);

		// Reset after a short delay
		setTimeout(() => {
			isActivatingRef.current = false;
		}, 100);
	}, [card, onSelected]);

	const { ref, isFocused } = useFocusable({
		id: `card-${card.id}`,
		group: 'cards',
		gridPosition,
		onSelect: handleCardSelection, // Use wrapped function for keyboard/controller
		disabled: paused,
	});

	return (
		<PlayingCard
			card={card}
			dealt={dealt}
			raised={raised}
			flipped={paused}
			selected={selected}
			focused={isFocused}
			onClick={handleCardSelection} // Use same wrapped function for mouse
			elementRef={ref}
		/>
	);
}

export default
function GameCardArea(props: Props) {
	const {
		shuffleCount: rawShffleCount,
		cards: unDebouncedRawCards,
		paused,
		selectedCards,
		onSelected,
	} = props;
	const rawCards = useDebouncedValue(unDebouncedRawCards, 100);
	const discardPile = useDiscardPile();
	const [shuffleCount, setShuffleCount] = useState(rawShffleCount);
	const [cards, setCards] = useState<Card[]>([]);
	const [newCards, setNewCards] = useState<Card[]>([]);
	const setActiveGroup = useSetActiveGroup();

	useEffect(() => {
		setCards(rawCards);

		const insertedCards = rawCards.filter(rawCard => !cards.find(card => card.id === rawCard.id));

		setNewCards(
			// TODO Figure out a more solid way of doing this.
			insertedCards.length > 3 ?
				rawCards :
				insertedCards,
		);

		setShuffleCount(rawShffleCount);
	}, [JSON.stringify(rawCards)]);

	useInterval(() => {
		setNewCards(newCards.slice(1));
	}, newCards.length ? 150 : null);

	// Set active group when cards are ready and not paused
	useEffect(() => {
		if (!paused && cards.length > 0) {
			setActiveGroup('cards');
		}
	}, [paused, cards.length, setActiveGroup]);

	// Determine grid columns based on screen size (using MUI breakpoints logic)
	const getGridPosition = (index: number, columns: number): { row: number; col: number } => {
		return {
			row: Math.floor(index / columns),
			col: index % columns,
		};
	};

	return (
		<Grid
			container
			rowSpacing={1}
			columns={{
				xs: 3,
				sm: 6,
			}}
		>
			<AnimatePresence mode="popLayout">
				{cards.map((card, index) => {
					// Assuming desktop (6 columns) for focus navigation
					// Could be improved with media query detection
					const gridPosition = getGridPosition(index, 6);

					return (
						<Grid
							key={`${shuffleCount}-${card.id}`}
							component={motion.div}
							display="flex"
							justifyContent="center"
							size={1}
							initial={{
								x: '100vw',
								y: '-50vh',
								zIndex: 1000,
							}}
							animate={{
								x: 1,
								y: 1,
								transition: {
									delay: newCards.findIndex(nc => nc.id === card.id) * .15,
								},
								transitionEnd: {
									zIndex: 1,
								},
							}}
							exit={{
								x: '-100vw',
								y: '-50vh',
								zIndex: 1000,
								transition: {
									duration: .5,
								},
							}}
						>
							<Box maxWidth="80%">
								{card && (
									<FocusableCard
										card={card}
										// TODO Something of hack.  The card is raised off the board if it
										// is selected.  If it is found to be in a set, it is deselected and discarded.
										// The animation transitions the card out after it is removed. Once a card is
										// found to be in a set, it is removed from the available cards and put into
										// the discarded list. To prevent it from falling back to the board before
										// being removed, a "raised" flag is being used to artificially keep it
										// elevated until it transitions out.  However, this isn't a blocking operation.
										// The writes to indexeddb are async, which means for a time, it's in neither.
										// Therefore, this value is currently being debounced internally in the Card
										// component to skip over that time period.
										//
										// All that said, there's a strong smell here, indicated that there's likely a
										// better way to handle this that I need to figure out later.
										raised={!!discardPile?.order.find(cardId => cardId === card.id)}
										dealt={!newCards.find(newCard => newCard.id === card.id)}
										paused={paused || !!newCards.find(newCard => newCard.id === card.id)}
										selected={!!card.id && selectedCards.includes(card.id)}
										onSelected={onSelected}
										gridPosition={gridPosition}
									/>
								)}
							</Box>
						</Grid>
					);
				})}
			</AnimatePresence>
		</Grid>
	);
}
