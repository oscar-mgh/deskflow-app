export interface Ticket {
  id: number;
  code: string;
  title: string;
  description: string;
  categoryName: string;
  priority: string;
  status: string;
  createdAt: Date;
  updatedAt?: Date;
  file?: File;
  agentId?: string;
  userId: string;
}

export interface TicketPagination {
  content: Ticket[];
  last?: boolean;
  page?: number;
  size?: number;
  totalElements: number;
  totalPages?: number;
}

export interface KPI {
  id: string;
  label: string;
  val: string | number;
  color: string;
}

export interface MenuItem {
  link: string;
  icon: string;
  label: string;
  exact?: boolean;
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  createdAt: Date;
}