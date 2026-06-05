import { Injectable, signal } from '@angular/core';
import { NotifierMessage, NotifierType } from './notifier.models';

@Injectable({ providedIn: 'root' })
export class NotifierService {
  readonly messages = signal<NotifierMessage[]>([]);
  
  private timers = new Map<string, number>();

  success(message: string, title = 'Success', timeoutMs = 3500): string {
    return this.push('success', message, title, timeoutMs);
  }

  error(message: string, title = 'Error', timeoutMs = 5000): string {
    return this.push('error', message, title, timeoutMs);
  }

  warn(message: string, title = 'Warning', timeoutMs = 4500): string {
    return this.push('warn', message, title, timeoutMs);
  }

  info(message: string, title = 'Info', timeoutMs = 3500): string {
    return this.push('info', message, title, timeoutMs);
  }

  remove(id: string): void {
    this.clearTimer(id);
    this.messages.update((list) => list.filter((item) => item.id !== id));
  }

  clear(): void {
    this.timers.forEach((timerId) => window.clearTimeout(timerId));
    this.timers.clear();
    this.messages.set([]);
  }
  
  getRemainingTime(id: string): number {
    const timerId = this.timers.get(id);
    if (timerId) {
      const currentMessages = this.messages();
      const message = currentMessages.find(m => m.id === id);
      if (message && message.timeoutMs) {
        const elapsed = Date.now() - message.createdAt;
        return Math.max(0, message.timeoutMs - elapsed);
      }
    }
    return 0;
  }
  
  setTimeout(id: string, timeoutMs: number): void {
    this.clearTimer(id);
    if (timeoutMs > 0) {
      const timerId = window.setTimeout(() => this.remove(id), timeoutMs);
      this.timers.set(id, timerId);
    }
  }

  private clearTimer(id: string): void {
    const timerId = this.timers.get(id);
    if (timerId) {
      window.clearTimeout(timerId);
      this.timers.delete(id);
    }
  }

  private push(
    type: NotifierType,
    message: string,
    title?: string,
    timeoutMs?: number
  ): string {
    const id = this.generateId();
    const item: NotifierMessage = {
      id,
      type,
      message,
      title,
      timeoutMs,
      createdAt: Date.now(),
    };

    this.messages.update((list) => [...list, item]);

    if ((timeoutMs ?? 0) > 0) {
      const timerId = window.setTimeout(() => this.remove(id), timeoutMs);
      this.timers.set(id, timerId);
    }

    return id;
  }

  private generateId(): string {
    return `ntf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
