/**
 * Public zone layout — the approved marketing site + intake forms.
 * No authentication. Header/footer are ported here in Phase 1.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex min-h-screen flex-col">{children}</div>;
}
