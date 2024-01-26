export interface MedicalInstitution {
  id: string;
  physician_name_kanji: string;
  physician_name_kana: string;
  physician_birth_date: Date;
  physician_age: string;
  physician_work: string;
  entity_name: string;
  entity_poc: string;
  medical_institution_name: string;
  medical_institution_poc: string;
  medical_institution_postal_code: string;
  medical_institution_address1: string;
  medical_institution_address2: string;
  medical_institution_phone: string;
  medical_institution_fax: string;
  medical_institution_email: string;
  medical_institution_type: string;
  licenses: string[];
  license_number: string;
  date_obtained: Date;
  ojt_implementation_name: string;
//   date_created: Date;
}
