'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, AlertCircle } from 'lucide-react';

interface DownloadConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ebookTitle: string;
  pointsCost: number;
  userPoints: number;
  loading?: boolean;
}

export function DownloadConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  ebookTitle,
  pointsCost,
  userPoints,
  loading = false,
}: DownloadConfirmationModalProps) {
  const hasEnoughPoints = userPoints >= pointsCost;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border border-black">
        <DialogHeader className="border-b border-black pb-4">
          <DialogTitle className="text-xl text-black">Confirmar Download</DialogTitle>
          <DialogDescription className="text-black">Você está prestes a baixar um ebook</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="text-center">
            <h4 className="font-medium text-black mb-2">{ebookTitle}</h4>
            <p className="text-sm text-black">
              Este download irá consumir{' '}
              <strong>
                {pointsCost} ponto{pointsCost !== 1 ? 's' : ''}
              </strong>{' '}
              do seu saldo.
            </p>
          </div>

          <div className="bg-white border border-black rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-black">Seus pontos atuais:</span>
              <span className="font-medium text-black">
                {userPoints} ponto{userPoints !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-black">Pontos após download:</span>
              <span className="font-medium text-black">
                {userPoints - pointsCost} ponto{userPoints - pointsCost !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {!hasEnoughPoints && (
            <div className="bg-white border border-black rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-black" />
                <span className="text-sm text-black">
                  Você precisa de mais {pointsCost - userPoints} ponto{pointsCost - userPoints !== 1 ? 's' : ''} para
                  baixar este ebook
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-black text-black hover:bg-gray-100"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              disabled={!hasEnoughPoints || loading}
              className="flex-1 bg-black text-white hover:bg-gray-800"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Baixando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Confirmar Download
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
