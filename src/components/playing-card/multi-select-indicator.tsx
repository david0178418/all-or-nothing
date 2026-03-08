import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface MultiSelectIndicatorProps {
	colors: readonly string[];
}

function buildBackground(colors: readonly string[]): string {
	if (colors.length === 1) return colors[0] ?? 'transparent';

	// Hard-edge diagonal split: each color gets an equal-width stripe
	const segmentSize = 100 / colors.length;
	const stops = colors.flatMap((color, i) => {
		const start = `${color} ${segmentSize * i}%`;
		const end = `${color} ${segmentSize * (i + 1)}%`;
		return [start, end];
	});
	return `linear-gradient(135deg, ${stops.join(', ')})`;
}

export default function MultiSelectIndicator({ colors }: MultiSelectIndicatorProps) {
	const visible = colors.length > 0;

	return (
		<AnimatePresence>
			{visible && (
				<Box
					component={motion.div}
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.35 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: buildBackground(colors),
						borderRadius: '8px',
						pointerEvents: 'none',
						zIndex: 5,
					}}
				/>
			)}
		</AnimatePresence>
	);
}
