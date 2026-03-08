import { useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

export function useAnimatedNumber(value: number) {
	const spring = useSpring(value, {
		stiffness: 120,
		damping: 20,
		mass: 0.8,
	});

	useEffect(() => {
		spring.set(value);
	}, [spring, value]);

	return useTransform(spring, v => Math.round(v).toLocaleString());
}
