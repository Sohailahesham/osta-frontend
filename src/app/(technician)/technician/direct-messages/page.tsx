"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getAssignedRequests } from "@/api/services/request.service";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { mapRequestsToRooms } from "@/lib/mapRequestsToRooms";
import { Room } from "@/types/chat.types";
import Navbar from "@/components/layout/technician/Navbar";
import DirectMessagesLayout from "@/components/sections/client/direct-messages/DirectMessagesLayout";
import RoomList from "@/components/sections/client/direct-messages/RoomList";
import ChatWindow from "@/components/sections/client/direct-messages/ChatWindow";

export default function TechnicianDirectMessagesPage() {
  const { userId, token } = useAuth();
  const { socket } = useSocket(token);
  // requestId من الـ URL — لما ييجي من زرار "محادثة" في كارت الطلب
  const searchParams = useSearchParams();
  const requestIdFromUrl = searchParams.get("requestId");

  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  useEffect(() => {
    getAssignedRequests()
      .then(async ({ data }) => {
        const mapped = await mapRequestsToRooms(data, "technician");
        setRooms(mapped);

        // لو جاي من زرار "محادثة" بـ requestId محدد → افتح الشات ده على طول.
        // لو لا → سيبي الشات فاضي (مفيش فتح تلقائي لأول محادثة).
        if (requestIdFromUrl) {
          const target = mapped.find((r) => r.requestId === requestIdFromUrl);
          setActiveRoom(target ?? null);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingRooms(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestIdFromUrl]);

  return (
    <DirectMessagesLayout
      navbar={<Navbar />}
      chatWindow={
        !userId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-[#7CB342] border-t-transparent animate-spin" />
          </div>
        ) : (
          <ChatWindow
            socket={socket}
            room={activeRoom}
            currentUserId={userId}
          />
        )
      }
      roomList={
        isLoadingRooms ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#7CB342] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <RoomList
            rooms={rooms}
            activeRoomId={activeRoom?.id ?? null}
            onSelect={setActiveRoom}
          />
        )
      }
    />
  );
}