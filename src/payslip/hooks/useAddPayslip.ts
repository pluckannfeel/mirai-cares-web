import { useMutation, useQueryClient } from "react-query";
// import { addOne } from "../../core/utils/crudUtils";
import { Payslip } from "../types/payslip";
import { axiosInstance } from "../../api/server";

const addPayslip = async (payslip: Payslip): Promise<Payslip> => {
  const payslipFile = payslip.file_url;

  const payslip_data_form = {
    ...payslip,
  };

  delete payslip_data_form.file_url;

  const formData = new FormData();
  formData.append("payslip_json", JSON.stringify(payslip_data_form));

  if (payslipFile) formData.append("payslip_file", payslipFile);

  const { data } = await axiosInstance.post("/payslip/add_payslip", formData);

  return data;
};

export const useAddPayslip = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addPayslip, {
    onSuccess: (data: Payslip) => {
        queryClient.invalidateQueries("payslips");
      // queryClient.setQueryData<Payslip[]>(["payslips"], (oldPayslip) => {
      //   return addOne(oldPayslip, data);
      // });
    },
  });

  return { isAdding: isLoading, addPayslip: mutateAsync };
};
