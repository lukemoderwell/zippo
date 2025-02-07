'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import type { GenerateLandingPageResponse, ErrorResponse } from '@/lib/openai';

interface CreateZipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onZipCreated: (landingPage: GenerateLandingPageResponse) => void;
}

export function CreateZipModal({
  isOpen,
  onClose,
  onZipCreated,
}: CreateZipModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [appUrl, setAppUrl] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('appUrl', appUrl);
    if (screenshot) {
      formData.append('screenshot', screenshot);
    }

    try {
      const response = await fetch('/api/generate-landing-page', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.error || 'Failed to generate landing page');
      }

      const data: GenerateLandingPageResponse = await response.json();
      console.log('landing page', data);

      if (!data.landing_page_html) {
        throw new Error('No landing page content received');
      }

      toast({
        title: 'Success',
        description: 'Landing page generated successfully',
      });
      onZipCreated(data);
      onClose();
    } catch (error) {
      console.error('Error generating landing page:', error);
      let errorMessage = 'Failed to generate landing page. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create New Zip</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor='appUrl'>App URL</Label>
            <Input
              id='appUrl'
              type='url'
              value={appUrl}
              onChange={(e) => setAppUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor='googleAnalyticsId'>
              Google Analytics ID (optional)
            </Label>
            <Input
              id='googleAnalyticsId'
              value={googleAnalyticsId}
              onChange={(e) => setGoogleAnalyticsId(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor='screenshot'>Screenshot</Label>
            <Input
              id='screenshot'
              type='file'
              onChange={handleFileChange}
              accept='image/*'
              ref={fileInputRef}
            />
          </div>
          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? 'Generating...' : 'Generate Landing Page'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
