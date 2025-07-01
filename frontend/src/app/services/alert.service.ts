import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

type AlertType = 'error' | 'success' | 'info' | 'warning';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private snackBar = inject(MatSnackBar);

  private defaultMessages: Record<AlertType, string> = {
    error: 'An error occurred, please try again later',
    success: 'Success',
    info: 'Information',
    warning: 'Warning',
  };

  displayAlert(
      type: AlertType,
      message?: string,
      horizontalPosition?: MatSnackBarHorizontalPosition,
      verticalPosition?: MatSnackBarVerticalPosition,
      panelClass?: string[]
  ) {
    const finalMessage = message ?? this.defaultMessages[type] ?? '';

    this.snackBar.open(finalMessage, 'Cerrar', {
      horizontalPosition: horizontalPosition ?? 'center',
      verticalPosition: verticalPosition ?? 'top',
      panelClass: panelClass ?? [`${type}-snackbar`],
      duration: 3000,
      politeness: 'assertive',
    });
  }
}
