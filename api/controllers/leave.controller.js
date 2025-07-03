import Leave from "../models/leave.model.js";
import Employee from "../models/employee.model.js";
import { errorHandler } from "../utils/error.js";
import {
  sendLeaveRequestNotification,
  sendLeaveStatusNotification,
} from "../services/emailService.js";

export const addLeave = async (req, res, next) => {
  try {
    const leave = new Leave(req.body);
    const employee = await Employee.findOne({ empid: leave.empRef });
    if (employee) {
      if (leave.days > employee.leave_balance) {
        leave.against_balance = leave.days - employee.leave_balance;
      } else {
        leave.against_balance = 0;
      }
      await leave.save();

      // Send email notification to admin
      try {
        await sendLeaveRequestNotification(leave, employee);
      } catch (emailError) {
        console.error("❌ Failed to send email notification:", emailError);
        // Don't fail the request if email fails
      }

      // Send real-time WebSocket notification to all connected admins
      if (global.io && global.adminClients.size > 0) {
        const notificationData = {
          type: "NEW_LEAVE_REQUEST",
          message: `New leave request from ${employee.name} (${leave.empRef})`,
          leaveId: leave._id,
          empRef: leave.empRef,
          employeeName: employee.name,
          fromDate: leave.fromDate,
          toDate: leave.toDate,
          days: leave.days,
          reason: leave.reason,
          against_balance: leave.against_balance,
          timestamp: new Date().toISOString(),
        };

        // Send to all connected admins
        let notificationsSent = 0;
        global.adminClients.forEach((socketId, adminId) => {
          global.io
            .to(socketId)
            .emit("leave-request-notification", notificationData);
          notificationsSent++;
        });

        console.log(
          `🔔 WebSocket notifications sent to ${notificationsSent} admin(s)`
        );
      } else {
        console.log("ℹ️ No admin clients connected for WebSocket notification");
      }

      return res.status(201).json(leave);
    } else {
      return res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const updateLeave = async (req, res, next) => {
  try {
    const leaveId = req.params.id;
    const updatedLeave = await Leave.findByIdAndUpdate(leaveId, req.body, {
      new: true,
    });
    const employee = await Employee.findOne({ empid: updatedLeave.empRef });

    if (!employee) {
      return next(errorHandler(404, "Employee not found!"));
    }

    if (updatedLeave.status.toLowerCase() === "approved") {
      employee.leave_balance -= updatedLeave.days;
      if (employee.leave_balance < 0) {
        employee.leave_balance = 0;
      }
      await employee.save();
    } else if (updatedLeave.status.toLowerCase() === "rejected") {
      employee.leave_balance += updatedLeave.days;
      await employee.save();
    }

    // Send email notification to employee about status change
    if (updatedLeave.status.toLowerCase() !== "pending") {
      try {
        await sendLeaveStatusNotification(updatedLeave, employee);
      } catch (emailError) {
        console.error("❌ Failed to send status update email:", emailError);
      }

      // Send WebSocket notification to employee (if connected)
      if (global.io) {
        const notificationData = {
          type: "LEAVE_STATUS_UPDATE",
          message: `Your leave request has been ${updatedLeave.status}`,
          leaveId: updatedLeave._id,
          status: updatedLeave.status,
          fromDate: updatedLeave.fromDate,
          toDate: updatedLeave.toDate,
          days: updatedLeave.days,
          timestamp: new Date().toISOString(),
        };

        // Broadcast to all clients (employee will filter by their empid)
        global.io.emit("leave-status-update", {
          ...notificationData,
          empRef: updatedLeave.empRef,
        });

        console.log(
          `🔔 Leave status update notification sent for employee ${updatedLeave.empRef}`
        );
      }
    }

    return res.status(200).json(updatedLeave);
  } catch (error) {
    next(error);
  }
};

export const getLeavesEmp = async (req, res, next) => {
  try {
    const empid = req.params.empid;
    const leaves = await Leave.find({ empRef: empid });

    if (!leaves) {
      return next(errorHandler(404, "No leaves found for this employee ID!"));
    }
    // console.log(leaves)
    return res.status(200).json(leaves);
  } catch (error) {
    next(error);
  }
};

export const getLeave = async (req, res, next) => {
  try {
    const id = req.params.id;
    const leave = await Leave.findById(id);

    if (!leave) {
      return next(errorHandler(404, "No leave found with this ID!"));
    }

    return res.status(200).json(leave);
  } catch (error) {
    next(error);
  }
};

export const getLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find();

    return res.status(200).json(leaves);
  } catch (error) {
    next(error);
  }
};

export const deleteLeave = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedLeave = await Leave.findByIdAndDelete(id);

    if (!deletedLeave) {
      return next(errorHandler(404, "No leave found with this ID!"));
    }

    return res.status(200).json({ message: "Leave deleted successfully" });
  } catch (error) {
    next(error);
  }
};
