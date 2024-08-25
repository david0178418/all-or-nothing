import { usePausedState, useSetActiveScreen } from '../atoms';
import { resetGame } from '../core';
import { Screens } from '../types';
import {
	PlayArrow as PlayArrowIcon,
	RestartAlt as RestartIcon,
	ArrowBack as BackIcon,
} from '@mui/icons-material';
import {
	Button,
	Dialog,
	DialogContent,
	DialogContentText,
	Box,
} from '@mui/material';

export default
function PauseDialog() {
	const [paused, setPaused] = usePausedState();
	const setActiveScreen = useSetActiveScreen();

	return (
		<Dialog  open={paused} onClose={() => setPaused(false)}>
			<DialogContent>
				<DialogContentText>
					Paused
				</DialogContentText>
				<Box
					display="inline-block"
					width={300}
				>
					<Box display="flex" flexDirection="column" gap={2}>
						<Button
							variant="outlined"
							startIcon={<PlayArrowIcon />}
							onClick={() => setPaused(false)}
						>
							Unpause
						</Button>
						<Button
							variant="outlined"
							startIcon={<RestartIcon />}
							onClick={() => {
								resetGame();
								setPaused(false);
							}}
						>
							New Game
						</Button>
						<Button
							variant="outlined"
							startIcon={<BackIcon />}
							onClick={() => {
								setActiveScreen(Screens.Title);
								setPaused(false);
							}}
						>
							Back to Title Screen
						</Button>
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
