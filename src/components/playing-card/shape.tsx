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
			<defs id="defs1" />
			<g
				style={{ display: 'inline' }}
			>
				<path
					id="path3"
					style={{ fill, stroke, strokeWidth: '5' }}
					d="m 44,12 -1,7 -1.207031,6.40625 c -0.9059,1.638503 -1.516972,3.560016 -1.710938,5.660156 L 20,15 5,45 H 15 L 25,55 37,56 50,70.171875 63,56 75,55 85,45 H 95 L 80,15 59.929688,31.054688 C 59.735542,28.969887 59.130631,27.061406 58.234375,25.431641 L 57,19 l -1,-7 -5,7 1.623047,1.443359 C 51.78456,20.158189 50.906269,20.000367 50,20 c -0.908786,0.0018 -1.790561,0.161161 -2.630859,0.449219 L 49,19 Z"
				/>
			</g>
		</svg>
	);
}

function Circle(props: SvgShapeProps) {
	//TODO Implement Themeing
	// const { fill, stroke } = props;
	// return (
	// 	<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
	// 		<circle
	// 			cx="50"
	// 			cy="50"
	// 			r="40"
	// 			fill={fill}
	// 			stroke={stroke}
	// 			strokeWidth={10}
	// 		/>
	// 	</svg>
	// );

	const { fill, stroke } = props;
	return (
		<svg
			viewBox="0 0 100 100"
			preserveAspectRatio="xMidYMid meet"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g id="layer2">
				<path
					id="path1"
					style={{
						fill,
						stroke,
						strokeWidth: 5,
					}}
					d="M 25.934945,10.88542 C 12.967205,10.885736 2.454854,29.640666 2.4548035,52.775994 2.454854,75.911322 12.967205,94.666252 25.934945,94.666568 c 2.265128,-0.02016 4.516703,-0.624965 6.684737,-1.795624 2.168033,1.170659 4.419608,1.775467 6.684736,1.795624 3.70675,-0.02991 7.401114,0.917334 10.695957,-2.112581 3.295472,3.030487 6.902099,2.083258 10.609556,2.112581 2.280503,-0.02043 4.547173,-0.633463 6.728606,-1.819801 2.180762,1.18598 4.446714,1.799014 6.726516,1.819801 12.96774,-3.17e-4 23.48009,-18.755247 23.48014,-41.890574 -5e-5,-23.135327 -10.5124,-41.890257 -23.48014,-41.890574 -2.263667,0.02016 -4.513805,0.624223 -6.680559,1.793427 -2.19692,-1.185305 -4.479381,-1.78954 -6.774563,-1.793427 C 56.920529,10.91599 53.282907,10.996346 50,14 46.688799,10.970632 43.025613,10.889538 39.304418,10.88542 c -2.2497,0.01912 -4.486184,0.614963 -6.640867,1.769251 -2.182853,-1.169218 -4.449495,-1.76522 -6.728606,-1.769251 z"
				/>
			</g>
			<g id="layer3">
				<path
					id="path3"
					style={{
						fill: '#834e00',
						fillOpacity: 1,
						stroke: '#000000',
						strokeWidth: 1.11333,
					}}
					d="m 49.881365,14.51959 -3.708525,-2.101562 -2.469136,-1 -3.703704,-1 -2.469136,-10.00000021 h 24.691358 l -2.469136,10.00000021 -3.703703,1 -2.469136,1 z"
				/>
			</g>
			<g id="layer1" style={{ display: 'inline' }}>
				<path
					id="path2"
					style={{
						fill: '#000000',
						stroke: '#000000',
						strokeWidth: 1.74134,
					}}
					d="m 16.336824,53.739867 a 34.311071,23.723475 0 0 0 12.67782,14.368939 l 4.605358,-3.779376 1.334028,6.341263 a 34.311071,23.723475 0 0 0 15.047657,2.477996 34.311071,23.723475 0 0 0 15.874025,-2.749027 l 1.145079,-5.442127 3.895089,3.196443 a 34.311071,23.723475 0 0 0 12.752946,-14.414111 48.179251,23.514705 0 0 1 -6.173864,2.46509 l -1.802988,7.246851 -5.821006,-5.125926 a 48.179251,23.514705 0 0 1 -7.189183,1.301378 l -2.89343,6.547762 -4.744223,-5.822862 a 48.179251,23.514705 0 0 1 -5.042445,0.14412 48.179251,23.514705 0 0 1 -4.919514,-0.141967 l -4.229735,5.192606 -2.572443,-5.818561 a 48.179251,23.514705 0 0 1 -8.227267,-1.400325 l -5.10391,4.495671 -1.566231,-6.289637 a 48.179251,23.514705 0 0 1 -7.045763,-2.7942 z"
				/>
				<polygon
					points="50,15 90,85 10,85"
					transform="matrix(0.21854387,0,0,0.20649972,24.454818,22.470217)"
				/>
				<polygon
					points="10,85 50,15 90,85"
					transform="matrix(0.21854387,0,0,0.20649972,53.594002,22.470217)"
				/>
			</g>
		</svg>
	);
}

function Square(props: SvgShapeProps) {
	const { fill, stroke } = props;
	return (
		// TODO Implement theming
		// <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
		// 	<rect
		// 		x="10"
		// 		y="10"
		// 		width="80"
		// 		height="80"
		// 		fill={fill}
		// 		stroke={stroke}
		// 		strokeWidth={10}
		// 	/>
		// </svg>

		<svg
			viewBox="0 0 100 100"
			preserveAspectRatio="xMidYMid meet"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g id="layer1" style={{ display: 'inline' }}>
				<path
					id="path1"
					style={{
						fill,
						stroke,
						strokeWidth: 5,
					}}
					d="M 49.998047 5 A 45 50 0 0 0 4.9980469 55 L 5 82 C 5.0000003 87.242439 7.8681065 92.085812 12.525391 94.707031 C 17.182674 97.328251 22.920842 97.328251 27.578125 94.707031 C 32.235409 92.085812 35.105469 87.24244 35.105469 82 C 35.105468 87.25852 37.918495 92.116833 42.484375 94.746094 C 47.050256 97.375354 52.674353 97.375354 57.240234 94.746094 C 61.806114 92.116833 65.373047 87.25852 65.373047 82 C 65.373047 87.255431 68.195952 92.112519 72.779297 94.740234 C 77.362641 97.36795 83.010406 97.36795 87.59375 94.740234 C 92.177094 92.112519 95 87.255482 95 82 L 94.998047 55 A 45 50 0 0 0 49.998047 5 z"
				/>
				<path
					style={{
						fill: '#000000',
						fillOpacity: 1,
						stroke: '#000000',
						strokeWidth: 5,
					}}
					d="m 42.5,-38.201557 a 7.5,10.5 0 0 1 -3.75,9.093267 7.5,10.5 0 0 1 -7.5,-1e-6 7.5,10.5 0 0 1 -3.75,-9.093266 H 35 Z"
					transform="scale(1,-1)"
				/>
				<path
					style={{
						display: 'inline',
						fill: '#000000',
						fillOpacity: 1,
						stroke: '#000000',
						strokeWidth: 5,
					}}
					d="m 70.014328,-38.201557 a 7.5,10.5 0 0 1 -3.75,9.093267 7.5,10.5 0 0 1 -7.5,-1e-6 7.5,10.5 0 0 1 -3.75,-9.093266 h 7.5 z"
					transform="scale(1,-1)"
				/>
			</g>
		</svg>
	);
}
