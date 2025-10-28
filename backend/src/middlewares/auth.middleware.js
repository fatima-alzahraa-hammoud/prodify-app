import { getAuth } from "@clerk/express";
import { throwError } from "../utils/throwError.js";

export const authenticate = (req, res, next) => {
  try {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated || !userId) {
      return throwError({
        message: "User not authenticated",
        res,
        status: 401,
      });
    }

    // Attach userId to the request for later use
    req.userId = userId;

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return throwError({ message: "Unauthorized", res, status: 401 });
  }
};
