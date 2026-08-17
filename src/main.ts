import { analyzeAudio } from "./analyze.ts";
import { decode } from "./decode.ts";
import { encode } from "./encode.ts";
import { renderToWav } from "./render.ts";

function textToBits(text: string): string {
	const bytes = new TextEncoder().encode(text);
	return Array.from(bytes)
		.map((byte) => byte.toString(2).padStart(8, "0"))
		.join("");
}

function padBits(bits: string, bitsPerSymbol: number): string {
	const remainder = bits.length % bitsPerSymbol;
	if (remainder === 0) return bits;
	return bits + "0".repeat(bitsPerSymbol - remainder);
}

function parseChords(value: string): string[] {
	return value
		.split(",")
		.map((c) => c.trim())
		.filter((c) => c.length > 0);
}

function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

function mount(): void {
	const encodeForm = document.getElementById("encode-form") as HTMLFormElement;
	const chordsInput = document.getElementById("chords") as HTMLInputElement;
	const messageInput = document.getElementById("message") as HTMLInputElement;
	const encodeStatus = document.getElementById("encode-status") as HTMLElement;

	const decodeForm = document.getElementById("decode-form") as HTMLFormElement;
	const decodeChordsInput = document.getElementById(
		"decode-chords",
	) as HTMLInputElement;
	const audioFileInput = document.getElementById(
		"audio-file",
	) as HTMLInputElement;
	const decodeOutput = document.getElementById("decode-output") as HTMLElement;

	encodeForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		encodeStatus.textContent = "生成中...";

		const chords = parseChords(chordsInput.value);
		const message = messageInput.value;

		let bits = textToBits(message);
		const bitsPerSymbol = Math.log2(chords.length);
		bits = padBits(bits, bitsPerSymbol);

		let melody: string[];
		try {
			melody = encode(chords, bits);
		} catch (err) {
			encodeStatus.textContent =
				err instanceof Error ? err.message : String(err);
			return;
		}

		try {
			const wav = await renderToWav(melody);
			downloadBlob(wav, "encoded.wav");
			encodeStatus.textContent = `完了 (${melody.length} ノート)`;
		} catch (err) {
			encodeStatus.textContent =
				err instanceof Error ? err.message : String(err);
		}
	});

	decodeForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		decodeOutput.textContent = "解析中...";

		const chords = parseChords(decodeChordsInput.value);
		const file = audioFileInput.files?.[0];

		if (!file) {
			decodeOutput.textContent = "音声ファイルを選択してください";
			return;
		}

		try {
			const melody = await analyzeAudio(file, chords);
			const text = decode(chords, melody);
			decodeOutput.textContent = text;
		} catch (err) {
			decodeOutput.textContent =
				err instanceof Error ? err.message : String(err);
		}
	});
}

mount();
