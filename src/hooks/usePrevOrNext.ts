'use client'

import { useRouter } from "next/navigation";

export const UsePrevPage = () => {
    const router = useRouter();
    const prevPage = () => router.back();
    return prevPage;
};

export const useNextPage = (path: string) => {
    const router = useRouter();
    const nextPage = () => router.push(path);
    return nextPage;
}