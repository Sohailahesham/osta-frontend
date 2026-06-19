"use client";

import {useEffect, useState} from "react";

interface DecodedToken {
    sub: string; // userId
    email: string;
    role: "client" | "technician" | "admin";
    iat: number;
    exp: number;
}

interface AuthState {
    userId: string | null;
    role: DecodedToken["role"] | null;
    token: string | null;
}

function decodeToken(token: string): DecodedToken | null {
    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload)) as DecodedToken;
        return decoded;
    } catch {
        return null;
    }
}

/**
 * بيقرا الـ access_token من localStorage ويفك تشفيره (decode)
 * عشان يجيب userId و role من غير ما نعمل request للباك اند.
 * ⚠️ ده decode بس مش verify — التحقق الحقيقي بيحصل في الباك اند.
 */
export function useAuth(): AuthState {
    const [auth, setAuth] = useState<AuthState>({
        userId: null,
        role: null,
        token: null,
    });

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const decoded = decodeToken(token);
        if (!decoded) return;

        setAuth({
            userId: decoded.sub,
            role: decoded.role,
            token,
        });
    }, []);

    return auth;
}
