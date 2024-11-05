import PlayingCard from '../playing-card';
import { Card, Screens } from '../../types';
import { resetGame, useInterval } from '../../utils';
import { useSetActiveScreen } from '../../atoms';
import FormattedTime from '../formatted-time';
import { SavedGameKey } from '@/constants';
import { useState } from 'react';
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

export default function Landing() {
	const [flipped, setFlipped] = useState(false);
	const [demoCard, setDemoCard] = useState(generateRandomCard);
	const [savedGameTime] = useState(getSavedGameTime)
	const setActiveScreen = useSetActiveScreen();

	useInterval(() => {
		if(flipped) {
			setDemoCard(generateRandomCard());
			setFlipped(false);
		} else {
			setFlipped(true);
		}
	}, flipped ? 1_000 : 3_000);

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
					<Button
						disabled={!savedGameTime}
						startIcon={<RotateLeftIcon/>}
						variant="outlined"
						onClick={() => setActiveScreen(Screens.Game)}
					>
						Continue {!!savedGameTime && <FormattedTime label=" - " value={savedGameTime} />}
					</Button>
					<Button
						startIcon={<PlayArrowIcon />}
						variant="outlined"
						onClick={async () => {
							await resetGame();
							setActiveScreen(Screens.Game);
						}}
					>
						New Game
					</Button>
					<Button
						startIcon={<QuestionMarkIcon />}
						variant="outlined"
						onClick={async () => setActiveScreen(Screens.Help)}
					>
						How to Play
					</Button>
					<Button
						startIcon={<InfoIcon />}
						variant="outlined"
						onClick={async () => setActiveScreen(Screens.About)}
					>
						About
					</Button>
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
