import PathClient from "app/services/path";

export default function ImageFile(props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
    const { src, ...otherProps } = props;

    if (!src) {
        return null;
    }

    return (
        <img
            src={"app://" + PathClient.instance.toLocalURL(src)}
            {...otherProps}
        />
    );
}