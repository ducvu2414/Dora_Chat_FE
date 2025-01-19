import { useState } from 'react'
import { Modal } from './modal'
import { Input } from './input'
import { Button } from './button'
import { Check } from 'lucide-react'

const friendsList = [
  { id: 1, name: 'Iris Paul', avatar: 'https://s3-alpha-sig.figma.com/img/b716/471e/a92dba5e34fe4ed85bd7c5f535acdaae?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LjxeFExG2mfQsIC1PhfgwD5sI1KwkgcdwdyUS5AyHkUVuwcJf1wR0ZiKF7RZrM0i8GSlA7aHsoF51XhpRQLxR4qVXSw6UnYprvVtc7RNpJffWnq1ukN~P7L77ZIPtjU6181DFElG8PGlTyFsLtC0TD24WIb-y7s7EIcnJrVTSDRyotmNCUq-j0qSMuU1rOM301xCYXHB3Ul70GKtqsgBKK8x79HKBZgu-laGa4Oy7rfMzDnlbjS2pO6EwNUu~wFvwhBiGnMSUcfFZeD4txGpwBhJCUDT8epFoEW82g1cYS81ClzjFuMme3-BsB9QFjlEHrquHOeBoH-A9zON9uXx4g__' },
  { id: 2, name: 'Jone Nguyen', avatar: 'https://s3-alpha-sig.figma.com/img/77c6/8849/96c44a460b55a989d90970fc2b0d81ac?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iNBXCAYM3XkbLwPPyDFsTOF1VUQ0bDb9tl-CwAtztbj1ZjtN2hARIoDC2VTA~txeqLZZ7WjmCJ-3Ecc6WY1lMMz2762duRsHiNhuSpSAcgpx5YCi070aaug2lmT2xEEizj1zIJYJZrh~fs2fc8AjHjM~Dtg2d4AzCOtMakm02pw~6VIajB6AlFxd4M9l-esyKuKy65lQKwG0w~mgAvsScnIry7uMWeC923sSRbV4RMUY7mfHkG3kr6rcFeOq2jmEhL4dAwyHri0ALLzVRe3brQ5o7M3f2SVquTzqRZtwTSedEjUg55O5M-Ka7p68--Q~DsX6yKZWbk00uWVqFaWjxA__' },
  { id: 3, name: 'Aurora Bonita', avatar: 'https://s3-alpha-sig.figma.com/img/b3c2/3d22/9e7189a7eb428bd40284e032a6a646cc?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qeF61cmLHi1NPEez5ZCWxrLsDss5xAGHt44FH3cPc7oQ7s86nIJayB064zDnzpKYCACqeOGGjVO5VjCOWtWm3fbpjw~hGaYG~ebUaTfu597TWCIiEvJ99gdk5F2Ig~zirHOUZFvCEAorIZhiX0JRJ-rOUnJqOOWX7fzzorNBpHis2wHEWU6zfdBdbeBQ0cQrH4OB6K02bMK4cHfCkM2t3foddVeShTHUv9U2Zt3~A1jSbkF4VzAs0QXoCnrUF4RP0WIYaetUZfLZyFWL9uOq-McF12Xj~Vj4Hrkpy6dxfeZnxwLwD52tN8dz7gIdRflVlN6P26cxdAD50byl2XUr2A__' },
]

// eslint-disable-next-line react/prop-types
export function AddGroupModal({ isOpen, onClose }) {
  const [groupName, setGroupName] = useState('')
  const [selectedFriends, setSelectedFriends] = useState([])

  const handleFriendToggle = (friendId) => {
    setSelectedFriends(prev => 
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    )
  }

  const handleCreateGroup = () => {
    // Here you would typically send this data to your backend
    console.log('Creating group:', { name: groupName, members: selectedFriends })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create chat group">
      <div className="space-y-6">
        {/* Group Name Input */}
        <div>
          <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 mb-1 text-left !font-bold">
            Group Name:
          </label>
          <Input
            id="group-name"
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>

        {/* Friends List */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2 text-left !font-bold">Add friends to group:</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {friendsList.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => handleFriendToggle(friend.id)}
              >
                <div className="flex items-center flex-1">
                  <img
                    src={friend.avatar || "/placeholder.svg"}
                    alt={friend.name}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <span className="text-sm font-medium">{friend.name}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedFriends.includes(friend.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                }`}>
                  {selectedFriends.includes(friend.id) && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Group Button */}
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleCreateGroup}
          disabled={!groupName || selectedFriends.length === 0}
        >
          Create Group
        </Button>
      </div>
    </Modal>
  )
}

