import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  console.log("verifyToken: Attempting to verify admin token.");
  console.log("verifyToken: All cookies received by backend:", req.cookies);
  const token = req.cookies.access_token;

  if (!token) {
    console.error("verifyToken: 'access_token' (admin) not found in cookies.");
    return next(errorHandler(401, "Unauthorized - Admin token not found"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error(
        "verifyToken: JWT verification failed for admin token.",
        err
      );
      return next(errorHandler(403, "Forbidden - Admin token invalid"));
    }
    console.log(
      "verifyToken: Admin token verified successfully for user:",
      user
    );
    req.user = user;
    next();
  });
};

export const verifyTokenEmp = (req, res, next) => {
  console.log("verifyTokenEmp: Attempting to verify employee token.");
  console.log("verifyTokenEmp: All cookies received by backend:", req.cookies);
  const token = req.cookies.access_token_emp;

  if (!token) {
    console.error(
      "verifyTokenEmp: 'access_token_emp' (employee) not found in cookies."
    );
    return next(errorHandler(401, "Unauthorized - Employee token not found"));
  }

  jwt.verify(token, process.env.JWT_SECRET_EMP, (err, user) => {
    if (err) {
      console.error(
        "verifyTokenEmp: JWT verification failed for employee token.",
        err
      );
      return next(errorHandler(403, "Forbidden - Employee token invalid"));
    }
    console.log(
      "verifyTokenEmp: Employee token verified successfully for user:",
      user
    );
    req.user = user;
    next();
  });
};
