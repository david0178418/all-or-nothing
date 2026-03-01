import PlayingCard from '@/components/playing-card';
import { Card } from '@/types';
import { useInterval, useActivationGuard } from '@/hooks';
import { Grid, Box, useTheme, useMediaQuery } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebouncedValue } from '@/hooks';
import { useFocusable } from '@/focus/useFocusable';
import { useSetActiveGroup } from '@/focus/focus-atoms';

interface Props {
	shuffleCount: number;
	cards: Card[];
	selectedCards: string[];
	discardingCardIds: string[];
	raised?: boolean;
	paused?: boolean;
	onSelected(card: Card): void;
	onDiscardAnimationComplete(cardIds: string[]): void;
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
	const handleSelect = useCallback(() => {
		onSelected(card);
	}, [card, onSelected]);

	const handleCardSelection = useActivationGuard(handleSelect);

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
		discardingCardIds,
		onSelected,
		onDiscardAnimationComplete,
	} = props;
	const rawCards = useDebouncedValue(unDebouncedRawCards, 100);
	const [shuffleCount, setShuffleCount] = useState(rawShffleCount);
	const [cards, setCards] = useState<Card[]>([]);
	const [newCards, setNewCards] = useState<Card[]>([]);
	const setActiveGroup = useSetActiveGroup();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

	const columns = isMobile ? 3 : 6;

	return (
		<Grid
			container
			rowSpacing={1}
			paddingBottom={1}
			columns={{
				xs: 3,
				sm: 6,
			}}
			sx={{
				height: {
					xs: '100%',
					sm: 'auto',
				},
				maxHeight: {
					xs: '100%',
					sm: 'none',
				},
				minHeight: {
					sm: 'calc(min(100vw, 1536px) * 0.41 + 16px)',
				},
				'& > *': {
					height: {
						xs: 'calc(25% - 4px)',
						sm: 'auto',
					},
				},
			}}
		>
			<AnimatePresence mode="popLayout">
				{cards.map((card, index) => {
					const gridPosition = getGridPosition(index, columns);

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
							onAnimationComplete={(definition: any) => {
								if (definition === 'exit' && card.id) {
									onDiscardAnimationComplete([card.id]);
								}
							}}
						>
							<Box
								data-card-id={card.id}
								sx={{
									maxWidth: '80%',
									width: '100%',
									height: {
										xs: '100%',
										sm: 'auto',
									},
									'& > div': {
										height: {
											xs: '100%',
											sm: 'auto',
										},
										width: {
											xs: 'auto',
											sm: 350,
										},
									},
								}}
							>
								{card && (
									<FocusableCard
										card={card}
										raised={!!card.id && discardingCardIds.includes(card.id)}
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
