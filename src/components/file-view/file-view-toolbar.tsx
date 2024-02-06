interface Props {
    name: string;
}

export default function FileViewToolbar({ name }: Props) {
    return (
        <div className="text-center">{name}</div>
    );
}