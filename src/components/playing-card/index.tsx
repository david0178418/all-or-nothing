import { Box } from '@mui/material';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useSoundEffects } from '@/hooks';
import { getRandom } from '@/utils';
import {
	Card,
	CountValues,
	FillValues,
} from '@/types';
import Shape from './shape';
import FocusIndicator from '@/components/focus-indicator';
import MultiSelectIndicator from './multi-select-indicator';
import { useGameTheme } from '@/themes';

interface PlayingCardProps {
	width?: number | string;
	card?: Card;
	onClick?(): void;
	raised?: boolean;
	flipped?: boolean;
	spin?: boolean;
	dealt?: boolean;
	focused?: boolean;
	mismatching?: boolean;
	elementRef?: React.RefObject<HTMLElement | null>;
	selected?: boolean;
	focusedByColors?: readonly string[];
	selectedByColors?: readonly string[];
	onMismatchAnimationComplete?(): void;
}

interface CardSurfaceProps {
	card?: Card;
	onClick?(): void;
	selected?: boolean;
	flipped: boolean;
	focused?: boolean;
	elementRef?: React.RefObject<HTMLElement | null>;
	focusedByColors?: readonly string[];
	selectedByColors?: readonly string[];
}

export default
function PlayingCard(props: PlayingCardProps) {
	const play = useSoundEffects();
	const {
		onClick,
		selected,
		dealt = false,
		width = 350,
		raised,
		flipped: flippedOverride,
		spin,
		mismatching,
		card: cardData,
		focused = false,
		elementRef,
		focusedByColors,
		selectedByColors,
		onMismatchAnimationComplete,
	} = props;
	const flipped = flippedOverride || !cardData;

	useEffect(() => {
		if(!dealt) {
			return;
		}

		play(`deal${getRandom(1, 4)}`);
	}, [dealt]);

	const isRaised = raised || focused || selected;

	return (
		<Box
			width={width}
			maxWidth="100%"
			sx={{
				aspectRatio: '.65',
				translate: isRaised ? '-10px -16px' : '0 0',
				filter: raised
				? 'brightness(1.2) drop-shadow(0 0 20px rgba(255, 200, 50, 0.8))'
				: isRaised
					? 'drop-shadow(6px 8px 12px rgba(0, 0, 0, 0.4))'
					: 'drop-shadow(3px 3px 4px #000)',
				transition: 'translate 0.25s ease-out, filter 0.25s ease-out',
				position: 'relative',
				zIndex: isRaised ? 2 : 1,
			}}
		>
			<Flipper
				flipped={flipped}
				spin={spin}
				mismatching={mismatching}
				onMismatchAnimationComplete={onMismatchAnimationComplete}
				backside={
					<CardSurface flipped/>
				}
			>
				<CardSurface
					card={cardData}
					flipped={false}
					onClick={onClick}
					selected={selected}
					focused={focused}
					elementRef={elementRef}
					focusedByColors={focusedByColors}
					selectedByColors={selectedByColors}
				/>
			</Flipper>
		</Box>
	);
}

function CardSurface(props: CardSurfaceProps) {
	const gameTheme = useGameTheme();
	const {
		onClick,
		selected,
		flipped,
		card,
		focused = false,
		elementRef,
		focusedByColors,
		selectedByColors,
	} = props;

	const useMultiplayerSelection = selectedByColors && selectedByColors.length > 0;
	const bgColor = useMultiplayerSelection ? 'white' : (selected ? 'red' : 'white');

	return (
		<Box
			ref={elementRef}
			border="2px solid black"
			display="flex"
			padding="5px"
			boxSizing="border-box"
			borderRadius="10px"
			boxShadow="3px 3px 4px #000"
			onClick={onClick}
			bgcolor={bgColor}
			width="100%"
			height="100%"
			sx={{
				cursor: onClick && 'pointer',
				position: 'relative',
			}}
		>
			{useMultiplayerSelection && <MultiSelectIndicator colors={selectedByColors} />}
			<FocusIndicator visible={focused} colors={focusedByColors} />
			<Box
				flex="1"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				sx={{
					background: flipped ? gameTheme.cardBack : gameTheme.cardFace,
				}}
			>
				{!flipped && card && Array(CountValues[card.count]).fill(0).map((_, i) => (
					<Shape
						key={i}
						color={gameTheme.colors[card.color]}
						fill={FillValues[card.fill]}
						SvgComponent={gameTheme.shapes[card.shape]}
					/>
				))}
			</Box>
		</Box>
	);
}

const MISMATCH_TRANSFORMS: Record<string, string | undefined> = {
	'to-back': 'rotateY(180deg)',
	'to-front': 'rotateY(360deg)',
	'resetting': 'rotateY(0deg)',
};

interface FlipperProps {
	children: ReactNode;
	backside: ReactNode;
	flipped?: boolean;
	spin?: boolean;
	mismatching?: boolean;
	onMismatchAnimationComplete?(): void;
}

function Flipper({ children, backside, flipped, spin, mismatching, onMismatchAnimationComplete }: FlipperProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [mismatchPhase, setMismatchPhase] = useState<'idle' | 'to-back' | 'to-front' | 'resetting'>('idle');

	useEffect(() => {
		if (!mismatching) {
			setMismatchPhase('idle');
			return;
		}

		// Start phase 1: flip to back
		// Use rAF to ensure the initial transform (0deg) is painted before transitioning
		const frameId = requestAnimationFrame(() => {
			setMismatchPhase('to-back');
		});

		return () => cancelAnimationFrame(frameId);
	}, [mismatching]);

	useEffect(() => {
		if (mismatchPhase === 'to-back' || mismatchPhase === 'to-front') {
			const el = containerRef.current;
			if (!el) {
				return undefined;
			}

			const handleTransitionEnd = (e: TransitionEvent) => {
				if (e.propertyName !== 'transform') {
					return;
				}

				if (mismatchPhase === 'to-back') {
					setMismatchPhase('to-front');
				} else {
					// Disable transition, snap transform back to 0deg
					setMismatchPhase('resetting');
				}
			};

			el.addEventListener('transitionend', handleTransitionEnd);

			return () => {
				el.removeEventListener('transitionend', handleTransitionEnd);
			};
		}

		if (mismatchPhase === 'resetting') {
			// Force a reflow so the browser paints at 0deg with no transition,
			// then notify completion on the next frame
			containerRef.current?.getBoundingClientRect();
			const frameId = requestAnimationFrame(() => {
				setMismatchPhase('idle');
				onMismatchAnimationComplete?.();
			});

			return () => cancelAnimationFrame(frameId);
		}

		return undefined;
	}, [mismatchPhase, onMismatchAnimationComplete]);

	const mismatchTransform = MISMATCH_TRANSFORMS[mismatchPhase];
	const baseTransform = flipped ? `rotateY(${spin ? 360 : 180}deg)` : 'rotateY(0deg)';
	const skipTransition = mismatchPhase === 'resetting';

	return (
		<Box
			ref={containerRef}
			sx={{
				position: 'relative',
				width: '100%',
				height: '100%',
				transformStyle: 'preserve-3d',
				transition: skipTransition ? 'none' : `transform ${mismatching ? '0.25s' : '0.6s'}`,
				transform: mismatchTransform ?? baseTransform,
			}}
		>
			<Box
				sx={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					backfaceVisibility: 'hidden',
					transform: 'rotateY(0deg)',
				}}
			>
				{children}
			</Box>
			<Box sx={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				backfaceVisibility: 'hidden',
				transform: 'rotateY(180deg)',
			}}>
				{backside}
			</Box>
		</Box>
	);
}
