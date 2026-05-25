### Comandos

# Unificar todo

find src \
  ! -path "src/content/*" \
  \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" -o -name "*.json" -o -name "*.md" \) \
  ! -name "*.d.ts" \
  -type f \
  -print0 | xargs -0 cat > unificadoCodigo.workout.txt

# Unificar algunos files

  cat \
"src/app/as... ejemplo 1
"src/app/glo... ejemplo 2
"src/components/Ba... ejemplo 3
> admin-ba...ejemplo.txt

# Traer archivos de la nube
git fetch origin
git reset --hard origin/main

# Regresar todo al ultimo commit
git reset --hard HEAD

# Diff de hace 2 commits atras
git show HEAD~2 --patch > diff-head-2.txt

# Traer un archivo viejo a la raiz como txt
git show ee8328c:src/types/user.ts > user-ee8328c-working.txt

# Estado actual vs ultimo commit
{
  echo "===== GIT STATUS ====="
  git status --short

  echo
  echo "===== DIFF STAT VS LAST COMMIT ====="
  git diff --stat HEAD

  echo
  echo "===== FULL DIFF VS LAST COMMIT ====="
  git diff HEAD

  echo
  echo "===== UNTRACKED FILES CONTENT ====="
  git ls-files --others --exclude-standard | while IFS= read -r file; do
    echo
    echo "===== UNTRACKED FILE: $file ====="
    sed -n '1,240p' "$file"
  done
} > estado-actual-vs-ultimo-commit.txt

# Aplicar cambios en capacitor ios

npx cap sync ios

# Code check
npm run typecheck
npm run lint 
npm run check 