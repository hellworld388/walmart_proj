@echo off
set PGPASSWORD=test@123

echo 📦 Creating tables...
psql -U postgres -h localhost -d supplydb -f schema.sql

echo 📥 Inserting sample data...
psql -U postgres -h localhost -d supplydb -f data.sql

echo ✅ Done.
pause
