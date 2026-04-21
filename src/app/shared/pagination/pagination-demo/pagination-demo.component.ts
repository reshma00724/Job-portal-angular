import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationService } from '../../services/pagination.service';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-pagination-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination-demo.component.html',
  styleUrls: ['./pagination-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationDemoComponent {
  // All users (sample data)
  allUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com' },
    { id: 6, name: 'Diana Davis', email: 'diana@example.com' },
    { id: 7, name: 'Eve Martinez', email: 'eve@example.com' },
    { id: 8, name: 'Frank Garcia', email: 'frank@example.com' },
    { id: 9, name: 'Grace Lee', email: 'grace@example.com' },
    { id: 10, name: 'Henry Taylor', email: 'henry@example.com' },
    { id: 11, name: 'Ivy Anderson', email: 'ivy@example.com' },
    { id: 12, name: 'Jack White', email: 'jack@example.com' },
  ];

  // Settings
  pageSize = signal(3); // Show 3 items per page
  currentPage = signal(1); // Start at page 1

  constructor(private paginationService: PaginationService) {}

  /**
   * Get users to display on current page
   */
  get paginatedUsers(): User[] {
    return this.paginationService.getPaginatedItems(
      this.allUsers,
      this.currentPage(),
      this.pageSize()
    );
  }

  /**
   * Get total pages
   */
  get totalPages(): number {
    return this.paginationService.getTotalPages(
      this.allUsers.length,
      this.pageSize()
    );
  }

  /**
   * Get page numbers to display
   */
  get pageNumbers(): number[] {
    return this.paginationService.getPageNumbers(
      this.currentPage(),
      this.totalPages
    );
  }

  /**
   * Goto specific page
   */
  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage.set(pageNumber);
    }
  }

  /**
   * Go to previous page
   */
  goToPrevious(): void {
    if (!this.isFirstPage()) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  /**
   * Go to next page
   */
  goToNext(): void {
    if (!this.isLastPage()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  /**
   * Check if current is first page
   */
  isFirstPage(): boolean {
    return this.paginationService.isFirstPage(this.currentPage());
  }

  /**
   * Check if current is last page
   */
  isLastPage(): boolean {
    return this.paginationService.isLastPage(this.currentPage(), this.totalPages);
  }
}
