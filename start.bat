@echo off
echo ===================================================
echo Starting Local Civic Problem Reporting System
echo ===================================================

echo Starting Spring Boot Backend on http://localhost:8080...
start "Civic Backend (Spring Boot)" cmd /k "cd /d %~dp0backend && mvnw.cmd spring-boot:run"

echo Starting Vite React Frontend on http://localhost:5173...
start "Civic Frontend (Vite React)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both services are starting in separate windows.
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8080
echo.
pause
