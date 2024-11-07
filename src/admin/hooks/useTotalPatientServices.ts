import { useQuery } from "react-query";
import { axiosInstance } from "../../api/server";
import { ServicesByPatient } from "../types/colibriData";

const fetchTotalServicesByPatient = async (): Promise<ServicesByPatient[]> => {
  const { data } = await axiosInstance("/shift/get_total_services_by_patients");

  return data;
};

export function useTotalServicesByPatient() {
  return useQuery(["colibri_total_services_by_patient"], () => fetchTotalServicesByPatient(), {});
}
