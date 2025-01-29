#!/bin/bash

db_url="$1"
shift
cmd="$@"

until PGPASSWORD= psql "$db_url" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec $cmd
