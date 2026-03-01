import PlayingCard from '@/components/playing-card';
import { Card, ColorValues } from '@/types';
import { useInterval, useActivationGuard } from '@/hooks';
import { Grid, Box, useTheme, useMediaQuery } from '@mui/material';
import { useEffect, useState, useCallback, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebouncedValue } from '@/hooks';
import { useFocusable } from '@/focus/useFocusable';
import { useSetActiveGroup } from '@/focus/focus-atoms';
import { fireConvergenceConfetti } from '@/confetti';

interface ConvergenceData {
	offsets: Map<string, { dx: number; dy: number }>;
	center: { x: number; y: number };
	colors: string[];
}

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
	const [convergenceData, setConvergenceData] = useState<ConvergenceData | null>(null);
	const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const cardsRef = useRef(cards);
	cardsRef.current = cards;

	// Compute convergence offsets when cards are being discarded
	useLayoutEffect(() => {
		if (discardingCardIds.length === 0) {
			setConvergenceData(null);
			clearTimeout(confettiTimeoutRef.current);
			return;
		}

		if (discardingCardIds.length < 3) {
			return;
		}

		const batchIds = discardingCardIds.slice(-3);

		const positions = batchIds
			.map(id => {
				const el = document.querySelector(`[data-card-id="${CSS.escape(id)}"]`);
				if (!el) return null;
				const rect = el.getBoundingClientRect();
				return { id, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
			})
			.filter((p): p is NonNullable<typeof p> => p !== null);

		if (positions.length < 3) return;

		const centerX = positions.reduce((sum, p) => sum + p.x, 0) / positions.length;
		const centerY = positions.reduce((sum, p) => sum + p.y, 0) / positions.length;

		const offsets = new Map<string, { dx: number; dy: number }>();
		positions.forEach(p => {
			offsets.set(p.id, {
				dx: centerX - p.x,
				dy: centerY - p.y,
			});
		});

		const batchColors = batchIds
			.map(id => cardsRef.current.find(c => c.id === id))
			.filter((c): c is Card => !!c)
			.map(c => ColorValues[c.color]);

		const data: ConvergenceData = {
			offsets,
			center: {
				x: centerX / window.innerWidth,
				y: centerY / window.innerHeight,
			},
			colors: batchColors,
		};

		setConvergenceData(data);

		// Fire confetti when convergence reaches center:
		// 350ms glow delay + 420ms convergence phase (60% of 700ms)
		clearTimeout(confettiTimeoutRef.current);
		confettiTimeoutRef.current = setTimeout(() => {
			fireConvergenceConfetti(data.center, data.colors);
		}, 780);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(discardingCardIds)]);

	// Cleanup confetti timeout on unmount
	useEffect(() => {
		return () => clearTimeout(confettiTimeoutRef.current);
	}, []);

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
			<AnimatePresence mode="popLayout" custom={convergenceData}>
				{cards.map((card, index) => {
					const gridPosition = getGridPosition(index, columns);
					const isDiscarding = !!card.id && discardingCardIds.includes(card.id);
					const convergenceOffset = convergenceData?.offsets.get(card.id ?? '');

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
							animate={
								isDiscarding && convergenceOffset
									? {
										x: [0, convergenceOffset.dx, convergenceOffset.dx],
										y: [0, convergenceOffset.dy, convergenceOffset.dy],
										scale: [1, 0.8, 0],
										opacity: [1, 1, 0],
										zIndex: 1000,
										transition: {
											delay: .35,
											duration: .7,
											times: [0, 0.6, 1],
											ease: 'easeInOut' as const,
											zIndex: { delay: 0, duration: 0 },
										},
									}
									: {
										x: 1,
										y: 1,
										transition: {
											delay: newCards.findIndex(nc => nc.id === card.id) * .15,
										},
										transitionEnd: {
											zIndex: 1,
										},
									}
							}
							variants={{
								exit: (data: ConvergenceData | null) => {
									// Cards that converged are already invisible —
									// just remove them instantly
									if (data?.offsets.has(card.id ?? '')) {
										return {
											opacity: 0,
											transition: { duration: 0 },
										};
									}

									// Shuffle: original slide-off animation
									return {
										x: '-100vw',
										y: '-50vh',
										zIndex: 1000,
										transition: {
											delay: .35,
											duration: .5,
										},
									};
								},
							}}
							exit="exit"
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
										raised={isDiscarding}
										dealt={!newCards.find(newCard => newCard.id === card.id)}
										paused={paused || isDiscarding || !!newCards.find(newCard => newCard.id === card.id)}
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
