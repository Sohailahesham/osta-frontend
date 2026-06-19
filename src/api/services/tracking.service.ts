import { TechnicianRequest } from "@/types/tracking.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ;

function authHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function patchRequest(url: string, body?: object): Promise<TechnicianRequest> {
  const res = await fetch(url, {
    method: "PATCH",
    headers: authHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "حصل خطأ");
  return json.data;
}

export const trackingApi = {
  onTheWay: (id: string) =>
    patchRequest(`${BASE_URL}/requests/${id}/on-the-way`),

  start: (id: string) =>
    patchRequest(`${BASE_URL}/requests/${id}/start`),

  complete: (
    id: string,
    body: {
      servicePrice: number;
      completionNote?: string;
      extraMaterialsPrice?: number;
    }
  ) => patchRequest(`${BASE_URL}/requests/${id}/complete`, body),
};
