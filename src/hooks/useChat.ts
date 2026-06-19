"use client";

import {useEffect, useRef, useState, useCallback} from "react";
import {Socket} from "socket.io-client";
import {
    Message,
    Room,
    NewMessagePayload,
    MessagesReadPayload,
    RoomClosedPayload,
    CustomRoomClosedPayload,
    JoinedRoomPayload,
} from "@/types/chat.types";
import {chatService} from "@/api/services/chat.service";

interface UseChatOptions {
    socket: Socket | null;
    room: Room | null;
    /** userId من الـ token عشان نحدد mine/theirs */
    currentUserId: string;
}

export function useChat({socket, room, currentUserId}: UseChatOptions) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const joinedRoomRef = useRef<string | null>(null);

    // ── جلب الـ history من REST ───────────────────────────────────────────────
    const fetchHistory = useCallback(async (r: Room) => {
        setIsLoadingHistory(true);
        try {
            let msgs: Message[];
            if (r.variant === "fixed" && r.requestId) {
                msgs = await chatService.getRequestMessages(r.requestId);
            } else if (r.variant === "custom" && r.postId && r.technicianId) {
                msgs = await chatService.getCustomMessages(r.postId, r.technicianId);
            } else {
                msgs = [];
            }
            setMessages(msgs);
        } catch {
            setMessages([]);
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    // ── Join Room عبر socket ──────────────────────────────────────────────────
    const joinRoom = useCallback(
        (r: Room) => {
            if (!socket) return;

            if (r.variant === "fixed" && r.requestId) {
                socket.emit("joinRoom", {requestId: r.requestId});
            } else if (r.variant === "custom" && r.postId) {
                socket.emit("joinCustomRoom", {
                    postId: r.postId,
                    ...(r.technicianId ? {technicianId: r.technicianId} : {}),
                });
            }
        },
        [socket]
    );

    // ── إرسال رسالة ──────────────────────────────────────────────────────────
    const sendMessage = useCallback(
        (content: string) => {
            if (!socket || !room || !content.trim()) return;

            if (room.variant === "fixed" && room.requestId) {
                socket.emit("sendMessage", {requestId: room.requestId, content});
            } else if (room.variant === "custom" && room.postId) {
                socket.emit("sendCustomMessage", {
                    postId: room.postId,
                    ...(room.technicianId ? {technicianId: room.technicianId} : {}),
                    content,
                });
            }
        },
        [socket, room]
    );

    // ── Mark as Read ──────────────────────────────────────────────────────────
    const markAsRead = useCallback(() => {
        if (!socket || !room) return;

        if (room.variant === "fixed" && room.requestId) {
            socket.emit("markAsRead", {requestId: room.requestId});
        } else if (room.variant === "custom" && room.postId) {
            socket.emit("markCustomAsRead", {
                postId: room.postId,
                ...(room.technicianId ? {technicianId: room.technicianId} : {}),
            });
        }
    }, [socket, room]);

    // ── Effect: لما الـ room يتغير ─────────────────────────────────────────────
    useEffect(() => {
        if (!room) return;

        const roomKey = room.id;
        if (joinedRoomRef.current === roomKey) return;
        joinedRoomRef.current = roomKey;

        setMessages([]);
        setIsClosed(false);
        setUnreadCount(0);

        fetchHistory(room);
        joinRoom(room);
    }, [room, fetchHistory, joinRoom]);

    // ── Effect: socket event listeners ───────────────────────────────────────
    useEffect(() => {
        if (!socket || !room) return;

        const onJoinedRoom = ({unreadCount}: JoinedRoomPayload) => {
            setUnreadCount(unreadCount);
        };

        const onNewMessage = (payload: NewMessagePayload) => {
            const msg: Message = {
                _id: payload._id,
                roomId: payload.roomId,
                roomType: payload.roomType,
                senderId: payload.senderId,
                senderRole: payload.senderRole,
                content: payload.content,
                isRead: payload.isRead,
                createdAt: payload.createdAt,
            };
            setMessages((prev) => [...prev, msg]);

            // لو الرسالة مش منك → mark as read أوتوماتيك
            if (payload.senderId !== currentUserId) {
                markAsRead();
            }
        };

        const onMessagesRead = ({readBy}: MessagesReadPayload) => {
            if (readBy !== currentUserId) {
                setMessages((prev) =>
                    prev.map((m) =>
                        typeof m.senderId === "string"
                            ? m.senderId === currentUserId
                                ? {...m, isRead: true}
                                : m
                            : m.senderId._id === currentUserId
                            ? {...m, isRead: true}
                            : m
                    )
                );
            }
        };

        const onRoomClosed = () => setIsClosed(true);
        const onCustomRoomClosed = () => setIsClosed(true);

        socket.on("joinedRoom", onJoinedRoom);
        socket.on("joinedCustomRoom", onJoinedRoom);
        socket.on("newMessage", onNewMessage);
        socket.on("newCustomMessage", onNewMessage);
        socket.on("messagesRead", onMessagesRead);
        socket.on("roomClosed", onRoomClosed);
        socket.on("customRoomClosed", onCustomRoomClosed);

        return () => {
            socket.off("joinedRoom", onJoinedRoom);
            socket.off("joinedCustomRoom", onJoinedRoom);
            socket.off("newMessage", onNewMessage);
            socket.off("newCustomMessage", onNewMessage);
            socket.off("messagesRead", onMessagesRead);
            socket.off("roomClosed", onRoomClosed);
            socket.off("customRoomClosed", onCustomRoomClosed);
        };
    }, [socket, room, currentUserId, markAsRead]);

    return {
        messages,
        isLoadingHistory,
        isClosed,
        unreadCount,
        sendMessage,
        markAsRead,
    };
}
