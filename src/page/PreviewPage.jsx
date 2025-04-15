import { useSearchParams } from "react-router-dom";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export default function PreviewPage() {
    const [searchParams] = useSearchParams();
    const fileUrl = searchParams.get("url");
    const fileName = searchParams.get("name") || "file";

    const getDocType = (fileName = "") => {
        const ext = fileName.split(".").pop().toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return "image";
        if (["pdf"].includes(ext)) return "pdf";
        if (["doc", "docx"].includes(ext)) return "docx";
        if (["xls", "xlsx", "csv"].includes(ext)) return "xlsx";
        if (["mp4", "webm"].includes(ext)) return "mp4";
        return "";
    };

    const isGoogleDocsSupported = (fileName) =>
        /\.(doc|docx|xls|xlsx|ppt|pptx)$/i.test(fileName);

    const getGoogleDocsViewerUrl = (url) =>
        `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;

    if (!fileUrl) return <div className="p-4 text-red-500">Không có file để xem.</div>;

    const type = getDocType(fileName);
    const decodedUrl = decodeURIComponent(fileUrl);

    return (
        <div className="h-screen w-screen p-4 bg-white overflow-hidden">
            {
                type === "mp4" ? (
                    <video controls className="w-full h-full object-contain" src={decodedUrl} />
                ) : type === "image" ? (
                    <img src={decodedUrl} alt="Preview" className="w-full h-full object-contain" />
                ) : isGoogleDocsSupported(fileName) ? (
                    <iframe
                        title="Google Docs Viewer"
                        src={getGoogleDocsViewerUrl(decodedUrl)}
                        className="w-full h-full border-none"
                    />
                ) : (
                    <DocViewer
                        documents={[{ uri: decodedUrl, fileType: type, fileName }]}
                        pluginRenderers={DocViewerRenderers}
                        style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}
                    />
                )
            }
        </div>
    );
}
