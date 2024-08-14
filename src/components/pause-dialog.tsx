import {
	Button,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogActions,
} from '@mui/material';
import { usePausedState } from '../atoms';

export default
function PauseDialog() {
	const [paused, setPaused] = usePausedState();

	return (
		<Dialog  open={paused} onClose={() => setPaused(false)}>
			<DialogContent>
				<DialogContentText>
					Paused
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setPaused(false)}>
					Resume
				</Button>
			</DialogActions>
		</Dialog>
	);
}
