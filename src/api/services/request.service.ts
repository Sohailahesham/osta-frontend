import {api} from "@/api/axios";
import type {AssignedRequest, PaginatedResponseMeta} from "@/types/request.types";

export const getRequestById = async (id: string) => {
    const res = await api.get(`/requests/${id}`);
    return res.data;
};

export const updateRequestStatus = async (
    id: string,
    action: "on-the-way" | "start" | "complete",
    body?: {totalPrice?: number; completionNote?: string}
) => {
    const res = await api.patch(`/requests/${id}/${action}`, body ?? {});
    return res.data;
};

interface AssignedRequestsApiShape {
    data?: AssignedRequest[];
    meta?: PaginatedResponseMeta;
}

export interface AssignedRequestsResult {
    data: AssignedRequest[];
    meta?: PaginatedResponseMeta;
}

const isAssignedRequestArray = (value: unknown): value is AssignedRequest[] => Array.isArray(value);

export const getAssignedRequests = async (): Promise<AssignedRequestsResult> => {
    const response = await api.get("/requests/assigned");
    const payload = response.data as AssignedRequestsApiShape | {data?: AssignedRequestsApiShape};

    const nested = payload && "data" in payload ? payload.data : undefined;
    const data = isAssignedRequestArray(nested) ? nested : isAssignedRequestArray(nested?.data) ? nested.data : [];

    const meta = nested && !Array.isArray(nested) && "meta" in nested ? nested.meta : undefined;

    return {data, meta};
};
