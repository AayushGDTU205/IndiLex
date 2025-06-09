import { User } from "@prisma/client"; 
//to enable req.user in typescript
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
