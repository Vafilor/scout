interface Props {
    children?: React.ReactNode;
}

export default function Layout({ children }: Props) {
    return (
        <div className="bg-black flex justify-center overflow-auto">
            {children}
        </div>
    );
}