// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Generic fetch wrapper with credentials
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  getMe: () => fetchAPI<{ user: User | null; isAdmin: boolean }>('/auth/me'),
  logout: () => fetchAPI<{ success: boolean }>('/auth/logout', { method: 'POST' }),
  getLoginUrl: () => `${API_BASE_URL}/auth/discord`,
};

// News API
export const newsAPI = {
  getPublished: () => fetchAPI<News[]>('/news'),
  getAll: () => fetchAPI<News[]>('/news/all'),
  create: (data: CreateNewsData) => 
    fetchAPI<{ id: number; message: string }>('/news', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  update: (id: number, data: CreateNewsData) => 
    fetchAPI<{ message: string }>(`/news/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  delete: (id: number) => 
    fetchAPI<{ message: string }>(`/news/${id}`, { method: 'DELETE' }),
  togglePublish: (id: number) => 
    fetchAPI<{ message: string }>(`/news/${id}/toggle-publish`, { method: 'POST' }),
};

// Recruitment API
export const recruitmentAPI = {
  submit: (data: SubmitRecruitmentData) => 
    fetchAPI<{ id: number; message: string }>('/recruitment', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  getAll: () => fetchAPI<RecruitmentApplication[]>('/recruitment'),
  updateStatus: (id: number, status: string, admin_notes?: string) => 
    fetchAPI<{ message: string }>(`/recruitment/${id}/status`, { 
      method: 'PUT', 
      body: JSON.stringify({ status, admin_notes }) 
    }),
  delete: (id: number) => 
    fetchAPI<{ message: string }>(`/recruitment/${id}`, { method: 'DELETE' }),
};

// Wiki API
export const wikiAPI = {
  getPublished: () => fetchAPI<WikiArticle[]>('/wiki'),
  getBySlug: (slug: string) => fetchAPI<WikiArticle>(`/wiki/article/${slug}`),
  getAll: () => fetchAPI<WikiArticle[]>('/wiki/all'),
  create: (data: CreateWikiData) => 
    fetchAPI<{ id: number; message: string }>('/wiki', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  update: (id: number, data: CreateWikiData) => 
    fetchAPI<{ message: string }>(`/wiki/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  delete: (id: number) => 
    fetchAPI<{ message: string }>(`/wiki/${id}`, { method: 'DELETE' }),
};

// Commands API
export const commandsAPI = {
  getAll: () => fetchAPI<Command[]>('/commands'),
  create: (data: CreateCommandData) => 
    fetchAPI<{ id: number; message: string }>('/commands', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  update: (id: number, data: CreateCommandData) => 
    fetchAPI<{ message: string }>(`/commands/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  delete: (id: number) => 
    fetchAPI<{ message: string }>(`/commands/${id}`, { method: 'DELETE' }),
};

// Settings API
export const settingsAPI = {
  getPublic: () => fetchAPI<Record<string, string>>('/settings'),
  getAll: () => fetchAPI<SiteSetting[]>('/settings/all'),
  update: (key: string, value: string, is_public?: boolean) => 
    fetchAPI<{ message: string }>(`/settings/${key}`, { 
      method: 'PUT', 
      body: JSON.stringify({ value, is_public }) 
    }),
  bulkUpdate: (settings: Record<string, string>) => 
    fetchAPI<{ message: string }>('/settings/bulk', { 
      method: 'POST', 
      body: JSON.stringify({ settings }) 
    }),
};

// Discord API
export const discordAPI = {
  sendNewsWebhook: (newsId: number) => 
    fetchAPI<{ message: string }>('/discord/webhook/news', { 
      method: 'POST', 
      body: JSON.stringify({ newsId }) 
    }),
  sendNewsBot: (newsId: number, channelId: string) => 
    fetchAPI<{ message: string }>('/discord/bot/news', { 
      method: 'POST', 
      body: JSON.stringify({ newsId, channelId }) 
    }),
  sendMessage: (channelId: string, message: string) => 
    fetchAPI<{ message: string }>('/discord/bot/message', { 
      method: 'POST', 
      body: JSON.stringify({ channelId, message }) 
    }),
};

// Types
export interface User {
  id: number;
  discord_id: string;
  username: string;
  avatar: string | null;
  email: string | null;
}

export interface News {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  published: boolean;
  author_id: number;
  author_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNewsData {
  title: string;
  content: string;
  image_url?: string;
  published?: boolean;
}

export interface RecruitmentApplication {
  id: number;
  user_id: number;
  discord_username: string;
  age: number;
  experience: string;
  motivation: string | null;
  availability: string | null;
  previous_experience: string | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string;
  username?: string;
  avatar?: string;
  discord_id?: string;
}

export interface SubmitRecruitmentData {
  age: number;
  experience: string;
  motivation?: string;
  availability?: string;
  previous_experience?: string;
}

export interface WikiArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  published: boolean;
  author_id: number;
  author_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWikiData {
  title: string;
  slug: string;
  content: string;
  category?: string;
  published?: boolean;
}

export interface Command {
  id: number;
  command: string;
  description: string;
  category: string;
  usage_example: string | null;
  created_at: string;
}

export interface CreateCommandData {
  command: string;
  description: string;
  category?: string;
  usage_example?: string;
}

export interface SiteSetting {
  id: number;
  setting_key: string;
  setting_value: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}
