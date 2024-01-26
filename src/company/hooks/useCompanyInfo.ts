import { useQuery } from "react-query";
import { CompanyInfo } from "../types/companyInfo";
import { axiosInstance } from "../../api/server";

const fetchCompanyInfo = async (id?: string): Promise<CompanyInfo> => {
  // id is a organization_code
  const { data } = await axiosInstance.get("/companies/" + id);
  return data;
};

export function useCompanyInfo(id?: string) {
  return useQuery(["company-information", id], () => fetchCompanyInfo(id), {
    enabled: !!id,
  });
}
