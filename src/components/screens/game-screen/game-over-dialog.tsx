import FormattedTime from '@/components/formatted-time';
import { resetGame } from '@/utils';
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
}

export default
function GameOverDialog(props: Props) {
	const {
		isGameOver,
		time,
		remainingCards,
		score,
	} = props;

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
			</DialogContent>
			<DialogActions>
				<Button onClick={resetGame}>
					New Game
				</Button>
			</DialogActions>
		</Dialog>
	);
}
