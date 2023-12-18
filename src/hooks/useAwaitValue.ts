import { useCallback, useEffect, useRef, useState } from "react";

export default function useAwaitValue<T>(func: () => Promise<T>) {
    const [value, setValue] = useState<T | undefined>(undefined);
    const [error, setError] = useState<unknown | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const funcRef = useRef(func);

    const getValue = useCallback(async () => {
        setLoading(true);

        try {
            const value = await funcRef.current()
            setValue(value);
        } catch (err: unknown) {
            setError(err);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        getValue();
    }, [getValue]);

    return {
        loading,
        value,
        error,
        reload: getValue
    };
}