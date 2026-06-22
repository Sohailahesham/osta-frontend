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

// ── NOTIFICATION SOUND ────────────────────────────────────────────────────────

function playNotificationBeep() {
  try {
    const ctx = new AudioContext();

    const playTone = (
      frequency: number,
      startTime: number,
      duration: number,
    ) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, startTime);

      // Fade in then out smoothly so it doesn't click
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(880, now, 0.15);
    playTone(1100, now + 0.15, 0.2);

    setTimeout(() => ctx.close(), 600);
  } catch {}
}

export function useNotifications(
  socket: Socket | null,
  currentUserId: string | null,
) {
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
      playNotificationBeep();
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
    } catch {}
  }, []);

  return { notifications, isLoading, unreadCount, refreshList, markAllAsRead };
}
