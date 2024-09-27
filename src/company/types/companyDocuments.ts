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

  //employment contract
  affiliated_company?: string//所属機関 
  company_stamp?: boolean;

  // patient
  expiration_date?: string;
  person_in_charge?: string;
  witness_name?: string;
  witness_email?: string;

  // // going out
  // going_out?: DayDetails;
}

// export type DayDetails = {
//   [key: number]: {
//     day: number;
//     helper_id: string;
//     details: { destination: string; travel_method: string }[];
//   };
// };

// export type GoingOut = {
//   destination: string;
//   travel_method: string;
// };
