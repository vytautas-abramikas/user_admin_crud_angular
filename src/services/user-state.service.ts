import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TUser } from '../types/TUser';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private usersSubject = new BehaviorSubject<TUser[]>([]);
  private filterTermSubject = new BehaviorSubject<string>('');
  private userModalModeSubject = new BehaviorSubject<'add' | 'edit'>('add');
  private selectedUserIdSubject = new BehaviorSubject<string>('');
  private isVisibleAddUserModalSubject = new BehaviorSubject<boolean>(false);
  private isVisibleEditUserModalSubject = new BehaviorSubject<boolean>(false);
  private isVisibleRemoveUserModalSubject = new BehaviorSubject<boolean>(false);

  users$ = this.usersSubject.asObservable();
  filteredUsers$: Observable<TUser[]>;
  filterTerm$ = this.filterTermSubject.asObservable();
  userModalMode$ = this.userModalModeSubject.asObservable();
  selectedUserId$ = this.selectedUserIdSubject.asObservable();
  isVisibleAddUserModal$ = this.isVisibleAddUserModalSubject.asObservable();
  isVisibleEditUserModal$ = this.isVisibleEditUserModalSubject.asObservable();
  isVisibleRemoveUserModal$ =
    this.isVisibleRemoveUserModalSubject.asObservable();

  constructor(private http: HttpClient) {
    this.filteredUsers$ = combineLatest([this.users$, this.filterTerm$]).pipe(
      map(([users, filterTerm]) => {
        const lowerFilterTerm = filterTerm.toLowerCase();
        return users.filter(
          (user) =>
            user.name.toLowerCase().includes(lowerFilterTerm) ||
            user.username.toLowerCase().includes(lowerFilterTerm) ||
            user.email.toLowerCase().includes(lowerFilterTerm) ||
            user.role.toLowerCase().includes(lowerFilterTerm)
        );
      })
    );
  }

  fetchUsers() {
    this.http.get<TUser[]>('http://localhost:3002/users').subscribe(
      (users) => this.usersSubject.next(users),
      (error) => console.error('Error fetching users:', error)
    );
  }

  createUser(user: TUser) {
    this.http.post<TUser>('http://localhost:3002/users', user).subscribe(
      (newUser) => {
        this.usersSubject.next([...this.usersSubject.value, newUser]);
        this.setModalVisibility('add', false);
      },
      (error) => console.error('Error adding user:', error)
    );
  }

  updateUser(updatedUser: TUser) {
    this.http
      .put<TUser>(`http://localhost:3002/users/${updatedUser.id}`, updatedUser)
      .subscribe(
        (updated) => {
          const updatedUsers = this.usersSubject.value.map((user) =>
            user.id === updated.id ? updated : user
          );
          this.usersSubject.next(updatedUsers);
          this.setModalVisibility('edit', false);
        },
        (error) => console.error('Error editing user:', error)
      );
  }

  deleteUser(userId: string) {
    this.http.delete(`http://localhost:3002/users/${userId}`).subscribe(
      () => {
        const updatedUsers = this.usersSubject.value.filter(
          (user) => user.id !== userId
        );
        this.usersSubject.next(updatedUsers);
        this.setModalVisibility('remove', false);
      },
      (error) => console.error('Error removing user:', error)
    );
  }

  setFilterTerm(term: string) {
    this.filterTermSubject.next(term);
  }

  setUserModalMode(mode: 'add' | 'edit') {
    this.userModalModeSubject.next(mode);
  }

  setSelectedUserId(id: string) {
    this.selectedUserIdSubject.next(id);
  }

  setModalVisibility(modal: 'add' | 'edit' | 'remove', visibility: boolean) {
    switch (modal) {
      case 'add':
        this.isVisibleAddUserModalSubject.next(visibility);
        break;
      case 'edit':
        this.isVisibleEditUserModalSubject.next(visibility);
        break;
      case 'remove':
        this.isVisibleRemoveUserModalSubject.next(visibility);
        break;
      default:
        break;
    }
  }
}
