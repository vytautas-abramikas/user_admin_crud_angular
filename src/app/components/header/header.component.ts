import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../../../services/user-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(private userStateService: UserStateService) {}

  showAddUserModal() {
    this.userStateService.setUserModalMode('add');
    this.userStateService.setModalVisibility('add', true);
  }

  setFilterTerm(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    this.userStateService.setFilterTerm(target.value);
  }
}
