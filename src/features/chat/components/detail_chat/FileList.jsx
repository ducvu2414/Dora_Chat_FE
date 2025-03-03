export default function FileList() {
  const files = [
    { name: "file1.docx", size: "1MB" },
    { name: "file2.pdf", size: "2MB" },
    { name: "file3.zip", size: "3MB" },
    { name: "file4.zip", size: "3MB" },
  ];
  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "docx":
        return "../src/assets/chat/word.svg";
      case "pdf":
        return "../src/assets/chat/pdf.svg";
      case "zip":
        return "../src/assets/chat/zip.svg";
      default:
        return "../src/assets/chat/default.png";
    }
  };
  return (
    <ul className="px-4 mt-2">
      {files.slice(0, 3).map((file, index) => (
        <li
          key={index}
          className="flex items-center gap-2 p-2 cursor-pointer hover:bg-[#F0F0F0] rounded-[10px]"
        >
          <img src={getFileIcon(file.name)} alt="icon" />
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
