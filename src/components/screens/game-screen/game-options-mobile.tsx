import { useState } from 'react';
import { useSetIsPaused } from '@/atoms';
import {
	Menu as MenuIcon,
	Pause as PauseIcon,
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
}

export default
function GameOptionsMobile(props: Props) {
	const setIsPaused = useSetIsPaused();
	const [isOpen, setIsOpen] = useState(false);
	const { onReshuffle } = props;

	return (
		<>
			<Fab
				color="primary"
				size="small"
				sx={{
					position: 'fixed',
					bottom: 16,
					left: 16,
					zIndex: (theme) => theme.zIndex.speedDial,
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
								onReshuffle();
							}}
						>
							<ListItemIcon>
								<ShuffleIcon />
							</ListItemIcon>
							<ListItemText>
								No sets
							</ListItemText>
						</ListItemButton>
					</ListItem>
				</List>
			</SwipeableDrawer>
		</>
	);
}
