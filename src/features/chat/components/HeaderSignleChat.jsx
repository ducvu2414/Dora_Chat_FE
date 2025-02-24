export default function HeaderSignleChat() {
  return (
    <div>
      <div className="flex flex-row  items-center px-4 py-5 border-b">
        <img
          src="../src/assets/chat/avatar.png"
          className="w-[70px] h-[70px] object-cover rounded-full"
        />
        <div className="ml-3">
          <h2 className="font-semibold text-[22px] text-[#086DC0]">John Doe</h2>
          <p>Active</p>
        </div>
        <div className=" ml-auto flex flex-row space-x-4">
          <div className="cursor-pointer">
            <img src="../src/assets/chat/call.svg" />
          </div>
          <div className="cursor-pointer">
            <img src="../src/assets/chat/video_call.svg" />
          </div>
          <div className="cursor-pointer">
            <img src="../src/assets/chat/detail_chat.svg" />
          </div>
        </div>
      </div>
    </div>
  );
}
