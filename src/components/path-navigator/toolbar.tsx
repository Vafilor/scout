import Breadcrumbs from "../breadcrumbs";
import ArrowLeftShortImage from "../../assets/images/arrow-left-short.svg";
import ArrowRightShortImage from "../../assets/images/arrow-right-short.svg";
import ArrowUpShortImage from "../../assets/images/arrow-up-short.svg";
import ArrowClockwiseImage from "../../assets/images/arrow-clockwise.svg";
import { canGoBack, canGoForward } from "./reducer";
import PathClient from "app/services/path";

interface Props {
    path: string;
    history: string[];
    historyIndex: number;
    className?: string;
    setPath: (newPath: string) => void;
    goUp: () => void;
    goBack: () => void;
    goFoward: () => void;
    refreshPath: () => void;
}

interface NavigationButtonProps {
    disabled?: boolean;
    onClick: () => void;
    children?: React.ReactNode;
}

function NavigationButton({ children, disabled, onClick }: NavigationButtonProps) {
    return (
        <button type="button" disabled={disabled} onClick={() => onClick()} className="disabled:opacity-30">
            {children}
        </button>
    );
}

export default function NavigationToolbar({ path, history, historyIndex, setPath, goBack, goFoward, goUp, refreshPath, className }: Props) {
    return (
        <div className="p-2 bg-slate-200 border-b border-slate-300 flex gap-2">
            <NavigationButton disabled={!canGoBack(historyIndex)} onClick={goBack}>
                <img src={ArrowLeftShortImage} className="h-[24px]" />
            </NavigationButton>
            <NavigationButton disabled={!canGoForward(history, historyIndex)} onClick={goFoward}>
                <img src={ArrowRightShortImage} className="h-[24px]" />
            </NavigationButton>
            <NavigationButton disabled={!PathClient.instance.canGoUp(path)} onClick={goUp}>
                <img src={ArrowUpShortImage} className="h-[24px]" />
            </NavigationButton>
            <NavigationButton onClick={refreshPath}>
                <img src={ArrowClockwiseImage} className="h-[18px]" />
            </NavigationButton>
            <div className="w-[1em]"></div>
            <Breadcrumbs path={path} className="bg-white p-1 pl-2 rounded grow" onClick={(event) => setPath(event.path)} />
        </div>
    );
}