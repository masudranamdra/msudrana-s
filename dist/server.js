"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const dns_1 = __importDefault(require("dns"));
// Load env variables
dotenv_1.default.config();
// Fix DNS resolution issues on Windows for MongoDB Atlas SRV records
dns_1.default.setServers(['8.8.8.8', '1.1.1.1']);
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
// Connect to Database
(0, db_1.connectDB)();
const PORT = process.env.PORT || 5000;
const server = app_1.default.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
