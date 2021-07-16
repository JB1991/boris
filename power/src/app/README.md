# Immobilienmarkt.NI


## Error Handler

Der Error Handler kümmert sich, um das Abfangen von unbehandelten Fehlern im Frontend. Es wird eine Fehlermeldung für den Benutzer angezeigt, der alle notwendigen Informationen für die Entwickler enthält.


## Module Guard

Im Frontend können wir keine Module deaktivieren. Der Module Guard dient dazu, Routen von nicht benötigten Modulen zu sperren. Dies wird direkt in der Angulardefinition von Routen vorgenommen.

Beispiel Modul schützen:
```
{
    path: 'login',
    component: LoginComponent,
    canActivate: [ModuleGuard]
},
```

Beispiel Modul aktivieren in Environments Konfiguration:
```
config: {
    modules: [
        'login'
    ],
}
```

**Der Modulname muss dem Routennamen entsprechen!**


## Update Service

Der Update Service erkennt, ob ein neues Deployment vorgenommen. In diesem Fall stößt er im Angular Service Worker das Update an und lädt die Seite neu.
