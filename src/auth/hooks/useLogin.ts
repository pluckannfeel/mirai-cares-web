// import axios from "axios";
import { useMutation } from "react-query";
import { axiosInstance, baseUrl } from "../../api/server";

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string> => {
  // const { data } = await axios.post("/api/login", { email, password });

  const formData = {
    email,
    password,
  };
  //log the url request
  // console.log("login url: " + baseUrl + "/users/login");
  // console.log(formData);

  const { data } = await axiosInstance.post("/users/login", formData);

  // data is object with token key take it instead of passing the whole object
  // because Auth Provider in admin takes the return data response directly

  // console.log(data);

  const token = data["token"].toString();

  return token;
};

export function useLogin() {
  const { isLoading, mutateAsync } = useMutation(login);

  return { isLoggingIn: isLoading, login: mutateAsync };
}
