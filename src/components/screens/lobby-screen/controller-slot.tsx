import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { SportsEsports as ControllerIcon, Keyboard as KeyboardIcon } from '@mui/icons-material';
import { ControllerType } from '@/input/input-types';

interface ControllerSlotProps {
	sourceIndex: number | 'keyboard';
	controllerType: ControllerType;
	playerColor: string | null;
	playerLabel: string | null;
	isJoined: boolean;
}

export default function ControllerSlot({
	sourceIndex,
	controllerType,
	playerColor,
	playerLabel,
	isJoined,
}: ControllerSlotProps) {
	const isKeyboard = sourceIndex === 'keyboard';
	const label = isKeyboard ? 'Keyboard' : `Controller ${sourceIndex + 1}`;

	return (
		<Box
			component={motion.div}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 2,
				padding: 2,
				borderRadius: 2,
				border: '2px solid',
				borderColor: isJoined ? playerColor : 'grey.600',
				bgcolor: isJoined ? `${playerColor}20` : 'grey.900',
				transition: 'border-color 0.3s, background-color 0.3s',
				minWidth: 280,
			}}
		>
			<Box
				sx={{
					color: isJoined ? playerColor : 'grey.500',
					display: 'flex',
					alignItems: 'center',
				}}
			>
				{isKeyboard ? <KeyboardIcon fontSize="large" /> : <ControllerIcon fontSize="large" />}
			</Box>
			<Box flex={1}>
				<Typography variant="body1" fontWeight={500}>
					{label}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{controllerType}
				</Typography>
			</Box>
			<Box>
				{isJoined ? (
					<Typography
						variant="body1"
						fontWeight={700}
						sx={{ color: playerColor }}
					>
						{playerLabel}
					</Typography>
				) : (
					<Typography variant="body2" color="text.secondary">
						Press SELECT to join
					</Typography>
				)}
			</Box>
		</Box>
	);
}
