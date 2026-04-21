import type { ReactNode } from "react";

interface ConfirmDialogProps {
  title?: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  title = "Conferma",
  message,
  confirmLabel = "Conferma",
  cancelLabel = "Annulla",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-100"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-5 w-100 max-w-[90%] text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <div className="text-sm mb-5">{message}</div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "..." : confirmLabel}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
