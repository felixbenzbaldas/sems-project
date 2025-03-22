call ./gradlew.bat test
call "C:\Users\fbenz\Documents\Git\simple-project\build\reports\tests\test\index.html"
start cmd.exe /k ".\gradlew.bat runWithConfig -Pcommand=test"