import React, { useState } from 'react';
import { X, ThumbsUp, Send, MessageSquare, Flame, Rocket, Lightbulb, Heart, PartyPopper, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PostDetailModal({ 
  post, 
  onClose, 
  comments, 
  onAddComment, 
  onLike, 
  onReaction,
  currentUser 
}) {
  const [commentText, setCommentText] = useState('');

  if (!post) return null;

  const triggerEmojiConfetti = (emoji) => {
    // Canvas confetti effect
    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleReactionClick = (type, emoji) => {
    triggerEmojiConfetti(emoji);
    onReaction(post.id, type);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment(post.id, {
      content: commentText.trim(),
      author_name: currentUser.name,
      author_avatar: currentUser.avatar,
      author_badge: currentUser.badge
    });

    setCommentText('');
  };

  const reactions = post.reactions || { fire: 0, rocket: 0, bulb: 0, heart: 0, party: 0 };

  return (
    <div className="modal-overlay">
      <div className="glass-card animate-fadeIn" style={{
        width: '100%',
        maxWidth: '820px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '0',
        border: '1px solid var(--cyan-glow)'
      }}>
        
        {/* Cover Image if available */}
        {post.cover_image && (
          <div style={{ width: '100%', height: '260px', position: 'relative', overflow: 'hidden' }}>
            <img src={post.cover_image} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(7, 9, 19, 1) 0%, transparent 80%)'
            }} />
            <button 
              onClick={onClose}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%', width: '36px', height: '36px',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', backdropFilter: 'blur(8px)'
              }}
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div style={{ padding: '28px' }}>
          
          {/* Header Bar */}
          {!post.cover_image && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge-neon badge-cyan">{post.category}</span>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
          )}

          {/* Title */}
          <h1 className="text-gradient-cyan" style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '16px', lineHeight: '1.3' }}>
            {post.title}
          </h1>

          {/* Author info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <img 
              src={post.author_avatar} 
              alt="Avatar" 
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--cyan)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{post.author_name}</span>
                <span className="badge-neon badge-purple">LV.{post.author_level || 1} {post.author_badge}</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                게시일: {new Date(post.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div style={{
            fontSize: '0.96rem',
            lineHeight: '1.75',
            color: '#e2e8f0',
            whiteSpace: 'pre-wrap',
            marginBottom: '28px'
          }}>
            {post.content}
          </div>

          {/* Reaction Bar & Upvote */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(0, 242, 254, 0.15)',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { type: 'fire', emoji: '🔥', count: reactions.fire || 0, label: '불타오름' },
                { type: 'rocket', emoji: '🚀', count: reactions.rocket || 0, label: '로켓' },
                { type: 'bulb', emoji: '💡', count: reactions.bulb || 0, label: '천재적' },
                { type: 'heart', emoji: '❤️', count: reactions.heart || 0, label: '좋아요' },
                { type: 'party', emoji: '🎉', count: reactions.party || 0, label: '축하' },
              ].map(r => (
                <button
                  key={r.type}
                  onClick={() => handleReactionClick(r.type, r.emoji)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '8px 14px',
                    color: '#fff',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <span>{r.emoji}</span>
                  <span style={{ fontWeight: '700' }}>{r.count}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => onLike(post.id)}
              className="btn-neon-primary"
              style={{ padding: '8px 20px', fontSize: '0.88rem' }}
            >
              <ThumbsUp size={16} />
              <span>추천 ({post.likes_count || 0})</span>
            </button>
          </div>

          {/* Comments Section */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} color="var(--cyan)" />
              <span>실시간 스레드 댓글 ({comments.length})</span>
            </h3>

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <input
                type="text"
                placeholder="댓글로 의견을 자유롭게 남겨보세요..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(0, 242, 254, 0.2)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '0.88rem'
                }}
              />
              <button type="submit" className="btn-neon-primary" style={{ padding: '12px 18px' }}>
                <Send size={16} />
                <span>작성</span>
              </button>
            </form>

            {/* Comment List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {comments.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
                  첫 번째 댓글을 작성해보세요! 🚀
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <img 
                      src={comment.author_avatar} 
                      alt="Avatar" 
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#fff' }}>
                          {comment.author_name}
                        </span>
                        <span className="badge-neon badge-cyan" style={{ fontSize: '0.62rem' }}>
                          {comment.author_badge || 'MEMBER'}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                          {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
