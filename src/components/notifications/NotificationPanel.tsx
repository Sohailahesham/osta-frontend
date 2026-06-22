"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { NotificationItem } from "@/hooks/useNotifications";

function formatRelativeTime(isoDate: string): string {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    if (diffMin < 1) return "الآن";
    if (diffMin < 60) return `منذ ${diffMin} ${diffMin === 1 ? "دقيقة" : "دقائق"}`;
    if (diffHour < 24) return `منذ ${diffHour} ${diffHour === 1 ? "ساعة" : "ساعات"}`;
    return `منذ ${diffDay} ${diffDay === 1 ? "يوم" : "أيام"}`;
}

// Default fallback if no targetRoute prop is passed.
function getNotificationRoute(
    _notification: NotificationItem,
    targetRoute: string,
): string {
    return targetRoute;
}

interface NotificationPanelProps {
    notifications: NotificationItem[];
    isLoading: boolean;
    onClose: () => void;
    /** Where clicking any notification navigates to (e.g. "/client/orders" or "/technician/orders") */
    targetRoute: string;
}

export default function NotificationPanel({
    notifications,
    isLoading,
    onClose,
    targetRoute,
}: NotificationPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const prevCountRef = useRef(notifications.filter((n) => !n.isRead).length);

    useEffect(() => {
    const currentUnread = notifications.filter((n) => !n.isRead).length;

    // بيعزف الصوت بس لو العدد زاد (نوتفكيشن جديدة وصلت)
    if (currentUnread > prevCountRef.current) {
        const audio = new Audio("/sounds/notification.wav");
        audio.volume = 0.5;
        void audio.play().catch(() => {
        // المتصفح ممكن يبلوك الـ autoplay — مفيش error يطلع
        });
    }

    prevCountRef.current = currentUnread;
    }, [notifications]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handleNotificationClick = (notification: NotificationItem) => {
        onClose();
        router.push(getNotificationRoute(notification, targetRoute));
    };

    return (
        <div
            ref={panelRef}
            dir="rtl"
            className="absolute left-0 top-12 z-50 flex max-h-[28rem] w-80 flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-black/10 ring-1 ring-black/5"
        >
            {/* Header */}
            <div className="border-b border-gray-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-[#112D27]">الإشعارات</h3>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-10 text-sm text-gray-400">
                        جارٍ التحميل...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex items-center justify-center py-10 text-sm text-gray-400">
                        لا توجد إشعارات حتى الآن
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {notifications.map((n) => (
                            <button
                                key={n._id}
                                type="button"
                                onClick={() => handleNotificationClick(n)}
                                // "Shadow" = unread highlight. It is driven purely by
                                // n.isRead, which the parent flips to true (for every
                                // notification) the moment the panel opens — so the
                                // highlight naturally fades on next open/render, exactly
                                // like a real app's notification tray.
                                className={`flex w-full flex-col items-start gap-1 px-4 py-3 text-right transition-colors duration-300 hover:bg-[#F6F5F1] ${
                                    n.isRead
                                        ? "bg-white"
                                        : "bg-[#F6F5F1] shadow-[inset_3px_0_0_var(--primary-color)]"
                                }`}
                            >
                                <span className="flex w-full items-center gap-2">
                                    {!n.isRead && (
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary-color)]" />
                                    )}
                                    <span
                                        className={`text-sm leading-snug ${
                                            n.isRead
                                                ? "font-medium text-[#112D27]/80"
                                                : "font-semibold text-[#112D27]"
                                        }`}
                                    >
                                        {n.title}
                                    </span>
                                </span>
                                <span className="line-clamp-2 text-xs leading-snug text-gray-500 break-words">
                                    {n.body}
                                </span>
                                <span className="text-[11px] text-gray-400">
                                    {formatRelativeTime(n.createdAt)}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}