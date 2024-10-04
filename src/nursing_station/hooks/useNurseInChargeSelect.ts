// unused, we can fetch the list to the vns list directly and apply filter
import { useQuery } from "react-query";
import { NursingStation, NurseInCharge } from "../types/NursingStation";
import { axiosInstance } from "../../api/server";

const fetchNurseInChargeSelect = async (
  vns_id: string
): Promise<NurseInCharge[]> => {
  const { data } = await axiosInstance.get("nursing_stations/select_nic", {
    params: {
      vns_id: vns_id,
    },
  });
  return data;
};

export function useNurseInChargeSelect(vns_id: string) {
  return useQuery(
    ["nursing_stations"],
    () => fetchNurseInChargeSelect(vns_id),
    {
      enabled: !!vns_id,
    }
  );
}
