import { useQuery } from "react-query";
import { Payslip } from "../types/payslip";
import { axiosInstance } from "../../api/server";

const fetchPayslips = async (): Promise<Payslip[]> => {
  const { data } = await axiosInstance.get("payslip");
  // you can add affiliation later on if you want to filter by affiliation like angel care services etc..
  return data;
};

export function usePayslips() {
  return useQuery(["payslips"], () => fetchPayslips(), {});
}
