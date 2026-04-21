import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  /**
   * Get paginated items from an array
   * @param items - All items
   * @param pageNumber - Current page (1-based, not 0-based)
   * @param pageSize - Items per page
   * @returns Paginated items for current page
   */
  getPaginatedItems<T>(items: T[], pageNumber: number, pageSize: number): T[] {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }

  /**
   * Get total number of pages
   * @param totalItems - Total items count
   * @param pageSize - Items per page
   * @returns Total number of pages
   */
  getTotalPages(totalItems: number, pageSize: number): number {
    return Math.ceil(totalItems / pageSize);
  }

  /**
   * Get page numbers for pagination controls
   * @param currentPage - Current page number
   * @param totalPages - Total number of pages
   * @returns Array of page numbers to display
   */
  getPageNumbers(currentPage: number, totalPages: number): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  /**
   * Check if it's first page
   */
  isFirstPage(currentPage: number): boolean {
    return currentPage === 1;
  }

  /**
   * Check if it's last page
   */
  isLastPage(currentPage: number, totalPages: number): boolean {
    return currentPage === totalPages;
  }
}
