import store from './index';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

export interface socailAuthType {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  type: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare type Anything = any;
export declare type StringMap = Record<string, string>;

export declare type ApiResolveStatus =
  | 'idle'
  | 'loading'
  | 'fulfilled'
  | 'rejected';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// use useAppDispatch & useAppSelector instead of useDispatch & useSelector throughout the application
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
