// General place prompts.
import { bank } from './define'

export const placesBank = bank(`
@jesus-places|Places|Name a place Jesus visited
Bethlehem:5:Lk2; Nazareth:5:Lk4; Jerusalem:5:Lk19; Capernaum:4:Mk1; Cana:4:Jn2; Bethany:4:Jn11; Jericho:3:Lk19
Galilee|Sea of Galilee:5:Mt4; Samaria|Sychar:3:Jn4; Caesarea Philippi:2:Mt16; Tyre:2:Mk7; Sidon:2:Mk7; Gethsemane:4:Mt26
Golgotha|Calvary:4:Jn19; Emmaus:3:Lk24; Bethsaida:2:Mk8; Nain:1:Lk7; Egypt:3:Mt2; Decapolis:1:Mk7; Jordan River|Jordan:4:Mt3
Gadara|Gerasa|Gergesa|Gadarenes|Gerasenes:2:Mk5; Mount of Olives|Olivet:4:Mt24; Bethphage:1:Mt21; Chorazin|Korazin:1:Mt11
Magadan|Magdala:0:Mt15; Ephraim:0:Jn11; Temple:4:Lk2; Wilderness|Desert:3:Mt4

@paul-places|Places|Name a place the apostle Paul visited
Damascus:5:Ac9; Antioch:4:Ac13; Cyprus:3:Ac13; Ephesus:5:Ac19; Corinth:5:Ac18; Athens:4:Ac17; Philippi:4:Ac16
Thessalonica:3:Ac17; Berea|Beroea:2:Ac17; Rome:5:Ac28; Malta|Melita:3:Ac28; Jerusalem:4:Ac21; Tarsus:3:Ac9
Lystra:2:Ac14; Derbe:2:Ac14; Iconium:2:Ac14; Troas:2:Ac16; Crete:2:Ac27; Miletus:1:Ac20; Caesarea:2:Ac23; Arabia:1:Gal1
Galatia:2:Ac16; Macedonia:2:Ac16; Neapolis:0:Ac16; Paphos:1:Ac13; Perga:1:Ac13; Syracuse:0:Ac28; Puteoli:0:Ac28
Salamis:0:Ac13; Attalia:0:Ac14; Seleucia:0:Ac13; Amphipolis:0:Ac17; Apollonia:0:Ac17; Cenchreae|Cenchrea:0:Ac18; Assos:0:Ac20
Rhodes:0:Ac21; Tyre:1:Ac21; Sidon:0:Ac27; Spain:1:Ro15

@seven-churches|Places|Name one of the seven churches in the book of Revelation
Ephesus:5:Rev2; Smyrna:4:Rev2; Pergamum|Pergamos:3:Rev2; Thyatira:3:Rev2; Sardis:3:Rev3; Philadelphia:4:Rev3; Laodicea:4:Rev3

@exodus-route|Places|Name a place on Israel's journey out of Egypt
Egypt:5:Ex12; Goshen:3:Ex8; Red Sea|Sea of Reeds:5:Ex14; Sinai|Mount Sinai:5:Ex19; Horeb:2:Ex17; Marah:2:Ex15; Elim:2:Ex15
Rephidim:1:Ex17; Kadesh|Kadesh-barnea:2:Nu13; Succoth:1:Ex12; Pi-hahiroth:0:Ex14; Wilderness of Sin:1:Ex16; Wilderness of Zin|Zin:1:Nu20
Paran|Wilderness of Paran:1:Nu10; Rameses|Raamses:1:Ex12; Mount Hor|Hor:1:Nu20; Moab|Plains of Moab:3:Nu22; Mount Nebo|Nebo|Pisgah:3:Dt34
Jordan:3:Jos3; Etham:0:Ex13; Edom:2:Nu20; Jericho:3:Jos6; Canaan|Promised Land:4:Jos1; Wilderness of Shur|Shur:0:Ex15

@early-genesis|Places|Name a place in Genesis chapters 1–11
Eden|Garden of Eden:5:Ge2; Ararat|Mountains of Ararat:4:Ge8; Babel|Babylon|Shinar:4:Ge11; Nod|Land of Nod:3:Ge4; Ur|Ur of the Chaldees:3:Ge11
Haran:2:Ge11; Nineveh:2:Ge10; Euphrates:2:Ge2; Tigris|Hiddekel:2:Ge2; Pishon|Pison:1:Ge2; Gihon:1:Ge2; Havilah:1:Ge2
Cush:1:Ge2; Assyria:1:Ge2; Canaan:1:Ge10; Sodom:1:Ge10; Gomorrah:1:Ge10; Erech:0:Ge10; Accad|Akkad:0:Ge10; Calah:0:Ge10

@destroyed-cities|Places|Name a city that was destroyed in the Bible
Sodom:5:Ge19; Gomorrah:5:Ge19; Jericho:5:Jos6; Jerusalem:4:2Ki25; Ai:3:Jos8; Babylon:3:Rev18; Nineveh:2:Na3
Admah:1:Dt29; Zeboiim:1:Dt29; Hazor:1:Jos11; Tyre:1:Eze26; Samaria:2:2Ki17; Shechem:1:Jdg9; Gibeah:1:Jdg20; Laish:0:Jdg18

@refuge-cities|Places|Name one of Israel's cities of refuge
Hebron|Kiriath-arba:4:Jos20; Shechem:4:Jos20; Kedesh:3:Jos20; Bezer:2:Jos20; Ramoth|Ramoth-gilead:3:Jos20; Golan:3:Jos20

@philistine-cities|Places|Name one of the five main Philistine cities
Gaza:5:1Sa6; Gath:5:1Sa6; Ashdod|Azotus:4:1Sa6; Ashkelon|Askelon:4:1Sa6; Ekron:4:1Sa6

@miracle-places|Places|Name a place where Jesus performed a miracle
Cana:5:Jn2; Capernaum:4:Mk1; Bethany:4:Jn11; Nain:2:Lk7; Bethsaida:3:Mk8; Jericho:3:Mk10; Sea of Galilee|Galilee:5:Mt14
Pool of Bethesda|Bethesda:3:Jn5; Pool of Siloam|Siloam:2:Jn9; Gadara|Gerasa|Gadarenes|Gerasenes:2:Mk5; Jerusalem:3:Jn5
Tyre:1:Mk7; Sidon:1:Mk7; Decapolis:1:Mk7; Gethsemane:1:Lk22; Nazareth:1:Mk6

@wildernesses|Places|Name a wilderness or desert mentioned in the Bible
Sinai|Wilderness of Sinai:5:Ex19; Wilderness of Judea|Judea|Judean wilderness:4:Mt3; Paran:2:Ge21; Zin:2:Nu20; Wilderness of Sin|Sin:2:Ex16
Shur:1:Ge16; Negev|Negeb|South:2:Ge12; Beersheba:2:Ge21; En-gedi|Engedi:2:1Sa24; Maon:1:1Sa23; Ziph:1:1Sa23
Arabia:1:Gal4; Edom:1:2Ki3; Etham:0:Nu33; Gibeon:0:2Sa2; Tekoa:0:2Ch20

@rivers|Places|Name a river or brook in the Bible
Jordan:5:Jos3; Nile:5:Ex2; Euphrates:4:Ge2; Tigris|Hiddekel:3:Ge2; Pishon|Pison:1:Ge2; Gihon:1:Ge2; Kishon:1:Jdg4
Jabbok:2:Ge32; Chebar|Kebar:1:Eze1; Abana|Abanah:1:2Ki5; Pharpar:1:2Ki5; Arnon:1:Nu21; Ulai:0:Da8; Kidron|Kedron:2:Jn18
Cherith|Kerith:2:1Ki17; Ahava:0:Ezr8; Besor:0:1Sa30; Zered:0:Dt2; Sorek:0:Jdg16

@abraham-places|Places|Name a place in the life of Abraham
Ur|Ur of the Chaldees:5:Ge11; Haran:4:Ge12; Canaan:5:Ge12; Egypt:4:Ge12; Bethel:3:Ge12; Ai:2:Ge12; Shechem:2:Ge12
Hebron|Mamre:3:Ge13; Beersheba:3:Ge21; Moriah|Mount Moriah:4:Ge22; Sodom:4:Ge18; Gomorrah:3:Ge18; Gerar:1:Ge20
Machpelah|Cave of Machpelah:2:Ge23; Salem:1:Ge14; Dan:0:Ge14; Damascus:1:Ge14

@david-places|Places|Name a place in the life of King David
Bethlehem:5:1Sa16; Jerusalem|Zion|City of David:5:2Sa5; Hebron:3:2Sa2; Gath:3:1Sa21; Ziklag:2:1Sa27; En-gedi|Engedi:2:1Sa24
Cave of Adullam|Adullam:2:1Sa22; Valley of Elah|Elah:3:1Sa17; Nob:1:1Sa21; Mahanaim:1:2Sa17; Keilah:1:1Sa23; Ramah:1:1Sa19
Mount Gilboa|Gilboa:2:1Sa31; Rabbah:1:2Sa11; Gibeah:1:1Sa19; Jabesh-gilead:0:2Sa2; Maon:0:1Sa23; Jordan:1:2Sa17

@acts-places|Places|Name a place mentioned in the book of Acts
Jerusalem:5:Ac1; Rome:4:Ac28; Damascus:4:Ac9; Antioch:4:Ac11; Samaria:3:Ac8; Joppa:3:Ac9; Caesarea:3:Ac10; Ephesus:4:Ac19
Corinth:4:Ac18; Athens:4:Ac17; Philippi:3:Ac16; Malta|Melita:3:Ac28; Cyprus:3:Ac13; Lydda:1:Ac9; Gaza:2:Ac8; Tarsus:3:Ac9
Thessalonica:2:Ac17; Berea|Beroea:2:Ac17; Lystra:2:Ac14; Derbe:1:Ac14; Iconium:1:Ac14; Troas:1:Ac16; Crete:2:Ac27
Mount of Olives|Olivet:2:Ac1; Ethiopia:2:Ac8; Judea:2:Ac1; Galilee:1:Ac9; Macedonia:2:Ac16; Areopagus|Mars Hill:2:Ac17
Straight Street|Street called Straight:1:Ac9; Beautiful Gate:2:Ac3; Solomon's Porch|Solomon's Colonnade:1:Ac3; Azotus:0:Ac8

@revelation-places|Places|Name a place mentioned in the book of Revelation
Patmos:5:Rev1; Babylon:5:Rev17; New Jerusalem:5:Rev21; Armageddon|Harmagedon:4:Rev16; Ephesus:3:Rev2; Smyrna:2:Rev2
Pergamum|Pergamos:2:Rev2; Thyatira:2:Rev2; Sardis:2:Rev3; Philadelphia:2:Rev3; Laodicea:3:Rev3; Euphrates:2:Rev9
Mount Zion|Zion:2:Rev14; Sodom:1:Rev11; Egypt:1:Rev11; Lake of fire:3:Rev20; Heaven:4:Rev4; Bottomless pit|Abyss:2:Rev9

@oppressors|Places|Name a nation or people that oppressed or conquered Israel
Egypt|Egyptians:5:Ex1; Babylon|Babylonians:5:2Ki25; Assyria|Assyrians:4:2Ki17; Rome|Romans:4:Lk2; Philistines|Philistia:5:Jdg13
Persia|Persians:3:Ezr1; Midian|Midianites:3:Jdg6; Moab|Moabites:2:Jdg3; Ammon|Ammonites:2:Jdg10; Amalek|Amalekites:2:Ex17
Aram|Syria|Arameans:2:2Ki6; Edom|Edomites:1:2Ki8; Canaanites|Canaan:1:Jdg4; Mesopotamia:0:Jdg3; Chaldeans:1:2Ki25

@christmas-places|Places|Name a place in the Christmas story (Matthew 1–2, Luke 1–2)
Bethlehem:5:Lk2; Nazareth:5:Lk1; Jerusalem:4:Mt2; Egypt:4:Mt2; Galilee:3:Lk1; Judea:3:Mt2; Ramah:1:Mt2; Syria:1:Lk2
Temple:3:Lk2; East:2:Mt2; Manger:3:Lk2; Inn:3:Lk2; City of David:2:Lk2

@easter-places|Places|Name a place in the story of Jesus' last week, death and resurrection
Jerusalem:5:Lk19; Gethsemane|Garden of Gethsemane:5:Mt26; Golgotha|Calvary|Place of the Skull:5:Jn19; Mount of Olives|Olivet:4:Mt26
Bethany:3:Mk11; Bethphage:2:Mt21; Temple:4:Mt21; Upper room:4:Mk14; Tomb|Garden tomb|Empty tomb:5:Jn20; Emmaus:3:Lk24
Praetorium|Pilate's palace|Palace:2:Jn18; Gabbatha|Stone Pavement:1:Jn19; Kidron Valley|Kidron:1:Jn18; Galilee:2:Mt28
High priest's house|Caiaphas's house:2:Lk22; Field of Blood|Akeldama|Potter's field:2:Mt27

@letter-places|Places|Name a city or region that received a letter in the New Testament
Rome:5:Ro1; Corinth:5:1Co1; Galatia:4:Gal1; Ephesus:5:Eph1; Philippi:4:Php1; Colossae|Colosse:4:Col1; Thessalonica:4:1Th1
Laodicea:1:Col4; Smyrna:1:Rev2; Pergamum|Pergamos:1:Rev2; Thyatira:1:Rev2; Sardis:1:Rev3; Philadelphia:1:Rev3; Crete:1:Tit1

@valleys|Places|Name a valley mentioned in the Bible
Valley of Elah|Elah:4:1Sa17; Jezreel|Valley of Jezreel:3:Hos1; Hinnom|Gehenna|Ben Hinnom:2:Jer7; Kidron|Kidron Valley:3:Jn18
Jehoshaphat|Valley of Jehoshaphat:1:Joel3; Achor:1:Jos7; Sorek:2:Jdg16; Baca|Valley of Baca:1:Ps84; Aijalon:1:Jos10
Siddim:0:Ge14; Rephaim:0:2Sa5; Eshcol:1:Nu13; Valley of Salt|Salt:0:2Sa8; Valley of dry bones|Dry bones:3:Eze37
Valley of the shadow of death|Shadow of death:4:Ps23; Succoth:0:Ps60; Zeboim:0:1Sa13

@islands|Places|Name an island mentioned in the Bible
Patmos:5:Rev1; Cyprus:5:Ac13; Malta|Melita:5:Ac28; Crete:5:Ac27; Samos:1:Ac20; Chios:1:Ac20; Cos|Kos|Coos:1:Ac21
Rhodes:1:Ac21; Samothrace|Samothracia:1:Ac16; Cauda|Clauda:0:Ac27; Caphtor:0:Am9; Lesbos|Mitylene:0:Ac20

@galilee-towns|Places|Name a town in Galilee mentioned in the Gospels
Nazareth:5:Lk1; Capernaum:5:Mk1; Cana:4:Jn2; Bethsaida:3:Mk8; Nain:2:Lk7; Chorazin|Korazin:2:Mt11; Tiberias:2:Jn6
Magdala|Magadan:1:Mt15; Gennesaret:1:Mk6

@joshua-cities|Places|Name a city in the book of Joshua
Jericho:5:Jos6; Ai:4:Jos8; Gibeon:3:Jos9; Hazor:2:Jos11; Lachish:2:Jos10; Hebron:2:Jos10; Debir:1:Jos10; Gilgal:3:Jos4
Shiloh:2:Jos18; Bethel:2:Jos8; Shechem:2:Jos24; Makkedah:0:Jos10; Libnah:0:Jos10; Eglon:0:Jos10; Jerusalem|Jebus:2:Jos15
Kadesh-barnea:1:Jos14; Kiriath-jearim:0:Jos9; Timnath-serah:0:Jos19; Beth-horon:0:Jos10

@exile-places|Places|Name a place where God's people were taken into exile or captivity
Babylon:5:2Ki24; Assyria:4:2Ki17; Egypt:4:Ex1; Susa|Shushan:3:Est1; Nineveh:2:Na1; Chebar|Kebar:1:Eze1; Patmos:3:Rev1
Persia:2:Ezr1; Halah:0:2Ki17; Habor:0:2Ki17; Media:1:2Ki17; Tel-abib:0:Eze3

@wells|Places|Name a well, spring or pool in the Bible
Jacob's well|Jacob's Well:5:Jn4; Pool of Siloam|Siloam:4:Jn9; Pool of Bethesda|Bethesda:4:Jn5; Beersheba:3:Ge21
Beer-lahai-roi:1:Ge16; Esek:0:Ge26; Sitnah:0:Ge26; Rehoboth:0:Ge26; Marah:2:Ex15; Elim:2:Ex15; Spring of Harod|Harod:1:Jdg7
Well of Bethlehem|Bethlehem well:1:2Sa23; Gihon:1:1Ki1; En-rogel:0:1Ki1; Massah|Meribah:1:Ex17; Pool of Gibeon:0:2Sa2

@beth-places|Places|Name a place in the Bible whose name starts with "Beth"
Bethlehem:5:Lk2; Bethel:4:Ge28; Bethany:4:Jn11; Bethsaida:3:Mk8; Bethphage:2:Mt21; Bethesda:3:Jn5; Beth-shemesh|Bethshemesh:1:1Sa6
Beth-horon:0:Jos10; Beth-shan|Bethshan|Beth-shean:1:1Sa31; Beth-peor:0:Dt34; Bethabara|Bethany beyond the Jordan:0:Jn1
Beth-aven:0:Hos4; Beth-car:0:1Sa7; Bethuel:0:1Ch4; Beth-zur:0:Ne3; Beth-haccherem:0:Jer6

@elijah-places|Places|Name a place in the life of Elijah
Mount Carmel|Carmel:5:1Ki18; Brook Cherith|Cherith|Kerith:3:1Ki17; Zarephath:3:1Ki17; Horeb|Mount Horeb|Sinai:3:1Ki19
Jordan:3:2Ki2; Jezreel:2:1Ki18; Samaria:2:1Ki18; Beersheba:2:1Ki19; Gilgal:1:2Ki2; Bethel:1:2Ki2; Jericho:1:2Ki2
Tishbe|Tishbite:1:1Ki17; Gilead:1:1Ki17; Kishon|Brook Kishon:1:1Ki18

@jacob-places|Places|Name a place in the life of Jacob
Beersheba:3:Ge28; Haran|Paddan-aram|Padan-aram:4:Ge28; Bethel|Luz:5:Ge28; Peniel|Penuel:3:Ge32; Jabbok:3:Ge32
Succoth:1:Ge33; Shechem:2:Ge33; Mahanaim:1:Ge32; Egypt:4:Ge46; Goshen:3:Ge47; Bethlehem|Ephrath:2:Ge35; Hebron|Mamre:2:Ge35
Gilead:1:Ge31; Canaan:4:Ge37; Machpelah:1:Ge49

@samuel-places|Places|Name a place in the lives of Samuel and Saul
Ramah:4:1Sa1; Shiloh:4:1Sa1; Gilgal:3:1Sa11; Mizpah:3:1Sa7; Gibeah:3:1Sa10; Endor:3:1Sa28; Mount Gilboa|Gilboa:3:1Sa31
Jabesh-gilead|Jabesh:2:1Sa11; Michmash:1:1Sa13; Bethel:2:1Sa7; Bethlehem:3:1Sa16; Ebenezer:2:1Sa7; Kiriath-jearim:1:1Sa7
Ashdod:1:1Sa5; Beth-shemesh:1:1Sa6; Zuph:0:1Sa9; Valley of Elah|Elah:2:1Sa17

@renamed-places|Places|Name a place in the Bible that was renamed (by either name)
Bethel|Luz:5:Ge28; Jerusalem|Jebus:5:Jdg19; Hebron|Kiriath-arba:3:Jos14; Dan|Laish:2:Jdg18; Zoar|Bela:1:Ge14
Debir|Kiriath-sepher:1:Jos15; En-gedi|Hazazon-tamar:0:2Ch20; Hormah|Zephath:0:Jdg1; Kiriath-jearim|Baalah:0:Jos15

@africa|Places|Name a place in Africa mentioned in the Bible
Egypt:5:Ge12; Ethiopia|Cush:4:Ac8; Libya|Put|Phut:2:Ac2; Cyrene:3:Mk15; Goshen:2:Ge45; Alexandria:1:Ac18; Nile:3:Ex2
Memphis|Noph:0:Hos9; Thebes|No:0:Na3; Sheba:2:1Ki10; On|Heliopolis:0:Ge41; Syene:0:Eze29

@seas|Places|Name a sea or lake mentioned in the Bible
Red Sea|Sea of Reeds:5:Ex14; Sea of Galilee|Lake of Gennesaret|Sea of Tiberias|Sea of Chinnereth:5:Mt4
Dead Sea|Salt Sea:4:Ge14; Mediterranean|Great Sea|Western Sea:4:Nu34; Adriatic Sea|Adriatic|Adria:1:Ac27; Sea of glass:2:Rev4
Bronze sea|Molten sea:1:1Ki7; Lake of fire:2:Rev20

@mountains-famous|Places|Name a mountain where something famous happened
Sinai|Mount Sinai|Horeb:5:Ex19; Ararat:5:Ge8; Carmel|Mount Carmel:4:1Ki18; Mount of Olives|Olivet:4:Ac1; Moriah|Mount Moriah:4:Ge22
Zion|Mount Zion:4:Ps48; Nebo|Mount Nebo|Pisgah:3:Dt34; Calvary|Golgotha:4:Lk23; Gilboa|Mount Gilboa:2:1Sa31; Hermon:2:Ps133
Tabor|Mount Tabor:2:Jdg4; Gerizim|Mount Gerizim:2:Dt27; Ebal|Mount Ebal:1:Dt27; Hor|Mount Hor:1:Nu20
Mount of Beatitudes|Mountainside:2:Mt5; Mount of Transfiguration|High mountain:2:Mt17
`)
