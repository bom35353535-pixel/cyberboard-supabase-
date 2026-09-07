import React from 'react';
import { ThumbsUp, MessageSquare, Eye, Tag, Flame, Rocket, Lightbulb, Heart, PartyPopper } from 'lucide-react';

export default function PostCard({ post, onClick, onLike, onReaction }) {
  const timeAgo = (dateStr) => {
    try {
      const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
      if (diff < 60) return '방금 전';
      if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
      return `${Math.floor(diff / 86400)}일 전`;
    } catch (e) {
      return '방금 전';
    }
  };

  const getBadgeClass = (badge) => {
    switch (badge?.toUpperCase()) {
      case 'SYSTEM': return 'badge-pink';
      case 'VIP': return 'badge-gold';
      case 'PRO': return 'badge-purple';
      default: return 'badge-cyan';
    }
  };

  const reactions = post.reactions || { fire: 0, rocket: 0, bulb: 0, heart: 0, party: 0 };

  return (
    <div 
      onClick={() => onClick(post)}
      className="glass-card glass-card-hover" 
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between'
      }}
    >
      {/* Cover Image Header if present */}
      {post.cover_image && (
        <div style={{
          height: '160px',
          width: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <img 
            src={post.cover_image} 
            alt="Cover" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 19, 36, 0.9) 0%, transparent 60%)'
          }} />
          <span className="badge-neon badge-cyan" style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backdropFilter: 'blur(8px)'
          }}>
            {post.category || '자유수다'}
          </span>
        </div>
      )}

      {/* Main Content Body */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Author Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={post.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
              alt="Avatar" 
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid var(--cyan)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}>
                  {post.author_name}
                </span>
                <span className={`badge-neon ${getBadgeClass(post.author_badge)}`}>
                  {post.author_badge || 'PRO'}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                LV.{post.author_level || 1} • {timeAgo(post.created_at)}
              </div>
            </div>
          </div>

          {!post.cover_image && (
            <span className="badge-neon badge-cyan">
              {post.category || '자유수다'}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '700',
          color: '#f8fafc',
          marginBottom: '10px',
          lineHeight: '1.35',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {post.title}
        </h3>

        {/* Snippet Preview */}
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '14px',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {post.content.replace(/[#*`]/g, '')}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {post.tags.map((tag, i) => (
              <span key={i} style={{
                fontSize: '0.72rem',
                color: 'var(--cyan)',
                background: 'rgba(0, 242, 254, 0.08)',
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(0, 242, 254, 0.15)'
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer Reactions & Metrics */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          marginTop: 'auto'
        }}>
          {/* Reaction Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); onReaction(post.id, 'fire'); }}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '4px 8px',
                color: '#fff',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              🔥 {reactions.fire || 0}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onReaction(post.id, 'rocket'); }}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '4px 8px',
                color: '#fff',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              🚀 {reactions.rocket || 0}
            </button>
          </div>

          {/* Upvotes & Views */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--cyan)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: '700'
              }}
            >
              <ThumbsUp size={14} />
              <span>{post.likes_count || 0}</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={14} />
              <span>{post.views_count || 1}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
