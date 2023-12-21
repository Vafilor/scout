import FileSystemClient from "app/services/filesystem-client";
import useAwaitValue from "app/hooks/useAwaitValue";
import { AppFile } from "app/types/filesystem";
import { RectangleList } from "../loading/rectangle-list";
import { useWindowSize } from "@uidotdev/usehooks";
import { useMemo } from "react";

interface Props {
    file: AppFile;
}

const HEIGHT = 12;
const GAP = 10;

export default function TextFile({ file }: Props) {
    const { value: content, loading } = useAwaitValue(() => FileSystemClient.instance.getTextFileContext(file.path));

    const { height: windowHeight } = useWindowSize();
    const count = useMemo(() => {
        if (windowHeight === null) {
            return 10;
        }

        // Rough calculation to make sure we have nough bars to cover the ui
        return Math.max(10, Math.floor((windowHeight - 40) / (HEIGHT + GAP)));
    }, [windowHeight]);

    if (loading) {
        return <RectangleList width="100%" height={HEIGHT} count={count} gap={GAP} />
    }

    return (
        <pre>{content}</pre>
    );
}