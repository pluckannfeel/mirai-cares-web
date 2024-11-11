import { useQuery } from "react-query";
import { axiosInstance } from "../../api/server";
import { ServicesByPatient } from "../types/colibriData";

const fetchTotalServicesByPatient = async (
  selectedDate?: string
): Promise<ServicesByPatient[]> => {
  const { data } = await axiosInstance(
    "/shift/get_total_services_by_patients/?selected_date=" + selectedDate
  );

  return data;
};

export function useTotalServicesByPatient(selectedDate: string) {
  return useQuery(
    ["colibri_total_services_by_patient", selectedDate],
    () => fetchTotalServicesByPatient(selectedDate),
    {
      enabled: !!selectedDate,
    }
  );
}
