import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
// import xss from "xss-clean";
import rateLimit from "express-rate-limit";

import { connectDB } from "./db/connect";
import { router as userRoutes } from "./routes/userRoutes";
import { router as chatRoutes } from "./routes/chatRoutes";
import { router as messageRoutes } from "./routes/messageRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import { protect } from "./middleware/authMiddleware";
const swaggerDocument = YAML.load("./swagger/swagger.yaml");

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  // 1 minute = 60,000ms
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
// app.use(xss());

// --- App Routes ---
app.get("/", (req, res) =>
  res.send(
    '<h1>Welcome to Chat API</h1> <a href="/api-docs">Go to Documentation</a>'
  )
);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/api/users", userRoutes);
app.use("/api/chats", protect, chatRoutes);
app.use("/api/messages", protect, messageRoutes);

// --- Error Handling Middlewares ---
app.use(notFound);
app.use(errorHandler);

// ------ Starting Server And DB ------
(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    httpServer.listen(PORT, () =>
      console.log(`Server is listening on port: ${PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
})();
