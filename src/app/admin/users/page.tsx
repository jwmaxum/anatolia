// Note: metadata must be in a server component. Title is set via document.title in useEffect below.
'use client';


import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Shield,
  Edit3,
  Check,
  X,
  RefreshCw,
  UserCheck,
  UserX,
  ChevronDown,
} from 'lucide-react';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

type UserRole = 'admin' | 'editor' | 'viewer';
type UserStatus = 'active' | 'inactive';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  company?: string;
}

const ROLE_LABELS: Record<UserRole, { label: string; color: string; bg: string }> = {
  admin: { label: 'Admin', color: 'text-red-400', bg: 'bg-red-950/40 border-red-800/50' },
  editor: { label: 'Editor', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-800/50' },
  viewer: { label: 'Viewer', color: 'text-stone-400', bg: 'bg-stone-900 border-stone-700' },
};

// 샘플 데이터 (Supabase 미연결 시)
const SAMPLE_USERS: AdminUser[] = [
  {
    id: '1',
    email: 'admin@anatolia.com',
    name: '관리자',
    role: 'admin',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    company: 'Anatolia',
  },
  {
    id: '2',
    email: 'editor@anatolia.com',
    name: '에디터',
    role: 'editor',
    status: 'active',
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: '3',
    email: 'viewer@anatolia.com',
    name: '뷰어',
    role: 'viewer',
    status: 'inactive',
    created_at: '2026-03-01T00:00:00Z',
  },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured] = useState(isSupabaseConfigured());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('viewer');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    if (!configured) {
      setUsers(SAMPLE_USERS);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .select('id, email, name, role, status, created_at, company')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers((data as AdminUser[]) || []);
    } catch {
      setUsers(SAMPLE_USERS);
      showToast('DB 연결 실패 — 샘플 데이터 표시 중', 'error');
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEditStart = (user: AdminUser) => {
    setEditingId(user.id);
    setEditRole(user.role);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleRoleUpdate = async (userId: string) => {
    setSaving(true);
    try {
      if (configured) {
        const { error } = await supabaseAdmin
          .from('user_profiles')
          .update({ role: editRole })
          .eq('id', userId);
        if (error) throw error;
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: editRole } : u))
      );
      showToast('역할이 업데이트되었습니다.');
    } catch {
      showToast('역할 업데이트 실패', 'error');
    } finally {
      setSaving(false);
      setEditingId(null);
    }
  };

  const handleStatusToggle = async (user: AdminUser) => {
    const newStatus: UserStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      if (configured) {
        const { error } = await supabaseAdmin
          .from('user_profiles')
          .update({ status: newStatus })
          .eq('id', user.id);
        if (error) throw error;
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
      showToast(`사용자 ${newStatus === 'active' ? '활성화' : '비활성화'} 완료`);
    } catch {
      showToast('상태 변경 실패', 'error');
    }
  };

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
    editors: users.filter((u) => u.role === 'editor').length,
    active: users.filter((u) => u.status === 'active').length,
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-mono uppercase tracking-widest mb-1">
            <Shield size={14} />
            <span>Admin — User Management</span>
          </div>
          <h1 className="font-serif-luxury text-2xl text-white font-semibold tracking-wide">
            회원 및 권한 관리
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            사용자 역할(admin, editor, viewer) 및 활성화 상태를 관리합니다.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center space-x-2 px-3 py-2 bg-stone-900 border border-stone-700 hover:border-stone-600 rounded text-xs text-stone-300 hover:text-white transition-colors"
        >
          <RefreshCw size={14} />
          <span>새로고침</span>
        </button>
      </div>

      {/* Supabase 미연결 배너 */}
      {!configured && (
        <div className="px-4 py-3 bg-amber-950/30 border border-amber-800/50 rounded text-amber-400 text-xs font-mono">
          ⚠ Supabase 미연결 상태입니다. 샘플 데이터를 표시하며, 변경사항은 저장되지 않습니다.
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded shadow-xl text-sm font-mono border transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
              : 'bg-red-950/80 border-red-700 text-red-300'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: '전체 사용자', value: stats.total, color: 'text-white', icon: Users },
          { label: 'Admin', value: stats.admins, color: 'text-red-400', icon: Shield },
          { label: 'Editor', value: stats.editors, color: 'text-amber-400', icon: Edit3 },
          { label: '활성 사용자', value: stats.active, color: 'text-emerald-400', icon: UserCheck },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#121218] border border-stone-800 rounded-lg p-4 flex items-center space-x-3"
            >
              <Icon size={18} className={stat.color} />
              <div>
                <div className={`text-xl font-bold font-serif-luxury ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-stone-500 font-mono">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Users Table */}
      <div className="bg-[#0d0d12] border border-stone-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-stone-800 flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-widest font-mono text-stone-400">
            사용자 목록
          </h2>
          <span className="text-xs text-stone-600 font-mono">{users.length}명</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-stone-500 text-sm">
            <RefreshCw size={20} className="animate-spin mx-auto mb-2" />
            로드 중...
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-stone-500 text-sm">등록된 사용자가 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-800">
                  <th className="px-5 py-3 text-left text-xs font-mono text-stone-500 uppercase tracking-wider">
                    사용자
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-mono text-stone-500 uppercase tracking-wider">
                    역할
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-mono text-stone-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-mono text-stone-500 uppercase tracking-wider">
                    가입일
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-mono text-stone-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {users.map((user) => {
                  const roleInfo = ROLE_LABELS[user.role] || ROLE_LABELS.viewer;
                  const isEditing = editingId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-stone-900/30 transition-colors">
                      {/* 사용자 정보 */}
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-[#c5a880]/20 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] font-bold text-sm font-serif-luxury">
                            {(user.name || user.email)[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{user.name || '—'}</div>
                            <div className="text-stone-500 text-xs font-mono">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* 역할 */}
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <div className="relative">
                            <select
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value as UserRole)}
                              className="appearance-none w-32 px-3 py-1.5 bg-[#0a0a0c] border border-[#c5a880]/60 rounded text-xs text-white focus:outline-none focus:border-[#c5a880]"
                            >
                              <option value="admin">Admin</option>
                              <option value="editor">Editor</option>
                              <option value="viewer">Viewer</option>
                            </select>
                            <ChevronDown
                              size={12}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                            />
                          </div>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded border text-xs font-mono font-semibold ${roleInfo.bg} ${roleInfo.color}`}
                          >
                            {roleInfo.label}
                          </span>
                        )}
                      </td>

                      {/* 상태 */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleStatusToggle(user)}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded border text-xs font-mono transition-colors ${
                            user.status === 'active'
                              ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400 hover:bg-emerald-950/50'
                              : 'bg-stone-900 border-stone-700 text-stone-500 hover:border-stone-600'
                          }`}
                        >
                          {user.status === 'active' ? (
                            <UserCheck size={12} />
                          ) : (
                            <UserX size={12} />
                          )}
                          <span>{user.status === 'active' ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* 가입일 */}
                      <td className="px-5 py-4 text-stone-500 text-xs font-mono">
                        {new Date(user.created_at).toLocaleDateString('ko-KR')}
                      </td>

                      {/* 작업 */}
                      <td className="px-5 py-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleRoleUpdate(user.id)}
                              disabled={saving}
                              className="flex items-center space-x-1 px-2.5 py-1.5 bg-[#c5a880] hover:bg-[#b59870] text-black rounded text-xs font-semibold transition-colors disabled:opacity-60"
                            >
                              <Check size={12} />
                              <span>{saving ? '저장 중...' : '저장'}</span>
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="flex items-center space-x-1 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs transition-colors"
                            >
                              <X size={12} />
                              <span>취소</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditStart(user)}
                            className="flex items-center space-x-1 px-2.5 py-1.5 bg-stone-900 border border-stone-700 hover:border-[#c5a880]/50 text-stone-300 hover:text-white rounded text-xs transition-colors ml-auto"
                          >
                            <Edit3 size={12} />
                            <span>역할 변경</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RLS 안내 */}
      <div className="p-4 bg-[#0d0d12] border border-stone-800 rounded-lg text-xs text-stone-500 leading-relaxed">
        <strong className="text-stone-400">Supabase RLS 정책 안내:</strong>{' '}
        user_profiles 테이블에 <code className="text-[#c5a880]">role</code> 컬럼이 없는 경우,
        Supabase SQL 에디터에서{' '}
        <code className="text-stone-300">
          ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT &apos;viewer&apos;;
        </code>
        를 실행하세요.
      </div>
    </div>
  );
}
