import { Box } from '@mui/material';
import { Card, ColorValues, CountValues, Enum, FillValues, ShapeValues } from '../types';

interface Props {
	card: Card;
	selected?: boolean;
	onClick?(): void;
}

export default
function PlayingCard(props: Props) {
	const {
		onClick = () => {},
		selected,
		card: {
			color,
			count,
			fill,
			shape,
		}
	} = props;

	return (
		<Box
			width="108px"
			maxWidth="100%"
			border="2px solid black"
			padding="5px"
			display="flex"
			borderRadius="10px"
			boxShadow="3px 3px 4px #000"
			onClick={onClick}
			bgcolor={selected ? 'red' : 'white'}
			sx={{
				cursor: 'pointer',
				aspectRatio: '.65',
			}}
		>
			<Box
				flex="1"
				bgcolor="white"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
			>
				{Array(CountValues[count]).fill(0).map((_, i) => (
					<Shape
						key={i}
						color={ColorValues[color]}
						fill={FillValues[fill]}
						type={ShapeValues[shape]}
					/>
				))}
			</Box>
		</Box>
	);
}

interface ShapeProps {
	color: string;
	fill: Enum<typeof FillValues>;
	type: Enum<typeof ShapeValues>;
}

function Shape(props: ShapeProps) {
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

interface FooProps {
	stroke: string;
	fill: string;
}

function Triangle(props: FooProps) {
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

function Circle(props: FooProps) {
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

function Square(props: FooProps) {
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
