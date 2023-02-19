import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from './todo';
import { TodoService } from './todo-service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-root',
  template: `
    <div *ngFor="let todo of todos$ | async">
      {{ todo.title }}
      <button (click)="onUpdate(todo)">Update</button>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  todos$: Observable<Todo[]> = this.todoService.todos$;

  constructor(private todoService: TodoService) {}

  onUpdate(todo: Todo) {
    this.todoService.update(todo);
  }
}
