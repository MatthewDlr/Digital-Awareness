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
        console.log('Changes Pending: ', this.areChangesPending);
      },
    });
    this.pendingChangesService.canChangesBeValidated.subscribe({
      next: (state) => {
        this.canChangesBeValidated = state;
        this.cdRef.detectChanges();
        console.log('Can Be Validated ? ', state);
      },
    });
    this.validationDate =
      this.pendingChangesService.getValidationDate() as unknown as string;
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
