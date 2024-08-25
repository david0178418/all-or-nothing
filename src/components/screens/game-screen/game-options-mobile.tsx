import { useState } from 'react';
import { usePausedState } from '@/atoms';
import {
	Menu as MenuIcon,
	Pause as PauseIcon,
	QuestionMark as QuestionMarkIcon,
	Shuffle as ShuffleIcon,
} from '@mui/icons-material';
import {
	Fab,
	SwipeableDrawer,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	ListItemIcon,
} from '@mui/material';

interface Props {
	onReshuffle(): void;
	onHintMessage(): void;
}

export default
function GameOptionsMobile(props: Props) {
	const [, setIsPaused] = usePausedState();
	const [isOpen, setIsOpen] = useState(false);
	const {
		onReshuffle,
		onHintMessage,
	} = props;

	return (
		<>
			<Fab
				color="primary"
				size="small"
				sx={{
					position: 'fixed',
					bottom: 16,
					left: 16,
					display: {
						sm: 'none',
					}
				}}
				onClick={() => setIsOpen(true)}
			>
				<MenuIcon />
			</Fab>
			<SwipeableDrawer
				anchor="bottom"
				open={isOpen}
				onClose={() => setIsOpen(false)}
				onOpen={() => {}}

			>
				<List sx={{paddingBottom: 5}}>
					<ListItem>
						<ListItemButton
							onClick={() => {
								setIsOpen(false);
								setIsPaused(true);
							}}
						>
							<ListItemIcon>
								<PauseIcon />
							</ListItemIcon>
							<ListItemText>
								Pause
							</ListItemText>
						</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton
							onClick={() => {
								setIsOpen(false);
								onHintMessage();
							}}
						>
							<ListItemIcon>
								<QuestionMarkIcon />
							</ListItemIcon>
							<ListItemText>
								Hint
							</ListItemText>
						</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton
							onClick={() => {
								setIsOpen(false);
								onReshuffle();
							}}
						>
							<ListItemIcon>
								<ShuffleIcon />
							</ListItemIcon>
							<ListItemText>
								Sufffle
							</ListItemText>
						</ListItemButton>
					</ListItem>
				</List>
			</SwipeableDrawer>
		</>
	);
}
