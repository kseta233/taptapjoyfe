export function getProgressPercent(progress: number, finishProgress: number): number {
  return Math.min((progress / finishProgress) * 100, 100);
}

export function isProgressFinished(progress: number, finishProgress: number): boolean {
  return progress >= finishProgress;
}
