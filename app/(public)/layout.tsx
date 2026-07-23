import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

/**
 * Public zone layout — the approved marketing site + intake forms.
 * No authentication. Header (with tubelight nav) and Footer wrap every page.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative antialiased selection:bg-accent selection:text-white overflow-x-hidden">
      <Header />
      <main className="flex-1 flex flex-col items-center">{children}</main>
      <Footer />
    </div>
  );
}
