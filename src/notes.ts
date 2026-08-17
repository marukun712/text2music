const NOTE_SEMITONES: Record<string, number> = {
	C: 0,
	"C#": 1,
	Db: 1,
	D: 2,
	"D#": 3,
	Eb: 3,
	E: 4,
	F: 5,
	"F#": 6,
	Gb: 6,
	G: 7,
	"G#": 8,
	Ab: 8,
	A: 9,
	"A#": 10,
	Bb: 10,
	B: 11,
};

export function noteToFrequency(note: string): number {
	const match = note.match(/^([A-G][#b]?)(\d+)$/);
	if (!match) throw new Error(`無効なノート名: ${note}`);
	const semitone = NOTE_SEMITONES[match[1]];
	if (semitone === undefined) throw new Error(`無効なノート名: ${note}`);
	const octave = parseInt(match[2], 10);
	const midi = (octave + 1) * 12 + semitone;
	return 440 * 2 ** ((midi - 69) / 12);
}
