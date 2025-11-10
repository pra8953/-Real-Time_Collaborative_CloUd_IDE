import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
   templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',

  animations: [
    trigger('mobileMenuAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class NavbarComponent implements OnInit {
  isDarkMode = false;
  isMobileMenuOpen = false;
  selectedLanguage = 'en';
  isLanguageDropdownOpen = false;
  searchQuery = '';
  token = localStorage.getItem('token');
  
  ngOnInit() {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleLanguageDropdown() {
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  selectLanguage(language: string) {
    this.selectedLanguage = language;
    this.isLanguageDropdownOpen = false;
    // Add your language change logic here
    console.log('Language changed to:', language);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // Implement your search logic here
    }
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    // Close mobile menu when clicking outside
    if (!target.closest('#mobile-menu') && !target.closest('#mobile-menu-button')) {
      this.isMobileMenuOpen = false;
    }
    
    // Close language dropdown when clicking outside
    if (!target.closest('.language-dropdown')) {
      this.isLanguageDropdownOpen = false;
    }
  }

  // Close dropdowns on escape key
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.isMobileMenuOpen = false;
    this.isLanguageDropdownOpen = false;
  }
}