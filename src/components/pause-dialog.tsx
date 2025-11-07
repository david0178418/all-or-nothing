import { resetGame } from '@/utils';
import { Screens } from '../types';
import {
	useIsPaused,
	useSetActiveScreen,
	useSetIsPaused,
	useSetActiveGroup,
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
import { useEffect, ReactNode, useCallback, useRef } from 'react';
import { useFocusable } from '@/focus/useFocusable';
import FocusIndicator from './focus-indicator';

// Focusable button for dialog
function FocusableDialogButton({
	id,
	order,
	onClick,
	startIcon,
	children,
	autoFocus,
}: {
	id: string;
	order: number;
	onClick: () => void;
	startIcon?: ReactNode;
	children: ReactNode;
	autoFocus?: boolean;
}) {
	// Prevent double-activation from mouse and keyboard/controller
	const isActivatingRef = useRef(false);

	const handleActivation = useCallback(() => {
		// Prevent double execution
		if (isActivatingRef.current) {
			return;
		}

		isActivatingRef.current = true;
		onClick();

		// Reset after a short delay
		setTimeout(() => {
			isActivatingRef.current = false;
		}, 100);
	}, [onClick]);

	const { ref, isFocused } = useFocusable({
		id,
		group: 'pause-dialog',
		order,
		onSelect: handleActivation, // Use wrapped function for keyboard/controller
		autoFocus,
	});

	return (
		<Box sx={{ position: 'relative' }} ref={ref}>
			<FocusIndicator visible={isFocused} />
			<Button
				variant="outlined"
				startIcon={startIcon}
				onClick={handleActivation} // Use same wrapped function for mouse
				fullWidth
			>
				{children}
			</Button>
		</Box>
	);
}

export default
function PauseDialog() {
	const paused = useIsPaused();
	const setPaused = useSetIsPaused();
	const setActiveScreen = useSetActiveScreen();
	const setActiveGroup = useSetActiveGroup();

	// Set pause dialog as active group when opened
	useEffect(() => {
		if (paused) {
			setActiveGroup('pause-dialog');
		}
	}, [paused, setActiveGroup]);

	// Stable callback refs for button handlers
	const handleUnpause = useCallback(() => {
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
						<FocusableDialogButton
							id="pause-unpause"
							order={0}
							startIcon={<PlayArrowIcon />}
							onClick={handleUnpause}
							autoFocus
						>
							Unpause
						</FocusableDialogButton>
						<FocusableDialogButton
							id="pause-new-game"
							order={1}
							startIcon={<RestartIcon />}
							onClick={handleNewGame}
						>
							New Game
						</FocusableDialogButton>
						<HelpDialogTrigger />
						<FocusableDialogButton
							id="pause-back"
							order={3}
							startIcon={<BackIcon />}
							onClick={handleBackToTitle}
						>
							Back to Title Screen
						</FocusableDialogButton>
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
