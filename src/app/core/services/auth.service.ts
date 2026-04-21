import { Injectable,signal } from '@angular/core';

const USERS = [
  { username: 'admin', password: '123', role: 'admin' },
  { username: 'recruiter', password: '123', role: 'recruiter' },
  { username: 'user', password: '123', role: 'candidate' }
];

@Injectable({
  providedIn: 'root',
})
export class Auth {
   private user = signal<any>(null);

   login(username: string, password: string) {
    const found = USERS.find(
      u => u.username === username && u.password === password
    );

    if (found) {
      this.user.set(found);
      localStorage.setItem('user', JSON.stringify(found));
      return true;
    }
    return false;
  }

  getUser() {
    return this.user();
  }

  logout() {  
    this.user.set(null);
    localStorage.removeItem('user');
  }
}
