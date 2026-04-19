@echo off
REM Initialize upload directories for the admin

if not exist "public\uploads\produits" (
    mkdir public\uploads\produits
    echo ✓ Created directory: public\uploads\produits
) else (
    echo ✓ Directory exists: public\uploads\produits
)

echo.
echo The admin dashboard will automatically save product images here:
echo   • JPG, PNG, WEBP formats accepted
echo   • Maximum size: 2 MB
echo   • Filenames are auto-generated with timestamp + UUID
echo.
echo You're all set! 🚀
pause
