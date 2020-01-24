#!/bin/bash
HOSTNAME=`node -e "console.log(url.parse('$ARANGODB_URL').hostname)"`
PORT=`node -e "console.log(url.parse('$ARANGODB_URL').port)"`

echo "Waiting For ArangoDB in $HOSTNAME:$PORT..."

while ! nc -z $HOSTNAME $PORT; do
  echo -n "."
  sleep 1
done

echo "ArangoDB Started!"
node dist/main.js