export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative w-209 mx-auto mt-4 py-12 shadow-lg border border-stone-200 flex flex-col">
      { children }
    </main>
  );
}
