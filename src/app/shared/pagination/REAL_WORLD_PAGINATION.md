# Real-World Production Pagination - Interview Guide

## Overview
This guide explains how to implement **production-ready pagination** with real API integration, including search, sort, loading states, and error handling. This is what companies expect in real-world applications.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│         RealPaginationComponent (Container)            │
│  - Manages state with Signals                           │
│  - Uses effect() to sync filters with API calls         │
│  - Displays UI using @if/@for control flow              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ CandidateService│ (Facade)
        │ - getCandidates()
        │ - Builds HttpParams
        │ - Returns Observable
        └────────────┬────┘
                     │
                     ▼
              ┌──────────────┐
              │  HttpClient  │ (Angular)
              │  Backend API │
              └──────────────┘
```

---

## Key Technologies

### 1. **Angular Signals** 
Modern state management (replaces RxJS subjects in many cases):
```typescript
currentPage = signal(1);        // Current page number
searchTerm = signal('');        // Search text
candidates = signal<Candidate[]>([]); // API data
isLoading = signal(false);      // Loading indicator
```

### 2. **Effect Hook** (Angular 16+)
Runs code automatically when signals change:
```typescript
constructor(private candidateService: CandidateService) {
  effect(() => {
    // This runs EVERY TIME any signal used here changes
    this.loadCandidates();
  });
}
```

### 3. **HttpParams**
Builds query strings safely:
```typescript
const params = new HttpParams()
  .set('page', page.toString())
  .set('pageSize', pageSize.toString())
  .set('search', search || '');
```

### 4. **Modern Control Flow**
Replace `*ngIf` and `*ngFor` with `@if` and `@for`:
```html
@if (isLoading()) {
  <p>Loading...</p>
}

@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}
```

---

## Component Flow

### **User Action** → **Signal Update** → **Effect Trigger** → **API Call** → **Data Update** → **UI Render**

```
User clicks search box
        ↓
    onSearch('John')
        ↓
   searchTerm.set('John')
        ↓
   effect() detects signal change
        ↓
   loadCandidates() called
        ↓
   candidateService.getCandidates(1, 10, 'John', 'date')
        ↓
   HttpClient sends GET /api/candidates?page=1&pageSize=10&search=John&sortBy=date
        ↓
   Backend returns PaginatedResponse { data: [...], totalPages: 5, ... }
        ↓
   candidates.set(response.data)
        ↓
   UI re-renders with new data
```

---

## Interview Questions & Answers

### Q1: "How do you handle pagination with search/filter in production?"

**Answer:**
```
1. Component maintains state with Signals:
   - currentPage, searchTerm, sortBy, pageSize
   
2. Use effect() hook to automatically sync:
   - Whenever page/search/sort changes, effect() runs
   - Calls API with new parameters
   
3. Service layer (CandidateService):
   - Builds HttpParams for query string
   - Returns Observable<PaginatedResponse>
   
4. Handle states in component:
   - isLoading: show spinner during request
   - error: show error message if fails
   - candidates: display results in table
   
5. Template uses modern control flow:
   - @if for conditional rendering
   - @for for looping with track for performance
```

**Demo Code:**
```typescript
// Component
currentPage = signal(1);
searchTerm = signal('');

constructor(private service: CandidateService) {
  effect(() => {
    // Auto-fetch when signals change
    this.loadCandidates();
  });
}

onSearch(term: string) {
  this.searchTerm.set(term);
  this.currentPage.set(1); // Reset pagination
}
```

---

### Q2: "Why use Signals with effect() instead of RxJS?"

**Answer:**
```
Signals are better for this use case because:

1. Simple & Readable:
   - Signals are synchronous, easier to understand
   - No rxjs operators needed (map, switchMap, etc.)
   
2. Automatic Change Detection:
   - OnPush detects signal changes automatically
   - effect() tracks dependencies automatically
   
3. Less Boilerplate:
   - No need for takeUntil() cleanup subscriptions
   - No memory leak risk
   
4. Performance:
   - Signals are more efficient than observables for simple state
   
However, RxJS is still great for:
- Complex data transformations
- Multiple async operations
- Reactive pipelines
```

---

### Q3: "How do you prevent multiple API calls when filters change?"

**Answer:**
```
Three strategies:

1. **Use effect() correctly:**
   - effect() itself manages subscriptions
   - Only runs when dependencies change
   
2. **Reset pagination when filtering:**
   - When user searches, go back to page 1
   - Prevents "no results" on page 5 after search
   
3. **Add loading state:**
   - Disable search input while loading
   - Prevent rapid clicks
```

**Code:**
```typescript
onSearch(term: string) {
  this.searchTerm.set(term);
  this.currentPage.set(1); // Shows page 1, triggers API call
  this.isLoading.set(true); // Disable UI during request
}
```

---

### Q4: "How do you handle API errors in pagination?"

**Answer:**
```
1. Try-catch in service or error handler in component
2. Set error signal with user-friendly message
3. Display error in UI
4. Provide "Retry" button to call loadCandidates() again
```

**Code:**
```typescript
private loadCandidates() {
  this.isLoading.set(true);
  this.error.set(null);

  this.service.getCandidates(...)
    .subscribe({
      next: (response) => {
        this.candidates.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load candidates');
        this.isLoading.set(false);
      }
    });
}
```

---

### Q5: "How do you display smart page numbers (max 5)?"

**Answer:**
```
Calculate which pages to show:

For 100 items with 10 per page = 10 total pages
On page 3, show: [1, 2, 3, 4, 5]
On page 8, show: [6, 7, 8, 9, 10]

Algorithm:
1. Get current page
2. Calculate start: current - 2 (show 2 pages before)
3. Calculate end: current + 2 (show 2 pages after)
4. Clamp to [1, totalPages]
```

**Code:**
```typescript
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
```

---

## Component Implementation Summary

### **State Management**
```typescript
// Page and filters
currentPage = signal(1);
pageSize = signal(10);
searchTerm = signal('');
sortBy = signal('date');

// Data from API
candidates = signal<Candidate[]>([]);
totalPages = signal(0);
totalItems = signal(0);

// Loading and errors
isLoading = signal(false);
error = signal<string | null>(null);
```

### **Reactive Fetching**
```typescript
constructor(private candidateService: CandidateService) {
  effect(() => {
    // Automatically runs when any used signal changes
    this.loadCandidates();
  });
}

private loadCandidates() {
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
      next: (response) => {
        this.candidates.set(response.data);
        this.totalPages.set(response.totalPages);
        this.totalItems.set(response.totalItems);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load data');
        this.isLoading.set(false);
      }
    });
}
```

### **User Interactions**
```typescript
onSearch(term: string) {
  this.searchTerm.set(term);
  this.currentPage.set(1); // Reset to page 1
}

onSort(field: string) {
  this.sortBy.set(field);
  this.currentPage.set(1); // Reset to page 1
}

goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages()) {
    this.currentPage.set(page); // Triggers effect() → loadCandidates()
  }
}

goToPrevious() {
  if (this.currentPage() > 1) {
    this.currentPage.set(this.currentPage() - 1);
  }
}

goToNext() {
  if (this.currentPage() < this.totalPages()) {
    this.currentPage.set(this.currentPage() + 1);
  }
}
```

---

## Template Structure

```html
<!-- Search and Sort -->
<input placeholder="Search..." (keyup)="onSearch($event.target.value)">
<select (change)="onSort($event.target.value)">
  <option value="date">Latest</option>
  <option value="name">Name</option>
</select>

<!-- Loading State -->
@if (isLoading()) {
  <p>Loading candidates...</p>
}

<!-- Error State -->
@if (error()) {
  <div class="error">{{ error() }}</div>
  <button (click)="loadCandidates()">Retry</button>
}

<!-- Data Table -->
@if (!isLoading() && !error()) {
  <table>
    @for (candidate of candidates(); track candidate.id) {
      <tr>
        <td>{{ candidate.name }}</td>
        <td>{{ candidate.email }}</td>
      </tr>
    }
  </table>
}

<!-- Pagination Controls -->
@if (!isLoading() && totalPages() > 1) {
  <button (click)="goToPrevious()" [disabled]="currentPage() === 1">
    Previous
  </button>
  
  @for (page of pageNumbers; track page) {
    <button 
      (click)="goToPage(page)"
      [class.active]="page === currentPage()"
    >
      {{ page }}
    </button>
  }
  
  <button (click)="goToNext()" [disabled]="currentPage() === totalPages()">
    Next
  </button>
}

<!-- Info -->
Showing {{ startNumber }} to {{ endNumber }} of {{ totalItems() }}
```

---

## Best Practices for Interview

1. **Always handle loading state** - Shows you think about UX
2. **Always handle errors** - Shows you handle edge cases
3. **Reset pagination on search** - Shows you understand user experience
4. **Use modern syntax (@if, @for)** - Shows you're up-to-date
5. **Signals + effect()** - Shows you know modern Angular
6. **Track in @for** - Shows you care about performance
7. **Disable buttons appropriately** - Shows attention to detail

---

## Testing Checklist

- [ ] Navigate between pages works
- [ ] Search resets to page 1
- [ ] Sort changes data order
- [ ] Loading spinner shows during request
- [ ] Error message displays on API failure
- [ ] Retry button works
- [ ] Previous button disabled on page 1
- [ ] Next button disabled on last page
- [ ] Page numbers show max 5
- [ ] Data displays correctly

---

## Summary

This production-ready pagination implementation demonstrates:
- ✅ Modern Angular (Signals, effect(), @if/@for)
- ✅ Reactive programming principles
- ✅ Proper HTTP integration
- ✅ User-friendly UX (loading, errors, search, sort)
- ✅ Performance optimization (OnPush, track in loops)
- ✅ Clean separation of concerns (Service + Component)

**This is interview-ready code that works in real production apps!**
