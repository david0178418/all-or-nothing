import { resetGame } from '@/utils';
import { resetComboState } from '@/core';
import { Screens } from '../types';
import {
	useIsPaused,
	useSetActiveScreen,
	useSetIsPaused,
	useIsSoundEnabled,
	useSetIsSoundEnabled,
	useIsMusicEnabled,
	useSetIsMusicEnabled,
} from '../atoms';
import { useSetActiveGroup } from '@/focus/focus-atoms';
import {
	PlayArrow as PlayArrowIcon,
	RestartAlt as RestartIcon,
	ArrowBack as BackIcon,
	VolumeUp as VolumeUpIcon,
	VolumeOff as VolumeOffIcon,
	MusicNote as MusicNoteIcon,
	MusicOff as MusicOffIcon,
} from '@mui/icons-material';
import {
	Dialog,
	DialogContent,
	DialogContentText,
	Box,
} from '@mui/material';
import HelpDialogTrigger from './help-dialog-trigger';
import { useEffect, useCallback } from 'react';
import FocusableButton from '@/components/focusable-button';

export default
function PauseDialog() {
	const paused = useIsPaused();
	const setPaused = useSetIsPaused();
	const setActiveScreen = useSetActiveScreen();
	const setActiveGroup = useSetActiveGroup();
	const isSoundEnabled = useIsSoundEnabled();
	const setIsSoundEnabled = useSetIsSoundEnabled();
	const isMusicEnabled = useIsMusicEnabled();
	const setIsMusicEnabled = useSetIsMusicEnabled();

	// Set pause dialog as active group when opened
	useEffect(() => {
		if (paused) {
			setActiveGroup('pause-dialog');
		}
	}, [paused, setActiveGroup]);

	// Stable callback refs for button handlers
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

	const handleToggleSound = useCallback(() => {
		setIsSoundEnabled(!isSoundEnabled);
	}, [isSoundEnabled, setIsSoundEnabled]);

	const handleToggleMusic = useCallback(() => {
		setIsMusicEnabled(!isMusicEnabled);
	}, [isMusicEnabled, setIsMusicEnabled]);

	return (
		<Dialog  open={paused} onClose={handleClose}>
			<DialogContent>
				<DialogContentText>
					Paused
				</DialogContentText>
				<Box
					display="inline-block"
					width={300}
				>
					<Box display="flex" flexDirection="column" gap={2}>
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
							id="pause-sound"
							group="pause-dialog"
							order={3}
							startIcon={isSoundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
							onClick={handleToggleSound}
						>
							Sound: {isSoundEnabled ? 'On' : 'Off'}
						</FocusableButton>
						<FocusableButton
							id="pause-music"
							group="pause-dialog"
							order={4}
							startIcon={isMusicEnabled ? <MusicNoteIcon /> : <MusicOffIcon />}
							onClick={handleToggleMusic}
						>
							Music: {isMusicEnabled ? 'On' : 'Off'}
						</FocusableButton>
						<FocusableButton
							id="pause-back"
							group="pause-dialog"
							order={5}
							startIcon={<BackIcon />}
							onClick={handleBackToTitle}
						>
							Back to Title Screen
						</FocusableButton>
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
