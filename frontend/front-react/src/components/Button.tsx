import Link from 'next/link';

interface ButtonProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ href, children, className, type = 'button', onClick }) => {
  if (href) {
    return (
      <Link href={href} className={`font-bold py-2 px-4 rounded transition duration-300 ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={`font-bold py-2 px-4 rounded transition duration-300 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
