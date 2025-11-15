import { Box, Container, Fab, Typography } from '@mui/material';
import HelpContent from '../help-content';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSetActiveScreen } from '@/atoms';
import { Screens } from '@/types';
import { useScrollable } from '@/focus/useScrollable';
import { useRef } from 'react';

export default
function HelpScreen() {
	const setActiveScreen = useSetActiveScreen();
	const contentRef = useRef<HTMLDivElement>(null);

	useScrollable({ ref: contentRef });

	return (
		<Container sx={{
			height: '100vh',
			display: 'flex',
			flexDirection: 'column',
			position: 'relative',
		}}>
			<Typography variant="h1" fontSize={40} paddingTop={2}>
				How to Play
			</Typography>
			<Box
				ref={contentRef}
				flex={1}
				overflow='auto'
				paddingBottom={2}
			>
				<HelpContent/>
			</Box>
			<Fab
				color="primary"
				aria-label="back"
				onClick={() => setActiveScreen(Screens.Title)}
				sx={{
					position: 'fixed',
					bottom: 16,
					right: 16,
				}}
			>
				<ArrowBackIcon />
			</Fab>
		</Container>
	);
}
