
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
   styleUrls: ['./login.css'] 
})
export class LoginComponent {

  form: any;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;

    const success = this.authService.login(username, password);

    if (success) {
      const role = this.authService.getUser().role;

      if (role === 'admin') this.router.navigate(['/admin']);
      else if (role === 'recruiter') this.router.navigate(['/recruiter']);
      else this.router.navigate(['/jobs']);
    } else {
      alert('Invalid credentials');
    }
  }
}
