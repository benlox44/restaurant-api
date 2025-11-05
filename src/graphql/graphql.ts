
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface User {
    id: number;
    name: string;
    email: string;
    isLocked: boolean;
    isEmailConfirmed: boolean;
    createdAt: string;
    oldEmail?: Nullable<string>;
    newEmail?: Nullable<string>;
    emailChangedAt?: Nullable<string>;
}

export interface AuthResponse {
    accessToken: string;
}

export interface MessageResponse {
    message: string;
}

export interface RevertEmailResponse {
    resetToken: string;
}

export interface IQuery {
    myProfile(): User | Promise<User>;
}

export interface IMutation {
    register(email: string, password: string, name: string): MessageResponse | Promise<MessageResponse>;
    login(email: string, password: string): AuthResponse | Promise<AuthResponse>;
    requestPasswordReset(email: string): MessageResponse | Promise<MessageResponse>;
    resetPassword(token: string, newPassword: string): MessageResponse | Promise<MessageResponse>;
    resetPasswordAfterRevert(token: string, newPassword: string): MessageResponse | Promise<MessageResponse>;
    updatePassword(currentPassword: string, newPassword: string): MessageResponse | Promise<MessageResponse>;
    requestUnlock(email: string): MessageResponse | Promise<MessageResponse>;
    confirmEmail(token: string): MessageResponse | Promise<MessageResponse>;
    confirmEmailUpdate(token: string): MessageResponse | Promise<MessageResponse>;
    revertEmail(token: string): RevertEmailResponse | Promise<RevertEmailResponse>;
    unlockAccount(token: string): MessageResponse | Promise<MessageResponse>;
    updateProfile(name: string): MessageResponse | Promise<MessageResponse>;
    requestEmailUpdate(password: string, newEmail: string): MessageResponse | Promise<MessageResponse>;
    deleteAccount(password: string): MessageResponse | Promise<MessageResponse>;
}

type Nullable<T> = T | null;
