import { resetGame } from '@/utils';
import { resetComboState } from '@/core';
import { Screens } from '../types';
import {
	useSetActiveScreen,
	useSetIsPaused,
} from '../atoms';
import {
	PlayArrow as PlayArrowIcon,
	RestartAlt as RestartIcon,
	ArrowBack as BackIcon,
} from '@mui/icons-material';
import HelpDialogTrigger from './help-dialog-trigger';
import { useCallback } from 'react';
import FocusableButton from '@/components/focusable-button';
import SharedPauseDialog from '@/components/shared-pause-dialog';

export default
function PauseDialog() {
	const setPaused = useSetIsPaused();
	const setActiveScreen = useSetActiveScreen();

	const handleUnpause = useCallback(async () => {
		await resetComboState();
		setPaused(false);
	}, [setPaused]);

	const handleNewGame = useCallback(async () => {
		await resetGame();
		setPaused(false);
	}, [setPaused]);

	const handleBackToTitle = useCallback(() => {
		setActiveScreen(Screens.Title);
		setPaused(false);
	}, [setActiveScreen, setPaused]);

	const handleClose = useCallback(() => {
		setPaused(false);
	}, [setPaused]);

	return (
		<SharedPauseDialog
			focusGroup="pause-dialog"
			soundMusicStartOrder={3}
			onClose={handleClose}
		>
			<FocusableButton
				id="pause-unpause"
				group="pause-dialog"
				order={0}
				startIcon={<PlayArrowIcon />}
				onClick={handleUnpause}
				autoFocus
			>
				Unpause
			</FocusableButton>
			<FocusableButton
				id="pause-new-game"
				group="pause-dialog"
				order={1}
				startIcon={<RestartIcon />}
				onClick={handleNewGame}
			>
				New Game
			</FocusableButton>
			<HelpDialogTrigger
				id="pause-help"
				order={2}
			/>
			<FocusableButton
				id="pause-back"
				group="pause-dialog"
				order={5}
				startIcon={<BackIcon />}
				onClick={handleBackToTitle}
			>
				Back to Title Screen
			</FocusableButton>
		</SharedPauseDialog>
	);
}
