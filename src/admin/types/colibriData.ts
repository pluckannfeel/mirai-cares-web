export type Services = {
  month: string;
  service_hours: number;
};

export type ServicesByTypes = {
  name: string;
  fill: string;
  value: number;
};

export type ServicesByPatient = {
  name: string;
  hours: number;
};

export type MostServicesByStaff = {
  id: number;
  color: string;
  name: string;
  progress: number;
  value: number;
};
