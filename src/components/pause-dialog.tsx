import { resetGame } from '@/utils';
import { Screens } from '../types';
import {
	useIsPaused,
	useSetActiveScreen,
	useSetIsPaused,
} from '../atoms';
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
import HelpDialogTrigger from './help-dialog-trigger';

export default
function PauseDialog() {
	const paused = useIsPaused();
	const setPaused = useSetIsPaused();
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
							onClick={async () => {
								await resetGame();
								setPaused(false);
							}}
						>
							New Game
						</Button>
						<HelpDialogTrigger />
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
