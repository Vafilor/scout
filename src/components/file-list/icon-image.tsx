import useAwaitValue from "app/hooks/useAwaitValue";
import FileSystemClient from "app/services/filesystem-client";
import ImageFile from "../file-view/image-file";
import Rectangle from "../loading/rectangle";

type Props = Omit<
    React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    "src" | "width" | "height"> & { src: string, width: number, height: number }

export default function IconImage({ src, width, height, ...otherProps }: Props) {
    const { value: cachedImagePath, loading, error } = useAwaitValue(() => FileSystemClient.instance.getImageIconPath(src, width, height));

    if (loading) {
        return <Rectangle width={width} height={height} />
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