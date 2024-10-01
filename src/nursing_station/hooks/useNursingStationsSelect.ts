import { useQuery } from "react-query";
import { NursingStation } from "../types/NursingStation";
import { axiosInstance } from "../../api/server";

const fetchNursingStationsSelect = async (): Promise<NursingStation[]> => {
  const { data } = await axiosInstance.get("nursing_stations/select");
  return data;
};

export function useNursingStationsSelect() {
  return useQuery(["nursing_stations"], () => fetchNursingStationsSelect());
}
