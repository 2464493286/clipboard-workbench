export interface ClipboardItem {
  id: number;
  content_type: "text" | "image" | "file";
  content: string;
  size: number;
  is_favorite: boolean;
  created_at: string;
}

export interface Settings {
  max_text_length: number;
  max_image_size_mb: number;
  max_file_size_mb: number;
}

export type View = "history" | "settings";
