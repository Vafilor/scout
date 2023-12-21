import Rectangle from "./rectangle";

interface Props {
    width?: number | string;
    height?: number | string;
    count: number;
    gap: number;
    className?: string;
}

export function RectangleList({ width, height, count, gap, className }: Props) {
    return (
        <div className={"flex flex-col" + (className || "")} style={{ gap, width }}>
            {(new Array(count).fill(0)).map((_, index) => (
                <Rectangle key={index} width={width} height={height} />
            ))}
        </div>
    );
}