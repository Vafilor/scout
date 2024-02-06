import { useCallback, useMemo } from "react";
import DisplayImage from "../assets/images/display.svg";
import ChevronRightImage from "../assets/images/chevron-right.svg";
import PathClient from "app/services/path";

export interface PartClickedEvent {
    part: string;
    path: string;
}

interface Props {
    path: string; // delimited by '/'
    className?: string;
    onClick?: (event: PartClickedEvent) => void;
}


function BreadcrumbPart({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) {
    return (
        <>
            <img src={ChevronRightImage} className="font-bold" />
            <button
                className="text-nowrap hover:bg-slate-200 rounded px-[4px]"
                onClick={() => onClick?.()}>
                {children}
            </button>
        </>
    );
}

export default function Breadcrumbs({ path, className, onClick }: Props) {
    // Filter out "/" to ensure we don't have a "/" part, which is root and separately handled below as a button
    // This only happens on Windows at the moment (as far as I know)
    const parts = useMemo(() => PathClient.instance.split(path).filter(part => part !== "/"), [path]);

    const onPartClicked = useCallback((part: string, index: number) => {
        onClick?.({
            part,
            path: PathClient.instance.partialPath(parts, index)
        })
    }, [parts, onClick]);

    return (
        <div className={"flex gap-2 " + className}>
            <button type="button" className="hover:bg-slate-200 rounded px-[4px] shrink-0" onClick={() => onPartClicked("/", -1)}>
                <img src={DisplayImage} />
            </button>
            {parts.map((part, index) => {
                const partial = PathClient.instance.partialPath(parts, index)
                return (
                    <BreadcrumbPart
                        key={partial}
                        onClick={() => onPartClicked(part, index)}>
                        {part}
                    </BreadcrumbPart>
                );
            })}
            {/* Ensure height is consistent even when there are no parts */}
            <span>&nbsp;</span>
        </div>
    );
}