export interface NursingStation {
  id: string;
  corporate_name: string;
  corporate_address: string;
  corporate_postal_code: string;
  phone: string;
  fax: string;
  email_address: string;
  rep_name_kanji: string;
  rep_name_kana: string;
  administrator_name_kanji: string;
  administrator_name_kana: string;

  station_name: string;
  station_address: string;
  station_establishment_date?: Date | null;

  nurses: NurseInCharge[];
  created_at?: Date;
}

export type NurseInCharge = {
  name_kanji: string;
  name_kana: string;
  birth_date: Date;
  age: string;
};
