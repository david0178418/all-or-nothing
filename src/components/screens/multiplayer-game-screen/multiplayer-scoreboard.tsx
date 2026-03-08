import { Box, Typography } from '@mui/material';
import type { Player } from '@/multiplayer/multiplayer-types';

interface MultiplayerScoreboardProps {
	players: readonly Player[];
	scores: ReadonlyMap<string, number>;
}

export default function MultiplayerScoreboard({ players, scores }: MultiplayerScoreboardProps) {
	return (
		<Box
			display="flex"
			justifyContent="center"
			gap={3}
			paddingY={1}
			flexWrap="wrap"
		>
			{players.map((player, index) => (
				<Box
					key={player.id}
					display="flex"
					alignItems="center"
					gap={1}
					sx={{
						padding: '4px 12px',
						borderRadius: 2,
						border: '2px solid',
						borderColor: player.color,
						bgcolor: `${player.color}15`,
					}}
				>
					<Box
						sx={{
							width: 12,
							height: 12,
							borderRadius: '50%',
							bgcolor: player.color,
						}}
					/>
					<Typography variant="body2" fontWeight={500}>
						P{index + 1}
					</Typography>
					<Typography variant="h6" fontWeight={700} sx={{ color: player.color }}>
						{scores.get(player.id) ?? 0}
					</Typography>
				</Box>
			))}
		</Box>
	);
}
