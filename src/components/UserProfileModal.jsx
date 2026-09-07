import React, { useState } from 'react';
import { X, User, Award, Shield, Zap, Sparkles } from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
];

export default function UserProfileModal({ isOpen, onClose, currentUser, onUpdateUser }) {
  const [name, setName] = useState(currentUser.name);
  const [avatar, setAvatar] = useState(currentUser.avatar);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name: name.trim() || currentUser.name,
      avatar: avatar || currentUser.avatar
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card animate-fadeIn" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '28px',
        border: '1px solid var(--gold-glow)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={24} color="var(--gold)" />
            <h2 className="text-gradient-gold" style={{ fontSize: '1.3rem', fontWeight: '800' }}>
              사이버네티스트 프로필 설정
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Level & XP Box */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(157, 78, 221, 0.1) 100%)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: '700', letterSpacing: '0.05em' }}>
            CURRENT LEVEL & TIER
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', margin: '4px 0' }}>
            LV.{currentUser.level} <span className="badge-neon badge-gold">{currentUser.badge}</span>
          </div>
          
          {/* XP Progress Bar */}
          <div style={{ background: 'rgba(0,0,0,0.5)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' }}>
            <div style={{
              width: `${currentUser.xp || 65}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--gold) 0%, var(--pink) 100%)',
              boxShadow: '0 0 10px var(--gold)'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>경험치 (XP): {currentUser.xp || 65}/100</span>
            <span>다음 레벨까지 +35 XP</span>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--cyan)', marginBottom: '6px' }}>
              커뮤니티 닉네임
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Avatar Presets */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--cyan)', marginBottom: '8px' }}>
              아바타 선택
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {AVATAR_PRESETS.map((imgUrl, i) => (
                <img
                  key={i}
                  src={imgUrl}
                  alt="Avatar option"
                  onClick={() => setAvatar(imgUrl)}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: avatar === imgUrl ? '3px solid var(--cyan)' : '2px solid transparent',
                    boxShadow: avatar === imgUrl ? '0 0 15px var(--cyan)' : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-glass">
              취소
            </button>
            <button type="submit" className="btn-neon-purple">
              <Sparkles size={16} />
              <span>프로필 저장</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
