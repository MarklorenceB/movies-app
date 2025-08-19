import { Client, Account, ID } from "appwrite";
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
export const account = new Account(client);
export { ID };
export const signup = async (email, password, name) =>
  await account.create(ID.unique(), email, password, name);
export const login = async (email, password) =>
  await account.createEmailSession(email, password);
export const logout = async () => await account.deleteSession("current");
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};
