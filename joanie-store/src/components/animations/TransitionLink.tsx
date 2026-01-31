'use client';

import React from 'react';
import Link from 'next/link';
import { useTransition } from './TransitionContext';

interface TransitionLinkProps extends Omit<React.ComponentProps<typeof Link>, 'onClick'> {
  children: React.ReactNode;
}

export default function TransitionLink({ href, children, ...props }: TransitionLinkProps) {
  const { transitionTo, isTransitioning } = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isTransitioning) {
      transitionTo(href.toString());
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
