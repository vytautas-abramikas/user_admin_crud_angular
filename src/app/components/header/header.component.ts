import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../../../services/user-state.service';
import { sanitize } from '../../../lib/sanitize';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('searchInput', { static: true })
  searchInput!: ElementRef<HTMLInputElement>;

  constructor(private userStateService: UserStateService) {}

  ngAfterViewInit() {
    this.searchInput.nativeElement.addEventListener(
      'keydown',
      this.catchIllegalCharacters.bind(this)
    );
  }

  ngOnDestroy() {
    this.searchInput.nativeElement.removeEventListener(
      'keydown',
      this.catchIllegalCharacters.bind(this)
    );
  }

  catchIllegalCharacters(event: KeyboardEvent) {
    const input = event.key;
    const filtered = sanitize(input);
    if (input !== filtered) {
      event.preventDefault();
    }
  }

  showAddUserModal() {
    this.userStateService.setUserModalMode('add');
    this.userStateService.setModalVisibility('add', true);
  }

  setFilterTerm(event: Event) {
    const target = event.target as HTMLInputElement;
    const sanitizedInput = sanitize(target.value);
    target.value = sanitizedInput;
    this.userStateService.setFilterTerm(sanitizedInput);
  }
}
