import type { User } from '@/types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    name: 'John Smith',
    email: 'john.smith@xeni.legal',
    role: 'lawyer',
    avatar: '/avatars/john.jpg',
  },
  {
    id: 'user-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@xeni.legal',
    role: 'lawyer',
    avatar: '/avatars/sarah.jpg',
  },
  {
    id: 'user-003',
    name: 'Michael Chen',
    email: 'michael.chen@xeni.legal',
    role: 'assistant',
    avatar: '/avatars/michael.jpg',
  },
  {
    id: 'user-004',
    name: 'Emily Davis',
    email: 'emily.davis@xeni.legal',
    role: 'assistant',
    avatar: '/avatars/emily.jpg',
  },
];

export function getUserById(userId: string): User | undefined {
  return MOCK_USERS.find((user) => user.id === userId);
}
