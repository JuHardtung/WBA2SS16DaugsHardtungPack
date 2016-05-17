

# Spezifikation REST Webservice


| Ressource      | Methode | Semantik                                                    | content-type (req) | content-type (res) |
|----------------|---------|-------------------------------------------------------------|--------------------|--------------------|
| /warenkorb     | GET     | Gibt "jooooo" zurrück                                        | text/plain         | text/plain         |
| /warenkorb/:id | GET     | Gibt den User mit der entsprechenden Id zurrück             | text/plain         | text/plain         |
| /users         | POST    | Gibt nur den User aus dem gepostetetn Jsondokument zurrück. | application/json   | text/plain          |
