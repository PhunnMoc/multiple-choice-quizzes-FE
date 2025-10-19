'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { HomePage } from '@/components/pages/HomePage';
import { AuthGuard } from '@/components/auth/AuthGuard';

function MainContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        <HomePage />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AuthGuard>
      <MainContent />
    </AuthGuard>
  );
}
