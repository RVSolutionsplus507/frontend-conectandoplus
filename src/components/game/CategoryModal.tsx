'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Image from 'next/image'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: {
    code: string
    name: string
    description: string
    color: string
    image: string
  }
}

export function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-4">
        <div className="relative">
          {/* Botón cerrar en esquina superior derecha */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute -top-2 -right-2 h-8 w-8 p-0 z-10 bg-white/90 hover:bg-white shadow-md rounded-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Cerrar información de categoría ${category.name}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
          
          {/* Imagen de la carta */}
          <div className="flex justify-center mb-4">
            <Image
              src={category.image}
              alt={`Carta ${category.name}`}
              width={350}
              height={525}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>
          
          {/* Botón Entendido */}
          <div className="flex justify-center">
            <Button
              onClick={onClose}
              className="bg-[var(--brand-blue-500)] hover:bg-[var(--brand-blue-600)] text-white px-8 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`He entendido la categoría ${category.name}`}
            >
              Entendido
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
