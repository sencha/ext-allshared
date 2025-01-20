#!/bin/bash

# Change the old and new versions while updating
OLD_VERSION="7.8.0"
NEW_VERSION="7.9.0"

# List of files to update
FILES=(
  "./my-app/package.json"
  "./packages/ext-movetolatest/install.js"
  "./packages/ext-movetolatest/package.json"
  "./packages/ext-movetolatest/upgradeTemplates/extjs/package.json.tpl.default"
  "./packages/ext-movetolatest/upgradeTemplates/react/package.json"
  "./packages/ext-movetolatest/upgradeTemplates/reactClassic/package.json"
  "./packages/ext-movetolatest/upgradeTemplates/reactModern/package.json"
  "./packages/ext-movetolatest/upgradeTemplates/reactor/package.json"
  "./packages/ext-webpack-plugin/package.json"
)

# Keywords to match in the line
KEYWORDS="(@sencha|ext|version|extjs|sencha)"

# Loop through each file in the FILES array
for FILE in "${FILES[@]}"; do
  if [[ -f "$FILE" ]]; then
    echo "Checking for version in $FILE..."
    
    # Process lines with matching keywords and old version
    if grep -qE "$KEYWORDS.*$OLD_VERSION" "$FILE"; then
      echo "Old version found in relevant lines of $FILE. Updating..."
      
      # Update the version only in lines containing keywords and the old version
      sed -i -E "/$KEYWORDS/ s/\b$OLD_VERSION\b/$NEW_VERSION/g" "$FILE"
      
      # Confirm the replacement
      if grep -q "$NEW_VERSION" "$FILE"; then
        echo "Version updated successfully in $FILE."
      else
        echo "Error: Failed to update the version in $FILE."
      fi
    else
      echo "Warning: No matching lines found in $FILE. No changes made."
    fi
  else
    echo "Error: File $FILE does not exist."
  fi
done
