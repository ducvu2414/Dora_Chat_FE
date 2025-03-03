import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function PictureList() {
  const [previewImage, setPreviewImage] = useState(null);

  const images = [
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
  ];
  return (
    <>
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute text-sm text-white top-2 right-2"
            >
              <AiOutlineClose />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 px-4 mt-2">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`img-${index}`}
            className="w-[100px] h-[80px] object-cover rounded-md cursor-pointer hover:opacity-75"
            onClick={() => setPreviewImage(src)}
          />
        ))}
      </div>
    </>
  );
}
