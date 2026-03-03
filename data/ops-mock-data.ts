// ============================================================================
// OPS MOCK DATA — Workspaces, Cases, Users
// ============================================================================

export interface WorkspaceUser {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
}

export interface WorkspaceCase {
  id: string;
  createdAt: string;
  createdBy: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
  status: "approved" | "pending";
  cases: WorkspaceCase[];
  users: WorkspaceUser[];
}

// Letter avatar color palette
const AVATAR_COLORS = [
  "#0E4268", "#2563EB", "#7C3AED", "#DB2777", "#EA580C",
  "#059669", "#D97706", "#4F46E5", "#0891B2", "#BE185D",
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

// ---- Mock workspaces ----

export const MOCK_WORKSPACES: Workspace[] = [
  // Approved workspaces (17)
  {
    id: "ws-001",
    name: "Bruce",
    ownerName: "Bruce Wayne",
    ownerEmail: "bruce@wayne.com",
    createdAt: "2025-10-15T09:30:00Z",
    status: "approved",
    cases: [
      { id: "c7a3e1d0-4f5b-4c8a-9d2e-1a3b5c7d9e0f", createdAt: "2025-12-01T10:00:00Z", createdBy: "Xun Xun" },
      { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", createdAt: "2025-12-05T14:30:00Z", createdBy: "Xun Xun" },
      { id: "f0e1d2c3-b4a5-9687-fedc-ba0987654321", createdAt: "2025-12-10T08:15:00Z", createdBy: "Xun Xun" },
      { id: "11223344-5566-7788-99aa-bbccddeeff00", createdAt: "2025-12-15T16:45:00Z", createdBy: "Xun Xun" },
      { id: "aabbccdd-eeff-0011-2233-445566778899", createdAt: "2025-12-20T11:00:00Z", createdBy: "Xun Xun" },
      { id: "99887766-5544-3322-1100-ffeeddccbbaa", createdAt: "2025-12-25T09:30:00Z", createdBy: "Xun Xun" },
    ],
    users: [
      { id: "u-001", name: "Xun Xun", email: "seasonsolt@gmail.com", status: "active" },
    ],
  },
  {
    id: "ws-002",
    name: "COSX",
    ownerName: "Chen Wei",
    ownerEmail: "chen.wei@cosx.com",
    createdAt: "2025-09-20T14:00:00Z",
    status: "approved",
    cases: [
      { id: "d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a", createdAt: "2025-11-01T09:00:00Z", createdBy: "Chen Wei" },
      { id: "1a2b3c4d-5e6f-7a8b-9c0d-e1f2a3b4c5d6", createdAt: "2025-11-15T13:20:00Z", createdBy: "Li Ming" },
      { id: "e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b", createdAt: "2025-11-28T16:40:00Z", createdBy: "Chen Wei" },
      { id: "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f", createdAt: "2025-12-03T10:10:00Z", createdBy: "Li Ming" },
      { id: "b0c1d2e3-f4a5-6b7c-8d9e-0f1a2b3c4d5e", createdAt: "2025-12-08T15:55:00Z", createdBy: "Wang Fang" },
      { id: "6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c", createdAt: "2025-12-12T08:30:00Z", createdBy: "Chen Wei" },
      { id: "9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d", createdAt: "2025-12-18T11:45:00Z", createdBy: "Li Ming" },
    ],
    users: [
      { id: "u-002", name: "Chen Wei", email: "chen.wei@cosx.com", status: "active" },
      { id: "u-003", name: "Li Ming", email: "li.ming@cosx.com", status: "active" },
      { id: "u-004", name: "Wang Fang", email: "wang.fang@cosx.com", status: "inactive" },
    ],
  },
  {
    id: "ws-003",
    name: "test",
    ownerName: "Test User",
    ownerEmail: "test@example.com",
    createdAt: "2025-11-01T08:00:00Z",
    status: "approved",
    cases: [
      { id: "aa11bb22-cc33-dd44-ee55-ff6677889900", createdAt: "2025-12-01T09:00:00Z", createdBy: "Test User" },
    ],
    users: [
      { id: "u-005", name: "Test User", email: "test@example.com", status: "active" },
    ],
  },
  {
    id: "ws-004",
    name: "test1013_staging",
    ownerName: "QA Team",
    ownerEmail: "qa@staging.com",
    createdAt: "2025-10-13T12:00:00Z",
    status: "approved",
    cases: [
      { id: "bb22cc33-dd44-ee55-ff66-778899001122", createdAt: "2025-10-20T10:00:00Z", createdBy: "QA Bot" },
      { id: "cc33dd44-ee55-ff66-7788-990011223344", createdAt: "2025-10-25T14:00:00Z", createdBy: "QA Team" },
    ],
    users: [
      { id: "u-006", name: "QA Team", email: "qa@staging.com", status: "active" },
      { id: "u-007", name: "QA Bot", email: "bot@staging.com", status: "active" },
    ],
  },
  {
    id: "ws-005",
    name: "teststaging by wyy",
    ownerName: "Wang Yuyang",
    ownerEmail: "wyy@test.com",
    createdAt: "2025-10-20T16:30:00Z",
    status: "approved",
    cases: [],
    users: [
      { id: "u-008", name: "Wang Yuyang", email: "wyy@test.com", status: "active" },
    ],
  },
  {
    id: "ws-006",
    name: "Milo Test",
    ownerName: "Milo Zhang",
    ownerEmail: "milo@test.com",
    createdAt: "2025-09-15T10:00:00Z",
    status: "approved",
    cases: [
      { id: "dd44ee55-ff66-7788-9900-112233445566", createdAt: "2025-10-01T09:00:00Z", createdBy: "Milo Zhang" },
      { id: "ee55ff66-7788-9900-1122-334455667788", createdAt: "2025-10-10T11:00:00Z", createdBy: "Milo Zhang" },
      { id: "ff667788-9900-1122-3344-556677889900", createdAt: "2025-10-18T15:30:00Z", createdBy: "Milo Zhang" },
    ],
    users: [
      { id: "u-009", name: "Milo Zhang", email: "milo@test.com", status: "active" },
    ],
  },
  {
    id: "ws-007",
    name: "JOP",
    ownerName: "James O'Brien",
    ownerEmail: "james@jop.co.uk",
    createdAt: "2025-08-30T09:00:00Z",
    status: "approved",
    cases: [
      { id: "00112233-4455-6677-8899-aabbccddeeff", createdAt: "2025-09-15T10:00:00Z", createdBy: "James O'Brien" },
      { id: "11223344-5566-7788-99aa-bbccddeeff11", createdAt: "2025-10-01T13:00:00Z", createdBy: "Sarah Kim" },
      { id: "22334455-6677-8899-aabb-ccddeeff0011", createdAt: "2025-10-15T08:30:00Z", createdBy: "James O'Brien" },
      { id: "33445566-7788-99aa-bbcc-ddeeff001122", createdAt: "2025-11-01T16:00:00Z", createdBy: "Sarah Kim" },
      { id: "44556677-8899-aabb-ccdd-eeff00112233", createdAt: "2025-11-20T12:00:00Z", createdBy: "James O'Brien" },
    ],
    users: [
      { id: "u-010", name: "James O'Brien", email: "james@jop.co.uk", status: "active" },
      { id: "u-011", name: "Sarah Kim", email: "sarah@jop.co.uk", status: "active" },
    ],
  },
  {
    id: "ws-008",
    name: "Test",
    ownerName: "Admin User",
    ownerEmail: "admin@test.com",
    createdAt: "2025-11-10T14:00:00Z",
    status: "approved",
    cases: [
      { id: "55667788-99aa-bbcc-ddee-ff0011223344", createdAt: "2025-11-15T09:00:00Z", createdBy: "Admin User" },
    ],
    users: [
      { id: "u-012", name: "Admin User", email: "admin@test.com", status: "active" },
    ],
  },
  {
    id: "ws-009",
    name: "Immigration Law Firm",
    ownerName: "Emily Parker",
    ownerEmail: "emily@lawfirm.co.uk",
    createdAt: "2025-07-01T09:00:00Z",
    status: "approved",
    cases: generateCases(25, "Emily Parker", "Tom Harris"),
    users: [
      { id: "u-013", name: "Emily Parker", email: "emily@lawfirm.co.uk", status: "active" },
      { id: "u-014", name: "Tom Harris", email: "tom@lawfirm.co.uk", status: "active" },
      { id: "u-015", name: "Rachel Green", email: "rachel@lawfirm.co.uk", status: "active" },
    ],
  },
  {
    id: "ws-010",
    name: "Visa Solutions Ltd",
    ownerName: "David Clark",
    ownerEmail: "david@visasolutions.com",
    createdAt: "2025-06-15T10:30:00Z",
    status: "approved",
    cases: generateCases(40, "David Clark", "Anna White"),
    users: [
      { id: "u-016", name: "David Clark", email: "david@visasolutions.com", status: "active" },
      { id: "u-017", name: "Anna White", email: "anna@visasolutions.com", status: "active" },
      { id: "u-018", name: "Mark Johnson", email: "mark@visasolutions.com", status: "inactive" },
      { id: "u-019", name: "Sophie Turner", email: "sophie@visasolutions.com", status: "active" },
    ],
  },
  {
    id: "ws-011",
    name: "UK Immigration Advisory",
    ownerName: "Robert Lee",
    ownerEmail: "robert@ukia.org",
    createdAt: "2025-05-20T08:00:00Z",
    status: "approved",
    cases: generateCases(35, "Robert Lee", "Nina Patel"),
    users: [
      { id: "u-020", name: "Robert Lee", email: "robert@ukia.org", status: "active" },
      { id: "u-021", name: "Nina Patel", email: "nina@ukia.org", status: "active" },
      { id: "u-022", name: "Oscar Huang", email: "oscar@ukia.org", status: "active" },
      { id: "u-023", name: "Grace Moore", email: "grace@ukia.org", status: "active" },
      { id: "u-024", name: "Ethan Brown", email: "ethan@ukia.org", status: "inactive" },
    ],
  },
  {
    id: "ws-012",
    name: "Global Mobility",
    ownerName: "Jessica Wu",
    ownerEmail: "jessica@globalmobility.com",
    createdAt: "2025-08-01T11:00:00Z",
    status: "approved",
    cases: generateCases(18, "Jessica Wu", "Kevin Zhang"),
    users: [
      { id: "u-025", name: "Jessica Wu", email: "jessica@globalmobility.com", status: "active" },
      { id: "u-026", name: "Kevin Zhang", email: "kevin@globalmobility.com", status: "active" },
    ],
  },
  {
    id: "ws-013",
    name: "Smith & Associates",
    ownerName: "John Smith",
    ownerEmail: "john@smithlaw.com",
    createdAt: "2025-04-10T09:00:00Z",
    status: "approved",
    cases: generateCases(52, "John Smith", "Mary Davis"),
    users: [
      { id: "u-027", name: "John Smith", email: "john@smithlaw.com", status: "active" },
      { id: "u-028", name: "Mary Davis", email: "mary@smithlaw.com", status: "active" },
      { id: "u-029", name: "Peter Wilson", email: "peter@smithlaw.com", status: "active" },
      { id: "u-030", name: "Laura Chen", email: "laura@smithlaw.com", status: "active" },
      { id: "u-031", name: "Sam Taylor", email: "sam@smithlaw.com", status: "inactive" },
      { id: "u-032", name: "Diana Ross", email: "diana@smithlaw.com", status: "active" },
    ],
  },
  {
    id: "ws-014",
    name: "Quick Visa",
    ownerName: "Alex Turner",
    ownerEmail: "alex@quickvisa.io",
    createdAt: "2025-09-01T08:00:00Z",
    status: "approved",
    cases: generateCases(12, "Alex Turner"),
    users: [
      { id: "u-033", name: "Alex Turner", email: "alex@quickvisa.io", status: "active" },
      { id: "u-034", name: "Ben Foster", email: "ben@quickvisa.io", status: "active" },
    ],
  },
  {
    id: "ws-015",
    name: "Legal Bridge",
    ownerName: "Olivia Martinez",
    ownerEmail: "olivia@legalbridge.com",
    createdAt: "2025-07-20T13:00:00Z",
    status: "approved",
    cases: generateCases(8, "Olivia Martinez"),
    users: [
      { id: "u-035", name: "Olivia Martinez", email: "olivia@legalbridge.com", status: "active" },
    ],
  },
  {
    id: "ws-016",
    name: "PathFinder Immigration",
    ownerName: "Ryan Cooper",
    ownerEmail: "ryan@pathfinder.co.uk",
    createdAt: "2025-08-15T10:00:00Z",
    status: "approved",
    cases: generateCases(4, "Ryan Cooper"),
    users: [
      { id: "u-036", name: "Ryan Cooper", email: "ryan@pathfinder.co.uk", status: "active" },
      { id: "u-037", name: "Emma Watson", email: "emma@pathfinder.co.uk", status: "active" },
      { id: "u-038", name: "Liam Scott", email: "liam@pathfinder.co.uk", status: "active" },
    ],
  },
  {
    id: "ws-017",
    name: "Horizon Consultants",
    ownerName: "Sophia Anderson",
    ownerEmail: "sophia@horizon.com",
    createdAt: "2025-10-01T07:30:00Z",
    status: "approved",
    cases: generateCases(2, "Sophia Anderson"),
    users: [
      { id: "u-039", name: "Sophia Anderson", email: "sophia@horizon.com", status: "active" },
    ],
  },

  // Pending workspaces (3)
  {
    id: "ws-018",
    name: "New Law Practice",
    ownerName: "Daniel Kim",
    ownerEmail: "daniel@newlaw.com",
    createdAt: "2025-12-28T10:00:00Z",
    status: "pending",
    cases: [],
    users: [
      { id: "u-040", name: "Daniel Kim", email: "daniel@newlaw.com", status: "active" },
    ],
  },
  {
    id: "ws-019",
    name: "Swift Immigration",
    ownerName: "Hannah Chen",
    ownerEmail: "hannah@swift.co.uk",
    createdAt: "2025-12-29T15:30:00Z",
    status: "pending",
    cases: [],
    users: [
      { id: "u-041", name: "Hannah Chen", email: "hannah@swift.co.uk", status: "active" },
    ],
  },
  {
    id: "ws-020",
    name: "Premier Advisory",
    ownerName: "Lucas Brown",
    ownerEmail: "lucas@premier.com",
    createdAt: "2025-12-30T09:15:00Z",
    status: "pending",
    cases: [],
    users: [
      { id: "u-042", name: "Lucas Brown", email: "lucas@premier.com", status: "active" },
    ],
  },
];

// ---- Helper to generate random cases ----
function generateCases(count: number, ...creators: string[]): WorkspaceCase[] {
  const cases: WorkspaceCase[] = [];
  const baseDate = new Date("2025-06-01");
  for (let i = 0; i < count; i++) {
    const date = new Date(baseDate.getTime() + i * 3 * 24 * 60 * 60 * 1000 + Math.random() * 86400000);
    const creator = creators[i % creators.length];
    cases.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `case-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 14)}`,
      createdAt: date.toISOString(),
      createdBy: creator,
    });
  }
  return cases;
}

// ---- Aggregate stats ----
export function getOpsStats(workspaces: Workspace[]) {
  const totalWorkspaces = workspaces.length;
  const totalCases = workspaces.reduce((sum, ws) => sum + ws.cases.length, 0);
  const totalUsers = workspaces.reduce((sum, ws) => sum + ws.users.length, 0);
  return { totalWorkspaces, totalCases, totalUsers };
}

export function getWorkspaceStats(workspace: Workspace) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const casesThisMonth = workspace.cases.filter(
    (c) => new Date(c.createdAt) >= startOfMonth
  ).length;
  return {
    totalCases: workspace.cases.length,
    casesThisMonth,
    totalUsers: workspace.users.length,
  };
}
