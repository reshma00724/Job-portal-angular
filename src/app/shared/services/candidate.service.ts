import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Candidate {
  id: number;
  name: string;
  email: string;
  position: string;
  status: string;
  appliedDate: string;
}

export interface PaginatedResponse {
  data: Candidate[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl = 'http://localhost:3000/api/candidates';

  constructor(private http: HttpClient) {}

  /**
   * Get candidates with pagination, search, and sort from backend
   * @param page - Page number (1-based)
   * @param pageSize - Items per page
   * @param search - Search term (optional)
   * @param sortBy - Sort field (optional)
   * @returns Observable of paginated response
   */
  getCandidates(
    page: number,
    pageSize: number,
    search?: string,
    sortBy?: string
  ): Observable<PaginatedResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }

    return this.http.get<PaginatedResponse>(this.apiUrl, { params });
  }
}
