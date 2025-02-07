'use client';

import { Zip } from '@/app/page';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function Zips({ zips }: { zips: Zip[] }) {
  if (zips.length === 0) {
    return (
      <p className='text-center text-gray-500'>
        No Zips created yet. Click "Create Zip" to get started!
      </p>
    );
  }

  return (
    <div className='w-full'>
      {zips.map((zip) => (
        <Card key={zip.id}>
          <CardHeader>
            <CardTitle>{zip.name}</CardTitle>
            <CardDescription>{zip.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              <strong>App URL:</strong>{' '}
              <a href={zip.appUrl} target='_blank' rel='noopener noreferrer'>
                {zip.appUrl}
              </a>
            </p>
            <div className='mt-4'>
              <h3 className='text-lg font-semibold mb-2'>
                Generated Landing Page:
              </h3>
              <div className='border rounded p-4 bg-gray-50'>
                <div
                  className='whitespace-pre-wrap'
                  dangerouslySetInnerHTML={{
                    __html: zip.landingPage,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
