'use client';

import { Zip } from '@/app/page';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function Zips({ zips }: { zips: Zip[] }) {
  const router = useRouter();

  return (
    <>
      {zips.length === 0 ? (
        <div className='h-[100vh] flex justify-center items-center'>
          <p className='text-center text-gray-500'>
            No Zips created yet. Click "Create Zip" to get started!
          </p>
        </div>
      ) : (
        <div className='w-full grid grid-cols-2 lg:grid-cols-2 gap-4'>
          {zips.map((zip) => (
            <Card 
              key={zip.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                console.log('Navigating to zip:', zip.id);
                router.push(`/zips/${zip.id}`);
              }}
            >
              <CardHeader>
                <CardTitle>{zip.name}</CardTitle>
                <CardDescription>{zip.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>App URL:</strong>{' '}
                  <a
                    href={zip.app_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={(e) => e.stopPropagation()}
                  >
                    {zip.app_url}
                  </a>
                </p>
                {/* <div className='mt-4'>
                  <h3 className='text-lg font-semibold mb-2'>
                    Generated Landing Page:
                  </h3>
                  <div className='border rounded p-4 bg-gray-50'>
                    <div
                      className='border border-gray-100 rounded-md'
                      dangerouslySetInnerHTML={{
                        __html: zip.landing_page_html,
                      }}
                    />
                  </div>
                </div> */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
