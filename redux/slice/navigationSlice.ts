import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  pendingNavigationPath: string | null;
}

const initialState: NavigationState = {
  pendingNavigationPath: null,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setPendingNavigation: (state, action: PayloadAction<string>) => {
      console.log('notification nav being set')
      state.pendingNavigationPath = action.payload;
    },
    clearPendingNavigation: (state) => {
      state.pendingNavigationPath = null;
    },
  },
});

export const { setPendingNavigation, clearPendingNavigation } = navigationSlice.actions;
export default navigationSlice.reducer;