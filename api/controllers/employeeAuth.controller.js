import Employee from "../models/employee.model.js";
import BankDetails from "../models/bank.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const getLeaveBalance = async (req, res, next) => {
  const { empid } = req.body;
  try {
    const employee = await Employee.findOne({ empid: empid });
    if (!employee) return next(errorHandler(404, "Employee not found"));

    res.status(200).json({ leave_balance: employee.leave_balance });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { empid, password } = req.body;
  try {
    const validEmployee = await Employee.findOne({ empid: empid });
    if (!validEmployee) return next(errorHandler(404, "User not Found!!"));
    const validPassword = bcryptjs.compareSync(
      password,
      validEmployee.password
    );
    if (!validPassword) return next(errorHandler(401, "Wrong Credential"));

    const token = jwt.sign(
      { id: validEmployee._id },
      process.env.JWT_SECRET_EMP
    );

    const { password: pass, ...rest } = validEmployee._doc;

    res
      .cookie("access_token_emp", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token_emp");
    res.status(200).json("User has been logged out");
  } catch (error) {
    next(error);
  }
};

export const viewData = async (req, res, next) => {
  try {
    const empid = req.params.empid;
    const currentUserEmpId = req.query.empid;

    if (empid === currentUserEmpId) {
      const employeeData = await Employee.findOne({ empid: currentUserEmpId });
      const bankDetailsData = await BankDetails.findOne({
        empRef: currentUserEmpId,
      });
      res.status(200).json({ employeeData, bankDetailsData });
    } else {
      res.redirect("/employee-home");
    }
  } catch (error) {
    console.error("Error handling employee data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
