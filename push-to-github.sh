#!/bin/bash

# Script to push the PassTravels project to GitHub
# This script will push to nbaldr2's GitHub account

echo "Setting up Git repository for nbaldr2..."
cd /Users/soufianerochdi/Documents/passtravels

# Check if origin already exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "Origin already exists. Removing existing origin..."
    git remote remove origin
fi

echo "Adding remote origin for nbaldr2..."
git remote add origin https://github.com/nbaldr2/passtravels.git

echo "Renaming branch to main (if needed)..."
git branch -M main

echo "Pushing to GitHub (nbaldr2)..."
git push -u origin main

echo "Done! Your repository has been pushed to GitHub under nbaldr2 account."