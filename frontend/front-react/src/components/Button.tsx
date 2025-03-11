import Link from 'next/link';
import { IButton } from './Interface';


const Button: React.FC<IButton> = ({ href, children, className, type = 'button', onClick }) => {
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
