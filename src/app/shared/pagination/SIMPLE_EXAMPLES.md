# Pagination - Super Simple Code Examples

## ⚡ **The Absolute Simplest Version**

### **Service** (Just Math)
```typescript
// 1. Get items for a page
function getPaginatedItems(items, pageNumber, pageSize) {
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return items.slice(startIndex, endIndex);
}

// 2. Calculate total pages
function getTotalPages(totalItems, pageSize) {
  return Math.ceil(totalItems / pageSize);
}

// That's it! Two functions!
```

### **Component** (Just State)
```typescript
export class PaginationComponent {
  // Data
  allUsers = [User1, User2, ..., User12];
  pageSize = 3;
  currentPage = 1;

  // Display items for current page
  get currentPageItems() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.allUsers.slice(start, end);
  }

  // Go to page
  goToPage(page) {
    this.currentPage = page;
  }
}
```

### **Template** (Just HTML)
```html
<!-- Show items -->
<div *ngFor="let user of currentPageItems">
  <p>{{ user.name }}</p>
</div>

<!-- Show page buttons -->
<button *ngFor="let page of [1,2,3,4]" (click)="goToPage(page)">
  {{ page }}
</button>
```

---

## 🎯 **Even SIMPLER Explanation**

### **What Pagination Does:**
```
Input: All 12 users
Output: Show 3 users per page

User clicks Page 1 → Show users 1,2,3
User clicks Page 2 → Show users 4,5,6
User clicks Page 3 → Show users 7,8,9
User clicks Page 4 → Show users 10,11,12
```

### **The Math:**
```
Page 1: users[0:3]   (start at 0, take 3)
Page 2: users[3:6]   (start at 3, take 3)
Page 3: users[6:9]   (start at 6, take 3)
Page 4: users[9:12]  (start at 9, take 3)

Formula: start = (page - 1) × size
```

---

## 💻 **Copy-Paste Ready Code**

### **Option 1: Without Service (Inline)**
```typescript
export class SimplePaginationComponent {
  users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Bob' },
    { id: 4, name: 'Alice' },
    { id: 5, name: 'Charlie' },
    { id: 6, name: 'Diana' },
  ];

  pageSize = 2;
  currentPage = 1;

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.users.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.users.length / this.pageSize);
  }

  changePage(page: number) {
    this.currentPage = page;
  }
}
```

**HTML:**
```html
<!-- Show current page items -->
<div *ngFor="let user of paginatedUsers">
  <p>{{ user.name }}</p>
</div>

<!-- Show page buttons -->
<button *ngFor="let i of [1,2,3,4,5,...totalPages]" 
        (click)="changePage(i)">
  {{ i }}
</button>
```

### **Option 2: With Service (Recommended)**
```typescript
// Service
@Injectable()
export class PaginationService {
  getPaginatedItems(items: any[], page: number, size: number) {
    const start = (page - 1) * size;
    return items.slice(start, start + size);
  }

  getTotalPages(totalItems: number, pageSize: number) {
    return Math.ceil(totalItems / pageSize);
  }
}

// Component
export class PaginationComponent {
  allUsers = [/* 12 users */];
  pageSize = 3;
  currentPage = 1;

  constructor(private pagService: PaginationService) {}

  get paginatedUsers() {
    return this.pagService.getPaginatedItems(
      this.allUsers,
      this.currentPage,
      this.pageSize
    );
  }

  get totalPages() {
    return this.pagService.getTotalPages(
      this.allUsers.length,
      this.pageSize
    );
  }

  goToPage(page: number) {
    this.currentPage = page;
  }
}
```

---

## 📝 **Interview Script**

```
INTERVIEWER: "How would you implement pagination?"

YOU: "Pagination is showing a large list in smaller chunks.

The core logic is simple arithmetic:
- Calculate start index: (pageNumber - 1) × pageSize
- Calculate end index: start + pageSize
- Slice the array: array.slice(start, end)

For example:
- 12 users, 3 per page
- Page 1: slice(0, 3) → users 1,2,3
- Page 2: slice(3, 6) → users 4,5,6

The component manages:
1. Current page number
2. Page size
3. Total items

The template shows:
1. Current page items in a list/table
2. Page number buttons
3. Previous/Next buttons (disabled on first/last)

That's it! No complex algorithms, just basic math and array slicing."

INTERVIEWER: "Show some code"

YOU: "
const newPageItems = items.slice(
  (pageNumber - 1) * pageSize,
  pageNumber * pageSize
);

This single line is the core of pagination!"
```

---

## 🎯 **Key Points to Remember**

1. **It's just math:** (page - 1) × size = start
2. **Use slice():** array.slice(start, end)
3. **Manage one variable:** currentPage
4. **Calculate on demand:** totalPages = Math.ceil(total / size)
5. **Disable buttons smartly:** 
   - Disable "Previous" when page = 1
   - Disable "Next" when page = totalPages

---

## 🚀 **Real-World Example**

### **E-commerce with 100 products**
```
pageSize = 12 (show 12 per page)
totalPages = ceil(100 / 12) = 9 pages

User on Page 1: See products 1-12
User clicks Page 3: See products 25-36
User clicks "Next": Go to Page 4
```

### **Important:** 
- Page 1 "Previous" button = DISABLED
- Page 9 "Next" button = DISABLED
- All other pages = Both buttons enabled

---

## ✨ **That's Pagination!**

**One formula:**
```
items.slice((page - 1) * size, page * size)
```

**That's literally it!**

No complex libraries, no Redux, no fancy state management.

Just:
1. Math
2. Array slicing
3. Button clicks

***Simple!*** 🎉
