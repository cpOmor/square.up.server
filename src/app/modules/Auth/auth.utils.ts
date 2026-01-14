export const USER_ROLE = {
  admin: 'admin',
  user: 'user',
  moderator: 'moderator',
} as const;

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const UserStatus = {
  active: 'active',
  blocked: 'blocked',
  inProgress: 'in-progress',
} as const;

export type TUserStatus = (typeof UserStatus)[keyof typeof UserStatus];
