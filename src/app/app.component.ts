import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { UserStateService } from '../services/user-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, UsersTableComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private userStateService: UserStateService) {}

  ngOnInit() {
    this.userStateService.fetchUsers();
  }
}
