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
            className="absolute -top-2 -right-2 h-8 w-8 p-0 z-10 bg-white/90 hover:bg-white shadow-md rounded-full"
          >
            <X className="h-4 w-4" />
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
          
          {/* Botón Enterado */}
          <div className="flex justify-center">
            <Button 
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
            >
              Enterado
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
