// Angular
import { Component, EventEmitter, Input, Output } from '@angular/core';

// Types
import { ActionButtons } from '@shared/types/action-buttons.type';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  templateUrl: './action-buttons.component.html',
})
export class ActionButtonsComponent {
  @Input() entity!: ActionButtons;
  @Input() disableDeletion!: boolean;
  @Output() editEntity: EventEmitter<ActionButtons> =
    new EventEmitter<ActionButtons>();
  @Output() deleteEntity: EventEmitter<ActionButtons> =
    new EventEmitter<ActionButtons>();

  edit(): void {
    this.editEntity.emit(this.entity);
  }

  delete(): void {
    this.deleteEntity.emit(this.entity);
  }

  getUserRole(user: ActionButtons): string {
    return 'role' in user ? user.role : '';
  }

  disable(): boolean {
    return this.disableDeletion && this.getUserRole(this.entity) === 'admin';
  }
}
