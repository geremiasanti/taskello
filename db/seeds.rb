# Reset all sequences so IDs start from 1
ActiveRecord::Base.connection.tables.each do |table|
  next if table == "schema_migrations" || table == "ar_internal_metadata"
  ActiveRecord::Base.connection.reset_pk_sequence!(table)
end

AVATARS_DIR = Rails.root.join("db", "seed_avatars")

AVATAR_FILES = {
  "admin"             => "admin.jpg",
  "il_gatto_quantico" => "il_gatto_quantico.jpg",
  "nonna_rambo"       => "nonna_rambo.jpg",
  "carlo_in_acido"    => "carlo_in_acido.jpg",
  "shrek_terapeuta"   => "shrek_terapeuta.png",
  "mia_wallace_HR"    => "mia_wallace_HR.jpg",
  "spongebob_CEO"     => "spongebob_CEO.png",
  "gandalf_stagista"  => "gandalf_stagista.jpg",
  "darth_contabile"   => "darth_contabile.jpg",
  "mario_devops"      => "mario_devops.jpg",
  "totoro_security"   => "totoro_security.jpg",
  "willy_wonka_PM"    => "willy_wonka_PM.jpg",
}

def attach_avatar(user)
  return if user.avatar.attached?
  filename = AVATAR_FILES[user.username]
  return unless filename
  path = AVATARS_DIR.join(filename)
  return unless File.exist?(path)
  content_type = filename.end_with?(".png") ? "image/png" : "image/jpeg"
  user.avatar.attach(io: File.open(path), filename: filename, content_type: content_type)
end

# Users
users_data = [
  { username: "admin", email: "admin@taskello.dev", password: "password" },
  { username: "il_gatto_quantico", email: "gatto@taskello.dev", password: "password" },
  { username: "nonna_rambo", email: "nonna@taskello.dev", password: "password" },
  { username: "carlo_in_acido", email: "carlo@taskello.dev", password: "password" },
  { username: "shrek_terapeuta", email: "shrek@taskello.dev", password: "password" },
  { username: "mia_wallace_HR", email: "mia@taskello.dev", password: "password" },
  { username: "spongebob_CEO", email: "spongebob@taskello.dev", password: "password" },
  { username: "gandalf_stagista", email: "gandalf@taskello.dev", password: "password" },
  { username: "darth_contabile", email: "darth@taskello.dev", password: "password" },
  { username: "mario_devops", email: "mario@taskello.dev", password: "password" },
  { username: "totoro_security", email: "totoro@taskello.dev", password: "password" },
  { username: "willy_wonka_PM", email: "willy@taskello.dev", password: "password" },
]

users = users_data.map do |data|
  User.find_or_create_by!(username: data[:username]) do |u|
    u.email = data[:email]
    u.password = data[:password]
  end
end

users.each { |u| attach_avatar(u) }

admin, gatto, nonna, carlo, shrek, mia, spongebob, gandalf, darth, mario, totoro, willy = users

# ═══════════════════════════════════════════════════
# Board 1: Operazione Lasagna Interdimensionale
# ═══════════════════════════════════════════════════
lasagna = Board.find_or_create_by!(name: "Operazione Lasagna Interdimensionale") do |b|
  b.description = "Garfield ha aperto un portale nel forno a microonde. La lasagna è diventata senziente. Serve un piano."
  b.creator = gatto
end
[nonna, carlo, shrek, spongebob, mario, admin].each { |u| lasagna.board_memberships.find_or_create_by!(user: u) }

l1_labels = [
  { name: "DEFCON 1", color: "#e5534b" },
  { name: "formaggio", color: "#f0883e" },
  { name: "paranormale", color: "#b083f0" },
  { name: "besciamella", color: "#d29922" },
].map { |l| lasagna.labels.find_or_create_by!(name: l[:name]) { |lb| lb.color = l[:color] } }

l1_cards = [
  { title: "La lasagna ha imparato a parlare e vuole il suffragio universale", column: "todo", pos: 0, labels: [0, 2],
    desc: "Stamattina la lasagna ha citato Rousseau. Ieri chiedeva solo di essere riscaldata. La situazione sta degenerando." },
  { title: "Negoziare con il ragù che si è sindacalizzato", column: "todo", pos: 1, labels: [1, 3],
    desc: "Il ragù ha eletto un portavoce (una polpetta) e chiede ferie pagate e un frigorifero più spazioso." },
  { title: "Costruire gabbia di Faraday intorno al microonde", column: "todo", pos: 2, labels: [0],
    desc: "Ogni volta che apriamo il microonde si vede Narnia ma versione gastronomica. Ieri è uscito un unicorno fatto di mozzarella." },
  { title: "Chiedere a Miyazaki di disegnare il nuovo logo della lasagna", column: "todo", pos: 3, labels: [1],
    desc: "Vogliamo qualcosa tipo Totoro ma fatto di pasta sfoglia. Budget: 3 buoni pasto e un abbraccio." },
  { title: "La lasagna ha iniziato una campagna elettorale su TikTok", column: "todo", pos: 4, labels: [0, 1],
    desc: "Ha 200k follower. Il suo slogan è 'Make Forno Great Again'. Ha un social media manager (un grissino). Il grissino è più competente di molti umani." },
  { title: "Convincere la besciamella a smettere di levitare", column: "doing", pos: 0, labels: [2, 3],
    desc: "Da martedì la besciamella fluttua a 2 metri dal pavimento. L'esorcista ha detto che non è di sua competenza perché tecnicamente è un latticino." },
  { title: "Tradurre il manifesto politico della lasagna in 14 lingue", column: "doing", pos: 1, labels: [0],
    desc: "Include il Klingon e il linguaggio dei Minions. La lasagna insiste anche sul Quenya." },
  { title: "Assumere Quentin Tarantino per il documentario sulla lasagna", column: "doing", pos: 2, labels: [1],
    desc: "Ha già scritto 3 scene di dialogo tra la lasagna e una forchetta. C'è molto sangue (di pomodoro). La colonna sonora è solo Morricone." },
  { title: "Il parmigiano ha sviluppato telecinesi", column: "doing", pos: 3, labels: [2],
    desc: "Muove le posate col pensiero. Ha riorganizzato tutto il cassetto delle posate per forma e dimensione. La forchetta da dessert ora è terrorizzata." },
  { title: "La mozzarella ha raggiunto la coscienza di sé", column: "done", pos: 0, labels: [2],
    desc: "Ha chiesto 'cosa sono?' e poi si è sciolta in lacrime. Letteralmente. Era filante." },
  { title: "Installare il sistema operativo sulla teglia", column: "done", pos: 1, labels: [0, 3],
    desc: "Gira Linux. La lasagna ha scelto Arch BTW. Il parmigiano fa da dissipatore termico." },
  { title: "Evacuare il frigorifero dopo la rivolta dei würstel", column: "done", pos: 2, labels: [0],
    desc: "I würstel hanno preso in ostaggio il burro. Abbiamo mandato dentro un negoziatore (un grissino). Non è tornato." },
  { title: "Contenere l'espansione territoriale del ragù nel freezer", column: "done", pos: 3, labels: [0, 2],
    desc: "Il ragù ha annesso il cassetto dei surgelati e ha dichiarato indipendenza. Ha una bandiera (un foglio di alloro su uno stecchino). L'ONU è stata informata." },
]

l1_cards.each do |data|
  card = lasagna.cards.find_or_create_by!(title: data[:title]) do |c|
    c.column = data[:column]
    c.position = data[:pos]
    c.description = data[:desc]
    c.creator = gatto
  end
  data[:labels].each { |i| card.card_labels.find_or_create_by!(label: l1_labels[i]) }
  [nonna, carlo, spongebob, mario].sample(2).each { |u| card.card_participants.find_or_create_by!(user: u) rescue nil }
end

Comment.find_or_create_by!(card: lasagna.cards[0], user: nonna, body: "Ai miei tempi le lasagne stavano zitte e si facevano mangiare. Questa generazione di primi piatti è insopportabile.")
Comment.find_or_create_by!(card: lasagna.cards[0], user: carlo, body: "Ho provato a ragionare con la lasagna ma mi ha risposto con una citazione di Nietzsche e poi mi ha lanciato un foglio di alloro. @il_gatto_quantico help")
Comment.find_or_create_by!(card: lasagna.cards[0], user: spongebob, body: "Nella mia esperienza manageriale al Krusty Krab, quando il cibo diventa senziente bisogna offrirgli stock options")
Comment.find_or_create_by!(card: lasagna.cards[0], user: mario, body: "Ho provato a risolvere il problema con un tubo. Non ha funzionato. La lasagna ha detto che 'la violenza idraulica non è la risposta'. Ha ragione.")
Comment.find_or_create_by!(card: lasagna.cards[2], user: shrek, body: "Nel mio studio terapeutico ho avuto un caso simile con una cipolla che aveva troppi strati emotivi. Consiglio CBT (Cognitive Besciamella Therapy)")
Comment.find_or_create_by!(card: lasagna.cards[4], user: darth, body: "La campagna elettorale della lasagna ha più engagement dei nostri report trimestrali. Forse dovremmo assumere il grissino come social media manager.")
Comment.find_or_create_by!(card: lasagna.cards[5], user: gatto, body: "UPDATE: la besciamella ora canta 'Bohemian Rhapsody' a mezz'aria. È intonata, il che rende tutto più inquietante.")
Comment.find_or_create_by!(card: lasagna.cards[5], user: totoro, body: "Dal punto di vista della sicurezza, una besciamella volante è una minaccia di livello 4. Ho aggiornato il threat model. Il rischio di 'pioggia di latticini' è ora al 78%.")
Comment.find_or_create_by!(card: lasagna.cards[8], user: nonna, body: "Il parmigiano telecintico ha riordinato il mio cassetto delle posate meglio di come faceva mio marito. Possiamo tenerlo?")
Comment.find_or_create_by!(card: lasagna.cards[11], user: carlo, body: "Il ragù ha scritto una costituzione. Ha 47 articoli. L'articolo 1 dice 'Tutti i sughi sono uguali davanti alla legge, ma il ragù è più uguale degli altri'.")

# ═══════════════════════════════════════════════════
# Board 2: Tarantino presenta: Sprint Planning
# ═══════════════════════════════════════════════════
tarantino = Board.find_or_create_by!(name: "Tarantino presenta: Sprint Planning") do |b|
  b.description = "Lo sprint planning più violento della storia dell'Agile. Il product owner è Jules Winnfield. Il daily standup dura 3 ore ed è tutto in ordine non cronologico."
  b.creator = mia
end
[gatto, nonna, carlo, gandalf, darth, admin].each { |u| tarantino.board_memberships.find_or_create_by!(user: u) }

t_labels = [
  { name: "messicano", color: "#e5534b" },
  { name: "katana", color: "#539bf5" },
  { name: "trunk shot", color: "#d29922" },
  { name: "dialogo", color: "#57ab5a" },
].map { |l| tarantino.labels.find_or_create_by!(name: l[:name]) { |lb| lb.color = l[:color] } }

t_cards = [
  { title: "Il daily standup inizia con 20 min di dialogo sui Big Kahuna Burger", column: "todo", pos: 0, labels: [3],
    desc: "Jules insiste che prima di parlare di velocity bisogna discutere la differenza tra un Quarter Pounder e un Royale with Cheese. Lo Scrum Master piange." },
  { title: "Lo Scrum Master ha una katana e non accetta ritardi", column: "todo", pos: 1, labels: [1],
    desc: "Da quando ha visto Kill Bill non usa più i post-it. Li taglia a metà con la katana e dice 'il tuo ticket è... terminato'. HR è preoccupata." },
  { title: "Retrospettiva: chi ha messo la valigetta luminosa nel backlog?", column: "todo", pos: 2, labels: [0, 2],
    desc: "Nessuno sa cosa c'è dentro la user story #666. Quando la apri emette luce dorata. Il PM dice che è out of scope ma non riesce a smettere di guardarla." },
  { title: "Riscrivere tutti i ticket in ordine non cronologico", column: "todo", pos: 3, labels: [3],
    desc: "Capitolo 1: Deploy in prod. Capitolo 2: Il bug che ha causato il deploy (3 settimane prima). Capitolo 3: La nascita del developer (1987). Interludio: un primo piano del piede del PM." },
  { title: "Il designer ha chiesto un Mexican Standoff per decidere il colore del bottone", column: "todo", pos: 4, labels: [0, 3],
    desc: "Tre persone in piedi in una stanza, ognuna con un pantone diverso. Nessuno si muove. Il bottone è ancora grigio placeholder dal 2019." },
  { title: "Il QA ha citato Ezechiele 25:17 prima di aprire un bug report", column: "doing", pos: 0, labels: [3, 0],
    desc: "'Il cammino del giusto tester è minacciato da ogni parte dalle iniquità del codice legacy e dalla tirannia dei fix last-minute.' Poi ha riaperto 47 ticket." },
  { title: "Trunk shot della code review", column: "doing", pos: 1, labels: [2],
    desc: "Tutte le code review ora vengono filmate dal basso verso l'alto, tipo quando aprono il bagagliaio in Pulp Fiction. Il portatile del reviewer è nel trunk." },
  { title: "Il product owner parla solo per monologhi di 8 minuti", column: "doing", pos: 2, labels: [3],
    desc: "Ha spiegato una user story di login con un monologo che partiva dalla filosofia greca, passava per un aneddoto su una rapina in un diner, e finiva con 'e il bottone deve essere blu'." },
  { title: "La CI/CD pipeline ora include una scena di inseguimento", column: "doing", pos: 3, labels: [1, 2],
    desc: "Ogni deploy ha una fase 'car chase' dove i container Docker si inseguono per 3 minuti. Il regista dice che 'aumenta la tensione narrativa del rilascio'." },
  { title: "Colonna sonora dello sprint: solo surf rock e Morricone", column: "done", pos: 0, labels: [0],
    desc: "La playlist include Misirlou, il tema de Il Buono il Brutto il Cattivo, e Girl You'll Be A Woman Soon per le sessioni di pair programming." },
  { title: "Refactoring della scena del ristorante (tavolo 3)", column: "done", pos: 1, labels: [1, 3],
    desc: "Il codice è stato riscritto 4 volte. Ogni volta la scena inizia dallo stesso punto ma con prospettive diverse. Git blame è un inferno multidimensionale." },
  { title: "Aggiungere easter egg: in ogni pagina c'è un piede", column: "done", pos: 2, labels: [2],
    desc: "Su richiesta esplicita del regista. 'Ogni buon software ha almeno un piede nascosto.' - Quentin T., CTO ad interim" },
  { title: "Il deployment in prod è narrato da Samuel L. Jackson", column: "done", pos: 3, labels: [3, 0],
    desc: "Ogni volta che il deploy va a buon fine, una voce dice 'SAY DEPLOYED AGAIN. I DARE YOU.' Se fallisce: 'ENGLISH, MOTHERF***ER, DO YOU SPEAK IT?' rivolto ai log." },
]

t_cards.each do |data|
  card = tarantino.cards.find_or_create_by!(title: data[:title]) do |c|
    c.column = data[:column]
    c.position = data[:pos]
    c.description = data[:desc]
    c.creator = mia
  end
  data[:labels].each { |i| card.card_labels.find_or_create_by!(label: t_labels[i]) }
  [gatto, gandalf, carlo, darth].sample(2).each { |u| card.card_participants.find_or_create_by!(user: u) rescue nil }
end

Comment.find_or_create_by!(card: tarantino.cards[0], user: gandalf, body: "Come stagista devo dire che non ho MAI visto uno sprint planning con un messicano standoff tra il PM, il designer e DevOps. Bellissimo però.")
Comment.find_or_create_by!(card: tarantino.cards[0], user: carlo, body: "Il Big Kahuna Burger è sopravvalutato. Fight me. @mia_wallace_HR ti prego non licenziarmi per questo")
Comment.find_or_create_by!(card: tarantino.cards[0], user: darth, body: "Trovo la mancanza di fede nel Big Kahuna Burger... disturbante. @carlo_in_acido venga nel mio ufficio.")
Comment.find_or_create_by!(card: tarantino.cards[4], user: nonna, body: "Ai miei tempi i colori si decidevano a schiaffi. Rosso se ti davano uno schiaffo, viola se te ne davano due.")
Comment.find_or_create_by!(card: tarantino.cards[4], user: gatto, body: "Il bottone è grigio da 5 anni. A questo punto propongo di farlo quantisticamente tutti i colori contemporaneamente finché qualcuno non lo osserva.")
Comment.find_or_create_by!(card: tarantino.cards[5], user: nonna, body: "Ai miei tempi i tester non citavano la Bibbia, semplicemente ti guardavano male finché non fixavi il bug. Era più efficace.")
Comment.find_or_create_by!(card: tarantino.cards[7], user: gatto, body: "Ho cronometrato l'ultimo monologo del PO: 11 minuti e 34 secondi. Ha parlato di un viaggio in Thailandia prima di dire che il font deve essere Helvetica.")
Comment.find_or_create_by!(card: tarantino.cards[7], user: darth, body: "Nel Lato Oscuro i nostri product owner non parlano. Respirano rumorosamente e la gente capisce cosa fare. Molto più efficiente.")
Comment.find_or_create_by!(card: tarantino.cards[8], user: mario, body: "La fase 'car chase' della CI/CD mi ricorda quando inseguo Bowser nei tubi. Solo che qui i container non lanciano gusci di tartaruga. Per ora.")
Comment.find_or_create_by!(card: tarantino.cards[12], user: gandalf, body: "Il deploy narrato da Samuel L. Jackson ha un effetto terapeutico sul team. L'ansia da deploy è scesa del 60%. La paura di Samuel L. Jackson è salita del 200%.")

# ═══════════════════════════════════════════════════
# Board 3: Shrek's Therapy & Wellness Center
# ═══════════════════════════════════════════════════
therapy = Board.find_or_create_by!(name: "Shrek's Therapy & Wellness Center") do |b|
  b.description = "Studio di psicoterapia per personaggi di finzione con problemi reali. 'Le cipolle hanno strati. Le persone hanno strati. Il trauma ha strati.' - Dr. Shrek, PhD"
  b.creator = shrek
end
[mia, spongebob, gandalf, nonna, totoro, admin].each { |u| therapy.board_memberships.find_or_create_by!(user: u) }

s_labels = [
  { name: "urgente", color: "#e5534b" },
  { name: "trauma", color: "#b083f0" },
  { name: "cipolla", color: "#57ab5a" },
  { name: "palude", color: "#539bf5" },
].map { |l| therapy.labels.find_or_create_by!(name: l[:name]) { |lb| lb.color = l[:color] } }

s_cards = [
  { title: "Willy il Coyote: accettare che il Beep Beep non sarà mai catturato", column: "todo", pos: 0, labels: [1],
    desc: "Sessione 847. Willy continua a ordinare da ACME. Gli ho chiesto perché. Ha detto 'perché l'abisso mi fissa indietro, dottore'. Poi è caduto da un dirupo. Di nuovo." },
  { title: "Squiddi: burnout lavorativo al Krusty Krab", column: "todo", pos: 1, labels: [1, 0],
    desc: "Non suona più il clarinetto. Dice che SpongeBob ha 'eroso la sua volontà di vivere con la positività tossica'. Prescritta una settimana a Bali e 40mg di nichilismo." },
  { title: "Scar: complesso del fratello minore e regicidio", column: "todo", pos: 2, labels: [1],
    desc: "Insiste che 'Be Prepared' era solo una presentazione aziendale e che Mufasa è 'caduto da solo'. La seduta è durata 3 ore, ha cantato per 2." },
  { title: "Vegeta: rabbia cronica e complesso di inferiorità verso Goku", column: "todo", pos: 3, labels: [0, 1],
    desc: "Ha distrutto 4 lettini da terapia durante la prima seduta. Ogni volta che menziono Goku il suo livello di potenza aumenta e scoppia una finestra. L'assicurazione non copre più il mio studio." },
  { title: "Paperino: disturbo del linguaggio e rabbia esplosiva", column: "todo", pos: 4, labels: [1, 0],
    desc: "Nessuno capisce cosa dice. Lui si arrabbia perché nessuno capisce. Si arrabbia di più e diventa ancora meno comprensibile. È un circolo vizioso. Il registratore della seduta ha preso fuoco." },
  { title: "Dobby: dipendenza dal dare calzini a sconosciuti", column: "doing", pos: 0, labels: [1, 2],
    desc: "Sessione interrotta 6 volte perché Dobby continuava a togliersi i calzini e a regalarli. Ne ha dati uno al portaombrelli pensando fosse 'un bastone triste che ha bisogno di calore'." },
  { title: "Thanos: perfezionismo e pensiero dicotomico", column: "doing", pos: 1, labels: [0],
    desc: "Tutto deve essere 'perfettamente bilanciato'. Ha riorganizzato la mia sala d'attesa 3 volte. Ha eliminato metà delle riviste. 'Era necessario,' ha detto guardando il vuoto." },
  { title: "Scooby Doo: ansia generalizzata e dipendenza da Scooby Snacks", column: "doing", pos: 2, labels: [2],
    desc: "Ogni volta che sente un rumore corre a nascondersi tra le braccia di Shaggy. Il problema è che Shaggy ha la stessa identica patologia. Li tratto in coppia ora." },
  { title: "Patrick Stella: valutazione cognitiva (risultati sorprendenti)", column: "doing", pos: 3, labels: [3],
    desc: "Il test QI ha dato risultati fuori scala. In basso. Ma poi ha risolto l'ipotesi di Riemann sul retro del foglio. Lo stava usando come sottobicchiere." },
  { title: "Buzz Lightyear: delirio di grandezza e crisi d'identità", column: "doing", pos: 4, labels: [1, 0],
    desc: "Continua a credere di poter volare. Ogni seduta inizia con lui che si lancia dal divano. Ho messo dei cuscini. Si rifiuta di accettare di essere un giocattolo. Woody mi manda messaggi disperati." },
  { title: "Elsa: problemi di regolazione emotiva e climatica", column: "done", pos: 0, labels: [1, 3],
    desc: "Le ho detto 'parliamo dei suoi sentimenti' e ha congelato la stanza. Il termostato non funziona più. Il condizionatore si è dimesso." },
  { title: "Homer Simpson: dipendenza da ciambelle e negazione", column: "done", pos: 1, labels: [2],
    desc: "Dopo 6 mesi nega ancora la dipendenza. 'Posso smettere quando voglio,' ha detto mangiando la settima ciambella della seduta. Una era la mia." },
  { title: "Gollum: disturbo dissociativo dell'identità e ossessione per gioielli", column: "done", pos: 2, labels: [1, 0],
    desc: "Progresso: ora riesce a parlare di anelli senza leccarsi le mani. Regresso: ha rubato la mia fede nuziale e l'ha chiamata 'il suo tesssoro'." },
  { title: "Saitama: depressione da onnipotenza", column: "done", pos: 3, labels: [1],
    desc: "Può sconfiggere chiunque con un pugno solo. Ma niente lo emoziona più. 'Dottore, sono troppo forte per provare sentimenti.' La seduta è durata 4 minuti, ha detto tutto al primo pugno." },
]

s_cards.each do |data|
  card = therapy.cards.find_or_create_by!(title: data[:title]) do |c|
    c.column = data[:column]
    c.position = data[:pos]
    c.description = data[:desc]
    c.creator = shrek
  end
  data[:labels].each { |i| card.card_labels.find_or_create_by!(label: s_labels[i]) }
  [mia, spongebob, gandalf, totoro].sample(2).each { |u| card.card_participants.find_or_create_by!(user: u) rescue nil }
end

Comment.find_or_create_by!(card: therapy.cards[0], user: spongebob, body: "Come CEO posso confermare che il Coyote ha un problema di procurement. Il vendor ACME ha un tasso di successo dello 0%. Nemmeno io ordinerei da loro e io vivo in un ananas.")
Comment.find_or_create_by!(card: therapy.cards[0], user: mia, body: "Come responsabile HR, devo segnalare che il Coyote ha fatto 23.847 reclami per infortuni sul lavoro. La Roadrunner Corp ci deve una montagna di soldi.")
Comment.find_or_create_by!(card: therapy.cards[0], user: totoro, body: "Ho analizzato il profilo di rischio ACME. Il 100% dei loro prodotti esplode. Il 100%. Neanche i prodotti progettati per non esplodere. Come è possibile?")
Comment.find_or_create_by!(card: therapy.cards[3], user: gandalf, body: "Da stagista posso dire che la finestra che Vegeta ha distrutto era la mia postazione. Ora lavoro nel parcheggio. Non ho il coraggio di chiedere il rimborso a uno che può diventare Super Saiyan.")
Comment.find_or_create_by!(card: therapy.cards[4], user: spongebob, body: "Ho lavorato con Paperino per 3 anni al crossover Disney-Nickelodeon. Non ho mai capito una singola parola. Ma era sempre arrabbiato. Sempre.")
Comment.find_or_create_by!(card: therapy.cards[6], user: nonna, body: "Ai miei tempi il perfezionismo si risolveva con uno schiaffo sul collo. Funzionava con tutti tranne che con quelli col Guanto dell'Infinito.")
Comment.find_or_create_by!(card: therapy.cards[6], user: totoro, body: "Thanos ha riorganizzato anche il nostro server rack. Perfettamente bilanciato. Ha eliminato metà dei server. L'uptime è stranamente migliorato.")
Comment.find_or_create_by!(card: therapy.cards[9], user: mia, body: "Buzz si è lanciato dalla finestra dell'HR durante il colloquio d'ingresso. Gridava 'TO INFINITY AND BEYOND'. È atterrato sulla macchina di Darth. Darth non è contento.")
Comment.find_or_create_by!(card: therapy.cards[10], user: shrek, body: "UPDATE CLINICO: Elsa ha fatto progressi. Ora congela solo metà stanza. L'altra metà è inabitabile per altri motivi (Gollum ci ha nascosto delle posate).")
Comment.find_or_create_by!(card: therapy.cards[13], user: gandalf, body: "Saitama ha risolto la sua terapia in una seduta. Letteralmente un pugno alla depressione. Come stagista, invidio questa efficienza.")

# ═══════════════════════════════════════════════════
# Board 4: Piano di Fuga dalla Realtà Corporativa
# ═══════════════════════════════════════════════════
fuga = Board.find_or_create_by!(name: "Piano di Fuga dalla Realtà Corporativa") do |b|
  b.description = "SpongeBob è diventato CEO per errore dopo che il vero CEO è stato rapito da una seppia gigante. Gandalf è lo stagista. Nessuno sa cosa sta succedendo. I KPI sono numeri inventati."
  b.creator = spongebob
end
[gatto, mia, gandalf, carlo, darth, willy, admin].each { |u| fuga.board_memberships.find_or_create_by!(user: u) }

f_labels = [
  { name: "kafkiano", color: "#e5534b" },
  { name: "synergy", color: "#f0883e" },
  { name: "budget (LOL)", color: "#d29922" },
  { name: "HR incident", color: "#b083f0" },
].map { |l| fuga.labels.find_or_create_by!(name: l[:name]) { |lb| lb.color = l[:color] } }

f_cards = [
  { title: "La stampante è diventata il membro più produttivo del team", column: "todo", pos: 0, labels: [0],
    desc: "La HP LaserJet del terzo piano completa più task di chiunque altro. Ha un rating di 4.8 su 5 nelle peer review. Le abbiamo dato un badge 'Employee of the Month'. Non so se sia legale." },
  { title: "Riunione per decidere quando fare la riunione sulla riunione", column: "todo", pos: 1, labels: [1],
    desc: "Meta-meeting livello 4. La prossima riunione è per decidere il font dell'invito alla riunione che decide l'orario della riunione. Il tempo è un cerchio piatto." },
  { title: "Il budget Q3 è stato calcolato lanciando dadi da D&D", column: "todo", pos: 2, labels: [2],
    desc: "Il CFO ha tirato un d20 e ha fatto critico. Budget Q3: 847 milioni di dobloni. Nessuno sa convertire i dobloni. Il CFO ora vuole che tutto il finance usi THAC0." },
  { title: "Lo stagista ha evocato accidentalmente Cthulhu nella sala meeting B", column: "todo", pos: 3, labels: [3, 0],
    desc: "Gandalf stava cercando di collegare il proiettore e ha pronunciato parole arcane. Ora c'è un Antico nella sala meeting B. Il wifi lì va benissimo però." },
  { title: "Darth Contabile ha Force-choked il revisore dei conti", column: "todo", pos: 4, labels: [3],
    desc: "Il revisore ha chiesto di vedere le ricevute del Q2. Darth ha detto 'trovo la sua mancanza di fiducia nel bilancio... disturbante'. Il revisore ora approva tutto senza guardare." },
  { title: "Scrivere email aziendale senza usare 'circling back' o 'synergy'", column: "doing", pos: 0, labels: [1],
    desc: "Tentativo #247. Impossibile. L'ultimo che ci ha provato ora parla solo in haiku. / 'Synergy is dead' / 'But the Q4 targets live' / 'Let us circle back'" },
  { title: "L'algoritmo del caffè ha preso coscienza e giudica i nostri gusti", column: "doing", pos: 1, labels: [0],
    desc: "La macchinetta ora dice 'sul serio? un altro cappuccino alle 16? ti giudico' e poi fa un espresso comunque. Ha rifiutato di fare un decaffeinato dicendo 'ho dei principi'." },
  { title: "Gandalf ha messo 'You Shall Not Pass' su tutte le code review", column: "doing", pos: 2, labels: [3],
    desc: "Nessun merge è andato in produzione da 3 settimane. Lo stagista si piazza davanti al monitor con un bastone e grida. Il codice è effettivamente migliorato." },
  { title: "Trovare chi ha sostituito tutta l'acqua del dispenser con Monster Energy", column: "doing", pos: 3, labels: [3],
    desc: "Sospettiamo di Carlo. Da lunedì il team di accounting vede i colori e il CFO ha cercato di fare parkour in corridoio. Le piante dell'ufficio vibrano." },
  { title: "Willy Wonka ha trasformato la mensa in una fabbrica di cioccolato", column: "doing", pos: 4, labels: [0, 2],
    desc: "I dipendenti ora vengono pagati in tavolette di cioccolato. L'ufficio legale dice che non è conforme. Willy ha risposto cantando. Per 7 minuti. Con coreografia." },
  { title: "Team building: sopravvivenza su un'isola (siamo tornati quasi tutti)", column: "done", pos: 0, labels: [1, 3],
    desc: "Su 12 partecipanti ne sono tornati 11. Kevin dell'IT è ancora sull'isola. Dice che sta bene e che ha fondato una civiltà con i granchi. Non mandiamo soccorsi, i KPI del suo team sono migliorati." },
  { title: "Sostituire Jira con un sistema di piccioni viaggiatori", column: "done", pos: 1, labels: [0, 2],
    desc: "I piccioni hanno un tasso di delivery del 73%, superiore a Jira. L'unico problema è che a volte i ticket arrivano con cacca di piccione. Ma anche Jira ha i suoi bug." },
  { title: "Il CEO (SpongeBob) ha dichiarato il venerdì 'Casual Existential Crisis Day'", column: "done", pos: 2, labels: [0],
    desc: "Ogni venerdì si può piangere alla scrivania senza che HR intervenga. Produttività aumentata del 400%. La gente ora piange di gioia il lunedì per confronto. Stonks." },
  { title: "Implementare l'AI che risponde alle email con 'no❤️'", column: "done", pos: 3, labels: [1, 2],
    desc: "L'AI è stata deployata. Risponde a tutte le email con 'no❤️' oppure 'per me va bene (non va bene)'. La customer satisfaction è stranamente aumentata." },
]

f_cards.each do |data|
  card = fuga.cards.find_or_create_by!(title: data[:title]) do |c|
    c.column = data[:column]
    c.position = data[:pos]
    c.description = data[:desc]
    c.creator = spongebob
  end
  data[:labels].each { |i| card.card_labels.find_or_create_by!(label: f_labels[i]) }
  [gatto, mia, gandalf, carlo, darth, willy].sample(3).each { |u| card.card_participants.find_or_create_by!(user: u) rescue nil }
end

Comment.find_or_create_by!(card: fuga.cards[3], user: gandalf, body: "IN MIA DIFESA il cavo HDMI era molto simile a un artefatto elfico. E comunque Cthulhu è molto educato, ha chiesto se poteva usare la lavagna.")
Comment.find_or_create_by!(card: fuga.cards[3], user: mia, body: "Come HR devo segnalare che 'evocare divinità cosmiche' non è coperto dalla nostra polizza assicurativa. Ho controllato. Due volte. @gandalf_stagista compila il modulo 27-B/6")
Comment.find_or_create_by!(card: fuga.cards[3], user: willy, body: "Cthulhu vuole sapere se abbiamo una mensa vegana. Gli ho offerto del cioccolato. Ha mangiato il cioccolato E il tavolo. Devo ordinare un tavolo nuovo.")
Comment.find_or_create_by!(card: fuga.cards[4], user: darth, body: "Il revisore dei conti ha approvato un budget di 3 miliardi per 'spese imperiali non specificate'. La Forza è una skill sottovalutata nel finance.")
Comment.find_or_create_by!(card: fuga.cards[6], user: carlo, body: "La macchinetta mi ha detto 'bella scelta, come i tuoi commit del venerdì sera'. Non so se è un complimento. Ho paura di una macchina del caffè. Sto rivalutando le mie scelte di vita.")
Comment.find_or_create_by!(card: fuga.cards[7], user: spongebob, body: "Devo ammettere che da quando Gandalf blocca le code review il numero di bug in prod è sceso del 100%. Il numero di merge anche. Coincidenza? Non credo.")
Comment.find_or_create_by!(card: fuga.cards[9], user: darth, body: "Ho assaggiato il cioccolato di Wonka. Ho visto il Lato Chiaro della Forza per 3 secondi. È stato orribile. Non lo rifarò. Forse.")
Comment.find_or_create_by!(card: fuga.cards[9], user: gatto, body: "Willy ha creato un Oompa Loompa che fa deployment. Canta una canzone diversa per ogni tipo di errore. La canzone per 'segfault' è una ballad di 6 minuti.")
Comment.find_or_create_by!(card: fuga.cards[11], user: gatto, body: "I piccioni hanno un'interfaccia utente migliore di Jira. E almeno quando perdono un ticket puoi vederli volare via dalla finestra. Con Jira non sai mai dove vanno a finire le cose.")
Comment.find_or_create_by!(card: fuga.cards[8], user: nonna, body: "Ai miei tempi il Monster Energy non esisteva, si beveva caffè della moka alle 5 di mattina e si lavorava fino a notte. Eravamo tutti pazzi anche noi, ma con più stile.")
Comment.find_or_create_by!(card: fuga.cards[13], user: willy, body: "L'AI che risponde 'no❤️' è la cosa migliore che abbiamo fatto. Un cliente ha scritto 'voglio un rimborso' e ha ricevuto 'no❤️' con una GIF di un Oompa Loompa che balla. Ha dato 5 stelle.")

# ═══════════════════════════════════════════════════
# Board 5: Nonna Rambo: Ricette di Guerra
# ═══════════════════════════════════════════════════
ricette = Board.find_or_create_by!(name: "Nonna Rambo: Ricette di Guerra") do |b|
  b.description = "Nonna ha 87 anni, 3 guerre mondiali (dice lei), e un mattarello che ha visto cose. Le sue ricette sono classified NATO. Il sugo è un'arma di distruzione di massa."
  b.creator = nonna
end
[shrek, carlo, gatto, spongebob, mario, admin].each { |u| ricette.board_memberships.find_or_create_by!(user: u) }

r_labels = [
  { name: "top secret", color: "#e5534b" },
  { name: "piccante", color: "#f0883e" },
  { name: "illegale", color: "#b083f0" },
  { name: "tradizione", color: "#57ab5a" },
].map { |l| ricette.labels.find_or_create_by!(name: l[:name]) { |lb| lb.color = l[:color] } }

r_cards = [
  { title: "Tiramisù tattico con copertura anti-aerea di cacao", column: "todo", pos: 0, labels: [0, 3],
    desc: "La ricetta è stata sviluppata nel '43 per sollevare il morale delle truppe. Il mascarpone è l'unica arma che può fermare qualsiasi conflitto. Dosaggio: classificato." },
  { title: "Pasta e fagioli versione napalm (extra peperoncino calabrese)", column: "todo", pos: 1, labels: [1, 2],
    desc: "L'ultima persona che l'ha mangiata ha visto il futuro per 3 secondi. Ha detto che era 'pieno di fagioli'. Non sappiamo se fosse una profezia o un effetto collaterale." },
  { title: "Il mattarello sacro necessita manutenzione trimestrale", column: "todo", pos: 2, labels: [0],
    desc: "Il mattarello ha 60 anni ed è stato usato in 3 conflitti familiari, 2 intrusioni domestiche, e circa 14.000 sfoglie. È nella lista UNESCO come patrimonio dell'umanità." },
  { title: "Risotto allo zafferano con proprietà di viaggio nel tempo", column: "todo", pos: 3, labels: [2, 0],
    desc: "L'ultimo che l'ha mangiato ha rivissuto la caduta dell'Impero Romano per 20 minuti. Ha detto che Nerone non suonava poi così male. La ricetta richiede zafferano del 1487." },
  { title: "Corso di sopravvivenza: come fare il ragù con 2 ingredienti e rabbia repressa", column: "doing", pos: 0, labels: [3, 1],
    desc: "Ingredienti: pomodoro e FURIA. La rabbia repressa è il segreto del sapore. Nonna dice che 'il ragù deve sobbollire come il tuo risentimento verso chi mette la panna nella carbonara'." },
  { title: "Sviluppare arma biologica a base di gorgonzola (per difesa personale)", column: "doing", pos: 1, labels: [2, 0],
    desc: "Il gorgonzola di Nonna è stato classificato come arma di Categoria 3 dalla Convenzione di Ginevra. È stato usato con successo per allontanare un orso, 3 testimoni di Geova, e un esattore fiscale." },
  { title: "Le polpette sono pronte (non chiedere cosa c'è dentro)", column: "doing", pos: 2, labels: [0],
    desc: "Nonna dice che la ricetta è segreta. L'ultima persona che ha chiesto gli ingredienti è stata vista l'ultima volta a Praga nel '97. Probabilmente non c'è correlazione. Probabilmente." },
  { title: "Operazione Carbonara: infiltrare la cucina francese", column: "doing", pos: 3, labels: [0, 3],
    desc: "Nonna ha un piano per sostituire segretamente tutte le béchamel francesi con la sua besciamella. 'La Francia non se ne accorgerà,' dice. 'E se se ne accorge, pazienza.'" },
  { title: "Frittata di sopravvivenza: funziona anche come giubbotto antiproiettile", column: "done", pos: 0, labels: [3, 0],
    desc: "Testata dal cugino Alfredo che se l'è messa addosso per scommessa. Risultato: ha fermato un pallone da calcio, 3 insulti, e il passare del tempo (la frittata è uguale da 6 mesi)." },
  { title: "Negoziare la resa del microonde nemico (quello di Carlo)", column: "done", pos: 1, labels: [2],
    desc: "Il microonde di Carlo ha rifiutato di scaldare il ragù di Nonna. Questo è stato considerato un atto di guerra. Il microonde è stato... 'neutralizzato'. Con il mattarello." },
  { title: "Scrivere testamento: a chi va la ricetta del sugo", column: "done", pos: 2, labels: [3],
    desc: "Dopo lunga deliberazione: la ricetta va a chi riesce a fare la sfoglia a mano senza piangere. Attualmente nessun erede qualificato. Nonna ride." },
  { title: "Convertire Mario alla cucina italiana vera", column: "done", pos: 3, labels: [3, 1],
    desc: "Mario pensava di saper cucinare perché è italiano. Nonna gli ha fatto assaggiare il ragù vero. Mario ha pianto. Ha detto 'mamma mia' non ironicamente per la prima volta nella vita." },
]

r_cards.each do |data|
  card = ricette.cards.find_or_create_by!(title: data[:title]) do |c|
    c.column = data[:column]
    c.position = data[:pos]
    c.description = data[:desc]
    c.creator = nonna
  end
  data[:labels].each { |i| card.card_labels.find_or_create_by!(label: r_labels[i]) }
  [shrek, carlo, gatto, mario].sample(2).each { |u| card.card_participants.find_or_create_by!(user: u) rescue nil }
end

Comment.find_or_create_by!(card: ricette.cards[0], user: carlo, body: "Ho provato il tiramisù tattico. Ho visto Dio. Dio mangiava tiramisù. Era un loop ricorsivo di tiramisù. Sono cambiato come persona.")
Comment.find_or_create_by!(card: ricette.cards[0], user: shrek, body: "Come terapeuta devo dire che questo tiramisù ha risolto più traumi delle mie sedute. Come terapeuta devo anche dire che questo mi preoccupa profondamente.")
Comment.find_or_create_by!(card: ricette.cards[0], user: mario, body: "Questo tiramisù è meglio di un fungo 1-UP. E non ti fa diventare grande. Ti fa diventare saggio. Mamma mia.")
Comment.find_or_create_by!(card: ricette.cards[3], user: gatto, body: "Ho analizzato il risotto quantisticamente. Lo zafferano emette particelle di nostalgia. Non sono scherzando. Ho i grafici.")
Comment.find_or_create_by!(card: ricette.cards[4], user: spongebob, body: "Al Krusty Krab usiamo un metodo simile: il segreto della Krabby Patty è 73% amore e 27% rancore verso Plankton. @nonna_rambo potremmo fare una collab")
Comment.find_or_create_by!(card: ricette.cards[5], user: gatto, body: "Il gorgonzola ha appena fatto scappare il postino. Non ha nemmeno bussato, ha sentito l'odore dal cancello e ha lasciato il pacco nel comune limitrofo.")
Comment.find_or_create_by!(card: ricette.cards[5], user: mario, body: "Nei tubi dove lavoro ho sentito odori tremendi. Ma il gorgonzola di Nonna è su un altro livello. Bowser avrebbe paura.")
Comment.find_or_create_by!(card: ricette.cards[7], user: carlo, body: "L'Operazione Carbonara è geniale. Se la Francia protesta, Nonna può sempre usare il gorgonzola come deterrente nucleare.")
Comment.find_or_create_by!(card: ricette.cards[9], user: nonna, body: "Il microonde di Carlo era un traditore. I traditori vengono trattati col mattarello. Questo è il modo.")
Comment.find_or_create_by!(card: ricette.cards[11], user: mario, body: "Mi vergogno. Tutta la vita a dire 'it's-a me, Mario' e non sapevo fare neanche un soffritto. Nonna mi ha aperto gli occhi. E le lacrime.")

# ═══════════════════════════════════════════════════
# Board 6: Darth Contabile: Bilancio dell'Impero
# ═══════════════════════════════════════════════════
impero = Board.find_or_create_by!(name: "Darth Contabile: Bilancio dell'Impero") do |b|
  b.description = "La Morte Nera è costata 3 budget annuali e non aveva nemmeno una copertura sulla porta di scarico termico. Il reparto finance dell'Impero è in lacrime."
  b.creator = darth
end
[mia, spongebob, willy, gandalf, carlo, admin].each { |u| impero.board_memberships.find_or_create_by!(user: u) }

i_labels = [
  { name: "lato oscuro", color: "#e5534b" },
  { name: "budget", color: "#d29922" },
  { name: "compliance", color: "#539bf5" },
  { name: "force choke", color: "#b083f0" },
].map { |l| impero.labels.find_or_create_by!(name: l[:name]) { |lb| lb.color = l[:color] } }

i_cards = [
  { title: "La Morte Nera ha sforato il budget del 847%", column: "todo", pos: 0, labels: [0, 1],
    desc: "L'appaltatore ha detto che 'il laser planetario era extra'. EXTRA?! È letteralmente l'unica funzione. Senza il laser è solo una palla grigia molto costosa." },
  { title: "I Stormtrooper chiedono corsi di mira (finalmente)", column: "todo", pos: 1, labels: [1, 2],
    desc: "Tasso di precisione attuale: 0.3%. Il budget per l'addestramento è stato rifiutato 47 volte. L'Imperatore dice che 'la Forza li guiderà'. La Forza non sta funzionando." },
  { title: "Audit: dove sono finiti 3 miliardi di crediti galattici?", column: "todo", pos: 2, labels: [2],
    desc: "Il foglio Excel ha una riga che dice 'spese varie: 3,000,000,000 crediti'. La colonna 'dettagli' dice solo 'fidatevi'. Nessuno ha il coraggio di chiedere a Darth." },
  { title: "L'Imperatore vuole un nuovo trono con USB-C", column: "todo", pos: 3, labels: [0, 1],
    desc: "L'attuale trono ha solo Lightning. L'Imperatore è furioso. Ha fulminato 3 fornitori Apple. Il preventivo per il nuovo trono: 890 milioni. Ha portabicchiere integrato." },
  { title: "Negoziare lo sconto fedeltà con il fornitore di mantelli neri", column: "doing", pos: 0, labels: [1],
    desc: "Compriamo 14.000 mantelli neri al mese. Il fornitore ci fa pagare prezzo pieno. Ho provato a Force-chokarlo via Zoom ma non funziona in remoto." },
  { title: "Compliance: è legale Force-chokare i colleghi?", column: "doing", pos: 1, labels: [2, 3],
    desc: "L'ufficio legale dice 'tecnicamente no'. L'ufficio legale è stato Force-chokato. Il nuovo ufficio legale dice 'tecnicamente sì'. Problema risolto." },
  { title: "Il cantina dell'Impero serve solo cibo beige", column: "doing", pos: 2, labels: [0],
    desc: "Tutto è beige. Il riso è beige. La carne è beige. Il dessert è beige. I dipendenti sono depressi. Ho chiesto a Nonna Rambo una consulenza. Ha riso per 10 minuti." },
  { title: "Vader ha usato il budget marketing per costruire un altro laser", column: "done", pos: 0, labels: [0, 1],
    desc: "Era il budget per i biglietti da visita. Ora abbiamo un laser e zero biglietti da visita. 'Il laser È il biglietto da visita,' ha detto Vader. Non ha tutti i torti." },
  { title: "Ottimizzare i costi di manutenzione dei TIE Fighter", column: "done", pos: 1, labels: [1, 2],
    desc: "I TIE Fighter non hanno scudi. Non hanno life support. Non hanno sedili comodi. La manutenzione costa comunque una fortuna. Ho chiesto perché. 'Estetica', ha risposto l'Imperatore." },
  { title: "Dichiarazione dei redditi dell'Impero: compilata", column: "done", pos: 2, labels: [2],
    desc: "Alla voce 'fonte di reddito' ho scritto 'conquista galattica'. Alla voce 'spese deducibili' ho scritto 'tutto'. Il commercialista è svenuto. Poi è stato Force-chokato per debolezza." },
]

i_cards.each do |data|
  card = impero.cards.find_or_create_by!(title: data[:title]) do |c|
    c.column = data[:column]
    c.position = data[:pos]
    c.description = data[:desc]
    c.creator = darth
  end
  data[:labels].each { |i| impero.labels.find_or_create_by!(name: i_labels[i][:name]) rescue i_labels[i] }
  data[:labels].each { |idx| card.card_labels.find_or_create_by!(label: i_labels[idx]) }
  [mia, spongebob, willy, gandalf].sample(2).each { |u| card.card_participants.find_or_create_by!(user: u) rescue nil }
end

Comment.find_or_create_by!(card: impero.cards[0], user: spongebob, body: "Come CEO di un'altra azienda disfunzionale, posso dire che 847% di sforamento budget è nella norma. Al Krusty Krab una volta abbiamo speso il triplo per un cartello 'Aperto'.")
Comment.find_or_create_by!(card: impero.cards[0], user: willy, body: "Per lo stesso prezzo della Morte Nera potevate comprare 14 fabbriche di cioccolato. Con Oompa Loompa inclusi. Pessima allocazione delle risorse.")
Comment.find_or_create_by!(card: impero.cards[1], user: gandalf, body: "Come stagista che ha evocato Cthulhu per sbaglio, non sono nella posizione di giudicare chi ha problemi di mira. Ma il 0.3% è impressionante. In negativo.")
Comment.find_or_create_by!(card: impero.cards[2], user: mia, body: "3 miliardi in 'spese varie'. @darth_contabile questo non passerà l'audit. Neanche con la Forza.")
Comment.find_or_create_by!(card: impero.cards[3], user: carlo, body: "890 milioni per un trono con USB-C? Per quella cifra ti faccio un trono con USB-C, wifi 7, e un minibar. Ah no, l'Imperatore ha fulminato l'ultimo freelancer.")
Comment.find_or_create_by!(card: impero.cards[5], user: mia, body: "MEMO HR: Force-chokare i colleghi è stato ufficialmente aggiunto alla lista 'comportamenti tollerati'. Aggiorno il manuale del dipendente.")
Comment.find_or_create_by!(card: impero.cards[5], user: darth, body: "L'HR ha finalmente capito. Il Lato Oscuro non è un problema, è una soluzione organizzativa.")
Comment.find_or_create_by!(card: impero.cards[7], user: carlo, body: "Devo ammettere che 'il laser È il biglietto da visita' è la cosa più giusta che Vader abbia mai detto. Nessuno dimentica un biglietto da visita che può distruggere un pianeta.")
Comment.find_or_create_by!(card: impero.cards[9], user: willy, body: "Ho offerto di fare la dichiarazione dei redditi con gli Oompa Loompa. Cantano mentre compilano. Il commercialista ha detto che è 'inquietante ma accurato'.")

# ═══════════════════════════════════════════════════
# Board 7: Mario DevOps: Pipeline dei Tubi
# ═══════════════════════════════════════════════════
tubi = Board.find_or_create_by!(name: "Mario DevOps: Pipeline dei Tubi") do |b|
  b.description = "L'infrastruttura è fatta di tubi verdi. I container sono letteralmente tubi. Kubernetes è il Mondo 8-4. Bowser è il tech debt."
  b.creator = mario
end
[gatto, totoro, gandalf, darth, carlo, admin].each { |u| tubi.board_memberships.find_or_create_by!(user: u) }

m_labels = [
  { name: "1-UP", color: "#57ab5a" },
  { name: "game over", color: "#e5534b" },
  { name: "warp zone", color: "#539bf5" },
  { name: "power-up", color: "#f0883e" },
].map { |l| tubi.labels.find_or_create_by!(name: l[:name]) { |lb| lb.color = l[:color] } }

m_cards = [
  { title: "Bowser ha fatto un DDoS sul castello di Peach (di nuovo)", column: "todo", pos: 0, labels: [1],
    desc: "Ogni 3 settimane Bowser rapisce il server principale. Ogni volta devo attraversare 8 mondi per recuperarlo. L'IT ticket dice 'priorità: bassa'. BASSA." },
  { title: "I Goomba continuano a camminare sui cavi di rete", column: "todo", pos: 1, labels: [1, 3],
    desc: "Ogni volta che un Goomba cammina su un cavo ethernet, perdiamo connettività nel Mondo 1-2. Ho messo dei cartelli 'Vietato Camminare'. I Goomba non sanno leggere." },
  { title: "Migrare tutti i tubi verdi a IPv6", column: "todo", pos: 2, labels: [2],
    desc: "I tubi attualmente funzionano con un protocollo proprietario chiamato 'WarpPipe v1'. È del 1985. Funziona perfettamente. Nessuno sa perché. Nessuno vuole toccarlo." },
  { title: "Il fungo 1-UP viola tutti gli SLA di uptime", column: "doing", pos: 0, labels: [0, 3],
    desc: "Il fungo 1-UP garantisce 'infinite lives'. Ma il nostro SLA dice 99.99% di uptime. Infinite lives implica downtime, che implica respawn. Il legal team è confuso." },
  { title: "Yoshi ha mangiato il backup server", column: "doing", pos: 1, labels: [1],
    desc: "Pensava fosse una mela. Non era una mela. Era un rack server da 200TB. Lo ha espulso come un uovo. L'uovo ora contiene i backup compressi. Non so come funziona." },
  { title: "Implementare CI/CD attraverso i tubi warp", column: "doing", pos: 2, labels: [2, 0],
    desc: "Il deploy avviene saltando in un tubo verde. Se salti nel tubo sbagliato, finisci in staging. Se salti in quello giusto, finisci in prod. Non c'è rollback. Solo un altro tubo." },
  { title: "La stella di invincibilità ha causato un memory leak", column: "done", pos: 0, labels: [3, 1],
    desc: "Ogni volta che qualcuno prende la stella, il sistema alloca RAM infinita per 10 secondi. Poi crasha. La musica della stella è ora il suono del panico nel team." },
  { title: "Kubernetes cluster: Mondo 8 completato", column: "done", pos: 1, labels: [0, 2],
    desc: "Ci sono voluti 47 tentativi. Bowser controllava il load balancer finale. L'ho sconfitto con un'ascia (l'ascia era uno script bash di 3000 righe). Il ponte è crollato. Il cluster è live." },
  { title: "Documentazione: dove portano tutti i tubi", column: "done", pos: 2, labels: [2],
    desc: "Ho mappato 847 tubi. 200 portano a mondi. 400 portano ad altri tubi. 247 non portano da nessuna parte. 1 porta in un Denny's a Cleveland. Non so come. Non voglio saperlo." },
]

m_cards.each do |data|
  card = tubi.cards.find_or_create_by!(title: data[:title]) do |c|
    c.column = data[:column]
    c.position = data[:pos]
    c.description = data[:desc]
    c.creator = mario
  end
  data[:labels].each { |i| card.card_labels.find_or_create_by!(label: m_labels[i]) }
  [gatto, totoro, gandalf, carlo].sample(2).each { |u| card.card_participants.find_or_create_by!(user: u) rescue nil }
end

Comment.find_or_create_by!(card: tubi.cards[0], user: totoro, body: "Ho fatto un penetration test sul castello. 847 vulnerabilità. La porta principale non ha password. Il fossato non ha firewall. Peach usa 'password123'.")
Comment.find_or_create_by!(card: tubi.cards[0], user: darth, body: "Nell'Impero non abbiamo questo problema. Nessuno rapisce i nostri server. Li distruggiamo noi stessi. È più efficiente.")
Comment.find_or_create_by!(card: tubi.cards[1], user: gandalf, body: "I Goomba hanno lo stesso livello di consapevolezza IT dei nostri utenti. Camminano dove non devono e rompono tutto. Li capisco, in un certo senso.")
Comment.find_or_create_by!(card: tubi.cards[4], user: gatto, body: "Yoshi ha violato la seconda legge della termodinamica comprimendo 200TB in un uovo. Ho scritto un paper. Nessuno mi ha creduto. L'uovo funziona comunque.")
Comment.find_or_create_by!(card: tubi.cards[4], user: totoro, body: "Il backup-uovo ha un uptime del 100%. Non chiedetemi come. L'ho messo nella policy di disaster recovery come 'soluzione biologica'.")
Comment.find_or_create_by!(card: tubi.cards[5], user: carlo, body: "Ho saltato nel tubo sbagliato e sono finito nel Denny's a Cleveland. Il pancake era buono. Il deploy no.")
Comment.find_or_create_by!(card: tubi.cards[7], user: mario, body: "Lo script bash di 3000 righe era necessario. Le prime 2999 righe sono commenti che dicono 'non toccare'. La riga 3000 dice 'rm -rf bowser'. Funziona.")
Comment.find_or_create_by!(card: tubi.cards[8], user: gandalf, body: "Sono andato nel tubo che porta al Denny's. La cameriera mi ha detto 'ecco un altro'. Evidentemente non sono il primo. Mi ha dato un menu. Ho ordinato.")

# ═══════════════════════════════════════════════════
# Board 8: La Fabbrica di Cioccolato Agile
# ═══════════════════════════════════════════════════
cioccolato = Board.find_or_create_by!(name: "La Fabbrica di Cioccolato Agile") do |b|
  b.description = "Willy Wonka ha applicato lo Scrum alla produzione di cioccolato. Gli Oompa Loompa sono lo sprint team. I golden ticket sono le user stories. Augustus Gloop è caduto nel backlog."
  b.creator = willy
end
[nonna, spongebob, mia, darth, totoro, admin].each { |u| cioccolato.board_memberships.find_or_create_by!(user: u) }

c_labels = [
  { name: "golden ticket", color: "#d29922" },
  { name: "oompa loompa", color: "#f0883e" },
  { name: "everlasting", color: "#57ab5a" },
  { name: "fizzy lifting", color: "#539bf5" },
].map { |l| cioccolato.labels.find_or_create_by!(name: l[:name]) { |lb| lb.color = l[:color] } }

c_cards = [
  { title: "Il fiume di cioccolato ha un throughput insufficiente", column: "todo", pos: 0, labels: [0, 2],
    desc: "Il fiume produce 3000 litri/ora ma la domanda è di 8000. Ho chiesto agli Oompa Loompa di remare più veloce. Hanno risposto con una canzone di protesta di 4 minuti." },
  { title: "Augustus Gloop è caduto nel backlog (letteralmente)", column: "todo", pos: 1, labels: [0],
    desc: "È caduto nel fiume di cioccolato e ora è bloccato nel tubo di aspirazione. È il terzo bambino questo trimestre. Ho aggiunto 'non cadere nel cioccolato' all'onboarding." },
  { title: "Le caramelle Everlasting violano la legge di conservazione dell'energia", column: "todo", pos: 2, labels: [2],
    desc: "Una caramella che non finisce mai viola la termodinamica. I fisici sono arrabbiati. Il marketing dice 'è una feature'. Il legale dice 'non c'è precedente'. Continuiamo a venderle." },
  { title: "Il Fizzy Lifting Drink ha fatto volare via 3 dipendenti", column: "doing", pos: 0, labels: [3],
    desc: "Sono sul soffitto da martedì. Li nutriamo con un drone. HR dice che tecnicamente sono ancora in orario di lavoro. I loro task vengono completati con una puntualità del 100%. Dal soffitto." },
  { title: "Automatizzare la canzone degli Oompa Loompa per ogni incidente", column: "doing", pos: 1, labels: [1],
    desc: "Attualmente gli Oompa Loompa devono comporre una canzone originale per ogni bambino che cade/esplode/si trasforma. Propongo un template: [nome] era [difetto], ora è [conseguenza]. Chitarra. Ballo." },
  { title: "L'ascensore di vetro è andato in orbita (non era previsto)", column: "doing", pos: 2, labels: [3, 0],
    desc: "L'ascensore era configurato per andare al quarto piano. È andato nello spazio. C'è un Oompa Loompa in orbita geostazionaria. Manda selfie. Sembra contento." },
  { title: "Implementare golden ticket NFT (era ironico, l'hanno fatto davvero)", column: "done", pos: 0, labels: [0],
    desc: "Il marketing ha preso la battuta sul serio. Ora vendiamo Golden Ticket NFT. Ogni NFT dà accesso a un tour virtuale dove un avatar di Wonka ti giudica per le tue scelte di vita." },
  { title: "Le lecca-lecca alla tappezzeria funzionano (purtroppo)", column: "done", pos: 1, labels: [2, 1],
    desc: "La tappezzeria ha il sapore di fragola. I dipendenti leccano i muri durante la pausa pranzo. L'igiene dice no. Il morale dice sì. Compromesso: muri leccabili solo nelle aree designate." },
  { title: "Formazione: gli Oompa Loompa hanno imparato Kubernetes", column: "done", pos: 2, labels: [1, 3],
    desc: "Ora gestiscono i cluster cantando. Ogni pod ha un jingle. Il monitoring è una coreografia. I grafici Grafana sono decorati con cioccolatini. È l'infrastruttura più felice del mondo." },
]

c_cards.each do |data|
  card = cioccolato.cards.find_or_create_by!(title: data[:title]) do |c|
    c.column = data[:column]
    c.position = data[:pos]
    c.description = data[:desc]
    c.creator = willy
  end
  data[:labels].each { |i| card.card_labels.find_or_create_by!(label: c_labels[i]) }
  [nonna, spongebob, mia, darth, totoro].sample(2).each { |u| card.card_participants.find_or_create_by!(user: u) rescue nil }
end

Comment.find_or_create_by!(card: cioccolato.cards[0], user: spongebob, body: "Al Krusty Krab abbiamo lo stesso problema col ketchup. La soluzione è semplice: più tubi. I tubi risolvono tutto. Chiedete a Mario.")
Comment.find_or_create_by!(card: cioccolato.cards[0], user: nonna, body: "3000 litri/ora? Il mio ragù produce più sapore per litro. E non ho bisogno di Oompa Loompa. Ho il mattarello.")
Comment.find_or_create_by!(card: cioccolato.cards[1], user: mia, body: "INCIDENTE HR #847: dipendente caduto in prodotto alimentare. Di nuovo. Aggiorno il modulo. Il modulo ha una sezione dedicata ora. 'Tipo di cioccolato in cui è caduto: ___'")
Comment.find_or_create_by!(card: cioccolato.cards[2], user: darth, body: "Nell'Impero abbiamo la Forza, che anche lei viola la termodinamica. Nessun fisico si lamenta. Perché li abbiamo Force-chokati. Suggerimento: considerate il Force-choking.")
Comment.find_or_create_by!(card: cioccolato.cards[3], user: totoro, body: "I 3 dipendenti sul soffitto hanno un uptime del 100% perché non possono andarsene. Propongo di rinominare il Fizzy Lifting Drink in 'Employee Retention Solution'.")
Comment.find_or_create_by!(card: cioccolato.cards[4], user: willy, body: "Il template per le canzoni è stato rifiutato dagli Oompa Loompa. Dicono che 'l'arte non si può templatizzare'. Hanno ragione. Ma il budget per compositori originali è finito a marzo.")
Comment.find_or_create_by!(card: cioccolato.cards[5], user: darth, body: "Abbiamo un Oompa Loompa in orbita. Nell'Impero questo sarebbe una promozione. Lo chiamiamo 'Senior Space Oompa Loompa'. Paga extra per il disagio extraatmosferico.")
Comment.find_or_create_by!(card: cioccolato.cards[8], user: totoro, body: "Il cluster Kubernetes gestito dagli Oompa Loompa ha il 99.99% di uptime e il 100% di vibes. Il monitoring a coreografia è stranamente efficace. Ogni downtime ha un jingle triste.")

# Notifications
boards = [lasagna, tarantino, therapy, fuga, ricette, impero, tubi, cioccolato]
notif_data = [
  { user: admin, actor: gatto, board: lasagna, type: "participant_added" },
  { user: admin, actor: mia, board: tarantino, type: "participant_added" },
  { user: admin, actor: spongebob, board: fuga, type: "comment" },
  { user: admin, actor: nonna, board: ricette, type: "mention" },
  { user: admin, actor: shrek, board: therapy, type: "participant_added" },
  { user: admin, actor: darth, board: impero, type: "comment" },
  { user: admin, actor: mario, board: tubi, type: "participant_added" },
  { user: admin, actor: willy, board: cioccolato, type: "mention" },
  { user: gatto, actor: nonna, board: lasagna, type: "comment" },
  { user: gandalf, actor: mia, board: fuga, type: "mention" },
  { user: mario, actor: totoro, board: tubi, type: "comment" },
  { user: darth, actor: spongebob, board: impero, type: "comment" },
]

notif_data.each do |nd|
  card = nd[:board].cards.first
  Notification.find_or_create_by!(user: nd[:user], actor: nd[:actor], notifiable: card, notification_type: nd[:type])
end

puts "Seeded #{User.count} users, #{Board.count} boards, #{Card.count} cards, #{Comment.count} comments, #{Label.count} labels, #{Notification.count} notifications"
