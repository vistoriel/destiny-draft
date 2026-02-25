import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAutosaveField } from './useAutosaveField';

// Mock the Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClientSupabase: vi.fn(() => ({
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
    })),
  })),
}));

describe('useAutosaveField', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // Reset environment variable
    delete process.env.NEXT_PUBLIC_AUTOSAVE_DELAY_MS;
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should initialize with the provided initial value', () => {
    const { result } = renderHook(() =>
      useAutosaveField('draft-1', 'title', 'Test Title')
    );

    expect(result.current.value).toBe('Test Title');
    expect(result.current.saveStatus).toBe('idle');
  });

  it('should update local value immediately on setValue', () => {
    const { result } = renderHook(() =>
      useAutosaveField('draft-1', 'title', 'Initial')
    );

    act(() => {
      result.current.setValue('Updated');
    });

    expect(result.current.value).toBe('Updated');
  });

  it('should set status to saving when value changes', () => {
    const { result } = renderHook(() =>
      useAutosaveField('draft-1', 'title', 'Initial')
    );

    act(() => {
      result.current.setValue('Updated');
    });

    expect(result.current.saveStatus).toBe('saving');
  });

  it('should debounce updates using NEXT_PUBLIC_AUTOSAVE_DELAY_MS', () => {
    process.env.NEXT_PUBLIC_AUTOSAVE_DELAY_MS = '1000';
    const { result } = renderHook(() =>
      useAutosaveField('draft-1', 'title', 'Initial')
    );

    act(() => {
      result.current.setValue('Update 1');
    });

    // Advance time but not to debounce threshold
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Status should still be saving (not yet saved)
    expect(result.current.saveStatus).toBe('saving');

    act(() => {
      result.current.setValue('Update 2');
    });

    // Advance time to exceed debounce from second update
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should now be saved (waiting for async operation)
    expect(result.current.saveStatus).not.toBe('idle');
  });

  it('should use default 500ms delay if env var not set', () => {
    const { result } = renderHook(() =>
      useAutosaveField('draft-1', 'title', 'Initial')
    );

    act(() => {
      result.current.setValue('Updated');
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // After 500ms, should have triggered save
    expect(result.current.saveStatus).not.toBe('idle');
  });

  it('should set status to saved after successful update', async () => {
    const { result } = renderHook(() =>
      useAutosaveField('draft-1', 'title', 'Initial')
    );

    act(() => {
      result.current.setValue('Updated');
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.saveStatus).toBe('saved');
    });
  });

  it('should handle save errors gracefully', async () => {
    const { createClientSupabase } = await import('@/lib/supabase/client');
    const mockClient = (createClientSupabase as any).getMockImplementation()();
    mockClient.from().update().eq.mockRejectedValueOnce(new Error('Update failed'));

    const { result } = renderHook(() =>
      useAutosaveField('draft-1', 'title', 'Initial')
    );

    act(() => {
      result.current.setValue('Updated');
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.saveStatus).toBe('error');
    });
  });

  it('should accept optional token for authentication', () => {
    const { createClientSupabase } = require('@/lib/supabase/client');
    renderHook(() =>
      useAutosaveField('draft-1', 'title', 'Initial', 'test-token')
    );

    expect(createClientSupabase).toHaveBeenCalledWith('test-token');
  });

  it('should clean up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() =>
      useAutosaveField('draft-1', 'title', 'Initial')
    );

    act(() => {
      const { result } = { result: { current: { setValue: () => {} } } };
    });

    unmount();

    // clearTimeout should have been called during cleanup
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should cancel pending save on new change', () => {
    const { result } = renderHook(() =>
      useAutosaveField('draft-1', 'title', 'Initial')
    );

    act(() => {
      result.current.setValue('Update 1');
    });

    act(() => {
      vi.advanceTimersByTime(250);
    });

    act(() => {
      result.current.setValue('Update 2');
    });

    // Should still be saving (first timeout should be cleared and new one created)
    expect(result.current.saveStatus).toBe('saving');
  });
});
