import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Settings } from "../types";

interface Props {
  settings: Settings;
  onSave: (s: Settings) => void;
  onBack: () => void;
}

export function SettingsPanel({ settings, onSave, onBack }: Props) {
  const [text, setText] = useState(settings.max_text_length.toString());
  const [img, setImg] = useState(settings.max_image_size_mb.toString());
  const [file, setFile] = useState(settings.max_file_size_mb.toString());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave({
      max_text_length: parseInt(text) || 10000,
      max_image_size_mb: parseInt(img) || 10,
      max_file_size_mb: parseInt(file) || 50,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-2 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-sm font-medium text-zinc-300 tracking-wide">
          Settings
        </h1>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 py-3 space-y-4 overflow-y-auto scrollbar-thin">
        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">
            Max text length (characters)
          </label>
          <input
            type="number"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-9 px-3 bg-white/5 rounded-lg text-sm text-zinc-200
                       outline-none ring-0 focus:bg-white/8 transition-colors
                       [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                       [&::-webkit-inner-spin-button]:appearance-none"
          />
          <p className="text-[11px] text-zinc-600 mt-1">
            Longer text will be truncated automatically
          </p>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">
            Max image size (MB)
          </label>
          <input
            type="number"
            value={img}
            onChange={(e) => setImg(e.target.value)}
            className="w-full h-9 px-3 bg-white/5 rounded-lg text-sm text-zinc-200
                       outline-none ring-0 focus:bg-white/8 transition-colors
                       [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                       [&::-webkit-inner-spin-button]:appearance-none"
          />
          <p className="text-[11px] text-zinc-600 mt-1">
            Larger images won&apos;t be stored
          </p>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">
            Max file size (MB)
          </label>
          <input
            type="number"
            value={file}
            onChange={(e) => setFile(e.target.value)}
            className="w-full h-9 px-3 bg-white/5 rounded-lg text-sm text-zinc-200
                       outline-none ring-0 focus:bg-white/8 transition-colors
                       [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                       [&::-webkit-inner-spin-button]:appearance-none"
          />
          <p className="text-[11px] text-zinc-600 mt-1">
            Larger files won&apos;t be stored (path only)
          </p>
        </div>

        <button
          onClick={handleSave}
          className={`w-full h-9 rounded-lg text-sm font-medium transition-colors ${
            saved
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-white/10 text-zinc-200 hover:bg-white/15"
          }`}
        >
          {saved ? "Saved" : "Save Settings"}
        </button>
      </div>
    </motion.div>
  );
}
