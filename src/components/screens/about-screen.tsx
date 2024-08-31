import { Box, Button, Container, Typography } from "@mui/material";
import {version} from '@/../package.json';
import { useSetActiveScreen } from "@/atoms";
import { Screens } from "@/types";
import {
	ArrowBack as ArrowBackIcon,
	GitHub as GitHubIcon,
	Launch as LaunchIcon,
} from "@mui/icons-material";

export default
function AboutScreen() {
	const setActiveScreen = useSetActiveScreen();
	return (
		<Container sx={{textAlign: 'center', paddingTop: 10}}>
			<Typography fontWeight={100} variant="h1" fontSize={40}>
				All <em>or</em> Nothing
			</Typography>
			<Typography>
				version {version}
			</Typography>
			<Typography>
				By David Granado
			</Typography>
			<Box width={300} margin="0 auto">
				<Box paddingTop={5}>
					<Button
						fullWidth
						variant="outlined"
						startIcon={<GitHubIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://github.com/david0178418/all-or-nothing"
					>
						Github Repo
					</Button>
				</Box><br/>
				<Box paddingTop={3}>
					<Button
						fullWidth
						variant="outlined"
						startIcon={<ArrowBackIcon/>}
						onClick={() => setActiveScreen(Screens.Title)}
					>
						Back
					</Button>
				</Box>
			</Box>
		</Container>
	);
}
