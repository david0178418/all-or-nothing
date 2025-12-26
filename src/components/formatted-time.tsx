import { Typography, TypographyProps } from '@mui/material';

interface Props {
	label: string;
	value: number;
	variant?: TypographyProps['variant'];
}

export default
function FormattedTime(props: Props) {
	const {
		label,
		value,
		variant = 'subtitle1',
	} = props;

	return (
		<Typography variant={variant}>
			{label} <strong>{value / 60 | 0}:{(value % 60).toString().padStart(2, '0')}</strong>
		</Typography>
	);
}
