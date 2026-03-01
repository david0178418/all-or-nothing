import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ScorePopup } from '@/types';

interface GameScorePopupsProps {
	popups: ScorePopup[];
	onComplete: (id: string) => void;
}

export default
function GameScorePopups({ popups, onComplete }: GameScorePopupsProps) {
	return (
		<Box
			sx={{
				position: 'absolute',
				inset: 0,
				pointerEvents: 'none',
				zIndex: 1100,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<AnimatePresence>
				{popups.map((popup, index) => (
					<ScorePopupItem
						key={popup.id}
						popup={popup}
						index={index}
						onComplete={onComplete}
					/>
				))}
			</AnimatePresence>
		</Box>
	);
}

interface ScorePopupItemProps {
	popup: ScorePopup;
	index: number;
	onComplete: (id: string) => void;
}

function ScorePopupItem({ popup, index, onComplete }: ScorePopupItemProps) {
	const isReward = popup.variant === 'reward';
	const formattedPoints = isReward
		? `+${popup.points.toLocaleString()}`
		: `-${popup.points.toLocaleString()}`;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20, scale: 0.5 }}
			animate={{
				opacity: [0, 1, 1, 1, 0],
				y: [20, 0 - index * 50, -30 - index * 50, -60 - index * 50, -90 - index * 50],
				scale: [0.5, 1, 1, 1.05, 1.1],
			}}
			transition={{
				duration: 2,
				ease: 'easeOut',
				times: [0, 0.1, 0.5, 0.75, 1],
			}}
			onAnimationComplete={() => onComplete(popup.id)}
			style={{ position: 'absolute' }}
		>
			<Typography
				variant="h2"
				sx={{
					fontWeight: 900,
					color: isReward ? '#fff' : '#ff6b6b',
					textShadow: isReward
						? '0 0 12px rgba(76, 175, 80, 0.9), 0 2px 4px rgba(0, 0, 0, 0.8)'
						: '0 0 12px rgba(244, 67, 54, 0.7), 0 2px 4px rgba(0, 0, 0, 0.8)',
					textAlign: 'center',
					lineHeight: 1,
				}}
			>
				{formattedPoints}
			</Typography>
			{isReward && popup.comboCount > 0 && (
				<Typography
					variant="h6"
					sx={{
						fontWeight: 'bold',
						color: '#ffd54f',
						textShadow: '0 0 10px rgba(255, 193, 7, 0.7), 0 2px 4px rgba(0, 0, 0, 0.8)',
						textAlign: 'center',
					}}
				>
					×{popup.comboCount} Combo!
				</Typography>
			)}
		</motion.div>
	);
}
