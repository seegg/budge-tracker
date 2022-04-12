import { User } from "./src/user/user-types";

declare namespace Express {
  export interface Requst {
    user: User
  }
}