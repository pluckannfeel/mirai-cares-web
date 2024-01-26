export interface User {
  id: string;
  avatar?: string;
  disabled: boolean;
  email: string;
  first_name: string;
  // gender?: "F" | "M" | "NC";
  last_name: string;
  role: string; // "admin" | "user" | "manager" | "staff"
  job: string;
}
