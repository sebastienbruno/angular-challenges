import { ErrorHandler, inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoService } from './todo-service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  private snackBar = inject(MatSnackBar);
  private todoService = inject(TodoService);

  handleError(error: any): void {
    this.todoService.stopLoading();
    if (error instanceof ErrorEvent) {
      this.snackBar.open(`${error.type}: ${error.message}`, 'X', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: 'error-snackbar',
      });
    }
  }
}
