import { Box, Typography } from '@mui/material';
import { useScore, useScoreValue, useComboCount } from './game-play-area';

interface Props {
	gameComplete?: boolean;
}

export default
function GameScore(props: Props) {
	const { gameComplete } = props;
	const score = useScore();
	const scoreValue = useScoreValue();
	const comboCount = useComboCount();

	return (
		<Box display="flex" flexDirection="column" alignItems="flex-start">
			<Typography variant="h5">
				Score: {score.toLocaleString()}
			</Typography>
			{!gameComplete && (
				<Typography variant="caption" color="text.secondary">
					Next: {scoreValue.toLocaleString()}
					{comboCount > 0 && ` (x${comboCount + 1} combo!)`}
				</Typography>
			)}
		</Box>
	);
}
