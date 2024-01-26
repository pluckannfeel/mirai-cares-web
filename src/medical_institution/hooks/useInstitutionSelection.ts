import { useQuery } from "react-query";
import { MedicalInstitution } from "../types/MedicalInstitution";
import { axiosInstance } from "../../api/server";

const fetchInstitutionsSelect = async (): Promise<MedicalInstitution[]> => {
  const { data } = await axiosInstance.get("medical_institutions");
  return data;
};

export function useInstitutionsSelect() {
  return useQuery(["medical_institutions"], () =>
    fetchInstitutionsSelect()
  );
}
