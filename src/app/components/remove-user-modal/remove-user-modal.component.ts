import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../../../services/user-state.service';
import { combineLatest } from 'rxjs';
import { TUser } from '../../../types/TUser';

@Component({
  selector: 'app-remove-user-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './remove-user-modal.component.html',
})
export class RemoveUserModalComponent implements OnInit {
  filteredUsers: TUser[] = [];
  selectedUserId!: string;
  selectedUsername!: string;

  constructor(private userStateService: UserStateService) {}

  ngOnInit() {
    combineLatest([
      this.userStateService.filteredUsers$,
      this.userStateService.selectedUserId$,
    ]).subscribe(([users, id]) => {
      this.filteredUsers = users;
      this.selectedUserId = id;
      const selectedUser = users.find((user) => user.id === id);
      this.selectedUsername = selectedUser ? selectedUser.username : '';
    });
  }

  setModalVisibility(mode: 'add' | 'edit' | 'remove', visibility: boolean) {
    this.userStateService.setModalVisibility(mode, visibility);
  }

  deleteUser(userId: string) {
    this.userStateService.deleteUser(userId);
  }
}
