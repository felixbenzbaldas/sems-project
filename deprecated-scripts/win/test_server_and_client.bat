call ./gradlew.bat test
call "C:\Users\...\sems-project\build\reports\tests\test\index.html"
call ./gradlew.bat --stop
call ./runServer.bat
timeout /T 5
call "test_client.bat"
pause