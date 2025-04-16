/* eslint-disable react/prop-types */
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function PictureList({ limit }) {
  const [previewImage, setPreviewImage] = useState(null);

  const images = [
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
    "../src/assets/tiger_demo.png",
  ];
  const displayedImages = limit ? images.slice(0, limit) : images;
  return (
    <>
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative">
            <div
              onClick={() => setPreviewImage(null)}
              className="absolute flex items-center justify-center w-8 h-8 transition-colors rounded-full cursor-pointer top-2 right-2 bg-black/50 hover:bg-black/70"
            >
              <AiOutlineClose className="text-lg text-white" />
            </div>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 px-4 mt-2">
        {displayedImages.map((src, index) => (
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
