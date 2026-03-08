import PlayingCard from '@/components/playing-card';
import { Card } from '@/types';
import { useGameTheme } from '@/themes';
import { fireConvergenceConfetti } from '@/confetti';
import { Grid, Box, useTheme, useMediaQuery } from '@mui/material';
import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMultiplayerFocusable } from '@/focus/useMultiplayerFocusable';
import type { Player, PlayerId } from '@/multiplayer/multiplayer-types';

interface ConvergenceData {
	offsets: Map<string, { dx: number; dy: number }>;
	center: { x: number; y: number };
	colors: string[];
}

interface MultiplayerCardAreaProps {
	cards: readonly Card[];
	players: readonly Player[];
	selections: ReadonlyMap<string, readonly string[]>;
	discardingCardIds: readonly string[];
	onCardSelected: (cardId: string, playerId: PlayerId) => void;
}

function MultiplayerFocusableCard({
	card,
	players,
	selections,
	isDiscarding,
	onCardSelected,
	gridPosition,
}: {
	card: Card;
	players: readonly Player[];
	selections: ReadonlyMap<string, readonly string[]>;
	isDiscarding: boolean;
	onCardSelected: (cardId: string, playerId: PlayerId) => void;
	gridPosition: { row: number; col: number };
}) {
	const cardId = card.id ?? '';

	const { ref, focusedBy } = useMultiplayerFocusable({
		id: `mp-card-${cardId}`,
		gridPosition,
		onSelect: (playerId: PlayerId) => {
			onCardSelected(cardId, playerId);
		},
		disabled: isDiscarding,
	});

	// Determine which players have selected this card
	const selectedByPlayerIds = players.filter(p =>
		(selections.get(p.id) ?? []).includes(cardId)
	);

	const focusedByColors = focusedBy
		.map(pid => players.find(p => p.id === pid)?.color)
		.filter((c): c is string => !!c);

	const selectedByColors = selectedByPlayerIds.map(p => p.color);

	return (
		<PlayingCard
			card={card}
			dealt
			raised={isDiscarding}
			flipped={isDiscarding}
			spin={isDiscarding}
			focused={focusedByColors.length > 0}
			selected={false}
			focusedByColors={focusedByColors}
			selectedByColors={selectedByColors}
			elementRef={ref}
		/>
	);
}

export default function MultiplayerCardArea({
	cards,
	players,
	selections,
	discardingCardIds,
	onCardSelected,
}: MultiplayerCardAreaProps) {
	const theme = useTheme();
	const gameTheme = useGameTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const columns = isMobile ? 3 : 6;
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
			.map(c => gameTheme.colors[c.color]);

		const data: ConvergenceData = {
			offsets,
			center: {
				x: centerX / window.innerWidth,
				y: centerY / window.innerHeight,
			},
			colors: batchColors,
		};

		setConvergenceData(data);

		clearTimeout(confettiTimeoutRef.current);
		confettiTimeoutRef.current = setTimeout(() => {
			fireConvergenceConfetti(data.center, data.colors);
		}, 780);
	}, [discardingCardIds, gameTheme.colors]);

	// Cleanup confetti timeout on unmount
	useEffect(() => {
		return () => clearTimeout(confettiTimeoutRef.current);
	}, []);

	return (
		<Grid
			container
			rowSpacing={1}
			paddingBottom={1}
			columns={{ xs: 3, sm: 6 }}
			sx={{
				height: { xs: '100%', sm: 'auto' },
				maxHeight: { xs: '100%', sm: 'none' },
				minHeight: {
					sm: 'calc(min(100vw, 1536px) * 0.41 + 16px)',
				},
				'& > *': {
					height: { xs: 'calc(25% - 4px)', sm: 'auto' },
				},
			}}
		>
			<AnimatePresence mode="popLayout" custom={convergenceData}>
				{cards.map((card, index) => {
					const isDiscarding = !!card.id && discardingCardIds.includes(card.id);
					const convergenceOffset = convergenceData?.offsets.get(card.id ?? '');
					const gridPosition = {
						row: Math.floor(index / columns),
						col: index % columns,
					};

					return (
						<Grid
							key={card.id}
							component={motion.div}
							display="flex"
							justifyContent="center"
							size={1}
							initial={false}
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
										x: 0,
										y: 0,
									}
							}
							variants={{
								exit: () => ({
									opacity: 0,
									transition: { duration: 0 },
								}),
							}}
							exit="exit"
						>
							<Box
								data-card-id={card.id}
								sx={{
									maxWidth: '80%',
									width: '100%',
									height: { xs: '100%', sm: 'auto' },
									'& > div': {
										height: { xs: '100%', sm: 'auto' },
										width: { xs: 'auto', sm: 350 },
									},
								}}
							>
								<MultiplayerFocusableCard
									card={card}
									players={players}
									selections={selections}
									isDiscarding={isDiscarding}
									onCardSelected={onCardSelected}
									gridPosition={gridPosition}
								/>
							</Box>
						</Grid>
					);
				})}
			</AnimatePresence>
		</Grid>
	);
}
