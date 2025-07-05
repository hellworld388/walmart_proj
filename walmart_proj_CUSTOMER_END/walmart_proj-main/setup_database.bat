@echo off
echo Setting up database with new product data...

cd db_setup

echo Creating database schema...
psql -U postgres -d walmart_customer -f schema.sql

echo Inserting data...
psql -U postgres -d walmart_customer -f data.sql

echo Database setup complete!
echo.
echo You can now start the backend server with: npm start
pause 