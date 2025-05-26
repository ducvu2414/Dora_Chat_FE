import classNames from "classnames";
import VideoTag from "./VideoTag";
import { FaHashtag, FaCircle } from "react-icons/fa";

export default function Meeting({
  handleMicBtn,
  handleCameraBtn,
  handelScreenBtn,
  handleLeaveBtn,
  micShared,
  cameraShared,
  screenShared,
}) {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-gray-800 p-3 rounded-full z-50">
      <button
        onClick={handleMicBtn}
        className={`p-2 rounded-full hover:bg-gray-700 ${micShared ? "bg-red-600" : ""
          }`}
      >
        Mic
      </button>
      <button
        onClick={handleCameraBtn}
        className={`p-2 rounded-full hover:bg-gray-700 ${cameraShared ? "bg-red-600" : ""
          }`}
      >
        Camera
      </button>
      <button
        onClick={handelScreenBtn}
        className={`p-2 rounded-full hover:bg-gray-700 ${screenShared ? "bg-red-600" : ""
          }`}
      >
        Screen
      </button>
      <button
        onClick={handleLeaveBtn}
        className="p-2 rounded-full hover:bg-gray-700"
      >
        Leave
      </button>
    </div>
  );
}
