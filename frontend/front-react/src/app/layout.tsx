import './globals.css';
import { Metadata } from 'next';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'CAMAGRU',
  description: 'Une application de partage de photos stylisées',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
