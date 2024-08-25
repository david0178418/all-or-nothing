import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default
function Loader() {

	return (
		<Backdrop
			open
			sx={{
				display: 'flex',
				color: '#fff',
				// zIndex: (theme) => theme.zIndex.modal + 1,
			}}
		>
			<CircularProgress color="inherit" />
		</Backdrop>
	);
}
