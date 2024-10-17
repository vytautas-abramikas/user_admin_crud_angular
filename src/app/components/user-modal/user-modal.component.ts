import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserStateService } from '../../../services/user-state.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { TUser } from '../../../types/TUser';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-modal.component.html',
})
export class UserModalComponent implements OnInit {
  userForm: FormGroup;
  userModalMode!: 'add' | 'edit' | 'remove';
  selectedUserId!: string;
  filteredUsers: TUser[] = [];

  constructor(
    private fb: FormBuilder,
    private userStateService: UserStateService
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', Validators.required],
    });
  }

  ngOnInit() {
    combineLatest([
      this.userStateService.userModalMode$,
      this.userStateService.selectedUserId$,
      this.userStateService.filteredUsers$,
    ]).subscribe(([mode, id, users]) => {
      this.userModalMode = mode;
      this.selectedUserId = id;
      this.filteredUsers = users;
      const userData =
        mode === 'add'
          ? this.emptyUser()
          : users.find((user) => user.id === id) || this.emptyUser();
      this.userForm.patchValue(userData);
    });
  }

  emptyUser(): TUser {
    return { id: '', username: '', name: '', email: '', role: 'User' };
  }

  handleSubmit() {
    if (this.userForm.valid) {
      const userToSave = { ...this.userForm.value };

      if (this.userModalMode === 'add') {
        userToSave.id = Date.now().toString();
        this.userStateService.createUser(userToSave);
      } else {
        this.userStateService.updateUser(userToSave);
      }

      this.userStateService.setModalVisibility(this.userModalMode, false);
    }
  }

  cancel() {
    this.userStateService.setModalVisibility(this.userModalMode, false);
  }
}
