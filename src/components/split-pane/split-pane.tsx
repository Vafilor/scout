import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useMemo, useState } from "react";

interface Props {
    first: React.ReactNode;
    renderSecond: (width: number) => React.ReactNode;
    hideFirst?: boolean;
    hideSecond?: boolean;
    defaultWidth: number;
    minWidth: number;
    totalWidth: number;
    className?: string;
}

export default function SplitPane({
    first,
    renderSecond,
    hideFirst,
    hideSecond,
    defaultWidth,
    minWidth,
    totalWidth,
    className
}: Props) {
    const [width, setWidth] = useState(defaultWidth);
    const [mouseDown, setMouseDown] = useState(false);

    const debouncedWidth = useDebounce(width, 100);
    const secondComponent = useMemo(() => {
        // 11 is the width of the draggable bar
        return renderSecond(totalWidth - debouncedWidth - 11)
    }, [totalWidth, debouncedWidth, renderSecond]);

    useEffect(() => {
        const func = (event: MouseEvent) => {
            if (!mouseDown) {
                return;
            }

            if (event.clientX < minWidth) {
                return;
            }

            setWidth(event.clientX);
        };

        document.addEventListener("mousemove", func);

        return () => document.removeEventListener("mousemove", func);
    }, [minWidth, mouseDown, setWidth]);


    useEffect(() => {
        const func = () => setMouseDown(false);

        document.addEventListener("mouseup", func);

        return () => document.removeEventListener("mouseup", func);
    }, [setMouseDown])

    if (hideFirst) {
        return <>{renderSecond(totalWidth)}</>;
    }

    if (hideSecond) {
        return <>{first}</>;
    }

    return (
        <div className={`${className} flex`}>
            <span className="shrink-0" style={{ width }}>
                {first}
            </span>
            <div
                className="cursor-col-resize bg-slate-300 w-[11px] border-transparent border-x-[5px] bg-clip-padding shrink-0"
                onMouseDown={() => setMouseDown(true)}
            ></div>
            {secondComponent}
        </div >
    );
}