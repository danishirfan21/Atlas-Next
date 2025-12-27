import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Typed Redux Hooks
 * 
 * Why custom hooks?
 * - Type safety: TypeScript knows exact shape of state
 * - Autocomplete: IDE suggests available state slices
 * - Less boilerplate: No need to type annotate on every use
 * 
 * Usage:
 * const dispatch = useAppDispatch();
 * const currentPage = useAppSelector((state) => state.ui.currentPage);
 */

// Typed useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Typed useSelector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
