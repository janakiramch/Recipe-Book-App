import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  // dataSaved = false;
  // dataFetched = false;
  // error: string = null;

  private userSub: Subscription;
  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
    alert('Data Saved Successfully');
    this.router.navigate(['/recipes']);
    // this.dataSaved = !this.dataSaved;
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
    alert('Data Fetched Successfully');
    this.router.navigate(['/recipes']);

    // this.dataFetched = !this.dataFetched;
  }

  onLogout() {
    this.authService.logout();
  }

  // onCloseModal() {
  //   this.error = null;
  // }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
