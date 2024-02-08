// Interface for known properties
interface StaffTimeBaseRecord {
  staff: string;
  staff_code: string;
  nationality: string;
  total_work_hours: number;
  night_work_hours: number;
  holiday_work_hours: number;
  group_home: number;
  group_home_stays: number;
}

// Interface for dynamic properties
interface DynamicPatientHours {
  [patientName: string]: number;
}

// Combining the interfaces for use
export type StaffTimeRecord = StaffTimeBaseRecord & DynamicPatientHours;
