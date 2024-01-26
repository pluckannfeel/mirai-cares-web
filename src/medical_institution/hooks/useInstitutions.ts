import { useQuery } from "react-query";
import { MedicalInstitution } from "../types/MedicalInstitution";
import { axiosInstance } from "../../api/server";

const fetchInstitutions = async (): Promise<MedicalInstitution[]> => {
  const { data } = await axiosInstance.get("medical_institutions");
  return data;
};

export function useInstitutions() {
  return useQuery(["medical_institutions"], () => fetchInstitutions());
}
