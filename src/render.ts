import toWav from "audiobuffer-to-wav";
import * as Tone from "tone";

const BPM = 200;

export async function renderToWav(notes: string[]): Promise<Blob> {
	const secondsPerNote = 60 / BPM;
	const duration = notes.length * secondsPerNote + 1;

	const toneBuffer = await Tone.Offline(() => {
		const synth = new Tone.Synth({
			oscillator: { type: "triangle" },
			envelope: { attack: 0.005, decay: 0.3, sustain: 0.2, release: 0.3 },
		}).toDestination();

		notes.forEach((note, i) => {
			synth.triggerAttackRelease(note, secondsPerNote, i * secondsPerNote);
		});
	}, duration);

	const audioBuffer = toneBuffer.get();
	if (!audioBuffer) throw new Error("レンダリングに失敗しました");

	return new Blob([toWav(audioBuffer)], { type: "audio/wav" });
}
