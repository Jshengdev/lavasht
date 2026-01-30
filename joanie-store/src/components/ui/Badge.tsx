interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sale' | 'new';
}

export default function Badge({ children, variant = 'sale' }: BadgeProps) {
  const variantClasses = {
    sale: 'bg-[#DB4444] text-white',
    new: 'bg-[#00FF66] text-white',
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-[8px] py-[4px] text-[12px] font-medium rounded-[4px] ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
