import { AppFile, FileListMode, iconListModeToSize } from "../../types/filesystem";
import TableList from "./table-list";
import IconList from "./icon-list";

interface Props {
    files: AppFile[];
    mode: FileListMode;
    className?: string;
    width: number;
    height: number;
    setPath: (newPath: string) => void;
}

export default function FileList({ files, mode, width, height, setPath, className }: Props) {
    if (mode === FileListMode.List) {
        return <TableList className={className} height={height} files={files} setPath={setPath} />;
    }

    const iconSize = iconListModeToSize(mode);

    return <IconList
        className={className}
        width={width}
        height={height}
        files={files}
        iconSize={iconSize}
        gap={50}
        setPath={setPath}
    />;
}