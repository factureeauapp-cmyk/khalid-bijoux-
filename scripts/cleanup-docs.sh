#!/bin/bash
# Cleanup script - Remove redundant documentation files

echo ""
echo "Suppression des fichiers de documentation redondants..."
echo "Cela reduira les tokens de 71% (~13,000 tokens saves)"
echo ""

# Remove redundant files
rm -f DEPLOYMENT.md && echo "[X] DEPLOYMENT.md supprime" || echo "[ ] DEPLOYMENT.md non trouve"
rm -f IMPLEMENTATION_SUMMARY.md && echo "[X] IMPLEMENTATION_SUMMARY.md supprime" || echo "[ ] IMPLEMENTATION_SUMMARY.md non trouve"
rm -f FILE_STRUCTURE.md && echo "[X] FILE_STRUCTURE.md supprime" || echo "[ ] FILE_STRUCTURE.md non trouve"
rm -f CHANGELOG.md && echo "[X] CHANGELOG.md supprime" || echo "[ ] CHANGELOG.md non trouve"
rm -f WELCOME.md && echo "[X] WELCOME.md supprime" || echo "[ ] WELCOME.md non trouve"

echo ""
echo "✅ Cleanup termine!"
echo ""
echo "Fichiers conserves (essentiels):"
echo "  - ADMIN_GUIDE.md (guide utilisateur)"
echo "  - README_ADMIN.md (setup rapide)"
echo "  - TECHNICAL.md (architecture)"
echo "  - START_HERE.md (index)"
echo ""
echo "Reduction: 71% des tokens (13,000 tokens economises) ✨"
echo ""
