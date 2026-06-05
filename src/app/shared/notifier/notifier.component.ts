import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifierService } from './notifier.service';

@Component({
  selector: 'app-notifier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifier.component.html',
  styleUrl: './notifier.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotifierComponent {
  readonly notifier = inject(NotifierService);
  
  private pausedTimers = new Map<string, number>();

  trackById(index: number, item: { id: string }): string {
    return item.id;
  }

  pauseTimer(id: string): void {
    const remaining = this.notifier.getRemainingTime(id);
    if (remaining > 0) {
      this.pausedTimers.set(id, remaining);
    }
  }

  resumeTimer(id: string): void {
    const pausedTime = this.pausedTimers.get(id);
    if (pausedTime && pausedTime > 0) {
      this.notifier.setTimeout(id, pausedTime);
      this.pausedTimers.delete(id);
    }
  }

  async copyMessage(message: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(message);
      this.notifier.info('Copied to clipboard!', 'Copied');
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = message;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }
}
