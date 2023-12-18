import FileSystemClient from "app/services/filesystem-client";
import useAwaitValue from "app/hooks/useAwaitValue";
import { AppFile } from "app/types/filesystem";

interface Props {
    file: AppFile;
}

export default function TextFile({ file }: Props) {
    const { value: content, loading } = useAwaitValue(
        () => FileSystemClient.instance.getTextFileContext(file.path)
    );

    // TODO better loading ui
    if (loading) {
        return <div>Loading</div>;
    }

    return (
        <pre>{content}</pre>
    );
}