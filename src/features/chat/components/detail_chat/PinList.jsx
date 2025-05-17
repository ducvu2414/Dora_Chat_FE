/* eslint-disable react/prop-types */

import ArrowRight from "@assets/chat/arrow_right.svg";
import { useState, useEffect } from "react";
import { Spinner } from "@/page/Spinner";
import PinItem from "./PinItem";
import pinMessageApi from "@/api/pinMessage";
import { AlertMessage } from "@/components/ui/alert-message";

export default function PinList({ onBack, pinMessages, onScrollToMessage }) {
  const [pinMessagesState, setPinMessages] = useState(pinMessages);

  useEffect(() => {
    setPinMessages(pinMessages);
  }, [pinMessages]);

  const handleRemovePinMessage = async (pinMessage) => {
    try {
      const responseRemovePinMessage = await pinMessageApi.deletePinMessage(
        pinMessage.messageId,
        pinMessage.pinnedBy._id
      );
      console.log(responseRemovePinMessage);
    } catch (error) {
      AlertMessage({
        type: "error",
        message:
          error.response?.data?.message || "You cannot remove this pin message",
      });
    }
    console.log(pinMessage);
  };

  return !pinMessages ? (
    <div className="flex justify-center my-8">
      <Spinner />
    </div>
  ) : (
    <div>
      <div className="flex items-center mb-4">
        <div
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 bg-white rounded-md cursor-pointer hover:opacity-75"
        >
          <img src={ArrowRight} className="rotate-180" />
        </div>
        <p className="text-lg font-bold text-[#086DC0] ml-2">
          Pin messages ({pinMessagesState.length})
        </p>
      </div>
      <div className="mt-4 overflow-auto h-[calc(100vh-7rem)]">
        <PinItem
          pinMessages={pinMessagesState}
          onRemove={handleRemovePinMessage}
          onScrollToMessage={onScrollToMessage}
        />
      </div>
    </div>
  );
}
