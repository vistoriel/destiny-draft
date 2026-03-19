import { IdentityProvider } from '@/components/draft/IdentityContext';
import { decodeUserType } from '@/lib/keys';
import { getDraftToken } from '@/lib/session';

interface PageLayoutProps {
  params: Promise<{ draftId: string }>;
  children: React.ReactNode;
}

export default async function PageLayout({ params, children }: PageLayoutProps) {
  const { draftId } = await params;

  // Get user's token and determine if they're a master
  const token = await getDraftToken(draftId);
  const userType = decodeUserType(token);

  return (
    <main className="relative w-209 mx-auto mt-4 py-12 shadow-lg border border-stone-200 flex flex-col">
      <IdentityProvider userType={userType} token={token ?? undefined}>
        {children}
      </IdentityProvider>
    </main>
  );
}
