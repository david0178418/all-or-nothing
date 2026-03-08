import { Box, Typography, Button, Container } from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import type { Player } from '@/multiplayer/multiplayer-types';

interface MultiplayerResultsProps {
	players: readonly Player[];
	scores: ReadonlyMap<string, number>;
	onRematch: () => void;
	onQuit: () => void;
}

export default function MultiplayerResults({ players, scores, onRematch, onQuit }: MultiplayerResultsProps) {
	const ranked = [...players].sort((a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0));

	return (
		<Container maxWidth="sm" sx={{ textAlign: 'center', paddingTop: 4 }}>
			<Typography variant="h3" fontWeight={300} gutterBottom>
				Results
			</Typography>

			<Box display="flex" flexDirection="column" gap={2} sx={{ mb: 4 }}>
				{ranked.map((player, index) => {
					const playerIndex = players.indexOf(player);
					const score = scores.get(player.id) ?? 0;
					const isWinner = index === 0;

					return (
						<Box
							key={player.id}
							display="flex"
							alignItems="center"
							gap={2}
							sx={{
								padding: 2,
								borderRadius: 2,
								border: '2px solid',
								borderColor: player.color,
								bgcolor: isWinner ? `${player.color}25` : `${player.color}10`,
								transform: isWinner ? 'scale(1.05)' : 'none',
							}}
						>
							<Typography variant="h5" fontWeight={700} sx={{ minWidth: 40 }}>
								#{index + 1}
							</Typography>
							{isWinner && <TrophyIcon sx={{ color: '#FFD700', fontSize: 32 }} />}
							<Box
								sx={{
									width: 16,
									height: 16,
									borderRadius: '50%',
									bgcolor: player.color,
								}}
							/>
							<Typography variant="h6" flex={1} textAlign="left">
								Player {playerIndex + 1}
							</Typography>
							<Typography variant="h5" fontWeight={700} sx={{ color: player.color }}>
								{score}
							</Typography>
						</Box>
					);
				})}
			</Box>

			<Box display="flex" gap={2} justifyContent="center">
				<Button variant="outlined" onClick={onQuit}>
					Quit
				</Button>
				<Button variant="contained" onClick={onRematch}>
					Rematch
				</Button>
			</Box>
		</Container>
	);
}
