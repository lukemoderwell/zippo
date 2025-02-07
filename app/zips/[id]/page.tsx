import { getZip } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ZipDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const zip = await getZip(params.id);

  if (!zip) {
    notFound();
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <Link href='/'>
          <Button variant='outline'>← Back to Zips</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{zip.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-semibold mb-2'>Description</h3>
              <p className='text-gray-700'>{zip.description}</p>
            </div>

            <div>
              <h3 className='text-lg font-semibold mb-2'>App URL</h3>
              <a
                href={zip.app_url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 hover:underline'
              >
                {zip.app_url}
              </a>
            </div>

            <div>
              <h3 className='text-lg font-semibold mb-2'>
                Generated Landing Page
              </h3>
              <div className='border rounded-lg p-4 bg-gray-50 overflow-auto'>
                <div
                  className='border border-gray-100 rounded-md'
                  dangerouslySetInnerHTML={{
                    __html: zip.landing_page_html,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
