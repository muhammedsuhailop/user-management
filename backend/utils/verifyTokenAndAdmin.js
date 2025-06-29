import { errorHandler } from "./error.js";
import { verifyToken } from "./verifyUser.js";

export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.isAdmin) {
      next();
    } else {
      return next(errorHandler(403, "Access denied: Admins only."));
    }
  });
};
