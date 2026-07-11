"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Import Middlewares
const errorMiddleware_1 = require("./middleware/errorMiddleware");
// Import Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const skillRoutes_1 = __importDefault(require("./routes/skillRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const articleRoutes_1 = __importDefault(require("./routes/articleRoutes"));
const testimonialRoutes_1 = __importDefault(require("./routes/testimonialRoutes"));
const activityRoutes_1 = __importDefault(require("./routes/activityRoutes"));
const galleryRoutes_1 = __importDefault(require("./routes/galleryRoutes"));
const documentRoutes_1 = __importDefault(require("./routes/documentRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const configRoutes_1 = __importDefault(require("./routes/configRoutes"));
const app = (0, express_1.default)();
// Set security headers
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows serving local files cross-origin
}));
// Enable CORS
const whitelist = [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'https://vercel.app', // placeholder for future deploy
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || whitelist.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Cookie parser
app.use((0, cookie_parser_1.default)());
// Rate Limiting (100 requests per 15 mins per IP for API)
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', apiLimiter);
// Ensure local static upload folders exist
const uploadsDir = path_1.default.join(process.cwd(), 'public', 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Serve uploaded files statically
app.use('/uploads', express_1.default.static(uploadsDir));
// Mount Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/projects', projectRoutes_1.default);
app.use('/api/skills', skillRoutes_1.default);
app.use('/api/blogs', blogRoutes_1.default);
app.use('/api/articles', articleRoutes_1.default);
app.use('/api/testimonials', testimonialRoutes_1.default);
app.use('/api/activities', activityRoutes_1.default);
app.use('/api/gallery', galleryRoutes_1.default);
app.use('/api/documents', documentRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
app.use('/api/config', configRoutes_1.default);
// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is healthy' });
});
// Root route
app.get('/', (req, res) => {
    res.send('Portfolio SaaS API is running...');
});
// Global Error Handler Middleware
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
