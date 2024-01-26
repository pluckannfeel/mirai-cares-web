import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../../api/server";
// import { Payslip } from "../types/payslip";
// import { removeMany } from "../../core/utils/crudUtils";

const deletePayslip = async (payslip_ids: string[]): Promise<string[]> => {
  const formData = new FormData();
  payslip_ids.forEach((id) => formData.append("payslip_ids", id));

  const { data } = await axiosInstance.delete<string[]>(
    "/payslip/delete_payslip",
    {
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export function useDeletePayslips() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deletePayslip, {
    onSuccess: (payslipIds: string[]) => {
      // queryClient.setQueryData<Payslip[]>(
      //     ["payslips"],
      //     (oldPayslips) =>
      //     removeMany(oldPayslips, payslipIds))
      queryClient.invalidateQueries("payslips");
    },
    // onError: (error: any) => {
    //   // Handle error appropriately
    //   console.error("Error deleting payslips:", error);
    // },
  });

  return { isDeleting: isLoading, deletePayslips: mutateAsync };
}
