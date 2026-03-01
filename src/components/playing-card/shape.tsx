import { Box } from '@mui/material';
import type { FunctionComponent, SVGProps } from 'react';
import {
	Enum,
	FillValues,
} from '@/types';

interface Props {
	color: string;
	fill: Enum<typeof FillValues>;
	SvgComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export default
function Shape(props: Props) {
	const {
		color,
		fill,
		SvgComponent,
	} = props;
	const fillColor = (fill === 'outline' ? 'none' : color);
	const opacity = fill === 'filled' ? '59' : '';
	const detailStroke = fill === 'solid' ? 'white' : color;

	return (
		<Box
			width="40%"
			textAlign="center"
			sx={{ aspectRatio: 1 }}
		>
			<SvgComponent
				viewBox="0 0 100 100"
				preserveAspectRatio="xMidYMid meet"
				fill={fillColor+opacity}
				stroke={color}
				strokeWidth={10}
				color={detailStroke}
			/>
		</Box>
	);
}
