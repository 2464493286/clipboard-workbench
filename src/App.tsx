import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { AnimatePresence } from "framer-motion";
import { FloatingPanel } from "./components/FloatingPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import type { ClipboardItem, Settings, View } from "./types";

export default function App() {
  const [view, setView] = useState<View>("history");
  const [items, setItems] = useState<ClipboardItem[]>([]);
  const [settings, setSettings] = useState<Settings>({
    max_text_length: 10000,
    max_image_size_mb: 10,
    max_file_size_mb: 50,
  });

  const loadHistory = useCallback(async () => {
    try {
      const data = await invoke<ClipboardItem[]>("get_history", {
        limit: 200,
        offset: 0,
      });
      setItems(data);
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const s = await invoke<Settings>("get_settings");
      setSettings(s);
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
  }, []);

  useEffect(() => {
    loadHistory();
    loadSettings();
  }, [loadHistory, loadSettings]);

  useEffect(() => {
    let unlisten: UnlistenFn | undefined;
    listen<ClipboardItem>("clipboard-changed", (event) => {
      setItems((prev) => [event.payload, ...prev]);
    }).then((fn) => {
      unlisten = fn;
    });

    listen<string>("navigate", (event) => {
      if (event.payload === "settings") {
        setView("settings");
      }
    }).then(() => {});

    return () => {
      unlisten?.();
    };
  }, []);

  const handleCopy = async (id: number) => {
    await invoke("copy_to_clipboard", { id });
  };

  const handleToggleFavorite = async (id: number) => {
    await invoke("toggle_favorite", { id });
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_favorite: !item.is_favorite } : item
      )
    );
  };

  const handleDelete = async (id: number) => {
    await invoke("delete_item", { id });
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = async () => {
    await invoke("clear_history");
    setItems((prev) => prev.filter((item) => item.is_favorite));
  };

  const handleSaveSettings = async (s: Settings) => {
    await invoke("update_settings", { settings: s });
    setSettings(s);
  };

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden glass">
      <AnimatePresence mode="wait">
        {view === "history" ? (
          <FloatingPanel
            key="history"
            items={items}
            onCopy={handleCopy}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
            onClearHistory={handleClearHistory}
            onOpenSettings={() => {
              loadSettings();
              setView("settings");
            }}
          />
        ) : (
          <SettingsPanel
            key="settings"
            settings={settings}
            onSave={handleSaveSettings}
            onBack={() => setView("history")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
