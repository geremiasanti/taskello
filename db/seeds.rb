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
]

users = users_data.map do |data|
  User.find_or_create_by!(username: data[:username]) do |u|
    u.email = data[:email]
    u.password = data[:password]
  end
end

admin, gatto, nonna, carlo, shrek, mia, spongebob, gandalf = users

# ═══════════════════════════════════════════════════
# Board 1: Operazione Lasagna Interdimensionale
# ═══════════════════════════════════════════════════
lasagna = Board.find_or_create_by!(name: "Operazione Lasagna Interdimensionale") do |b|
  b.description = "Garfield ha aperto un portale nel forno a microonde. La lasagna è diventata senziente. Serve un piano."
  b.creator = gatto
end
[nonna, carlo, shrek, spongebob, admin].each { |u| lasagna.board_memberships.find_or_create_by!(user: u) }

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
  { title: "Convincere la besciamella a smettere di levitare", column: "doing", pos: 0, labels: [2, 3],
    desc: "Da martedì la besciamella fluttua a 2 metri dal pavimento. L'esorcista ha detto che non è di sua competenza perché tecnicamente è un latticino." },
  { title: "Tradurre il manifesto politico della lasagna in 14 lingue", column: "doing", pos: 1, labels: [0],
    desc: "Include il Klingon e il linguaggio dei Minions. La lasagna insiste anche sul Quenya." },
  { title: "Assumere Quentin Tarantino per il documentario sulla lasagna", column: "doing", pos: 2, labels: [1],
    desc: "Ha già scritto 3 scene di dialogo tra la lasagna e una forchetta. C'è molto sangue (di pomodoro). La colonna sonora è solo Morricone." },
  { title: "La mozzarella ha raggiunto la coscienza di sé", column: "done", pos: 0, labels: [2],
    desc: "Ha chiesto 'cosa sono?' e poi si è sciolta in lacrime. Letteralmente. Era filante." },
  { title: "Installare il sistema operativo sulla teglia", column: "done", pos: 1, labels: [0, 3],
    desc: "Gira Linux. La lasagna ha scelto Arch BTW. Il parmigiano fa da dissipatore termico." },
  { title: "Evacuare il frigorifero dopo la rivolta dei würstel", column: "done", pos: 2, labels: [0],
    desc: "I würstel hanno preso in ostaggio il burro. Abbiamo mandato dentro un negoziatore (un grissino). Non è tornato." },
]

l1_cards.each do |data|
  card = lasagna.cards.find_or_create_by!(title: data[:title]) do |c|
    c.column = data[:column]
    c.position = data[:pos]
    c.description = data[:desc]
    c.creator = gatto
  end
  data[:labels].each { |i| card.card_labels.find_or_create_by!(label: l1_labels[i]) }
  [nonna, carlo, spongebob].sample(2).each { |u| card.card_participants.find_or_create_by!(user: u) rescue nil }
end

Comment.find_or_create_by!(card: lasagna.cards.first, user: nonna, body: "Ai miei tempi le lasagne stavano zitte e si facevano mangiare. Questa generazione di primi piatti è insopportabile.")
Comment.find_or_create_by!(card: lasagna.cards.first, user: carlo, body: "Ho provato a ragionare con la lasagna ma mi ha risposto con una citazione di Nietzsche e poi mi ha lanciato un foglio di alloro. @il_gatto_quantico help")
Comment.find_or_create_by!(card: lasagna.cards.first, user: spongebob, body: "Nella mia esperienza manageriale al Krusty Krab, quando il cibo diventa senziente bisogna offrirgli stock options")
Comment.find_or_create_by!(card: lasagna.cards[2], user: shrek, body: "Nel mio studio terapeutico ho avuto un caso simile con una cipolla che aveva troppi strati emotivi. Consiglio CBT (Cognitive Besciamella Therapy)")
Comment.find_or_create_by!(card: lasagna.cards[4], user: gatto, body: "UPDATE: la besciamella ora canta 'Bohemian Rhapsody' a mezz'aria. È intonata, il che rende tutto più inquietante.")

# ═══════════════════════════════════════════════════
# Board 2: Tarantino presenta: Sprint Planning
# ═══════════════════════════════════════════════════
tarantino = Board.find_or_create_by!(name: "Tarantino presenta: Sprint Planning") do |b|
  b.description = "Lo sprint planning più violento della storia dell'Agile. Il product owner è Jules Winnfield. Il daily standup dura 3 ore ed è tutto in ordine non cronologico."
  b.creator = mia
end
[gatto, nonna, carlo, gandalf, admin].each { |u| tarantino.board_memberships.find_or_create_by!(user: u) }

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
  { title: "Il QA ha citato Ezechiele 25:17 prima di aprire un bug report", column: "doing", pos: 0, labels: [3, 0],
    desc: "'Il cammino del giusto tester è minacciato da ogni parte dalle iniquità del codice legacy e dalla tirannia dei fix last-minute.' Poi ha riaperto 47 ticket." },
  { title: "Trunk shot della code review", column: "doing", pos: 1, labels: [2],
    desc: "Tutte le code review ora vengono filmate dal basso verso l'alto, tipo quando aprono il bagagliaio in Pulp Fiction. Il portatile del reviewer è nel trunk." },
  { title: "Il product owner parla solo per monologhi di 8 minuti", column: "doing", pos: 2, labels: [3],
    desc: "Ha spiegato una user story di login con un monologo che partiva dalla filosofia greca, passava per un aneddoto su una rapina in un diner, e finiva con 'e il bottone deve essere blu'." },
  { title: "Colonna sonora dello sprint: solo surf rock e Morricone", column: "done", pos: 0, labels: [0],
    desc: "La playlist include Misirlou, il tema de Il Buono il Brutto il Cattivo, e Girl You'll Be A Woman Soon per le sessioni di pair programming." },
  { title: "Refactoring della scena del ristorante (tavolo 3)", column: "done", pos: 1, labels: [1, 3],
    desc: "Il codice è stato riscritto 4 volte. Ogni volta la scena inizia dallo stesso punto ma con prospettive diverse. Git blame è un inferno multidimensionale." },
  { title: "Aggiungere easter egg: in ogni pagina c'è un piede", column: "done", pos: 2, labels: [2],
    desc: "Su richiesta esplicita del regista. 'Ogni buon software ha almeno un piede nascosto.' - Quentin T., CTO ad interim" },
]

t_cards.each do |data|
  card = tarantino.cards.find_or_create_by!(title: data[:title]) do |c|
    c.column = data[:column]
    c.position = data[:pos]
    c.description = data[:desc]
    c.creator = mia
  end
  data[:labels].each { |i| card.card_labels.find_or_create_by!(label: t_labels[i]) }
  [gatto, gandalf, carlo].sample(2).each { |u| card.card_participants.find_or_create_by!(user: u) rescue nil }
end

Comment.find_or_create_by!(card: tarantino.cards.first, user: gandalf, body: "Come stagista devo dire che non ho MAI visto uno sprint planning con un messicano standoff tra il PM, il designer e DevOps. Bellissimo però.")
Comment.find_or_create_by!(card: tarantino.cards.first, user: carlo, body: "Il Big Kahuna Burger è sopravvalutato. Fight me. @mia_wallace_HR ti prego non licenziarmi per questo")
Comment.find_or_create_by!(card: tarantino.cards[4], user: nonna, body: "Ai miei tempi i tester non citavano la Bibbia, semplicemente ti guardavano male finché non fixavi il bug. Era più efficace.")
Comment.find_or_create_by!(card: tarantino.cards[6], user: gatto, body: "Ho cronometrato l'ultimo monologo del PO: 11 minuti e 34 secondi. Ha parlato di un viaggio in Thailandia prima di dire che il font deve essere Helvetica.")

# ═══════════════════════════════════════════════════
# Board 3: Shrek's Therapy & Wellness Center
# ═══════════════════════════════════════════════════
therapy = Board.find_or_create_by!(name: "Shrek's Therapy & Wellness Center") do |b|
  b.description = "Studio di psicoterapia per personaggi di finzione con problemi reali. 'Le cipolle hanno strati. Le persone hanno strati. Il trauma ha strati.' - Dr. Shrek, PhD"
  b.creator = shrek
end
[mia, spongebob, gandalf, nonna, admin].each { |u| therapy.board_memberships.find_or_create_by!(user: u) }

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
  { title: "Dobby: dipendenza dal dare calzini a sconosciuti", column: "doing", pos: 0, labels: [1, 2],
    desc: "Sessione interrotta 6 volte perché Dobby continuava a togliersi i calzini e a regalarli. Ne ha dati uno al portaombrelli pensando fosse 'un bastone triste che ha bisogno di calore'." },
  { title: "Thanos: perfezionismo e pensiero dicotomico", column: "doing", pos: 1, labels: [0],
    desc: "Tutto deve essere 'perfettamente bilanciato'. Ha riorganizzato la mia sala d'attesa 3 volte. Ha eliminato metà delle riviste. 'Era necessario,' ha detto guardando il vuoto." },
  { title: "Scooby Doo: ansia generalizzata e dipendenza da Scooby Snacks", column: "doing", pos: 2, labels: [2],
    desc: "Ogni volta che sente un rumore corre a nascondersi tra le braccia di Shaggy. Il problema è che Shaggy ha la stessa identica patologia. Li tratto in coppia ora." },
  { title: "Patrick Stella: valutazione cognitiva (risultati sorprendenti)", column: "doing", pos: 3, labels: [3],
    desc: "Il test QI ha dato risultati fuori scala. In basso. Ma poi ha risolto l'ipotesi di Riemann sul retro del foglio. Lo stava usando come sottobicchiere." },
  { title: "Elsa: problemi di regolazione emotiva e climatica", column: "done", pos: 0, labels: [1, 3],
    desc: "Le ho detto 'parliamo dei suoi sentimenti' e ha congelato la stanza. Il termostato non funziona più. Il condizionatore si è dimesso." },
  { title: "Homer Simpson: dipendenza da ciambelle e negazione", column: "done", pos: 1, labels: [2],
    desc: "Dopo 6 mesi nega ancora la dipendenza. 'Posso smettere quando voglio,' ha detto mangiando la settima ciambella della seduta. Una era la mia." },
  { title: "Gollum: disturbo dissociativo dell'identità e ossessione per gioielli", column: "done", pos: 2, labels: [1, 0],
    desc: "Progresso: ora riesce a parlare di anelli senza leccarsi le mani. Regresso: ha rubato la mia fede nuziale e l'ha chiamata 'il suo tesssoro'." },
]

s_cards.each do |data|
  card = therapy.cards.find_or_create_by!(title: data[:title]) do |c|
    c.column = data[:column]
    c.position = data[:pos]
    c.description = data[:desc]
    c.creator = shrek
  end
  data[:labels].each { |i| card.card_labels.find_or_create_by!(label: s_labels[i]) }
  [mia, spongebob, gandalf].sample(2).each { |u| card.card_participants.find_or_create_by!(user: u) rescue nil }
end

Comment.find_or_create_by!(card: therapy.cards.first, user: spongebob, body: "Come CEO posso confermare che il Coyote ha un problema di procurement. Il vendor ACME ha un tasso di successo dello 0%. Nemmeno io ordinerei da loro e io vivo in un ananas.")
Comment.find_or_create_by!(card: therapy.cards.first, user: mia, body: "Come responsabile HR, devo segnalare che il Coyote ha fatto 23.847 reclami per infortuni sul lavoro. La Roadrunner Corp ci deve una montagna di soldi.")
Comment.find_or_create_by!(card: therapy.cards[3], user: gandalf, body: "Da stagista posso dire che la finestra che Vegeta ha distrutto era la mia postazione. Ora lavoro nel parcheggio. Non ho il coraggio di chiedere il rimborso a uno che può diventare Super Saiyan.")
Comment.find_or_create_by!(card: therapy.cards[5], user: nonna, body: "Ai miei tempi il perfezionismo si risolveva con uno schiaffo sul collo. Funzionava con tutti tranne che con quelli col Guanto dell'Infinito.")
Comment.find_or_create_by!(card: therapy.cards[8], user: shrek, body: "UPDATE CLINICO: Elsa ha fatto progressi. Ora congela solo metà stanza. L'altra metà è inabitabile per altri motivi (Gollum ci ha nascosto delle posate).")

# ═══════════════════════════════════════════════════
# Board 4: Piano di Fuga dalla Realtà Corporativa
# ═══════════════════════════════════════════════════
fuga = Board.find_or_create_by!(name: "Piano di Fuga dalla Realtà Corporativa") do |b|
  b.description = "SpongeBob è diventato CEO per errore dopo che il vero CEO è stato rapito da una seppia gigante. Gandalf è lo stagista. Nessuno sa cosa sta succedendo. I KPI sono numeri inventati."
  b.creator = spongebob
end
[gatto, mia, gandalf, carlo, admin].each { |u| fuga.board_memberships.find_or_create_by!(user: u) }

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
  { title: "Scrivere email aziendale senza usare 'circling back' o 'synergy'", column: "doing", pos: 0, labels: [1],
    desc: "Tentativo #247. Impossibile. L'ultimo che ci ha provato ora parla solo in haiku. / 'Synergy is dead' / 'But the Q4 targets live' / 'Let us circle back'" },
  { title: "L'algoritmo del caffè ha preso coscienza e giudica i nostri gusti", column: "doing", pos: 1, labels: [0],
    desc: "La macchinetta ora dice 'sul serio? un altro cappuccino alle 16? ti giudico' e poi fa un espresso comunque. Ha rifiutato di fare un decaffeinato dicendo 'ho dei principi'." },
  { title: "Gandalf ha messo 'You Shall Not Pass' su tutte le code review", column: "doing", pos: 2, labels: [3],
    desc: "Nessun merge è andato in produzione da 3 settimane. Lo stagista si piazza davanti al monitor con un bastone e grida. Il codice è effettivamente migliorato." },
  { title: "Trovare chi ha sostituito tutta l'acqua del dispenser con Monster Energy", column: "doing", pos: 3, labels: [3],
    desc: "Sospettiamo di Carlo. Da lunedì il team di accounting vede i colori e il CFO ha cercato di fare parkour in corridoio. Le piante dell'ufficio vibrano." },
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
  [gatto, mia, gandalf, carlo].sample(2).each { |u| card.card_participants.find_or_create_by!(user: u) rescue nil }
end

Comment.find_or_create_by!(card: fuga.cards[3], user: gandalf, body: "IN MIA DIFESA il cavo HDMI era molto simile a un artefatto elfico. E comunque Cthulhu è molto educato, ha chiesto se poteva usare la lavagna.")
Comment.find_or_create_by!(card: fuga.cards[3], user: mia, body: "Come HR devo segnalare che 'evocare divinità cosmiche' non è coperto dalla nostra polizza assicurativa. Ho controllato. Due volte. @gandalf_stagista compila il modulo 27-B/6")
Comment.find_or_create_by!(card: fuga.cards[5], user: carlo, body: "La macchinetta mi ha detto 'bella scelta, come i tuoi commit del venerdì sera'. Non so se è un complimento. Ho paura di una macchina del caffè. Sto rivalutando le mie scelte di vita.")
Comment.find_or_create_by!(card: fuga.cards[6], user: spongebob, body: "Devo ammettere che da quando Gandalf blocca le code review il numero di bug in prod è sceso del 100%. Il numero di merge anche. Coincidenza? Non credo.")
Comment.find_or_create_by!(card: fuga.cards[9], user: gatto, body: "I piccioni hanno un'interfaccia utente migliore di Jira. E almeno quando perdono un ticket puoi vederli volare via dalla finestra. Con Jira non sai mai dove vanno a finire le cose.")
Comment.find_or_create_by!(card: fuga.cards[7], user: nonna, body: "Ai miei tempi il Monster Energy non esisteva, si beveva caffè della moka alle 5 di mattina e si lavorava fino a notte. Eravamo tutti pazzi anche noi, ma con più stile.")

# ═══════════════════════════════════════════════════
# Board 5: Nonna Rambo: Ricette di Guerra
# ═══════════════════════════════════════════════════
ricette = Board.find_or_create_by!(name: "Nonna Rambo: Ricette di Guerra") do |b|
  b.description = "Nonna ha 87 anni, 3 guerre mondiali (dice lei), e un mattarello che ha visto cose. Le sue ricette sono classified NATO. Il sugo è un'arma di distruzione di massa."
  b.creator = nonna
end
[shrek, carlo, gatto, spongebob, admin].each { |u| ricette.board_memberships.find_or_create_by!(user: u) }

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
  { title: "Corso di sopravvivenza: come fare il ragù con 2 ingredienti e rabbia repressa", column: "doing", pos: 0, labels: [3, 1],
    desc: "Ingredienti: pomodoro e FURIA. La rabbia repressa è il segreto del sapore. Nonna dice che 'il ragù deve sobbollire come il tuo risentimento verso chi mette la panna nella carbonara'." },
  { title: "Sviluppare arma biologica a base di gorgonzola (per difesa personale)", column: "doing", pos: 1, labels: [2, 0],
    desc: "Il gorgonzola di Nonna è stato classificato come arma di Categoria 3 dalla Convenzione di Ginevra. È stato usato con successo per allontanare un orso, 3 testimoni di Geova, e un esattore fiscale." },
  { title: "Le polpette sono pronte (non chiedere cosa c'è dentro)", column: "doing", pos: 2, labels: [0],
    desc: "Nonna dice che la ricetta è segreta. L'ultima persona che ha chiesto gli ingredienti è stata vista l'ultima volta a Praga nel '97. Probabilmente non c'è correlazione. Probabilmente." },
  { title: "Frittata di sopravvivenza: funziona anche come giubbotto antiproiettile", column: "done", pos: 0, labels: [3, 0],
    desc: "Testata dal cugino Alfredo che se l'è messa addosso per scommessa. Risultato: ha fermato un pallone da calcio, 3 insulti, e il passare del tempo (la frittata è uguale da 6 mesi)." },
  { title: "Negoziare la resa del microonde nemico (quello di Carlo)", column: "done", pos: 1, labels: [2],
    desc: "Il microonde di Carlo ha rifiutato di scaldare il ragù di Nonna. Questo è stato considerato un atto di guerra. Il microonde è stato... 'neutralizzato'. Con il mattarello." },
  { title: "Scrivere testamento: a chi va la ricetta del sugo", column: "done", pos: 2, labels: [3],
    desc: "Dopo lunga deliberazione: la ricetta va a chi riesce a fare la sfoglia a mano senza piangere. Attualmente nessun erede qualificato. Nonna ride." },
]

r_cards.each do |data|
  card = ricette.cards.find_or_create_by!(title: data[:title]) do |c|
    c.column = data[:column]
    c.position = data[:pos]
    c.description = data[:desc]
    c.creator = nonna
  end
  data[:labels].each { |i| card.card_labels.find_or_create_by!(label: r_labels[i]) }
  [shrek, carlo, gatto].sample(2).each { |u| card.card_participants.find_or_create_by!(user: u) rescue nil }
end

Comment.find_or_create_by!(card: ricette.cards.first, user: carlo, body: "Ho provato il tiramisù tattico. Ho visto Dio. Dio mangiava tiramisù. Era un loop ricorsivo di tiramisù. Sono cambiato come persona.")
Comment.find_or_create_by!(card: ricette.cards.first, user: shrek, body: "Come terapeuta devo dire che questo tiramisù ha risolto più traumi delle mie sedute. Come terapeuta devo anche dire che questo mi preoccupa profondamente.")
Comment.find_or_create_by!(card: ricette.cards[4], user: gatto, body: "Il gorgonzola ha appena fatto scappare il postino. Non ha nemmeno bussato, ha sentito l'odore dal cancello e ha lasciato il pacco nel comune limitrofo.")
Comment.find_or_create_by!(card: ricette.cards[3], user: spongebob, body: "Al Krusty Krab usiamo un metodo simile: il segreto della Krabby Patty è 73% amore e 27% rancore verso Plankton. @nonna_rambo potremmo fare una collab")

# Notifications
Notification.find_or_create_by!(user: admin, actor: gatto, notifiable: lasagna.cards.first, notification_type: "participant_added")
Notification.find_or_create_by!(user: admin, actor: mia, notifiable: tarantino.cards.first, notification_type: "participant_added")
Notification.find_or_create_by!(user: admin, actor: spongebob, notifiable: fuga.cards.first, notification_type: "comment")
Notification.find_or_create_by!(user: admin, actor: nonna, notifiable: ricette.cards.first, notification_type: "mention")
Notification.find_or_create_by!(user: admin, actor: shrek, notifiable: therapy.cards[3], notification_type: "participant_added")

puts "Seeded #{User.count} users, #{Board.count} boards, #{Card.count} cards, #{Comment.count} comments, #{Label.count} labels, #{Notification.count} notifications"
