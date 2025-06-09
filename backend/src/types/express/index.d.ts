import { User } from "@prisma/client"; // or your custom user type

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
