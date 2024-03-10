import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

export interface CreatePathData {
    name: string;
    path: string;
}

interface Props {
    title: string;
    name?: string;
    path?: string;
    onClose: () => void;
    onSubmit: (data: CreatePathData) => void;
}

export default function NavigationPathDialog({ title, name: initialName, path: initialPath, onClose, onSubmit }: Props) {
    const [name, setName] = useState(initialName ?? "");
    const [path, setPath] = useState(initialPath ?? "");

    return (
        <Dialog.Root open={true}>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-neutral-700/80 data-[state=open]:animate-overlayShow fixed inset-0" />
                <Dialog.Content
                    onEscapeKeyDown={() => onClose()}
                    className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] focus:outline-none">
                    <Dialog.Title className="font-semibold">
                        {title}
                    </Dialog.Title>
                    <fieldset className="my-4 flex items-center gap-5">
                        <label className="text-violet11 w-[90px] text-right text-[15px]" htmlFor="name">
                            Name
                        </label>
                        <input
                            id="name"
                            className="shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            value={name}
                            onChange={(event) => setName(event.currentTarget.value)}
                        />
                    </fieldset>
                    <fieldset className="mb-4 flex items-center gap-5">
                        <label className="text-violet11 w-[90px] text-right text-[15px]" htmlFor="path">
                            Path
                        </label>
                        <input
                            id="path"
                            className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            value={path}
                            onChange={(event) => setPath(event.currentTarget.value)}
                        />
                    </fieldset>
                    <div className="mt-[25px] flex justify-end">
                        <Dialog.Close asChild>
                            <button
                                className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                                onClick={() => onSubmit({
                                    name,
                                    path
                                })}>
                                Add
                            </button>
                        </Dialog.Close>
                    </div>
                    <Dialog.Close asChild>
                        <button
                            className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                            aria-label="Close"
                            onClick={() => onClose()}
                        >
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}