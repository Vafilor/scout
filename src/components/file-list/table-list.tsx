import List from "rc-virtual-list";
import { useState } from "react";
import { AppFile } from "../../types/filesystem";
import FileIcon from "../file-icon";
import { getExtension } from "../../utils/files";

interface Props {
    files: AppFile[];
    className?: string;
    setPath: (newPath: string) => void;
    height: number;
}

export default function TableList({ files, setPath, height, className }: Props) {
    const [headerHeight, setHeaderHeight] = useState(0);
    const listHeight = height - headerHeight;

    return (
        <div className={className}>
            <div
                ref={(node) => setHeaderHeight(node?.offsetHeight || 0)}
                className="flex px-2 border-slate-100 border-b">
                <div className="basis-[30px] shrink-0"></div>
                <div>Name</div>
            </div>
            <List data={files} height={listHeight} itemHeight={30} itemKey="path">
                {file => (
                    <div key={file.path} className="flex items-center py-1 px-2 hover:bg-slate-200">
                        <div className="basis-[30px] shrink-0">
                            <FileIcon type={file.type} extension={getExtension(file.name) || ""} />
                        </div>
                        <button type="button" className="text-left" onDoubleClick={() => setPath(file.path)}>
                            {file.name}
                        </button>
                    </div>
                )}
            </List>
        </div >
    );
}