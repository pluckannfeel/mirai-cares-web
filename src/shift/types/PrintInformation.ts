import { Staff } from "../../staff/types/staff";
import { StaffWorkSchedule } from "./StaffWorkSchedule";
import { ShiftReport } from "./shiftReport";

export type PrintStaffShift = {
  //   affiliation: string;
  staff: Staff;
  //   target_period: string;
  data: StaffWorkSchedule[];
};

export type PrintStaffReport = {
  staff: Staff;
  data: ShiftReport[];
};

export type ShiftTable = {
  id: number;
  date: string;
  service_hours: string;
  duration: string;
  patient_name: string;
  service_type: string;
  remarks: string;
  start: Date | string;
  end: Date | string;
};
