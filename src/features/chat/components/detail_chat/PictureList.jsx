/* eslint-disable react/prop-types */
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function PictureList({ limit, imagesVideos }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  const imagesVideosTemp = imagesVideos
    ?.filter((item) => item.type === "VIDEO" || "IMAGE")
    ?.map((item) => {
      return {
        url: item.content,
        type: item.type,
      };
    });

  const displayedImagesVideos = limit
    ? imagesVideosTemp.slice(0, limit)
    : imagesVideosTemp;

  return (
    <>
      {previewImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[1000]">
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
      {previewVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative">
            <div
              onClick={() => setPreviewVideo(null)}
              className="absolute flex items-center justify-center w-8 h-8 transition-colors rounded-full cursor-pointer top-2 right-2 bg-black/50 hover:bg-black/70 z-[1]"
            >
              <AiOutlineClose className="text-lg text-white pointer-events-none" />
            </div>
            <video
              src={previewVideo}
              controls
              className="max-w-[90vw] max-h-[80vh] object-contain"
            ></video>
          </div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 px-4 mt-2">
        {displayedImagesVideos.map((imageVideo, index) =>
          imageVideo.type === "IMAGE" ? (
            <img
              key={index}
              src={imageVideo.url}
              alt={`img-${index}`}
              className="w-[100px] h-[80px] object-cover rounded-md cursor-pointer hover:opacity-75"
              onClick={() => setPreviewImage(imageVideo.url)}
            />
          ) : (
            <video
              key={index}
              src={imageVideo.url}
              className="w-[100px] h-[80px] object-cover rounded-md cursor-pointer hover:opacity-75"
              onClick={() => setPreviewVideo(imageVideo.url)}
            ></video>
          )
        )}
      </div>
    </>
  );
}
