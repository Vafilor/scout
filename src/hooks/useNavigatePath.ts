import { useCallback } from "react";
import { NavigateOptions, useNavigate } from "react-router-dom"

export interface NavigatePathFunction {
    (to: string, options?: NavigateOptions): void;
}

export default function useNavigatePath(): NavigatePathFunction {
    const navigate = useNavigate();
    const navigatePath = useCallback((path: string, options?: NavigateOptions) => {
        navigate('/' + encodeURIComponent(path), options);
    }, [navigate]);

    return navigatePath;
}