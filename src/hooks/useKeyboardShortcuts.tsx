import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onToday: () => void;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  onNextDay: () => void;
  onPrevDay: () => void;
}

export const useKeyboardShortcuts = ({
  onToday,
  onNextMonth,
  onPrevMonth,
  onNextDay,
  onPrevDay,
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 't':
          event.preventDefault();
          onToday();
          break;
        case 'm':
          if (event.shiftKey) {
            event.preventDefault();
            onPrevMonth();
          } else {
            event.preventDefault();
            onNextMonth();
          }
          break;
        case 'd':
          if (event.shiftKey) {
            event.preventDefault();
            onPrevDay();
          } else {
            event.preventDefault();
            onNextDay();
          }
          break;
        case 'n':
          event.preventDefault();
          onNextMonth();
          break;
        case 'p':
          event.preventDefault();
          onPrevMonth();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onToday, onNextMonth, onPrevMonth, onNextDay, onPrevDay]);
};