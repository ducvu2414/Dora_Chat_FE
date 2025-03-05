/* eslint-disable react/prop-types */
import Avatar from "@assets/chat/avatar.png";

export default function InfoContent({
  backgroundImage,
  avatar,
  dob,
  phone,
  location,
}) {
  return (
    <div className="w-full text-center">
      <div className="w-full h-40 overflow-hidden bg-center bg-cover ">
        <img
          src={
            backgroundImage ||
            "https://plus.unsplash.com/premium_photo-1661962309696-c429126b237e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt="Background"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex flex-col items-center -mt-14">
        <img
          src={avatar || Avatar}
          alt="Avatar"
          className="w-24 h-24 border-4 border-white rounded-full shadow-lg"
        />
        <div className="flex items-center gap-5 mt-4">
          <button className="px-4 py-2 text-sm font-medium text-[#086DC0] bg-[#F0F8FF] border border-gray-300 rounded-lg hover:bg-[#E0F0FF] hover:border-[#086DC0]  ">
            Kết bạn
          </button>
          <button className="px-4 py-2 text-sm font-medium text-[#086DC0] bg-[#F0F8FF] border border-gray-300 rounded-lg hover:bg-[#E0F0FF] hover:border-[#086DC0]  ">
            Nhắn tin
          </button>
        </div>
      </div>
      <div className="mt-4">
        <button className="w-full px-4 rounded-none py-2 text-sm font-medium text-[#086DC0] bg-[#F0F8FF] border hover:bg-[#E0F0FF] border-none ">
          Xem trang cá nhân
        </button>
      </div>
      <div className="mt-4 bg-[#F0F8FF] p-2">
        <h3 className="font-medium text-left">Thông tin cá nhân</h3>
        <div className="mt-2 space-y-2 text-sm text-left text-gray-600">
          <p>
            <strong className="inline-block w-1/4">Tên:</strong>{" "}
            {dob || "User Name"}
          </p>
          <p>
            <strong className="inline-block w-1/4">Ngày sinh:</strong>{" "}
            {dob || "12/12/2003"}
          </p>
          <p>
            <strong className="inline-block w-1/4">Số điện thoại:</strong>{" "}
            {phone || "0123 456 789"}
          </p>
          <p>
            <strong className="inline-block w-1/4">Email:</strong>{" "}
            {phone || "kha@gmai.com"}
          </p>
          <p>
            <strong className="inline-block w-1/4">Sống tại:</strong>{" "}
            {location || "Hồ Chí Minh"}
          </p>
        </div>
      </div>
    </div>
  );
}
