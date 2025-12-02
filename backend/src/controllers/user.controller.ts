import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Get current user profile
export const getProfile = async (req: Request, res: Response) => {
    try {
        // @ts-ignore - userId is added by auth middleware
        const userId = req.user.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                bio: true,
                avatarUrl: true,
                notificationsEnabled: true,
                passportCode: true,
                createdAt: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
    try {
        // @ts-ignore - userId is added by auth middleware
        const userId = req.user.userId;
        const { fullName, bio, avatarUrl, notificationsEnabled, passportCode } = req.body;

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                fullName,
                bio,
                avatarUrl,
                notificationsEnabled,
                passportCode,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                bio: true,
                avatarUrl: true,
                notificationsEnabled: true,
                passportCode: true,
            }
        });

        res.json(user);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};
