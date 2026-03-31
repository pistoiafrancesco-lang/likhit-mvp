export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header o Sidebar temporanea per la dashboard */}
      <header className="px-8 py-4 border-b border-sand bg-parchment">
        <h1 className="font-serif text-xl font-bold text-ink">Dashboard Likhit</h1>
      </header>
      <main className="p-8 max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  );
}
