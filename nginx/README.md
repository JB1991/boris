# NGINX Konfiguration

In diesem Verzeichnis befindet sich die NGINX Konfiguration, die in das [bitnami/nginx](https://hub.docker.com/r/bitnami/nginx) Docker-Image geschrieben wird.


## Datei `nginx.conf`

Diese Datei enthält die Hauptkonfiguration vom http-Block des NGINX Server und befindet sich im Docker-Image unter `/opt/bitnami/nginx/conf/nginx.conf`.


## Verzeichnis `custom`

Hier befinden sich Konfigurationen, die an anderer Stelle importiert werden können, um eine saubere Konfiguration zu erhalten. Im Docker-Image liegt das Verzeichnis unter `/opt/bitnami/nginx/conf/custom`.

Beispiel:
```
# security settings
include "/opt/bitnami/nginx/conf/custom/security.conf";
```


## Verzeichnis `server`

In diesem Verzeichnis können sich mehrere Konfigurationen mit server-Block befinden, die alle im Docker-Container geladen werden. Im Docker-Image liegt das Verzeichnis unter `/opt/bitnami/nginx/conf/server_blocks`.

**Wenn die Konfiguration Umgebungsvariablen enthält, muss im Helm-Chart ein Initcontainer implementiert werden, der diese zur Laufzeit austauscht.**
