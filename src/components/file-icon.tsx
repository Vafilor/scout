import FileImage from "../assets/images/file-earmark.svg";
import FolderImage from "../assets/images/folder.svg";

interface Props {
    className?: string;
    isFile: boolean; // If false, then its a folder.
    extension: string;
    width?: string | number;
    height?: string | number;
}

export default function FileIcon({ isFile, className, width, height, extension }: Props) {
    const imgSrc = isFile ? FileImage : FolderImage;

    return <img width={width} height={height} className={className} src={imgSrc} style={{ height }} />
}