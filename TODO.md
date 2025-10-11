# TODO List for Fixing TypeError in fileSystem.js

## Completed Tasks
- [x] Add validation for `req.query.currentPath` in the `storage` multer destination function to prevent undefined path errors.
- [x] Add validation for `req.body.uploadId` in the `chunkStorage` multer destination function to prevent undefined uploadId errors.

## Followup Steps
- [ ] Test the server by running `node app` in the backend-app directory and attempting file uploads to ensure the TypeError no longer occurs.
- [ ] Verify that proper error messages are returned when required parameters are missing.
