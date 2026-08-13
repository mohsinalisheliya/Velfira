#!/bin/bash

# Agar script run karte waqt message nahi diya, toh prompt open hoga
if [ -z "$1" ]; then
    read -p "📝 Commit message likho (Kya task kiya hai?): " msg
else
    msg="$1"
fi

# Agar message khali chhod diya toh process rok do
if [ -z "$msg" ]; then
    echo "❌ Error: Commit message khali nahi ho sakta bhai!"
    exit 1
fi

echo "📦 Files add ho rahi hain..."
git add .

echo "💾 Commit ban raha hai: '$msg'..."
git commit -m "$msg"

echo "🚀 GitHub par push ho raha hai..."
git push

echo "✅ Code successfully live ho gaya!"
