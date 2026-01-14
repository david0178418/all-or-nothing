import { Box } from '@mui/material';
import { ReactNode, useEffect, useRef } from 'react';
import { useSoundEffects } from '@/hooks';
import { getRandom } from '@/utils';
import {
	Card,
	ColorValues,
	CountValues,
	FillValues,
	ShapeValues,
} from '@/types';
import Shape from './shape';
import FocusIndicator from '@/components/focus-indicator';

interface PlayingCardProps {
	width?: number | string;
	card?: Card;
	onClick?(): void;
	raised?: boolean;
	flipped?: boolean;
	dealt?: boolean;
	focused?: boolean;
	elementRef?: React.RefObject<HTMLElement | null>;
	selected?: boolean;
}

interface CardSurfaceProps {
	card?: Card;
	onClick?(): void;
	selected?: boolean;
	flipped: boolean;
	focused?: boolean;
	elementRef?: React.RefObject<HTMLElement | null>;
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
		card: cardData,
		focused = false,
		elementRef,
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
				filter: isRaised ? 'drop-shadow(6px 8px 12px rgba(0, 0, 0, 0.4))' : 'drop-shadow(3px 3px 4px #000)',
				transition: 'translate 0.25s ease-out, filter 0.25s ease-out',
				position: 'relative',
				zIndex: isRaised ? 2 : 1,
			}}
		>
			<Flipper
				flipped={flipped}
				backside={
					<CardSurface flipped/>
				}
			>
				<CardSurface
					card={cardData}
					flipped={flipped}
					onClick={onClick}
					selected={selected}
					focused={focused}
					elementRef={elementRef}
				/>
			</Flipper>
		</Box>
	);
}

function CardSurface(props: CardSurfaceProps) {
	const {
		onClick,
		selected,
		flipped,
		card,
		focused = false,
		elementRef,
	} = props;

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
			bgcolor={selected ? 'red' : 'white'}
			width="100%"
			height="100%"
			sx={{
				cursor: onClick && 'pointer',
				position: 'relative',
			}}
		>
			<FocusIndicator visible={focused} />
			<Box
				flex="1"
				bgcolor="white"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				sx={{
					background: flipped ?
						`repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px,#465298 20px)` :
						''
				}}
			>
				{!flipped && card && Array(CountValues[card.count]).fill(0).map((_, i) => (
					<Shape
						key={i}
						color={ColorValues[card.color]}
						fill={FillValues[card.fill]}
						type={ShapeValues[card.shape]}
					/>
				))}
			</Box>
		</Box>
	);
}

interface FlipperProps {
	children: ReactNode;
	backside: ReactNode;
	flipped?: boolean;
}

function Flipper({ children, backside, flipped }: FlipperProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<Box
			ref={containerRef}
			sx={{
				position: 'relative',
				width: '100%',
				height: '100%',
				transformStyle: 'preserve-3d',
				transition: 'transform 0.6s',
				transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
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
