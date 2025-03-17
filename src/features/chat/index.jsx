import { useState } from "react";
import ChatBox from "./components/ChatBox";
import DetailChat from "./components/DetailChat";
import HeaderSignleChat from "./components/HeaderSignleChat";
import MessageInput from "./components/MessageInput";

export default function ChatSingle() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", type: "TEXT", time: "10:25", sender: "other" },
    {
      id: 2,
      text: "Kính gửi các chiến hữu trong cộng đồng Pi 🥲 Hôm nay, tôi ngồi xuống viết những dòng này với một tấm lòng đầy ăn năn và hối lỗi. Ngày xưa, vì sự nông nổi và thiếu hiểu biết, tôi đã buông lời ch-ê bai, mỉ-a mai những con người kiên trung, vững chí như các bạn – những người vẫn ngày đêm kiên trì đào Pi với một niềm tin sắt đá vào tương lai tươi sáng. Và giờ đây, tôi nhận ra mình đã sai. Sai đến mức có thể mất đi cơ hội trở thành triệu phú Pi mà bấy lâu nay tôi không hay biết! Tôi từng cười khi thấy mọi người kiên trì nhấn nút mỗi ngày, nhưng giờ đây, khi nhìn lại, tôi mới hiểu đó là sự kiên trì hiếm có. Tôi từng hoài nghi về giá trị thực sự của Pi, nhưng nay tôi nhận ra rằng, trong thế giới này, niềm tin có thể tạo ra phép màu – dù là niềm tin vào một thứ chưa thể quy đổi thành tiền! Vậy nên, tôi xin được cúi đầu xin lỗi toàn thể cộng đồng Pi. Tôi mong rằng sự rộng lượng và bao dung của các bạn sẽ cho tôi một cơ hội để sửa sai. Nếu một ngày nào đó Pi chính thức lên sàn với giá hàng chục, hàng trăm đô, xin đừng quên tôi – kẻ đã từng lầm lỡ nhưng nay đã biết quay đầu. Và nếu điều đó không xảy ra, thì chí ít tôi cũng đã học được một bài học quý giá về niềm tin và sự đoàn kết của cộng đồn",
      type: "TEXT",
      time: "10:27",
      sender: "other",
    },
    {
      id: 3,
      text: "Hi! How are you?",
      type: "TEXT",
      time: "10:30",
      sender: "me",
    },
    {
      id: 4,
      text: "https://plus.unsplash.com/premium_photo-1661962309696-c429126b237e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      type: "IMAGE",
      time: "10:32",
      sender: "other",
    },
    {
      id: 5,
      text: "Hi! How are you? Kính gửi các chiến hữu trong cộng đồng P Hi! How are you? Kính gửi các chiến hữu trong cộng đồng PiHi! How are you? Kính gửi các chiến hữu trong cộng đồng PiHi! How are you? Kính gửi các chiến hữu trong cộng đồng PiHi! How are you? Kính gửi các chiến hữu trong cộng đồng Pii 🥲 Hôm nay, tôi ngồi xuống viết những Kính gửi các chiến hữu trong cộng đồng Pi 🥲 Hôm nay, tôi ngồi xuống viết những dòng này với một tấm lòng đầy ăn năn ",
      type: "TEXT",
      time: "10:35",
      sender: "me",
    },
    {
      id: 6,
      text: "https://example.com/image.word",
      type: "FILE",
      sender: "other",
      time: "10:02 ",
    },
    {
      id: 7,
      text: "https://example.com/document.pdf",
      type: "FILE",
      fileName: "document.pdf",
      sender: "me",
      time: "10:05 ",
    },
  ]);
  const handleSendMessage = (message) => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), text: message, sender: "me" }]);
  };
  const [showDetail, setShowDetail] = useState(false);
  return (
    <div className="flex w-full h-screen">
      {/* Main Content */}
      <div className="flex flex-1 overflow-auto ">
        {/* ChatBox  */}
        <div className="flex flex-col flex-1 bg-gradient-to-b from-blue-50/50 to-white">
          <HeaderSignleChat handleDetail={setShowDetail} />
          <ChatBox messages={messages} />
          <MessageInput onSend={handleSendMessage} />
        </div>

        {/* DetailChat*/}
        <div
          className={`bg-white shadow-xl transition-all duration-200 my-3 rounded-[20px]  ${
            showDetail ? "w-[385px]" : "w-0"
          }`}
        >
          {showDetail && <DetailChat />}
        </div>
      </div>
    </div>
  );
}
