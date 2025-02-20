// 'use client';

// import React, { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// import Button from '@/components/Button';
// import LogoutButton from './LogoutButton';
// import { useAuth } from '@/context/AuthContext';


// export default function Header() {
//   const { isAuthenticated } = useAuth();
//   const router = useRouter();

//   // 🚀 Redirection automatique si l'utilisateur NON authentifié
//   useEffect(() => {
//     if (!isAuthenticated) {
//       console.log('🌱 [ Header ] redirect to [ Home ] (auth: false !)');
//       router.replace('/');
//     }
//   }, [isAuthenticated, router]);


//   return (
//     <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-4xl font-bold text-white animate-pulse flex-grow text-center">
//           CAM📸GRU
//         </h1>
//         {isAuthenticated ? (
//           <div className="flex space-x-4">
//             <Button href="/myPage" className="bg-blue-500 hover:bg-blue-600 text-white">
//               My Page
//             </Button>
//             <Button href="/theGallery" className="bg-blue-500 hover:bg-blue-600 text-white">
//               The Galerie
//             </Button>
//             <Button href="/photoBooth" className="bg-blue-500 hover:bg-blue-600 text-white">
//               Photo Booth
//             </Button>
//             <LogoutButton />
//           </div>
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

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button';
import LogoutButton from './LogoutButton';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // 🚀 Redirection automatique si l'utilisateur NON authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('🌱 [ Header ] redirect to [ Home ] (auth: false !)');
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  return (
    <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white animate-pulse flex-grow text-center">
          CAM📸GRU
        </h1>
        {isAuthenticated ? (
          <div className="flex space-x-4">
            <Button
              href="/settings"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 px-6 transition-all duration-200"
            >
              My Page
            </Button>
            <Button
              href="/theGallery"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 px-6 transition-all duration-200"
            >
              The Galerie
            </Button>
            <Button
              href="/photoBooth"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 px-6 transition-all duration-200"
            >
              Photo Booth
            </Button>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex space-x-4">
            <Button
              href="/signup"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 px-6 transition-all duration-200"
            >
              Sign Up
            </Button>
            <Button
              href="/signin"
              className="bg-green-500 hover:bg-green-600 text-white rounded-full py-2 px-6 transition-all duration-200"
            >
              Sign In
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
