import PathClient from "app/services/path";

export default function VideoFile(props: React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>) {
    const { src, ...otherProps } = props;

    if (!src) {
        return null;
    }

    return (
        <video
            controls
            {...otherProps}
        >
            {/* TODO type */}
            <source src={"app://" + PathClient.instance.toLocalURL(src)} />
        </video>
    );
}