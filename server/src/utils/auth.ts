import jwt from 'jsonwebtoken';
import  { Response } from "express";

const generateTokenAndSetCookie = (userId: string, res: Response) => {

    const secret: string = process.env.JWT_SECRET as string || ''
	const token = jwt.sign({ userId }, secret, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // MS
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks
		sameSite: "strict", // CSRF attacks cross-site request forgery attacks
		secure: process.env.NODE_ENV !== "development",
	});
    
};

const clearToken = (res: Response) => {
	res.cookie("jwt", "", {
	  httpOnly: true,
	  expires: new Date(0),
	  maxAge: 0
	});
  };

export {generateTokenAndSetCookie , clearToken};
