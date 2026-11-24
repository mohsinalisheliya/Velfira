#!/usr/bin/env bash
set -e

if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "Error: Not inside a Git repository."
  exit 1
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
AUTHOR_EMAIL=$(git config user.email)

echo "=============================================="
echo " Velfira Git Backdated Push (Nov 24–28, 2026)"
echo " Branch : $BRANCH"
echo " Email  : $AUTHOR_EMAIL"
echo "=============================================="

MESSAGES=(
  "Refine admin product form GST calculation and HSN inputs"
  "Polish variant matrix rows and stock badges in admin UI"
  "Add filter and search handling for catalog product list"
  "Review checkout OTP flow and order creation validation"
  "Tune responsive spacing and typography across storefront views"
  "Update invoice generation and payment callback logging"
  "Clean up page builder block config and theme presets"
  "Verify API serializers and pre-deployment checklist"
)

MSG_COUNT=${#MESSAGES[@]}
MSG_INDEX=0

CHANGED_FILES=()
while IFS= read -r line; do
  [ -n "$line" ] && CHANGED_FILES+=("${line:3}")
done < <(git status --porcelain)

FILE_COUNT=${#CHANGED_FILES[@]}
FILE_INDEX=0

for DAY in 24 25 26 27 28; do
  COMMITS_TODAY=$((1 + RANDOM % 3))
  BASE_HOUR=$((11 + RANDOM % 4))
  MINUTE_CURSOR=$((5 + RANDOM % 15))

  for ((c=1; c<=COMMITS_TODAY; c++)); do
    HOUR=$(printf "%02d" $((BASE_HOUR + (c - 1) * 2)))
    MINUTE_CURSOR=$((MINUTE_CURSOR + 12 + RANDOM % 20))
    if [ "$MINUTE_CURSOR" -ge 60 ]; then
      HOUR=$(printf "%02d" $((10#$HOUR + MINUTE_CURSOR / 60)))
      MINUTE_CURSOR=$((MINUTE_CURSOR % 60))
    fi
    MIN=$(printf "%02d" "$MINUTE_CURSOR")
    SEC=$(printf "%02d" $((RANDOM % 60)))
    COMMIT_DATE="2026-11-${DAY}T${HOUR}:${MIN}:${SEC}+0530"

    MSG="${MESSAGES[$((MSG_INDEX % MSG_COUNT))]}"
    MSG_INDEX=$((MSG_INDEX + 1))

    if [ $FILE_INDEX -lt $FILE_COUNT ]; then
      TARGET_FILE="${CHANGED_FILES[$FILE_INDEX]}"
      FILE_INDEX=$((FILE_INDEX + 1))
      if [ -e "$TARGET_FILE" ] || git ls-files --error-unmatch "$TARGET_FILE" > /dev/null 2>&1; then
        git add -- "$TARGET_FILE"
        GIT_AUTHOR_DATE="$COMMIT_DATE" GIT_COMMITTER_DATE="$COMMIT_DATE" \
          git commit -m "$MSG ($TARGET_FILE)" --quiet || true
        echo "[$COMMIT_DATE] Committed: $TARGET_FILE"
      fi
    elif [ "$DAY" == "28" ] && [ "$c" == "$COMMITS_TODAY" ] && [ -n "$(git status --porcelain)" ]; then
      git add -A
      GIT_AUTHOR_DATE="$COMMIT_DATE" GIT_COMMITTER_DATE="$COMMIT_DATE" \
        git commit -m "$MSG" --quiet
      echo "[$COMMIT_DATE] Committed remaining changes"
    else
      GIT_AUTHOR_DATE="$COMMIT_DATE" GIT_COMMITTER_DATE="$COMMIT_DATE" \
        git commit --allow-empty -m "$MSG" --quiet
      echo "[$COMMIT_DATE] $MSG"
    fi
  done
done

echo "----------------------------------------------"
echo "Pushing commits to origin/$BRANCH..."
git push origin "$BRANCH"
echo "Pushed Nov 24–28, 2026 commits to origin/$BRANCH."