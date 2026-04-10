@echo off
REM Setup script for AnimateDiff environment variables
REM Run this after installing AnimateDiff to configure the environment

echo Setting up AnimateDiff environment variables...

REM Check if AnimateDiff root is provided as argument
if "%1"=="" (
    echo Usage: setup_animatediff.bat "C:\path\to\AnimateDiff"
    echo.
    echo Example: setup_animatediff.bat "C:\Users\YourName\AnimateDiff"
    pause
    exit /b 1
)

set ANIMATEDIFF_ROOT=%1

REM Verify the path exists
if not exist "%ANIMATEDIFF_ROOT%" (
    echo ERROR: Path %ANIMATEDIFF_ROOT% does not exist
    pause
    exit /b 1
)

REM Check if animate.py exists
if not exist "%ANIMATEDIFF_ROOT%\scripts\animate.py" (
    echo ERROR: animate.py not found in %ANIMATEDIFF_ROOT%\scripts\
    echo Make sure you cloned the AnimateDiff repository correctly
    pause
    exit /b 1
)

echo ANIMATEDIFF_ROOT set to: %ANIMATEDIFF_ROOT%
echo.
echo To make this permanent, add the following line to your .env.local file:
echo ANIMATEDIFF_ROOT=%ANIMATEDIFF_ROOT%
echo.
echo Or run this command in each new terminal:
echo set ANIMATEDIFF_ROOT=%ANIMATEDIFF_ROOT%
echo.
echo Testing setup...
python test_animatediff.py

pause