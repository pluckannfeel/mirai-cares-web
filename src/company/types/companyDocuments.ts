import { MedicalInstitution as MedicalInstitutionSelect } from "../../medical_institution/types/MedicalInstitution";
import {
  NurseInCharge,
  NursingStation,
} from "../../nursing_station/types/NursingStation";
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
  affiliated_company?: string; //所属機関
  company_stamp?: boolean;

  // patient
  expiration_date?: string;
  person_in_charge?: string;
  witness_name?: string;
  witness_email?: string;

  // visiting_nursing_station
  visiting_nursing_station: NursingStation;
  nurse_in_charge?: NurseInCharge;

  // sputum training
  qualifications_held?: number[];
  welfare_experience?: string;
  current_employment_experience?: string;

  onsite_exercises_training?: number[];
  business_system_established?: number[];

  main_illness?: string;
  current_conditions: number[];

  station_qualifications_held?: number[]; // ishiki 5
  ojt_instruction_content?: number[];
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

// additional fields for sputum training document
// visiting nursing selection
// nurse in charge (we also need to create a hook to fetch all nurses with visiting nursing selection)
// created date (written date)
// required shapes to fill ff;
// # 各事業所が体制として整備するもの - checkbox page 2
// # 現場演習及び実地研修に関して、提出していただく書類 checkbox page 2
// #  現在の状況について - checkbox page 4
// # 保有資格 number wrapped in circle page 5
// # 実地研修指導内容（該当を〇）- circle page 5
