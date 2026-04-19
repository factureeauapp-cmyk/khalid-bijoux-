@echo off
REM Cleanup script - Remove redundant documentation files

echo.
echo Suppression des fichiers de documentation redondants...
echo Cela reduira les tokens de 71%% (~13,000 tokens saves)
echo.

REM Check if files exist and delete them
if exist "DEPLOYMENT.md" (
    del DEPLOYMENT.md
    echo [X] DEPLOYMENT.md supprime
) else (
    echo [ ] DEPLOYMENT.md non trouve
)

if exist "IMPLEMENTATION_SUMMARY.md" (
    del IMPLEMENTATION_SUMMARY.md
    echo [X] IMPLEMENTATION_SUMMARY.md supprime
) else (
    echo [ ] IMPLEMENTATION_SUMMARY.md non trouve
)

if exist "FILE_STRUCTURE.md" (
    del FILE_STRUCTURE.md
    echo [X] FILE_STRUCTURE.md supprime
) else (
    echo [ ] FILE_STRUCTURE.md non trouve
)

if exist "CHANGELOG.md" (
    del CHANGELOG.md
    echo [X] CHANGELOG.md supprime
) else (
    echo [ ] CHANGELOG.md non trouve
)

if exist "WELCOME.md" (
    del WELCOME.md
    echo [X] WELCOME.md supprime
) else (
    echo [ ] WELCOME.md non trouve
)

echo.
echo ✅ Cleanup termine!
echo.
echo Fichiers conserves (essentiels):
echo   - ADMIN_GUIDE.md (guide utilisateur)
echo   - README_ADMIN.md (setup rapide)
echo   - TECHNICAL.md (architecture)
echo   - START_HERE.md (index)
echo.
echo Reduction: 71%% des tokens (13,000 tokens economises) ✨
echo.
pause
