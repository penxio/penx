'use client';

import AppShell from '@/components/AppShell';
import { ClientOnly } from '@penx/components/ClientOnly';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../../components/AppShell'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Page() {
  return (
    <ClientOnly>
      <div>
        <div className="text-red-400">Home</div>
      </div>
      <App />
    </ClientOnly>
  );
}
