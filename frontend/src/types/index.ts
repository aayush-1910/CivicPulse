export type Role = 'ROLE_CITIZEN' | 'ROLE_AUTHORITY';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Department {
  id: number;
  name: string;
  description: string;
}

export interface ComplaintStatusHistory {
  id: number;
  oldStatus?: ComplaintStatus;
  newStatus: ComplaintStatus;
  changedByName: string;
  remarks?: string;
  createdAt: string;
}

export interface Complaint {
  id: number;
  complaintNumber: string;
  userId: number;
  citizenName: string;
  citizenEmail: string;
  citizenPhone?: string;
  categoryId: number;
  categoryName: string;
  title: string;
  description: string;
  imageUrl?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  priority: Priority;
  status: ComplaintStatus;
  departmentId?: number;
  departmentName?: string;
  assignedOfficer?: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  history?: ComplaintStatusHistory[];
}

export interface DashboardStats {
  total: number;
  submitted: number;
  underReview: number;
  assigned: number;
  inProgress: number;
  resolved: number;
  closed: number;
  pending: number;
}
