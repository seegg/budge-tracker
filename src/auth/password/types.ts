export interface PasswordDetails {
  userID: string,
  passwordHash: string,
  salt: string
}

export type HashFunc = (password: string, salt: string, iterations: number, keylen: number, digest: string) => Buffer | string;