import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.js";
import BadRequestError from "../errors/badRequest.js";
import UnauthenticatedError from "../errors/unauthenticated.js";


export const register = async (req: Request, res: Response) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}