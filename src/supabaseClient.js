import { createClient } from '@supabase/supabase-js';

// Environment variables from Vite (.env or Vercel Environment Variables)
export const DEFAULT_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const DEFAULT_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// LocalStorage Keys
const STORAGE_URL_KEY = 'cyberboard_supabase_url';
const STORAGE_ANON_KEY = 'cyberboard_supabase_anon_key';
const STORAGE_DEMO_POSTS = 'cyberboard_demo_posts';
const STORAGE_DEMO_COMMENTS = 'cyberboard_demo_comments';

export const getStoredConfig = () => {
  const url = localStorage.getItem(STORAGE_URL_KEY) || DEFAULT_SUPABASE_URL;
  const key = localStorage.getItem(STORAGE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY;
  return { url, key };
};

export const setStoredConfig = (url, key) => {
  if (url && key) {
    localStorage.setItem(STORAGE_URL_KEY, url.trim());
    localStorage.setItem(STORAGE_ANON_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_ANON_KEY);
  }
};

let supabaseInstance = null;

export const getSupabaseClient = () => {
  const { url, key } = getStoredConfig();
  if (url && key) {
    try {
      if (!supabaseInstance) {
        supabaseInstance = createClient(url, key);
      }
      return supabaseInstance;
    } catch (err) {
      console.error('Supabase client creation error:', err);
      return null;
    }
  }
  return null;
};

// Reset singleton instance when config changes
export const resetSupabaseClient = () => {
  supabaseInstance = null;
};

// INITIAL MOCK DATA FOR DEMO FALLBACK MODE
const INITIAL_DEMO_POSTS = [
  {
    id: 'demo-1',
    title: '⚡ CyberBoard 2.0에 오신 것을 환영합니다! (Supabase 연동 지원)',
    content: `안녕하세요 사이버네틱스 커뮤니티 여러분! 🚀

본 사이트는 Supabase의 강력한 Realtime Database 기반으로 작동하는 초고속 소통 게시판입니다.

### 🛠️ 사용자 Supabase 연동 방법:
상단 **[⚙️ Supabase 연동]** 버튼을 누르신 후 본인의 **Project URL**과 **Anon Key**를 입력하거나, **[SQL 스키마 복사]** 탭에서 SQL을 복사하여 Supabase Dashboard의 **SQL Editor**에서 실행([Run])하시면 라이브 데이터베이스로 동적 연동됩니다!`,
    category: '공지사항',
    tags: ['안내', 'Supabase', 'CyberBoard', '공지'],
    author_name: '관리자 (Admin)',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    author_badge: 'SYSTEM',
    author_level: 99,
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    likes_count: 42,
    views_count: 350,
    reactions: { fire: 18, rocket: 12, bulb: 8, heart: 15, party: 9 },
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'demo-2',
    title: '💡 Supabase MCP & CLI를 활용한 백엔드 자동화 팁 공유해봅니다',
    content: `최근 커서(Cursor) 및 Claude MCP 기능을 이용하여 Supabase DB 관리를 AI로 자동화해봤는데 정말 혁신적이네요!

1. \`claude mcp add --transport http supabase https://mcp.supabase.com/mcp\`
2. AI에게 "현재 데이터베이스의 테이블 리스트를 보여줘" 라고 말하면 실시간 쿼리가 실행됩니다.

CLI 설치도 \`scoop install supabase\` 한 줄이면 끝나니 다들 한번 시도해보세요!`,
    category: '아이디어',
    tags: ['Supabase', 'MCP', 'CLI', '개발팁'],
    author_name: '네온코더',
    author_avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    author_badge: 'VIP',
    author_level: 15,
    cover_image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    likes_count: 28,
    views_count: 189,
    reactions: { fire: 10, rocket: 9, bulb: 14, heart: 4, party: 3 },
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'demo-3',
    title: '🚀 이번에 새로 만든 수제 3D 네온 UI 프레임워크 자랑합니다!',
    content: `Vanilla CSS와 Canvas Particle 효과를 조합해서 극상의 가시성을 가진 UI를 설계해보았습니다. 마우스 커서를 올렸을 때의 3D 반사광 글로우 효과가 포인트입니다.

다들 어떻게 생각하시나요? 개선할 점이나 피드백 환영합니다!`,
    category: '자랑거리',
    tags: ['UI/UX', 'CSS', 'Design', 'Frontend'],
    author_name: '글래스마스터',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    author_badge: 'PRO',
    author_level: 8,
    cover_image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80',
    likes_count: 19,
    views_count: 142,
    reactions: { fire: 7, rocket: 8, bulb: 2, heart: 6, party: 5 },
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const INITIAL_DEMO_COMMENTS = [
  {
    id: 'comment-1',
    post_id: 'demo-1',
    author_name: '익명 라이더',
    author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    author_badge: 'MEMBER',
    content: '디자인이 진짜 미쳤네요 ⚡ 번쩍번쩍해서 보는 맛이 납니다!',
    likes_count: 5,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

export const getDemoPosts = () => {
  const saved = localStorage.getItem(STORAGE_DEMO_POSTS);
  if (!saved) {
    localStorage.setItem(STORAGE_DEMO_POSTS, JSON.stringify(INITIAL_DEMO_POSTS));
    return INITIAL_DEMO_POSTS;
  }
  return JSON.parse(saved);
};

export const saveDemoPosts = (posts) => {
  localStorage.setItem(STORAGE_DEMO_POSTS, JSON.stringify(posts));
};

export const getDemoComments = (postId) => {
  const saved = localStorage.getItem(STORAGE_DEMO_COMMENTS);
  const allComments = saved ? JSON.parse(saved) : INITIAL_DEMO_COMMENTS;
  if (!saved) {
    localStorage.setItem(STORAGE_DEMO_COMMENTS, JSON.stringify(INITIAL_DEMO_COMMENTS));
  }
  return allComments.filter(c => c.post_id === postId);
};

export const saveDemoComment = (comment) => {
  const saved = localStorage.getItem(STORAGE_DEMO_COMMENTS);
  const allComments = saved ? JSON.parse(saved) : INITIAL_DEMO_COMMENTS;
  const updated = [comment, ...allComments];
  localStorage.setItem(STORAGE_DEMO_COMMENTS, JSON.stringify(updated));
  return comment;
};
