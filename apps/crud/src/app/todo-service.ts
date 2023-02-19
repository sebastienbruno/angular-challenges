import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { randText } from '@ngneat/falso';
import { BehaviorSubject, merge, tap } from 'rxjs';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  _todos: Todo[] = [];
  todosSubject = new BehaviorSubject<Todo[]>(this._todos);
  todos$ = merge(
    this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos'),
    this.todosSubject
  ).pipe(tap((todos) => (this._todos = todos)));

  constructor(private http: HttpClient) {}

  update(todo: Todo) {
    this.http
      .put<Todo>(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        JSON.stringify({
          todo: todo.id,
          title: randText(),
          //body: todo.body,
          userId: todo.userId,
        }),
        {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
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
}
