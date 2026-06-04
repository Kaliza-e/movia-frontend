import MoviaLogo from '../assets/MoviaLogo.png';

const sizes = {
  sm: 'w-20 h-20',
  md: 'w-24 h-24',
  lg: 'w-36 h-36',
};

const MoviaBrand = ({ size = 'md', className = '' }) => {
  const imageSize = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={MoviaLogo}
        alt="Movia logo"
        className={`${imageSize} object-contain flex-shrink-0`}
      />
    </div>
  );
};

export default MoviaBrand;
