import { Box, Typography } from '@mui/material';
import { useScore, useScoreValue } from '@/game-queries';
import { motion } from 'framer-motion';
import { useAnimatedNumber } from '@/useAnimatedNumber';

interface Props {
	gameComplete?: boolean;
}

export default
function GameScore(props: Props) {
	const { gameComplete } = props;
	const score = useScore();
	const scoreValue = useScoreValue();
	const animatedScore = useAnimatedNumber(score);
	const animatedNextScore = useAnimatedNumber(scoreValue);

	return (
		<Box display="flex" flexDirection="column" alignItems="flex-start">
			<Typography variant="h5" sx={{ fontVariantNumeric: 'tabular-nums' }}>
				Score: <motion.span>{animatedScore}</motion.span>
			</Typography>
			{!gameComplete && (
				<Typography variant="h6" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
					Next: <motion.span>{animatedNextScore}</motion.span>
				</Typography>
			)}
		</Box>
	);
}
