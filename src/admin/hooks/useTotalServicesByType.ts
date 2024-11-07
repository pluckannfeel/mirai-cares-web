import { useQuery } from "react-query";
import { axiosInstance } from "../../api/server";
import { ServicesByTypes } from "../types/colibriData";

const fetchTotalServicesByType = async (): Promise<ServicesByTypes[]> => {
  const { data } = await axiosInstance("/shift/get_total_services_by_servicetype");

  return data;
};

export function useTotalServicesByType() {
  return useQuery(["colibri_total_services_by_type"], () => fetchTotalServicesByType(), {});
}
