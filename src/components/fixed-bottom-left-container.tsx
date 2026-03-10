import { type ReactNode } from 'react';
import { Box } from '@mui/material';

export default
function FixedBottomLeftContainer({ children }: { children: ReactNode }) {
	return (
		<Box
			sx={{
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				pointerEvents: 'none',
				display: {
					xs: 'none',
					sm: 'block',
				},
			}}
		>
			<Box
				sx={{
					maxWidth: 'xl',
					margin: '0 auto',
					position: 'relative',
					height: 0,
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						bottom: 16,
						left: 16,
						pointerEvents: 'auto',
					}}
				>
					{children}
				</Box>
			</Box>
		</Box>
	);
}
