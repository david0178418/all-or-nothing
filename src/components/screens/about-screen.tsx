import { Box, Button, Container, Stack, Typography } from "@mui/material";
import {version} from '@/../package.json';
import { useSetActiveScreen, useActiveController } from "@/atoms";
import { Screens } from "@/types";
import { useBackAction } from '@/input/useBackAction';
import { InputAction } from '@/input/input-types';
import { ButtonGlyphMap } from '@/components/button-prompts/button-glyph-map';
import {
	MusicNote as MusicNoteIcon,
	ArrowBack as ArrowBackIcon,
	GitHub as GitHubIcon,
	GraphicEq as GraphicEqIcon,
	Launch as LaunchIcon,
} from "@mui/icons-material";

export default
function AboutScreen() {
	const setActiveScreen = useSetActiveScreen();
	const activeController = useActiveController();

	useBackAction(() => setActiveScreen(Screens.Title));

	const GlyphComponent = activeController
		? ButtonGlyphMap[activeController]?.[InputAction.BACK]
		: null;

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
						startIcon={<GitHubIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://github.com/david0178418/all-or-nothing"
					>
						Github Repo
					</Button>
				</Box>
				<Box paddingTop={3}>
					<Typography component="em">
						Theme for a One-Handed Piano Concerto
					</Typography>
					<Typography component="em">
						Little Prelude and Fugue
					</Typography>
					<Button
						fullWidth
						startIcon={<MusicNoteIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://www.youtube.com/channel/UC3edSSIDJPTZmBM-m9_G3Nw"
					>
						by Sir Cubworth
					</Button>
				</Box>
				<Box paddingTop={3}>
					<Typography component="em">
						No.9_Esther's Waltz
					</Typography>
					<Button
						fullWidth
						startIcon={<MusicNoteIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://www.youtube.com/channel/UCOFrldzxeKGG8fTpN5_d75Q"
					>
						By Esther Abrami
					</Button>
				</Box>
				<Box paddingTop={3}>
					<Typography component="em">
						Sonatina No 2 in F Major Allegro
					</Typography>
					<Button
						fullWidth
						startIcon={<MusicNoteIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://www.youtube.com/channel/UCKgGBUFCIZjmC-Lqy8kmJ5w"
					>
						By Joel Cummins
					</Button>
				</Box>
				<Box paddingTop={3}>
					<Button
						fullWidth
						startIcon={<GraphicEqIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://pixabay.com/sound-effects/book-foley-turn-pages-7-189812/"
					>
						Sounds by floraphonic
					</Button>
				</Box>
				<Box paddingTop={3}>
					<Button
						fullWidth
						startIcon={<GraphicEqIcon/>}
						endIcon={<LaunchIcon />}
						target="_blank"
						href="https://pixabay.com/sound-effects/success-221935/"
					>
						Also by updatepelgo
					</Button>
				</Box>
				<Box paddingTop={5}>
					<Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
						<Button
							fullWidth
							startIcon={<ArrowBackIcon/>}
							onClick={() => setActiveScreen(Screens.Title)}
						>
							Back
						</Button>
						{GlyphComponent && (
							<GlyphComponent
								width={20}
								height={20}
								viewBox="0 0 64 64"
								aria-hidden="true"
								style={{ display: 'block' }}
							/>
						)}
					</Stack>
				</Box>
			</Box>
		</Container>
	);
}
