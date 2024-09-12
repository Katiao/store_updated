import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import UnauthenticatedError from "../errors/unauthenticated.js";
import { AuthenticatedRequest } from "../types.js";

const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthenticatedRequest["user"];
    // attach the user to the orders routes
    req.user = { userId: payload?.userId, name: payload?.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

export default authenticateUser;
