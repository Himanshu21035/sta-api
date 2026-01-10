import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt";
import { User } from "../models/user";

export const register = async (req: Request, res: Response) => {
    try {
        const { userName, Password } = req.body;
        const existinguser = await User.findOne({ userName });
        
        if (existinguser) {
            return res.status(400).json({ message: "user already exists" });
        }

        const user = await User.create({ userName, Password });

        const token = jwt.sign(
            { id: user._id, userName: user.userName }, 
            JWT_SECRET, 
            { expiresIn: "7d" }
        );

        // ✅ Set token as HttpOnly cookie instead of sending in body
        res.cookie('authToken', token, {
            httpOnly: true,                              // ✅ Prevents JavaScript access
            secure: process.env.NODE_ENV === 'production', // ✅ HTTPS only in production
            sameSite: 'strict',                          // ✅ CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000,            // 7 days
            path: '/'
        });

        // ✅ Only send user data, NOT the token
        res.status(201).json({
            success: true,
            message: "user registered successfully",
            user: {
                id: user._id,
                name: user.userName,
                role: user.Role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { userName, Password } = req.body;
        const user = await User.findOne({ userName });
        
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }
        
        const isPassMatch = await user?.comparePass(Password);
        if (!isPassMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { id: user?._id, userName: user?.userName }, 
            JWT_SECRET, 
            { expiresIn: '7d' }
        );

        // ✅ Set token as HttpOnly cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });

        // ✅ Send only user data, NOT the token
        return res.status(200).json({
            success: true,
            message: "Login Successful",
            user: {
                id: user?._id,
                name: user?.userName,
                role: user.Role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error });
    }
};

// ✅ Add logout endpoint to clear cookie
export const logout = async (req: Request, res: Response) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    });
    
    res.status(200).json({ 
        success: true, 
        message: "Logged out successfully" 
    });
};
