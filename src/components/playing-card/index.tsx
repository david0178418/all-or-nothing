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

interface Props {
	flipped?: boolean;
	dealt?:boolean;
	card?: Card;
	selected?: boolean;
	onClick?(): void;
	width?: number | string;
	focused?: boolean;
	elementRef?: React.RefObject<HTMLElement | null>;
}

export default
function PlayingCard(props: Props) {
	const play = useSoundEffects();
	const {
		onClick,
		selected,
		dealt = false,
		width = 150,
		flipped: flippedOverride,
		// TODO: Rename prop when batch of work is done.
		card: face,
		focused = false,
		elementRef,
	} = props;
	const flipped = flippedOverride || !face;

	useEffect(() => {
		if(!dealt) {
			return;
		}

		play(`deal${getRandom(1, 4)}`);
	}, [dealt]);

	return (
		<Box
			width={width}
			maxWidth="100%"
			sx={{aspectRatio: '.65'}}
		>
			<Flipper
				flipped={flipped}
				backside={
					<CardSurface/>
				}
			>
				<CardSurface
					card={face}
					onClick={onClick}
					selected={selected}
					focused={focused}
					elementRef={elementRef}
				/>
			</Flipper>
		</Box>
	);
}

function CardSurface(props: Props) {
	const {
		onClick,
		selected,
		// TODO: Integrate "flipping" animation into this component.
		flipped: flippedOverride,
		// TODO: Rename prop when batch of work is done.
		card: face,
		focused = false,
		elementRef,
	} = props;
	const flipped = flippedOverride || !face;

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
				{!flipped && Array(CountValues[face.count]).fill(0).map((_, i) => (
					<Shape
						key={i}
						color={ColorValues[face.color]}
						fill={FillValues[face.fill]}
						type={ShapeValues[face.shape]}
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
