import { useWindowSize } from "@uidotdev/usehooks";
import List from "rc-virtual-list";
import { useMemo, useRef } from "react";
import { AppFile } from "../../types/filesystem";
import FileIcon from "../file-icon";
import { getExtension } from "../../utils/files";

interface Props {
    files: AppFile[];
    setPath: (newPath: string) => void;
}

export default function TableList({ files, setPath }: Props) {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const { height } = useWindowSize();

    const listHeight = useMemo(() => {
        if (!headerRef.current || !height) {
            return 200;
        }

        return height - headerRef.current.offsetTop - headerRef.current.offsetHeight;
    }, [height]);

    return (
        <div>
            <div ref={headerRef} className="flex px-2 border-slate-100 border-b">
                <div className="basis-[30px]"></div>
                <div>Name</div>
            </div>
            <List data={files} height={listHeight} itemHeight={30} itemKey="path">
                {file => (
                    <div key={file.path} className="flex items-center py-1 px-2 hover:bg-slate-200">
                        <div className="basis-[30px]">
                            <FileIcon isFile={file.isFile} extension={getExtension(file.name) || ""} />
                        </div>
                        <button type="button" onDoubleClick={() => setPath(file.path)}>
                            {file.name}
                        </button>
                    </div>
                )}
            </List>
        </div>
    );
}