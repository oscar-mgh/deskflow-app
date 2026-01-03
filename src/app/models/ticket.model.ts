export interface Ticket {
  id: number;
  code: string;
  title: string;
  description: string;
  categoryName: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  file?: File;
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

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  userId: string;
}
