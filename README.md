# Notebank

A service that will allows users to upload & sell their notes/exams.

# Development

1. `git clone git@github.com:talham7391/notebank-service.git`
2. `cd notebank-service`
3. Export the following environment variables:
    1. `DJANGO_SECRET_KEY`
    2. `ENVIRONMENT` ("dev" or "prod")
    3. `AWS_ACCESS_KEY_ID`
    4. `AWS_SECRET_ACCESS_KEY`
    5. `AWS_S3_BUCKET_NAME` (where all the files are uploaded to)
4. `cd notebank/frontend`
5. `npm install`
6. `npm run-script build` then `^C` after the frontend files have been compiled.
7. `cd ..`
8. `python manage.py collectstatic`
9. Copy the `notebank-service/notebank/frontend/assets` folder into `notebank-service/notebank/frontend/static` folder.
9. `python manage.py migrate`
10. `python manage.py runserver`
