import PlayingCard from '../playing-card';
import { Card, Screens } from '../../types';
import { resetGame, useInterval } from '../../utils';
import { useSetActiveScreen, useSetActiveGroup } from '../../atoms';
import FormattedTime from '../formatted-time';
import { SavedGameKey } from '@/constants';
import { useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import {
	RotateLeft as RotateLeftIcon,
	PlayArrow as PlayArrowIcon,
	Info as InfoIcon,
	QuestionMark as QuestionMarkIcon,
} from '@mui/icons-material';
import {
	Button,
	Container,
	Box,
	Typography,
} from "@mui/material";
import { useFocusable } from '@/focus/useFocusable';
import FocusIndicator from '@/components/focus-indicator';

// Focusable button wrapper
function FocusableButton({
	id,
	order,
	onClick,
	disabled,
	startIcon,
	children,
	autoFocus,
}: {
	id: string;
	order: number;
	onClick: () => void;
	disabled?: boolean;
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
		group: 'menu',
		order,
		onSelect: handleActivation, // Use wrapped function for keyboard/controller
		disabled,
		autoFocus,
	});

	return (
		<Box sx={{ position: 'relative' }} ref={ref}>
			<FocusIndicator visible={isFocused} />
			<Button
				disabled={disabled}
				startIcon={startIcon}
				variant="outlined"
				onClick={handleActivation} // Use same wrapped function for mouse
				fullWidth
			>
				{children}
			</Button>
		</Box>
	);
}

export default function Landing() {
	const [flipped, setFlipped] = useState(false);
	const [demoCard, setDemoCard] = useState(generateRandomCard);
	const [savedGameTime] = useState(getSavedGameTime)
	const setActiveScreen = useSetActiveScreen();
	const setActiveGroup = useSetActiveGroup();

	// Set menu as active focus group when title screen loads
	useEffect(() => {
		setActiveGroup('menu');
	}, [setActiveGroup]);

	useInterval(() => {
		if(flipped) {
			setDemoCard(generateRandomCard());
			setFlipped(false);
		} else {
			setFlipped(true);
		}
	}, flipped ? 1_000 : 3_000);

	// Stable callback refs for button handlers
	const handleContinue = useCallback(() => {
		setActiveScreen(Screens.Game);
	}, [setActiveScreen]);

	const handleNewGame = useCallback(async () => {
		await resetGame();
		setActiveScreen(Screens.Game);
	}, [setActiveScreen]);

	const handleHowToPlay = useCallback(() => {
		setActiveScreen(Screens.Help);
	}, [setActiveScreen]);

	const handleAbout = useCallback(() => {
		setActiveScreen(Screens.About);
	}, [setActiveScreen]);

	return (
		<Container sx={{textAlign: 'center'}}>
			<Box
				paddingTop={15}
				height={200}
				display="inline-block"
			>
				<PlayingCard
					width={130}
					flipped={flipped}
					card={demoCard}
				/>
			</Box>
			<Box paddingY={7}>
				<Typography fontWeight={100} variant="h1" fontSize={40}>
					All <em>or</em> Nothing
				</Typography>
			</Box>
			<Box
				display="inline-block"
				width={300}
			>
				<Box display="flex" flexDirection="column" gap={2}>
					<FocusableButton
						id="menu-continue"
						order={0}
						disabled={!savedGameTime}
						startIcon={<RotateLeftIcon/>}
						onClick={handleContinue}
					>
						Continue {!!savedGameTime && <FormattedTime label=" - " value={savedGameTime} />}
					</FocusableButton>
					<FocusableButton
						id="menu-new-game"
						order={1}
						startIcon={<PlayArrowIcon />}
						onClick={handleNewGame}
						autoFocus={!savedGameTime}
					>
						New Game
					</FocusableButton>
					<FocusableButton
						id="menu-how-to-play"
						order={2}
						startIcon={<QuestionMarkIcon />}
						onClick={handleHowToPlay}
					>
						How to Play
					</FocusableButton>
					<FocusableButton
						id="menu-about"
						order={3}
						startIcon={<InfoIcon />}
						onClick={handleAbout}
					>
						About
					</FocusableButton>
				</Box>
			</Box>
		</Container>
	);
}

function getSavedGameTime() {
	return +(localStorage.getItem(SavedGameKey) || '0');
}

function generateRandomCard(): Card {
	return {
		color: chooseRandomAttribute(),
		count: chooseRandomAttribute(),
		shape: chooseRandomAttribute(),
		fill: chooseRandomAttribute(),
	};
}

function chooseRandomAttribute() {
	return chooseRandom<1 | 2 | 4>(1, 2, 4);
}

function chooseRandom<T>(...items: T[]) {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex] as T;
}
