import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const AdminModal = ({ open, onClose, title, children }: AdminModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-atlantis-bg-main/70 backdrop-blur-sm z-[200]"
              />
            </Dialog.Overlay>

            {/* Panel */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[210] w-full max-w-lg bg-atlantis-white border border-atlantis-secondary/20 p-8 shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-atlantis-secondary/20">
                  <Dialog.Title className="font-syne text-h5 font-bold text-atlantis-bg-main uppercase tracking-tight">
                    {title}
                  </Dialog.Title>
                  <Dialog.Close
                    onClick={onClose}
                    className="font-plex text-[10px] font-black text-atlantis-secondary hover:text-atlantis-error uppercase tracking-widest transition-colors"
                  >
                    ✕ Cerrar
                  </Dialog.Close>
                </div>

                {/* Contenido del formulario */}
                <div>{children}</div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
