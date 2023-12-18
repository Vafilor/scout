import { AppFile, FileListMode } from "../../types/filesystem";
import TableList from "./table-list";
import IconList from "./icon-list";

interface Props {
    files: AppFile[];
    mode: FileListMode;
    setPath: (newPath: string) => void;
}

export default function FileList({ files, mode, setPath }: Props) {
    if (mode === FileListMode.Icons) {
        return <IconList files={files} iconSize={128} gap={50} setPath={setPath} />
    }

    return <TableList files={files} setPath={setPath} />
}