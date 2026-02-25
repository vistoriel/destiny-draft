import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDraftRealtime } from './useDraftRealtime';

// Mock the Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClientSupabase: vi.fn(() => ({
    channel: vi.fn(),
    removeChannel: vi.fn(),
  })),
}));

describe('useDraftRealtime', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set up a realtime subscription on mount', () => {
    const { createClientSupabase } = require('@/lib/supabase/client');
    const mockChannel = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockResolvedValue({ status: 'SUBSCRIBED' }),
    };
    const mockClient = (createClientSupabase as any).getMockImplementation()();
    mockClient.channel.mockReturnValue(mockChannel);

    const onUpdate = vi.fn();
    renderHook(() => useDraftRealtime('draft-1', onUpdate));

    expect(mockClient.channel).toHaveBeenCalledWith('draft-changes');
    expect(mockChannel.on).toHaveBeenCalled();
  });

  it('should configure the correct event filter', () => {
    const { createClientSupabase } = require('@/lib/supabase/client');
    const mockChannel = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockResolvedValue({ status: 'SUBSCRIBED' }),
    };
    const mockClient = (createClientSupabase as any).getMockImplementation()();
    mockClient.channel.mockReturnValue(mockChannel);

    const onUpdate = vi.fn();
    renderHook(() => useDraftRealtime('draft-1', onUpdate));

    const onCall = mockChannel.on.mock.calls[0];
    expect(onCall[0]).toBe('postgres_changes');
    expect(onCall[1]).toEqual({
      event: 'UPDATE',
      schema: 'public',
      table: 'drafts',
      filter: 'id=eq.draft-1',
    });
  });

  it('should call onUpdate callback when receiving UPDATE events', () => {
    const { createClientSupabase } = require('@/lib/supabase/client');
    let updateCallback: any;
    const mockChannel = {
      on: vi.fn((event, filter, callback) => {
        updateCallback = callback;
        return mockChannel;
      }),
      subscribe: vi.fn().mockResolvedValue({ status: 'SUBSCRIBED' }),
    };
    const mockClient = (createClientSupabase as any).getMockImplementation()();
    mockClient.channel.mockReturnValue(mockChannel);

    const onUpdate = vi.fn();
    renderHook(() => useDraftRealtime('draft-1', onUpdate));

    const newDraftData = { id: 'draft-1', title: 'Updated Title' };
    act(() => {
      updateCallback({ new: newDraftData });
    });

    expect(onUpdate).toHaveBeenCalledWith(newDraftData);
  });

  it('should clean up subscription on unmount', () => {
    const { createClientSupabase } = require('lib/supabase/client');
    const mockChannel = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockResolvedValue({ status: 'SUBSCRIBED' }),
    };
    const mockClient = (createClientSupabase as any).getMockImplementation()();
    mockClient.channel.mockReturnValue(mockChannel);

    const onUpdate = vi.fn();
    const { unmount } = renderHook(() => useDraftRealtime('draft-1', onUpdate));

    unmount();

    expect(mockClient.removeChannel).toHaveBeenCalledWith(mockChannel);
  });

  it('should accept optional token for authentication', () => {
    const { createClientSupabase } = require('lib/supabase/client');
    const mockChannel = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockResolvedValue({ status: 'SUBSCRIBED' }),
    };
    const mockClient = (createClientSupabase as any).getMockImplementation()();
    mockClient.channel.mockReturnValue(mockChannel);

    const onUpdate = vi.fn();
    renderHook(() => useDraftRealtime('draft-1', onUpdate, 'test-token'));

    expect(createClientSupabase).toHaveBeenCalledWith('test-token');
  });

  it('should handle multiple draft IDs correctly', () => {
    const { createClientSupabase } = require('lib/supabase/client');
    const mockChannel1 = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockResolvedValue({ status: 'SUBSCRIBED' }),
    };
    const mockChannel2 = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockResolvedValue({ status: 'SUBSCRIBED' }),
    };
    const mockClient = (createClientSupabase as any)
      .getMockImplementation()();
    mockClient.channel.mockReturnValueOnce(mockChannel1).mockReturnValueOnce(mockChannel2);

    const onUpdate1 = vi.fn();
    const onUpdate2 = vi.fn();

    renderHook(() => useDraftRealtime('draft-1', onUpdate1));
    renderHook(() => useDraftRealtime('draft-2', onUpdate2));

    // Each should have its own filter
    expect(mockChannel1.on.mock.calls[0][1].filter).toBe('id=eq.draft-1');
    expect(mockChannel2.on.mock.calls[0][1].filter).toBe('id=eq.draft-2');
  });

  it('should not fail if subscription setup has errors', () => {
    const { createClientSupabase } = require('lib/supabase/client');
    const mockChannel = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockRejectedValue(new Error('Subscribe failed')),
    };
    const mockClient = (createClientSupabase as any).getMockImplementation()();
    mockClient.channel.mockReturnValue(mockChannel);

    const onUpdate = vi.fn();
    expect(() => {
      renderHook(() => useDraftRealtime('draft-1', onUpdate));
    }).not.toThrow();
  });
});
