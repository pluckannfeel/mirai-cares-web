export interface StaffWorkSchedule {
  id: string;
  staff: string;
  patient: string; // patient_name
  service_type?: string;
  service_details?: string;
  // date?: Date; // (number)
  start: number; // as str e.g 12:00, 18:00 24 hr format
  end: number; // as str e.g 12:00, 18:00 24 hr format
  duration: string; // from start to end total of hours 60 * n(h)
  remarks?: string;
  gender?: string;
  color?: StaffWorkScheduleColor;
}

export const staffColors = [
  "primary",
  "warning",
  "error",
  "success",
  "info",
] as const;

export type StaffWorkScheduleColor = (typeof staffColors)[number];

export type StaffScheduleSelect = {
  id: string;
  english_name: string;
  japanese_name: string;
  birth_date?: Date;
  gender?: string;
  staff_code?: string;
  // staff_group: string;
  personal_email?: string;
  work_email?: string;
  postal_code?: string;
  age?: number;
  prefecture?: string;
  municipality?: string;
  town?: string;
  building?: string;
  affiliation?: string;
  duty_type?: string;
};
