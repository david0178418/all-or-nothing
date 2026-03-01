import { Fab } from "@mui/material";
import { useIsMusicEnabled, useSetIsMusicEnabled, useActiveController } from "@/atoms";
import useSound from "use-sound";
import { useEffect, useMemo, useState } from "react";
import {
	MusicNote as MusicNoteIcon,
	MusicOff as MusicOffIcon,
} from '@mui/icons-material';
import { randomChoice } from "@/utils";
import { useGameTheme } from "@/themes";

export default
function MusicToggle() {
	const isEnabled = useIsMusicEnabled();
	const setIsEnabled = useSetIsMusicEnabled();
	const activeController = useActiveController();
	useMusic();

	if (activeController !== null) return null;

	return (
		<Fab
			color="primary"
			size="small"
			sx={{
				position: 'fixed',
				bottom: 16,
				right: 64,
			}}
			onClick={() => setIsEnabled(!isEnabled)}
		>
			{isEnabled ? (
				<MusicNoteIcon />
			): (
				<MusicOffIcon />
			)}
		</Fab>
	);
}

function useMusic() {
	const isEnabled = useIsMusicEnabled();
	const { music } = useGameTheme();
	const activeSong = useMemo(() => randomChoice(...music), [music]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [play, { stop }] = useSound(activeSong.src, {
		volume: activeSong.volume,
		loop: true,
		onload: () => setIsLoaded(true),
	});

	useEffect(() => {
		setIsLoaded(false);
	}, [activeSong.src]);

	useEffect(() => {
		return stop;
	}, [stop]);

	useEffect(() => {
		if (!isLoaded) return;

		isEnabled ?
			play() :
			stop();
	}, [isEnabled, isLoaded]);
}

