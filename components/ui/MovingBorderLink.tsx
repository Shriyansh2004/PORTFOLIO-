import Link from "next/link";

export function MovingBorderLink({
  href,
  children,
  download,
}: {
  href: string;
  children: React.ReactNode;
  download?: boolean;
}) {
  return (
    <Link
      href={href}
      download={download}
      className="group relative inline-flex overflow-hidden rounded-full p-[1.5px]"
    >
      <span
        aria-hidden
        className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg,transparent_0%,#4f46e5_30%,transparent_55%)]"
      />
      <span className="relative inline-flex items-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition group-hover:bg-indigo-500">
        {children}
      </span>
    </Link>
  );
}
