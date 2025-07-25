interface DayInfo {
  dayName: string;
  dayNumber: number;
  nextDay: string;
  isWeekend: boolean;
  isFriday: boolean;
}

export const generateDynamicBadges = (dayInfo: DayInfo) => {
  const { dayName, nextDay, isWeekend, isFriday } = dayInfo;
  
  return {
    combo1: {
      // Combo Crispy Bacon - Sempre enfatiza o dia atual
      badge: isWeekend 
        ? `APROVEITE ${dayName} EM DOBRO! 🔥`
        : `OFERTA ESPECIAL DE ${dayName}! 🔥`,
      urgency: isWeekend 
        ? `Promoção válida somente no ${dayName.toLowerCase()}!`
        : `Oferta válida até ${nextDay.toLowerCase()}!`
    },
    
    combo2: {
      // Combo Família - Sempre "mais vendido" mas com urgência do dia
      badge: "MAIS VENDIDO 🍔",
      urgency: isFriday 
        ? "ÚLTIMA CHANCE DA SEMANA!!"
        : `PROMOÇÃO VÁLIDA SOMENTE ${dayName}!!`,
      socialProof: isWeekend
        ? "A maioria dos clientes escolhe esse no final de semana! 🔥"
        : "A maioria dos clientes escolhe esse porque é o melhor custo-benefício! 🔥"
    },
    
    combo3: {
      // Rodízio - Adapta conforme o dia
      badge: isWeekend
        ? `RODÍZIO DE ${dayName}! 🔥`
        : `PROMOÇÃO VÁLIDA SOMENTE ${dayName} 🔥`,
      urgency: `Oferta especial de ${dayName.toLowerCase()}!`
    },
    
    combo4: {
      // Trio Smash - Promoção geral mas com urgência
      badge: "OFERTA ESPECIAL 🎯",
      urgency: isFriday 
        ? "Prepare-se para o final de semana!"
        : `Válido até ${nextDay.toLowerCase()}!`
    },
    
    combo5: {
      // Combo Solteiro - Foco na economia
      badge: isWeekend 
        ? "WEEKEND ESPECIAL 💰"
        : "SUPER ECONOMIA 💰",
      urgency: `Aproveite ${dayName.toLowerCase()}!`
    },
    
    combo6: {
      // Classic Cheddar - Foco primeira compra
      badge: "PRIMEIRA COMPRA? 50% OFF! 🎁",
      urgency: `Válido para novos clientes ${dayName.toLowerCase()}!`
    },
    
    combo7: {
      // Classic Salada - Frete grátis
      badge: "FRETE GRÁTIS ❤️",
      urgency: `Comprando ${dayName.toLowerCase()}, garanta frete grátis!`
    },
    
    combo8: {
      // Combo Porções - Gigante
      badge: isWeekend 
        ? "WEEKEND GIGANTE 🔥"
        : "COMBO GIGANTE 🔥",
      socialProof: isWeekend
        ? "Perfeito para o final de semana! 🔥"
        : "A maioria dos clientes escolhe esse porque é gigante 🔥",
      scarcity: isFriday
        ? "Últimas unidades da semana!"
        : "Apenas 1 combo(s) com esse preço especial!"
    }
  };
};

// Função para obter urgência baseada no horário atual
export const getTimeBasedUrgency = () => {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour >= 22) {
    return "⏰ ÚLTIMAS HORAS DO DIA!";
  } else if (hour >= 20) {
    return "🌙 OFERTAS NOTURNAS ATIVAS!";
  } else if (hour >= 18) {
    return "🍽️ HORA DO JANTAR - APROVEITE!";
  } else if (hour >= 12) {
    return "☀️ OFERTAS DE TARDE!";
  } else {
    return "🌅 OFERTAS MATINAIS!";
  }
}; 