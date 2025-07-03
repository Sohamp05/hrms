import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import bodyParser from "body-parser";
import cron from "node-cron";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import adminAuthRouter from "./routes/adminAuth.route.js"; //for admin
import employeeAuthRouter from "./routes/employeeAuth.route.js"; //for employee
import crudRouter from "./routes/crud.route.js"; //for CRUD operations
import leaveRouter from "./routes/leave.route.js"; //for leave operations
import slipRouter from "./routes/slip.route.js"; //for salary slip operations
import { autobonus } from "./utils/autoBonus.js";

dotenv.config();
const __dirname = path.resolve();

const app = express();
const server = createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Same CORS logic as Express
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://hrms-frontend-nfii5c6nq-soham-panchals-projects-b397b6a8.vercel.app/",
        "https://hrms-frontend-psi.vercel.app",
      ];
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store connected admin clients
const adminClients = new Map();

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // When admin connects, store their socket
  socket.on("admin-connect", (adminId) => {
    adminClients.set(adminId, socket.id);
    console.log(`👨‍💼 Admin ${adminId} connected with socket ${socket.id}`);
  });

  // When employee connects (optional)
  socket.on("employee-connect", (empId) => {
    console.log(`👤 Employee ${empId} connected with socket ${socket.id}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("🔌 User disconnected:", socket.id);
    // Remove from admin clients if they were an admin
    for (let [adminId, socketId] of adminClients.entries()) {
      if (socketId === socket.id) {
        adminClients.delete(adminId);
        console.log(`👨‍💼 Admin ${adminId} disconnected`);
        break;
      }
    }
  });
});

// Make io and adminClients available globally
global.io = io;
global.adminClients = adminClients;
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

const allowedOrigins = [
  "http://localhost:5173", // Your Vite dev server (if it runs on 5173)
  "http://localhost:3000", // Your backend's local dev port (if you test frontend against local backend)
  // Add your Vercel frontend domain here.
  // It will look something like: https://your-app-name.vercel.app
  "https://hrms-frontend-nfii5c6nq-soham-panchals-projects-b397b6a8.vercel.app/", // Original placeholder
  "https://hrms-frontend-psi.vercel.app", // Your new Vercel URL
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, or same-origin requests)
      console.log("CORS check: Request origin:", origin);
      // if (!origin) return callback(null, true);
      if (!origin) {
        console.log("CORS check: No origin, allowing.");
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin. Origin: " +
          origin +
          ". Allowed: " +
          allowedOrigins.join(", ");
        console.error("CORS check: Failed.", msg); // "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      console.log("CORS check: Origin allowed:", origin);
      return callback(null, true);
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies and authorization headers
  })
);

mongoose
  .connect(process.env.MONGO)
  .then(async () => {
    console.log("Connected to the database");
    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();

      for (const { name } of collections) {
        const stats = await db.command({ collStats: name });
        console.log(
          `Storage consumed in collection '${name}': ${stats.size} bytes`
        );
      }
    } catch (error) {
      console.error("Error retrieving database statistics:", error);
    }
  })
  .catch((err) => {
    console.log("Error connecting to the database:", err);
  });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔌 WebSocket server is ready`);
});

app.use("/api/admin-auth", adminAuthRouter);
app.use("/api/employee-auth", employeeAuthRouter);
app.use("/api/crud", crudRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/slip", slipRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  // Error handling middleware
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

cron.schedule("0 0 */24 * * *", () => {
  autobonus();
});
