import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-login-success',
  imports: [],
  templateUrl: './login-success.html',
  styleUrl: './login-success.css',
})
export class LoginSuccessComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];

      if (!token) {
        this.router.navigate(['/login']);
        return;
      }

      try {
        const decoded: any = jwtDecode(token);

        // Safely read values
        const name = decoded?.name || '';
        const email = decoded?.email || '';

        // Save to local storage
        localStorage.setItem('token', token);
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);

        // Navigate to dashboard
        this.router.navigate(['/dashboard']);

      } catch (error) {
        console.error("JWT decode error:", error);
        this.router.navigate(['/login']);
      }

    });
  }
}
