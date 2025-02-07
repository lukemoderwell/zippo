'use client';

import { useState } from 'react';
import { Zips } from '@/components/zips';
import { CreateZipButton } from '@/components/create-zip-button';
import { v4 as uuidv4 } from 'uuid';
import type { GenerateLandingPageResponse } from '@/lib/openai';

export interface Zip {
  id: string;
  name: string;
  description: string;
  appUrl: string;
  landingPage: string;
}
export default function DashboardPage() {
  const [zips, setZips] = useState<Zip[]>([]);

  const handleZipCreated = (landingPage: GenerateLandingPageResponse) => {
    const newZip = {
      id: uuidv4(),
      name: landingPage.name,
      description: landingPage.description,
      appUrl: landingPage.app_url,
      landingPage: landingPage.landing_page_html,
    };
    setZips((prevZips) => [newZip, ...prevZips]);
  };

  return (
    <div className='container mx-auto p-4'>
      <header className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Zippo Dashboard</h1>
        <CreateZipButton onZipCreated={handleZipCreated} />
      </header>
      <Zips zips={zips} />
    </div>
  );
}
