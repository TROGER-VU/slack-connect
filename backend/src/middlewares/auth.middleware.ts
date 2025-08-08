import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    team_id: string;
    user_id: string;
  };
}

export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log(req.cookies);
  const token = req.cookies?.session;
  console.log("🔐 Authenticating user with token:", token);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. No session cookie found." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      team_id: string;
      user_id: string;
    };

    req.user = {
      team_id: decoded.team_id,
      user_id: decoded.user_id,
    };

    next();
  } catch (err) {
    console.error("JWT verify error:", err);
    return res.status(401).json({ error: "Invalid or expired session token." });
  }
};
