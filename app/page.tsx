'use client';

import { useState, useEffect } from 'react';
import { Zips } from '@/components/zips';
import { CreateZipButton } from '@/components/create-zip-button';
import { v4 as uuidv4 } from 'uuid';
import type { GenerateLandingPageResponse } from '@/lib/openai';
import { saveZip, getZips } from '@/lib/supabase/client';
export interface Zip {
  id: string;
  name: string;
  description: string;
  app_url: string;
  landing_page_html: string;
}
export default function DashboardPage() {
  const [zips, setZips] = useState<Zip[]>([]);

  const handleZipCreated = async (landingPage: GenerateLandingPageResponse) => {
    const newZip = {
      id: uuidv4(),
      name: landingPage.name,
      description: landingPage.description,
      app_url: landingPage.app_url,
      landing_page_html: landingPage.landing_page_html,
    };
    // Save to supabase
    const { data, error } = await saveZip({
      id: newZip.id,
      name: newZip.name,
      description: newZip.description,
      app_url: newZip.app_url,
      landing_page_html: newZip.landing_page_html,
    });
    if (error) {
      console.error('Error saving to supabase', error);
    }
    if (data) {
      console.log('Zip saved to supabase', data);
      setZips((prevZips) => [data, ...prevZips]);
    }
  };

  useEffect(() => {
    const fetchZips = async () => {
      const data = await getZips();
      console.log('data', data);
      if (data) {
        setZips(data);
      }
    };
    fetchZips();
  }, []);

  return (
    <div className='container mx-auto p-4'>
      <header className='flex justify-between items-center mb-6'>
        <div className='flex flex-col'>
          <h1 className='text-2xl font-bold'>Zippo</h1>
          <p className='text-sm text-gray-500'>
            Create a landing page for your app in minutes
          </p>
        </div>
        <CreateZipButton onZipCreated={handleZipCreated} />
      </header>
      <Zips zips={zips} />
    </div>
  );
}
