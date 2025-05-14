/* eslint-disable react/prop-types */
import { ContactCard } from "@/components/ui/Contact/ContactCard";

export function ContactList({ contacts, onDeleteFriend }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5">
      {contacts !== undefined && contacts.length > 0 ? (
        contacts.map((contact, index) => (
          <div key={index}>
            <ContactCard contact={contact} onDeleteFriend={onDeleteFriend} />
          </div>
        ))
      ) : (
        <div className="col-span-2 flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Không có bạn bè
          </h3>
          <p className="text-gray-500 text-center">
            Bạn chưa có bạn bè nào. Hãy gửi lời mời kết bạn để bắt đầu kết nối.
          </p>
        </div>
      )}
    </div>
  );
}
