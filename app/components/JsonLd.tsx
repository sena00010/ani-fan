"use client";

import { useEffect } from 'react';

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Structured Data (JSON-LD) için client component
 * Bu bileşen sayfa içinde yapılandırılmış veri eklemek için kullanılır
 */
export default function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    // JSON-LD script elementi oluştur
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    
    if (existingScript) {
      // Varolan JSON-LD script'ini güncelle
      existingScript.textContent = JSON.stringify(data);
    } else {
      // Yeni bir JSON-LD script elementi oluştur
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    }
    
    // Cleanup
    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data]);
  
  // Bu component görünür bir şey render etmez
  return null;
} 