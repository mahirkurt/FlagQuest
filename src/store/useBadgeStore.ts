import { create } from 'zustand';

interface BadgeToastState {
  queue: string[];
  showBadge: (badgeId: string) => void;
  dismissBadge: () => void;
}

export const useBadgeStore = create<BadgeToastState>((set) => ({
  queue: [],
  showBadge: (badgeId) => set((state) => ({ queue: [...state.queue, badgeId] })),
  dismissBadge: () => set((state) => ({ queue: state.queue.slice(1) })),
}));
