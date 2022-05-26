set jps_path=[path to Java-JDK, for example: C:\Program Files\Java\jdk1.8.0_231\bin]
set command=jps -v
cd /d "%jps_path%"
FOR /f "tokens=1" %%G IN ('%command% ^| find "catalina"') DO taskkill /f /pid %%G
cd %~dp0
call "sems\bin\startup.bat"
timeout /T 1
start "" http://localhost:8080/?auth=[Authentification string]