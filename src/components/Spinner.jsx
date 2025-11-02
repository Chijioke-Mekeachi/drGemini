export default function Spinner({ size = 'medium' }) {
  const sizeClasses = {
    small: 'h-5 w-5',
    medium: 'h-8 w-8',
    large: 'h-16 w-16',
  };

  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-brand-blue ${sizeClasses[size]}`}>
    </div>
  );
}
