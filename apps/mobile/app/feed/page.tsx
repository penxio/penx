'use client';

import { ClientOnly } from '@penx/components/ClientOnly';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../../components/AppShell'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Page() {
  return (
    <ClientOnly>
      <App />
    </ClientOnly>
  );
}
