import PlayingCard from '../playing-card';
import { Card, Screens } from '../../types';
import { useInterval } from '../../utils';
import { useSetActiveScreen } from '../../atoms';
import {
	RotateLeft as RotateLeftIcon,
	PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import {
	ReactNode,
	useRef,
	useState,
} from 'react';
import {
	Button,
	Container,
	Box,
	Typography,
} from "@mui/material";

export default function Landing() {
	const [flipped, setFlipped] = useState(false);
	const [demoCard, setDemoCard] = useState(generateRandomCard);
	const setActiveScreen = useSetActiveScreen();

	useInterval(() => {
		if(flipped) {
			setDemoCard(generateRandomCard());
			setFlipped(false);
		} else {
			setFlipped(true);
		}
	}, flipped ? 1_500 : 3_000);

	return (
		<Container sx={{textAlign: 'center'}}>
			<Box
				paddingTop={20}
				width={108}
				height={200}
				display="inline-block"
			>
				<FlipCard
					flipped={flipped}
					backside={
						<PlayingCard/>
					}
				>
					<PlayingCard
						card={demoCard}
					/>
				</FlipCard>
			</Box>
			<Box paddingY={7}>
				<Typography fontWeight={100} variant="h1" fontSize={40}>
					Make a <em>Set</em>
				</Typography>
			</Box>
			<Box
				display="inline-block"
				width={300}
			>
				<Box display="flex" flexDirection="column" gap={2}>
					<Button
						disabled
						startIcon={<RotateLeftIcon/>}
						variant="outlined"
					>
						Continue
					</Button>
					<Button
						startIcon={<PlayArrowIcon />}
						variant="outlined"
						onClick={() => setActiveScreen(Screens.GameNew)}
					>
						New Game
					</Button>
				</Box>
			</Box>
		</Container>
	);
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

interface FlipCardProps {
	children: ReactNode;
	backside: ReactNode;
	flipped: boolean;
}

function FlipCard({ children, backside, flipped }: FlipCardProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	// useEffect(() => {
	// 	if (flipped) {
	// 	// This could be where you handle the transition halfway point
	// 	// For simplicity, we're not adding complex logic here, but you could
	// 	// use animation events to trigger the reveal of the backside.
	// 	}
	// }, [flipped]);

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
			}}>{backside}</Box>
		</Box>
	);
};
