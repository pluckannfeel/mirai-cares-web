import { MedicalInstitution as MedicalInstitutionSelect } from "../../medical_institution/types/MedicalInstitution";
import { PatientSelect } from "../../patients/types/patient";
import { StaffScheduleSelect } from "../../shift/types/StaffWorkSchedule";

export interface GenerateCompanyDocument {
  document_name: string;
  staff: StaffScheduleSelect;
  patient: PatientSelect;
  institution: MedicalInstitutionSelect;
  date_created: Date;

  esignature: boolean;
  start_period?: Date;
  end_period?: Date;
  sign_date?: Date;
}
