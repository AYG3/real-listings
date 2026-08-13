export type AgentStatus = "pending" | "active" | "rejected";

export type Agent = {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  businessName: string;
  signedUp: string;
  requestedAt: string;
  status: AgentStatus;
  listings: number;
  rating: string;
  verificationDocument: string;
};

export const agents: Agent[] = [
  {
    id: "blessing-nnamdi",
    name: "Blessing Nnamdi",
    initials: "BN",
    email: "blessing.nnamdi@gmail.com",
    phone: "+234 803 555 0142",
    city: "Port Harcourt",
    state: "Rivers",
    businessName: "Nnamdi Homes & Properties",
    signedUp: "Jul 29, 2026",
    requestedAt: "5h ago",
    status: "pending",
    listings: 0,
    rating: "New",
    verificationDocument: "National ID.pdf",
  },
  {
    id: "musa-bello",
    name: "Musa Bello",
    initials: "MB",
    email: "musa.bello@yahoo.com",
    phone: "+234 806 110 2341",
    city: "Abuja",
    state: "FCT",
    businessName: "Bello Realty Partners",
    signedUp: "Jul 28, 2026",
    requestedAt: "1d ago",
    status: "pending",
    listings: 0,
    rating: "New",
    verificationDocument: "CAC Certificate.pdf",
  },
  {
    id: "chidi-okafor",
    name: "Chidi Okafor",
    initials: "CO",
    email: "chidi.okafor@outlook.com",
    phone: "+234 802 445 7819",
    city: "Lagos",
    state: "Lagos",
    businessName: "Okafor Luxury Homes",
    signedUp: "Jul 27, 2026",
    requestedAt: "2d ago",
    status: "pending",
    listings: 0,
    rating: "New",
    verificationDocument: "Drivers License.pdf",
  },
  {
    id: "funmi-adebayo",
    name: "Funmi Adebayo",
    initials: "FA",
    email: "funmi.a@gmail.com",
    phone: "+234 805 317 9021",
    city: "Lagos",
    state: "Lagos",
    businessName: "Adebayo Property Desk",
    signedUp: "Jul 27, 2026",
    requestedAt: "2d ago",
    status: "pending",
    listings: 0,
    rating: "New",
    verificationDocument: "Passport.pdf",
  },
  {
    id: "ifeoma-eze",
    name: "Ifeoma Eze",
    initials: "IE",
    email: "ifeoma.eze@gmail.com",
    phone: "+234 809 733 1180",
    city: "Abuja",
    state: "FCT",
    businessName: "Eze Homes",
    signedUp: "Jul 26, 2026",
    requestedAt: "3d ago",
    status: "pending",
    listings: 0,
    rating: "New",
    verificationDocument: "National ID.pdf",
  },
  {
    id: "ada-lawal",
    name: "Ada Lawal",
    initials: "AL",
    email: "ada.lawal@alaraproperties.com",
    phone: "+234 701 880 6504",
    city: "Lekki",
    state: "Lagos",
    businessName: "Alara Prime Agents",
    signedUp: "Jun 18, 2026",
    requestedAt: "Approved Jun 19",
    status: "active",
    listings: 24,
    rating: "4.8",
    verificationDocument: "CAC Certificate.pdf",
  },
  {
    id: "tunde-bakare",
    name: "Tunde Bakare",
    initials: "TB",
    email: "tunde.bakare@gmail.com",
    phone: "+234 803 112 7780",
    city: "Ibadan",
    state: "Oyo",
    businessName: "Bakare Land Advisory",
    signedUp: "May 11, 2026",
    requestedAt: "Approved May 12",
    status: "active",
    listings: 18,
    rating: "4.6",
    verificationDocument: "Voters Card.pdf",
  },
  {
    id: "kemi-olaitan",
    name: "Kemi Olaitan",
    initials: "KO",
    email: "kemi.olaitan@gmail.com",
    phone: "+234 807 991 2355",
    city: "Ikeja",
    state: "Lagos",
    businessName: "Olaitan City Homes",
    signedUp: "Apr 03, 2026",
    requestedAt: "Rejected Apr 04",
    status: "rejected",
    listings: 0,
    rating: "N/A",
    verificationDocument: "Expired ID.pdf",
  },
];

export const pendingAgents = agents.filter((agent) => agent.status === "pending");
