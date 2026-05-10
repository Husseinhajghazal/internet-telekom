"use client";

import { createContext, useContext, useRef, useState, useCallback } from "react";
import AdminConfirmDialog from "./AdminConfirmDialog";

const NavigationGuardContext = createContext(null);

/**
 * Provider that enables pages to register a navigation guard.
 * When a guard is active and returns `true`, a confirmation dialog is shown
 * before allowing navigation (e.g. unsaved changes warning).
 */
export function NavigationGuardProvider({ children }) {
  const guardRef = useRef(null);
  const pendingHrefRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  /** Register a guard function. Returns an unregister cleanup. */
  const registerGuard = useCallback((guardFn) => {
    guardRef.current = guardFn;
    return () => {
      guardRef.current = null;
    };
  }, []);

  /**
   * Called by GuardedLink / nav components before navigating.
   * If a guard is active and returns true (dirty), shows the dialog
   * and returns false (don't navigate yet). Otherwise returns true.
   */
  const requestNavigation = useCallback((href) => {
    if (guardRef.current && guardRef.current()) {
      pendingHrefRef.current = href;
      setDialogOpen(true);
      return false; // blocked
    }
    return true; // allowed
  }, []);

  const handleConfirmLeave = useCallback(() => {
    setDialogOpen(false);
    const href = pendingHrefRef.current;
    pendingHrefRef.current = null;
    // Temporarily remove guard so the programmatic navigation isn't blocked again
    const savedGuard = guardRef.current;
    guardRef.current = null;
    // Navigate after dialog closes
    if (href && typeof window !== "undefined") {
      window.location.href = href;
    }
    // Restore guard in case navigation was somehow cancelled
    guardRef.current = savedGuard;
  }, []);

  const handleCancelLeave = useCallback(() => {
    setDialogOpen(false);
    pendingHrefRef.current = null;
  }, []);

  return (
    <NavigationGuardContext.Provider value={{ registerGuard, requestNavigation }}>
      {children}
      <AdminConfirmDialog
        open={dialogOpen}
        kind="reject"
        title="مغادرة دون حفظ؟"
        message="لديك تعديلات غير محفوظة. هل تريد المغادرة دون حفظ التغييرات؟"
        confirmLabel="مغادرة"
        cancelLabel="البقاء"
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
      />
    </NavigationGuardContext.Provider>
  );
}

export function useNavigationGuard() {
  return useContext(NavigationGuardContext);
}
