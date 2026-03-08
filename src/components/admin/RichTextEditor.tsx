"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Bold, Italic, Strikethrough, Link as LinkIcon, Image as ImageIcon, List, ListOrdered, Undo, Redo } from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true }),
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
        class: "focus:outline-none min-h-[300px] p-4 text-slate-800",
      },
    },
  });

  // Re-sync content if value changes externally (e.g. when editing a different item)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // Small timeout to prevent cyclic updates
      setTimeout(() => {
         if (editor.getHTML() !== value) {
             editor.commands.setContent(value);
         }
      });
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('画像のURLを入力してください');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const MenuButton = ({ onClick, isActive = false, disabled = false, icon: Icon }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors ${
        isActive ? 'bg-primary-100 text-primary-600' : 'text-slate-600 hover:bg-slate-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} />
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} />
        <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={Strikethrough} />
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} />
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} />
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <MenuButton onClick={setLink} isActive={editor.isActive('link')} icon={LinkIcon} />
        <MenuButton onClick={addImage} icon={ImageIcon} />
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Undo} />
        <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Redo} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
