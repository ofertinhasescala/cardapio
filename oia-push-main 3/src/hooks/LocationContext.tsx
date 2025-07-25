import React, { createContext, useContext, ReactNode } from 'react';
import useUserLocation from './useUserLocation';

interface LocationContextType {
  city: string | null;
  state: string | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const locationData = useUserLocation();
  
  console.log('LocationProvider renderizado:', locationData);
  
  return (
    <LocationContext.Provider value={locationData}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  
  if (context === undefined) {
    throw new Error('useLocation deve ser usado dentro de um LocationProvider');
  }
  
  return context;
};

export default LocationContext; 