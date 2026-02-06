import api from "./axios";

// REGISTER
export const registerUser = async (formData) => {
  const res = await api.post("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// LOGIN
export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // { token, role }
};



export const generateOtp = (email) => {
  return api.post(
    "/notification/generate-otp",
    null,
    { params: { email, purpose: "REGISTER" } ,
          withCredentials: true, // ensure cookies are sent
   }
  );
};

export const verifyOtp = (email, otp) => {
  return api.post(
    "/notification/verify-otp",
    null,
    { params: { email, purpose: "REGISTER", otp } }
  );
};
