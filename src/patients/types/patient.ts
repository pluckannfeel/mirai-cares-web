export interface Patient {
  id: string;
  name_kanji: string;
  name_kana: string;
  birth_date: Date | null;
  gender: string;
  age: string;
  disable_support_category: string;
  beneficiary_number: string;
  postal_code?: string;
  prefecture?: string;
  municipality?: string;
  town?: string;
  building?: string;
  telephone_number: string;
  phone_number?: string;
  billing_method: string;
  billing_address?: string;
  billing_postal_code?: string;
  patient_status: string;
  remarks?: string;
  images?: string[];
  instructions?: Instructions[];
  created_at: string | null;
}

export interface Instructions {
  details: string;
  file: File | string;
}

export type PatientSelect = {
  id: string;
  name_kanji: string;
  name_kana: string;
  birth_date?: Date;
  postal_code?: string;
  prefecture?: string;
  municipality?: string;
  town?: string;
  building?: string;
  disable_support_category?: string;
};
