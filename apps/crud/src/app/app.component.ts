import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from './todo';
import { TodoService } from './todo-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  selector: 'app-root',
  template: `
    <mat-spinner
      class="loading"
      *ngIf="todoService.loading$ | async"></mat-spinner>
    <ng-container *ngIf="todos$ | async as todos">
      <div
        *ngFor="let todo of todos"
        [class.suspense]="todoService.loading$ | async">
        {{ todo.title }}
        <button (click)="onUpdate(todo)">Update</button>
        <button (click)="onDelete(todo)">Delete</button>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .suspense {
        opacity: 0.5;
      }
      .loading {
        position: absolute;
        top: 40px;
        left: 40px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public todoService = inject(TodoService);

  todos$: Observable<Todo[]> = this.todoService.todos$;

  onUpdate(todo: Todo) {
    this.todoService.update(todo);
  }

  onDelete(todo: Todo) {
    this.todoService.delete(todo);
  }
}
