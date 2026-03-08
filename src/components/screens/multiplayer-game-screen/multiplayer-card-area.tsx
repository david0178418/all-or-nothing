import PlayingCard from '@/components/playing-card';
import { Card } from '@/types';
import { Grid, Box, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useMultiplayerFocusable } from '@/focus/useMultiplayerFocusable';
import { useConvergenceAnimation } from '@/useConvergenceAnimation';
import type { Player, PlayerId } from '@/multiplayer/multiplayer-types';

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
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const columns = isMobile ? 3 : 6;
	const convergenceData = useConvergenceAnimation(discardingCardIds, cards);

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
