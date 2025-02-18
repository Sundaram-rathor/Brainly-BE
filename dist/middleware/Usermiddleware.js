"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserMiddleware = (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        res.status(401).json({
            message: 'not authorised, not logged In!!!'
        });
    }
    try {
        jsonwebtoken_1.default.verify(token, process.env.JWT_PASSWORD, (err, data) => {
            if (err) {
                console.log('error in jwt auth ', err);
                res.json({
                    message: 'error in token'
                });
            }
            req.userId = data.id;
            next();
        });
    }
    catch (error) {
        console.log('error in auth user ', error);
        res.json({
            message: 'not able to access this route '
        });
    }
};
exports.UserMiddleware = UserMiddleware;
