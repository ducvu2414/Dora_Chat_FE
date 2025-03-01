import { useState } from "react";
import { SideBar } from "../../components/ui/side-bar";
import ChatBox from "./components/ChatBox";
import HeaderSignleChat from "./components/HeaderSignleChat";
import MessageInput from "./components/MessageInput";

const messagesDemo = [
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/b716/471e/a92dba5e34fe4ed85bd7c5f535acdaae?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LjxeFExG2mfQsIC1PhfgwD5sI1KwkgcdwdyUS5AyHkUVuwcJf1wR0ZiKF7RZrM0i8GSlA7aHsoF51XhpRQLxR4qVXSw6UnYprvVtc7RNpJffWnq1ukN~P7L77ZIPtjU6181DFElG8PGlTyFsLtC0TD24WIb-y7s7EIcnJrVTSDRyotmNCUq-j0qSMuU1rOM301xCYXHB3Ul70GKtqsgBKK8x79HKBZgu-laGa4Oy7rfMzDnlbjS2pO6EwNUu~wFvwhBiGnMSUcfFZeD4txGpwBhJCUDT8epFoEW82g1cYS81ClzjFuMme3-BsB9QFjlEHrquHOeBoH-A9zON9uXx4g__",
    name: "Iris Paul",
    message: "How are you?",
    time: "Now",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/77c6/8849/96c44a460b55a989d90970fc2b0d81ac?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iNBXCAYM3XkbLwPPyDFsTOF1VUQ0bDb9tl-CwAtztbj1ZjtN2hARIoDC2VTA~txeqLZZ7WjmCJ-3Ecc6WY1lMMz2762duRsHiNhuSpSAcgpx5YCi070aaug2lmT2xEEizj1zIJYJZrh~fs2fc8AjHjM~Dtg2d4AzCOtMakm02pw~6VIajB6AlFxd4M9l-esyKuKy65lQKwG0w~mgAvsScnIry7uMWeC923sSRbV4RMUY7mfHkG3kr6rcFeOq2jmEhL4dAwyHri0ALLzVRe3brQ5o7M3f2SVquTzqRZtwTSedEjUg55O5M-Ka7p68--Q~DsX6yKZWbk00uWVqFaWjxA__",
    name: "Jone Nguyen",
    message: "How are you?",
    time: "2 mins",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/b3c2/3d22/9e7189a7eb428bd40284e032a6a646cc?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qeF61cmLHi1NPEez5ZCWxrLsDss5xAGHt44FH3cPc7oQ7s86nIJayB064zDnzpKYCACqeOGGjVO5VjCOWtWm3fbpjw~hGaYG~ebUaTfu597TWCIiEvJ99gdk5F2Ig~zirHOUZFvCEAorIZhiX0JRJ-rOUnJqOOWX7fzzorNBpHis2wHEWU6zfdBdbeBQ0cQrH4OB6K02bMK4cHfCkM2t3foddVeShTHUv9U2Zt3~A1jSbkF4VzAs0QXoCnrUF4RP0WIYaetUZfLZyFWL9uOq-McF12Xj~Vj4Hrkpy6dxfeZnxwLwD52tN8dz7gIdRflVlN6P26cxdAD50byl2XUr2A__",
    name: "Aurora Bonita",
    message: "How are you?",
    time: "20 mins",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/4b44/1d65/e43e4a32db699d94c4bada7aa2ccff06?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LC4Lf-~lXiy7cXb7W7bD7gMkfkKG-MuT1w9BHPIT8MHna451KqaiuFaI4a23dJQ5CFyzf~P8yG7ti1rf02Gr9rEJ9J1SKuRUvRkrngZfD-YCPsydqKLarHXUglcV1-it82Q-Tn1-lKMOBTOnWIfBwUlsv44X8XdtuXLdkbUAG5wDOsmGyRde4i0CC6ZEw7TnIIPmM75HI9tE7GTRy4jjWwhf23ixSZF39XVOL-yoUSCzZyU--khY6RXRrznHqXD6lt3REZY8WXjrjzG01RmlftfhMhJQ3UkkWYanFEnX-S~d1tbMMpNc3A20DYYddm5ENQuaA-NMR~y~mFKd7Xak6g__",
    name: "Tom Athony",
    message: "How are you?",
    time: "4 hours",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/0dca/d322/bd3b28a9327f195eb0ce730500f0d0da?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=bQj558EhPLvR54rq0b2PL0gPgTXPT19sHatuctR86Gn3FfMyB3lzgRTgxMdL77chQqFQPJ3sx4cWwEXLU5aYsS7S8BZUhbdtL5oaxwYPaZ2CRJH7TVyWElUBQenup5CcNzIlLxgsg6MMnDsF0xWYt3kYGayvLEYTTLolGfsVTooWyxuCiuY-yqwIty5yV88U7cdCUrkYTSptvCP7H3Z-RpanK5nFfbepVkyVs~fZzICaYORaMItemepGNBfanrzYXn5Y6-XdcYyi-OVi17uFT559yksnRvi4dQ0gsFjNphLXbS0Jz4IsBEFqxhEdgnzOjkWtpc0nMaZr92ke9dju~Q__",
    name: "Liam Hemsworth",
    message: "How are you?",
    time: "6 hours",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/05a9/c731/be92cab5736e28f18b4b2ca1d65fd213?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Etqp8TCP2Bt6L7~3qfgv1ckwPVILUO88ZAO3IJkqAcqyZRRIi9YFFxxoNr-~SFaVN7vNI1XrKBB8iH0v-0S5mHoC2QngbIQzNPM-3UkMYGmU1ZYt9xGINd7tldlqJVniAYXv-0PlynrhWrSKgTJe~J~Wiwo-wy5YDp-V63iI7u00cOSeZTxGdZwx1SNN7a8MFK6OUL0v~OBB-e498DbrtsDXL8BOinhAToKDp71dRgj-eWIG4QCWeV~P3GRx2aYiCDtYvU3DtlCtPYL2ceY35KmSOQXJ77BWSMVYUplcu8OgNsWbOsaCWS95Ln8LuOq6FqC7X94exi8ZtupWhJmHVg__",
    name: "Daria Julli",
    message: "How are you?",
    time: "21 hours",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/4f96/6c32/0b9a00911f35a7ae254f6846bb1f4021?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RZT9n-2xU0OV8osbPbAYdd9QxuYH93wC6VE9dRymL0hPPUZ2RrulkhHwVDP9WDfRJ7I2sgUnBX5gtvWi1gXCuM~DJ-9iwXYx9E3IFuWp-zhH14Bm6--o6Vj3ebU9u1GmG0h0Q445KGb9rFAwuGD3N-VDabqhIYv0xy-hmyRzZxfaX9fTzNtctDMCis-~0QNLwxuVBFTUx9TjaCznyHzRvqhq1NHtvhE~H488WFMLDxbFJpy52EZn7fK7ZCS4x98dGgsHTYzwuqReluqWUwLKcPQl0RR-ShqPub-vYnjN-NxMmsVHzoAzPD1Pc4Eu1TYzBAWTzGgchaiYyFXO-FEWuA__",
    name: "Monica William",
    message: "How are you?",
    time: "Yesterday",
  },
];

const groups = [
  {
    avatar:
      "https://cdn.sanity.io/images/599r6htc/regionalized/5094051dac77593d0f0978bdcbabaf79e5bb855c-1080x1080.png?w=540&h=540&q=75&fit=max&auto=format",
    name: "Design Team",
    message: "New project discussion",
    time: "5 mins",
  },
  {
    avatar:
      "https://cdn.bap-software.net/2024/01/03211643/How-is-AI-applied-to-Java-programming-e1704266486769.jpg",
    name: "Development Team",
    message: "Sprint planning",
    time: "1 hour",
  },
  {
    avatar:
      "https://osd.vn/media/data/news/2022/06/seo-la-gi-seo-web-la-gi-ban-hieu-the-nao-ve-seo-2.jpg",
    name: "Marketing Team",
    message: "Campaign updates",
    time: "3 hours",
  },
];

const requests = [
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/0dca/d322/bd3b28a9327f195eb0ce730500f0d0da?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=A85Yi8I9~KWqyXmqyfuBGHshdKrK8tThkb0O2PFT9r3RfGbUHEKPrNooEK6K1kWm3XxH7wkD8ow8hQJhCOW6~-NlzRvt~mwwd69qJg9jePW~hkCxxmmqJhQEX4AmeuMsXxQra5FhE15ZX0dtlvCN8y687T9BjrijhDOIr-RHOrSNsIbJ017SzZabBsEV0tmCsUfJtNheeabH9IO6LPD1aiMV-TnG0Y0S9Sf-Uw5VuS8la3pQx--qHVu9kiJpkNvJVOJs2Zfhkdtw69uR2EH80RhL7KMohgNOuaaoxeRDGDuJaH4~oTzvt9pfY~HnQf8gO37oWR2kQZ2ZdxsWMr28YA__",
    name: "John Doe",
    message: "Hi, I'd like to connect!",
    time: "2 hours ago",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/77c6/8849/96c44a460b55a989d90970fc2b0d81ac?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Sn~-U8HNJIM02fCZz~FQOkPOoJ9pPydiMV77hD380IEC1YwjFA1QIs7pEWfhHe4EtgawfJuVayY-7HUjLtmvR4XWFrWqjD6CS3pp3dN1iSyM2rMwbDKvIvPDOaQAg11Tq8AvuHHQ42CYYDNfURwydgalpaMO4oIaAPNGXIFE6wu9Ha61CqbS7IqOWqGMhJqtb1ufbzL0H52TaBsuvh2OWuOUm~xNP23299fP0rarWbC5yU0T2-n6kBJNzEEZBbP3hFuHFNo2ZDJeQgwsSuXBj6bJAULIC-jftzehDWpSQ1Qz-p8SPEShQ3eMtMGDJx9rwtvjSah24tv1VvZCOOzRVA__",
    name: "Jane Smith",
    message: "Hello, can we chat?",
    time: "1 day ago",
  },
];
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
  return (
    <div className="flex w-full h-screen">
      <SideBar messages={messagesDemo} groups={groups} requests={requests} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col px-2 bg-gradient-to-b from-blue-50/50 to-white">
        <HeaderSignleChat />
        <ChatBox messages={messages} />
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}
