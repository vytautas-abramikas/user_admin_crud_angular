import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../../../services/user-state.service';
import { combineLatest } from 'rxjs';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
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
      id: [''],
      username: ['', [Validators.minLength(3)]],
      name: ['', [Validators.minLength(3)]],
      email: ['', [this.emailValidator()]],
      role: ['User'],
    });
  }

  emptyUser(): TUser {
    return { id: '', username: '', name: '', email: '', role: 'User' };
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

  handleSubmit() {
    if (this.userForm.valid) {
      const userToSave = { ...this.userForm.value };
      if (this.userModalMode === 'add') {
        this.userStateService.createUser({
          ...userToSave,
          id: Date.now().toString(),
        });
      } else {
        this.userStateService.updateUser(userToSave);
      }
      this.userStateService.setModalVisibility(this.userModalMode, false);
    }
  }

  closeUserModal() {
    this.userStateService.setModalVisibility(this.userModalMode, false);
  }

  emailValidator(): ValidatorFn {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (control: AbstractControl): Record<string, string> | null => {
      const valid = emailRegex.test(control.value);
      return valid ? null : { invalidEmail: control.value };
    };
  }
}
