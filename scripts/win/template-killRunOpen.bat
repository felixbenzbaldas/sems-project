call "sems\bin\shutdown.bat"
call "sems\bin\startup.bat"
timeout /T 1
start "" http://localhost:8080/?auth=[individual]