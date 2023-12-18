import { AppFile } from "app/types/filesystem";
import { humanizeSize } from "app/utils/files";

interface Props {
    file: Required<AppFile>;
    onConfirmView: () => void;
}

export default function TooBigFile({ file, onConfirmView }: Props) {
    return (
        <div className="p-2 flex flex-col items-center gap-2">
            <p className="text-xl">File is large ({humanizeSize(file.size)}), are you sure you want to view it?</p>
            <button type="button" className="p-2 border rounded bg-blue-400 hover:bg-blue-600" onClick={() => onConfirmView()}>View file</button>
        </div>
    );
}