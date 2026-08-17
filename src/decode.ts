export function decode(chords: string[], melody: string[]): string {
	const bitsPerSymbol = Math.log2(chords.length);
	const bits = melody
		.map((note) => {
			const index = chords.indexOf(note);
			if (index === -1) throw new Error(`不明なノート: ${note}`);
			return index.toString(2).padStart(bitsPerSymbol, "0");
		})
		.join("");

	const bytes: number[] = [];
	for (let i = 0; i + 8 <= bits.length; i += 8) {
		bytes.push(parseInt(bits.slice(i, i + 8), 2));
	}

	return new TextDecoder().decode(new Uint8Array(bytes));
}
