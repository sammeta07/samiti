# Create Committee Update TODO

## Task: Update create committee interface with latitude/longitude and other modifications - COMPLETED

### Steps:
1. [x] Understanding the current implementation
2. [x] Update create-committee.models.ts - Added CreateCommitteePayload and response interfaces
3. [x] Update create-committee.component.ts - Added since field, updated payload format
4. [x] Update create-committee.service.ts - Updated mock response type
5. [x] Update create-committee.component.html - Added Since year input field
6. [x] Test compilation

### Summary of Changes:
- Changed `location_cords: { lat, long }` to `latitude` and `longitude` separate fields
- Added `since` year field with current year default
- Updated API response to match user's model structure
