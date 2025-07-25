import { useState, useEffect } from 'react';

interface DayInfo {
  dayName: string;
  dayNumber: number; // 0 = Domingo, 1 = Segunda, etc.
  nextDay: string;
  isWeekend: boolean;
  isFriday: boolean;
}

export const useDynamicDay = (): DayInfo => {
  const [dayInfo, setDayInfo] = useState<DayInfo>(() => getCurrentDayInfo());

  function getCurrentDayInfo(): DayInfo {
    const now = new Date();
    const dayNumber = now.getDay();
    
    const dayNames = [
      'DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 
      'QUINTA', 'SEXTA', 'SÁBADO'
    ];
    
    const nextDayNames = [
      'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 
      'SEXTA', 'SÁBADO', 'DOMINGO'
    ];
    
    return {
      dayName: dayNames[dayNumber],
      dayNumber,
      nextDay: nextDayNames[dayNumber],
      isWeekend: dayNumber === 0 || dayNumber === 6, // Domingo ou Sábado
      isFriday: dayNumber === 5
    };
  }

  useEffect(() => {
    // Atualizar a cada hora para garantir que mudanças de dia sejam capturadas
    const interval = setInterval(() => {
      setDayInfo(getCurrentDayInfo());
    }, 60000 * 60); // A cada hora

    return () => clearInterval(interval);
  }, []);

  return dayInfo;
}; 