import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Clock, CreditCard, Instagram } from "lucide-react";

interface InfoModalProps {
  children: React.ReactNode;
}

export function InfoModal({ children }: InfoModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[380px] px-5 py-5">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-700">Informações</DialogTitle>
          <DialogDescription className="text-center">
            Confira nossos horários de funcionamento e informações de contato
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-3 px-2">
          {/* Seção de Horários */}
          <div className="space-y-3">
            <div className="bg-amber-300 text-center py-1.5 px-4 rounded-full w-fit mx-auto">
              <h3 className="font-semibold text-gray-700 text-sm">HORÁRIO DE FUNCIONAMENTO</h3>
            </div>
            <div className="space-y-2 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">DOMINGO</span>
                <span className="bg-gray-100 px-4 py-1 rounded-full text-sm">18:00 - 22:30</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">SEGUNDA</span>
                <span className="bg-gray-100 px-4 py-1 rounded-full text-sm">18:00 - 23:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">TERÇA</span>
                <span className="bg-gray-100 px-4 py-1 rounded-full text-sm">18:00 - 23:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">QUARTA</span>
                <span className="bg-gray-100 px-4 py-1 rounded-full text-sm">18:00 - 23:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">QUINTA</span>
                <span className="bg-gray-100 px-4 py-1 rounded-full text-sm">18:00 - 23:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">SEXTA</span>
                <span className="bg-gray-100 px-4 py-1 rounded-full text-sm">18:00 - 23:15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">SÁBADO</span>
                <span className="bg-gray-100 px-4 py-1 rounded-full text-sm">18:00 - 23:15</span>
              </div>
            </div>
          </div>

          <div className="border-t border-dotted border-gray-200 pt-3"></div>

          {/* Seção de Pagamento */}
          <div className="space-y-3">
            <div className="bg-amber-300 text-center py-1.5 px-4 rounded-full w-fit mx-auto">
              <h3 className="font-semibold text-gray-700 text-sm">FORMAS DE PAGAMENTO</h3>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-center">
                <span className="font-medium text-gray-700">PIX</span>
              </div>
            </div>
          </div>

          <div className="border-t border-dotted border-gray-200 pt-3"></div>

          {/* Seção de Redes Sociais */}
          <div className="space-y-3">
            <div className="bg-amber-300 text-center py-1.5 px-4 rounded-full w-fit mx-auto">
              <h3 className="font-semibold text-gray-700 text-sm">SIGA-NOS NO INSTAGRAM</h3>
            </div>
            <div className="mt-3">
              <a 
                href="https://www.instagram.com/phamellagourmet/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <Instagram className="h-4 w-4" />
                <span>@phamellagourmet</span>
              </a>
              <p className="text-center text-xs text-gray-500 mt-2">
                Veja nossas deliciosas frutas do amor e doces especiais!
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 