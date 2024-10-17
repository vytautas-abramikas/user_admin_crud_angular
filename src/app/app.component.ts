import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../services/user-state.service';
import { Observable } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { RemoveUserModalComponent } from './remove-user-modal/remove-user-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    UsersTableComponent,
    UserModalComponent,
    RemoveUserModalComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'app';
  isVisibleAddUserModal$: Observable<boolean>;
  isVisibleEditUserModal$: Observable<boolean>;
  isVisibleRemoveUserModal$: Observable<boolean>;

  constructor(private userStateService: UserStateService) {
    this.isVisibleAddUserModal$ = this.userStateService.isVisibleAddUserModal$;
    this.isVisibleEditUserModal$ =
      this.userStateService.isVisibleEditUserModal$;
    this.isVisibleRemoveUserModal$ =
      this.userStateService.isVisibleRemoveUserModal$;
  }

  ngOnInit() {
    this.userStateService.fetchUsers();
  }
}
