import api from "./api";

export const loginRequest = async (email: string, password: string) => {
  const response = await api.post("/auth/sign-in/email", {
    email,
    password,
  });

  return response.data;
};

export const registerRequest = async (
  name: string,
  email: string,
  password: string,
) => {
  const response = await api.post("/auth/sign-up/email", {
    name,
    email,
    password,
  });

  return response.data;
};

export const getMeRequest = async () => {
  const response = await api.get("/auth/get-session");

  return response.data;
};

export const logoutRequest = async () => {
  const response = await api.post("/auth/sign-out");

  return response.data;
};
