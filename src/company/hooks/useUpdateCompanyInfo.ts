import { useMutation, useQueryClient } from "react-query";
import { CompanyInfo } from "../types/companyInfo";
import { axiosInstance } from "../../api/server";

const updateCompanyInfo = async (
  companyInfo: CompanyInfo
): Promise<CompanyInfo> => {
  const companyForm = {
    ...companyInfo,
  };

  const formData = new FormData();

  formData.append("company_json", JSON.stringify(companyForm));

  const { data } = await axiosInstance.put(
    "/companies/update_company",
    formData
    //   , {
    // headers: {
    //   "Content-Type": "multipart/form-data",
    // },
    //   }
  );

  return data;
};

export function useUpdateCompanyInfo() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateCompanyInfo, {
    onSuccess: (data) => {
      queryClient.setQueryData(["company-information"], data);
    },
  });

  return { isUpdating: isLoading, updateCompanyInfo: mutateAsync };
}
