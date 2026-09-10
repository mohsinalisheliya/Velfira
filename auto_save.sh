#!/bin/bash

echo "🚀 Velfira Auto-Push daemon chalu ho gaya hai..."
echo "⏳ Har 5 minute mein background check chalega."
echo "🛑 Rokne ke liye terminal mein [Ctrl + C] dabana."
echo "----------------------------------------------------"

while true; do
    # Check karo agar repo mein koi changes hain
    if [[ -n $(git status --porcelain) ]]; then
        TIME_STAMP=$(date +"%d-%b-%Y %I:%M:%S %p")
        echo "[$TIME_STAMP] 📝 Changes detect huye! Git add aur commit ho raha hai..."
        
        git add .
        git commit -m "auto-save: progress update ($TIME_STAMP)"
        
        echo "[$TIME_STAMP] 🚀 GitHub par push ho raha hai..."
        git push origin main
        
        echo "[$TIME_STAMP] ✅ Successfully synced with GitHub!"
    else
        echo "[$(date +"%I:%M:%S %p")] 💤 Koi naya change nahi mila, skipping..."
    fi

    # 2 minute (120 seconds) wait
    sleep 05
done
