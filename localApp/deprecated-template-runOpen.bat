start cmd.exe /k ".\app\sems-project\bin\sems-project.bat C:\...\config.txt"
cd app/client/
start cmd.exe /k "http-server --port 8084"
cd ../..
timeout /T 2
start "" http://localhost:8084/?local
pause