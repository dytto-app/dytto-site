'use client';
// Navigation compatibility shim — maps react-router-dom to Next.js equivalents

// Link wrapper that accepts both `to` (React Router) and `href` (Next.js)
import NextLink from 'next/link';
import React from 'react';

type LinkProps = Omit<React.ComponentPropsWithoutRef<typeof NextLink>, 'href'> & {
  href?: string;
  to?: string;
};

export function Link({ to, href, ...props }: LinkProps) {
  return React.createElement(NextLink, { href: (href || to || '/') as string, ...props });
}
export { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';

// useLocation — maps to Next.js pathname + search
import { usePathname, useSearchParams } from 'next/navigation';

export function useLocation() {
  const pathname = usePathname();
  // searchParams not available server-side, safe client-side usage
  return {
    pathname: pathname ?? '/',
    search: '',
    hash: '',
    state: null,
  };
}

// useNavigate — returns a function that calls router.push
import { useRouter } from 'next/navigation';

export function useNavigate() {
  const router = useRouter();
  return (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') return; // history.go not supported
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
}
