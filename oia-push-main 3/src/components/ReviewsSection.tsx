import { useState } from "react";
import { motion } from 'framer-motion';
import { Star, Instagram } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  image: string;
  verified: boolean;
  date: string;
}

const reviews: Review[] = [
  {
    id: "1",
    name: "Carlos M",
    rating: 5,
    comment: "Mano do céu, q lanche bommm! A carne veio no ponto certinho, mto top 👏🔥",
    image: "https://burgzpedidos.com/images/rv12.jpg",
    verified: true,
    date: "2024-12-10"
  },
  {
    id: "2", 
    name: "Ana Paula S",
    rating: 5,
    comment: "Certeza q foi o melhor hambúrguer q já comi, vcs são brabo demais! 👑🍔",
    image: "https://burgzpedidos.com/images/rv7.jpg",
    verified: true,
    date: "2024-12-09"
  },
  {
    id: "3",
    name: "Rodrigo L.",
    rating: 5, 
    comment: "Comi hj pela 1ª vez e já quero dnv kkkkk tá loko, q sabor!",
    image: "https://burgzpedidos.com/images/rv10.jpg",
    verified: true,
    date: "2024-12-08"
  },
  {
    id: "4",
    name: "Fernanda R",
    rating: 5,
    comment: "Pensa num hambúrguer caprichado... é esse aí! Chegou rápido e quentinho! 🔥",
    image: "https://burgzpedidos.com/images/rv1.jpg", 
    verified: true,
    date: "2024-12-07"
  },
  {
    id: "5",
    name: "Marcos P",
    rating: 5,
    comment: "O molho da casa é sem condições 🤤 queria um balde só dele kkk",
    image: "https://burgzpedidos.com/images/rv2.jpg",
    verified: true,
    date: "2024-12-06"
  },
  {
    id: "6",
    name: "Juliana C", 
    rating: 5,
    comment: "Atendimento top, lanche top, tudo top! Virei fã total! 😍",
    image: "https://burgzpedidos.com/images/rv3.jpg",
    verified: true,
    date: "2024-12-05"
  },
  {
    id: "7",
    name: "Rafael T",
    rating: 5,
    comment: "Bom, barato e entrega rápida. Não tem erro, semana que vem peço de novo!",
    image: "https://burgzpedidos.com/images/rv4.jpg",
    verified: true,
    date: "2024-12-04"
  },
  {
    id: "8",
    name: "Iana",
    rating: 5,
    comment: "Pedi pela primeira vez e todo mundo gostou, vamos pedir mais! 🍔",
    image: "https://burgzpedidos.com/images/rv5.jpg",
    verified: true,
    date: "2024-12-03"
  }
];

// Componente para o card de avaliação individual
const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="flex gap-3 sm:gap-4 pb-6 border-b border-gray-100 last:border-b-0">
      {/* Foto do Cliente - Esquerda */}
      <div className="flex-shrink-0">
        <img 
          src={review.image}
          alt={review.name}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200 hover:scale-105 transition-transform"
        />
      </div>
      
      {/* Conteúdo - Direita */}
      <div className="flex-1 min-w-0">
        {/* Header: Nome + Rating */}
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <h4 className="font-bold text-foreground text-base sm:text-lg">{review.name}</h4>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</span>
            <span className="font-bold text-sm">5,0</span>
          </div>
        </div>
        
        {/* Comentário */}
        <p className="text-foreground leading-relaxed text-sm sm:text-base">
          {review.comment}
        </p>
      </div>
    </div>
  );
};

export function ReviewsSection() {
  const [visibleReviews, setVisibleReviews] = useState(5);
  
  const showMoreReviews = () => {
    setVisibleReviews(reviews.length);
  };
  
  return (
    <div className="bg-white border-t border-border mt-8 animate-fade-in">
      <div className="px-4 py-8">
        {/* Título Principal */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            ⭐ Avaliações dos nossos clientes
          </h2>
          
          {/* Estatísticas */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-sm flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
              <span className="font-bold">5,0</span>
            </div>
            <span className="text-muted-foreground">+500 avaliações</span>
            <span className="text-green-600 font-medium">98% recomendam</span>
          </div>
        </div>
        
        {/* Lista de Avaliações */}
        <div className="max-w-2xl mx-auto space-y-6">
          {reviews.slice(0, visibleReviews).map((review, index) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
        
        {/* Botão Ver Mais */}
        {visibleReviews < reviews.length && (
          <div className="text-center mt-8">
            <button 
              onClick={showMoreReviews}
              className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-hover transition-colors"
            >
              Ver mais avaliações
            </button>
          </div>
        )}

        {/* Seção Instagram */}
        <div className="text-center mt-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            📸 Compartilhe sua experiência!
          </h3>
          <p className="text-gray-600 mb-4">
            Marque @phamellagourmet nas suas fotos e apareça no nosso Instagram!
          </p>
          <a 
            href="https://www.instagram.com/phamellagourmet/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
          >
            <Instagram className="h-5 w-5" />
            <span>Seguir no Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
} 