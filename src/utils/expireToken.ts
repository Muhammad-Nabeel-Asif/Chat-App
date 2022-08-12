import jwt from "jsonwebtoken";

export const expireToken = (id: any) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    // "1" means 1 millisecond
    expiresIn: "1",
  });
};
