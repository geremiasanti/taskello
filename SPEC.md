# Taskello

Taskello e' un task manager simile a trello. Permette di gestire delle board, ogni board e' un kanban.

# Stack

- Rails per il backend
- Frontend React

## Boards

- Ogni board ha il suo creatore che puo' modificarla/eliminarla
- Puo' aggiungere utenti alla board che potranno aggiungere/modificare/eliminare cards
- Ogni board ha 3 colonne fisse: Todo, In Progress, Done (in futuro potrebbero diventare dinamiche/personalizzabili)
- All'interno della board tutti gli utenti membri possono fare tutto sulle card (CRUD, spostamento, etc.)
- Drag & drop delle card tra colonne e per riordinarle dentro la stessa colonna

## Cards

- Le cards hanno un titolo, una descrizione, delle risorse allegate identificate da una delle seguenti:
    - un url e opzionalmente un testo per renderlo un link
    - un immagine
    - un file generico
- Upload file/immagini gestiti con Active Storage, storage su disco locale.
- le cards hanno partecipanti, di default solo il creatore, gli utenti possono aggiungere/rimuovere gli altri utenti.
- Le cards hanno anche una sezione commenti, tipo chat, gli utenti della board possono scriverci e taggarsi a vicenda.
- Descrizione in markdown, editor rich-text lato React (es. TipTap o simile).
- Ordinamento di default: la card modificata piu' di recente in alto. L'ordine si puo' cambiare manualmente con le keyboard motions o con drag & drop.
- Nice to have: timeline con tutte le operazioni di modifica alla card
- Per lo stato puoi fare un campo che matcha il nome della colonna in cui si trova
- le card devono avere un anteprima solo con il titolo e si deve poter aprire il dettaglio

## Layouts

- 2 layouts
    1. kanban trello classico -> colonne, clicco su una card e si apre il dettaglio in una modale
    2. la visualizzazione stile client email (non so quale sia il nome) -> a sinistra le 3 colonne diventano stack impilati verticalmente, se si clicca un dettaglio si apre nella meta' destra della pagina 

## Labels

- Il namespace delle label e' la board
- Ogni label ha un colore assegnato di default e modificabile
- Ogni card deve avere una sezione labels associate
- Una label puo essere scelta tra quelle esistenti o essere creata sul posto, e' semplicemente una stringa

## Users

- Multi user. l'utente avra' username, email, password, profile pic. Username e email uniq.
- Nice to have registrazione/login con github/gmail, ma la possiamo gestire in un secondo momento.

## Real-time

- Aggiornamenti live tramite ActionCable (WebSocket): nuove card, spostamenti, commenti, notifiche.

## Notifiche

- Quando vieni taggato in un messaggio o messo come partecipante in un card -> notifica

## Seeding

- Il db iniziale sara' interamente seedato, board, card, utenti, etc. Puoi prendere riferimenti trash italiani e non e riferimenti a fatti di cronaca recenti. Quindi roba trash/demenziale.

## Style

- Opzioni temi chiaro e scuro e gruvbox (vedi quello di vim/nvim).
- Prendi gli stili di github dove possibile. 
- Deve apparire un applicazione chiara, essenziale, robusta.

## Navigation

- Voglio poter navigare sia con mouse che con tastiera
- motions con tab o frecce oppure hjkl e enter per aprire l'elemento su cui ti trovi
- di base appena premi una motion parti con un cursore virtuale (non so se ha un nome) sulla card in alto a sinistra, l'utente capisce dov'e' il cursore perche' aggiunge un bordo blue intorno all'elemento
- tutte le azioni principali devono avere un tasto
    - Creare una card
    - eliminare card
    - aprire una card
    - mettere labels nella card corrente (aperta o chiusa)
    - avanzare di stato (colonna) una card
    - etc...
- legenda action principali in fondo alla pagina (nascondibile)
- quando hovero su un azione vorrei che mi venisse suggerito il tasto, sempre in fondo alla pagina andando temporamenamente a sostituire la legenda

## Development

- Test driven development
- Sviluppo essenziale, non mettere controlli/check non necessari, al massimo degli assert (negative space programming) dove i test non sono necessari
- Qualsiasi errore non gestito dovrebbe comparire come un toast nell'applicazione (es. update fallito + messaggio di errore)

## Git

- Documenta le feature che fai nel README
- Fai commit in base a feature e fixes 

## Responsive

- diamo priorita' al desktop
- l'app deve essere responsive, io la utilizzero' principalmente da desktop ma deve essere utilizzabile anche da mobile.
- valuta te un primo approccio mobile e poi ti daro' dei feedback

## Claude

- Devi essere il piu' autonomo possibile e fermarti solo se necessario
