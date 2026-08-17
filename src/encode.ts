function isPowerOfTwo(n: number): boolean {
	return n > 0 && (n & (n - 1)) === 0;
}

export function encode(chords: string[], bits: string): string[] {
	if (!isPowerOfTwo(chords.length)) {
		throw new Error(`chords.length must be a power of 2, got ${chords.length}`);
	}

	const bitsPerSymbol = Math.log2(chords.length);

	if (bits.length % bitsPerSymbol !== 0) {
		throw new Error(
			`bits.length (${bits.length}) must be divisible by ${bitsPerSymbol}`,
		);
	}

	const melody: string[] = [];

	for (let i = 0; i < bits.length; i += bitsPerSymbol) {
		const chunk = bits.slice(i, i + bitsPerSymbol);
		const index = parseInt(chunk, 2);
		melody.push(chords[index]);
	}

	return melody;
}
