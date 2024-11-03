import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(public router: Router) {}
  isNavbarCollapsed = true;
  navItems = ['Home', 'About', 'Services', 'Contact'];

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
  navigateToSearch() {
    this.router.navigate(['/search']);
  }
}
