'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

export function useVoterId() {
  const [voterId, setVoterId] = useState<string>('');

  useEffect(() => {
    // Check for existing voter ID in cookie
    let id = Cookies.get('voterId');
    
    if (!id) {
      // Generate new voter ID
      id = uuidv4();
      Cookies.set('voterId', id, { expires: 365 });
    }
    
    setVoterId(id);
  }, []);

  return voterId;
}