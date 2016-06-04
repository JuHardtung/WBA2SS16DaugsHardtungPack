# Spezifikation REST Webservice


| Ressource        |Methode| Semantik                                                     | content-type (req)  | content-type(res)|
|------------------|-------|--------------------------------------------------------------|---------------------|------------------|
| /login           | GET   | Hier kann der User seine Logindaten eingeben                  | text/plain         | text/plain       |
| /login           | POST  | Überprüft dei logindaten des Users und der Cookie gesetzt.    |application/x-www-form-urlencoded|text/plain|
| /logout          | GET   | Löscht den Session-Cookie                                     | text/plain         | text/plain       |
| /article         | GET   | Alle Artikel anzeigen                                         | text/plain         | application/JSON |
| /article/:id     | GET   | Artikel anhand ID anzeigen                                    | text/plain         | application/JSON |
| /article/add     | POST  | Neue Artikel einstellen                                       | application/JSON   | text/plain       |
| /article/delete  | GET   | Bestimmten Artikel löschen                                    | text/plain         | text/plain       |
| /user/all        | GET   | Alle User anzeigen                                            | text/plain         | application/JSON |
| /user/:id        | GET   | Einzelner User mit genaueren Informationen anzeigen           | text/plain         | application/JSON |
| /user/add        | POST  | Neue User einstellen                                          | application/JSON   | text/plain       |
| /user/delete     | GET   | Bestimmten User löschen                                       | text/plain         | text/plain       |
| /cart{id}        | GET   | Gib den Warenkorb eines Benutzers aus                         | text/plain         | application/JSON |
| /cart{id}/add    | POST  | Artikel dem Warenkorb hinzufügen                              | application/JSON   | application/JSON |
| /cart{id}/delete | GET   | Artikel aus dem Warenkorb entfernen                           | text/plain         | text/plain       |
| /bewertung:id    | POST  | Bewertung eines bestimmten Artikels (anhand id) abgeben       | application/JSON   | text/plain       |
| /bewertung:id    | GET   | Bewertung eines bestimmten Artikels (anhand id) abfragen      | text/plain         | text/plain       |
