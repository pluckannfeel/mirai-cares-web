import { MedicalInstitution as MedicalInstitutionSelect } from "../../medical_institution/types/MedicalInstitution";
import { PatientSelect } from "../../patients/types/patient";
import { StaffScheduleSelect } from "../../shift/types/StaffWorkSchedule";

export interface GenerateCompanyDocument {
  document_name: string;
  staff: StaffScheduleSelect;
  patient: PatientSelect;
  institution: MedicalInstitutionSelect;
  date_created: Date;

  attach_stamp: boolean;

  esignature: boolean;
  start_period?: Date;
  end_period?: Date;
  sign_date?: Date;

  job_details?: string;
  place_of_work?: string;
  hourly_wage?: number;
  other_allowance?: boolean;
  bonus?: boolean;
  social_insurance?: boolean;
  employment_insurance?: boolean;

  // patient
  expiration_date?: string;
  person_in_charge?: string;
}
