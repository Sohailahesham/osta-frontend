export type TrackingStepStatus = "completed" | "current" | "upcoming";

export interface TrackingStep {
  id: string;
  title: string;
  badge: string;
  description: string;
  timestamp?: string;
  status: TrackingStepStatus;
}

export interface ServiceTrackingData {
  orderId: string;
  serviceName: string;
  steps: TrackingStep[];
}

export type RequestStatus = "in_progress" | "on_the_way";

export interface TechnicianRequest {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  categoryId: {
    _id: string;
    name: string;
  };
  serviceId: {
    _id: string;
    name: string;
    priceRange: { min: number; max: number };
  };
  postId: string | null;
  preferredDate: string;
  preferredTime: string;
  status: RequestStatus;
  assignedTechnician: {
    _id: string;
    fullName: string;
  } | null;
  depositAmount: number;
  depositStatus: string;
  totalPrice: number;
  paymentId: string | null;
  isFullyPaid: boolean;
  address: {
    fullAddress: string;
    district: string;
  };
  notes: string | null;
  completionNote: string | null;
  cancellation: unknown | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}