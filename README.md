### Sems

Sems could be described as an outliner tool.
The goal of Sems is a convenient way to work with notes,
images and structured data.

At the moment the code quality is not on the level of clean code. The goal is to improve at least the quality of the most important parts.

#### Design principle

The visual design principle of sems is described and analyzed in my [bachelor thesis](https://www.dropbox.com/scl/fi/didrs41osq94s3agbclxn/Details-im-Kontext-anzeigen.pdf?rlkey=c374hlvzoskz4fbkevfdgfzsj&dl=0).

#### What can you do with Sems?

Mit Sems kann man Gliederungen erstellen:

![](images/outline.png)

Der Unterstrich zeigt, dass man den Punkt ein- bzw. ausklappen kann:

![](images/expanded.png)

Wenn ein Punkt außerhalb seines Kontexts zu sehen ist, dann erscheint ein entsprechender Button darunter.
Mit Klick auf "Kontext", kann man den Kontext unterhalb des Objektes aufklappen.

![](images/context.png)

Objekte können an mehreren Stellen "eingehängt" werden:

![](images/insert.png)

Es können mehrere Spalten nebeneinander angezeigt werden:

![](images/threeColumns.png)

Bilder können innerhalb der Gliederung angezeigt werden:

![](images/img.png)

Sems kann komplett per Tastatur bedient werden. Beispiel: Um zwischen Punkten zu navigieren werden die Buchstaben "i" und "k" verwendet (vorwärts und rückwärts).

Punkte können hinzugefügt und editiert werden.

#### Installation and start

- create gradle.properties from template-gradle.properties
- create props.txt from template-props.txt
- create file tomcat/bin/setenv.bat from tomcat/bin/template-setenv.bat 
- set environment variable CATALINA_HOME as described in *tomcat/Apache Tomcat/RUNNING.txt*
- gradle buildClient
- gradle localDeployNoClientBuild
- tomcat-app/bin/startup.bat
- open browser and navigate to http://localhost:8080/?auth=[individual]
- see KeyActionDefinition.ts and KeyEventDefinition.ts for usage of keys