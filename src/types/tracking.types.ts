export interface TechnicianRequest {
  _id: string;
  serviceId: { name: string };
  categoryId: { name: string };
  userId: { fullName: string };
  status: string;
  assignedTechnician: { fullName: string } | null;
  address: { fullAddress: string , district: string;};
  preferredDate: string;
  preferredTime: string;
  notes: string | null;
  servicePrice?: number;
  totalPrice?: number;
  completionNote?: string | null;
  extraMaterialsPrice?: number;
}
