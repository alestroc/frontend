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
      className="fixed inset-0 flex items-center justify-center bg-slate-900/60 z-100"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-2xl p-6 w-100 max-w-[90%] text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-3 text-slate-900">{title}</h3>
        <div className="text-sm mb-5 text-slate-700">{message}</div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "..." : confirmLabel}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-md border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
