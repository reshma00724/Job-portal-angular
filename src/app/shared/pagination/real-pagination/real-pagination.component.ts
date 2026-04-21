import { Component, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  CandidateService, 
  Candidate, 
  PaginatedResponse 
} from '../../services/candidate.service';

@Component({
  selector: 'app-real-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './real-pagination.component.html',
  styleUrls: ['./real-pagination.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealPaginationComponent {
  // Filters & Pagination
  currentPage = signal(1);
  pageSize = signal(10); // Show 10 per page
  searchTerm = signal('');
  sortBy = signal('date');

  // Data from API
  candidates = signal<Candidate[]>([]);
  totalPages = signal(0);
  totalItems = signal(0);

  // Loading & Error states
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(private candidateService: CandidateService) {
    // Automatically fetch when currentPage, pageSize, searchTerm, or sortBy changes
    effect(() => {
      this.loadCandidates();
    });
  }

  /**
   * Load candidates from API based on current filters/pagination
   */
  private loadCandidates(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.candidateService
      .getCandidates(
        this.currentPage(),
        this.pageSize(),
        this.searchTerm(),
        this.sortBy()
      )
      .subscribe({
        next: (response: PaginatedResponse) => {
          this.candidates.set(response.data);
          this.totalPages.set(response.totalPages);
          this.totalItems.set(response.totalItems);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load candidates. Please try again.');
          this.isLoading.set(false);
          console.error('Error loading candidates:', err);
        },
      });
  }

  /**
   * Handle search input
   */
  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1); // Reset to page 1 on search
  }

  /**
   * Handle sort change
   */
  onSort(field: string): void {
    this.sortBy.set(field);
    this.currentPage.set(1); // Reset to page 1 on sort
  }

  /**
   * Navigate to specific page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  /**
   * Go to previous page
   */
  goToPrevious(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  /**
   * Go to next page
   */
  goToNext(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  /**
   * Get page numbers to display (show max 5 pages)
   */
  get pageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages();
    const current = this.currentPage();
    const maxPages = 5;

    let start = Math.max(1, current - Math.floor(maxPages / 2));
    let end = Math.min(total, start + maxPages - 1);

    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  /**
   * Check if first page
   */
  isFirstPage(): boolean {
    return this.currentPage() === 1;
  }

  /**
   * Check if last page
   */
  isLastPage(): boolean {
    return this.currentPage() === this.totalPages();
  }

  /**
   * Calculate start number for display
   */
  get startNumber(): number {
    return (this.currentPage() - 1) * this.pageSize() + 1;
  }

  /**
   * Calculate end number for display
   */
  get endNumber(): number {
    return Math.min(this.currentPage() * this.pageSize(), this.totalItems());
  }
}
