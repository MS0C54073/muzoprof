'use client';

import Image from 'next/image';
import { getGoogleDriveImageUrl, getGoogleDriveViewUrl } from '@/lib/google-drive-image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface GoogleDriveImageProps {
  fileId: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  highRes?: boolean;
}

export function GoogleDriveImage({
  fileId,
  alt,
  className,
  sizes = '100vw',
  priority = false,
  highRes = false,
}: GoogleDriveImageProps) {
  const [src, setSrc] = useState(
    highRes ? getGoogleDriveViewUrl(fileId) : getGoogleDriveImageUrl(fileId)
  );

  const handleError = () => {
    const fallback = highRes
      ? getGoogleDriveImageUrl(fileId, 2400)
      : getGoogleDriveViewUrl(fileId);
    if (src !== fallback) {
      setSrc(fallback);
    }
  };

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      priority={priority}
      sizes={sizes}
      className={cn(className)}
      onError={handleError}
    />
  );
}
