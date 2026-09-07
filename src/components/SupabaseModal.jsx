import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertTriangle, Copy, Terminal, Server, ShieldCheck } from 'lucide-react';
import { getStoredConfig, setStoredConfig, resetSupabaseClient, getSupabaseClient } from '../supabaseClient';

export default function SupabaseModal({ isOpen, onClose, onConfigSaved, isLiveSupabase }) {
  const stored = getStoredConfig();
  const [url, setUrl] = useState(stored.url);
  const [key, setKey] = useState(stored.key);
  const [activeTab, setActiveTab] = useState('config'); // 'config' | 'sql' | 'mcp'
  const [statusMsg, setStatusMsg] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const sqlCode = `-- ========================================================
-- 🚀 CyberBoard Supabase Database Schema
-- Supabase SQL Editor에 복사하여 붙여넣고 [Run]을 누르세요!
-- ========================================================

CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT '자유수다',
    tags TEXT[] DEFAULT '{}',
    author_name VARCHAR(100) NOT NULL DEFAULT '익명 사이버네티스트',
    author_avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    author_badge VARCHAR(50) DEFAULT 'PRO',
    author_level INT DEFAULT 1,
    cover_image TEXT,
    likes_count INT DEFAULT 0,
    views_count INT DEFAULT 1,
    reactions JSONB DEFAULT '{"fire": 0, "rocket": 0, "bulb": 0, "heart": 0, "party": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL DEFAULT '익명 사이버네티스트',
    author_avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    author_badge VARCHAR(50) DEFAULT 'MEMBER',
    content TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update posts" ON public.posts FOR UPDATE USING (true);

CREATE POLICY "Allow public read comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update comments" ON public.comments FOR UPDATE USING (true);`;

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      setStatusMsg({ type: 'error', text: 'Supabase URL과 Anon Key를 모두 입력해주세요.' });
      return;
    }

    setIsTesting(true);
    setStatusMsg(null);

    setStoredConfig(url, key);
    resetSupabaseClient();
    const client = getSupabaseClient();

    if (!client) {
      setIsTesting(false);
      setStatusMsg({ type: 'error', text: 'Supabase 클라이언트 생성 실패. URL 및 Key 형식을 확인하세요.' });
      return;
    }

    try {
      // Test fetching posts
      const { data, error } = await client.from('posts').select('count', { count: 'exact', head: true });
      setIsTesting(false);

      if (error) {
        setStatusMsg({
          type: 'warning',
          text: `Supabase 연결 성공! 단, posts 테이블을 찾을 수 없습니다. [SQL 스키마] 탭의 SQL을 Supabase에 적용해주세요. (${error.message})`
        });
      } else {
        setStatusMsg({
          type: 'success',
          text: '🎉 Supabase 데이터베이스와 성공적으로 연결되었습니다!'
        });
      }
      onConfigSaved(true);
    } catch (err) {
      setIsTesting(false);
      setStatusMsg({
        type: 'error',
        text: `연결 테스트 중 오류 발생: ${err.message}`
      });
    }
  };

  const handleResetToDemo = () => {
    setStoredConfig('', '');
    resetSupabaseClient();
    setUrl('');
    setKey('');
    setStatusMsg({ type: 'success', text: '내장 데모(Demo) 모드로 전환되었습니다.' });
    onConfigSaved(false);
  };

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card animate-fadeIn" style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        border: '1px solid var(--cyan-glow)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Database size={26} color="var(--cyan)" />
            <div>
              <h2 className="text-gradient-cyan" style={{ fontSize: '1.35rem', fontWeight: '800' }}>
                Supabase 연동 & CLI/MCP 설정
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                실제 Supabase 데이터베이스 연결 및 CLI / MCP 사용 안내
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
          <button
            onClick={() => setActiveTab('config')}
            style={{
              background: activeTab === 'config' ? 'var(--cyan)' : 'transparent',
              color: activeTab === 'config' ? '#070814' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Server size={16} /> API Key 연동
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            style={{
              background: activeTab === 'sql' ? 'var(--cyan)' : 'transparent',
              color: activeTab === 'sql' ? '#070814' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Copy size={16} /> SQL 스키마 복사
          </button>
          <button
            onClick={() => setActiveTab('mcp')}
            style={{
              background: activeTab === 'mcp' ? 'var(--purple)' : 'transparent',
              color: activeTab === 'mcp' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Terminal size={16} /> CLI & MCP 사용법
          </button>
        </div>

        {/* TAB 1: CONFIG */}
        {activeTab === 'config' && (
          <form onSubmit={handleTestAndSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'rgba(0, 242, 254, 0.05)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '0.82rem',
              color: 'var(--text-main)'
            }}>
              💡 <strong>Supabase 프로젝트 정보 입력 방법:</strong><br />
              Supabase Dashboard &gt; Project Settings &gt; API 메뉴에서 <code>Project URL</code>과 <code>anon public key</code>를 복사하여 아래에 붙여넣으세요.
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--cyan)', marginBottom: '6px' }}>
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--cyan)', marginBottom: '6px' }}>
                Supabase Anon API Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            {statusMsg && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : statusMsg.type === 'warning' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 0, 127, 0.15)',
                border: `1px solid ${statusMsg.type === 'success' ? '#10b981' : statusMsg.type === 'warning' ? '#ffd700' : '#ff007f'}`,
                color: statusMsg.type === 'success' ? '#10b981' : statusMsg.type === 'warning' ? '#ffd700' : '#ff66b2'
              }}>
                {statusMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button
                type="submit"
                disabled={isTesting}
                className="btn-neon-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {isTesting ? '연결 확인 중...' : '연결 테스트 및 저장'}
              </button>
              <button
                type="button"
                onClick={handleResetToDemo}
                className="btn-glass"
                style={{ color: '#ff66b2', borderColor: 'rgba(255,0,127,0.3)' }}
              >
                데모 모드로 전환
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SQL SCHEMA */}
        {activeTab === 'sql' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Supabase 대시보드의 <strong>SQL Editor</strong>에 이 스키마를 실행하여 테이블을 생성하세요.
              </p>
              <button
                onClick={copySql}
                className="btn-neon-primary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <Copy size={14} />
                <span>{copiedSql ? '복사 완료! ✅' : 'SQL 복사하기'}</span>
              </button>
            </div>

            <pre style={{
              background: '#04060f',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              color: '#00f2fe',
              fontSize: '0.78rem',
              maxHeight: '320px',
              overflowY: 'auto',
              fontFamily: 'monospace'
            }}>
              {sqlCode}
            </pre>
          </div>
        )}

        {/* TAB 3: CLI & MCP GUIDE */}
        {activeTab === 'mcp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem' }}>
            
            {/* Supabase CLI */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
              <h3 style={{ color: 'var(--cyan)', fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Terminal size={18} /> 1. Supabase CLI 설치 및 명령어 (Windows)
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>
                PowerShell에서 Scoop 또는 npx를 통해 설치할 수 있습니다:
              </p>
              <pre style={{ background: '#04060f', padding: '10px 14px', borderRadius: '8px', color: '#ffd700', fontSize: '0.78rem' }}>
{`# 1. Scoop 설치 (권장)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# 2. npx 사용 시
npx supabase login
npx supabase init
npx supabase db push`}
              </pre>
            </div>

            {/* Supabase MCP */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(157, 78, 221, 0.3)', borderRadius: '12px', padding: '16px' }}>
              <h3 style={{ color: 'var(--purple)', fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldCheck size={18} /> 2. Supabase MCP (Model Context Protocol) 설정
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>
                Cursor, Claude, Antigravity AI 도구에서 Supabase DB를 직접 조작할 수 있는 MCP 설정 방법:
              </p>
              <pre style={{ background: '#04060f', padding: '10px 14px', borderRadius: '8px', color: '#c77dff', fontSize: '0.78rem' }}>
{`# Claude Code CLI 등록
claude mcp add --transport http supabase https://mcp.supabase.com/mcp

# Cursor / IDE 등록
MCP Endpoint URL: https://mcp.supabase.com/mcp

# 주요 AI 명령어 예시:
- "내 Supabase 데이터베이스의 posts 테이블 구조 보여줘"
- "comments 테이블에 작성자 레벨 컬럼 추가해줘"`}
              </pre>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
