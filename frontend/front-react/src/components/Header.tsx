import LogoutButton from './LogoutButton'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white animate-pulse flex-grow text-center">
          CAM📸GRU
        </h1>
        <LogoutButton />
      </div>
    </header>
  );
}
