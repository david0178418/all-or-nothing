import { useState, useCallback, useRef, useEffect } from 'react';
import {
	Container,
	Box,
	Fab,
	Typography,
	Button,
	Paper,
	Grid,
	LinearProgress,
	Stack,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	NavigateNext as NextIcon,
	NavigateBefore as PrevIcon,
} from '@mui/icons-material';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useSetActiveScreen, useActiveController } from '@/atoms';
import { Screens, Card } from '@/types';
import { InputAction, InputEvent } from '@/input/input-types';
import { useGamepadManager, useKeyboardManager } from '@/input/input-hooks';
import PlatformButton from '@/components/platform-button';
import { isSet } from '@/core';
import { TutorialCompletedKey } from '@/constants';
import { useSoundEffects } from '@/hooks';
import { TUTORIAL_CARDS, TUTORIAL_STEPS } from '@/tutorial/tutorial-data';
import PlayingCard from '@/components/playing-card';

const tooltipVariants = {
	enter: { opacity: 0, y: 10 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
	exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
} as const;

export default
function TutorialScreen() {
	const setActiveScreen = useSetActiveScreen();
	const activeController = useActiveController();
	const prefersReducedMotion = useReducedMotion();
	const soundEffects = useSoundEffects();
	const [step, setStep] = useState(0);
	const [selectedCardIndexes, setSelectedCardIndexes] = useState<readonly number[]>([]);
	const [foundSet, setFoundSet] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => {
		return () => clearTimeout(timeoutRef.current);
	}, []);

	const currentStep = TUTORIAL_STEPS[step];
	const totalSteps = TUTORIAL_STEPS.length;
	const progress = ((step + 1) / totalSteps) * 100;

	const goToNextStep = useCallback(() => {
		setSelectedCardIndexes([]);
		setFoundSet(false);
		setStep(s => Math.min(s + 1, totalSteps - 1));
	}, [totalSteps]);

	const goToPrevStep = useCallback(() => {
		setSelectedCardIndexes([]);
		setFoundSet(false);
		setStep(s => Math.max(s - 1, 0));
	}, []);

	const handleFinish = useCallback(() => {
		localStorage.setItem(TutorialCompletedKey, '1');
		setActiveScreen(Screens.Title);
	}, [setActiveScreen]);

	const goBackToTitle = useCallback(() => {
		setActiveScreen(Screens.Title);
	}, [setActiveScreen]);

	// Input handler ref so gamepad/keyboard listeners always see latest state
	const inputHandlerRef = useRef<(event: InputEvent) => void>(() => {});
	inputHandlerRef.current = (event: InputEvent) => {
		if (event.action === InputAction.SELECT) {
			if (step >= totalSteps - 1) {
				handleFinish();
			} else {
				goToNextStep();
			}
		}

		if (event.action === InputAction.BACK) {
			if (step <= 0) {
				goBackToTitle();
			} else {
				goToPrevStep();
			}
		}
	};

	const stableInputHandler = useCallback((event: InputEvent) => {
		inputHandlerRef.current(event);
	}, []);

	useGamepadManager(stableInputHandler);
	useKeyboardManager(stableInputHandler);

	const handleCardClick = useCallback((index: number) => {
		if (!currentStep?.enableSelection || foundSet) return;

		const alreadySelected = selectedCardIndexes.includes(index);

		const newSelection = alreadySelected
			? selectedCardIndexes.filter(i => i !== index)
			: [...selectedCardIndexes, index];

		if (newSelection.length > 3) return;

		setSelectedCardIndexes(newSelection);

		if (newSelection.length === 3) {
			const [a, b, c] = newSelection.map(i => TUTORIAL_CARDS[i]).filter((card): card is Card => !!card);

			if (a && b && c && isSet(a, b, c)) {
				soundEffects('success');
				setFoundSet(true);
				timeoutRef.current = setTimeout(() => {
					setSelectedCardIndexes([]);
					setFoundSet(false);
					setStep(s => s + 1);
				}, 1200);
			} else {
				timeoutRef.current = setTimeout(() => {
					setSelectedCardIndexes([]);
				}, 800);
			}
		}
	}, [currentStep?.enableSelection, foundSet, selectedCardIndexes, soundEffects]);

	if (!currentStep) return null;

	const isCentered = currentStep.tooltipPosition === 'center';
	const isLastStep = step === totalSteps - 1;
	const isFirstStep = step === 0;
	const isInteractive = !!currentStep.enableSelection;

	return (
		<Container sx={{
			height: '100dvh',
			display: 'flex',
			flexDirection: 'column',
			position: 'relative',
		}}>
			<Box sx={{ pt: 2, pb: 1 }}>
				<LinearProgress
					variant="determinate"
					value={progress}
					sx={{ borderRadius: 1, height: 6 }}
				/>
			</Box>

			{!isCentered && (
				<Box
					sx={{
						flex: 1,
						minHeight: 0,
						overflow: 'hidden',
					}}
				>
					<TutorialBoard
						highlightCards={currentStep.highlightCards}
						enableSelection={currentStep.enableSelection}
						selectedCardIndexes={selectedCardIndexes}
						foundSet={foundSet}
						onCardClick={handleCardClick}
					/>
				</Box>
			)}

			{isCentered && (
				<Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
			)}

			<Box sx={{
				pb: 10,
				display: 'flex',
				justifyContent: 'center',
			}}>
				<AnimatePresence mode="wait">
					<motion.div
						key={currentStep.id}
						variants={prefersReducedMotion ? undefined : tooltipVariants}
						initial={prefersReducedMotion ? false : 'enter'}
						animate="visible"
						exit="exit"
						style={{ width: '100%', maxWidth: 500 }}
					>
						<Paper
							elevation={4}
							sx={{
								p: 3,
								borderRadius: 2,
								position: 'relative',
							}}
						>
							{currentStep.content}

							{!activeController && !isInteractive && (
								<Box
									display="flex"
									justifyContent="space-between"
									alignItems="center"
									sx={{ mt: 2 }}
								>
									<Button
										size="small"
										onClick={goToPrevStep}
										disabled={isFirstStep}
										startIcon={<PrevIcon />}
									>
										Back
									</Button>

									<Typography variant="caption" color="text.secondary">
										{step + 1} / {totalSteps}
									</Typography>

									{isLastStep ? (
										<Button
											size="small"
											variant="contained"
											onClick={handleFinish}
										>
											Start Playing
										</Button>
									) : (
										<Button
											size="small"
											onClick={goToNextStep}
											endIcon={<NextIcon />}
										>
											Next
										</Button>
									)}
								</Box>
							)}

							{!activeController && isInteractive && (
								<Box
									display="flex"
									justifyContent="space-between"
									alignItems="center"
									sx={{ mt: 2 }}
								>
									<Button
										size="small"
										onClick={goToPrevStep}
										startIcon={<PrevIcon />}
									>
										Back
									</Button>

									<Typography variant="caption" color="text.secondary">
										{selectedCardIndexes.length} / 3 selected
									</Typography>

									<Button
										size="small"
										onClick={goToNextStep}
									>
										Skip
									</Button>
								</Box>
							)}

							{!!activeController && (
								<Box sx={{ mt: 2 }}>
									<Stack direction="row" spacing={1} justifyContent="center">
										{!isFirstStep && (
											<PlatformButton
												label="Back"
												action={InputAction.BACK}
												onClick={goToPrevStep}
											/>
										)}
										{isFirstStep && (
											<PlatformButton
												label="Exit"
												action={InputAction.BACK}
												onClick={goBackToTitle}
											/>
										)}
										{!isInteractive && !isLastStep && (
											<PlatformButton
												label="Next"
												action={InputAction.SELECT}
												onClick={goToNextStep}
											/>
										)}
										{!isInteractive && isLastStep && (
											<PlatformButton
												label="Start Playing"
												action={InputAction.SELECT}
												onClick={handleFinish}
											/>
										)}
										{isInteractive && (
											<PlatformButton
												label="Skip"
												action={InputAction.SELECT}
												onClick={goToNextStep}
											/>
										)}
									</Stack>
									<Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mt: 0.5 }}>
										{isInteractive
											? `${selectedCardIndexes.length} / 3 selected`
											: `${step + 1} / ${totalSteps}`
										}
									</Typography>
								</Box>
							)}
						</Paper>
					</motion.div>
				</AnimatePresence>
			</Box>

			{!activeController && (
				<Fab
					color="primary"
					aria-label="back"
					onClick={goBackToTitle}
					sx={{
						position: 'fixed',
						bottom: 16,
						right: 16,
					}}
				>
					<ArrowBackIcon />
				</Fab>
			)}
		</Container>
	);
}

interface TutorialBoardProps {
	highlightCards?: readonly number[];
	enableSelection?: boolean;
	selectedCardIndexes: readonly number[];
	foundSet: boolean;
	onCardClick: (index: number) => void;
}

function TutorialBoard({
	highlightCards,
	enableSelection,
	selectedCardIndexes,
	foundSet,
	onCardClick,
}: TutorialBoardProps) {
	return (
		<Grid
			container
			rowSpacing={1}
			columns={{ xs: 3, sm: 6 }}
			sx={{ maxWidth: 900, margin: '0 auto', paddingTop: '24px' }}
		>
			{TUTORIAL_CARDS.map((card, index) => {
				const isHighlighted = highlightCards?.includes(index) ?? false;
				const isSelected = selectedCardIndexes.includes(index);
				const isClickable = !!enableSelection && !foundSet;
				const isDimmed = !!highlightCards && !isHighlighted && !enableSelection;

				return (
					<Grid
						key={index}
						display="flex"
						justifyContent="center"
						size={1}
					>
						<Box
							sx={{
								maxWidth: '80%',
								width: '100%',
								opacity: isDimmed ? 0.3 : 1,
								transition: 'opacity 0.3s ease',
								cursor: isClickable ? 'pointer' : 'default',
							}}
							onClick={isClickable ? () => onCardClick(index) : undefined}
						>
							<PlayingCard
								card={card}
								raised={isHighlighted || (isSelected && foundSet)}
								selected={isSelected}
								spin={isSelected && foundSet}
								flipped={isSelected && foundSet}
							/>
						</Box>
					</Grid>
				);
			})}
		</Grid>
	);
}
