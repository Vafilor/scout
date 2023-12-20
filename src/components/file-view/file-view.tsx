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
import PathClient from "app/services/path";
import HeicImageFile from "./heic-image-file";

interface Props {
    file: AppFile;
}

const TEN_MB = 10 * 1024 * 1024;

function isTooBig(bytes: number): boolean {
    return bytes > TEN_MB;
}

export default function FileView({ file: partialFile }: Props) {
    const [viewLargeFile, setViewLargeFile] = useState(false);
    const { value: file, loading } = useAwaitValue(() => FileSystemClient.instance.stat(partialFile.path));

    const extension = getExtension(partialFile.name);
    const isImage = extension ? isImageExtension(extension) : false;

    if (isImage) {
        if (extension?.toLowerCase() === "heic") {
            return (
                <Layout>
                    <HeicImageFile src={partialFile.path} />
                </Layout>
            );
        }

        return (
            <Layout>
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
            <Layout>
                <VideoFile
                    src={partialFile.path}
                    controls
                    className="object-contain"
                />
            </Layout>
        );
    }

    // TODO better loading UI
    if (loading || !file) {
        return <div>Loading</div>;
    }

    if (!viewLargeFile && isTooBig(file.size)) {
        return (
            <div className="flex justify-center items-center p-2">
                <TooBigFile file={file} onConfirmView={() => setViewLargeFile(true)} />
            </div>
        );
    }

    return (
        <div className="flex overflow-auto p-2">
            <TextFile file={file} />
        </div>
    );
}