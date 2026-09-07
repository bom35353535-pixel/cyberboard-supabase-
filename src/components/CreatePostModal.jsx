import React, { useState } from 'react';
import { X, Image as ImageIcon, Tag, Send, Sparkles } from 'lucide-react';

const COVER_PRESETS = [
  { name: 'Neon Cyber City', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Quantum Code', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Abstract Fluid', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Deep Aurora', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80' }
];

export default function CreatePostModal({ isOpen, onClose, onSubmit, currentUser }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('자유수다');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [coverImage, setCoverImage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      category,
      content: content.trim(),
      tags,
      cover_image: coverImage || null,
      author_name: currentUser.name,
      author_avatar: currentUser.avatar,
      author_badge: currentUser.badge,
      author_level: currentUser.level
    });

    setTitle('');
    setContent('');
    setTagsInput('');
    setCoverImage('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card animate-fadeIn" style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '28px',
        border: '1px solid var(--border-neon)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={24} color="var(--cyan)" />
            <h2 className="text-gradient-cyan" style={{ fontSize: '1.35rem', fontWeight: '800' }}>
              새로운 아티클 게시하기
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--cyan)', marginBottom: '8px' }}>
              카테고리 선택
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['공지사항', '자유수다', '아이디어', 'Q&A', '자랑거리'].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    border: category === cat ? '1px solid var(--cyan)' : '1px solid rgba(255,255,255,0.1)',
                    background: category === cat ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: category === cat ? 'var(--cyan)' : 'var(--text-muted)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--cyan)', marginBottom: '6px' }}>
              제목
            </label>
            <input
              type="text"
              required
              placeholder="멋진 포스트 제목을 입력하세요..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.95rem'
              }}
            />
          </div>

          {/* Content Body */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--cyan)', marginBottom: '6px' }}>
              내용 (마크다운 지원)
            </label>
            <textarea
              required
              rows={7}
              placeholder="자유롭게 커뮤니티 사용자들과 소통할 내용을 적어주세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Cover Image & Presets */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '700', color: 'var(--cyan)', marginBottom: '6px' }}>
              <ImageIcon size={14} /> 커버 이미지 (URL 또는 아래 프리셋 선택)
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.85rem',
                marginBottom: '10px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {COVER_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => setCoverImage(preset.url)}
                  style={{
                    border: coverImage === preset.url ? '2px solid var(--cyan)' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    width: '100px',
                    height: '50px',
                    flexShrink: 0
                  }}
                >
                  <img src={preset.url} alt={preset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.62rem', padding: '2px'
                  }}>
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '700', color: 'var(--cyan)', marginBottom: '6px' }}>
              <Tag size={14} /> 태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              placeholder="Supabase, React, UI디자인, 소통"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-glass">
              취소
            </button>
            <button type="submit" className="btn-neon-primary">
              <Send size={16} />
              <span>포스트 등록하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
