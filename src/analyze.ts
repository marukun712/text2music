import { PitchDetector } from "pitchy";
import { noteToFrequency } from "./notes.ts";

export async function analyzeAudio(
	file: File,
	chords: string[],
	bpm: number,
): Promise<string[]> {
	const arrayBuffer = await file.arrayBuffer();
	const audioCtx = new AudioContext();
	const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
	audioCtx.close();

	const sampleRate = audioBuffer.sampleRate;
	const channel = audioBuffer.getChannelData(0);
	const samplesPerNote = Math.round((sampleRate * 60) / bpm);

	const chunkSize = 4096;
	const detector = PitchDetector.forFloat32Array(chunkSize);

	const chordFrequencies = chords.map(noteToFrequency);
	const noteCount = Math.floor(channel.length / samplesPerNote);

	const melody: string[] = [];
	for (let i = 0; i < noteCount; i++) {
		const windowStart = i * samplesPerNote;
		const windowMid = windowStart + Math.floor(samplesPerNote * 0.3);
		const chunk = channel.slice(windowMid, windowMid + chunkSize);

		const [hz] = detector.findPitch(chunk, sampleRate);

		let bestIdx = 0;
		let bestDiff = Infinity;
		chordFrequencies.forEach((freq, idx) => {
			const diff = Math.abs(hz - freq);
			if (diff < bestDiff) {
				bestDiff = diff;
				bestIdx = idx;
			}
		});

		melody.push(chords[bestIdx]);
	}

	return melody;
}
