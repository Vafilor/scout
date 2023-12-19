import useAwaitValue from "app/hooks/useAwaitValue";
import FileSystemClient from "app/services/filesystem-client";
import ImageFile from "../file-view/image-file";

type Props = Omit<
    React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    "src" | "width" | "height"> & { src: string, width: number, height: number }

export default function IconImage({ src, width, height, ...otherProps }: Props) {
    const { value: cachedImagePath, loading, error } = useAwaitValue(() => FileSystemClient.instance.getImageIconPath(src, width, height));

    // TODO loading UI
    if (loading) {
        return <div>loading</div>;
    }

    if (error) {
        return <div>Error</div>;
    }

    return <ImageFile
        src={cachedImagePath}
        width={width}
        height={height}
        {...otherProps}
    />

}