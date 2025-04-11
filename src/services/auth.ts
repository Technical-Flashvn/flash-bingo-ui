import axios from 'axios';

export async function signUp(
  username: string,
  email: string,
  password: string,
) {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
    {
      username,
      email,
      password,
    },
    {
      withCredentials: true,
    },
  );

  return res.data;
}

export async function logIn(username: string, password: string) {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
    {
      username,
      password,
    },
    {
      withCredentials: true,
    },
  );
  return res.data;
}

export async function logOut() {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
    {}, // body rỗng
    {
      withCredentials: true,
      // headers: {
      //     Authorization: `Bearer ${accessToken}`
      // }
    },
  );
  return res.data;
}

//API 1: Forgot Password - send email to user with reset token
export async function forgotPassword(email: string) {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`,
    { email },
    { withCredentials: true },
  );
  return res.data;
}

//API 2: Reset Password - update password
export async function resetPassword(token: string, newPassword: string) {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`,
    { newPassword },
    {
      params: { token },
      withCredentials: true,
    },
  );
  return res.data;
}