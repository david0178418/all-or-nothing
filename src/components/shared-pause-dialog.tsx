import { ReactNode, useEffect } from 'react';
import { useIsPaused } from '@/atoms';
import { useSetActiveGroup } from '@/focus/focus-atoms';
import {
	Dialog,
	DialogContent,
	DialogContentText,
	Box,
} from '@mui/material';

interface SharedPauseDialogProps {
	focusGroup: string;
	children: ReactNode;
	onClose: () => void;
}

export default
function SharedPauseDialog({ focusGroup, children, onClose }: SharedPauseDialogProps) {
	const paused = useIsPaused();
	const setActiveGroup = useSetActiveGroup();

	useEffect(() => {
		setActiveGroup(paused ? focusGroup : null);
	}, [paused, setActiveGroup, focusGroup]);

	return (
		<Dialog open={paused} onClose={onClose}>
			<DialogContent>
				<DialogContentText>
					Paused
				</DialogContentText>
				<Box
					display="inline-block"
					width={300}
				>
					<Box display="flex" flexDirection="column" gap={2}>
						{children}
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
