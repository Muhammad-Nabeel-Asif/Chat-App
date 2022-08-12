"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const connect_1 = require("./db/connect");
const userRoutes_1 = require("./routes/userRoutes");
const chatRoutes_1 = require("./routes/chatRoutes");
const messageRoutes_1 = require("./routes/messageRoutes");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const authMiddleware_1 = require("./middleware/authMiddleware");
const swaggerDocument = yamljs_1.default.load("./swagger/swagger.yaml");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => res.send('<h1>Welcome to Chat API</h1> <a href="/api-docs">Go to Documentation</a>'));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use("/api/users", userRoutes_1.userRoutes);
app.use("/api/chats", authMiddleware_1.protect, chatRoutes_1.chatRoutes);
app.use("/api/messages", authMiddleware_1.protect, messageRoutes_1.messageRoutes);
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
const start = async () => {
    try {
        await (0, connect_1.connectDB)(process.env.MONGO_URI);
        httpServer.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));
    }
    catch (error) {
        console.log(error);
    }
};
start();
//# sourceMappingURL=server.js.map