// More events, places, objects, Jesus and faith prompts.
import { bank } from './define'

export const extraBank = bank(`
@asia-minor|Places|Name a city or region in Asia Minor (modern Turkey) mentioned in the Bible
Ephesus:5:Ac19; Tarsus:4:Ac9; Galatia:4:Gal1; Antioch:3:Ac13; Smyrna:3:Rev2; Pergamum|Pergamos:2:Rev2; Thyatira:2:Rev2
Sardis:2:Rev3; Philadelphia:2:Rev3; Laodicea:3:Rev3; Colossae|Colosse:3:Col1; Troas:2:Ac16; Iconium:2:Ac14; Lystra:2:Ac14
Derbe:2:Ac14; Cappadocia:1:Ac2; Pontus:1:Ac2; Bithynia:1:Ac16; Cilicia:2:Ac15; Phrygia:1:Ac16; Lycia:0:Ac27; Pamphylia:1:Ac13
Hierapolis:0:Col4; Miletus:1:Ac20; Patara:0:Ac21; Myra:0:Ac27; Attalia:0:Ac14; Perga:1:Ac13; Mysia:0:Ac16; Assos:0:Ac20

@greece|Places|Name a place in Greece mentioned in the Bible
Athens:5:Ac17; Corinth:5:Ac18; Philippi:4:Ac16; Thessalonica:4:Ac17; Berea|Beroea:3:Ac17; Macedonia:4:Ac16; Achaia:2:Ac18
Crete:2:Tit1; Patmos:2:Rev1; Neapolis:1:Ac16; Cenchreae|Cenchrea:1:Ro16; Nicopolis:0:Tit3; Amphipolis:0:Ac17; Apollonia:0:Ac17
Samothrace|Samothracia:0:Ac16; Rhodes:1:Ac21; Cos|Kos:0:Ac21; Greece:3:Ac20

@regions|Places|Name a region of the land of Israel in Jesus' day
Galilee:5:Mt4; Judea:5:Mt2; Samaria:5:Jn4; Decapolis:3:Mk5; Idumea:1:Mk3; Trachonitis:0:Lk3; Iturea|Ituraea:0:Lk3
Abilene:0:Lk3; Beyond the Jordan|Transjordan|Perea:1:Mt4; Phoenicia:1:Ac11; Gennesaret:1:Mk6

@psalm-places|Places|Name a place mentioned in the book of Psalms
Zion:5:Ps2; Jerusalem:5:Ps122; Lebanon:3:Ps29; Hermon:2:Ps133; Tabor:1:Ps89; Babylon:4:Ps137; Egypt:4:Ps105; Jordan:3:Ps114
Bashan:2:Ps22; Tarshish:1:Ps48; Sheba:1:Ps72; Kadesh:1:Ps29; Meribah:2:Ps95; Salem:1:Ps76; Shiloh:1:Ps78; Ephrathah:1:Ps132
Moab:2:Ps60; Edom:2:Ps60; Philistia:1:Ps60; Tyre:1:Ps45; Cush|Ethiopia:1:Ps68; Zoan:0:Ps78; Sinai:2:Ps68; Red Sea:3:Ps106; Gilead:1:Ps60

@northern-cities|Places|Name a city in the northern kingdom of Israel
Samaria:5:1Ki16; Shechem:4:1Ki12; Dan:4:1Ki12; Bethel:4:1Ki12; Tirzah:2:1Ki14; Jezreel:3:1Ki21; Megiddo:2:1Ki9; Shiloh:2:1Ki14
Dothan:1:2Ki6; Hazor:1:2Ki15; Penuel:0:1Ki12; Shunem:1:2Ki4; Ramoth-gilead:2:1Ki22; Tishbe:0:1Ki17

@judah-cities|Places|Name a city in the southern kingdom of Judah
Jerusalem:5:1Ki14; Bethlehem:5:Mic5; Hebron:4:2Sa2; Lachish:3:2Ki18; Beersheba:3:2Ki23; Tekoa:2:Am1; Anathoth:1:Jer1
Libnah:1:2Ki19; Azekah:1:Jer34; Kiriath-jearim:1:1Ch13; Ziklag:1:1Sa27; Mizpah:2:Jer40; Gibeon:2:1Ki3; Gath:1:2Ch11; Moresheth:0:Mic1

@jerusalem-places|Places|Name a place in or around Jerusalem mentioned in the Bible
Temple:5:1Ki6; Mount Zion|Zion:5:Ps48; Golgotha|Calvary:5:Jn19; Gethsemane:4:Mt26; Pool of Bethesda|Bethesda:3:Jn5; Pool of Siloam|Siloam:3:Jn9
Kidron Valley|Kidron:2:Jn18; Upper room:3:Mk14; Sheep Gate:1:Ne3; Solomon's Porch|Solomon's Colonnade:1:Jn10; Beautiful Gate:2:Ac3
Gihon Spring|Gihon:1:1Ki1; City of David:3:2Sa5; Mount of Olives|Olivet:4:Zec14; Valley of Hinnom|Hinnom|Gehenna:1:Jer7
Praetorium:1:Mk15; Hezekiah's tunnel|Tunnel:1:2Ki20; Mount Moriah|Moriah:2:2Ch3; Bethany:2:Jn11; Field of Blood|Akeldama:1:Ac1

@persia|Places|Name a place in Babylon or Persia mentioned in the Bible
Babylon:5:Da1; Susa|Shushan:4:Est1; Ecbatana|Achmetha:0:Ezr6; Ulai:0:Da8; Chebar|Kebar:1:Eze1; Plain of Dura|Dura:1:Da3
Media:2:Est1; Elam:1:Da8; Shinar:1:Da1; Tel-abib:0:Eze3; Ahava:0:Ezr8; Persia:4:Ezr1; Chaldea:2:Eze11; Euphrates:2:Jer51

@east-jordan|Places|Name a land or town east of the Jordan River
Gilead:4:Ge31; Bashan:3:Nu21; Moab:5:Ru1; Ammon:3:Jdg11; Edom:3:Ge36; Mahanaim:2:2Sa17; Jabesh-gilead:2:1Sa11
Heshbon:1:Nu21; Ramoth-gilead:2:1Ki22; Mount Nebo|Nebo:3:Dt34; Golan:1:Jos20; Rabbah:1:2Sa11; Penuel|Peniel:2:Ge32; Succoth:1:Ge33
Decapolis:2:Mk5; Gadara:2:Mt8; Bethabara|Bethany beyond the Jordan:0:Jn1

@b-places|Places|Name a Bible place whose name begins with B
Bethlehem:5:Lk2; Babylon:5:Da1; Bethany:4:Jn11; Bethel:4:Ge28; Bethsaida:3:Mk8; Beersheba:3:Ge21; Berea|Beroea:2:Ac17
Bethesda:3:Jn5; Bethphage:2:Mt21; Bashan:2:Nu21; Babel:3:Ge11; Bethabara:0:Jn1; Beth-shemesh:1:1Sa6; Bithynia:0:Ac16; Bozrah:0:Isa63

@c-places|Places|Name a Bible place whose name begins with C
Canaan:5:Ge12; Capernaum:5:Mk1; Cana:5:Jn2; Corinth:4:Ac18; Calvary:4:Lk23; Carmel:3:1Ki18; Cyprus:3:Ac13; Crete:3:Ac27
Caesarea:3:Ac10; Colossae:2:Col1; Chorazin:2:Mt11; Cilicia:1:Ac15; Cappadocia:1:Ac2; Cyrene:2:Mk15; Chebar:1:Eze1; Cherith:1:1Ki17
Cenchreae:0:Ro16; Cush:1:Ge2; Cauda:0:Ac27

@s-places|Places|Name a Bible place whose name begins with S
Sodom:5:Ge19; Samaria:5:Jn4; Sinai:5:Ex19; Shiloh:3:1Sa1; Shechem:3:Ge12; Sidon:2:Mk7; Smyrna:2:Rev2; Sardis:2:Rev3
Susa|Shushan:2:Est1; Shinar:1:Ge11; Siloam:3:Jn9; Sychar:2:Jn4; Salamis:0:Ac13; Spain:1:Ro15; Succoth:1:Ge33; Salem:2:Ge14
Sharon:2:Song2; Seir:1:Ge36; Sheba:2:1Ki10; Shunem:1:2Ki4; Syria:2:Lk2; Syracuse:0:Ac28; Sorek:1:Jdg16; Shur:1:Ge16

@m-places|Places|Name a Bible place whose name begins with M
Moab:4:Ru1; Midian:4:Ex2; Mount of Olives:4:Ac1; Macedonia:3:Ac16; Malta:3:Ac28; Megiddo:2:2Ki23; Moriah:3:Ge22; Marah:2:Ex15
Mizpah:2:1Sa7; Mesopotamia:2:Ac7; Miletus:1:Ac20; Mahanaim:1:Ge32; Mamre:2:Ge18; Machpelah:1:Ge23; Media:1:Est1
Michmash:1:1Sa13; Meribah:1:Ex17; Massah:1:Ex17; Magdala:1:Mt15; Mars Hill:2:Ac17; Memphis:0:Hos9; Mysia:0:Ac16

@t-places|Places|Name a Bible place whose name begins with T
Tarsus:4:Ac9; Tyre:4:Mk7; Tarshish:4:Jon1; Thessalonica:3:Ac17; Thyatira:2:Rev2; Troas:2:Ac16; Tabor:2:Jdg4; Tekoa:1:Am1
Tiberias:2:Jn6; Tigris:2:Ge2; Tirzah:1:1Ki14; Timnah:1:Jdg14; Teman:0:Job2; Tishbe:0:1Ki17; Trachonitis:0:Lk3; Thebes:0:Jer46

@a-places|Places|Name a Bible place whose name begins with A
Athens:5:Ac17; Antioch:4:Ac11; Ararat:4:Ge8; Assyria:4:2Ki17; Ai:3:Jos7; Ashdod:2:1Sa5; Ashkelon:2:Jdg14; Arabia:2:Gal1
Ammon:2:Jdg11; Aram:2:2Ki5; Armageddon:3:Rev16; Achaia:1:Ac18; Anathoth:1:Jer1; Aphek:1:1Sa4; Areopagus:2:Ac17; Asia:2:Ac16
Adullam:1:1Sa22; Abilene:0:Lk3; Arnon:0:Nu21; Attalia:0:Ac14; Azotus:0:Ac8; Antipatris:0:Ac23; Amphipolis:0:Ac17

@j-places|Places|Name a Bible place whose name begins with J
Jerusalem:5:Ps122; Jericho:5:Jos6; Jordan:5:Mt3; Judea:4:Mt2; Joppa:3:Jon1; Jezreel:2:1Ki21; Jabbok:2:Ge32; Jebus:1:Jdg19
Jabesh-gilead:1:1Sa11; Judah:3:Ru1; Jacob's well:2:Jn4

@g-places|Places|Name a Bible place whose name begins with G
Galilee:5:Mt4; Gethsemane:5:Mt26; Golgotha:4:Jn19; Gomorrah:5:Ge19; Gaza:3:Jdg16; Gath:3:1Sa17; Goshen:3:Ge45; Gilgal:2:Jos4
Gilead:3:Jer8; Gibeah:2:1Sa10; Gibeon:2:Jos9; Gilboa:2:1Sa31; Galatia:3:Gal1; Gerar:1:Ge20; Gadara:1:Mt8; Gennesaret:1:Mk6
Gihon:1:Ge2; Gerizim:2:Dt11; Golan:0:Jos20

@abraham-events|Events|Name an event in the life of Abraham
God called him to leave Ur|Call of Abraham|Leaving Haran:5:Ge12; Said Sarah was his sister|Lied about Sarah:3:Ge12; Parted from Lot:3:Ge13
Rescued Lot:3:Ge14; Met Melchizedek|Melchizedek:3:Ge14; Covenant of the stars|Counted the stars:3:Ge15; Hagar and Ishmael|Ishmael born:4:Ge16
Name changed from Abram|New name:3:Ge17; Circumcision:3:Ge17; Three visitors|Entertained angels:4:Ge18; Pleaded for Sodom:4:Ge18
Isaac born|Birth of Isaac:5:Ge21; Sent Hagar away:3:Ge21; Sacrifice of Isaac|Binding of Isaac|Offered Isaac:5:Ge22; Bought the cave of Machpelah:2:Ge23
Found a wife for Isaac|Servant sent for Rebekah:3:Ge24; Died:2:Ge25; Ram caught in a thicket|Ram:3:Ge22

@jacob-events|Events|Name an event in the life of Jacob
Bought Esau's birthright|Birthright:5:Ge25; Stole the blessing|Tricked Isaac:5:Ge27; Ladder dream|Jacob's ladder:5:Ge28
Worked for Rachel|Worked seven years:4:Ge29; Tricked into marrying Leah|Married Leah:4:Ge29; Wrestled with God|Wrestling:5:Ge32
Renamed Israel|Name changed:4:Ge32; Reconciled with Esau|Met Esau:4:Ge33; Gave Joseph a coat|Coat of many colors:4:Ge37
Moved to Egypt:4:Ge46; Blessed his sons|Blessed Ephraim and Manasseh:3:Ge48; Striped flocks|Speckled sheep:2:Ge30; Born holding Esau's heel|Born a twin:3:Ge25
Fled to Haran|Fled from Esau:3:Ge27; Rachel died:2:Ge35; Built an altar at Bethel:2:Ge35

@joseph-events|Events|Name an event in the life of Joseph
Coat of many colors|Special coat:5:Ge37; Dreams of sheaves and stars|His dreams:5:Ge37; Thrown into a pit|Pit:5:Ge37; Sold into slavery|Sold:5:Ge37
Served Potiphar:4:Ge39; Accused by Potiphar's wife|Potiphar's wife:4:Ge39; Thrown in prison|Prison:4:Ge39; Interpreted the cupbearer's and baker's dreams:4:Ge40
Interpreted Pharaoh's dreams:5:Ge41; Became ruler of Egypt|Second in command:5:Ge41; Stored grain|Famine:4:Ge41; Married Asenath:1:Ge41
Brothers bowed down:3:Ge42; Silver cup in Benjamin's sack|Silver cup:3:Ge44; Revealed himself to his brothers|Forgave his brothers:4:Ge45
Brought Jacob to Egypt:3:Ge46; Bones carried out of Egypt:1:Ex13

@david-events|Events|Name an event in the life of David
Anointed by Samuel:5:1Sa16; Killed Goliath|Fought Goliath:5:1Sa17; Played the harp for Saul|Harp:4:1Sa16; Friendship with Jonathan|Covenant with Jonathan:4:1Sa18
Spared Saul's life|Cut Saul's robe:4:1Sa24; Became king:4:2Sa5; Danced before the ark|Brought the ark to Jerusalem:4:2Sa6; Sin with Bathsheba|Bathsheba:5:2Sa11
Rebuked by Nathan|Nathan's parable:4:2Sa12; Absalom's rebellion|Absalom:4:2Sa15; Killed a lion and a bear:3:1Sa17; Fled from Saul:3:1Sa19
Wanted to build the temple:3:2Sa7; Census|Numbered the people:2:2Sa24; Captured Jerusalem:3:2Sa5; Kindness to Mephibosheth|Mephibosheth:3:2Sa9
Married Abigail:2:1Sa25; Pretended to be mad:2:1Sa21; Wrote psalms:4:2Sa22; Mourned Absalom:3:2Sa18

@samuel-events|Events|Name an event in the life of Samuel
Hannah prayed for him|Answered prayer:4:1Sa1; Dedicated to the Lord|Given to Eli:4:1Sa1; God called him at night|Speak Lord:5:1Sa3
Served Eli in the temple|Grew up with Eli:4:1Sa2; Ark captured by the Philistines:3:1Sa4; Set up the Ebenezer stone|Ebenezer:3:1Sa7
Anointed Saul:5:1Sa10; Anointed David:5:1Sa16; Rebuked Saul|To obey is better than sacrifice:4:1Sa15; Killed Agag:2:1Sa15
Israel asked for a king:4:1Sa8; Appeared to Saul at Endor|Witch of Endor:3:1Sa28; Judged Israel:3:1Sa7; Little robe from Hannah:2:1Sa2; Died:2:1Sa25

@mary-events|Events|Name an event in the life of Mary, the mother of Jesus
Visit from Gabriel|Annunciation:5:Lk1; Visited Elizabeth:4:Lk1; Magnificat|Song of Mary:4:Lk1; Journey to Bethlehem:4:Lk2
Gave birth to Jesus|Birth of Jesus:5:Lk2; Visit of the shepherds:4:Lk2; Visit of the wise men:4:Mt2; Flight to Egypt:4:Mt2
Presented Jesus in the temple|Met Simeon:3:Lk2; Found Jesus in the temple|Lost Jesus:4:Lk2; Wedding at Cana:4:Jn2; Stood at the cross:4:Jn19
Given to John's care|Behold your son:3:Jn19; In the upper room|Prayed with the disciples:2:Ac1; Betrothed to Joseph:3:Mt1

@john-baptist-events|Events|Name an event in the life of John the Baptist
Leapt in Elizabeth's womb|Leapt for joy:4:Lk1; Birth announced to Zechariah:3:Lk1; Named John:3:Lk1; Preached in the wilderness:5:Mt3
Baptized Jesus:5:Mt3; Ate locusts and wild honey|Locusts:4:Mt3; Called Jesus the Lamb of God|Behold the Lamb of God:4:Jn1
Rebuked Herod:3:Mk6; Imprisoned|Thrown in prison:4:Mt14; Beheaded|Executed:5:Mt14; Sent disciples to ask if Jesus was the one:2:Mt11
Called people a brood of vipers|Brood of vipers:3:Mt3; Baptized crowds in the Jordan:4:Mk1

@solomon-events|Events|Name an event in the life of Solomon
Asked God for wisdom|Asked for wisdom:5:1Ki3; Judged between two mothers|Two mothers and the baby|Cut the baby in two:5:1Ki3
Built the temple:5:1Ki6; Visited by the Queen of Sheba|Queen of Sheba:4:1Ki10; Had many wives|700 wives:4:1Ki11
Dedicated the temple|Prayer of dedication:4:1Ki8; Anointed king:3:1Ki1; Wrote proverbs|Proverbs:4:1Ki4; Turned to idols:3:1Ki11
Built his palace:2:1Ki7; Great wealth:3:1Ki10; Killed Adonijah|Dealt with Adonijah:1:1Ki2; Ships of Tarshish:1:1Ki10

@joshua-events|Events|Name an event in the book of Joshua
Crossing the Jordan:5:Jos3; Battle of Jericho|Walls of Jericho:5:Jos6; Rahab hid the spies|Rahab:5:Jos2; Achan's sin:3:Jos7
Battle of Ai|Ai:3:Jos8; Gibeonites' trick|Gibeonite deception:2:Jos9; Sun stood still:4:Jos10; Dividing the land:3:Jos13
Cities of refuge:2:Jos20; Joshua's farewell|Choose this day:4:Jos24; Twelve memorial stones:3:Jos4; Manna stopped:2:Jos5
Commander of the Lord's army:2:Jos5; Circumcision at Gilgal:1:Jos5; Caleb's inheritance|Hebron for Caleb:2:Jos14; Be strong and courageous:4:Jos1

@judges-events|Events|Name an event in the book of Judges
Ehud killed Eglon|Ehud:3:Jdg3; Deborah and Barak|Deborah:4:Jdg4; Jael's tent peg|Jael:4:Jdg4; Gideon's fleece:5:Jdg6
Gideon's 300|Gideon's army:5:Jdg7; Jephthah's vow:3:Jdg11; Samson killed a lion:4:Jdg14; Samson and Delilah:5:Jdg16
Samson pulled down the temple|Samson's death:4:Jdg16; Abimelech and the millstone:2:Jdg9; Tribe of Dan moved|Danites:1:Jdg18
Shibboleth:2:Jdg12; Jotham's parable|Parable of the trees:1:Jdg9; Samson's riddle:3:Jdg14; Foxes with torches:3:Jdg15

@last-supper|Events|Name something that happened at the Last Supper
Jesus washed the disciples' feet|Foot washing:5:Jn13; Broke bread|Bread:5:Lk22; Shared the cup|Cup|Wine:5:Lk22; Do this in remembrance of me:4:Lk22
Judas identified as betrayer|Betrayal foretold:4:Jn13; Judas left:3:Jn13; Peter's denial foretold:4:Jn13; New commandment|Love one another:4:Jn13
Sang a hymn|Hymn:3:Mt26; John leaned on Jesus|Beloved disciple:2:Jn13; Passover meal|Passover:4:Lk22; Argued about who was greatest:2:Lk22
Dipped bread|Sop:2:Jn13; New covenant:3:Lk22

@arrest-night|Events|Name something that happened the night Jesus was arrested
Prayed in Gethsemane:5:Mt26; Disciples fell asleep:4:Mt26; Judas' kiss|Betrayed with a kiss:5:Lk22; Peter cut off an ear|Cut off Malchus' ear:4:Jn18
Jesus healed the ear:3:Lk22; Disciples fled:3:Mk14; Young man fled naked:1:Mk14; Trial before Caiaphas|Trial:4:Mt26
Questioned by Annas:2:Jn18; Peter denied Jesus|Denial:5:Mt26; Rooster crowed:5:Mt26; Sweat like drops of blood:3:Lk22; Angel strengthened Jesus:2:Lk22
Soldiers fell back|I am he:2:Jn18; Beaten and mocked:3:Lk22

@death-signs|Events|Name something that happened when Jesus died
Darkness:5:Mt27; Earthquake:5:Mt27; Temple curtain torn|Veil torn:5:Mt27; Rocks split:3:Mt27; Tombs opened|Saints raised:3:Mt27
Centurion said "Surely he was the Son of God"|Centurion's confession:4:Mk15; Side pierced|Spear:4:Jn19; Legs not broken:2:Jn19
Blood and water:3:Jn19; Women watched from a distance:2:Mk15; Thief promised paradise:2:Lk23; Crowd beat their breasts:1:Lk23

@end-times|Events|Name something the Bible says will happen at the end of time
Second coming|Jesus returns:5:Ac1; Resurrection of the dead|Dead raised:4:1Co15; Final judgment|Judgment:5:Rev20; New heaven and new earth|New earth:4:Rev21
Caught up in the clouds|Rapture:3:1Th4; Trumpet sounds|Last trumpet:3:1Co15; Satan thrown into the lake of fire:3:Rev20; Armageddon:3:Rev16
Every knee will bow:3:Php2; Wedding supper of the Lamb:2:Rev19; No more tears:4:Rev21; Thousand-year reign|Millennium:2:Rev20
Books opened:1:Rev20; Sheep and goats separated:3:Mt25

@rescues|Events|Name a famous rescue in the Bible
Noah's family saved|Noah:5:Ge7; Lot rescued from Sodom|Lot:4:Ge19; Israel through the Red Sea|Red Sea:5:Ex14; Rahab saved:3:Jos6
Baby Moses in the basket|Moses:5:Ex2; Daniel in the lions' den|Daniel:5:Da6; Three men in the furnace|Fiery furnace:5:Da3; Jonah and the fish|Jonah:4:Jon2
Peter freed from prison:4:Ac12; Paul's shipwreck:3:Ac27; Paul lowered in a basket:3:Ac9; Good Samaritan:3:Lk10; Isaac spared|Ram in the thicket:3:Ge22
Disciples in the storm:3:Mk4; Peter sinking:3:Mt14; Joash hidden:1:2Ki11; Esther saved the Jews|Esther:4:Est8; Jeremiah pulled from the cistern:2:Jer38

@signs-asked|Events|Name someone who asked God for a sign (or was given one)
Gideon:5:Jdg6; Hezekiah:3:2Ki20; Abraham's servant|Eliezer:3:Ge24; Moses:4:Ex4; Ahaz:2:Isa7; Zechariah|Zacharias:3:Lk1
Jonathan:1:1Sa14; Thomas:3:Jn20; Pharisees:3:Mt12; Noah:2:Ge9; Shepherds:2:Lk2; Mary:1:Lk1

@showdowns|Events|Name a famous confrontation or showdown in the Bible
Elijah and the prophets of Baal|Mount Carmel:5:1Ki18; David and Goliath:5:1Sa17; Moses and Pharaoh|Let my people go:5:Ex5
Nathan and David|You are the man:4:2Sa12; Jesus and the Pharisees:4:Mt23; Paul and Peter|Paul opposed Peter:2:Gal2; Esther and Haman:4:Est7
Daniel and the satraps:2:Da6; Jesus and Satan|Temptation:4:Mt4; Micaiah and the false prophets:1:1Ki22; Jeremiah and Hananiah:1:Jer28
Michael and the dragon|War in heaven:2:Rev12; Aaron's staff and the magicians:3:Ex7; Jacob and Esau:3:Ge33; Jesus and the money changers:4:Jn2

@requests|Events|Name a famous request someone made in the Bible (who asked, or what for)
Solomon asked for wisdom|Wisdom:5:1Ki3; Esther asked to save her people|Esther:4:Est7; Nehemiah asked to rebuild Jerusalem|Nehemiah:3:Ne2
Hannah asked for a son|Hannah:4:1Sa1; Elisha asked for a double portion|Double portion:4:2Ki2; Moses asked to see God's glory|Show me your glory:3:Ex33
Jabez:3:1Ch4; Thief on the cross|Remember me:3:Lk23; James and John's mother|Seats beside Jesus:2:Mt20; Herodias' daughter|Head of John the Baptist:3:Mk6
Bartimaeus|I want to see:3:Mk10; Samson asked for strength|Samson:3:Jdg16; Lord teach us to pray:3:Lk11; Joseph of Arimathea asked for the body:2:Mk15
Rich man asked for Lazarus to cool his tongue:1:Lk16; Prodigal son asked for his inheritance:3:Lk15; Caleb asked for the hill country:1:Jos14

@unusual-animals|Animals|Name an animal that did something extraordinary in a Bible story
Serpent:5:Ge3; Donkey:5:Nu22; Ravens:4:1Ki17; Lions:5:Da6; Great fish|Whale:5:Jon1; Bears:3:2Ki2; Cows:1:1Sa6
Pigs:3:Mk5; Rooster:4:Mt26; Fish with a coin|Fish:3:Mt17; Dove:4:Ge8; Quail:2:Nu11; Lion that killed the prophet:1:1Ki13; Viper:2:Ac28

@isaiah-11|Animals|Name an animal in Isaiah's picture of peace ("the wolf will live with the lamb")
Wolf:5:Isa11; Lamb:5:Isa11; Leopard:4:Isa11; Goat|Young goat|Kid:4:Isa11; Calf:3:Isa11; Lion:5:Isa11; Cow:3:Isa11
Bear:3:Isa11; Ox:3:Isa11; Cobra|Asp:2:Isa11; Viper|Adder:2:Isa11; Yearling|Fatling:1:Isa11

@dangerous-animals|Animals|Name a dangerous animal mentioned in the Bible
Lion:5:Da6; Bear:5:2Ki2; Wolf:4:Mt7; Leopard:3:Jer5; Snake|Serpent:5:Ge3; Viper:3:Ac28; Scorpion:3:Lk10; Cobra|Asp:2:Isa11
Leviathan:2:Job41; Behemoth:1:Job40; Wild boar:1:Ps80; Jackal:1:Isa34; Hornet:1:Ex23; Dragon:2:Rev12; Fiery serpents:2:Nu21; Crocodile:1:Job41

@animal-products|Animals|Name an animal product used in the Bible (e.g. wool)
Wool:5:Isa1; Leather|Leather belt:4:Mt3; Goat hair|Goats' hair:3:Ex26; Camel hair|Camel's hair:4:Mt3; Ram skins|Rams' skins:2:Ex26
Milk:4:Ex3; Honey:4:Jdg14; Ivory:2:1Ki10; Horn|Ram's horn:4:Jos6; Fleece:4:Jdg6; Eggs:2:Lk11; Fat:2:Lev3; Cheese:2:1Sa17; Butter|Curds:2:Ge18
Wax:1:Ps22; Bones:1:Jdg15; Sea cow skins|Badger skins|Porpoise skins:1:Ex26; Pearls:2:Mt13

@insult-animals|Animals|Name an animal Jesus or John the Baptist used to describe people
Vipers|Brood of vipers|Snakes:5:Mt3; Fox:4:Lk13; Sheep:5:Mt9; Goats:4:Mt25; Wolves:4:Mt7; Dogs:3:Mt15; Pigs|Swine:3:Mt7
Serpents:3:Mt10; Doves:3:Mt10; Lambs:3:Lk10; Hen|Chicks:2:Mt23; Fish:1:Mt4

@body-parts|Nature|Name a body part that plays a key role in a Bible story
Rib:5:Ge2; Hair:5:Jdg16; Heel:3:Ge25; Hip:3:Ge32; Ear:4:Lk22; Eye|Eyes:3:Jdg16; Hand:3:Mk3; Feet:4:Jn13; Side:4:Jn20
Head:4:Mt14; Forehead:4:1Sa17; Tongue:3:Jas3; Heart:3:1Sa16; Knee|Knees:2:Php2; Thigh:1:Jdg3; Thumb:1:Jdg1; Shoulder:1:Lk15
Mouth:2:Da6; Face:3:Ex34; Lips:1:Isa6; Fingers:2:Da5; Nose:0:2Ki19; Beard:1:2Sa10; Toes:1:Da2; Wounds|Nail prints:3:Jn20

@white-as-snow|Nature|Name something the Bible describes as white as snow or wool
Sins:5:Isa1; Jesus' clothes:4:Mk9; Jesus' hair:3:Rev1; Ancient of Days:2:Da7; Miriam:2:Nu12; Moses' hand:2:Ex4; Gehazi:1:2Ki5
Angel's clothing|Angel:2:Mt28; Robes of the saints|White robes:3:Rev7; Heart washed|Wash me:3:Ps51; Manna:1:Ex16

@shining|Nature|Name something in the Bible that shone or glowed
Moses' face:5:Ex34; Jesus at the Transfiguration|Jesus' face:5:Mt17; Star of Bethlehem|Star:5:Mt2; Glory of the Lord:4:Lk2
Pillar of fire:4:Ex13; Angels:4:Lk2; Burning bush:4:Ex3; Stephen's face:2:Ac6; Light on the road to Damascus:4:Ac9
New Jerusalem:3:Rev21; Lamp|Lampstand:3:Mt5; Tongues of fire:3:Ac2; Sun:3:Ge1; Cloud of glory:2:1Ki8; Righteous|Wise:1:Da12

@sounds|Nature|Name a sound heard in a Bible story
Trumpets:5:Jos6; Rooster crowing|Rooster:5:Mt26; Rushing wind:4:Ac2; Still small voice|Gentle whisper:4:1Ki19; Thunder:4:Ex19
Earthquake:3:Ac16; Shout|Shouting:4:Jos6; Voice from heaven:4:Mt3; Harp:3:1Sa16; Many waters|Rushing waters:2:Rev1; Weeping:3:Mt2
Marching in the treetops:1:2Sa5; Singing|Hymns:3:Ac16; Donkey speaking:2:Nu22; Ram's horn:3:Jos6; Hosanna|Crowds:3:Mt21

@grain-foods|Food & Drink|Name a food made from grain in the Bible
Bread:5:Mt6; Unleavened bread:5:Ex12; Loaves:4:Jn6; Cakes:3:Ge18; Wafers:2:Ex16; Roasted grain|Parched grain:2:Ru2
Flour|Fine flour:3:Lev2; Showbread|Bread of the Presence:3:1Sa21; Barley loaves|Barley bread:3:Jn6; Meal:2:1Ki17; Heads of grain:2:Mk2

@food-prep|Food & Drink|Name a way food was prepared in the Bible
Baked:5:Lev2; Roasted:5:Ex12; Boiled:4:Ex12; Fried|Pan:2:Lev2; Broiled|Grilled|Cooked over coals:3:Jn21; Stewed:3:Ge25
Ground|Milled:3:Nu11; Kneaded:2:Ge18; Leavened:2:Mt13; Unleavened:3:Ex12; Salted:2:Lev2; Dried:1:Nu6; Threshed:2:Ru3; Pressed:2:Ge40

@ruler-titles|Roles|Name a title given to a ruler in the Bible
King:5:1Sa8; Queen:5:Est1; Pharaoh:5:Ex1; Caesar|Emperor:4:Lk2; Governor:4:Mt27; Tetrarch:2:Lk3; Prince:3:Isa9; Satrap:1:Da6
Proconsul:1:Ac13; Judge:3:Jdg2; Chief|Chieftain:2:Ge36; Lord:2:Jdg3; Ethnarch:0:2Co11; Viceroy:0:1Ki22; High priest:2:Mt26; Prefect:1:Da3

@parable-jobs|Roles|Name a job or role of someone in Jesus' parables
Sower|Farmer:5:Mt13; Shepherd:5:Lk15; Merchant:3:Mt13; King:4:Mt22; Servant:4:Mt25; Manager|Steward:3:Lk16; Judge:3:Lk18
Landowner:3:Mt20; Vinedresser|Gardener:2:Lk13; Fisherman:2:Mt13; Builder:3:Mt7; Priest:3:Lk10; Levite:3:Lk10; Innkeeper:2:Lk10
Tax collector:3:Lk18; Pharisee:3:Lk18; Tenant farmers|Tenants:2:Mk12; Bridesmaids:3:Mt25; Workers|Laborers:3:Mt20; Banker|Money lender:2:Lk7

@ot-leaders|Roles|Name a kind of leader in Old Testament Israel
Prophet:5:Dt18; Priest:5:Lev1; King:5:1Sa8; Judge:5:Jdg2; Elder:3:Ex3; Patriarch:2:Ge12; Scribe:2:Ezr7; Levite:3:Nu3
High priest:4:Lev21; Governor:2:Ne5; Captain|Commander:2:Jos5; Seer:2:1Sa9; Counselor:1:2Sa15; Prince:2:Nu7

@house-items|Objects|Name an everyday household item mentioned in the Bible
Lamp:5:Mt5; Lampstand:3:Mt5; Bed|Mat:4:Mk2; Table:4:Lk22; Millstone:3:Mt24; Oven:3:Lev2; Jar:4:Jn2; Broom:3:Lk15
Door:3:Rev3; Window:3:Ac20; Cup:3:Mk9; Bowl:3:Jn13; Basket:3:Mt14; Chair|Stool:1:2Ki4; Basin:2:Jn13; Pot:2:2Ki4; Key:2:Mt16

@mission-items|Objects|Name something Jesus told his disciples not to take on their mission
Staff:4:Lk9; Bag:4:Lk9; Bread:4:Lk9; Money:5:Lk9; Extra tunic|Two tunics|Tunic:4:Lk9; Sandals:3:Lk10; Purse:3:Lk10; Gold:2:Mt10
Silver:2:Mt10; Copper:1:Mt10

@thrown|Objects|Name something or someone that was thrown in a Bible story
Stones:5:Ac7; Jonah:5:Jon1; Joseph:4:Ge37; Net:4:Jn21; Moses' staff|Staff:4:Ex7; Tablets of the law|Tablets:4:Ex32; Viper:3:Ac28
Jezebel:3:2Ki9; Wheat|Cargo:2:Ac27; Millstone:2:Jdg9; Spear:3:1Sa18; Salt:2:2Ki2; Stick:1:2Ki6; Daniel:4:Da6; Shadrach:3:Da3
Lots|Dice:3:Jn19; Thirty pieces of silver:3:Mt27; Coats|Cloaks:2:Mk11; Satan:2:Rev20

@hidden|Objects|Name something or someone that was hidden in a Bible story
Spies:5:Jos2; Moses:5:Ex2; Achan's loot|Stolen silver:3:Jos7; Joseph's silver cup|Silver cup:4:Ge44; Buried talent|Talent:4:Mt25
Treasure in a field|Treasure:4:Mt13; Joash:1:2Ki11; Elijah:3:1Ki17; David:3:1Sa22; Adam and Eve:4:Ge3; Saul among the baggage|Saul:2:1Sa10
Jeremiah's belt|Linen belt:1:Jer13; Rachel's idols|Household gods:2:Ge31; Prophets in caves:1:1Ki18; Lamp under a bushel|Lamp:3:Mt5; Yeast:2:Mt13

@burned|Objects|Name something that was burned in a Bible story
Burning bush:5:Ex3; Jeremiah's scroll|Scroll:3:Jer36; Sacrifices|Offerings:4:Lev1; Sodom:4:Ge19; Ai:2:Jos8; Books of magic|Scrolls of sorcery:2:Ac19
Golden calf:3:Ex32; Jericho:3:Jos6; Achan's possessions:1:Jos7; Philistine fields|Grain fields:3:Jdg15; Ziklag:1:1Sa30; Nadab and Abihu:2:Lev10
Temple|Jerusalem:3:2Ki25; Babylon:2:Rev18; Chaff:3:Mt3; Weeds|Tares:3:Mt13; Elijah's sacrifice:4:1Ki18

@bronze-things|Objects|Name something made of bronze (or brass) in the Bible
Bronze serpent|Bronze snake:5:Nu21; Bronze altar|Altar:4:Ex27; Laver|Basin:3:Ex30; Bronze sea|Molten sea:2:1Ki7; Goliath's armor|Helmet:3:1Sa17
Pillars|Jachin and Boaz:2:1Ki7; Shackles|Chains|Fetters:3:Jdg16; Shields:1:1Ki14; Gates:1:Ps107; Cymbals:2:1Co13; Statue's belly and thighs:1:Da2
Jesus' feet in Revelation|Feet like bronze:1:Rev1; Mirrors:1:Ex38

@silver-things|Objects|Name something made of silver in the Bible
Thirty pieces of silver:5:Mt26; Joseph's cup|Silver cup:5:Ge44; Shrines of Artemis|Shrines:2:Ac19; Trumpets:2:Nu10; Micah's idol|Idol:1:Jdg17
Statue's chest and arms:2:Da2; Tabernacle sockets|Sockets:1:Ex26; Coin|Denarius:3:Mt22; Shekels:3:Ge23; Bowls:1:Nu7; Cord:1:Ec12
Lost coin:3:Lk15; Talents:2:Mt25; Idols:2:Ps115

@poured|Objects|Name something that was poured out in the Bible
Holy Spirit|Spirit:5:Ac2; Oil|Anointing oil:5:1Sa16; Perfume|Nard:5:Jn12; Water on the altar|Water:4:1Ki18; Drink offering:2:Ge35
Wine:3:Lk10; Blood:4:Mt26; Bowls of wrath|Wrath:3:Rev16; Tears:2:Lk7; Heart|Soul:2:1Sa1; Rain:2:Ge7; Love:2:Ro5

@covenant-signs|Faith|Name a sign or symbol God gave of a promise or covenant
Rainbow:5:Ge9; Circumcision:4:Ge17; Sabbath:3:Ex31; Blood on the doorposts|Passover blood:4:Ex12; Scarlet cord:3:Jos2
Gideon's fleece:3:Jdg6; Virgin with child|Immanuel:3:Isa7; Bread and cup|Communion|Lord's Supper:4:1Co11; Ebenezer stone:2:1Sa7
Aaron's budding rod:2:Nu17; Baptism:4:Mt28; Stars:2:Ge15; Twelve stones:2:Jos4; Holy Spirit|Seal:2:Eph1

@christian-symbols|Faith|Name a Christian symbol that comes from the Bible
Cross:5:1Co1; Fish|Ichthys:5:Mt4; Dove:5:Mt3; Lamb:4:Jn1; Crown of thorns:3:Mt27; Alpha and Omega:3:Rev1; Anchor:2:Heb6
Shepherd's staff|Crook:2:Ps23; Bread and wine:4:Lk22; Light|Candle:3:Jn8; Crown:3:Rev2; Vine:2:Jn15; Water:2:Jn4; Lion:2:Rev5
Fire:2:Ac2; Rainbow:2:Ge9; Empty tomb:3:Jn20; Keys:1:Mt16; Lamp:2:Ps119

@measures|Numbers|Name a unit of measure or weight used in the Bible
Cubit:5:Ge6; Span:2:Ex28; Shekel:4:Ge23; Talent:4:Mt25; Ephah:2:Ru2; Omer:2:Ex16; Hin:1:Ex29; Bath:1:1Ki7
Homer:1:Hos3; Seah:0:2Ki7; Handbreadth:2:Ps39; Reed|Measuring rod:2:Eze40; Fathom:1:Ac27; Stadia|Furlong:1:Lk24; Mina:1:Lk19
Gerah:0:Ex30; Log:0:Lev14; Cor:0:1Ki4; Sabbath day's journey:2:Ac1; Day's journey:2:Lk2

@coins|Numbers|Name a coin or unit of money in the Bible
Denarius|Penny:5:Mt22; Shekel:4:Ge23; Talent:4:Mt25; Mina|Pound:2:Lk19; Mite|Lepton|Two small coins:4:Mk12; Drachma|Silver coin:3:Lk15
Stater|Four-drachma coin:1:Mt17; Thirty pieces of silver:3:Mt26; Daric|Drachmas of gold:0:Ezr8; Gerah:0:Ex30; Quadrans|Farthing:1:Mt5

@honored-jesus|Jesus|Name someone who honored or anointed Jesus
Mary of Bethany|Mary:5:Jn12; Sinful woman|Woman who washed his feet:4:Lk7; Wise men|Magi:5:Mt2; Nicodemus:3:Jn19
Joseph of Arimathea:3:Mt27; Women with spices:3:Lk24; Simeon:3:Lk2; Anna:2:Lk2; Zacchaeus:3:Lk19; Martha:3:Jn12; Shepherds:4:Lk2
Crowd on Palm Sunday|Crowds:4:Mt21; Thomas|My Lord and my God:3:Jn20; Peter|You are the Christ:3:Mt16; Centurion:2:Mk15; John the Baptist:3:Jn1

@great-faith|Jesus|Name someone Jesus praised for their faith
Centurion|Roman centurion:5:Mt8; Canaanite woman|Syrophoenician woman:4:Mt15; Woman with the issue of blood|Bleeding woman:4:Mk5
Bartimaeus:4:Mk10; Sinful woman|Woman who anointed Jesus:3:Lk7; Samaritan leper|Thankful leper:3:Lk17; Paralytic's friends|Four friends:3:Mk2
Poor widow|Widow with two coins:3:Mk12; Mary of Bethany:2:Lk10; Nathanael:2:Jn1; Peter:3:Mt16; Jairus:1:Mk5

@kingdom-like|Jesus|Name something Jesus said the kingdom of heaven is like
Mustard seed:5:Mt13; Yeast|Leaven:5:Mt13; Hidden treasure|Treasure in a field:4:Mt13; Pearl|Merchant looking for pearls:4:Mt13
Net|Fishing net:3:Mt13; Wheat and weeds|Wheat and tares:3:Mt13; Wedding feast|King's wedding banquet:3:Mt22; Landowner|Vineyard workers:3:Mt20
Ten virgins|Ten bridesmaids:3:Mt25; Man sowing seed|Sower:3:Mk4; Little children|Children:4:Mt19; Master of a house|Homeowner:1:Mt13
King settling accounts|Unforgiving servant:2:Mt18; Growing seed:2:Mk4

@rebuked|Jesus|Name someone or something Jesus rebuked
Peter|Get behind me Satan:5:Mt16; Pharisees:5:Mt23; Martha:3:Lk10; James and John|Sons of Thunder:3:Lk9; Disciples:4:Mk4
Thomas:2:Jn20; Money changers:4:Jn2; Wind and waves|Storm|Wind:5:Mk4; Demons|Evil spirits:4:Mk1; Fig tree:3:Mk11; Sadducees:2:Mt22
Satan|Devil:4:Mt4; Fever:2:Lk4; Teachers of the law|Scribes:3:Mt23

@jesus-compared|Jesus|Name something Jesus compared himself to
Shepherd:5:Jn10; Door|Gate:4:Jn10; Vine:5:Jn15; Bread:5:Jn6; Light:5:Jn8; Bridegroom:3:Mk2; Temple:3:Jn2; Hen:3:Mt23
Cornerstone|Stone the builders rejected:3:Mt21; Doctor|Physician:3:Mk2; Serpent lifted up|Bronze serpent:2:Jn3; Jonah:3:Mt12; Lightning:1:Mt24
Living water|Water:3:Jn4; Seed|Grain of wheat:2:Jn12; Thief in the night|Thief:2:Rev16; Son of Man:3:Mk2

@jesus-promises|Jesus|Name a promise Jesus made to his followers
I will be with you always|With you always:5:Mt28; Eternal life:5:Jn3; Holy Spirit|Comforter|Helper:4:Jn14; Rest|I will give you rest:4:Mt11
I will come again|Return:4:Jn14; Prepare a place for you|Many rooms:4:Jn14; Ask and you will receive|Ask:4:Mt7; Peace|My peace:4:Jn14
I will build my church|Church:3:Mt16; Will not leave you as orphans|Orphans:2:Jn14; Abundant life|Life to the full:3:Jn10; Never thirst:3:Jn4
Never be snatched from my hand:2:Jn10; Where two or three gather:3:Mt18; Fishers of men:3:Mt4; Paradise:2:Lk23

@jesus-commands|Jesus|Name a command Jesus gave
Love one another:5:Jn13; Love God|Love the Lord your God:5:Mt22; Love your neighbor|Love your neighbour:5:Mt22; Follow me:5:Mt4
Make disciples|Go and make disciples:5:Mt28; Baptize:3:Mt28; Do this in remembrance of me:4:Lk22; Forgive:4:Mt6; Pray:3:Mt6
Watch and pray|Keep watch:3:Mt26; Repent:3:Mk1; Believe:3:Mk1; Do not worry:4:Mt6; Take up your cross:4:Mt16; Feed my sheep:3:Jn21
Love your enemies:4:Mt5; Do not judge:3:Mt7; Let the little children come:3:Mt19; Do not be afraid:3:Mt14; Go and sin no more:3:Jn8
Remember Lot's wife:1:Lk17; Ephphatha|Be opened:1:Mk7; Talitha koum|Little girl get up|Little girl arise:2:Mk5; Lazarus come out|Come out:3:Jn11; Take up your mat and walk|Rise and walk:3:Jn5; Peace be still:3:Mk4; Stretch out your hand:2:Mk3; Give to Caesar what is Caesar's|Render unto Caesar:3:Mt22

@after-resurrection|Jesus|Name something Jesus did after he rose from the dead
Appeared to Mary Magdalene:5:Jn20; Walked to Emmaus|Road to Emmaus:4:Lk24; Broke bread:3:Lk24; Showed his wounds|Showed his hands and side:4:Jn20
Ate fish|Ate broiled fish:3:Lk24; Breathed on the disciples|Gave the Holy Spirit:2:Jn20; Cooked breakfast|Breakfast on the beach:3:Jn21
Restored Peter|Feed my sheep:3:Jn21; Gave the Great Commission|Great Commission:4:Mt28; Ascended into heaven|Ascension:5:Ac1
Opened the Scriptures:2:Lk24; Appeared to Thomas:4:Jn20; Appeared to more than five hundred|500:2:1Co15; Appeared to Paul:2:1Co15; Miraculous catch:2:Jn21

@palm-sunday|Jesus|Name something that happened on Palm Sunday (the triumphal entry)
Palm branches|Waved palms:5:Jn12; Cloaks on the road|Spread cloaks:4:Mt21; Hosanna|Shouted Hosanna:5:Mt21; Rode a donkey|Donkey:5:Mt21
Colt:3:Mk11; Pharisees complained:2:Lk19; Stones would cry out:2:Lk19; Wept over Jerusalem:3:Lk19; City was stirred:2:Mt21
Cleared the temple:3:Mt21; Children praised him:2:Mt21; Blessed is he who comes in the name of the Lord:3:Mt21

@famous-chapters|Scripture|Name a famous chapter of the Bible (book and chapter number)
1 Corinthians 13:5:1Co13; Psalm 23:5:Ps23; Genesis 1:5:Ge1; Hebrews 11:4:Heb11; Isaiah 53:4:Isa53; Exodus 20:4:Ex20
John 3:4:Jn3; Romans 8:4:Ro8; Psalm 119:3:Ps119; Psalm 91:3:Ps91; Matthew 5:3:Mt5; Ephesians 6:3:Eph6; John 1:3:Jn1
Luke 2:3:Lk2; Isaiah 40:2:Isa40; 1 Corinthians 15:2:1Co15; Revelation 21:2:Rev21; Psalm 51:2:Ps51; Proverbs 31:3:Pr31
Ecclesiastes 3:3:Ec3; John 11:2:Jn11; John 14:2:Jn14; Romans 12:2:Ro12; Galatians 5:2:Gal5; Matthew 28:2:Mt28; Acts 2:2:Ac2
Psalm 139:2:Ps139; Daniel 3:2:Da3; Daniel 6:2:Da6; Philippians 4:2:Php4; 1 John 4:1:1Jn4; Genesis 3:3:Ge3; Matthew 6:3:Mt6

@sign-acts|People|Name a prophet who acted out a message from God
Ezekiel:5:Eze4; Jeremiah:5:Jer13; Isaiah:3:Isa20; Hosea:4:Hos1; Agabus:2:Ac21; Ahijah:1:1Ki11; Elisha:1:2Ki13; Zedekiah son of Kenaanah:0:1Ki22

@psalm-phrases|Scripture|Name a famous phrase from the Psalms
The Lord is my shepherd:5:Ps23; Be still and know that I am God|Be still:5:Ps46; This is the day the Lord has made|This is the day:4:Ps118
Create in me a clean heart:4:Ps51; Your word is a lamp to my feet|Lamp to my feet:4:Ps119; Make a joyful noise:4:Ps100
The heavens declare the glory of God|Heavens declare:3:Ps19; As the deer pants:3:Ps42; I lift up my eyes to the hills|I will lift up my eyes:3:Ps121
Taste and see:3:Ps34; Bless the Lord O my soul:3:Ps103; Let everything that has breath praise the Lord:3:Ps150; Fearfully and wonderfully made:4:Ps139
Delight yourself in the Lord:3:Ps37; God is our refuge and strength:3:Ps46; The fool says there is no God:2:Ps14; Under his wings:2:Ps91

@word-images|Scripture|Name something the Bible compares God's Word to
Lamp:5:Ps119; Light:5:Ps119; Sword|Double-edged sword:5:Heb4; Fire:3:Jer23; Hammer:3:Jer23; Seed:4:Lk8; Milk:3:1Pe2
Bread:3:Mt4; Honey:3:Ps19; Mirror:2:Jas1; Rain and snow|Rain:2:Isa55; Gold:2:Ps19; Food|Solid food:2:Heb5

@believer-names|Faith|Name something the New Testament calls believers
Saints:5:Ro1; Christians:5:Ac11; Disciples:5:Ac6; Brothers|Brothers and sisters|Brethren:4:Ro12; Children of God:4:Jn1
Body of Christ:4:1Co12; Bride of Christ|Bride:3:Rev19; Royal priesthood|Holy priesthood:3:1Pe2; Chosen people:3:1Pe2; Ambassadors:3:2Co5
Temple of the Holy Spirit:3:1Co6; Living stones:2:1Pe2; Followers of the Way|The Way:2:Ac9; Heirs:2:Ro8; Salt and light:2:Mt5; Sheep:2:Jn10

@church-practices|Faith|Name a practice of the early church in Acts and the letters
Baptism:5:Ac2; Lord's Supper|Communion|Breaking bread:5:Ac2; Prayer:5:Ac2; Fasting:3:Ac13; Laying on of hands:3:Ac6
Anointing with oil:2:Jas5; Singing hymns|Singing:3:Eph5; Fellowship:4:Ac2; Teaching|Apostles' teaching:3:Ac2; Giving|Collection:3:1Co16
Sharing possessions:3:Ac4; Confession:2:Jas5; Holy kiss|Greeting with a holy kiss:2:Ro16; Meeting in homes|House churches:2:Ro16

@salvation-words|Faith|Name a word Paul uses to describe salvation
Grace:5:Eph2; Faith:5:Eph2; Justification|Justified:4:Ro5; Redemption|Redeemed:4:Eph1; Reconciliation|Reconciled:3:2Co5
Adoption|Adopted:3:Ro8; Sanctification|Sanctified:3:1Th4; Atonement|Propitiation:3:Ro3; Forgiveness:4:Eph1; New creation:3:2Co5
Regeneration|Born again:2:Tit3; Righteousness:4:Ro3; Election|Chosen:2:Eph1; Peace with God:2:Ro5; Freedom:2:Gal5; Gift:3:Ro6

@gifts-of-god|Faith|Name something the Bible calls a gift from God
Eternal life:5:Ro6; Salvation:4:Eph2; Grace:5:Eph2; Holy Spirit:4:Ac2; Children:3:Ps127; Wisdom:3:Jas1; Peace:3:Jn14
Faith:3:Eph2; Rest:2:Mt11; Jesus|His Son:4:Jn3; Every good gift:2:Jas1; Joy:2:Ec2; Food and drink:1:Ec3; Spiritual gifts:3:1Co12

@flee|Faith|Name something the Bible tells believers to flee from or resist
Sexual immorality:5:1Co6; Idolatry|Idols:4:1Co10; Youthful lusts|Evil desires:3:2Ti2; The devil|Devil:5:Jas4; Temptation:4:1Co10
Love of money:3:1Ti6; Evil:3:Ro12; Sin:3:Heb12; Pride:2:Jas4; Anger:2:Eph4; Greed:2:Lk12

@worship-ways|Faith|Name a way of worshipping God mentioned in the Psalms
Singing|Sing:5:Ps96; Shouting|Shout for joy:4:Ps47; Clapping|Clap your hands:4:Ps47; Dancing:4:Ps150; Kneeling|Bowing down:4:Ps95
Lifting hands|Raising hands:4:Ps134; Playing instruments|Harp|Trumpet:4:Ps150; Praying|Prayer:4:Ps5; Giving thanks|Thanksgiving:4:Ps100
Offering sacrifices:2:Ps50; Being still:3:Ps46; Joyful noise:3:Ps100; Meditating:2:Ps1; Praise:4:Ps150; Tithes|Offerings:1:Ps96

@forever|Faith|Name something the Bible says "endures forever"
His love|Steadfast love|His mercy|Love:5:Ps136; His word|Word of the Lord:5:1Pe1; His faithfulness|Faithfulness:4:Ps117
His righteousness|Righteousness:3:Ps111; His name:3:Ps135; His kingdom:3:Ps145; His counsel|His plans:2:Ps33; His praise:2:Ps111
God himself|The Lord:3:Ps102; Truth:2:Ps117; His goodness:2:Ps100

@god-attributes|Faith|Name a quality or attribute of God described in the Bible
Holy:5:Isa6; Love:5:1Jn4; Merciful:4:Ex34; Just:4:Dt32; Faithful:4:1Co10; Almighty|All-powerful:4:Ge17; Eternal|Everlasting:4:Ps90
All-knowing|Omniscient:3:Ps139; Everywhere|Omnipresent:3:Ps139; Gracious:4:Ex34; Good:4:Ps34; Slow to anger|Patient:3:Ex34
Jealous:2:Ex34; Wise:3:Ro16; Unchanging:3:Mal3; True:3:Jn17; Righteous:4:Ps145; Sovereign:2:Isa40; Compassionate:3:Ps103; Light:3:1Jn1

@new-jerusalem|Faith|Name something the Bible says will (or won't) be in the New Jerusalem
No more tears:5:Rev21; No more death:5:Rev21; No more pain:4:Rev21; No night:3:Rev22; No sea:2:Rev21; No temple:2:Rev21
River of life:4:Rev22; Tree of life:4:Rev22; Streets of gold|Gold street:5:Rev21; Gates of pearl|Pearly gates:5:Rev21; Throne of God:4:Rev22
Glory of God|God's light:3:Rev21; Twelve gates:3:Rev21; Jasper walls|Walls:2:Rev21; The Lamb:3:Rev21; No curse:1:Rev22; Twelve foundations:2:Rev21

@one-another|Faith|Complete a New Testament "one another" command (e.g. "love one another")
Love one another:5:Jn13; Serve one another:4:Gal5; Forgive one another:4:Eph4; Bear one another's burdens|Carry each other's burdens:4:Gal6
Encourage one another:4:1Th5; Be kind to one another:3:Eph4; Pray for one another:4:Jas5; Honor one another:3:Ro12; Accept one another:2:Ro15
Greet one another:2:Ro16; Submit to one another:2:Eph5; Teach one another:2:Col3; Confess your sins to one another:2:Jas5
Do not judge one another:2:Ro14; Live in harmony:2:Ro12; Comfort one another:2:1Th4; Build one another up:2:1Th5; Be devoted to one another:1:Ro12

@night-events|Events|Name something that happened at night in the Bible
Passover|Exodus:5:Ex12; Jacob's ladder dream:4:Ge28; Jacob wrestled with God:4:Ge32; God called Samuel:4:1Sa3; Nicodemus visited Jesus:4:Jn3
Jesus prayed in Gethsemane:4:Mt26; Peter's denial:4:Mt26; Peter's escape from prison:3:Ac12; Earthquake in the Philippian jail:3:Ac16
Jesus walked on water:3:Mt14; Shepherds saw the angels:4:Lk2; Gideon's attack:2:Jdg7; Belshazzar's feast|Writing on the wall:3:Da5
Paul escaped in a basket:2:Ac9; Eutychus fell:2:Ac20; Boaz and Ruth at the threshing floor:2:Ru3; Daniel in the lions' den:3:Da6
`)
