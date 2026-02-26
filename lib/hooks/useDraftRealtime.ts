import { useEffect, useRef } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function useDraftRealtime(
  client: SupabaseClient<Database>,
  draftId: string,
  onUpdate: (draft: Database['public']['Tables']['drafts']['Row']) => void
): void {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const onUpdateRef = useRef(onUpdate);

  // Keep the ref updated without causing re-subscriptions
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    console.log(`Subscribing to realtime channel.`);
    // Set up the subscription
    const channel = client
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'drafts',
          filter: `id=eq.${draftId}`,
        },
        (payload) => {
          // Call the callback with the new draft data
          console.log('Received realtime payload:', payload);
          onUpdateRef.current(payload.new as Database['public']['Tables']['drafts']['Row']);
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        client.removeChannel(channelRef.current);
      }
    };
  }, [client, draftId]);
}
