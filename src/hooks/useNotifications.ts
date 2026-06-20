
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppNotification } from '@/types/notification';
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/lib/notification-api';
import { connectNotificationSocket } from '@/lib/notification-socket';

interface UseNotificationsOptions {
  userId: string | null | undefined;
}

export function useNotifications({ userId }: UseNotificationsOptions) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  // ── Initial load over REST ─────────────────────────────────────────────
  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const [listRes, count] = await Promise.all([
        fetchNotifications(1, 20),
        fetchUnreadCount(),
      ]);
      setNotifications(listRes.data);
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
      hasLoadedOnce.current = true;
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    loadNotifications();
  }, [userId, loadNotifications]);

  // ── Live WebSocket updates ──────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;

    const socket = connectNotificationSocket(userId);

    const handleIncoming = (payload: AppNotification) => {
      setNotifications((prev) => [payload, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on('notification', handleIncoming);

    return () => {
      socket.off('notification', handleIncoming);
    };
  }, [userId]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const markAsRead = useCallback(async (id: string) => {
    // optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading: isLoading && !hasLoadedOnce.current,
    markAsRead,
    markAllAsRead,
    refresh: loadNotifications,
  };
}