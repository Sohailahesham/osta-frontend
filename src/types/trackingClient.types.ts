export interface AssignedTechnician {
  _id: string;
  name: string;
  phone?: string;
}

export interface ClientRequest {
  _id: string;
  status: string;
  createdAt: string;
  assignedTechnician?: AssignedTechnician;
  invoice?: {
    subtotal?: number;
    tax?: number;
    total?: number;
  };
}