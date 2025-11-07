// lib/axios.ts
"use client";
import { ApiResponse } from "@/types/apiRes.t";
import { HttpError } from "@/types/httpError.t";
import axios, { AxiosError, AxiosResponse } from "axios";

// 한 파일에서 응답 형식이나 에러처리 등을 관리
// 추후 토큰 관리가 필요

/* axios 객체 설정 */
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,    // .env에 정의된 baseURL
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    timeout: 15000,
});

// 공통 응답/에러 처리
api.interceptors.response.use(
    // status가 200대라면 res로 판별, 응답 바디를 응답한다.
    (res: AxiosResponse<ApiResponse | unknown>) => {
        const p = res.data as any;
        return p;
    },

    // status가 200대가 아니라면 err로 판별, statusCode, message, 있다면 errorCode를 던진다.
    (err: AxiosError<ApiResponse>) => {
        const statusCode = err.response?.status ?? 0; // HTTP status
        const payload = err.response?.data;

        throw new HttpError({
            statusCode: statusCode,
            message: payload?.message ?? err.message ?? "Request error",
            errorCode: payload?.errorCode,
            url: err.config?.url,
            method: err.config?.method,
            raw: payload ?? err,
        });
    }
);

export default api;
