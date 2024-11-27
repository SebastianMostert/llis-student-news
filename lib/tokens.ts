import crypto from 'crypto';

import { db } from '@/lib/db';
import { getVerificationTokenByEmail } from '@/data/verificationToken';

export const generateVerificationToken = async (email: string) => {
    const token = generateVerificationCode(6);
    const expires = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour from now

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await db.verificationToken.delete({ where: { id: existingToken.id } });
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return verificationToken;
};

const generateVerificationCode = (length: number = 6): string => {
    let baseCode = crypto.randomBytes(length)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')  // Remove any non-alphanumeric characters
        .substring(0, length);

    return baseCode;
};