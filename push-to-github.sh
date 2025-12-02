#!/bin/bash

# Script to push the project to GitHub
# First, create a new repository on GitHub at https://github.com/new
# Then run this script with your repository URL as an argument:
# ./push-to-github.sh https://github.com/yourusername/your-repo-name.git

if [ $# -eq 0 ]; then
    echo "Usage: $0 <repository-url>"
    echo "Example: $0 https://github.com/username/passtravels.git"
    exit 1
fi

REPO_URL=$1

echo "Setting up Git repository..."
cd /Users/soufianerochdi/Documents/passtravels

echo "Adding remote origin..."
git remote add origin $REPO_URL

echo "Renaming branch to main..."
git branch -M main

echo "Pushing to GitHub..."
git push -u origin main

echo "Done! Your repository has been pushed to GitHub."