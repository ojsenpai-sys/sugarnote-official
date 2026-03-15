"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import {
  Bold, Italic, Strikethrough,
  Link as LinkIcon, Image as ImageIcon,
  List, ListOrdered, Undo, Redo, Loader2,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Mutable ref so async callbacks always access the live editor instance
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);
  const supabase = createClient();

  /** Upload a File to the news-images bucket and insert its URL into the editor. */
  const uploadAndInsert = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error } = await supabase.storage
        .from('news-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (error) {
        alert('アップロードに失敗しました: ' + error.message);
        return;
      }

      const { data } = supabase.storage.from('news-images').getPublicUrl(fileName);
      editorRef.current?.chain().focus().setImage({ src: data.publicUrl }).run();
    } finally {
      setUploading(false);
    }
  }, [supabase]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false }),
      TextStyle,
      Color,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[300px] p-4 text-slate-800',
      },
      /** Drag & drop image files onto the editor */
      handleDrop: (_view, event, _slice, moved) => {
        if (moved || !event.dataTransfer?.files?.length) return false;
        const file = event.dataTransfer.files[0];
        if (!file.type.startsWith('image/')) return false;
        event.preventDefault();
        uploadAndInsert(file);
        return true;
      },
      /** Paste image from clipboard */
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (!file) continue;
            event.preventDefault();
            uploadAndInsert(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  // Keep editorRef up-to-date for use inside async callbacks
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Re-sync content when an external value change occurs (e.g. switching articles)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      setTimeout(() => {
        if (editor.getHTML() !== value) {
          editor.commands.setContent(value);
        }
      });
    }
  }, [value, editor]);

  if (!editor) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAndInsert(file);
    e.target.value = ''; // Allow re-selecting the same file
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const MenuButton = ({
    onClick, isActive = false, disabled = false, icon: Icon,
  }: { onClick: () => void; isActive?: boolean; disabled?: boolean; icon: React.ElementType }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors ${
        isActive ? 'bg-pink-100 text-pink-600' : 'text-slate-600 hover:bg-slate-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} />
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} />
        <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={Strikethrough} />
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} />
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} />
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <MenuButton onClick={setLink} isActive={editor.isActive('link')} icon={LinkIcon} />

        {/* Image upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title={uploading ? 'アップロード中...' : '画像をアップロード（またはドラッグ＆ドロップ）'}
          className={`p-2 rounded-lg transition-colors ${
            uploading
              ? 'opacity-60 cursor-not-allowed text-pink-500'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {uploading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <ImageIcon className="w-4 h-4" />}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="w-px h-6 bg-slate-300 mx-1" />
        <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Undo} />
        <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Redo} />
      </div>

      {/* Upload progress bar */}
      {uploading && (
        <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 border-b border-pink-100 text-sm font-medium text-pink-600">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          アップロード中...
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
