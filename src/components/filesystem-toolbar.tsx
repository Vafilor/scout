import { FileListMode } from "../types/filesystem";
import ListImage from "../assets/images/list.svg";
import EyeImage from "../assets/images/eye.svg";
import EyeSlashImage from "../assets/images/eye-slash.svg";
import { forwardRef } from "react";

interface Props {
    mode: FileListMode;
    viewHiddenFiles: boolean;
    setMode: (mode: FileListMode) => void;
    setViewHiddenFiles: (view: boolean) => void;
}

// TODO this needs to be redone. Maybe add a toolbar button component?
const FilesystemToolbar = forwardRef<HTMLDivElement, Props>(
    ({ mode, viewHiddenFiles, setMode, setViewHiddenFiles }, ref) => (
        <div ref={ref} className="flex p-2 border-slate-300 border-b gap-2">
            <button type="button" className="flex items-center gap-2"
                onClick={() => setMode(mode === FileListMode.Icons ? FileListMode.List : FileListMode.Icons)}>
                <img src={ListImage} />
                <span>View</span>
            </button>
            <button type="button" className="flex items-center gap-2"
                onClick={() => setViewHiddenFiles(!viewHiddenFiles)}>
                <img src={viewHiddenFiles ? EyeImage : EyeSlashImage} />
            </button>
        </div>
    )
);

export default FilesystemToolbar;