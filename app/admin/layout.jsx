export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-full bg-background">{children}</div>;
}
