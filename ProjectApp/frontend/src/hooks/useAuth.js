import { getToken } from '../services/auth';

export default function useAuth() {
  return {
    isLoggedIn: !!getToken(),
    token: getToken(),
  };
}
