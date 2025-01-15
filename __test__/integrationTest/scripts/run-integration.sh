ls -l

docker-compose up -d

echo '🟡 - Waiting for database to be ready...'

./__test__/integrationTest/scripts/wait-for-it.sh "postgresql://postgres:mysecretpassword@localhost:5432/postgres" -- echo '🟢 - Database is ready!'

npx cross-env ORIGINAL_DB_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres" npx prisma migrate dev --name init 
npx prisma generate --no-engine


npx cross-env DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres" npm run test:integration-test-folder

docker-compose down