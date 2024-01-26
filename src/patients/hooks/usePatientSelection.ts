import { useQuery } from "react-query";
import { PatientSelect } from "../types/patient";
import { axiosInstance } from "../../api/server";

const fetchPatientSelect = async (): Promise<PatientSelect[]> => {
  const { data } = await axiosInstance.get("patients/patient_select");

  return data;
};

export function usePatientSelect() {
  return useQuery(["patients"], () => fetchPatientSelect(), {
    // enabled: !!group,
  });
}
