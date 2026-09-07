import React from 'react';
import { 
  Zap, 
  Search, 
  PlusCircle, 
  Database, 
  User, 
  Flame, 
  Sparkles, 
  MessageSquare, 
  HelpCircle, 
  Award,
  Layers
} from 'lucide-react';

export default function Navbar({ 
  activeCategory, 
  setActiveCategory, 
  searchQuery, 
  setSearchQuery, 
  onOpenCreateModal, 
  onOpenSupabaseModal,
  onOpenProfileModal,
  isLiveSupabase,
  currentUser 
}) {
  const categories = [
    { name: '전체', icon: Layers },
    { name: '공지사항', icon: Sparkles },
    { name: '자유수다', icon: MessageSquare },
    { name: '아이디어', icon: Flame },
    { name: 'Q&A', icon: HelpCircle },
    { name: '자랑거리', icon: Award },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(7, 9, 19, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0, 242, 254, 0.15)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.5)'
          }}>
            <Zap size={24} color="#070814" strokeWidth={2.8} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="text-gradient-neon" style={{ fontSize: '1.45rem', fontWeight: '900', letterSpacing: '-0.03em' }}>
                CYBERBOARD
              </span>
              <span className="badge-neon badge-cyan" style={{ fontSize: '0.65rem' }}>
                v2.0 PRO
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Next-Gen Supabase Community Platform
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          flex: '1 1 240px',
          maxWidth: '360px'
        }}>
          <Search size={18} color="var(--cyan)" style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }} />
          <input
            type="text"
            placeholder="제목, 내용, 태그 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '0.88rem',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--cyan)';
              e.target.style.boxShadow = '0 0 15px rgba(0, 242, 254, 0.3)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(0, 242, 254, 0.2)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Supabase Status Button */}
          <button
            onClick={onOpenSupabaseModal}
            className="btn-glass"
            title="Supabase 데이터베이스 연동 설정"
            style={{
              border: isLiveSupabase ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(157, 78, 221, 0.4)',
              background: isLiveSupabase ? 'rgba(16, 185, 129, 0.1)' : 'rgba(157, 78, 221, 0.1)',
              padding: '8px 14px',
              fontSize: '0.82rem'
            }}
          >
            <Database size={16} color={isLiveSupabase ? '#10b981' : '#c77dff'} />
            <span style={{ color: isLiveSupabase ? '#10b981' : '#c77dff', fontWeight: 700 }}>
              {isLiveSupabase ? 'Supabase Live' : 'Supabase Demo'}
            </span>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isLiveSupabase ? '#10b981' : '#c77dff',
              boxShadow: isLiveSupabase ? '0 0 8px #10b981' : '0 0 8px #c77dff'
            }} />
          </button>

          {/* New Post Button */}
          <button onClick={onOpenCreateModal} className="btn-neon-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            <PlusCircle size={18} />
            <span>새 글 작성</span>
          </button>

          {/* User Profile */}
          <button 
            onClick={onOpenProfileModal}
            className="btn-glass"
            style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <img 
              src={currentUser.avatar} 
              alt="Avatar" 
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--cyan)'
              }}
            />
            <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--gold)', fontWeight: '600' }}>
                LV.{currentUser.level} {currentUser.badge}
              </div>
            </div>
          </button>

        </div>

      </div>

      {/* Sub Category Bar */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px 10px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              style={{
                background: isActive ? 'linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(157, 78, 221, 0.2) 100%)' : 'rgba(255, 255, 255, 0.03)',
                border: isActive ? '1px solid var(--cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                color: isActive ? 'var(--cyan)' : 'var(--text-muted)',
                padding: '7px 16px',
                borderRadius: '20px',
                fontSize: '0.83rem',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 0 15px rgba(0, 242, 254, 0.2)' : 'none'
              }}
            >
              <Icon size={14} color={isActive ? 'var(--cyan)' : 'var(--text-muted)'} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
