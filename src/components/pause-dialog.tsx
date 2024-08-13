import {
	Button,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogActions,
} from '@mui/material';

interface Props {
	paused: boolean;
	onPause(): void;
	onUnpause(): void;
}

export default
function PauseDialog(props: Props) {
	const {
		paused,
		onPause,
		onUnpause,
	} = props;

	return (
		<>
			<Button onClick={onPause}>
				Pause
			</Button>
			<Dialog  open={paused} onClose={onUnpause}>
				<DialogContent>
					<DialogContentText>
						Paused
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={onUnpause}>
						Resume
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
