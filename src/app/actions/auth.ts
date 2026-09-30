"use server";

import { runAction } from "@/src/lib/action";
import { ApiError } from "@/src/lib/api";
import {
  changePassword,
  deleteAccount,
  getSessionUser,
  login,
  logout,
  signup,
} from "@/src/lib/services/authService";

export async function loginAction(input: { email: string; password: string }) {
  return runAction(async () => {
    await login(input);
    return null;
  });
}

export async function signupAction(input: {
  email: string;
  password: string;
  username: string;
  full_name: string;
}) {
  return runAction(async () => {
    await signup(input);
    return null;
  });
}

export async function logoutAction() {
  return runAction(async () => {
    await logout();
    return null;
  });
}

async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) throw new ApiError(401, "Unauthorized");
  return user;
}

export async function changePasswordAction(input: {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) {
  return runAction(async () => {
    await changePassword(await requireSessionUser(), input);
    return null;
  });
}

export async function deleteAccountAction() {
  return runAction(async () => {
    await deleteAccount((await requireSessionUser()).id);
    return null;
  });
}
