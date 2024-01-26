// import axios from 'axios';
import { useQuery } from 'react-query';
import { User } from '../types/user';
// import users from '../../mocks/users.json';
import { axiosInstance } from '../../api/server';

const fetchUsers = async (): Promise<User[]> => {
  // const { data } = await axios.get("/api/users");

  // const data = users;

  const { data } = await axiosInstance.get('/users/');

  return data;
};

export function useUsers() {
  return useQuery('users', () => fetchUsers());
}
