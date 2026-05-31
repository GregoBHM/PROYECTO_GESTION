#!/bin/sh
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.5
done

python manage.py makemigrations users projects tickets schedule notifications --noinput
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py loaddata initial_roles.json 2>/dev/null || true

exec gunicorn core.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 3 \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
