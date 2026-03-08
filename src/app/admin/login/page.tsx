"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin");
      router.refresh(); // Server components update
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">{siteConfig.name} 管理画面</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-500 rounded-xl text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">メールアドレス</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">パスワード</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
}
