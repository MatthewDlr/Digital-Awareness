import { Component, ChangeDetectorRef } from '@angular/core';
import { PendingChangesService } from '../../services/pending-changes/pending-changes.service';

@Component({
  selector: 'app-pending-changes',
  templateUrl: './pending-changes.component.html',
  styleUrls: ['./pending-changes.component.css'],
})
export class PendingChangesComponent {
  areChangesPending: boolean = false;
  validationDate: string = '';
  canChangesBeValidated: boolean = false;

  constructor(
    private pendingChangesService: PendingChangesService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.pendingChangesService.areChangesPending.subscribe({
      next: (state) => {
        this.areChangesPending = state;
        this.cdRef.detectChanges();
      },
    });
    this.pendingChangesService.canChangesBeValidated.subscribe({
      next: (state) => {
        this.canChangesBeValidated = state;
        this.cdRef.detectChanges();
      },
    });
    this.pendingChangesService.validationDate.subscribe({
      next: (date) => {
        if (!(date instanceof Date)) {
          return;
        }
        this.validationDate = String(
          date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0'),
        );
        this.cdRef.detectChanges();
      },
    });
  }

  discardChanges() {
    this.pendingChangesService.discardPendingChanges();
  }

  confirmChanges() {
    if (this.canChangesBeValidated) {
      this.pendingChangesService.confirmPendingChanges();
    }
  }
}
