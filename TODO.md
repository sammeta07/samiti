# Notifier Improvements TODO

## Tasks:
- [x] 1. Add progress bar at bottom of toast - pause on hover
- [x] 2. Add different colors/styles to each type (enhance existing)
- [x] 3. Add icon for different types (success, error, warn, info)
- [x] 4. Add icon button to copy notification message

## Implementation Order:
1. Update notifier.component.html - add progress bar, icons, copy button ✅
2. Update notifier.component.scss - add progress bar styles, icon styles, pause animation ✅
3. Update notifier.component.ts - add copy to clipboard functionality ✅
4. Update notifier.service.ts - add timer control methods for pause/resume ✅
