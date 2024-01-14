import { useWindowSize } from "@uidotdev/usehooks";
import List from "rc-virtual-list";
import { useMemo, useRef } from "react";
import { AppFile } from "../../types/filesystem";
import FileIcon from "../file-icon";
import { isImageExtension, getExtension, canCreateImageIcon } from "../../utils/files";
import { partitionList } from "../../utils/collections";
import ImageFile from "../file-view/image-file";
import IconImage from "./icon-image";

interface IconItemProps {
    file: AppFile;
    width: number;
    height: number;
    setPath: (newPath: string) => void;
}

function FileIconWrapper({ file, children, width, height, setPath }: IconItemProps & { children: React.ReactNode }) {
    return (
        <div
            className="flex flex-col gap-1 items-center"
            style={{ width, height }}
            onDoubleClick={() => setPath(file.path)}>
            {children}
            <p className="text-sm truncate text-center" style={{ width }}>{file.name}</p>
        </div>
    );
}

function IconItem({ file, width, height, setPath }: IconItemProps) {
    const extension = getExtension(file.name) || "";
    const canCreateIcon = canCreateImageIcon(extension);

    const childHeight = height - 24;

    if (canCreateIcon) {
        return (
            <FileIconWrapper file={file} width={width} height={height} setPath={setPath}>
                <IconImage
                    width={width}
                    height={childHeight - 8}
                    src={file.path}
                    className="border border-black p-[4px] object-contain"
                    style={{ height: childHeight - 4 }}
                />
            </FileIconWrapper>
        );
    }

    return (
        <FileIconWrapper file={file} width={width} height={height} setPath={setPath}>
            <FileIcon isFile={file.isFile} width={width} height={childHeight} extension={extension} />
        </FileIconWrapper>
    );
}

function BlankIconItem({ width }: { width: number }) {
    return <div style={{ width }}></div>;
}

interface Props {
    gap?: number;
    iconSize: number;
    files: AppFile[];
    setPath: (newPath: string) => void;
}

export default function IconList({ files, gap: initialGap, iconSize, setPath }: Props) {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const { width, height } = useWindowSize();

    const gap = useMemo(() => initialGap ? initialGap : 4, [initialGap]);

    const listHeight = useMemo(() => {
        if (!headerRef.current || !height) {
            return 200;
        }

        return height - headerRef.current.offsetTop - headerRef.current.offsetHeight;
    }, [height]);

    const itemsPerLine = useMemo(() => {
        if (!width) {
            return 0;
        }

        return Math.floor(width / (iconSize + gap));
    }, [gap, width, iconSize]);

    const lineItems = useMemo(() => {
        if (itemsPerLine === 0) {
            return [];
        }

        const result = partitionList<AppFile | null>(files, itemsPerLine).map((partition, index) => ({
            key: partition.length && partition[0] ? partition[0].path : index,
            files: partition
        }));

        if (result.length) {
            const lastFiles = result[result.length - 1].files;
            while (lastFiles.length < itemsPerLine) {
                lastFiles.push(null);
            }
        }

        return result;
    }, [files, itemsPerLine]);

    return (
        <div>
            <div ref={headerRef}></div>
            <List data={lineItems} height={listHeight} itemHeight={iconSize + gap} itemKey="key">
                {item => (
                    <div className="flex items-center justify-around py-2 px-2">
                        {item.files.map((file, index) => (
                            file ?
                                <IconItem
                                    key={file.path}
                                    file={file}
                                    width={iconSize}
                                    height={iconSize}
                                    setPath={setPath}
                                /> :
                                <BlankIconItem key={index} width={iconSize} />
                        ))}
                    </div>
                )}
            </List>
        </div>
    );
}