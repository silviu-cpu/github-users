// src/app/services/state.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private historySince: number[] = [0]; // Initial since=0
  private currentIndex: number = 0;

  getHistory(): number[] {
    return this.historySince;
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  updateHistory(newSince: number, isForward: boolean): void {
    if (isForward) {
      this.historySince = [
        ...this.historySince.slice(0, this.currentIndex + 1),
        newSince,
      ];
      this.currentIndex++;
    } else {
      this.currentIndex--;
    }
  }

  resetHistory(since: number): void {
    this.historySince = [since];
    this.currentIndex = 0;
  }
}
