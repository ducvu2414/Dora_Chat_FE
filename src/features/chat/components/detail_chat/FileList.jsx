/* eslint-disable react/prop-types */
export default function FileList({ limit, files }) {
  console.log("files", files);

  function formatFileSize(bytes) {
    if (isNaN(bytes) || bytes < 0) return "0 KB";

    const KB_SIZE = 1024;
    const MB_SIZE = KB_SIZE * 1024;

    // Nếu nhỏ hơn 1MB thì hiển thị KB
    if (bytes < MB_SIZE) {
      return (bytes / KB_SIZE).toFixed(2) + " KB";
    }

    // Ngược lại hiển thị MB
    return (bytes / MB_SIZE).toFixed(2) + " MB";
  }

  const filesHandle = files?.map((item) => {
    return {
      name: item.fileName,
      size: formatFileSize(item.fileSize),
      link: item.content,
    };
  });

  const getFileIcon = (filename) => {
    const basename = filename.split(/[\\/]/).pop();

    const ext = basename.includes(".")
      ? basename.split(".").pop().toLowerCase()
      : "";

    switch (ext) {
      case "docx":
        return "../src/assets/chat/word.svg";
      case "doc":
        return "../src/assets/chat/word.svg";
      case "pptx":
        return "../src/assets/chat/powerpoint.svg";
      case "ppt":
        return "../src/assets/chat/powerpoint.svg";
      case "xlsx":
        return "../src/assets/chat/excel.svg";
      case "xls":
        return "../src/assets/chat/excel.svg";
      case "pdf":
        return "../src/assets/chat/pdf.svg";
      case "zip":
        return "../src/assets/chat/zip.svg";
      default:
        return "../src/assets/chat/default.png";
    }
  };

  const displayedFiles = limit ? filesHandle.slice(0, limit) : filesHandle;
  return (
    <ul className="px-4 mt-2">
      {displayedFiles.map((file, index) => (
        <li
          key={index}
          className="flex items-center gap-2 p-2 cursor-pointer hover:bg-[#F0F0F0] rounded-[10px]"
          onClick={() => {
            window.open(file.link, "_blank");
          }}
        >
          <img src={getFileIcon(file.link)} alt="icon" />
          <div>
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-[#086DC0] font-light text-start">
              {file.size}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
