//Importing the necessary libraries
import express from "express";
import cors from "cors";

//Importing the necessary routes
import chatbotRoutes from "./routes/chatbot.routes.js";
import reportCasesRoutes from "./routes/reportCases.routes.js";
import manageCasesRoutes from "./routes/manageCases.routes.js";
import reportSitesRoutes from "./routes/reportSites.routes.js";
import announcementRoutes from "./routes/announcements.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

//Allows the frontend to talk to the backend
app.use(cors());
app.use(express.json());

//register chatbot route
app.use("/chatbot", chatbotRoutes);

//register auth routes
app.use("/api/auth", authRoutes);
//register report cases route (frontend expects /api/report-case)
app.use("/api", reportCasesRoutes);
//register manage cases route
app.use("/api", manageCasesRoutes);
//register report breeding sites route
app.use("/api", reportSitesRoutes);
//register send announcement route
app.use("/api", announcementRoutes);
//register dashboard summary route
app.use("/api", dashboardRoutes);
//export app to server.js

export default app;
