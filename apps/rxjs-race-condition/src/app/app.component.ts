import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, tap } from 'rxjs';
import { TopicModalComponent } from './topic-dialog.component';
import { TopicService, TopicType } from './topic.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [NgIf, AsyncPipe],
  template: `
    <button *ngIf="topics$ | async" (click)="openTopicModal()">
      Open Topic
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'rxjs-race-condition';
  dialog = inject(MatDialog);
  topicService = inject(TopicService);
  topics: TopicType[] = [];
  topics$ = this.topicService.fakeGetHttpTopic().pipe(
    take(1),
    tap((topics) => (this.topics = topics))
  );

  openTopicModal() {
    this.dialog.open(TopicModalComponent, {
      data: {
        topics: this.topics,
      },
    });
  }
}

// faire une app qui fonctionne mais pas dans les tests e2e à cause du délai de la requete http.
