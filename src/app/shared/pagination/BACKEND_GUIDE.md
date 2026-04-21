# Production Pagination - Backend & Mock Data Guide

## Quick Start

To test the real-world pagination component, you have 2 options:

### Option 1: Use Mock Data (No Backend Required)
### Option 2: Set Up a Real Backend

Choose based on your needs!

---

## Option 1: Mock Data with Angular HttpClientTestingModule

### Step 1: Create a Mock Service

```typescript
// src/app/shared/services/candidate.service.mock.ts
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { PaginatedResponse, Candidate } from './candidate.service';

@Injectable()
export class MockCandidateService {
  
  // Sample candidates data
  private allCandidates: Candidate[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', position: 'React Developer', status: 'active', appliedDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', position: 'Angular Developer', status: 'pending', appliedDate: '2024-01-16' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', position: 'Vue Developer', status: 'selected', appliedDate: '2024-01-10' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', position: 'React Developer', status: 'rejected', appliedDate: '2024-01-12' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', position: 'Node.js Developer', status: 'active', appliedDate: '2024-01-18' },
    { id: 6, name: 'Alice Cooper', email: 'alice@example.com', position: 'React Developer', status: 'pending', appliedDate: '2024-01-17' },
    { id: 7, name: 'Bob Davis', email: 'bob@example.com', position: 'Angular Developer', status: 'active', appliedDate: '2024-01-11' },
    { id: 8, name: 'Carol Martinez', email: 'carol@example.com', position: 'React Developer', status: 'selected', appliedDate: '2024-01-14' },
    { id: 9, name: 'David Lee', email: 'david@example.com', position: 'DevOps Engineer', status: 'active', appliedDate: '2024-01-13' },
    { id: 10, name: 'Emma White', email: 'emma@example.com', position: 'React Developer', status: 'pending', appliedDate: '2024-01-19' },
    { id: 11, name: 'Frank Harris', email: 'frank@example.com', position: 'Angular Developer', status: 'active', appliedDate: '2024-01-09' },
    { id: 12, name: 'Grace Taylor', email: 'grace@example.com', position: 'React Developer', status: 'rejected', appliedDate: '2024-01-08' },
    { id: 13, name: 'Henry Clark', email: 'henry@example.com', position: 'Vue Developer', status: 'active', appliedDate: '2024-01-20' },
    { id: 14, name: 'Ivy Rodriguez', email: 'ivy@example.com', position: 'React Developer', status: 'pending', appliedDate: '2024-01-07' },
    { id: 15, name: 'Jack Wilson', email: 'jack@example.com', position: 'Node.js Developer', status: 'selected', appliedDate: '2024-01-21' },
  ];

  getCandidates(
    page: number,
    pageSize: number,
    search?: string,
    sortBy?: string
  ): Observable<PaginatedResponse> {
    
    // Filter by search term
    let filtered = this.allCandidates;
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        c => c.name.toLowerCase().includes(term) || 
             c.email.toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'status') {
      filtered = [...filtered].sort((a, b) => a.status.localeCompare(b.status));
    }
    // default is 'date' - already sorted by appliedDate

    // Paginate
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const data = filtered.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filtered.length / pageSize);

    return of({
      data,
      totalItems: filtered.length,
      currentPage: page,
      pageSize,
      totalPages,
    }).pipe(delay(500)); // Simulate network delay
  }
}
```

### Step 2: Use in Component Testing

```typescript
// In your real-pagination.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { RealPaginationComponent } from './real-pagination.component';
import { CandidateService } from '../../services/candidate.service';
import { MockCandidateService } from '../../services/candidate.service.mock';

describe('RealPaginationComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealPaginationComponent],
      providers: [
        {
          provide: CandidateService,
          useClass: MockCandidateService
        }
      ]
    }).compileComponents();
  });

  it('should load mock candidates', (done) => {
    const fixture = TestBed.createComponent(RealPaginationComponent);
    fixture.detectChanges();

    // Wait for effect() and mock delay
    setTimeout(() => {
      expect(fixture.componentInstance.candidates().length).toBe(10);
      expect(fixture.componentInstance.totalPages()).toBe(2);
      done();
    }, 600);
  });

  it('should filter by search term', (done) => {
    const fixture = TestBed.createComponent(RealPaginationComponent);
    fixture.detectChanges();

    fixture.componentInstance.onSearch('John');

    setTimeout(() => {
      const candidates = fixture.componentInstance.candidates();
      expect(candidates.length).toBeGreaterThan(0);
      expect(candidates.some(c => c.name.includes('John'))).toBe(true);
      done();
    }, 600);
  });
});
```

---

## Option 2: Real Backend with Node.js/Express

### Step 1: Create a Simple Backend Server

```javascript
// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Sample candidates data
const candidates = [
  { id: 1, name: 'John Doe', email: 'john@example.com', position: 'React Developer', status: 'active', appliedDate: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', position: 'Angular Developer', status: 'pending', appliedDate: '2024-01-16' },
  // ... add 13 more from the list above
];

// Pagination endpoint
app.get('/api/candidates', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const search = req.query.search || '';
  const sortBy = req.query.sortBy || 'date';

  // Filter by search
  let filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  // Sort
  switch (sortBy) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'status':
      filtered.sort((a, b) => a.status.localeCompare(b.status));
      break;
    // 'date' is already sorted by appliedDate
  }

  // Paginate
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = filtered.slice(startIndex, endIndex);

  res.json({
    data,
    totalItems: filtered.length,
    currentPage: page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### Step 2: Run the Backend

```bash
# Install dependencies
npm install express cors

# Start server
node server.js

# Should see: Server running on http://localhost:3000
```

### Step 3: Test in Component

```bash
# Go to app
ng serve

# Open browser
# Navigate to http://localhost:4200/real-pagination-demo

# Should see:
# - 10 candidates loading
# - Search/sort working
# - Pagination controls
```

---

## How Pagination Works on Backend

### Backend Receives:
```
GET /api/candidates?page=2&pageSize=10&search=React&sortBy=name

Query Parameters:
- page: 2 (which page, 1-based)
- pageSize: 10 (items per page)
- search: React (filter term)
- sortBy: name (sort field)
```

### Backend Calculates:
```javascript
const startIndex = (page - 1) * pageSize;  // (2-1)*10 = 10
const endIndex = startIndex + pageSize;    // 10+10 = 20
const data = filtered.slice(startIndex, endIndex); // Items 10-19
```

### Backend Returns:
```json
{
  "data": [/* items 10-19 */],
  "totalItems": 47,
  "currentPage": 2,
  "pageSize": 10,
  "totalPages": 5
}
```

### Component Calculates:
```typescript
startNumber = (currentPage - 1) * pageSize + 1 = (2-1)*10+1 = 11
endNumber = Math.min(currentPage * pageSize, totalItems) = Min(20, 47) = 20

Display: "Showing 11 to 20 of 47 candidates | Page 2 of 5"
```

---

## Sample Test Scenarios

### Scenario 1: Initial Load
```
User visits /real-pagination-demo
     ↓
Component initializes with page=1
     ↓
Backend returns items 1-10
     ↓
Display: "Showing 1 to 10 of X candidates"
```

### Scenario 2: Search
```
User enters "John" in search box
     ↓
Frontend: searchTerm.set('John'), currentPage.set(1)
     ↓
Backend: Filter candidates with name/email containing "John"
     ↓
If 3 matches found:
   - totalPages = 1
   - display "Showing 1 to 3 of 3 candidates"
```

### Scenario 3: Pagination
```
User clicks page 3
     ↓
Frontend: currentPage.set(3)
     ↓
Backend: Return items for page 3
     ↓
startIndex = (3-1)*10 = 20
endIndex = 30
Display items 20-30
```

### Scenario 4: Sort
```
User selects "By Name"
     ↓
Frontend: sortBy.set('name'), currentPage.set(1)
     ↓
Backend: Sort filtered results by name (A-Z)
     ↓
Display sorted items starting from page 1
```

---

## Backend Pagination Best Practices

### 1. Validate Page Size
```javascript
const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 100); // Max 100
```

### 2. Offset-Based vs Cursor-Based
```javascript
// Offset-based (simpler for CRUD apps)
const skip = (page - 1) * pageSize;
const data = db.candidates.find().skip(skip).limit(pageSize);

// Cursor-based (better for large datasets)
const data = db.candidates.find({_id: {$gt: lastId}}).limit(pageSize);
```

### 3. Calculate Total Count Efficiently
```javascript
// If data is small, OK to count each time
const total = db.candidates.countDocuments(filter);

// For large data, cache in Redis
const total = cache.get('total_candidates') || db.count();
```

### 4. Add Indexes for Performance
```javascript
// Database indexes for search/sort
db.candidates.createIndex({name: 1}); // For name sort
db.candidates.createIndex({status: 1}); // For status sort
```

---

## Frontend Integration Checklist

- [ ] `CandidateService` configured with correct API URL
- [ ] HTTP module imported in component
- [ ] Backend server running (if using real API)
- [ ] CORS enabled on backend
- [ ] Mock service available for testing (if using mock)
- [ ] `RealPaginationComponent` route added to app.routes.ts
- [ ] Template displays loading spinner during requests
- [ ] Error messages show when API fails
- [ ] Search resets to page 1
- [ ] Sort changes order correctly
- [ ] Pagination buttons work
- [ ] Page numbers limited to max 5
- [ ] Double-check empty state (no results)
- [ ] Test on slow network (Chrome DevTools → Throttle)

---

## Environment Configuration

### For Development (Mock Data)
```typescript
// No need for backend, mock service provides data
// Perfect for quick development and testing
```

### For Staging (Real Backend)
```typescript
// Backend at: http://staging-api.example.com/api/candidates
// Points to staging database
// Full end-to-end testing
```

### For Production (Real Backend)
```typescript
// Backend at: https://api.example.com/api/candidates
// Points to production database
// Security: Use HTTPS, authentication tokens
```

---

## Debugging Tips

### Chrome DevTools Network Tab
- Filter requests: Type `/api/candidates` in search
- Check query parameters
- Check response payload
- Check status code (200, 400, 500, etc.)

### Console Logging
```typescript
// In component
private loadCandidates() {
  console.log('Loading with:', {
    page: this.currentPage(),
    search: this.searchTerm(),
    sort: this.sortBy(),
  });
  
  this.service.getCandidates(...).subscribe({
    next: (res) => {
      console.log('Loaded candidates:', res);
    }
  });
}
```

### Test with Different Network Speeds
```
Chrome DevTools → Network → Throttle
- Fast 3G
- Slow 3G
- Offline
```

---

## Ready to Deploy!

You now have a complete, production-ready pagination system that:
- ✅ Works with mock data (for testing)
- ✅ Works with real backend (for production)
- ✅ Handles search, sort, pagination
- ✅ Shows loading/error states
- ✅ Explains cleanly in interviews
- ✅ Scales to real-world apps

**Choose mock or real backend based on your stage of development!**
