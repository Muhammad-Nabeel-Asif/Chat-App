import jwt from "jsonwebtoken";

interface ExpireToken {
  (id: string): string;
}

export const expireToken: ExpireToken = (id: any) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    // "1" means 1 millisecond
    expiresIn: "1",
  });
};
