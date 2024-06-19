start "" "C:\Program Files\JetBrains\WebStorm\bin\webstorm64.exe"
start "" "C:\Program Files\JetBrains\IntelliJ IDEA Community Edition\bin\idea64.exe"
cd client/
start cmd.exe /k "npm run dev"
cd ..
cd e2e-tests/
start cmd.exe /k "npx cypress open --e2e --browser firefox"
cd ..
call ./runServer.bat
echo installation script finished
timeout /T 10