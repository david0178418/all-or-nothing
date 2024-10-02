import { Box, Button, Typography } from "@mui/material";
import {version} from '@/../package.json';
import { useSetActiveScreen } from "@/atoms";
import { Screens } from "@/types";
import {
	MusicNote as MusicNoteIcon,
	ArrowBack as ArrowBackIcon,
	GitHub as GitHubIcon,
	GraphicEq as GraphicEqIcon,
	Launch as LaunchIcon,
	Image as ImageIcon,
} from "@mui/icons-material";

export default
function AboutScreen() {
	const setActiveScreen = useSetActiveScreen();
	return (

		<Box
			display="flex"
			flexDirection="column"
			maxHeight="100vh"
			textAlign="center"
			paddingTop={5}
		>
			<Typography fontWeight={100} variant="h1" fontSize={40}>
				All <em>or</em> Nothing
			</Typography>
			<Typography>
				version {version}
			</Typography>
			<Typography>
				By David Granado
			</Typography>
			{/* TODO Abstract attribution */ }
			<Box
				width={400}
				margin="0 auto"
				bgcolor="#FFFFFFAA"
				overflow="hidden auto"
				flex={1}
				padding={5}
				paddingBottom={25}
			>
				<Box paddingTop={1} paddingBottom={1}>
					<Button
						fullWidth
						variant="contained"
						startIcon={<GitHubIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://github.com/david0178418/all-or-nothing"
					>
						Github Repo
					</Button>
				</Box>
				<Box paddingTop={1}>
					<Button
						fullWidth
						variant="contained"
						startIcon={<ImageIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://codepen.io/slyka85/pen/gQMzdJ"
					>
						Halloween Background
					</Button>
					<Typography component="em">
					by Anya Melnyk
					</Typography>
				</Box>
				<Box paddingTop={1}>
					<Button
						fullWidth
						variant="contained"
						startIcon={<MusicNoteIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://www.youtube.com/watch?v=khNJsrl6GMk"
					>
						Happy Haunts
					</Button>
					<Typography component="em">
						by Aaron Kenny
					</Typography>
				</Box>
				<Box paddingTop={1}>
					<Button
						fullWidth
						variant="contained"
						startIcon={<MusicNoteIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://www.youtube.com/@thesoundlings/featured"
					>
						Corny Candy
					</Button>
					<Typography component="em">
						by The Soundlings
					</Typography>
				</Box>
				<Box paddingTop={1}>
					<Button
						fullWidth
						variant="contained"
						startIcon={<MusicNoteIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://www.youtube.com/watch?v=khNJsrl6GMk"
					>
						Happy Haunts
					</Button>
					<Typography component="em">
						by Aaron Kenny
					</Typography>
				</Box>
				<Box paddingTop={1}>
					<Button
						fullWidth
						variant="contained"
						startIcon={<MusicNoteIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://www.youtube.com/watch?v=H2boQvP03ZU"
					>
						Theme for a One-Handed Piano Concerto
					</Button>
					<Typography component="em">
						by Sir Cubworth
					</Typography>
				</Box>
				<Box paddingTop={1}>
					<Button
						fullWidth
						variant="contained"
						startIcon={<MusicNoteIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://www.youtube.com/watch?v=rnnxcui3mdc"
					>
						Little Prelude and Fugue
					</Button>
					<Typography component="em">
						by Sir Cubworth
					</Typography>
				</Box>
				<Box paddingTop={1}>
					<Button
						fullWidth
						variant="contained"
						startIcon={<MusicNoteIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://www.youtube.com/channel/UCOFrldzxeKGG8fTpN5_d75Q"
					>
						No.9_Esther’s Waltz
					</Button>
					<Typography component="em">
						By Esther Abrami
					</Typography>
				</Box>
				<Box paddingTop={1}>
					<Button
						fullWidth
						variant="contained"
						startIcon={<MusicNoteIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://www.youtube.com/channel/UCKgGBUFCIZjmC-Lqy8kmJ5w"
					>
						Sonatina No 2 in F Major Allegro
					</Button>
					<Typography component="em">
						By Joel Cummins
					</Typography>
				</Box>
				<Box paddingTop={1}>
					<Button
						fullWidth
						variant="contained"
						startIcon={<GraphicEqIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://pixabay.com/sound-effects/book-foley-turn-pages-7-189812/"
					>
						Sound Effects
					</Button>
					<Typography component="em">
						By floraphonic
					</Typography>
				</Box>
				<Box paddingTop={1}>
					<Button
						fullWidth
						variant="contained"
						startIcon={<GraphicEqIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://pixabay.com/sound-effects/success-221935/"
					>
						More sound effects
					</Button>
					<Typography component="em">
						By updatepelgo
					</Typography>
				</Box>
				<Box paddingTop={3}>
					<Button
						fullWidth
						variant="contained"
						startIcon={<ArrowBackIcon/>}
						onClick={() => setActiveScreen(Screens.Title)}
					>
						Back
					</Button>
				</Box>
			</Box>
		</Box>
	);
}
