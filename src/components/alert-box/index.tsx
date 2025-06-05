import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

type AlertBoxProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
};

export default function AlertBox({ isOpen, message, onClose }: AlertBoxProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="alertdialog"
          aria-modal="true"
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4 text-red-600">{message}</h2>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
