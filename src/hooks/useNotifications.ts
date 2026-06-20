"use client";

import { useEffect, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { api } from "@/api/axios";

export interface NotificationItem {
    _id: string;
    title: string;
    body: string;
    type: string;
    requestId?: string;
    metadata?: Record<string, unknown>;
    isRead: boolean;
    createdAt: string;
}

export function useNotifications(socket: Socket | null, currentUserId: string | null) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const refreshList = useCallback(async () => {
        if (!currentUserId) {
            setNotifications([]);
            return;
        }

        try {
            setIsLoading(true);
            const res = await api.get("/notifications", {
                params: { page: 1, limit: 20 },
            });
            setNotifications(res.data?.data ?? []);
        } catch {
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentUserId]);

    // Initial load
    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void refreshList();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [refreshList]);

 
    useEffect(() => {
        if (!socket || !currentUserId) return;

        const onNewNotification = (payload: NotificationItem) => {
            setNotifications((prev) => [payload, ...prev]);
        };

        socket.on("notification", onNewNotification);

        return () => {
            socket.off("notification", onNewNotification);
        };
    }, [socket, currentUserId]);

   
    const markAllAsRead = useCallback(async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        try {
            await api.patch("/notifications/read-all");
        } catch {
            
        }
    }, []);

    return { notifications, isLoading, unreadCount, refreshList, markAllAsRead };
}