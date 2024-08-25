import { Box, Button, Container, Typography } from "@mui/material";
import {version} from '@/../package.json';
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useSetActiveScreen } from "@/atoms";
import { Screens } from "@/types";

export default
function AboutScreen() {
	const setActiveScreen = useSetActiveScreen();
	return (
		<Container sx={{textAlign: 'center', paddingTop: 10}}>
			<Typography fontWeight={100} variant="h1" fontSize={40}>
				Make a <em>Set</em>
			</Typography>
			<Typography>
				version {version}
			</Typography>
			<Typography>
				By David Granado
			</Typography>
			<Box
				paddingTop={5}
				width={300}
				display="inline-block"
			>
				<Button
					fullWidth
					variant="outlined"
					startIcon={<ArrowBackIcon/>}
					onClick={() => setActiveScreen(Screens.Title)}
				>
					Back
				</Button>
			</Box>
		</Container>
	);
}
