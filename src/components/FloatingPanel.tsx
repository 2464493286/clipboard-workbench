import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Settings, Trash2, Pin, PinOff } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { HistoryItem } from "./HistoryItem";
import type { ClipboardItem } from "../types";

interface Props {
  items: ClipboardItem[];
  onCopy: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onDelete: (id: number) => void;
  onClearHistory: () => void;
  onOpenSettings: () => void;
}

export function FloatingPanel({
  items,
  onCopy,
  onToggleFavorite,
  onDelete,
  onClearHistory,
  onOpenSettings,
}: Props) {
  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  const filtered = useMemo(() => {
    let list = showFavorites ? items.filter((i) => i.is_favorite) : items;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.content.toLowerCase().includes(q));
    }
    return list;
  }, [items, search, showFavorites]);

  const favoriteCount = items.filter((i) => i.is_favorite).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-sm font-medium text-zinc-300 tracking-wide">
          Clipboard
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`p-1.5 rounded-lg transition-colors ${
              showFavorites
                ? "text-yellow-400 bg-yellow-400/10"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            }`}
            title="Show favorites"
          >
            {showFavorites ? (
              <Pin className="w-3.5 h-3.5" />
            ) : (
              <PinOff className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={onClearHistory}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-colors"
            title="Clear history"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="shrink-0 px-4 pb-2">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Stats */}
      <div className="shrink-0 px-4 pb-1 flex items-center gap-3 text-[11px] text-zinc-600">
        <span>{items.length} items</span>
        {favoriteCount > 0 && (
          <span className="text-yellow-500/70">{favoriteCount} pinned</span>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600">
            <p className="text-sm">
              {search ? "No matches" : "Clipboard is empty"}
            </p>
            <p className="text-xs mt-1">
              {search ? "Try a different search" : "Copy something to start"}
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
                onCopy={onCopy}
                onToggleFavorite={onToggleFavorite}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
