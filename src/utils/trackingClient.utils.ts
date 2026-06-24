import { ClientRequest } from "@/types/trackingClient.types";

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "حدث خطأ غير متوقع";
}

export function getInvoiceAmounts(request: ClientRequest) {
  return {
    subtotal: request.invoice?.subtotal ?? 0,
    tax: request.invoice?.tax ?? 0,
    total: request.invoice?.total ?? 0,
  };
}