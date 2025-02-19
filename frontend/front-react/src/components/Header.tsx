// 'use client';

// import React from 'react';
// import Button from '@/components/Button';
// import LogoutButton from './LogoutButton';
// import { useAuth } from '@/context/AuthContext';

// export default function Header() {
//   const { isAuthenticated, loading } = useAuth();

//   return (
//     <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-4xl font-bold text-white animate-pulse flex-grow text-center">
//           CAM📸GRU
//         </h1>
//         {loading ? (
//           <p className="text-white">Chargement...</p>
//         ) : isAuthenticated ? (
//           <LogoutButton />
//         ) : (
//           <div className="flex space-x-4">
//             <Button href="/signup" className="bg-blue-500 hover:bg-blue-600 text-white">
//               Sign Up
//             </Button>
//             <Button href="/signin" className="bg-green-500 hover:bg-green-600 text-white">
//               Sign In
//             </Button>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }

'use client';

import React from 'react';
import Button from '@/components/Button';
import LogoutButton from './LogoutButton';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white animate-pulse flex-grow text-center">
          CAM📸GRU
        </h1>
        {loading ? (
          <p className="text-white">Chargement...</p> // Affiche le texte "Chargement..." pendant le chargement des données d'authentification
        ) : isAuthenticated ? (
          <LogoutButton /> // Affiche le bouton de déconnexion si l'utilisateur est authentifié
        ) : (
          <div className="flex space-x-4">
            <Button href="/signup" className="bg-blue-500 hover:bg-blue-600 text-white">
              Sign Up
            </Button>
            <Button href="/signin" className="bg-green-500 hover:bg-green-600 text-white">
              Sign In
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
