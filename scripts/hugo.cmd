@echo off
setlocal

set "DART_SASS_DIR=%USERPROFILE%\tools\dart-sass-1.94.0\dart-sass"

if exist "%DART_SASS_DIR%\sass.bat" (
  set "PATH=%DART_SASS_DIR%;%PATH%"
)

hugo %*
