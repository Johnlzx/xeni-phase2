"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  Briefcase,
  Users,
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { XeniLogo } from "@/components/case-detail/XeniLogo";
import { ROUTES } from "@/data/constants";
import { formatDate } from "@/lib/utils";
import {
  MOCK_WORKSPACES,
  getOpsStats,
  getInitial,
  getAvatarColor,
  type Workspace,
} from "@/data/ops-mock-data";
import { OpsSidebar, type OpsMenuItem } from "@/components/ops/OpsSidebar";
import { FormAccuracyOverview } from "@/components/ops/form-accuracy";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export default function OpsPage() {
  const [activeMenu, setActiveMenu] = useState<OpsMenuItem>("workspaces");
  const [workspaces, setWorkspaces] = useState<Workspace[]>(MOCK_WORKSPACES);
  const [activeTab, setActiveTab] = useState<"approved" | "pending">("approved");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const stats = useMemo(() => getOpsStats(workspaces), [workspaces]);

  const approvedWorkspaces = useMemo(
    () => workspaces.filter((ws) => ws.status === "approved"),
    [workspaces]
  );
  const pendingWorkspaces = useMemo(
    () => workspaces.filter((ws) => ws.status === "pending"),
    [workspaces]
  );

  const filteredWorkspaces = useMemo(() => {
    const list = activeTab === "approved" ? approvedWorkspaces : pendingWorkspaces;
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (ws) =>
        ws.name.toLowerCase().includes(q) ||
        ws.ownerName.toLowerCase().includes(q) ||
        ws.ownerEmail.toLowerCase().includes(q)
    );
  }, [activeTab, approvedWorkspaces, pendingWorkspaces, search]);

  const totalPages = Math.max(1, Math.ceil(filteredWorkspaces.length / PAGE_SIZE));
  const paginatedWorkspaces = filteredWorkspaces.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset page when tab or search changes
  const handleTabChange = (tab: "approved" | "pending") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleApprove = (workspaceId: string) => {
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId ? { ...ws, status: "approved" as const } : ws
      )
    );
    const ws = workspaces.find((w) => w.id === workspaceId);
    toast.success("Workspace approved", {
      description: `"${ws?.name}" has been approved.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <header className="h-14 bg-white border-b border-stone-200 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Link href="/cases" className="hover:opacity-80 transition-opacity" aria-label="Xeni home">
            <XeniLogo size="md" />
          </Link>
          <span className="text-stone-300 text-sm">/</span>
          <span className="text-sm font-medium text-stone-700">Operation Dashboard</span>
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

      {/* Body: Sidebar + Main */}
      <div className="flex flex-1 min-h-0">
        <OpsSidebar activeItem={activeMenu} onNavigate={setActiveMenu} />

        {activeMenu === "workspaces" ? (
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-8 py-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard
                  icon={<Building2 className="size-5 text-blue-600" />}
                  label="Total Workspaces"
                  value={stats.totalWorkspaces}
                  bgColor="bg-blue-50"
                />
                <StatCard
                  icon={<Briefcase className="size-5 text-emerald-600" />}
                  label="Total Cases"
                  value={stats.totalCases}
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
                  onClick={() => handleTabChange("approved")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === "approved"
                      ? "bg-[#0E4268] text-white"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  Approved{" "}
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-xs rounded-full tabular-nums ${
                      activeTab === "approved"
                        ? "bg-white/20 text-white"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {approvedWorkspaces.length}
                  </span>
                </button>
                <button
                  onClick={() => handleTabChange("pending")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === "pending"
                      ? "bg-amber-500 text-white"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  Pending approval{" "}
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-xs rounded-full tabular-nums ${
                      activeTab === "pending"
                        ? "bg-white/20 text-white"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {pendingWorkspaces.length}
                  </span>
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search workspaces..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-lg bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0E4268]/20 focus:border-[#0E4268] transition-colors"
                />
              </div>

              {/* Workspace List */}
              <div className="space-y-2">
                {paginatedWorkspaces.length === 0 ? (
                  <div className="py-12 text-center text-sm text-stone-400">
                    No workspaces found
                  </div>
                ) : (
                  paginatedWorkspaces.map((ws) => (
                    <WorkspaceCard
                      key={ws.id}
                      workspace={ws}
                      onApprove={handleApprove}
                    />
                  ))
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`size-9 rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage
                          ? "bg-[#0E4268] text-white"
                          : "text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </div>
          </main>
        ) : activeMenu === "form-accuracy" ? (
          <FormAccuracyOverview />
        ) : (
          /* Visa Types Placeholder */
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="size-12 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-3">
                <FileText className="size-6 text-stone-400" />
              </div>
              <p className="text-sm font-medium text-stone-700">Visa Types</p>
              <p className="text-xs text-stone-400 mt-1">Coming Soon</p>
            </div>
          </main>
        )}
      </div>
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
// WORKSPACE CARD
// ============================================================================
function WorkspaceCard({
  workspace,
  onApprove,
}: {
  workspace: Workspace;
  onApprove: (id: string) => void;
}) {
  const isPending = workspace.status === "pending";
  const color = getAvatarColor(workspace.name);

  return (
    <div className="bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all px-4 py-3 flex items-center gap-4">
      {/* Avatar */}
      <div
        className="size-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm shrink-0"
        style={{ backgroundColor: color }}
      >
        {getInitial(workspace.name)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={ROUTES.OPS_WORKSPACE(workspace.id)}
          className="text-sm font-semibold text-stone-800 hover:text-[#0E4268] transition-colors"
        >
          {workspace.name}
        </Link>
        <p className="text-xs text-stone-400 truncate">
          {workspace.ownerName} &middot; {workspace.ownerEmail}
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 shrink-0">
        {!isPending && (
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-medium text-stone-500 bg-stone-100 rounded">
              {workspace.cases.length} cases
            </span>
            <span className="px-2 py-1 text-xs font-medium text-stone-500 bg-stone-100 rounded">
              {workspace.users.length} users
            </span>
          </div>
        )}
        <span className="text-xs text-stone-400 whitespace-nowrap">
          {formatDate(workspace.createdAt, "short")}
        </span>
        {isPending && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onApprove(workspace.id);
            }}
            className="size-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300 flex items-center justify-center transition-colors"
            title="Approve workspace"
          >
            <Check className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
