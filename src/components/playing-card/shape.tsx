import { Box } from '@mui/material';
import {
	Enum,
	FillValues,
	ShapeValues,
} from '@/types';

interface Props {
	color: string;
	fill: Enum<typeof FillValues>;
	type: Enum<typeof ShapeValues>;
}

export default
function Shape(props: Props) {
	const {
		color,
		fill,
		type,
	} = props;
	const fillColor = (fill === 'outline' ? 'none' : color);
	const opacity = fill === 'filled' ? '59' : '';

	return (
		<Box
			width="40%"
			textAlign="center"
			sx={{ aspectRatio: 1 }}
		>
			{type === 'triangle' && (
				<Triangle
					stroke={color}
					fill={fillColor+opacity}
				/>
			)}
			{type === 'circle' && (
				<Circle
					stroke={color}
					fill={fillColor+opacity}
				/>
			)}
			{type === 'square' && (
				<Square
					stroke={color}
					fill={fillColor+opacity}
				/>
			)}
		</Box>
	);
}

interface SvgShapeProps {
	stroke: string;
	fill: string;
}

function Triangle(props: SvgShapeProps) {
	const { fill, stroke } = props;
	return (
		<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
			<polygon
				points="50,15 90,85 10,85"
				fill={fill}
				stroke={stroke}
				strokeWidth={10}
			/>
		</svg>
	);
}

function Circle(props: SvgShapeProps) {
	const { fill, stroke } = props;
	return (
		<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
			<circle
				cx="50"
				cy="50"
				r="40"
				fill={fill}
				stroke={stroke}
				strokeWidth={10}
			/>
		</svg>
	);
}

function Square(props: SvgShapeProps) {
	const { fill, stroke } = props;
	return (
		<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
			<rect
				x="10"
				y="10"
				width="80"
				height="80"
				fill={fill}
				stroke={stroke}
				strokeWidth={10}
			/>
		</svg>
	);
}
