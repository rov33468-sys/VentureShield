-- Conversations
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'New conversation',
  search_unlocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_conversations_user_id ON public.chat_conversations(user_id, updated_at DESC);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own conversations" ON public.chat_conversations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own conversations" ON public.chat_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own conversations" ON public.chat_conversations
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own conversations" ON public.chat_conversations
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_messages_conv ON public.chat_messages(conversation_id, created_at);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own messages" ON public.chat_messages
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own messages" ON public.chat_messages
  FOR DELETE USING (auth.uid() = user_id);

-- Sentiment analyses
CREATE TABLE public.sentiment_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  input_text TEXT NOT NULL,
  overall_sentiment TEXT NOT NULL,
  confidence NUMERIC NOT NULL,
  emotions JSONB NOT NULL DEFAULT '[]'::jsonb,
  key_phrases JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT,
  business_implications TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sentiment_user ON public.sentiment_analyses(user_id, created_at DESC);

ALTER TABLE public.sentiment_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own sentiment" ON public.sentiment_analyses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own sentiment" ON public.sentiment_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own sentiment" ON public.sentiment_analyses
  FOR DELETE USING (auth.uid() = user_id);

-- Business searches
CREATE TABLE public.business_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  query TEXT NOT NULL,
  results JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_business_searches_user ON public.business_searches(user_id, created_at DESC);

ALTER TABLE public.business_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own searches" ON public.business_searches
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own searches" ON public.business_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own searches" ON public.business_searches
  FOR DELETE USING (auth.uid() = user_id);