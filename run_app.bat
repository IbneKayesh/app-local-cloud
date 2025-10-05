@echo off

echo Installing backend dependencies...
start "Backend Install" cmd /c "pushd backend-app && npm install"

echo Installing frontend dependencies...
start "Frontend Install" cmd /c "pushd frontend-app && npm install"

echo Starting backend server...
start "Backend Server" cmd /k "pushd backend-app && node app.js"

echo Starting frontend development server...
start "Frontend Dev Server" cmd /k "pushd frontend-app && npm run dev"

echo Waiting for servers to start...
timeout /t 5 /nobreak > nul

echo Opening application in default browser...
start http://localhost:7070

echo All processes started and application opened.
