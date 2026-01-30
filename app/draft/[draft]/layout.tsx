export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-209 mx-auto py-12 shadow-lg border border-stone-200 flex flex-col">
      { children }
    </main>
  );
}
