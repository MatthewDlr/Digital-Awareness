import { Component } from '@angular/core';
import { PendingChangesService } from '../../services/pending-changes/pending-changes.service';

@Component({
  selector: 'app-pending-changes',
  templateUrl: './pending-changes.component.html',
  styleUrls: ['./pending-changes.component.css'],
})
export class PendingChangesComponent {
  areChangesPending: boolean = false;
  dateUntilChangesCanBeValidated!: Date;

  constructor(private pendingChangesService: PendingChangesService) {
    this.pendingChangesService.areChangesPending.subscribe({
      next: (state) => {
        this.areChangesPending = state;
        console.log('Pending changes updated: ', this.areChangesPending);
      },
    });
    this.dateUntilChangesCanBeValidated =
      this.pendingChangesService.getValidationDate();
  }

  discardChanges() {
    this.pendingChangesService.discardPendingChanges();
  }

  confirmChanges() {
    if (this.pendingChangesService.canBeValidated()) {
      this.pendingChangesService.confirmPendingChanges();
    }
  }
}
