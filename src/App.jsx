import React, { useState, useEffect } from 'react';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import PostCard from './components/PostCard';
import CreatePostModal from './components/CreatePostModal';
import PostDetailModal from './components/PostDetailModal';
import SupabaseModal from './components/SupabaseModal';
import UserProfileModal from './components/UserProfileModal';
import { 
  getSupabaseClient, 
  getStoredConfig, 
  getDemoPosts, 
  saveDemoPosts, 
  getDemoComments, 
  saveDemoComment 
} from './supabaseClient';
import { Flame, Sparkles, Clock, TrendingUp, Layers, RefreshCw } from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'popular'

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostComments, setSelectedPostComments] = useState([]);

  // Supabase Status
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);
  const [loading, setLoading] = useState(true);

  // User Profile
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cyberboard_user_profile');
    if (saved) return JSON.parse(saved);
    return {
      name: '사이버라이더',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      level: 12,
      badge: 'VIP',
      xp: 75
    };
  });

  const saveCurrentUser = (updated) => {
    setCurrentUser(updated);
    localStorage.setItem('cyberboard_user_profile', JSON.stringify(updated));
  };

  // Check connection status & fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    const client = getSupabaseClient();
    const { url, key } = getStoredConfig();

    if (client && url && key) {
      try {
        const { data, error } = await client
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setPosts(data);
          setIsLiveSupabase(true);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Supabase fetch error, fallback to demo mode:', err);
      }
    }

    // Fallback to local demo posts
    const demo = getDemoPosts();
    setPosts(demo);
    setIsLiveSupabase(false);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleConfigSaved = () => {
    fetchPosts();
  };

  // Create Post
  const handleCreatePost = async (postData) => {
    const client = getSupabaseClient();
    if (isLiveSupabase && client) {
      try {
        const { data, error } = await client
          .from('posts')
          .insert([postData])
          .select();

        if (!error && data) {
          setPosts([data[0], ...posts]);
          // Award XP
          saveCurrentUser({
            ...currentUser,
            xp: Math.min(100, (currentUser.xp || 0) + 15)
          });
          return;
        }
      } catch (e) {
        console.error('Supabase post insert failed:', e);
      }
    }

    // Demo Mode fallback
    const newPost = {
      id: `demo-${Date.now()}`,
      ...postData,
      likes_count: 0,
      views_count: 1,
      reactions: { fire: 0, rocket: 0, bulb: 0, heart: 0, party: 0 },
      created_at: new Date().toISOString()
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    saveDemoPosts(updated);
    saveCurrentUser({
      ...currentUser,
      xp: Math.min(100, (currentUser.xp || 0) + 15)
    });
  };

  // Like Post
  const handleLikePost = async (postId) => {
    const client = getSupabaseClient();
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    const newLikes = (targetPost.likes_count || 0) + 1;

    if (isLiveSupabase && client) {
      try {
        await client.from('posts').update({ likes_count: newLikes }).eq('id', postId);
      } catch (e) {
        console.error(e);
      }
    }

    const updated = posts.map(p => p.id === postId ? { ...p, likes_count: newLikes } : p);
    setPosts(updated);
    if (!isLiveSupabase) saveDemoPosts(updated);

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({ ...selectedPost, likes_count: newLikes });
    }
  };

  // Emoji Reaction
  const handleReaction = async (postId, reactionType) => {
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    const currentReactions = targetPost.reactions || { fire: 0, rocket: 0, bulb: 0, heart: 0, party: 0 };
    const updatedReactions = {
      ...currentReactions,
      [reactionType]: (currentReactions[reactionType] || 0) + 1
    };

    const client = getSupabaseClient();
    if (isLiveSupabase && client) {
      try {
        await client.from('posts').update({ reactions: updatedReactions }).eq('id', postId);
      } catch (e) {
        console.error(e);
      }
    }

    const updated = posts.map(p => p.id === postId ? { ...p, reactions: updatedReactions } : p);
    setPosts(updated);
    if (!isLiveSupabase) saveDemoPosts(updated);

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({ ...selectedPost, reactions: updatedReactions });
    }
  };

  // View Detail & Fetch Comments
  const handleOpenPostDetail = async (post) => {
    setSelectedPost(post);
    const client = getSupabaseClient();

    if (isLiveSupabase && client) {
      try {
        // Increment views
        client.from('posts').update({ views_count: (post.views_count || 0) + 1 }).eq('id', post.id);

        const { data, error } = await client
          .from('comments')
          .select('*')
          .eq('post_id', post.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setSelectedPostComments(data);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Demo Mode Comments
    const demoComments = getDemoComments(post.id);
    setSelectedPostComments(demoComments);
  };

  // Add Comment
  const handleAddComment = async (postId, commentData) => {
    const client = getSupabaseClient();
    const newCommentPayload = {
      post_id: postId,
      ...commentData,
      likes_count: 0,
      created_at: new Date().toISOString()
    };

    if (isLiveSupabase && client) {
      try {
        const { data, error } = await client
          .from('comments')
          .insert([newCommentPayload])
          .select();

        if (!error && data) {
          setSelectedPostComments([data[0], ...selectedPostComments]);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Demo mode comment
    const demoComment = {
      id: `comment-${Date.now()}`,
      ...newCommentPayload
    };
    saveDemoComment(demoComment);
    setSelectedPostComments([demoComment, ...selectedPostComments]);
  };

  // Filter & Sort Posts
  const filteredPosts = posts
    .filter(p => {
      const matchCat = activeCategory === '전체' || p.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || 
        p.title.toLowerCase().includes(q) || 
        p.content.toLowerCase().includes(q) || 
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)));
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.likes_count || 0) - (a.likes_count || 0);
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      
      {/* Dynamic Canvas Particles */}
      <ParticleBackground />

      {/* Navigation Header */}
      <Navbar 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseOpen(true)}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        isLiveSupabase={isLiveSupabase}
        currentUser={currentUser}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Hero Banner */}
        <div className="glass-card" style={{
          padding: '32px 40px',
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08) 0%, rgba(157, 78, 221, 0.12) 50%, rgba(255, 0, 127, 0.08) 100%)',
          border: '1px solid rgba(0, 242, 254, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <div className="badge-neon badge-cyan" style={{ marginBottom: '10px' }}>
              ⚡ REALTIME SUPABASE POWERED
            </div>
            <h1 className="text-gradient-neon" style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '8px' }}>
              사이버네틱스 소통 공간에 오신 것을 환영합니다
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '640px' }}>
              Supabase Realtime DB와 연동하여 실시간 글 작성, 댓글, 네온 이모지 파티클 반응을 체험해보세요!
              {isLiveSupabase ? ' (현재 사용자 데이터베이스와 라이브 연결됨 🟢)' : ' (현재 모의 데모 모드로 작동 중 🟣)'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="btn-neon-primary" 
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              <Sparkles size={18} />
              <span>포스트 작성하기</span>
            </button>
            <button
              onClick={fetchPosts}
              className="btn-glass"
              title="새로고침"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Controls Bar: Sort & Filter Summary */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
              {activeCategory} 게시글
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--cyan)', fontWeight: '700' }}>
              ({filteredPosts.length})
            </span>
          </div>

          {/* Sort Buttons */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '4px', borderRadius: '12px' }}>
            <button
              onClick={() => setSortBy('latest')}
              style={{
                border: 'none',
                background: sortBy === 'latest' ? 'rgba(0, 242, 254, 0.2)' : 'transparent',
                color: sortBy === 'latest' ? 'var(--cyan)' : 'var(--text-muted)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Clock size={14} /> 최신순
            </button>
            <button
              onClick={() => setSortBy('popular')}
              style={{
                border: 'none',
                background: sortBy === 'popular' ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                color: sortBy === 'popular' ? 'var(--gold)' : 'var(--text-muted)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <TrendingUp size={14} /> 인기순
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Layers size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>
              조건에 맞는 게시글이 없습니다.
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              첫 번째 아티클을 남겨 커뮤니티 대화를 시작해보세요!
            </p>
            <button onClick={() => setIsCreateOpen(true)} className="btn-neon-primary">
              새 글 작성하기
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={handleOpenPostDetail}
                onLike={handleLikePost}
                onReaction={handleReaction}
              />
            ))}
          </div>
        )}

      </main>

      {/* Modals */}
      <CreatePostModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSubmit={handleCreatePost} 
        currentUser={currentUser}
      />

      <PostDetailModal 
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        comments={selectedPostComments}
        onAddComment={handleAddComment}
        onLike={handleLikePost}
        onReaction={handleReaction}
        currentUser={currentUser}
      />

      <SupabaseModal 
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
        onConfigSaved={handleConfigSaved}
        isLiveSupabase={isLiveSupabase}
      />

      <UserProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUpdateUser={saveCurrentUser}
      />

    </div>
  );
}
