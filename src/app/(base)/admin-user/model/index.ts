export type AdminUserEntity = {
  _id?: string;
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  iSuperAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminUserFormValues = {
  username: string;
  email: string;
  password: string;
  iSuperAdmin: boolean;
};

export type CreateAdminUserPayload = AdminUserFormValues;

export type UpdateAdminUserPayload = {
  username: string;
  email: string;
  password?: string;
  iSuperAdmin: boolean;
};

export const createEmptyAdminUserFormValues = (): AdminUserFormValues => ({
  username: "",
  email: "",
  password: "",
  iSuperAdmin: false,
});
