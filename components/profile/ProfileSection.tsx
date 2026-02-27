"use client";

export default function ProfileSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="mb-6 mt-3">
            <div className="mb-2 text-l font-bold">{title}</div>
            <div className="text-justify pr-10">{children}</div>
        </section>
    );
}