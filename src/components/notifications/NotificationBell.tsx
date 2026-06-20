// 'use client';

// import { Bell } from 'lucide-react';
// import { useNotifications } from '@/hooks/useNotifications';

// interface NotificationBellProps {
//   /** The logged-in user's id (technician or client). Pass null while auth is loading. */
//   userId: string | null | undefined;
//   /** Called when the bell is clicked — open your existing dropdown/panel here. */
//   onClick?: () => void;
// }

// /**
//  * Just the bell icon + unread badge. Connects to the notification socket
//  * and REST endpoint internally so the badge count stays live, but renders
//  * no dropdown/panel — wire onClick to your own existing notification UI.
//  */
// export function NotificationBell({ userId, onClick }: NotificationBellProps) {
//   const { unreadCount } = useNotifications({ userId });

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       aria-label="الإشعارات"
//       className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
//     >
//       <Bell className="h-5 w-5" strokeWidth={2} />

//       {unreadCount > 0 && (
//         <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
//           {unreadCount > 99 ? '99+' : unreadCount}
//         </span>
//       )}
//     </button>
//   );
// }