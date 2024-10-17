import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../../../services/user-state.service';
import { Observable } from 'rxjs';
import { TUser } from '../../../types/TUser';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-table.component.html',
})
export class UsersTableComponent {
  filteredUsers$: Observable<TUser[]>;

  constructor(private userStateService: UserStateService) {
    this.filteredUsers$ = this.userStateService.filteredUsers$;
  }

  handleShowEditUserModal(id: string) {
    this.userStateService.setSelectedUserId(id);
    this.userStateService.setUserModalMode('edit');
    this.userStateService.setModalVisibility('edit', true);
  }

  handleShowRemoveUserModal(id: string) {
    this.userStateService.setSelectedUserId(id);
    this.userStateService.setModalVisibility('remove', true);
  }
}
