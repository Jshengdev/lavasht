'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

const sizes = {
  sm: { width: 20, height: 24 },
  md: { width: 28, height: 32 },
  lg: { width: 48, height: 56 },
  xl: { width: 60, height: 68 },
};

export default function Logo({ size = 'md', color = '#333333', className = '' }: LogoProps) {
  const { width, height } = sizes[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Joanie Store Logo"
    >
      {/* Top Chevron */}
      <path d="M15 5 L50 5 L85 40 L50 40 Z" fill={color} />
      {/* Bottom Chevron */}
      <path d="M15 60 L50 60 L85 95 L50 95 Z" fill={color} />
    </svg>
  );
}

// Export the path data for use in animations
export const LOGO_PATHS = {
  top: 'M15 5 L50 5 L85 40 L50 40 Z',
  bottom: 'M15 60 L50 60 L85 95 L50 95 Z',
};
