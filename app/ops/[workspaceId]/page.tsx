"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  CalendarDays,
  Users,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { XeniLogo } from "@/components/case-detail/XeniLogo";
import { ROUTES } from "@/data/constants";
import { formatDate } from "@/lib/utils";
import {
  MOCK_WORKSPACES,
  getWorkspaceStats,
  getInitial,
  getAvatarColor,
  type Workspace,
} from "@/data/ops-mock-data";

const PAGE_SIZE = 10;

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  const workspace = MOCK_WORKSPACES.find((ws) => ws.id === workspaceId);

  if (!workspace) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-stone-700">Workspace not found</p>
          <Link href={ROUTES.OPS} className="text-sm text-[#0E4268] hover:underline mt-2 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <WorkspaceDetailContent workspace={workspace} />;
}

// ============================================================================
// MAIN CONTENT (extracted so hooks work properly after early return)
// ============================================================================
function WorkspaceDetailContent({ workspace }: { workspace: Workspace }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"cases" | "users">("cases");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const stats = useMemo(() => getWorkspaceStats(workspace), [workspace]);

  // Reset search/page when tab or workspace changes
  const handleTabChange = (tab: "cases" | "users") => {
    setActiveTab(tab);
    setSearch("");
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Filter cases
  const filteredCases = useMemo(() => {
    if (!search.trim()) return workspace.cases;
    const q = search.toLowerCase();
    return workspace.cases.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.createdBy.toLowerCase().includes(q)
    );
  }, [workspace.cases, search]);

  // Filter users
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return workspace.users;
    const q = search.toLowerCase();
    return workspace.users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [workspace.users, search]);

  const currentList = activeTab === "cases" ? filteredCases : filteredUsers;
  const totalPages = Math.max(1, Math.ceil(currentList.length / PAGE_SIZE));
  const paginatedItems = currentList.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <header className="h-14 bg-white border-b border-stone-200 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Link href="/cases" className="hover:opacity-80 transition-opacity" aria-label="Xeni home">
            <XeniLogo size="md" />
          </Link>
          <span className="text-stone-300 text-sm">/</span>
          <WorkspaceSelector
            currentWorkspace={workspace}
            onSelect={(id) => router.push(ROUTES.OPS_WORKSPACE(id))}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            className="size-8 rounded-full bg-[#0E4268] text-white font-medium flex items-center justify-center text-sm"
            aria-label="User menu"
          >
            AD
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 py-6 flex-1 w-full">
        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={<Briefcase className="size-5 text-blue-600" />}
            label="Total Cases"
            value={stats.totalCases}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<CalendarDays className="size-5 text-emerald-600" />}
            label="Case in This Month"
            value={stats.casesThisMonth}
            bgColor="bg-emerald-50"
          />
          <StatCard
            icon={<Users className="size-5 text-violet-600" />}
            label="Total Users"
            value={stats.totalUsers}
            bgColor="bg-violet-50"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4">
          <button
            onClick={() => handleTabChange("cases")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "cases"
                ? "bg-[#0E4268] text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Cases
          </button>
          <button
            onClick={() => handleTabChange("users")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "users"
                ? "bg-[#0E4268] text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Users
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
          <input
            type="text"
            placeholder={activeTab === "cases" ? "Search cases..." : "Search users..."}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-lg bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0E4268]/20 focus:border-[#0E4268] transition-colors"
          />
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          {activeTab === "cases" ? (
            <CasesTable cases={paginatedItems as typeof workspace.cases} />
          ) : (
            <UsersTable users={paginatedItems as typeof workspace.users} />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            {getPaginationRange(currentPage, totalPages).map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-stone-400 text-sm">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={`size-9 rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? "bg-[#0E4268] text-white"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-stone-400">
        Version-1.0.4
      </footer>
    </div>
  );
}

// ============================================================================
// STAT CARD
// ============================================================================
function StatCard({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
      <div className={`size-10 rounded-lg ${bgColor} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-stone-500">{label}</p>
        <p className="text-2xl font-semibold text-stone-800 tabular-nums">{value}</p>
      </div>
    </div>
  );
}

// ============================================================================
// WORKSPACE SELECTOR (dropdown in header)
// ============================================================================
function WorkspaceSelector({
  currentWorkspace,
  onSelect,
}: {
  currentWorkspace: Workspace;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allWorkspaces = MOCK_WORKSPACES.filter((ws) => ws.status === "approved");
  const filtered = searchQuery.trim()
    ? allWorkspaces.filter((ws) =>
        ws.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allWorkspaces;

  const color = getAvatarColor(currentWorkspace.name);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-stone-50 transition-colors"
      >
        <div
          className="size-6 rounded flex items-center justify-center text-white font-semibold text-xs"
          style={{ backgroundColor: color }}
        >
          {getInitial(currentWorkspace.name)}
        </div>
        <span className="text-sm font-medium text-stone-700">
          {currentWorkspace.name}
        </span>
        <ChevronDown className={`size-3.5 text-stone-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-stone-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-stone-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search workspace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-stone-200 rounded-lg placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0E4268]/20 focus:border-[#0E4268]"
                autoFocus
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-xs text-stone-400 text-center">No workspaces found</p>
            ) : (
              filtered.map((ws) => {
                const wsColor = getAvatarColor(ws.name);
                const isActive = ws.id === currentWorkspace.id;
                return (
                  <button
                    key={ws.id}
                    onClick={() => {
                      onSelect(ws.id);
                      setOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-stone-50 transition-colors ${
                      isActive ? "bg-stone-50" : ""
                    }`}
                  >
                    <div
                      className="size-6 rounded flex items-center justify-center text-white font-semibold text-xs shrink-0"
                      style={{ backgroundColor: wsColor }}
                    >
                      {getInitial(ws.name)}
                    </div>
                    <span className="flex-1 truncate text-stone-700 font-medium">
                      {ws.name}
                    </span>
                    {isActive && (
                      <Check className="size-4 text-[#0E4268] shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CASES TABLE
// ============================================================================
function CasesTable({ cases }: { cases: { id: string; createdAt: string; createdBy: string }[] }) {
  if (cases.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-stone-400">No cases found</div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-stone-100">
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3">Case ID</th>
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3">Created At</th>
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3">Created By</th>
        </tr>
      </thead>
      <tbody>
        {cases.map((c) => (
          <tr key={c.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
            <td className="px-4 py-3 text-sm text-stone-700 font-mono">{c.id}</td>
            <td className="px-4 py-3 text-sm text-stone-500">{formatDate(c.createdAt, "long")}</td>
            <td className="px-4 py-3 text-sm text-stone-700">{c.createdBy}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ============================================================================
// USERS TABLE
// ============================================================================
function UsersTable({ users }: { users: { id: string; name: string; email: string; status: "active" | "inactive" }[] }) {
  if (users.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-stone-400">No users found</div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-stone-100">
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3">User name</th>
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3">Email</th>
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3">Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
            <td className="px-4 py-3 text-sm text-stone-700 font-medium">{u.name}</td>
            <td className="px-4 py-3 text-sm text-stone-500">{u.email}</td>
            <td className="px-4 py-3">
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                  u.status === "active"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-stone-100 text-stone-500 border border-stone-200"
                }`}
              >
                {u.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ============================================================================
// PAGINATION HELPER
// ============================================================================
function getPaginationRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [];
  pages.push(1);

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}
