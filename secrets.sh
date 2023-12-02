#!/bin/sh
##
# Exports .env to .env.json and sends them to wrangler secret
# Generated by ChatGPT (But heavily human-corrected, it's almost as bad at regex as humans)
# MIT License - nSimon.fr
##

echo '{' > .env.json
cat .env | grep '^[A-z -_]*=.*$' | sed "s/ //g" | sed "s/'//g" | sed "s/\"//g" | while IFS='=' read -r key value; do
  echo "\"$key\": \"$value\"," >> .env.json
done
sed -i '$ s/,$//' .env.json
echo '}' >> .env.json

wrangler secret:bulk .env.json

rm .env.json