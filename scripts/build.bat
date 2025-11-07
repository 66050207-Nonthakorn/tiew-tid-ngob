@echo off
REM Build all service images (Windows batch equivalent of scripts/build.sh)
setlocal

echo === Build script starting ===
echo Current directory: %CD%
dir

pushd "%~dp0\.." 1>nul || (echo Failed to change to repo root & exit /b 1)

echo.
echo --- Building backend image ---
if exist backend ( 
  pushd backend
  docker build -t tiew-tid-ngob-backend .
  if ERRORLEVEL 1 (
    echo Docker build for backend failed with code %ERRORLEVEL%
    popd
    popd
    endlocal
    exit /b %ERRORLEVEL%
  )
  popd
) else (
  echo Skipping backend: ./backend not found
)

echo.
echo --- Building cluster_backend image ---
if exist cluster_backend ( 
  pushd cluster_backend
  docker build -t tiew-tid-ngob-cluster_backend .
  if ERRORLEVEL 1 (
    echo Docker build for cluster_backend failed with code %ERRORLEVEL%
    popd
    popd
    endlocal
    exit /b %ERRORLEVEL%
  )
  popd
) else (
  echo Skipping cluster_backend: ./cluster_backend not found
)

echo === Build script finished ===
endlocal
exit /b 0
