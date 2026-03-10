// Mulberry32 seeded PRNG — returns a function that produces [0, 1) floats
export
function mulberry32(seed: number) {
	let s = seed | 0;

	return function next(): number {
		s = (s + 0x6D2B79F5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

// Deterministic date-to-seed hash (djb2)
export
function dateToSeed(date: Date): number {
	const str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

	return [...str].reduce(
		(hash, char) => ((hash << 5) + hash + char.charCodeAt(0)) | 0,
		5381,
	);
}

// Seeded Fisher-Yates shuffle
export
function seededShuffle<T>(array: readonly T[], rng: () => number): T[] {
	const result = [...array];

	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		const itemI = result[i];
		const itemJ = result[j];

		if (itemI === undefined || itemJ === undefined) {
			throw new Error(`Array index out of bounds: ${i}, ${j}`);
		}

		result[i] = itemJ;
		result[j] = itemI;
	}

	return result;
}
