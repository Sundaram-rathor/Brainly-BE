"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const util_1 = require("./utils/util");
const Usermiddleware_1 = require("./middleware/Usermiddleware");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3000;
const corsOptions = {
    origin: ['http://localhost:5173', 'http://10.100.25.241:5173']
};
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.get('/', (req, res) => {
    res.json({
        message: 'home route !!!'
    });
});
app.post('/api/v1/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    console.log(username);
    try {
        yield db_1.UserModel.create({
            username: username,
            password: password
        });
        res.json({
            message: 'user successfully created '
        });
    }
    catch (error) {
        res.status(411).json({
            message: 'user already exists'
        });
    }
}));
app.post('/api/v1/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const existingUser = yield db_1.UserModel.findOne({ username, password });
    const JWT_SECRET = process.env.JWT_PASSWORD;
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id
        }, JWT_SECRET);
        res.json({
            token
        });
    }
    else {
        res.status(403).json({
            message: 'Incorrect credentials'
        });
    }
}));
//user protected routes
app.post('/api/v1/content', Usermiddleware_1.UserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title } = req.body;
    yield db_1.ContentModel.create({
        link,
        title,
        type,
        userId: req.userId,
        tag: []
    });
    res.json({
        message: 'content created !!!'
    });
}));
app.get('/api/v1/content', Usermiddleware_1.UserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contents = yield db_1.ContentModel.find({
        userId: req.userId
    });
    res.json({
        message: 'content retrived',
        contents
    });
}));
app.delete('/api/v1/content', Usermiddleware_1.UserMiddleware, (req, res) => {
});
//share routes
app.post('/api/v1/brain/share', Usermiddleware_1.UserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share } = req.body;
    console.log('sharing is caring');
    const hash = (0, util_1.Random)(10);
    if (share) {
        const link = yield db_1.LinkModel.create({
            userId: req.userId,
            hash: hash
        });
        const user = yield db_1.UserModel.findById(req.userId);
        res.json({
            message: "sharable link generated",
            hash: hash,
            username: user === null || user === void 0 ? void 0 : user.username
        });
    }
    else {
        yield db_1.LinkModel.deleteOne({
            userId: req.userId
        });
        res.json({
            message: 'sharable link removed '
        });
    }
}));
app.get('/api/v1/brain/:shareLink', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.LinkModel.findOne({
        hash
    });
    const user = yield db_1.UserModel.findOne({
        _id: link === null || link === void 0 ? void 0 : link.userId
    });
    if (!user) {
        res.json({
            message: 'user not found for the given hash'
        });
        return;
    }
    const content = yield db_1.ContentModel.find({
        userId: user._id
    });
    res.json({
        message: 'data retrived',
        username: user.username,
        content: content
    });
}));
app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});
