import { Box, Button, Container, Typography } from '@mui/material';
import HelpContent from '../help-contnet';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSetActiveScreen } from '@/atoms';
import { Screens } from '@/types';

export default
function HelpScreen() {
	const setActiveScreen = useSetActiveScreen();
	return (
		<Container sx={{ maxHeight: '100vh', overflow: 'auto' }}>
			<Typography variant="h1" fontSize={40}>
				How to Play
			</Typography>
			<Box textAlign="center">
				<Box
					paddingY={3}
					width={300}
					display="inline-block"
				>
					<Button
						fullWidth
						startIcon={<ArrowBackIcon/>}
						onClick={() => setActiveScreen(Screens.Title)}
					>
						Back
					</Button>
				</Box>
			</Box>
			<HelpContent/>
			<Box textAlign="center">
				<Box
					paddingTop={5}
					paddingBottom={10}
					width={300}
					display="inline-block"
				>
					<Button
						fullWidth
						startIcon={<ArrowBackIcon/>}
						onClick={() => setActiveScreen(Screens.Title)}
					>
						Back
					</Button>
				</Box>
			</Box>
		</Container>
	);
}
