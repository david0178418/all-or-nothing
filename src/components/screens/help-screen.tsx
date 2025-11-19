import { Box, Container, Fab, Typography } from '@mui/material';
import HelpContent from '../help-content';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSetActiveScreen, useActiveController } from '@/atoms';
import { Screens } from '@/types';
import { useScrollable } from '@/focus/useScrollable';
import { useBackAction } from '@/input/useBackAction';
import { InputAction } from '@/input/input-types';
import { ButtonPromptsBar } from '@/components/button-prompts';
import { useRef } from 'react';

export default
function HelpScreen() {
	const setActiveScreen = useSetActiveScreen();
	const activeController = useActiveController();
	const contentRef = useRef<HTMLDivElement>(null);

	useScrollable({ ref: contentRef });
	useBackAction(() => setActiveScreen(Screens.Title));

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
			{activeController && (
				<Box
					sx={{
						position: 'fixed',
						bottom: 16,
						left: 16,
					}}
				>
					<ButtonPromptsBar
						controllerType={activeController}
						prompts={[
							{ action: InputAction.BACK, label: 'Back' },
						]}
					/>
				</Box>
			)}
			{!activeController && (
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
			)}
		</Container>
	);
}
