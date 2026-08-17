import toWav from "audiobuffer-to-wav";
import { noteToFrequency } from "./notes.ts";

const SAMPLE_RATE = 44100;

export function renderToWav(notes: string[], bpm: number): Blob {
	const secondsPerNote = 60 / bpm;
	const samplesPerNote = Math.round(SAMPLE_RATE * secondsPerNote);

	const ctx = new OfflineAudioContext(
		1,
		notes.length * samplesPerNote,
		SAMPLE_RATE,
	);
	const buffer = ctx.createBuffer(
		1,
		notes.length * samplesPerNote,
		SAMPLE_RATE,
	);
	const data = buffer.getChannelData(0);

	notes.forEach((note, noteIdx) => {
		const freq = noteToFrequency(note);
		const offset = noteIdx * samplesPerNote;
		for (let i = 0; i < samplesPerNote; i++) {
			data[offset + i] = Math.sin((2 * Math.PI * freq * i) / SAMPLE_RATE);
		}
	});

	return new Blob([toWav(buffer)], { type: "audio/wav" });
}
