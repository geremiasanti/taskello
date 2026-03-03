# Taskello

Taskello e' un task manager simile a trello. Permette di gestire delle board, ogni board e' un kanban.

# Stack

- Rails per il backend
- Frontend React

## Boards

- Ogni board ha il suo creatore che puo' modificarla/eliminarla
- Puo' aggiungere utenti alla board che potranno aggiungere/modificare/eliminare cards
- Ogni board ha 3 colonne: Todo, In Progress, Done

## Cards

- Le cards hanno un titolo, una descrizione, delle risorse allegate identificate da una delle seguenti:
    - un url e opzionalmente un testo per renderlo un link
    - un immagine
    - un file generico
- le cards hanno partecipanti, di default solo il creatore, gli utenti possono aggiungere/rimuovere gli altri utenti.
- Le cards hanno anche una sezione commenti, tipo chat, gli utenti della board possono scriverci e taggarsi a vicenda.
- descrizione markdown, penso che rails abbia qualcosa per gestire questi input complessi.
- Nice to have: timeline con tutte le operazioni di modifica alla card

## Labels

- Il namespace delle label e' la board
- Ogni label ha un colore assegnato di default e modificabile
- Ogni card deve avere una sezione labels associate
- Una label puo essere scelta tra quelle esistenti o essere creata sul posto, e' semplicemente una stringa

## Users

- Multi user. l'utente avra' username, email, password, profile pic. Username e email uniq.
- Nice to have registrazione/login con github/gmail, ma la possiamo gestire in un secondo momento.

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
- motions con frecce oppure hjkl e enter per aprire l'elemento su cui ti trovi
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

## Claude

- Devi essere il piu' autonomo possibile e fermarti solo se necessario
