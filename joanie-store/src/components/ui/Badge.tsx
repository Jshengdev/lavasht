interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sale' | 'new';
}

export default function Badge({ children, variant = 'sale' }: BadgeProps) {
  const bg = variant === 'sale' ? 'bg-[#DB4444]' : 'bg-[#00FF66]';

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium text-white rounded ${bg}`}>
      {children}
    </span>
  );
}
