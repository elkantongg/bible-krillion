// More people, places and spelling prompts.
import { bank } from './define'

export const moreBank = bank(`
@parable-characters|Jesus|Name a character in one of Jesus' parables
Good Samaritan|Samaritan:5:Lk10; Prodigal son|Lost son|Younger son:5:Lk15; Older brother|Elder brother:3:Lk15; Father:3:Lk15
Priest:3:Lk10; Levite:3:Lk10; Innkeeper:2:Lk10; Rich man:3:Lk16; Lazarus|Beggar:3:Lk16; Abraham:2:Lk16; Sower|Farmer:4:Mt13
Ten virgins|Bridesmaids|Virgins:3:Mt25; Bridegroom:3:Mt25; Unjust judge|Judge:2:Lk18; Persistent widow|Widow:3:Lk18; Pharisee:3:Lk18
Tax collector:3:Lk18; Rich fool:3:Lk12; Unforgiving servant|Unmerciful servant:3:Mt18; Shepherd:4:Lk15; Woman with the lost coin|Woman:2:Lk15
Landowner|Vineyard owner:2:Mt20; Tenants|Wicked tenants:2:Mk12; King:2:Mt22; Shrewd manager|Dishonest steward|Steward:2:Lk16
Servants with talents|Servants:2:Mt25; Friend at midnight:1:Lk11; Merchant:2:Mt13; Wise builder|Foolish builder|Builder:2:Mt7; Robbers:2:Lk10

@called-follow|People|Name someone Jesus called to "follow me"
Peter|Simon Peter:5:Mt4; Andrew:5:Mt4; James:4:Mt4; John:4:Mt4; Matthew|Levi:5:Mt9; Philip:3:Jn1; Nathanael:2:Jn1
Rich young ruler|Rich young man:3:Mk10; Paul|Saul:2:Ac9; Zacchaeus:1:Lk19

@jesse-sons|People|Name a child of Jesse (David's family)
David:5:1Sa16; Eliab:3:1Sa16; Abinadab:2:1Sa16; Shammah|Shimea:2:1Sa16; Nethanel:0:1Ch2; Raddai:0:1Ch2; Ozem:0:1Ch2
Zeruiah:1:1Ch2; Abigail:1:1Ch2

@saul-children|People|Name a child of King Saul
Jonathan:5:1Sa14; Michal:4:1Sa14; Ish-bosheth|Ishbosheth|Ish-baal|Eshbaal:3:2Sa2; Merab:2:1Sa14; Abinadab:1:1Sa31
Malki-shua|Malchishua|Malchi-shua:1:1Sa31; Ishvi:0:1Sa14; Armoni:0:2Sa21; Mephibosheth:1:2Sa21

@tomb-visitors|People|Name someone who went to Jesus' tomb
Mary Magdalene:5:Jn20; Peter:5:Jn20; John|The other disciple:4:Jn20; Mary mother of James|The other Mary:3:Mt28; Salome:2:Mk16
Joanna:2:Lk24; Joseph of Arimathea:3:Mt27; Nicodemus:2:Jn19; Roman guards|Guards:2:Mt28

@judges-people|People|Name a person in the book of Judges
Samson:5:Jdg13; Gideon:5:Jdg6; Deborah:5:Jdg4; Delilah:5:Jdg16; Barak:3:Jdg4; Jael:3:Jdg4; Sisera:3:Jdg4; Ehud:3:Jdg3
Othniel:2:Jdg3; Eglon:2:Jdg3; Shamgar:2:Jdg3; Jephthah:3:Jdg11; Abimelech:2:Jdg9; Manoah:2:Jdg13; Tola:1:Jdg10; Jair:1:Jdg10
Ibzan:0:Jdg12; Elon:0:Jdg12; Abdon:0:Jdg12; Micah:1:Jdg17; Jotham:1:Jdg9; Caleb:1:Jdg1; Oreb:0:Jdg7; Zeeb:0:Jdg7; Jabin:1:Jdg4

@genesis-people|People|Name a person in the book of Genesis
Adam:5:Ge2; Eve:5:Ge3; Noah:5:Ge6; Abraham|Abram:5:Ge12; Isaac:5:Ge21; Jacob:5:Ge25; Joseph:5:Ge37; Cain:5:Ge4; Abel:5:Ge4
Sarah|Sarai:5:Ge17; Rebekah:4:Ge24; Rachel:4:Ge29; Leah:4:Ge29; Esau:4:Ge25; Lot:4:Ge13; Ishmael:4:Ge16; Hagar:4:Ge16
Seth:3:Ge4; Methuselah:4:Ge5; Enoch:3:Ge5; Shem:3:Ge6; Ham:3:Ge6; Japheth:3:Ge6; Benjamin:4:Ge35; Judah:3:Ge29; Reuben:3:Ge29
Laban:3:Ge24; Potiphar:3:Ge39; Pharaoh:4:Ge12; Melchizedek:2:Ge14; Nimrod:2:Ge10; Dinah:2:Ge34; Tamar:2:Ge38; Lamech:2:Ge4
Terah:1:Ge11; Eliezer:1:Ge15; Abimelech:2:Ge20; Keturah:1:Ge25; Asenath:1:Ge41; Manasseh:2:Ge41; Ephraim:2:Ge41; Tubal-cain:1:Ge4

@gospel-people|People|Name a person in the four Gospels
Jesus:5:Mt1; Mary:5:Lk1; Joseph:5:Mt1; Peter:5:Mt4; John the Baptist:5:Mt3; Judas:5:Mt26; Pilate:5:Mt27; Lazarus:4:Jn11
Martha:4:Lk10; Mary Magdalene:4:Jn20; Zacchaeus:4:Lk19; Nicodemus:4:Jn3; Herod:4:Mt2; Thomas:4:Jn20; Andrew:3:Jn1; Matthew:4:Mt9
James:3:Mt4; John:4:Mt4; Philip:3:Jn1; Nathanael:2:Jn1; Bartimaeus:3:Mk10; Barabbas:3:Mt27; Caiaphas:3:Mt26; Jairus:3:Mk5
Simeon:2:Lk2; Anna:2:Lk2; Elizabeth:3:Lk1; Zechariah:3:Lk1; Gabriel:3:Lk1; Joseph of Arimathea:3:Mt27; Simon of Cyrene:2:Mk15
Malchus:2:Jn18; Annas:2:Jn18; Herodias:2:Mk6; Cleopas:2:Lk24; Legion:2:Mk5; Salome:1:Mk15; Joanna:1:Lk8; Susanna:1:Lk8
Zebedee:2:Mt4; Theophilus:1:Lk1; Quirinius:0:Lk2; Tiberius:1:Lk3; Caesar Augustus:2:Lk2; Simon the Zealot:1:Mt10; Thaddaeus:1:Mt10

@numbers-people|People|Name a person in the book of Numbers
Moses:5:Nu1; Aaron:5:Nu1; Miriam:4:Nu12; Joshua:4:Nu13; Caleb:4:Nu13; Korah:3:Nu16; Balaam:4:Nu22; Balak:3:Nu22
Dathan:1:Nu16; Abiram:1:Nu16; Phinehas:2:Nu25; Eleazar:2:Nu20; Og:2:Nu21; Sihon:2:Nu21; Eldad:1:Nu11; Medad:1:Nu11
Hobab:0:Nu10; Zimri:1:Nu25; Cozbi:0:Nu25; Zelophehad:1:Nu27; Mahlah:0:Nu27; Noah:0:Nu27; Hoglah:0:Nu27; Milcah:0:Nu27; Tirzah:0:Nu27

@kings-people|People|Name a person in the books of Kings
Solomon:5:1Ki1; Elijah:5:1Ki17; Elisha:5:2Ki2; Ahab:5:1Ki16; Jezebel:5:1Ki16; David:4:1Ki1; Hezekiah:4:2Ki18; Josiah:4:2Ki22
Naaman:4:2Ki5; Queen of Sheba:3:1Ki10; Jehu:3:2Ki9; Rehoboam:3:1Ki12; Jeroboam:3:1Ki12; Nebuchadnezzar:3:2Ki24; Bathsheba:2:1Ki1
Nathan:2:1Ki1; Adonijah:2:1Ki1; Gehazi:2:2Ki5; Naboth:2:1Ki21; Obadiah:1:1Ki18; Isaiah:2:2Ki19; Sennacherib:2:2Ki18; Hiram:2:1Ki5
Athaliah:2:2Ki11; Joash:2:2Ki11; Huldah:1:2Ki22; Hilkiah:1:2Ki22; Manasseh:2:2Ki21; Zedekiah:2:2Ki24; Omri:1:1Ki16; Micaiah:1:1Ki22
Jehoshaphat:2:1Ki22; Ben-Hadad:1:1Ki20; Hazael:1:2Ki8; Uzziah|Azariah:1:2Ki15; Ahaz:1:2Ki16; Hoshea:1:2Ki17

@revelation-figures|People|Name a person or figure in the book of Revelation
John:5:Rev1; Jesus|Lamb:5:Rev5; Michael:3:Rev12; Satan|Dragon|Devil:5:Rev12; Beast:4:Rev13; False prophet:3:Rev19
Jezebel:2:Rev2; Balaam:1:Rev2; Antipas:1:Rev2; Two witnesses:3:Rev11; Woman clothed with the sun:2:Rev12; Twenty-four elders|Elders:3:Rev4
Four living creatures:2:Rev4; Abaddon|Apollyon:1:Rev9; Gog:1:Rev20; Magog:1:Rev20; Four horsemen|Horsemen:4:Rev6; Great prostitute|Whore of Babylon:2:Rev17
Seven angels|Angels:3:Rev8; Bride|Bride of the Lamb:3:Rev21; Nicolaitans:1:Rev2

@return-exile|People|Name someone who led or helped the return from exile and the rebuilding of Jerusalem
Nehemiah:5:Ne2; Ezra:5:Ezr7; Zerubbabel:4:Ezr3; Joshua|Jeshua:2:Ezr3; Haggai:3:Ezr5; Zechariah:3:Ezr5; Cyrus:4:Ezr1
Sheshbazzar:1:Ezr1; Darius:2:Ezr6; Artaxerxes:2:Ne2; Eliashib:0:Ne3; Hanani:1:Ne1

@rich|People|Name someone the Bible describes as rich or wealthy
Solomon:5:1Ki10; Abraham|Abram:4:Ge13; Job:5:Job1; Zacchaeus:4:Lk19; Rich young ruler|Rich young man:4:Mk10; Joseph of Arimathea:3:Mt27
Boaz:3:Ru2; Barzillai:1:2Sa19; Nabal:2:1Sa25; Rich man:3:Lk16; Isaac:2:Ge26; Jacob:2:Ge30; Lot:1:Ge13; Hezekiah:1:2Ch32
Rich fool:2:Lk12; Lydia:1:Ac16; Queen of Sheba:2:1Ki10; Laban:1:Ge30

@poor|People|Name someone in the Bible who was poor or begged
Lazarus|Beggar Lazarus:5:Lk16; Bartimaeus:5:Mk10; Poor widow|Widow with two coins:4:Mk12; Lame man at the gate|Lame beggar:4:Ac3
Ruth:3:Ru2; Naomi:3:Ru1; Job:3:Job1; Prodigal son:3:Lk15; Widow of Zarephath:3:1Ki17; Man born blind:2:Jn9; Jesus:2:2Co8

@generous|People|Name someone in the Bible known for a generous gift
Poor widow|Widow with two coins|Widow's mite:5:Mk12; Barnabas:3:Ac4; Boy with loaves and fish|Boy:4:Jn6; Mary of Bethany|Mary:4:Jn12
Zacchaeus:4:Lk19; Dorcas|Tabitha:3:Ac9; Abigail:3:1Sa25; Lydia:2:Ac16; Abraham:2:Ge14; Wise men|Magi:4:Mt2; Hannah:2:1Sa1
Araunah|Ornan:1:2Sa24; David:2:1Ch29; Good Samaritan:3:Lk10; Joseph of Arimathea:2:Mt27; Philippians|Philippian church:1:Php4

@hosts|People|Name someone in the Bible who welcomed guests into their home
Abraham:5:Ge18; Lot:4:Ge19; Rahab:4:Jos2; Martha:5:Lk10; Mary:3:Lk10; Zacchaeus:5:Lk19; Lydia:3:Ac16; Simon the tanner:2:Ac9
Shunammite woman:2:2Ki4; Philemon:2:Phm1; Gaius:1:Ro16; Aquila:2:Ac18; Priscilla:2:Ac18; Laban:2:Ge24; Publius:1:Ac28
Simon the Pharisee:2:Lk7; Levi|Matthew:3:Lk5; Widow of Zarephath:3:1Ki17; Cornelius:2:Ac10; Jason:0:Ac17; Mnason:0:Ac21

@repented|People|Name someone in the Bible who repented or changed their ways
David:5:Ps51; Zacchaeus:5:Lk19; Peter:4:Jn21; Paul|Saul:5:Ac9; People of Nineveh|Ninevites|Nineveh:4:Jon3; Manasseh:2:2Ch33
Prodigal son:4:Lk15; Thief on the cross:3:Lk23; Jonah:3:Jon2; Ahab:1:1Ki21; Nebuchadnezzar:2:Da4; Josiah:2:2Ki22; Job:1:Job42
Tax collector:2:Lk18; Judah:1:Ge38

@symbolic-names|People|Name a child given a symbolic or prophetic name in the Bible
Immanuel|Emmanuel:5:Isa7; Jesus:5:Mt1; Isaac:3:Ge17; Ichabod:3:1Sa4; Jezreel:2:Hos1; Lo-ruhamah|Loruhamah:1:Hos1
Lo-ammi|Loammi:1:Hos1; Shear-jashub:0:Isa7; Maher-shalal-hash-baz|Mahershalalhashbaz:1:Isa8; John:2:Lk1; Ishmael:2:Ge16
Ben-oni|Benoni|Benjamin:2:Ge35; Moses:2:Ex2; Peleg:0:Ge10; Noah:1:Ge5

@caves|People|Name someone in the Bible who hid or stayed in a cave
David:5:1Sa22; Elijah:4:1Ki19; Lot:3:Ge19; Saul:2:1Sa24; Obadiah's prophets|Hundred prophets:1:1Ki18; Five kings|Five Amorite kings:1:Jos10
Lazarus:2:Jn11; Jesus:2:Mt27; Abraham:1:Ge25; Sarah:1:Ge23

@told-to-build|People|Name someone God told to build or make something
Noah:5:Ge6; Moses:5:Ex25; Bezalel|Bezaleel:2:Ex31; Solomon:4:1Ki5; Gideon:2:Jdg6; Joshua:2:Jos4; Jeremiah:1:Jer27
Ezekiel:1:Eze4; Nehemiah:3:Ne2; Zerubbabel:2:Hag1; David:1:1Ch28; Jacob:2:Ge35

@runners|People|Name someone the Bible describes as running
Elijah:4:1Ki18; Peter:4:Jn20; John:3:Jn20; Mary Magdalene:3:Jn20; Prodigal's father|Father:4:Lk15; Philip:2:Ac8
Zacchaeus:3:Lk19; Ahimaaz:1:2Sa18; Cushite:0:2Sa18; Asahel:1:2Sa2; Gehazi:1:2Ki5; Abraham:1:Ge18; Esau:1:Ge33
Joseph:2:Ge39; David:2:1Sa17; Jonah:2:Jon1; Paul:2:1Co9

@widows|Women|Name a widow in the Bible
Naomi:5:Ru1; Ruth:5:Ru1; Orpah:3:Ru1; Anna:3:Lk2; Abigail:2:1Sa25; Widow of Zarephath:4:1Ki17; Widow of Nain:3:Lk7
Poor widow|Widow with two coins:4:Mk12; Tamar:2:Ge38; Bathsheba:2:2Sa11; Persistent widow:2:Lk18; Rizpah:0:2Sa21; Prophet's widow:1:2Ki4

@famous-siblings|People|Name someone in the Bible whose brother or sister is also well known
Moses:5:Ex4; Aaron:5:Ex4; Miriam:5:Ex15; Mary:4:Jn11; Martha:5:Jn11; Lazarus:5:Jn11; Peter:4:Mt4; Andrew:4:Mt4
James:4:Mt4; John:4:Mt4; Cain:4:Ge4; Abel:4:Ge4; Jacob:5:Ge25; Esau:5:Ge25; Joseph:4:Ge37; Benjamin:3:Ge43
Rachel:3:Ge29; Leah:3:Ge29; Absalom:2:2Sa13; Tamar:2:2Sa13; Amnon:2:2Sa13; Shem:1:Ge6; Ham:1:Ge6; Japheth:1:Ge6

@boats|People|Name someone in the Bible who sailed or was on a famous boat
Noah:5:Ge7; Jonah:5:Jon1; Paul:5:Ac27; Peter:5:Mt14; Jesus:4:Mk4; Andrew:2:Mk1; James:2:Mk1; John:2:Mk1; Luke:2:Ac27
Aristarchus:1:Ac27; Julius:1:Ac27; Zebedee:2:Mk1; Thomas:1:Jn21; Nathanael:1:Jn21; Barnabas:2:Ac13

@argued-with-god|People|Name someone in the Bible who argued or pleaded with God
Abraham:5:Ge18; Moses:5:Ex32; Jonah:4:Jon4; Job:4:Job23; Jeremiah:3:Jer12; Habakkuk:3:Hab1; Gideon:3:Jdg6; Elijah:2:1Ki19
Jacob:2:Ge32; Hezekiah:2:2Ki20; Amos:1:Am7; Asaph:1:Ps73; Jesus:1:Mt26

@roofs|People|Name someone in a Bible story that happens on a roof, wall or window
David:5:2Sa11; Rahab:5:Jos2; Peter:3:Ac10; Paralyzed man|Paralytic:4:Mk2; Paul:4:Ac9; Eutychus:4:Ac20; Jezebel:3:2Ki9
Michal:3:2Sa6; Noah:1:Ge8; Daniel:3:Da6; Absalom:2:2Sa16; Abimelech:1:Jdg9; Sisera's mother:0:Jdg5

@snakes|People|Name someone in the Bible who encountered a snake or serpent
Eve:5:Ge3; Adam:3:Ge3; Moses:5:Ex4; Aaron:4:Ex7; Paul:4:Ac28; Pharaoh's magicians|Magicians:2:Ex7; Hezekiah:1:2Ki18
Israelites:3:Nu21; Jesus:1:Lk10

@recovered|People|Name someone in the Bible who was seriously ill and recovered
Hezekiah:5:2Ki20; Naaman:4:2Ki5; Epaphroditus:2:Php2; Peter's mother-in-law:4:Mk1; Job:4:Job42; Miriam:3:Nu12; Abimelech:1:Ge20
Nobleman's son|Official's son:3:Jn4; Publius' father:1:Ac28; Centurion's servant:3:Lk7; Lazarus:2:Jn11; Jeroboam:1:1Ki13

@beautiful|People|Name someone the Bible describes as beautiful or handsome
Sarah:4:Ge12; Rebekah:4:Ge24; Rachel:5:Ge29; Joseph:4:Ge39; David:4:1Sa16; Abigail:3:1Sa25; Bathsheba:5:2Sa11; Tamar:2:2Sa13
Absalom:4:2Sa14; Esther:5:Est2; Vashti:3:Est1; Job's daughters:1:Job42; Abishag:1:1Ki1; Moses:2:Ac7; Saul:2:1Sa9; Adonijah:0:1Ki1

@princesses|Women|Name a princess (king's daughter) in the Bible
Michal:5:1Sa18; Pharaoh's daughter:5:Ex2; Tamar:3:2Sa13; Merab:2:1Sa18; Jehosheba|Jehoshabeath:1:2Ki11; Athaliah:1:2Ki8
Jezebel:2:1Ki16; Bernice:1:Ac25; Drusilla:1:Ac24; Basemath:0:1Ki4; Taphath:0:1Ki4

@blessings|People|Name someone in the Bible who gave a famous blessing
Isaac:5:Ge27; Jacob:5:Ge49; Moses:4:Dt33; Melchizedek:3:Ge14; Aaron:4:Nu6; Simeon:3:Lk2; Jesus:4:Mk10; Balaam:3:Nu24
Naomi:2:Ru1; Eli:2:1Sa1; Boaz:2:Ru2; David:1:2Sa6; Solomon:1:1Ki8; Joshua:1:Jos14

@vows|People|Name someone in the Bible known for making a vow or oath
Jephthah:5:Jdg11; Hannah:5:1Sa1; Jacob:3:Ge28; Paul:2:Ac18; Samson:2:Jdg13; Ruth:3:Ru1; Herod:3:Mk6; Absalom:1:2Sa15
Abraham:2:Ge24; Joshua:2:Jos9; David:2:1Sa20; Jonathan:2:1Sa20; Saul:2:1Sa14; Peter:2:Mt26

@firsts|People|Name a famous "first" in the Bible (a person)
Adam|First man:5:Ge2; Eve|First woman:5:Ge2; Cain|First murderer|First son:4:Ge4; Abel|First to die:4:Ge4; Saul|First king:4:1Sa10
Stephen|First martyr:4:Ac7; Aaron|First high priest:3:Ex28; Othniel|First judge:2:Jdg3; Lydia|First convert in Europe:2:Ac16
Cornelius|First Gentile convert:2:Ac10; Nimrod|First mighty warrior:1:Ge10; Jubal:1:Ge4; Tubal-cain:1:Ge4; Noah|First vineyard:1:Ge9
James|First apostle martyred:2:Ac12

@burials|People|Name someone whose burial is described in the Bible
Jesus:5:Mt27; Sarah:3:Ge23; Abraham:3:Ge25; Jacob|Israel:3:Ge50; Joseph:3:Jos24; Moses:4:Dt34; Rachel:3:Ge35; Lazarus:4:Jn11
Stephen:2:Ac8; Saul:2:1Sa31; Absalom:2:2Sa18; John the Baptist:2:Mk6; Samuel:2:1Sa25; Aaron:1:Nu20; Miriam:1:Nu20
Isaac:1:Ge35; David:2:1Ki2; Ananias:1:Ac5; Sapphira:1:Ac5; Joshua:1:Jos24; Deborah:0:Ge35

@k-names|People|Name a Bible character whose name begins with K
Korah:4:Nu16; Kish:3:1Sa9; Keturah:3:Ge25; Kohath:2:Ex6; Kenan|Cainan:1:Ge5; Keziah|Kezia:1:Job42; Kedar:1:Ge25
Kemuel:0:Ge22; Kenaniah:0:1Ch15; Kilion|Chilion:1:Ru1; Kileab|Chileab:0:2Sa3

@u-names|People|Name a Bible character whose name begins with U
Uriah:5:2Sa11; Uzziah:5:2Ch26; Uzzah:4:2Sa6; Uzziel:1:Ex6; Uri:1:Ex31; Urbanus|Urbane:0:Ro16; Uz:1:Ge10; Ulla:0:1Ch7

@ab-names|People|Name a Bible character whose name begins with "Ab"
Abraham|Abram:5:Ge12; Abel:5:Ge4; Abigail:4:1Sa25; Absalom:4:2Sa13; Abner:3:1Sa14; Abishai:2:1Sa26; Abimelech:2:Ge20
Abiathar:1:1Sa22; Abijah|Abijam:1:1Ki14; Abihu:2:Ex6; Abednego:4:Da1; Abiram:1:Nu16; Abishag:1:1Ki1; Abital:0:2Sa3
Abinadab:1:1Sa16; Abdon:0:Jdg12; Abiel:0:1Sa9; Abihail:0:Est2

@jo-names|People|Name a Bible character whose name begins with "Jo"
Joseph:5:Ge37; John:5:Jn1; Joshua:5:Jos1; Jonah:5:Jon1; Job:5:Job1; Jonathan:4:1Sa14; Joel:3:Joel1; Joab:3:2Sa2
Josiah:3:2Ki22; Joash|Jehoash:2:2Ki11; Jochebed:2:Ex6; Joanna:2:Lk8; Jotham:1:Jdg9; Joram:1:2Ki8; Joses:0:Mk6
Jonadab|Jehonadab:0:2Sa13; Joktan:0:Ge10; Jokshan:0:Ge25

@eli-names|People|Name a Bible character whose name begins with "Eli"
Elijah:5:1Ki17; Elisha:5:1Ki19; Elizabeth|Elisabeth:5:Lk1; Eli:4:1Sa1; Eliab:2:1Sa16; Eliezer:2:Ge15; Eliphaz:2:Job2
Elihu:2:Job32; Elimelech:2:Ru1; Eliakim:1:2Ki18; Eliada:0:2Sa5; Elishama:0:Nu1; Eliashib:0:Ne3; Eliphelet:0:2Sa5; Elishua:0:2Sa5

@ze-names|People|Name a Bible character whose name begins with "Ze"
Zechariah|Zacharias:5:Lk1; Zedekiah:4:2Ki24; Zebedee:4:Mt4; Zebulun:3:Ge30; Zephaniah:3:Zep1; Zerubbabel:3:Ezr3; Zeresh:1:Est5
Zerah:1:Ge38; Zenas:0:Tit3; Zeruiah:1:2Sa2; Zeeb:0:Jdg7; Zebah:0:Jdg8; Zelophehad:0:Nu27

@ah-names|People|Name a Bible character whose name ends in "-ah" (not "-iah")
Noah:5:Ge6; Sarah:5:Ge17; Leah:5:Ge29; Hannah:5:1Sa1; Jonah:5:Jon1; Judah:4:Ge29; Deborah:4:Jdg4; Rebekah:4:Ge24
Delilah:4:Jdg16; Micah:3:Mic1; Orpah:3:Ru1; Huldah:2:2Ki22; Zipporah:3:Ex2; Bilhah:2:Ge30; Zilpah:2:Ge30
Methuselah:4:Ge5; Keturah:2:Ge25; Terah:2:Ge11; Joah:0:2Ki18; Shiphrah:1:Ex1; Puah:1:Ex1; Elkanah:2:1Sa1; Peninnah:1:1Sa1
Shelah:0:Ge38; Noadiah:0:Ne6; Mahlah:0:Nu27; Milcah:0:Ge11; Adah:0:Ge4; Zillah:0:Ge4; Naamah:0:Ge4

@us-names|People|Name a Bible character whose name ends in "-us"
Lazarus:5:Jn11; Zacchaeus:5:Lk19; Bartimaeus:4:Mk10; Nicodemus:4:Jn3; Cornelius:4:Ac10; Eutychus:3:Ac20; Onesimus:3:Phm1
Festus:2:Ac25; Theophilus:2:Lk1; Augustus|Caesar Augustus:2:Lk2; Thaddaeus:2:Mt10; Tychicus:1:Eph6; Trophimus:1:Ac20; Gaius:1:Ac19
Publius:1:Ac28; Julius:1:Ac27; Claudius:1:Ac11; Tiberius:1:Lk3; Silvanus:1:2Co1; Sergius Paulus:1:Ac13; Dionysius:1:Ac17
Demetrius:1:Ac19; Erastus:1:Ac19; Philetus:0:2Ti2; Hymenaeus:0:1Ti1; Alphaeus:1:Mt10; Timotheus:1:Ac16; Agabus:1:Ac11
Aeneas:1:Ac9; Quirinius:0:Lk2; Crispus:0:Ac18; Quartus:0:Ro16; Fortunatus:0:1Co16; Achaicus:0:1Co16
`)
