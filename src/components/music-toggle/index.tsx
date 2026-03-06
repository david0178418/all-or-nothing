import { useIsMusicEnabled } from "@/atoms";
import useSound from "use-sound";
import { useEffect, useMemo, useState } from "react";
import { randomChoice } from "@/utils";
import { useGameTheme } from "@/themes";

export function useMusic() {
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
