import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { Staff } from "../types/staff";
import { axiosInstance } from "../../api/server";

const updateStaff = async (staff: Staff): Promise<Staff> => {
  const staffImg = staff.img_url;
  // console.log(staff);
  const staff_data_form = {
    ...staff,
  };

  // delete staff_data_form['id'];
  // delete staff_data_form["img_url"];
  delete staff_data_form.img_url;

  const formData = new FormData();

  formData.append("staff_json", JSON.stringify(staff_data_form));

  // append staff image
  if (staffImg) formData.append("staff_image", staffImg);

  //bank card images
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
    if (
      staff.residence_card_details.front &&
      staff.residence_card_details.front instanceof File
    )
      formData.append(
        "residence_card_front",
        staff.residence_card_details.front
      );
    if (
      staff.residence_card_details.back &&
      staff.residence_card_details.back instanceof File
    )
      formData.append("residence_card_back", staff.residence_card_details.back);
  }
  delete staff.residence_card_details?.front;
  delete staff.residence_card_details?.back;

  // get passport details.file and remove it from the staff passport_details object
  const passportDetailsFile = staff.passport_details?.file;

  // append passport details file
  if (passportDetailsFile) {
    if (
      staff.passport_details?.file &&
      staff.passport_details?.file instanceof File
    ) {
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

  const { data } = await axiosInstance.put("/staff/update_staff", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // return {} as Staff;
  return data;
};

export function useUpdateStaff() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateStaff, {
    onSuccess: (staff: Staff) => {
      queryClient.setQueryData<Staff[]>(["staff"], (oldStaff) =>
        updateOne(oldStaff, staff)
      );
    },
  });

  return { isUpdating: isLoading, updateStaff: mutateAsync };
}
