import { Prisma } from "@prisma/client";

export type PostWithAuthor = Prisma.PostGetPayload<{ include: { author: true, image: true } }>;
export type RolesWithPermissions = Prisma.RoleGetPayload<{ include: { permissions: true } }>;

export enum NewVerificationResponses {
    INVALID_TOKEN = "Invalid token",
    TOKEN_EXPIRED = "Token expired",
    EMAIL_DOES_NOT_EXIST = "Email does not exist (newVerification)",
    EMAIL_VERIFIED = "Email already verified",
}

export enum SendCodeResponses {
    EMAIL_DOES_NOT_EXIST = "Email does not exist",
    EMAIL_ALREADY_VERIFIED = "Email already verified (sendCode)",
    CODE_SENT = "Verification code sent"
}

export enum SubscribeResponses {
    EMAIL_DOES_NOT_EXIST = "Email does not exist",
    EMAIL_NOT_VERIFIED = "Email not verified (subscribe)",
    ALREADY_SUBSCRIBED = "Already subscribed",
    SUBSCRIBED = "Subscribed",
    ERROR = "Error unsubscribing",
}

export enum UnsubscribeResponses {
    EMAIL_DOES_NOT_EXIST = "Email does not exist",
    EMAIL_NOT_VERIFIED = "Email not verified (unsubscribe)",
    ALREADY_UNSUBSCRIBED = "Already unsubscribed",
    UNSUBSCRIBED = "Unsubscribed",
    ERROR = "Error unsubscribing",
}