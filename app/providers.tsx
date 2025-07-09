"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeLoginUser } from "./store/slices/usersAuthSlice";
import type { AppDispatch } from "./store";

function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(initializeLoginUser());
  }, [dispatch]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}
