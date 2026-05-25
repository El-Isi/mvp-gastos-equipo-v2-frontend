import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gastos de Equipo - TSO Konfío',
  description: 'App para registrar y aprobar gastos del equipo TSO de Konfío',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
