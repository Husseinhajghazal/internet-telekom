"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNavigationGuard } from "./NavigationGuardContext";

/**
 * Drop-in replacement for Next.js <Link> that checks the navigation guard
 * before navigating. If a guard is active and dirty, navigation is blocked
 * and a confirmation dialog is shown by the NavigationGuardProvider.
 */
export default function GuardedLink({ href, children, onClick, ...props }) {
  const guard = useNavigationGuard();
  const router = useRouter();

  const handleClick = (e) => {
    // If there's no guard context, behave like a normal Link
    if (!guard) {
      onClick?.(e);
      return;
    }

    e.preventDefault();
    onClick?.(e);

    const allowed = guard.requestNavigation(href);
    if (allowed) {
      router.push(href);
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
