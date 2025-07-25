import {useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import {AppDispatch, RootState} from "../redux/store.ts";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
