export interface LeaveRequest {
  id: string;
  mys_id?: string;
  staff?: LRStaffDetails; // object
  start_date: Date;
  end_date: Date;
  number_of_days?: number;
  leave_type: string;
  status?: string;
  details: string;
  created_at: Date;
  // color?: leaveRequestColor;
  color: string;
}

export interface LRStaffDetails {
  japanese_name: string;
  english_name: string;
  mys_id: string;
}

export const leaveRequestColors = [
  "primary",
  "warning",
  "error",
  "success",
  "info",
] as const;

export type leaveRequestColor = (typeof leaveRequestColors)[number];
