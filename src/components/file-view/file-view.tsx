import { useState } from "react";
import { AppFile } from "../../types/filesystem";
import { isImageExtension, getExtension, isVideoExtension } from "../../utils/files";
import ImageFile from "./image-file";
import TextFile from "./text-file";
import TooBigFile from "./too-big-file";
import useAwaitValue from "app/hooks/useAwaitValue";
import FileSystemClient from "app/services/filesystem-client";
import VideoFile from "./video-file";
import Layout from "./layout";
import HeicImageFile from "./heic-image-file";
import Rectangle from "../loading/rectangle";

interface Props {
    file: AppFile;
    className?: string;
}

const TEN_MB = 10 * 1024 * 1024;

function isTooBig(bytes: number): boolean {
    return bytes > TEN_MB;
}

export default function FileView({ file: partialFile, className }: Props) {
    const [viewLargeFile, setViewLargeFile] = useState(false);
    const { value: file, loading } = useAwaitValue(() => FileSystemClient.instance.stat(partialFile.path));

    const extension = getExtension(partialFile.name);
    const isImage = extension ? isImageExtension(extension) : false;

    if (isImage) {
        if (extension?.toLowerCase() === "heic") {
            return (
                <Layout className={className}>
                    <HeicImageFile src={partialFile.path} />
                </Layout>
            );
        }

        return (
            <Layout className={className}>
                <ImageFile
                    src={partialFile.path}
                    className="object-contain"
                    loading="lazy"
                    decoding="async"
                    alt={partialFile.path}
                />
            </Layout>
        );
    }

    const isVideo = extension ? isVideoExtension(extension) : false;

    if (isVideo) {
        return (
            <Layout className={className}>
                <VideoFile
                    src={partialFile.path}
                    controls
                    className="object-contain"
                />
            </Layout>
        );
    }

    if (loading || !file) {
        return (
            <Layout className={className}>
                <Rectangle />
            </Layout>
        );
    }

    if (!viewLargeFile && isTooBig(file.size)) {
        return (
            <div className={`${className} flex justify-center items-center p-2`}>
                <TooBigFile file={file} onConfirmView={() => setViewLargeFile(true)} />
            </div>
        );
    }

    return (
        <div className={`${className} flex overflow-auto p-2`}>
            <TextFile file={file} />
        </div>
    );
}