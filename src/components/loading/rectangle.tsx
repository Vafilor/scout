interface Props {
    width?: number | string;
    height?: number | string;
}

export default function Rectangle({ width, height }: Props) {
    return (
        <div className="animate-pulse rounded bg-slate-200" style={{ width, height }}>
        </div>
    );
}