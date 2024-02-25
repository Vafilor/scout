interface Props {
    width?: number | string;
    height?: number | string;
    className?: string;
}

export default function Rectangle({ width, height, className }: Props) {
    return (
        <div
            className={`animate-pulse rounded bg-slate-200 ${className}`}
            style={{ width, height }}
        >
        </div>
    );
}