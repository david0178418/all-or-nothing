import { Box } from '@mui/material';
import {
	Enum,
	FillValues,
	ShapeValues,
} from '@/types';
import TriangleSvg from './assets/shapes/default/triangle.svg?react';
import CircleSvg from './assets/shapes/default/circle.svg?react';
import SquareSvg from './assets/shapes/default/square.svg?react';

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
		<TriangleSvg
			viewBox="0 0 100 100"
			preserveAspectRatio="xMidYMid meet"
			fill={fill}
			stroke={stroke}
			strokeWidth={10}
		/>
	);
}

function Circle(props: SvgShapeProps) {
	const { fill, stroke } = props;
	return (
		<CircleSvg
			viewBox="0 0 100 100"
			preserveAspectRatio="xMidYMid meet"
			fill={fill}
			stroke={stroke}
			strokeWidth={10}
		/>
	);
}

function Square(props: SvgShapeProps) {
	const { fill, stroke } = props;
	return (
		<SquareSvg
			viewBox="0 0 100 100"
			preserveAspectRatio="xMidYMid meet"
			fill={fill}
			stroke={stroke}
			strokeWidth={10}
		/>
	);
}
