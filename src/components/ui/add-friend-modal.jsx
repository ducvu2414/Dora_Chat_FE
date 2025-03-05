import { useState } from "react";
import { Search, UserPlus, MessageCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export function AddFriendModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const resetModalState = () => {
    setPhoneNumber("");
    setSearchResult(null);
  };

  const handleSearch = () => {
    if (phoneNumber === "987654321" || phoneNumber === "0" + "987654321") {
      setSearchResult({
        name: "Trịnh Minh Kha",
        avatar:
          "https://s3-alpha-sig.figma.com/img/64dc/8ad0/c703131b418ed3db7ccb749b38302b92?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Fi~X1ie0Z0QdgkKeGP1Oy0LGU0CS7RYF0dtoZ8RTMM2qWgssK2ZEaDZ0ozsX7VeiwrJWJIFs7YrB8pSmWqtDTcvX7pPXNCUox~GGEBChFY6cgzz9eyUOwAq1WS3IOJxlbgSk55cTxnRKcoTwtrYO5l6ZGtLteMB1kuwVcbXZImjKZW5QwXbl1T7xuCMv7c3vepf4Vbou80TLFnrxDBOksA-b-tIcA~r0S9i2Q56KRNt39lTiNvLyptrHtptyWBk~UVsrUIG3oVXdTPvwK5~gNkKibs96lOdC63U-ptFwyAGafwmnvpu1EKaQDgAGD~ND-SaX9TynuPplGkA6MobOow__",
        bio: "Likes playing badminton 🏸 and drinking 🍺",
      });
    } else {
      setSearchResult(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetModalState();
        onClose();
      }}
      title="Add friend"
    >
      <div className="space-y-6">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute flex items-center gap-1 -translate-y-1/2 left-3 top-1/2">
              <img
                src="https://s3-alpha-sig.figma.com/img/8320/9ae2/006e5a6c0d3497a384172f8be7b98725?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=P99h6rtGE8HOSZn30dNs0DX6DUrY4ILOwbrlkwOGS8Dv-7zA1F3GyuT7as16ZTSUNfaEn1cEoYo64v4pgRemq4EANGBShva9CgaXAaBAI4MKGzSDiLJOhpPxHqg3ywDmQm9lnS2-vvyGntMBkcIvKD~y4QmjpUvIoVw6c-mirBP~sGkOY7kKB4Tj7-9N-JnxZop5OOhV6oL-yk1nSMi9ukMwTVeYx7caOmfFMT10zUvUmPfKy5lsj~UYTSC5Fo2nfY-UqRqNQzf5ydNG-mvi57WWbbbGdUXxOVM0g6oYZ4MRhCsieuoYvMBE0SKwkdMaaBVSRZ9QVaqVf1UDRaPUTw__"
                alt="Vietnam flag"
                className="object-cover w-6 h-4 rounded"
              />
              <span className="text-sm font-medium text-regal-blue">(+84)</span>
            </div>
            <Input
              type="text"
              placeholder="Phone number"
              className="pl-24"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 focus:outline-none"
            onClick={handleSearch}
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-center text-gray-500">
            {searchResult ? "Result" : "Recent"}
          </h3>

          {searchResult ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={searchResult.avatar || "/placeholder.svg"}
                  alt={searchResult.name}
                  className="object-cover w-12 h-12 rounded-full cursor-pointer"
                  onClick={() => navigate("/other-people-information")}
                />
                <div className="text-left">
                  <h4
                    className="text-sm font-medium cursor-pointer"
                    onClick={() => navigate("/other-people-information")}
                  >
                    {searchResult.name}
                  </h4>
                  <p className="text-sm text-gray-500">{searchResult.bio}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  className="bg-blue-600 rounded-full hover:bg-blue-700"
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  className="bg-blue-600 rounded-full hover:bg-blue-700"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-full">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M20 10C17.7909 10 16 11.7909 16 14C16 16.2091 17.7909 18 20 18C22.2091 18 24 16.2091 24 14C24 11.7909 22.2091 10 20 10Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M14 22C12.8954 22 12 22.8954 12 24V27C12 28.1046 12.8954 29 14 29H26C27.1046 29 28 28.1046 28 27V24C28 22.8954 27.1046 22 26 22H14Z"
                    fill="#E5E7EB"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500">No recent searches</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
