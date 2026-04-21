import { TestBed } from '@angular/core/testing';
import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let service: PaginationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPaginatedItems', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const pageSize = 3;

    it('should return items for page 1', () => {
      const result = service.getPaginatedItems(items, 1, pageSize);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return items for page 2', () => {
      const result = service.getPaginatedItems(items, 2, pageSize);
      expect(result).toEqual([4, 5, 6]);
    });

    it('should return items for page 3', () => {
      const result = service.getPaginatedItems(items, 3, pageSize);
      expect(result).toEqual([7, 8, 9]);
    });

    it('should return remaining items on last page', () => {
      const result = service.getPaginatedItems(items, 4, pageSize);
      expect(result).toEqual([10]);
    });

    it('should return empty array for page beyond range', () => {
      const result = service.getPaginatedItems(items, 10, pageSize);
      expect(result).toEqual([]);
    });
  });

  describe('getTotalPages', () => {
    it('should calculate total pages correctly', () => {
      expect(service.getTotalPages(10, 3)).toBe(4);
      expect(service.getTotalPages(12, 3)).toBe(4);
      expect(service.getTotalPages(10, 5)).toBe(2);
      expect(service.getTotalPages(10, 10)).toBe(1);
    });

    it('should handle exact division', () => {
      expect(service.getTotalPages(9, 3)).toBe(3);
      expect(service.getTotalPages(100, 10)).toBe(10);
    });
  });

  describe('getPageNumbers', () => {
    it('should return all page numbers', () => {
      const result = service.getPageNumbers(1, 4);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should return correct range', () => {
      const result = service.getPageNumbers(2, 5);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle single page', () => {
      const result = service.getPageNumbers(1, 1);
      expect(result).toEqual([1]);
    });
  });

  describe('isFirstPage', () => {
    it('should return true for page 1', () => {
      expect(service.isFirstPage(1)).toBe(true);
    });

    it('should return false for other pages', () => {
      expect(service.isFirstPage(2)).toBe(false);
      expect(service.isFirstPage(5)).toBe(false);
    });
  });

  describe('isLastPage', () => {
    it('should return true for last page', () => {
      expect(service.isLastPage(4, 4)).toBe(true);
    });

    it('should return false for other pages', () => {
      expect(service.isLastPage(1, 4)).toBe(false);
      expect(service.isLastPage(3, 4)).toBe(false);
    });

    it('should handle single page', () => {
      expect(service.isLastPage(1, 1)).toBe(true);
    });
  });
});
