export interface CompanyInfo {
  id: string;
  organization_code: string;
  name: string;
  establishment_date: string;
  headoffice_postalcode: string;
  headoffice_address: string;
  representative_name: string;
  capital: string;
  num_of_employees: string;
  business_details: string;
  main_client: string;
  telephone_number: string;
  fax_number: string;
  email: string;
  website: string;
  corporate_number: string;
  office_number: string;
  trading_account: string;
  registration_number: string;
  registration_date: string;
  validity_period: string;
  online_application_id: string;
  online_application_pass: string;
  application_agent_certificate: string;
  service_type: string;
  plan_start_date: string;
  specified_validity_period: string;
}

export interface CompanyHousing {
  id: string;
  company?: string;
  property_name?: string;
  address?: string;
  postal_code?: string;
  room_number?: string;
  house_name?: string;
  management_company?: string;
  management_company_contact?: string;
  intermediary?: string;
  person_in_charge?: string;
  person_in_charge_contact?: string;
  electric_company?: string;
  electric_company_contact?: string;
  gas_company?: string;
  gas_company_contact?: string;
  water_company?: string;
  water_company_contact?: string;
  internet_company?: string;
  internet_company_contact?: string;
  remarks?: string;
  created_at?: string;
}

export interface CompanyParking {
  id: string;
  company?: string;
  parking_name?: string;
  parking_number?: string;
  parking_address?: string;
  parking_postal_code?: string;
  management_company?: string;
  management_company_contact?: string;
  intermediary?: string;
  person_in_charge?: string;
  person_in_charge_contact?: string;
  remarks?: string;
  created_at?: string;
}
