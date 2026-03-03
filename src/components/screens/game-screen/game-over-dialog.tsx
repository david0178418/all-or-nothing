import { useState, useEffect } from 'react';
import FormattedTime from '@/components/formatted-time';
import { resetGame } from '@/utils';
import { getGameCompletionData } from '@/core';
import { usePlatformService } from '@/platform';
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Typography,
} from '@mui/material';


interface Props {
	isGameOver: boolean;
	time: number;
	remainingCards: number;
	score: number;
	maxCombo: number;
}

export default
function GameOverDialog(props: Props) {
	const {
		isGameOver,
		time,
		remainingCards,
		score,
		maxCombo,
	} = props;

	const platformService = usePlatformService();
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		if (!isGameOver || submitted || !platformService.isAvailable) return;

		getGameCompletionData().then(data => {
			platformService.submitScore(data).then(() => setSubmitted(true));
		});
	}, [isGameOver, submitted, platformService]);

	useEffect(() => {
		if (!isGameOver) {
			setSubmitted(false);
		}
	}, [isGameOver]);

	return (
		<Dialog open={isGameOver}>
			<DialogTitle>Game Over</DialogTitle>
			<DialogContent>
				{!!remainingCards && (
					<DialogContentText>
						No sets in the remaining {remainingCards} cards.
					</DialogContentText>
				)}
				<FormattedTime label="Completed in " value={time} />
				<Typography variant="h6" sx={{ mt: 2 }}>
					Final Score: {score.toLocaleString()}
				</Typography>
				<Typography variant="h6" sx={{ mt: 1 }}>
					Max Combo: {maxCombo}x
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={resetGame}>
					New Game
				</Button>
			</DialogActions>
		</Dialog>
	);
}
