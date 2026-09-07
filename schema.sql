-- ========================================================
-- 🚀 CyberBoard Supabase Database Schema
-- Supabase SQL Editor에 복사하여 붙여넣고 [Run]을 누르세요!
-- ========================================================

-- 1. 게시글 (Posts) 테이블 생성
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

-- 2. 댓글 (Comments) 테이블 생성
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

-- 3. 좋아요 (Likes) 기록 테이블
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    client_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, client_id)
);

-- 4. RLS (Row Level Security) 설정 - 누구나 읽기/쓰기 가능하도록 라이브 익명 접근 허용
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Posts 테이블 정책
CREATE POLICY "Allow public read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update posts" ON public.posts FOR UPDATE USING (true);

-- Comments 테이블 정책
CREATE POLICY "Allow public read comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update comments" ON public.comments FOR UPDATE USING (true);

-- Likes 테이블 정책
CREATE POLICY "Allow public read likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Allow public insert likes" ON public.likes FOR INSERT WITH CHECK (true);

-- 5. 샘플 데이터 입력 (테스트용)
INSERT INTO public.posts (title, content, category, tags, author_name, author_badge, author_level, cover_image, likes_count, views_count, reactions)
VALUES 
(
  '⚡ CyberBoard 2.0에 오신 것을 환영합니다! (Supabase 연동 완벽 가이드)',
  '안녕하세요 사이버네틱스 커뮤니티 여러분! 🚀\n\n본 사이트는 Supabase의 강력한 Realtime Database 기반으로 작동하는 초고속 소통 게시판입니다.\n\n### 🛠️ 주요 기능 안내:\n- **글 작성 & 이미지 첨부**: 네온 글로우 모달에서 바로 글을 작성할 수 있습니다.\n- **이모지 리액션 파티클**: 🔥, 🚀, 💡 이모지 클릭 시 환상적인 네온 폭죽 효과가 펼쳐집니다.\n- **Supabase 내 DB 연동**: 우측 상단 ⚙️ 연동 버튼을 눌러 본인의 Supabase URL과 Anon Key를 입력하면 실시간 데이터베이스로 즉시 전환됩니다.\n\n댓글과 리액션으로 다른 유저들과 자유롭게 소통해보세요!',
  '공지사항',
  ARRAY['안내', 'Supabase', 'CyberBoard', '공지'],
  '관리자 (Admin)',
  'SYSTEM',
  99,
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  42,
  350,
  '{"fire": 18, "rocket": 12, "bulb": 8, "heart": 15, "party": 9}'::jsonb
),
(
  '💡 Supabase MCP & CLI를 활용한 백엔드 자동화 팁 공유해봅니다',
  '최근 커서(Cursor) 및 Claude MCP 기능을 이용하여 Supabase DB 관리를 AI로 자동화해봤는데 정말 혁신적이네요!\n\n1. `claude mcp add --transport http supabase https://mcp.supabase.com/mcp`\n2. AI에게 "현재 데이터베이스의 테이블 리스트를 보여줘" 라고 말하면 실시간 쿼리가 실행됩니다.\n\nCLI 설치도 `scoop install supabase` 한 줄이면 끝나니 다들 한번 시도해보세요!',
  '아이디어',
  ARRAY['Supabase', 'MCP', 'CLI', '개발팁'],
  '네온코더',
  'VIP',
  15,
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
  28,
  189,
  '{"fire": 10, "rocket": 9, "bulb": 14, "heart": 4, "party": 3}'::jsonb
),
(
  '🚀 이번에 새로 만든 수제 3D 네온 UI 프레임워크 자랑합니다!',
  'Vanilla CSS와 Canvas Particle 효과를 조합해서 극상의 가시성을 가진 UI를 설계해보았습니다. 마우스 커서를 올렸을 때의 3D 반사광 글로우 효과가 포인트입니다.\n\n다들 어떻게 생각하시나요? 개선할 점이나 피드백 환영합니다!',
  '자랑거리',
  ARRAY['UI/UX', 'CSS', 'Design', 'Frontend'],
  '글래스마스터',
  'PRO',
  8,
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80',
  19,
  142,
  '{"fire": 7, "rocket": 8, "bulb": 2, "heart": 6, "party": 5}'::jsonb
);

INSERT INTO public.comments (post_id, author_name, author_badge, content, likes_count)
SELECT id, '익명 라이더', 'MEMBER', '디자인이 진짜 미쳤네요 ⚡ 번쩍번쩍해서 보는 맛이 납니다!', 5
FROM public.posts WHERE title LIKE '%환영합니다%' LIMIT 1;
