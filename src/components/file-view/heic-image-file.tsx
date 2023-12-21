import useAwaitValue from "app/hooks/useAwaitValue";
import FileSystemClient from "app/services/filesystem-client";
import PathClient from "app/services/path"
import { useEffect, useRef } from "react";

interface Props {
    src: string;
}

export default function HeicImageFile({ src }: Props) {
    const ref = useRef<HTMLCanvasElement | null>(null);

    const data = useAwaitValue(() => FileSystemClient.instance.getHeicFile(
        PathClient.instance.toLocalURL(src))
    );

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        if (!data.value) {
            return;
        }

        const context = ref.current.getContext('2d');
        if (!context) {
            return;
        }

        ref.current.width = data.value.width;
        ref.current.height = data.value.height;

        const imageData = new ImageData(data.value.data, data.value.width, data.value.height);

        context.putImageData(imageData, 0, 0);
    }, [data]);

    return (
        <canvas ref={ref}></canvas>
    );
}