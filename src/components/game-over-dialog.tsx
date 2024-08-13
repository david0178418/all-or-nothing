import FormattedTime from './formatted-time';
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
} from '@mui/material';


interface Props {
	isGameOver: boolean;
	time: number;
	remainingCards: number;
	onRestart(): void;
}

export default
function GameOverDialog(props: Props) {
	const {
		isGameOver,
		time,
		remainingCards,
		onRestart,
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
			</DialogContent>
			<DialogActions>
				<Button variant="contained" onClick={onRestart}>
					New Game
				</Button>
			</DialogActions>
		</Dialog>
	);
}
