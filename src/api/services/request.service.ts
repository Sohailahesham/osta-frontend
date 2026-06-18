import { api } from "../axios";

export const getRequestById = async (id: string) => {
  const res = await api.get(`/requests/${id}`);
  return res.data;
};

export const updateRequestStatus = async (
  id: string,
  action: "on-the-way" | "start" | "complete",
  body?: { totalPrice?: number; completionNote?: string }
) => {
  const res = await api.patch(`/requests/${id}/${action}`, body ?? {});
  return res.data;
};