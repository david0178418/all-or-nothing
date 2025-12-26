import { Typography } from '@mui/material';

interface Props {
	label: string;
	value: number;
}

export default
function FormattedTime(props: Props) {
	const {
		label,
		value,
	} = props;

	return (
		<Typography variant="h5">
			{label} <strong>{value / 60 | 0}:{(value % 60).toString().padStart(2, '0')}</strong>
		</Typography>
	);
}
