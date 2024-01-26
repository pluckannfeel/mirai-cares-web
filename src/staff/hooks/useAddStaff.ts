import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils";
import { Staff } from "../types/staff";
import { axiosInstance } from "../../api/server";

const addStaff = async (staff: Staff): Promise<Staff> => {
  const staffImg = staff.img_url;

  const staff_data_form = {
    ...staff,
    // add licenses but remove the file from each license which is license.file
    // licenses: staff.licenses && staff.licenses.map((license) => license),
  };

  delete staff_data_form.img_url;

  const formData = new FormData();
  formData.append("staff_json", JSON.stringify(staff_data_form));

  if (staffImg) formData.append("staff_image", staffImg);

  // append bank card images
  if (staff.bank_card_images) {
    if (
      staff.bank_card_images.front &&
      staff.bank_card_images.front instanceof File
    )
      formData.append("bank_card_front", staff.bank_card_images.front);
    if (
      staff.bank_card_images.back &&
      staff.bank_card_images.back instanceof File
    )
      formData.append("bank_card_back", staff.bank_card_images.back);
  }
  delete staff.bank_card_images?.back;
  delete staff.bank_card_images?.front;

  // residence card
  // append residence card details
  if (staff.residence_card_details) {
    // check if there is residence_card_details.front and check if the type is File
    // if it is a file then append it to the formData
    if (
      staff.residence_card_details.front &&
      staff.residence_card_details.front instanceof File
    ) {
      formData.append(
        "residence_card_front",
        staff.residence_card_details.front
      );
    }

    if (
      staff.residence_card_details.back &&
      staff.residence_card_details.back instanceof File
    ) {
      formData.append("residence_card_back", staff.residence_card_details.back);
    }
  }
  delete staff.residence_card_details?.front;
  delete staff.residence_card_details?.back;

  // get passport details.file and remove it from the staff passport_details object
  const passportDetailsFile = staff.passport_details?.file;

  // append passport details file
  if (passportDetailsFile) {
    if (staff.passport_details?.file && passportDetailsFile instanceof File) {
      formData.append("passport_file", passportDetailsFile);
    }
  }

  delete staff.passport_details?.file;

  // append licenses
  if (staff.licenses) {
    staff.licenses.forEach((license) => {
      formData.append("licenses", license.file);
    });
  }

  const { data } = await axiosInstance.post("/staff/add_staff", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;

  // return {} as Staff;
};
export function useAddStaff() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addStaff, {
    onSuccess: (staff: Staff) => {
      // console.log(staff)
      queryClient.setQueryData<Staff[]>(["staff"], (oldStaff) =>
        addOne(oldStaff, staff)
      );
    },
  });

  return { isAdding: isLoading, addStaff: mutateAsync };
}
