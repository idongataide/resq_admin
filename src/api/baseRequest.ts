import axios from "axios";
const URL = import.meta.env.VITE_API_BASE_URL;

export const requestClient = axios.create({
  // baseURL: "/api",
  baseURL: URL,
});

export const withAuthHeadersHOC =
  <T>(
    fn: (
      config: { headers: { Authorization: string } },
      ...args: unknown[]
    ) => Promise<T>,
  ) =>
  (accessToken: string, ...args: unknown[]): Promise<T> =>
    fn({ headers: { Authorization: `Bearer ${accessToken}` } }, ...args);
