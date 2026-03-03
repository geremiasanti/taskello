puts "Seeding Taskello..."

# Users
users_data = [
  { username: "admin", email: "admin@taskello.dev", password: "password" },
  { username: "barbascura_x", email: "barbascura@taskello.dev", password: "password" },
  { username: "pippo_baudo", email: "pippo@taskello.dev", password: "password" },
  { username: "gianni_morandi", email: "gianni@taskello.dev", password: "password" },
  { username: "ilary_blasi", email: "ilary@taskello.dev", password: "password" },
  { username: "chiara_ferragni", email: "chiara@taskello.dev", password: "password" },
  { username: "totti_er_pupone", email: "totti@taskello.dev", password: "password" },
  { username: "salvini_meme", email: "salvini@taskello.dev", password: "password" },
]

users = users_data.map do |data|
  User.find_or_create_by!(username: data[:username]) do |u|
    u.email = data[:email]
    u.password = data[:password]
  end
end

admin, barbascura, pippo, gianni, ilary, chiara, totti, salvini = users

# Board 1: Grande Fratello
gf = Board.find_or_create_by!(name: "Grande Fratello VIP 2026") do |b|
  b.description = "Organizzazione della prossima edizione del GF VIP. Chi entra? Chi esce? Chi piange in confessionale?"
  b.creator = ilary
end
[pippo, gianni, chiara, totti, admin].each do |u|
  gf.board_memberships.find_or_create_by!(user: u)
end

gf_labels = [
  { name: "urgente", color: "#e5534b" },
  { name: "casting", color: "#f0883e" },
  { name: "budget", color: "#d29922" },
  { name: "social", color: "#539bf5" },
].map { |l| gf.labels.find_or_create_by!(name: l[:name]) { |label| label.color = l[:color] } }

gf_cards = [
  { title: "Trovare almeno 3 concorrenti che piangono al primo giorno", column: "todo", pos: 0, labels: [0, 1] },
  { title: "Budget per scorta di fazzoletti confessionale", column: "todo", pos: 1, labels: [2] },
  { title: "Contattare Signorini per la conduzione", column: "doing", pos: 0, labels: [1] },
  { title: "Setup social media drama pipeline", column: "doing", pos: 1, labels: [3] },
  { title: "Selezione concorrenti che non sanno cucinare", column: "doing", pos: 2, labels: [1] },
  { title: "Prenotare divano IKEA per il confessionale", column: "done", pos: 0, labels: [2] },
  { title: "Creare hashtag ufficiale #GFVIP2026", column: "done", pos: 1, labels: [3] },
  { title: "Installare telecamere anche nel frigorifero", column: "done", pos: 2, labels: [] },
  { title: "Preparare puntata speciale 'tutti contro tutti'", column: "todo", pos: 2, labels: [0] },
  { title: "Assicurarsi che nessuno sappia davvero cantare", column: "todo", pos: 3, labels: [1] },
]

gf_cards.each do |data|
  card = gf.cards.find_or_create_by!(title: data[:title]) do |c|
    c.column = data[:column]
    c.position = data[:pos]
    c.creator = ilary
  end
  data[:labels].each { |i| card.card_labels.find_or_create_by!(label: gf_labels[i]) }
  [pippo, gianni].each { |u| card.card_participants.find_or_create_by!(user: u) rescue nil }
end

# Comments on GF cards
gf.cards.first(3).each do |card|
  Comment.find_or_create_by!(card: card, user: pippo, body: "Io ai miei tempi facevo entrare solo gente seria... tipo Al Bano")
  Comment.find_or_create_by!(card: card, user: totti, body: "Ma che stamo a fa? @ilary_blasi spiegame")
end

# Board 2: Sanremo 2026
sanremo = Board.find_or_create_by!(name: "Sanremo 2026") do |b|
  b.description = "Pianificazione festival. Obiettivo: far durare la serata finale meno di 6 ore (impossibile)."
  b.creator = pippo
end
[gianni, barbascura, ilary, admin].each do |u|
  sanremo.board_memberships.find_or_create_by!(user: u)
end

sr_labels = [
  { name: "palco", color: "#57ab5a" },
  { name: "ospiti", color: "#b083f0" },
  { name: "polemiche", color: "#e5534b" },
  { name: "fiori", color: "#f778ba" },
].map { |l| sanremo.labels.find_or_create_by!(name: l[:name]) { |label| label.color = l[:color] } }

sr_cards = [
  { title: "Ordinare 50.000 rose per il lancio petali", column: "todo", pos: 0, labels: [3] },
  { title: "Convincere Celentano a presentarsi (spoiler: non viene)", column: "todo", pos: 1, labels: [1] },
  { title: "Preparare discorso di 45 minuti per Amadeus", column: "todo", pos: 2, labels: [0] },
  { title: "Gestire polemica pre-festival su Twitter", column: "doing", pos: 0, labels: [2] },
  { title: "Soundcheck con orchestra (3 ore minimo)", column: "doing", pos: 1, labels: [0] },
  { title: "Contattare Gianni Morandi come super ospite", column: "doing", pos: 2, labels: [1] },
  { title: "Confermare che la scaletta durer solo 5 ore (menzogna)", column: "done", pos: 0, labels: [0, 2] },
  { title: "Prenotare 200 posti per parenti dei cantanti", column: "done", pos: 1, labels: [] },
  { title: "Pubblicare classifica provvisoria per generare caos", column: "todo", pos: 3, labels: [2] },
  { title: "Trovare qualcuno che sappia davvero suonare il basso", column: "doing", pos: 3, labels: [0] },
]

sr_cards.each do |data|
  card = sanremo.cards.find_or_create_by!(title: data[:title]) do |c|
    c.column = data[:column]
    c.position = data[:pos]
    c.creator = pippo
  end
  data[:labels].each { |i| card.card_labels.find_or_create_by!(label: sr_labels[i]) }
end

Comment.find_or_create_by!(card: sanremo.cards.first, user: gianni, body: "Ragazzi io ci sono sempre! Anche se non mi invitate vengo lo stesso!")
Comment.find_or_create_by!(card: sanremo.cards.first, user: barbascura, body: "Posso fare un monologo sulla fotosintesi? @pippo_baudo dai")

# Board 3: Piano Influencer
influencer = Board.find_or_create_by!(name: "Piano Influencer Q1") do |b|
  b.description = "Strategia content Q1 2026. Sponsor, collaborazioni, drama pianificato."
  b.creator = chiara
end
[ilary, totti, salvini, admin].each do |u|
  influencer.board_memberships.find_or_create_by!(user: u)
end

inf_labels = [
  { name: "instagram", color: "#f0883e" },
  { name: "tiktok", color: "#39d353" },
  { name: "sponsor", color: "#d29922" },
  { name: "drama", color: "#e5534b" },
].map { |l| influencer.labels.find_or_create_by!(name: l[:name]) { |label| label.color = l[:color] } }

inf_cards = [
  { title: "Foto al tramonto con didascalia filosofica", column: "todo", pos: 0, labels: [0] },
  { title: "TikTok 'day in my life' (spoiler: tutto falso)", column: "todo", pos: 1, labels: [1] },
  { title: "Sponsorizzazione the detox (funziona? chi lo sa)", column: "doing", pos: 0, labels: [2] },
  { title: "Drama pianificato con @ilary_blasi per engagement", column: "doing", pos: 1, labels: [3] },
  { title: "Rispondere ai commenti cattivi con emoji cuore", column: "doing", pos: 2, labels: [0, 1] },
  { title: "Unboxing regalo sponsor da 10k euro", column: "done", pos: 0, labels: [2] },
  { title: "Stories 'buongiorno' con faccia appena sveglia (ci metto 2 ore)", column: "done", pos: 1, labels: [0] },
  { title: "Collaborazione con brand di pasta (perche no)", column: "todo", pos: 2, labels: [2] },
]

inf_cards.each do |data|
  card = influencer.cards.find_or_create_by!(title: data[:title]) do |c|
    c.column = data[:column]
    c.position = data[:pos]
    c.creator = chiara
  end
  data[:labels].each { |i| card.card_labels.find_or_create_by!(label: inf_labels[i]) }
end

# Board 4: Ponte sullo Stretto
ponte = Board.find_or_create_by!(name: "Ponte sullo Stretto") do |b|
  b.description = "Progetto ponte Messina-Calabria. Stavolta si fa davvero (forse) (probabilmente no)."
  b.creator = salvini
end
[barbascura, pippo, totti, admin].each do |u|
  ponte.board_memberships.find_or_create_by!(user: u)
end

pt_labels = [
  { name: "burocrazia", color: "#e5534b" },
  { name: "ingegneria", color: "#539bf5" },
  { name: "budget", color: "#d29922" },
  { name: "propaganda", color: "#b083f0" },
].map { |l| ponte.labels.find_or_create_by!(name: l[:name]) { |label| label.color = l[:color] } }

pt_cards = [
  { title: "Trovare dove mettere il ponte (dettaglio)", column: "todo", pos: 0, labels: [1] },
  { title: "Calcolare se i soldi bastano (no)", column: "todo", pos: 1, labels: [2] },
  { title: "Fare conferenza stampa trionfale", column: "doing", pos: 0, labels: [3] },
  { title: "Rispondere a chi dice che e' impossibile", column: "doing", pos: 1, labels: [3] },
  { title: "Studio impatto ambientale (leggerlo opzionale)", column: "doing", pos: 2, labels: [0, 1] },
  { title: "Rendere tutto un meme per distogliere attenzione", column: "done", pos: 0, labels: [3] },
  { title: "Chiedere fondi EU (risposta: no)", column: "done", pos: 1, labels: [2] },
  { title: "Comprare rendering 3D molto bello per Instagram", column: "done", pos: 2, labels: [3] },
  { title: "Verificare se la Sicilia e' davvero un'isola", column: "todo", pos: 2, labels: [1] },
  { title: "Consultare ingegneri (poi ignorarli)", column: "todo", pos: 3, labels: [0, 1] },
  { title: "Piano B: tunnel sottomarino (piano C: niente)", column: "todo", pos: 4, labels: [1] },
  { title: "Inaugurazione virtuale in VR (per sicurezza)", column: "doing", pos: 3, labels: [3] },
]

pt_cards.each do |data|
  card = ponte.cards.find_or_create_by!(title: data[:title]) do |c|
    c.column = data[:column]
    c.position = data[:pos]
    c.creator = salvini
  end
  data[:labels].each { |i| card.card_labels.find_or_create_by!(label: pt_labels[i]) }
end

Comment.find_or_create_by!(card: ponte.cards.first, user: barbascura, body: "Da un punto di vista scientifico... no. Semplicemente no. @salvini_meme")
Comment.find_or_create_by!(card: ponte.cards.first, user: totti, body: "Io il ponte lo faccio a pallonate")

# Some notifications
Notification.find_or_create_by!(user: admin, actor: ilary, notifiable: gf.cards.first, notification_type: "participant_added")
Notification.find_or_create_by!(user: admin, actor: pippo, notifiable: sanremo.cards.first, notification_type: "participant_added")

puts "Seeded #{User.count} users, #{Board.count} boards, #{Card.count} cards, #{Comment.count} comments, #{Label.count} labels, #{Notification.count} notifications"
puts ""
puts "Login credentials (all passwords: 'password'):"
users_data.each { |u| puts "  #{u[:username]} / #{u[:email]}" }
