import { User } from '../../entities/User';
import argon2 from 'argon2';

export const generateUser = async (
  name: string,
  login: string,
  password: string,
  isAdmin: boolean
) => {
  const user = new User();

  user.name = name;
  user.login = login;
  user.password = await argon2.hash(password);
  user.is_admin = isAdmin;

  return user;
};
