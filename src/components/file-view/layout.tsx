interface Props {
    className?: string;
    children?: React.ReactNode;
}

export default function Layout({ children, className }: Props) {
    return (
        <div className={`${className} bg-black flex justify-center overflow-auto`}>
            {children}
        </div>
    );
}