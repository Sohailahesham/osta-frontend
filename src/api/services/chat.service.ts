import {api} from "@/api/axios";
import {Message} from "@/types/chat.types";

interface MessagesResponse {
    message: string;
    data: Message[];
}

interface UnreadCountResponse {
    message: string;
    data: {count: number};
}

export const chatService = {
    getRequestMessages: async (requestId: string): Promise<Message[]> => {
        const res = await api.get<MessagesResponse>(`/chat/${requestId}/messages`);
        return res.data.data;
    },

    getCustomMessages: async (postId: string, technicianId: string): Promise<Message[]> => {
        const res = await api.get<MessagesResponse>(`/chat/custom/${postId}/${technicianId}/messages`);
        return res.data.data;
    },

    getUnreadCount: async (requestId: string): Promise<number> => {
        const res = await api.get<UnreadCountResponse>(`/chat/${requestId}/unread`);
        return res.data.data.count;
    },
};
