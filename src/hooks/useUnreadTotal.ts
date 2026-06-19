"use client";

import {useEffect, useState, useCallback} from "react";
import {Socket} from "socket.io-client";

/**
 * بيتتبع إجمالي الرسايل الغير مقروءة من كل الـ rooms.
 * بيزيد لما تيجي رسالة جديدة مش منك،
 * وبيصفر لما تفتحي الصفحة أو تعملي markAsRead.
 */
export function useUnreadTotal(socket: Socket | null, currentUserId: string | null) {
    const [total, setTotal] = useState(0);

    const increment = useCallback(() => {
        setTotal((prev) => prev + 1);
    }, []);

    const reset = useCallback(() => {
        setTotal(0);
    }, []);

    useEffect(() => {
        if (!socket || !currentUserId) return;

        const onNewMessage = (payload: {senderId: string}) => {
            if (payload.senderId !== currentUserId) {
                increment();
            }
        };

        const onNewCustomMessage = (payload: {senderId: string}) => {
            if (payload.senderId !== currentUserId) {
                increment();
            }
        };

        const onMessagesRead = () => {
            // لما الطرف التاني يقرأ مش بنغير الـ total
        };

        socket.on("newMessage", onNewMessage);
        socket.on("newCustomMessage", onNewCustomMessage);

        return () => {
            socket.off("newMessage", onNewMessage);
            socket.off("newCustomMessage", onNewCustomMessage);
        };
    }, [socket, currentUserId, increment]);

    return {total, reset};
}
