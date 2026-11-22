// Line format:  Canonical|Alias|Alias:level:Reference   (see people.ts)
import { q } from './define'

export const world = [
  q('cities', 'Name a city or town mentioned in the Bible', 'Places', `
Jerusalem|Salem|Jebus|City of David:5:2Sa5
Bethlehem|Ephrathah:5:Mic5:2
Nazareth:5:Lk1:26
Jericho:5:Jos6
Babylon|Babel:4:Ge11
Nineveh:4:Jon1
Sodom:4:Ge19
Gomorrah:4:Ge19
Capernaum:3:Mt4:13
Bethany:3:Jn11
Damascus:3:Ac9
Rome:3:Ac28
Corinth:3:Ac18
Ephesus:3:Ac19
Antioch:3:Ac11:26
Tarsus:2:Ac9:11
Hebron|Kiriath-Arba:2:Ge23
Bethel|Luz:2:Ge28:19
Samaria:3:1Ki16:24
Shiloh:2:1Sa1
Gath:2:1Sa17
Ai:2:Jos7
Joppa|Jaffa:2:Jon1:3
Tyre:2:Eze27
Sidon|Zidon:2:Mt11:21
Cana:3:Jn2
Emmaus:2:Lk24:13
Bethsaida:2:Mk8:22
Chorazin|Korazin:1:Mt11:21
Nain:1:Lk7:11
Thessalonica:2:Ac17
Philippi:2:Ac16
Colossae|Colosse:1:Col1:2
Laodicea:2:Rev3:14
Smyrna:1:Rev2:8
Pergamum|Pergamos:1:Rev2:12
Thyatira:1:Rev2:18
Sardis:1:Rev3:1
Philadelphia:1:Rev3:7
Athens:2:Ac17
Lystra:1:Ac14
Derbe:1:Ac14
Iconium:1:Ac14
Berea|Beroea:1:Ac17:10
Troas:1:Ac16:8
Miletus:1:Ac20:15
Caesarea|Caesarea Philippi:2:Ac10
Gaza:2:Jdg16
Ashdod|Azotus:1:1Sa5
Ashkelon|Askelon:1:Jdg14:19
Ekron:1:1Sa5:10
Ur|Ur of the Chaldees:3:Ge11:31
Haran|Charran:2:Ge12:4
Shechem:2:Ge12:6
Sychar:1:Jn4:5
Beersheba|Beer-Sheba:2:Ge21
Gibeah:1:Jdg19
Gilgal:1:Jos4
Mizpah:1:1Sa7
Ramah:1:1Sa1:19
Anathoth:1:Jer1:1
Tekoa:1:Am1:1
Shunem:1:2Ki4
Jezreel:1:1Ki21
Megiddo:1:2Ki23:29
Dan:1:Jdg18
Gerar:1:Ge20
Zoar:1:Ge19:22
Admah:0:Ge14:2
Zeboiim:0:Ge14:2
Hazor:1:Jos11
Lachish:1:2Ki18:14
Kiriath-Jearim|Kirjath-Jearim:0:1Sa7
Gibeon:1:Jos9
Nob:1:1Sa21
Ziklag:1:1Sa30
Endor:1:1Sa28
Timnah|Timnath:1:Jdg14
Zorah:0:Jdg13
Eshtaol:0:Jdg13:25
Susa|Shushan:2:Est1
Ecbatana|Achmetha:0:Ezr6:2
Calah:0:Ge10:11
Erech:0:Ge10:10
Akkad|Accad:0:Ge10:10
Arimathea:1:Mt27:57
Magdala|Magadan:1:Mt15:39
Bethphage:1:Mt21:1
Cenchreae|Cenchrea:0:Ac18:18
Puteoli:0:Ac28:13
Syracuse:0:Ac28:12
Rhegium:0:Ac28:13
Patara:0:Ac21:1
Myra:0:Ac27:5
Perga:1:Ac13:13
Attalia:0:Ac14:25
Paphos:1:Ac13:6
Salamis:0:Ac13:5
Neapolis:0:Ac16:11
Apollonia:0:Ac17:1
Amphipolis:0:Ac17:1
Ptolemais|Acco:0:Ac21:7
Lydda:1:Ac9:32
Hierapolis:0:Col4:13
Nicopolis:0:Tit3:12
Tiberias:1:Jn6:23
Beth-Shemesh|Bethshemesh:1:1Sa6
Beth-Shan|Bethshan|Beth-Shean:1:1Sa31:10
Jabesh-Gilead|Jabesh:1:1Sa11
Ramoth-Gilead:1:1Ki22
Kadesh|Kadesh-Barnea:1:Nu20
Rabbah:0:2Sa11
Heshbon:0:Nu21:26
Dibon:0:Nu21:30
Tirzah:0:1Ki16:23
Penuel|Peniel:1:Ge32:30
Succoth:1:Ge33:17
Mahanaim:0:Ge32:2
Ophrah:0:Jdg6:11
Thebes|No-Amon:0:Na3:8
Memphis|Noph:0:Jer46:14
Pithom:1:Ex1:11
Rameses|Raamses:1:Ex1:11
Heliopolis:0:Ge41:45
Zarephath|Sarepta:1:1Ki17:9
Carchemish:0:Jer46:2
Hamath:0:2Ki17:24
Riblah:0:2Ki25:6
Gath-Hepher:0:2Ki14:25
Elath|Eloth:0:2Ki14:22
Ezion-Geber|Eziongeber:0:1Ki9:26
Beth-Horon|Bethhoron:0:Jos10:10
`),

  q('animals', 'Name an animal mentioned in the Bible', 'Creation', `
Lion|Lions:5:Da6
Lamb:5:Jn1:29
Sheep:5:Ps23
Snake|Serpent:5:Ge3
Donkey|Ass:5:Nu22
Camel:4:Ge24
Dove:4:Ge8
Fish:4:Jon1:17
Whale:3:Mt12:40
Raven:3:1Ki17
Goat:4:Lev16
Ox|Oxen:3:Dt25:4
Cow|Kine|Cattle:3:Ge41
Bull|Bullock:3:Ex29
Calf:3:Ex32
Horse:3:Ex15
Dog:3:1Ki21:19
Pig|Swine|Hog:4:Lk15
Wolf:3:Mt7:15
Bear:3:2Ki2:24
Locust|Grasshopper:3:Ex10
Frog:3:Ex8
Gnat|Lice:2:Ex8:16
Fly|Flies:2:Ex8:21
Eagle:3:Isa40:31
Sparrow:2:Mt10:29
Owl:1:Lev11:17
Ostrich:1:Job39:13
Stork:1:Jer8:7
Heron:0:Lev11:19
Hoopoe|Lapwing:0:Lev11:19
Quail:2:Ex16:13
Partridge:0:1Sa26:20
Hen|Chicken:1:Mt23:37
Rooster|Cock:2:Mt26:34
Pelican:0:Ps102:6
Vulture:1:Lev11:13
Hawk|Falcon:1:Job39:26
Kite:0:Lev11:14
Swallow:0:Ps84:3
Crane:0:Isa38:14
Peacock:0:1Ki10:22
Deer|Hart|Hind|Stag:2:Ps42:1
Gazelle|Roebuck|Roe:1:Dt14:5
Ibex|Wild goat:0:Dt14:5
Antelope:0:Dt14:5
Fox:2:Jdg15:4
Jackal:1:Isa13:22
Leopard:2:Jer13:23
Hyena:0:Isa13:22
Behemoth:1:Job40:15
Leviathan:2:Job41
Bat:0:Lev11:19
Mouse|Mice:1:1Sa6:4
Rat:0:1Sa6:4
Mole:0:Lev11:30
Weasel:0:Lev11:29
Lizard:0:Lev11:30
Gecko:0:Lev11:30
Chameleon:0:Lev11:30
Hare|Rabbit:0:Lev11:6
Rock badger|Coney|Hyrax|Badger:0:Lev11:5
Ant:1:Pr6:6
Bee:2:Jdg14:8
Hornet:0:Ex23:28
Scorpion:1:Lk10:19
Spider:0:Pr30:28
Moth:1:Mt6:19
Worm|Maggot:1:Jon4:7
Flea:0:1Sa24:14
Leech|Horseleach:0:Pr30:15
Snail:0:Ps58:8
Cricket:0:Lev11:22
Mule:1:2Sa18:9
Ape|Monkey:0:1Ki10:22
Viper|Adder|Asp|Cobra:1:Ac28:3
Dragon:1:Rev12
Wild ox|Unicorn:1:Job39:9
Ram:2:Ge22:13
Ewe:1:2Sa12:3
Pigeon:1:Lk2:24
Cormorant:0:Lev11:17
Bittern:0:Isa14:23
Beetle:0:Lev11:22
Caterpillar:0:Ps78:46
Cankerworm:0:Joel1:4
Palmerworm:0:Joel1:4
`),

  q('books', 'Name a book of the Bible', 'Scripture', `
Genesis:5:Ge1
Exodus:5:Ex1
Leviticus:4:Lev1
Numbers:4:Nu1
Deuteronomy:4:Dt1
Joshua:3:Jos1
Judges:3:Jdg1
Ruth:3:Ru1
Samuel|1 Samuel|2 Samuel:3:1Sa1
Kings|1 Kings|2 Kings:3:1Ki1
Chronicles|1 Chronicles|2 Chronicles:2:1Ch1
Ezra:2:Ezr1
Nehemiah:2:Ne1
Esther:3:Est1
Job:4:Job1
Psalms|Psalm:5:Ps1
Proverbs:4:Pr1
Ecclesiastes|Qoheleth:3:Ec1
Song of Solomon|Song of Songs|Canticles:3:SS1
Isaiah:4:Isa1
Jeremiah:3:Jer1
Lamentations:2:La1
Ezekiel:3:Eze1
Daniel:4:Da1
Hosea:2:Hos1
Joel:2:Joel1
Amos:2:Am1
Obadiah:1:Ob1
Jonah:3:Jon1
Micah:1:Mic1
Nahum:1:Na1
Habakkuk:1:Hab1
Zephaniah:1:Zep1
Haggai:1:Hag1
Zechariah:1:Zec1
Malachi:2:Mal1
Matthew:5:Mt1
Mark:4:Mk1
Luke:4:Lk1
John|1 John|2 John|3 John:5:Jn1
Acts|Acts of the Apostles:3:Ac1
Romans:4:Ro1
Corinthians|1 Corinthians|2 Corinthians:3:1Co1
Galatians:3:Gal1
Ephesians:3:Eph1
Philippians:2:Php1
Colossians:2:Col1
Thessalonians|1 Thessalonians|2 Thessalonians:2:1Th1
Timothy|1 Timothy|2 Timothy:2:1Ti1
Titus:1:Tit1
Philemon:1:Phm1
Hebrews:2:Heb1
James:2:Jas1
Peter|1 Peter|2 Peter:2:1Pe1
Jude:1:Jude1
Revelation|Revelations|Apocalypse:5:Rev1
`),

  q('waters', 'Name a river, sea, lake, brook or pool mentioned in the Bible', 'Places', `
Jordan|Jordan River:5:Jos3
Red Sea|Reed Sea|Sea of Reeds:5:Ex14
Sea of Galilee|Galilee|Lake of Gennesaret|Gennesaret|Sea of Tiberias|Tiberias|Chinnereth|Kinnereth|Lake Galilee:4:Mt4:18
Nile|River of Egypt:4:Ex2
Dead Sea|Salt Sea|Sea of the Arabah|East Sea:3:Ge14:3
Euphrates|Great River:3:Ge2:14
Tigris|Hiddekel:2:Ge2:14
Mediterranean|Great Sea|Western Sea|Sea of the Philistines:2:Jos1:4
Pishon|Pison:0:Ge2:11
Gihon:0:Ge2:13
Kishon:1:Jdg4:7
Jabbok:1:Ge32:22
Arnon:1:Nu21:13
Kidron|Cedron:1:Jn18:1
Cherith|Kerith:1:1Ki17:3
Chebar|Kebar:1:Eze1:1
Abana|Abanah:0:2Ki5:12
Pharpar:0:2Ki5:12
Ulai:0:Da8:2
Ahava:0:Ezr8:15
Habor:0:2Ki17:6
Zered:0:Dt2:13
Besor:0:1Sa30:9
Pool of Siloam|Siloam:2:Jn9:7
Pool of Bethesda|Bethesda|Bethzatha:2:Jn5:2
Marah:1:Ex15:23
Jacob's well:2:Jn4:6
Lake of fire:2:Rev20:14
Waters of Merom|Merom:0:Jos11:5
Pool of Gibeon:0:2Sa2:13
Adriatic|Adria|Sea of Adria:0:Ac27:27
Kanah:0:Jos16:8
`),

  q('mountains', 'Name a mountain or hill mentioned in the Bible', 'Places', `
Sinai|Mount Sinai:5:Ex19
Horeb:3:Ex3:1
Ararat:4:Ge8:4
Moriah:3:Ge22:2
Zion|Sion:4:Ps48
Carmel:3:1Ki18
Mount of Olives|Olivet|Olives:4:Mt24:3
Nebo:2:Dt34:1
Pisgah:1:Dt34:1
Hermon:2:Ps133:3
Tabor:2:Jdg4:6
Gilboa:1:1Sa31
Ebal:1:Dt27
Gerizim:1:Dt27:12
Seir:1:Ge36:8
Hor:1:Nu20:22
Golgotha|Calvary|Place of the Skull:4:Jn19:17
Gilead:1:Ge31:21
Lebanon:1:Dt3:25
Bashan:0:Ps68:15
Moreh:0:Jdg7:1
Perazim:0:Isa28:21
Paran:0:Hab3:3
Mizar:0:Ps42:6
Abarim:0:Nu27:12
Amana:0:SS4:8
Senir:0:Dt3:9
Sirion:0:Dt3:9
Ephraim:0:Jos24:30
Gaash:0:Jos24:30
Halak:0:Jos11:17
Zalmon|Salmon:0:Jdg9:48
Areopagus|Mars Hill:2:Ac17:22
`),

  q('imprisoned', 'Name a person who was imprisoned in the Bible', 'People', `
Joseph:5:Ge39:20
Samson:3:Jdg16:21
Jeremiah:3:Jer37
John the Baptist|John|Baptist:4:Mt14:3
Peter|Simon Peter:4:Ac12
Paul|Saul:5:Ac16
Silas:3:Ac16
Micaiah:1:1Ki22:27
Hanani:0:2Ch16:10
Jehoiachin|Jeconiah:1:2Ki25:27
Zedekiah:1:Jer52:11
Hoshea:0:2Ki17:4
Manasseh:1:2Ch33:11
Barabbas:3:Mk15:7
Simeon:1:Ge42:24
Pharaoh's baker|Baker:1:Ge40
Cupbearer|Butler|Pharaoh's cupbearer:1:Ge40
Aristarchus:0:Col4:10
Epaphras:0:Phm1:23
Andronicus:0:Ro16:7
Junia|Junias:0:Ro16:7
Jesus|Christ:2:Mk14:46
Jehoahaz:0:2Ki23:33
`),

  q('plants', 'Name a plant, tree, herb or spice mentioned in the Bible', 'Creation', `
Fig|Fig tree:5:Mt21:19
Olive|Olive tree:5:Ro11
Vine|Grape|Grapevine:4:Jn15
Cedar:3:1Ki5
Palm|Palm tree|Date palm:3:Jn12:13
Mustard|Mustard seed:4:Mt13:31
Hyssop:2:Ps51:7
Myrrh:3:Mt2:11
Frankincense:3:Mt2:11
Aloes|Aloe:1:Jn19:39
Almond:2:Nu17:8
Acacia|Shittim:1:Ex25:10
Sycamore|Sycomore:2:Lk19:4
Pomegranate:2:Ex28:33
Wheat:3:Mt13:25
Barley:2:Ru1:22
Lily|Lilies:3:Mt6:28
Thorns|Thornbush|Thorn:3:Mt27:29
Flax:1:Jos2:6
Cumin|Cummin:0:Mt23:23
Mint:1:Mt23:23
Dill|Anise:0:Mt23:23
Rue:0:Lk11:42
Coriander:0:Ex16:31
Wormwood:1:Rev8:11
Gopher wood:1:Ge6:14
Oak:2:Ge35:8
Terebinth:0:Ge35:4
Tamarisk:0:Ge21:33
Willow:1:Ps137:2
Cypress:0:Isa44:14
Juniper|Broom tree|Broom:1:1Ki19:4
Reed:1:Mt11:7
Papyrus|Bulrush|Bulrushes:1:Ex2:3
Cassia:0:Ps45:8
Cinnamon:1:Rev18:13
Spikenard|Nard:1:Jn12:3
Saffron:0:SS4:14
Henna|Camphire:0:SS1:14
Calamus:0:Ex30:23
Gourd:0:Jon4:6
Mandrake:1:Ge30:14
Leek:0:Nu11:5
Onion:1:Nu11:5
Garlic:1:Nu11:5
Cucumber:1:Nu11:5
Melon:0:Nu11:5
Lentil:1:Ge25:34
Bean:0:2Sa17:28
Millet:0:Eze4:9
Spelt|Rye:0:Ex9:32
Poplar:0:Ge30:37
Plane tree|Chestnut:0:Ge30:37
Myrtle:0:Zec1:8
Apple|Apple tree:1:SS2:3
Mulberry:0:2Sa5:23
Bramble:0:Jdg9:14
Nettle:0:Pr24:31
Thistle:0:Ge3:18
Tares|Weeds|Darnel:2:Mt13:25
Sycamine:0:Lk17:6
Carob|Husks|Pods:0:Lk15:16
Balm:1:Jer8:22
Grass:2:Isa40:8
Fir|Pine:0:Isa60:13
`),

  q('food', 'Name a food or drink mentioned in the Bible', 'Creation', `
Bread|Unleavened bread|Loaves:5:Mt26:26
Wine|New wine:5:Jn2
Manna:5:Ex16
Fish:4:Jn6:9
Honey:4:Ex3:8
Milk:4:Ex3:8
Water:4:Jn4
Figs:3:1Sa25:18
Grapes:3:Nu13:23
Olive oil|Oil|Olives:3:1Ki17:12
Lamb:3:Ex12
Quail:3:Ex16:13
Locusts:3:Mt3:4
Lentil stew|Lentils|Stew|Pottage|Red stew:2:Ge25:34
Fatted calf|Calf|Veal:2:Lk15:23
Barley:2:Jn6:9
Wheat|Grain|Corn:2:Ru2
Raisins:1:1Sa25:18
Butter|Curds:1:Ge18:8
Cheese:1:1Sa17:18
Vinegar|Sour wine:1:Jn19:29
Cucumbers:1:Nu11:5
Melons:0:Nu11:5
Leeks:0:Nu11:5
Onions:1:Nu11:5
Garlic:1:Nu11:5
Almonds:1:Ge43:11
Pistachios|Nuts:0:Ge43:11
Pomegranates:1:Nu13:23
Salt:2:Mt5:13
Eggs|Egg:1:Lk11:12
Cakes|Cake:1:1Ki17:13
Parched grain|Roasted grain:0:Ru2:14
Beans:0:2Sa17:28
Meat:2:1Ki17:6
Venison|Game:0:Ge27:3
Goat:1:Ge27:9
Bitter herbs:1:Ex12:8
Strong drink|Beer:1:Pr20:1
Apples:1:SS2:5
Broth:0:Jdg6:19
Raisin cakes|Cakes of raisins:0:Hos3:1
Honeycomb:1:Lk24:42
`),

  q('treasures', 'Name a precious stone or metal mentioned in the Bible', 'Creation', `
Gold:5:Ge2:11
Silver:5:Ge13:2
Bronze|Brass:4:Nu21:9
Iron:3:Ge4:22
Copper:2:Dt8:9
Tin:1:Nu31:22
Lead:1:Nu31:22
Pearl:4:Mt13:46
Diamond:3:Ex28:18
Ruby|Rubies:3:Pr31:10
Sapphire:3:Ex24:10
Emerald:3:Rev4:3
Onyx:2:Ex28:9
Jasper:2:Rev21:11
Topaz:2:Ex28:17
Amethyst:2:Rev21:20
Beryl:1:Rev21:20
Chrysolite|Chrysolyte:0:Rev21:20
Carnelian|Sardius|Sardine|Sard:1:Rev4:3
Sardonyx:0:Rev21:20
Agate:1:Ex28:19
Chalcedony:0:Rev21:19
Chrysoprase|Chrysoprasus:0:Rev21:20
Jacinth|Hyacinth:0:Rev21:20
Coral:1:Job28:18
Crystal:1:Rev4:6
Lapis lazuli|Lapis:0:Ex28:18
Turquoise:0:Ex28:18
Bdellium:0:Ge2:12
Ivory:1:1Ki10:18
Alabaster:1:Mk14:3
Marble:1:Rev18:12
`),

  q('lands', 'Name a nation, people group or land mentioned in the Bible (not a city)', 'Places', `
Egypt|Egyptians:5:Ex1
Israel|Israelites:5:Ge32:28
Babylonia|Babylonians|Chaldea|Chaldeans|Chaldees:4:Da1
Assyria|Assyrians:3:2Ki17
Persia|Persians:3:Est1
Roman Empire|Romans|Rome:3:Jn11:48
Greece|Greeks|Javan:3:Ac20:2
Judah|Judea|Judaea:4:Lk1:5
Galilee:4:Mt4:23
Canaan|Canaanites:4:Ge12:5
Moab|Moabites:2:Ru1
Edom|Edomites|Idumea:2:Ge36
Ammon|Ammonites:1:Jdg11
Philistia|Philistines:2:1Sa17
Midian|Midianites:1:Ex2:15
Ethiopia|Cush|Kush:2:Ac8:27
Media|Medes:1:Da5:28
Elam|Elamites:0:Ge14:1
Aram|Syria|Arameans:2:2Ki5
Phoenicia:1:Ac11:19
Sheba:2:1Ki10
Ophir:1:1Ki9:28
Tarshish:2:Jon1:3
Mesopotamia:1:Ac2:9
Goshen:2:Ge47
Gilead:1:Nu32
Bashan:1:Nu21:33
Lebanon:2:1Ki5
Arabia:1:Gal1:17
Crete|Cretans:1:Ac27
Cyprus:2:Ac13:4
Malta|Melita:1:Ac28:1
Macedonia:2:Ac16:9
Achaia:1:Ac18:12
Galatia|Galatians:2:Gal1:2
Asia:1:Ac16:6
Cappadocia:1:Ac2:9
Pontus:1:Ac2:9
Bithynia:0:Ac16:7
Cilicia:1:Ac21:39
Pamphylia:0:Ac13:13
Phrygia:0:Ac16:6
Lycaonia:0:Ac14:6
Pisidia:0:Ac13:14
Lycia:0:Ac27:5
Mysia:0:Ac16:7
Libya:1:Ac2:10
Cyrene:1:Ac2:10
Spain:1:Ro15:24
Italy:1:Ac27:1
Illyricum:0:Ro15:19
Dalmatia:0:2Ti4:10
Decapolis:1:Mk5:20
Ituraea|Iturea:0:Lk3:1
Trachonitis:0:Lk3:1
Abilene:0:Lk3:1
Samaria|Samaritans:3:Jn4
Uz:1:Job1:1
Shinar:1:Ge11:2
Eden|Garden of Eden:3:Ge2
Nod:1:Ge4:16
Havilah:0:Ge2:11
Put|Phut:0:Eze27:10
Magog:1:Eze38:2
Togarmah:0:Eze38:6
Seba:0:Ps72:10
Dedan:0:Eze25:13
Kedar:0:Isa21:16
Tema:0:Job6:19
Negev|Negeb:1:Ge12:9
Sharon:1:SS2:1
Kittim|Chittim:0:Nu24:24
Caphtor:0:Am9:7
Amalek|Amalekites:1:Ex17
Hittites:2:Ge23
Amorites:1:Ge15:16
Jebusites:1:Jos15:63
Perizzites:0:Ex3:8
Hivites:0:Ex3:8
Girgashites:0:Dt7:1
Gibeonites:0:2Sa21
Ishmaelites:1:Ge37:25
Kenites:0:Jdg1:16
Nephilim:1:Ge6:4
Anakim|Anakites:0:Dt1:28
Rephaim:0:Ge14:5
`),

  q('parables', 'Name one of the parables Jesus told', 'Scripture', `
Prodigal Son|Lost Son|Prodigal:5:Lk15:11
Good Samaritan|Samaritan:5:Lk10:30
Sower|Soils|Four Soils|Sower and the Seed|Farmer and the Seed:4:Mt13:3
Mustard Seed|Mustard:4:Mt13:31
Lost Sheep|Ninety Nine Sheep|Hundred Sheep:4:Lk15:4
Lost Coin|Lost Silver|Silver Coin:3:Lk15:8
Talents|Bags of Gold|Three Servants:3:Mt25:14
Ten Virgins|Wise and Foolish Virgins|Ten Bridesmaids|Bridesmaids:3:Mt25:1
Wheat and Tares|Wheat and Weeds|Tares|Weeds:2:Mt13:24
Pearl of Great Price|Pearl|Merchant|Valuable Pearl:2:Mt13:45
Hidden Treasure|Treasure|Treasure in the Field:2:Mt13:44
Net|Dragnet|Fishing Net:1:Mt13:47
Unforgiving Servant|Unmerciful Servant|Wicked Servant:2:Mt18:23
Workers in the Vineyard|Laborers in the Vineyard|Labourers in the Vineyard|Vineyard Workers:2:Mt20:1
Two Sons:1:Mt21:28
Wicked Tenants|Wicked Husbandmen|Tenants|Wicked Vinedressers:1:Mt21:33
Wedding Feast|Wedding Banquet|Marriage Feast|Wedding Garment:1:Mt22:2
Great Banquet|Great Supper|Great Feast:1:Lk14:16
Rich Fool|Foolish Rich Man|Bigger Barns:2:Lk12:16
Rich Man and Lazarus|Lazarus and the Rich Man|Dives and Lazarus:2:Lk16:19
Persistent Widow|Unjust Judge|Importunate Widow:2:Lk18:1
Pharisee and the Tax Collector|Pharisee and the Publican|Pharisee and Tax Collector:2:Lk18:9
Leaven|Yeast:2:Mt13:33
Barren Fig Tree|Fig Tree|Fruitless Fig Tree|Budding Fig Tree:1:Lk13:6
Minas|Pounds|Ten Minas:1:Lk19:11
Two Debtors|Moneylender|Creditor and Two Debtors:0:Lk7:41
Friend at Midnight|Persistent Friend:1:Lk11:5
Wise and Foolish Builders|Wise Builder|Two Builders|House on the Rock|Wise Man:3:Mt7:24
Growing Seed|Seed Growing Secretly:0:Mk4:26
Shrewd Manager|Unjust Steward|Dishonest Manager|Unrighteous Steward:1:Lk16:1
Lamp Under a Bushel|Lamp on a Stand|Light Under a Bushel|Lamp:1:Mt5:15
New Wine in Old Wineskins|Wineskins|New Wine|Old Wineskins:1:Mk2:22
New Cloth on an Old Garment|Patch|Unshrunk Cloth:0:Mk2:21
Sheep and Goats|Sheep and the Goats:2:Mt25:31
Faithful Servant|Faithful and Wise Servant|Watchful Servants:0:Mt24:45
Tower Builder|Counting the Cost|Building a Tower:0:Lk14:28
King Going to War|Warring King:0:Lk14:31
Strong Man|Binding the Strong Man:0:Mk3:27
Good Shepherd:2:Jn10:11
Unworthy Servants|Unprofitable Servants:0:Lk17:7
Doorkeeper|Watchful Doorkeeper:0:Mk13:34
Householder|Treasures New and Old:0:Mt13:52
Children in the Marketplace:0:Mt11:16
Blind Leading the Blind|Blind Guides:0:Lk6:39
Thief in the Night:0:Mt24:43
`),
]
