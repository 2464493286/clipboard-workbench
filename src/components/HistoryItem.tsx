import { motion } from "framer-motion";
import { Copy, Star, Trash2, FileText } from "lucide-react";
import type { ClipboardItem } from "../types";

interface Props {
  item: ClipboardItem;
  onCopy: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onDelete: (id: number) => void;
}

function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  return `${Math.floor(hr / 24)}d`;
}

export function HistoryItem({ item, onCopy, onToggleFavorite, onDelete }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.15 }}
      className="group flex items-start gap-2 px-3 py-2 rounded-lg
                 hover:bg-white/[0.04] transition-colors cursor-pointer"
      onClick={() => onCopy(item.id)}
    >
      <div className="mt-0.5 shrink-0">
        <FileText className="w-4 h-4 text-zinc-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-200 truncate leading-5">
          {item.content.slice(0, 120)}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-zinc-500">{timeAgo(item.created_at)}</span>
          <span className="text-[11px] text-zinc-600">
            {item.size > 1024
              ? `${(item.size / 1024).toFixed(1)} KB`
              : `${item.size} B`}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className={`p-1 rounded transition-colors ${
            item.is_favorite
              ? "text-yellow-400 hover:text-yellow-300"
              : "text-zinc-600 hover:text-yellow-400"
          }`}
        >
          <Star className="w-3.5 h-3.5" fill={item.is_favorite ? "currentColor" : "none"} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy(item.id);
          }}
          className="p-1 rounded text-zinc-600 hover:text-zinc-300 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="p-1 rounded text-zinc-600 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
