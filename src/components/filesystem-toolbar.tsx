import { FileListMode } from "../types/filesystem";
import ListImage from "../assets/images/list.svg";
import { forwardRef } from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CaretDownIcon, CheckIcon, DotFilledIcon, RowsIcon, TokensIcon } from "@radix-ui/react-icons";

interface Props {
    mode: FileListMode;
    viewHiddenFiles: boolean;
    setMode: (mode: FileListMode) => void;
    setViewHiddenFiles: (view: boolean) => void;
}

interface FileListModeItem {
    name: string;
    icon: React.ReactNode;
    value: FileListMode;
}

const FileListModes: FileListModeItem[] = [{
    name: "List",
    value: FileListMode.List,
    icon: <RowsIcon />
}, {
    name: "Extra Large icons",
    value: FileListMode.ExtraLargeIcons,
    icon: <TokensIcon />
}, {
    name: "Large icons",
    value: FileListMode.LargeIcons,
    icon: <TokensIcon />
}, {
    name: "Medium icons",
    value: FileListMode.MediumIcons,
    icon: <TokensIcon />
}, {
    name: "Small icons",
    value: FileListMode.SmallIcons,
    icon: <TokensIcon />
}];

// TODO this needs to be redone. Maybe add a toolbar button component?
const FilesystemToolbar = forwardRef<HTMLDivElement, Props>(
    ({ mode, viewHiddenFiles, setMode, setViewHiddenFiles }, ref) => (
        <div ref={ref} className="flex p-1 border-slate-300 border-b gap-2">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button type="button" className="flex items-center gap-1 outline-none select-none">
                        <img src={ListImage} />
                        <span>View</span>
                        <CaretDownIcon />
                    </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-[220px] border p-2 drop-shadow-md bg-slate-100 rounded" sideOffset={5}>
                        <DropdownMenu.RadioGroup value={mode} onValueChange={setMode}>
                            {FileListModes.map((item) => (
                                <DropdownMenu.RadioItem
                                    key={item.value}
                                    className="relative leading-none rounded flex items-center h-[25px] px-[5px] pl-[25px] select-none outline-none data-[highlighted]:bg-violet-200"
                                    value={item.value}
                                >
                                    <DropdownMenu.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                                        <DotFilledIcon />
                                    </DropdownMenu.ItemIndicator>
                                    <span className="w-[25px]">
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </DropdownMenu.RadioItem>
                            ))}
                        </DropdownMenu.RadioGroup>

                        <DropdownMenu.CheckboxItem
                            className="relative rounded select-none outline-none flex items-center data-[highlighted]:bg-violet-200 pl-[25px]"
                            checked={viewHiddenFiles}
                            onCheckedChange={setViewHiddenFiles}
                        >
                            <DropdownMenu.ItemIndicator
                                className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                                <CheckIcon />
                            </DropdownMenu.ItemIndicator>
                            View Hidden files
                        </DropdownMenu.CheckboxItem>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    )
);

export default FilesystemToolbar;