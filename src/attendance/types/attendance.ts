import { StaffScheduleSelect } from "../../shift/types/StaffWorkSchedule";
import { Staff } from "../../staff/types/staff";

export type AttendanceRecord = {
  id: string;
  date: Date;
  staff_code: string;
  service_hours: string;
  duration: number;
  patient_name: string;
  service_type: string;
  remarks: string;
};

export interface FilterDate {
  month?: string;
  year?: string;
}

export type AttendanceOverallRecord = {
  records: AttendanceRecord[];
  totalWorkHours: number;
  totalWorkDays: number;
};

export type PrintAttendanceRecord = {
  staff: StaffScheduleSelect;
  records: AttendanceRecord[];
  totalWorkHours: number;
  totalWorkDays: number;
};
