import classNames from "classnames";
import VideoTag from "./VideoTag";
import { FaHashtag, FaCircle } from "react-icons/fa";

export default function Meeting({
  handleMicBtn,
  handleCameraBtn,
  handelScreenBtn,
  handleLeaveBtn,
  localVideoStream,
  onlineUsers,
  remoteTracks,
  username,
  meetingInfo,
  micShared,
  cameraShared,
  screenShared,
}) {
  // Map tracks by participantSessionId
  const userStreamMap = remoteTracks.reduce((map, trackItem) => {
    const id = trackItem.participantSessionId;
    if (!map[id]) map[id] = [];
    map[id].push(trackItem);
    return map;
  }, {});

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">

      {/* Main Video Area */}
      <div className="flex-1 p-4 grid grid-cols-2 grid-rows-2 gap-4 overflow-y-auto">
        {/* Remote Participants */}
        {onlineUsers.map((user) => {
          if (user._id === meetingInfo.participantSessionId) return null;
          const tracks = userStreamMap[user._id] || [];
          return (
            <div key={user._id} className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-1 flex justify-center items-center bg-gray-700">
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <div className="h-40 bg-black flex items-center justify-center">
                {tracks.map((track) => {
                  const stream = new MediaStream();
                  stream.addTrack(track.track);
                  return (
                    <VideoTag
                      key={track.streamId}
                      srcObject={stream}
                      style={{ width: '100%', height: '100%' }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
        {/* Local Video */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-1 flex justify-center items-center bg-gray-700">
            <span className="text-sm font-medium">You ({username})</span>
          </div>
          <div className="h-40 bg-black flex items-center justify-center">
            {localVideoStream && (
              <VideoTag
                muted
                srcObject={localVideoStream}
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </div>
        </div>
      </div>



      {/* Control Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-gray-800 p-3 rounded-full">
        <button
          onClick={handleMicBtn}
          className={classNames(
            'p-2 rounded-full hover:bg-gray-700',
            micShared && 'bg-red-600'
          )}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>
        <button
          onClick={handleCameraBtn}
          className={classNames(
            'p-2 rounded-full hover:bg-gray-700',
            cameraShared && 'bg-red-600'
          )}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
        <button
          onClick={handelScreenBtn}
          className={classNames(
            'p-2 rounded-full hover:bg-gray-700',
            screenShared && 'bg-red-600'
          )}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </button>
        <button
          onClick={handleLeaveBtn}
          className="p-2 rounded-full hover:bg-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
