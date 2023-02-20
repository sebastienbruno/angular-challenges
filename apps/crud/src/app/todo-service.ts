import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { randText } from '@ngneat/falso';
import { BehaviorSubject, finalize, merge, tap } from 'rxjs';
import { Todo } from './todo';

const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';
@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private http = inject(HttpClient);

  private _todos: Todo[] = [];

  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$ = this.loadingSubject.asObservable();

  private todosSubject = new BehaviorSubject<Todo[]>(this._todos);
  public todos$ = merge(
    this.http.get<Todo[]>(BASE_URL),
    this.todosSubject
  ).pipe(
    tap((todos) => (this._todos = todos)),
    tap(() => this.loadingSubject.next(false)),
    finalize(() => this.loadingSubject.next(false))
  );

  update(todo: Todo) {
    this.loadingSubject.next(true);
    this.http
      .put<Todo>(
        `${BASE_URL}/${todo.id}`,
        JSON.stringify({
          todo: todo.id,
          title: randText(),
          //body: todo.body,
          userId: todo.userId,
        })
      )
      .subscribe((todoUpdated: Todo) => {
        const indexToUpdate = this._todos.findIndex(
          (t) => t.id === todoUpdated.id
        );
        this.todosSubject.next([
          ...this._todos.slice(0, indexToUpdate),
          todoUpdated,
          ...this._todos.slice(indexToUpdate + 1),
        ]);
      });
  }

  delete(todo: Todo) {
    this.loadingSubject.next(true);
    this.http.delete<Todo>(`${BASE_URL}/${todo.id}`).subscribe(() => {
      const indexToDelete = this._todos.findIndex((t) => t.id === todo.id);
      this.todosSubject.next([
        ...this._todos.slice(0, indexToDelete),
        ...this._todos.slice(indexToDelete + 1),
      ]);
    });
  }

  stopLoading() {
    this.loadingSubject.next(false);
  }
}
