import { User, LogOut, Users } from 'lucide-react';

// data: { onClose: () => void }

export function UserMenuDropdown(data) {
  return (
    <div className="absolute bottom-full left-0 mb-2 w-48 rounded-lg border bg-white shadow-lg z-50">
      <div className="p-1">
        <button
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-regal-blue bg-gray-100 rounded-md focus:outline-none"
          onClick={() => {
            console.log('My Profile clicked');
            data.onClose();
          }}
        >
          <User className="w-4 h-4" />
          My Profile
        </button>
        <button
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-regal-blue bg-gray-100 rounded-md focus:outline-none"
          onClick={() => {
            console.log('Contacts clicked');
            data.onClose();
          }}
        >
          <Users className="w-4 h-4" />
          Contacts
        </button>
        <button
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-regal-blue bg-gray-100 rounded-md focus:outline-none"
          onClick={() => {
            console.log('Log out clicked');
            data.onClose();
          }}
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  );
}
