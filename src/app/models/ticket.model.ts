export interface Ticket {
  id: string;
  title: string;
  description: string;
  categoryName: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  file?: File;
}

export interface TicketPagination {
  content: Ticket[];
  last?: boolean;
  page?: number;
  size?: number;
  totalElements: number;
  totalPages?: number;
}