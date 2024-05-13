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
  dataSaved = false;
  dataFetched = false;
  //error: string = null;

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
    //alert('Data Saved Successfully');
    this.dataSaved = !this.dataSaved;
    this.router.navigate(['/recipes']);
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
    //alert('Data Fetched Successfully');
    this.dataFetched = !this.dataFetched;
    this.router.navigate(['/recipes']);
  }

  onLogout() {
    this.authService.logout();
  }

  onCloseDataSaveModal() {
    this.dataSaved = !this.dataSaved;
  }

  onCloseDataFetchModal() {
    this.dataFetched = !this.dataFetched;
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
