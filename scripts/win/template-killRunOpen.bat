call "tomcat-app\bin\shutdown.bat"
call "tomcat-app\bin\startup.bat"
timeout /T 1
start "" http://localhost:8080/?auth=[individual]