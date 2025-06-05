import { motion, AnimatePresence } from "framer-motion";

type ConfirmationBoxProps = {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationBox({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmationBoxProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <h2 className="text-lg font-semibold mb-4 text-center">{message}</h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white"
              >
                Não
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-green-500 text-black"
              >
                Sim
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
