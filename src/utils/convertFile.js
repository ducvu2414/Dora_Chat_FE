// convertFile.js - Sử dụng API mới của @ffmpeg/ffmpeg
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpeg = null;

const initFFmpeg = async () => {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();

    // Load FFmpeg với core và wasm từ CDN
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
  }
  return ffmpeg;
};

const convertWebmToMp3 = async (file) => {
  try {
    const ffmpegInstance = await initFFmpeg();

    // Ghi file input
    await ffmpegInstance.writeFile("input.webm", await fetchFile(file));

    // Chạy lệnh convert
    await ffmpegInstance.exec([
      "-i",
      "input.webm",
      "-b:a",
      "192k",
      "output.mp3",
    ]);

    // Đọc file output
    const data = await ffmpegInstance.readFile("output.mp3");

    // Tạo blob và file
    const blob = new Blob([data.buffer], { type: "audio/mp3" });
    return new File([blob], "recording.mp3", { type: "audio/mp3" });
  } catch (error) {
    console.error("Lỗi khi convert file:", error);
    throw error;
  }
};

export default convertWebmToMp3;
