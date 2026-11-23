// General people prompts. Format: see bank() in define.ts. Refs are chapter-level.
import { bank } from './define'

export const peopleBank = bank(`
@apostles|People|Name one of Jesus' twelve apostles
Peter|Simon Peter|Cephas:5:Mt10; Andrew:4:Mt10; James|James son of Zebedee:4:Mt10; John|John son of Zebedee:5:Mt10
Philip:3:Mt10; Bartholomew|Nathanael:2:Mt10; Thomas|Didymus|Doubting Thomas:4:Mt10; Matthew|Levi:4:Mt10
James son of Alphaeus|James the Less:1:Mt10; Thaddaeus|Jude|Judas son of James|Lebbaeus:1:Mt10
Simon the Zealot|Simon the Canaanite|Zealot:1:Mt10; Judas Iscariot|Judas|Iscariot:4:Mt10; Matthias:1:Ac1

@abraham-family|People|Name a member of Abraham's family
Abraham|Abram:5:Ge12; Sarah|Sarai:5:Ge17; Isaac:5:Ge21; Ishmael:4:Ge16; Hagar:4:Ge16; Lot:4:Ge12; Terah:2:Ge11
Rebekah|Rebecca:3:Ge24; Nahor:1:Ge11; Haran:1:Ge11; Keturah:1:Ge25; Milcah:0:Ge11; Jacob:3:Ge25; Esau:3:Ge25

@joseph-story|People|Name a person in the story of Joseph, son of Jacob
Joseph:5:Ge37; Jacob|Israel:5:Ge37; Reuben:3:Ge37; Judah:3:Ge37; Benjamin:4:Ge42; Simeon:2:Ge42; Potiphar:4:Ge39
Pharaoh:4:Ge41; Asenath:1:Ge41; Manasseh:2:Ge41; Ephraim:2:Ge41; Levi:1:Ge46; Dan:0:Ge46; Naphtali:0:Ge46
Gad:0:Ge46; Asher:0:Ge46; Issachar:0:Ge46; Zebulun:0:Ge46; Tamar:1:Ge38

@moses-family|People|Name a member of Moses' family
Moses:5:Ex2; Aaron:5:Ex4; Miriam:4:Ex15; Zipporah:3:Ex2; Jethro|Reuel:3:Ex18; Gershom:1:Ex2; Eliezer:0:Ex18
Amram:1:Ex6; Jochebed:2:Ex6; Nadab:1:Ex6; Abihu:1:Ex6; Eleazar:1:Ex6

@exodus-people|People|Name a person in the book of Exodus
Moses:5:Ex2; Aaron:5:Ex4; Miriam:4:Ex15; Pharaoh:5:Ex1; Joshua:3:Ex17; Jethro|Reuel:3:Ex18; Zipporah:3:Ex2
Hur:1:Ex17; Bezalel|Bezaleel:1:Ex31; Oholiab|Aholiab:0:Ex31; Shiphrah:1:Ex1; Puah:0:Ex1; Jochebed:1:Ex6
Gershom:1:Ex2; Nadab:1:Ex24; Abihu:1:Ex24

@david-life|People|Name a person in the life of King David
Saul:5:1Sa16; Jonathan:5:1Sa18; Goliath:5:1Sa17; Bathsheba:5:2Sa11; Uriah:4:2Sa11; Nathan:4:2Sa12
Samuel:4:1Sa16; Absalom:4:2Sa15; Solomon:4:2Sa12; Michal:3:1Sa18; Abigail:3:1Sa25; Joab:3:2Sa2; Jesse:3:1Sa16
Abner:2:2Sa3; Amnon:2:2Sa13; Tamar:2:2Sa13; Mephibosheth:2:2Sa9; Nabal:2:1Sa25; Adonijah:2:1Ki1
Abishai:1:1Sa26; Ahithophel:1:2Sa15; Hushai:1:2Sa15; Eliab:1:1Sa16; Achish:1:1Sa21; Ahimelech:1:1Sa21
Abiathar:1:1Sa22; Shimei:1:2Sa16; Zadok:1:2Sa8; Barzillai:0:2Sa19; Ish-bosheth|Ishbosheth:1:2Sa2; Hiram:1:2Sa5

@saul-life|People|Name a person in the life of King Saul
Samuel:5:1Sa9; David:5:1Sa16; Jonathan:5:1Sa14; Goliath:3:1Sa17; Michal:3:1Sa18; Kish:1:1Sa9; Abner:2:1Sa14
Agag:1:1Sa15; Witch of Endor|Medium of Endor|Witch:2:1Sa28; Doeg:1:1Sa22; Ahimelech:1:1Sa22; Merab:1:1Sa18
Ish-bosheth|Ishbosheth:1:2Sa2; Ahinoam:0:1Sa14; Rizpah:0:2Sa21; Mephibosheth:1:2Sa4

@elijah-elisha|People|Name a person in the stories of Elijah and Elisha
Elijah:5:1Ki17; Elisha:5:1Ki19; Ahab:4:1Ki18; Jezebel:5:1Ki19; Naaman:3:2Ki5; Gehazi:2:2Ki4; Obadiah:1:1Ki18
Jehu:2:2Ki9; Naboth:2:1Ki21; Ahaziah:1:2Ki1; Hazael:1:2Ki8; Ben-Hadad|Benhadad:1:2Ki6; Jehoshaphat:1:2Ki3
Joram|Jehoram:1:2Ki3; Widow of Zarephath:2:1Ki17; Shunammite woman|Shunammite:1:2Ki4

@daniel-book|People|Name a person in the book of Daniel
Daniel|Belteshazzar:5:Da1; Shadrach|Hananiah:4:Da1; Meshach|Mishael:4:Da1; Abednego|Azariah:4:Da1
Nebuchadnezzar:5:Da1; Belshazzar:3:Da5; Darius:3:Da6; Cyrus:1:Da1; Gabriel:2:Da8; Michael:2:Da10
Ashpenaz:0:Da1; Arioch:0:Da2

@esther-book|People|Name a person in the book of Esther
Esther|Hadassah:5:Est2; Mordecai:5:Est2; Haman:5:Est3; Xerxes|Ahasuerus:4:Est1; Vashti:3:Est1; Zeresh:1:Est5
Hegai:0:Est2; Hathach:0:Est4; Bigthan|Bigthana:0:Est2; Teresh:0:Est2; Harbona|Harbonah:0:Est7

@ruth-book|People|Name a person in the book of Ruth
Ruth:5:Ru1; Naomi:5:Ru1; Boaz:5:Ru2; Orpah:3:Ru1; Elimelech:2:Ru1; Mahlon:1:Ru1; Chilion|Kilion:1:Ru1
Obed:2:Ru4; Jesse:1:Ru4; David:1:Ru4

@job-book|People|Name a person in the book of Job
Job:5:Job1; Satan:4:Job1; Eliphaz:3:Job2; Bildad:3:Job2; Zophar:3:Job2; Elihu:2:Job32; Jemimah:1:Job42
Keziah|Kezia:0:Job42; Keren-happuch|Kerenhappuch:0:Job42

@paul-team|People|Name a companion or co-worker of the apostle Paul
Barnabas:5:Ac13; Silas|Silvanus:5:Ac15; Timothy|Timotheus:5:Ac16; Luke:4:Col4; Titus:4:Gal2; Mark|John Mark:3:Ac12
Priscilla|Prisca:3:Ac18; Aquila:3:Ac18; Apollos:3:Ac18; Onesimus:2:Phm1; Philemon:2:Phm1; Lydia:2:Ac16
Phoebe|Phebe:2:Ro16; Epaphras:1:Col1; Epaphroditus:1:Php2; Tychicus:1:Eph6; Aristarchus:1:Ac19; Demas:1:Col4
Erastus:0:Ac19; Trophimus:0:Ac20; Sosthenes:0:1Co1; Gaius:0:Ac19; Onesiphorus:0:2Ti1; Archippus:0:Col4
Junia:0:Ro16; Andronicus:0:Ro16; Tertius:0:Ro16

@jesus-family|People|Name a member or relative of Jesus' earthly family
Mary:5:Lk1; Joseph:5:Mt1; James:3:Mt13; Jude|Judas:1:Mt13; Joses:0:Mk6; Simon:0:Mt13; Elizabeth|Elisabeth:3:Lk1
John the Baptist|John:3:Lk1; Zechariah|Zacharias:1:Lk1

@christmas-people|People|Name a person (or group) in the Christmas story
Mary:5:Lk2; Joseph:5:Mt1; Jesus:5:Lk2; Gabriel:4:Lk1; Herod:4:Mt2; Shepherds:4:Lk2; Wise men|Magi|Three kings:4:Mt2
Elizabeth|Elisabeth:2:Lk1; Zechariah|Zacharias:2:Lk1; Simeon:2:Lk2; Anna:2:Lk2; Caesar Augustus|Augustus|Caesar:2:Lk2
Quirinius|Cyrenius:0:Lk2; John the Baptist:1:Lk1; Angels:3:Lk2

@crucifixion-people|People|Name a person involved in Jesus' arrest, trial or crucifixion
Pilate|Pontius Pilate:5:Mt27; Judas|Judas Iscariot:5:Mt26; Barabbas:4:Mt27; Caiaphas:3:Mt26; Peter:3:Mt26; Herod:2:Lk23
Annas:1:Jn18; Malchus:1:Jn18; Simon of Cyrene:3:Mk15; Mary Magdalene:3:Jn19; Mary:3:Jn19; John:2:Jn19
Joseph of Arimathea:3:Mt27; Nicodemus:2:Jn19; Centurion:2:Mk15; Mary of Clopas|Mary wife of Clopas:0:Jn19; Salome:1:Mk15
Thief|Two thieves|Criminals|Robbers:3:Lk23

@risen-witnesses|People|Name someone who saw Jesus after he rose from the dead
Mary Magdalene:5:Jn20; Peter|Cephas:4:Lk24; Thomas:4:Jn20; John:3:Jn21; Cleopas:2:Lk24; Paul|Saul:3:1Co15
James:1:1Co15; Nathanael:1:Jn21; The other Mary|Mary mother of James:2:Mt28; Stephen:1:Ac7; Andrew:1:Ac1
Matthew:1:Mt28

@raised-dead|People|Name someone who was raised from the dead in the Bible
Lazarus:5:Jn11; Jesus:5:Mt28; Jairus's daughter|Jairus daughter|Jairus:3:Mk5; Widow of Nain's son|Widow's son|Son of the widow of Nain:2:Lk7
Tabitha|Dorcas:3:Ac9; Eutychus:2:Ac20; Son of the widow of Zarephath|Zarephath widow's son:1:1Ki17
Shunammite's son|Shunammite son:1:2Ki4; Man in Elisha's grave|Man thrown in Elisha's tomb:0:2Ki13

@mothers|Women|Name a mother in the Bible
Mary:5:Lk2; Eve:4:Ge4; Sarah:5:Ge21; Hannah:4:1Sa1; Rebekah:3:Ge25; Rachel:3:Ge30; Elizabeth|Elisabeth:3:Lk1
Leah:2:Ge29; Jochebed:2:Ex6; Naomi:2:Ru1; Ruth:2:Ru4; Bathsheba:2:2Sa12; Hagar:2:Ge16; Eunice:1:2Ti1
Zipporah:1:Ex2; Tamar:0:Ge38; Rizpah:0:2Sa21; Lois:1:2Ti1

@shepherds|Roles|Name someone in the Bible who looked after sheep or flocks
David:5:1Sa16; Abel:4:Ge4; Moses:4:Ex3; Jacob:3:Ge30; Rachel:2:Ge29; Amos:2:Am1; Joseph:1:Ge37
Zipporah:1:Ex2; Lot:1:Ge13; Abraham|Abram:1:Ge13; Shepherds at Bethlehem|Bethlehem shepherds:2:Lk2

@good-kings|People|Name a king of Judah who "did what was right in the eyes of the Lord"
Josiah:4:2Ki22; Hezekiah:4:2Ki18; Asa:2:1Ki15; Jehoshaphat:3:1Ki22; Uzziah|Azariah:2:2Ki15; Jotham:1:2Ki15
Joash|Jehoash:2:2Ki12; Amaziah:1:2Ki14; David:3:1Ki15

@wicked-rulers|People|Name a wicked king or ruler in the Bible
Pharaoh:5:Ex1; Ahab:5:1Ki16; Herod:5:Mt2; Jezebel:4:1Ki21; Nebuchadnezzar:3:Da3; Manasseh:2:2Ki21; Jeroboam:2:1Ki12
Athaliah:1:2Ki11; Ahaz:1:2Ki16; Rehoboam:1:1Ki12; Amon:0:2Ki21; Omri:1:1Ki16; Jehoiakim:1:2Ki23
Belshazzar:2:Da5; Abimelech:1:Jdg9; Eglon:1:Jdg3; Agag:1:1Sa15; Sennacherib:1:2Ki18

@queens|Women|Name a queen in the Bible
Esther:5:Est2; Vashti:4:Est1; Jezebel:4:1Ki16; Queen of Sheba|Sheba:4:1Ki10; Athaliah:2:2Ki11
Candace:1:Ac8; Michal:1:2Sa6; Bathsheba:2:1Ki2; Maacah|Maachah:0:1Ki15; Abigail:1:2Sa2

@authors|People|Name someone traditionally credited with writing part of the Bible
Moses:5:Dt31; Paul:5:Ro1; John:5:Jn21; David:4:Ps3; Solomon:4:Pr1; Peter:4:1Pe1; Luke:4:Lk1; Matthew:4:Mt9
Mark:4:Mk1; James:3:Jas1; Jude:2:Jude1; Isaiah:3:Isa1; Jeremiah:3:Jer1; Ezekiel:2:Eze1; Daniel:2:Da7
Ezra:2:Ezr7; Nehemiah:2:Ne1; Samuel:2:1Sa10; Asaph:1:Ps50; Agur:0:Pr30; Lemuel:0:Pr31; Hosea:1:Hos1
Joel:1:Joel1; Amos:1:Am1; Obadiah:1:Ob1; Jonah:1:Jon1; Micah:1:Mic1; Nahum:1:Na1; Habakkuk:1:Hab1
Zephaniah:1:Zep1; Haggai:1:Hag1; Zechariah:1:Zec1; Malachi:1:Mal1; Joshua:1:Jos24

@giants|People|Name a giant (or giant people) in the Bible
Goliath:5:1Sa17; Og:3:Dt3; Anak|Anakim|Sons of Anak|Anakites:2:Nu13; Nephilim:3:Ge6; Rephaim:1:Dt2
Ishbi-benob|Ishbibenob:0:2Sa21; Saph|Sippai:0:2Sa21; Lahmi:0:1Ch20; Emim|Emites:0:Dt2; Zamzummim:0:Dt2

@fled|People|Name someone in the Bible who ran away or fled
Jonah:5:Jon1; Hagar:3:Ge16; Jacob:3:Ge27; Moses:4:Ex2; Elijah:4:1Ki19; David:3:1Sa19; Absalom:2:2Sa13
Onesimus:2:Phm1; Mark|John Mark:1:Mk14; Adonijah:1:1Ki1; Jeroboam:1:1Ki11; Joseph:2:Mt2; Lot:2:Ge19

@nt-leaders|People|Name a Pharisee, priest or Jewish leader in the New Testament
Nicodemus:4:Jn3; Gamaliel:3:Ac5; Paul|Saul:4:Php3; Caiaphas:4:Mt26; Annas:3:Jn18; Simon the Pharisee:1:Lk7
Jairus:2:Mk5; Joseph of Arimathea:2:Mk15; Crispus:0:Ac18; Sosthenes:0:Ac18; Ananias:1:Ac23; Zechariah|Zacharias:2:Lk1

@romans|People|Name a Roman ruler, official or soldier in the Bible
Pilate|Pontius Pilate:5:Mt27; Cornelius:4:Ac10; Caesar Augustus|Augustus:3:Lk2; Caesar:3:Mt22; Tiberius:2:Lk3
Claudius:2:Ac11; Felix:2:Ac24; Festus:2:Ac25; Gallio:1:Ac18; Julius:1:Ac27; Claudius Lysias|Lysias:1:Ac23
Sergius Paulus:1:Ac13; Quirinius|Cyrenius:1:Lk2; Publius:0:Ac28

@renamed|People|Name a Bible person who was given a new name
Abraham|Abram:5:Ge17; Sarah|Sarai:5:Ge17; Jacob|Israel:5:Ge32; Peter|Simon|Cephas:5:Jn1; Paul|Saul:4:Ac13
Daniel|Belteshazzar:3:Da1; Shadrach:2:Da1; Meshach:2:Da1; Abednego:2:Da1; Joseph|Zaphenath-paneah|Zaphnathpaaneah:1:Ge41
Joshua|Hoshea|Oshea:1:Nu13; Gideon|Jerubbaal:1:Jdg6; Naomi|Mara:1:Ru1; Esther|Hadassah:1:Est2; Solomon|Jedidiah:0:2Sa12
Barnabas:1:Ac4; James and John|Boanerges|Sons of Thunder:1:Mk3

@altar-builders|People|Name someone in the Bible who built an altar
Noah:4:Ge8; Abraham|Abram:5:Ge12; Isaac:2:Ge26; Jacob:3:Ge35; Moses:3:Ex17; Gideon:2:Jdg6; David:3:2Sa24
Elijah:4:1Ki18; Joshua:2:Jos8; Samuel:1:1Sa7; Saul:1:1Sa14; Aaron:2:Ex32; Solomon:2:1Ki8

@protectors|People|Name someone who hid or protected others from danger
Rahab:5:Jos2; Jochebed:3:Ex2; Michal:2:1Sa19; Obadiah:1:1Ki18; Jehosheba|Jehoshabeath:0:2Ki11; Jonathan:2:1Sa20
Joseph:3:Mt2; Shiphrah:1:Ex1; Puah:0:Ex1; Pharaoh's daughter:2:Ex2

@book-names|People|Name a Bible person who has a book named after them
Joshua:4:Jos1; Ruth:5:Ru1; Samuel:4:1Sa1; Esther:5:Est1; Job:5:Job1; Ezra:3:Ezr1; Nehemiah:3:Ne1; Isaiah:4:Isa1
Jeremiah:4:Jer1; Ezekiel:3:Eze1; Daniel:5:Da1; Hosea:2:Hos1; Joel:2:Joel1; Amos:2:Am1; Obadiah:1:Ob1; Jonah:4:Jon1
Micah:2:Mic1; Nahum:1:Na1; Habakkuk:1:Hab1; Zephaniah:1:Zep1; Haggai:1:Hag1; Zechariah:1:Zec1; Malachi:2:Mal1
Matthew:4:Mt1; Mark:4:Mk1; Luke:4:Lk1; John:5:Jn1; Timothy:3:1Ti1; Titus:2:Tit1; Philemon:2:Phm1; James:3:Jas1
Peter:4:1Pe1; Jude:2:Jude1

@blind|People|Name someone in the Bible who was blind or blinded
Bartimaeus:4:Mk10; Samson:4:Jdg16; Paul|Saul:4:Ac9; Isaac:3:Ge27; Eli:1:1Sa4; Elymas|Bar-Jesus:1:Ac13
Zedekiah:1:2Ki25; Ahijah:0:1Ki14; Man born blind:3:Jn9

@servants|Roles|Name a servant or slave mentioned by name in the Bible
Hagar:4:Ge16; Eliezer:2:Ge15; Onesimus:3:Phm1; Gehazi:3:2Ki4; Rhoda:2:Ac12; Malchus:2:Jn18; Bilhah:1:Ge30
Zilpah:1:Ge30; Ziba:1:2Sa9; Joseph:3:Ge39; Deborah:0:Ge35

@david-sons|People|Name a son of King David
Solomon:5:2Sa12; Absalom:5:2Sa3; Amnon:3:2Sa3; Adonijah:3:2Sa3; Nathan:2:2Sa5; Chileab|Daniel:0:2Sa3
Shephatiah:0:2Sa3; Ithream:0:2Sa3; Shammua|Shimea:0:2Sa5; Shobab:0:2Sa5; Ibhar:0:2Sa5; Elishua:0:2Sa5
Nepheg:0:2Sa5; Japhia:0:2Sa5; Elishama:0:2Sa5; Eliada:0:2Sa5; Eliphelet:0:2Sa5

@david-wives|Women|Name a wife of King David
Bathsheba:5:2Sa11; Michal:4:1Sa18; Abigail:3:1Sa25; Ahinoam:1:1Sa25; Maacah|Maachah:0:2Sa3; Haggith:0:2Sa3
Abital:0:2Sa3; Eglah:0:2Sa3

@wept|People|Name someone in the Bible who is described as weeping
Jesus:5:Jn11; Peter:4:Mt26; Hannah:3:1Sa1; Joseph:3:Ge45; David:3:2Sa18; Mary Magdalene:3:Jn20; Jeremiah:3:Jer9
Esau:2:Ge27; Jacob:2:Ge29; Nehemiah:2:Ne1; Hezekiah:2:2Ki20; Rachel:1:Jer31; Ezra:1:Ezr10; Naomi:1:Ru1
Orpah:1:Ru1; Ruth:1:Ru1; John:1:Rev5; Paul:1:Ac20

@musicians|People|Name a musician or singer in the Bible
David:5:1Sa16; Miriam:3:Ex15; Asaph:2:1Ch16; Jubal:2:Ge4; Heman:1:1Ch15; Jeduthun:1:1Ch16; Deborah:2:Jdg5
Moses:2:Ex15; Chenaniah|Kenaniah:0:1Ch15; Paul:2:Ac16; Silas:2:Ac16; Hannah:1:1Sa2; Solomon:1:1Ki4; Ethan:0:1Ch15

@doubters|People|Name someone in the Bible who doubted or questioned God
Thomas:5:Jn20; Sarah:3:Ge18; Gideon:4:Jdg6; Zechariah|Zacharias:3:Lk1; Moses:3:Ex4; Jonah:2:Jon4; Job:2:Job3
Habakkuk:1:Hab1; Abraham:2:Ge17; Peter:2:Mt14; Jeremiah:1:Jer20; Elijah:1:1Ki19

@stoned|People|Name someone in the Bible who was stoned (or nearly stoned)
Stephen:5:Ac7; Paul:4:Ac14; Achan:2:Jos7; Naboth:2:1Ki21; Zechariah son of Jehoiada|Zechariah:1:2Ch24
Adoniram|Adoram:0:1Ki12; Jesus:2:Jn8; Woman caught in adultery:2:Jn8; David:1:1Sa30; Moses:1:Ex17

@killed|People|Name someone who was killed in the Bible
Abel:5:Ge4; John the Baptist:5:Mt14; Goliath:5:1Sa17; Stephen:4:Ac7; Uriah:4:2Sa11; Jesus:4:Mt27; Haman:3:Est7
Sisera:3:Jdg4; James:3:Ac12; Absalom:3:2Sa18; Jezebel:3:2Ki9; Naboth:2:1Ki21; Amnon:2:2Sa13; Abner:2:2Sa3
Eglon:2:Jdg3; Ish-bosheth|Ishbosheth:1:2Sa4; Agag:1:1Sa15; Ahab:2:1Ki22; Saul:3:1Sa31; Samson:3:Jdg16

@builders|People|Name someone in the Bible who built something important
Noah:5:Ge6; Solomon:5:1Ki6; Nehemiah:4:Ne2; Zerubbabel:2:Ezr3; Bezalel|Bezaleel:2:Ex31; Nimrod:1:Ge10; Cain:1:Ge4
Hiram|Huram:2:1Ki7; Moses:3:Ex40; David:2:2Sa5; Jeroboam:1:1Ki12; Herod:1:Jn2

@mountain-meetings|People|Name someone who met with God on a mountain
Moses:5:Ex19; Elijah:4:1Ki19; Abraham:3:Ge22; Peter:3:Mt17; James:2:Mt17; John:2:Mt17; Aaron:2:Ex24; Jesus:4:Mt17
Nadab:0:Ex24; Abihu:0:Ex24; Joshua:1:Ex24

@in-egypt|People|Name someone in the Bible who lived in or went down to Egypt
Joseph:5:Ge39; Moses:5:Ex2; Jacob|Israel:4:Ge46; Abraham|Abram:3:Ge12; Sarah|Sarai:2:Ge12; Aaron:4:Ex4
Mary:3:Mt2; Jesus:3:Mt2; Jeremiah:2:Jer43; Jeroboam:1:1Ki11; Hagar:2:Ge16; Miriam:2:Ex15; Benjamin:2:Ge43

@righteous|People|Name someone the Bible describes as righteous or blameless
Noah:5:Ge6; Job:5:Job1; Abel:3:Heb11; Zechariah|Zacharias:2:Lk1; Elizabeth|Elisabeth:2:Lk1; Joseph:3:Mt1
Simeon:2:Lk2; Lot:1:2Pe2; Cornelius:2:Ac10; Joseph of Arimathea:1:Lk23; Daniel:2:Eze14; Abraham:3:Ge15

@heaven-visions|People|Name someone who was given a vision of heaven or God's throne
John:5:Rev4; Isaiah:4:Isa6; Ezekiel:4:Eze1; Daniel:3:Da7; Stephen:3:Ac7; Paul:2:2Co12; Micaiah:1:1Ki22
Jacob:3:Ge28; Moses:2:Ex24

@disobeyed|People|Name someone in the Bible who disobeyed God
Adam:5:Ge3; Eve:5:Ge3; Jonah:5:Jon1; Saul:4:1Sa15; Cain:3:Ge4; Achan:2:Jos7; Lot's wife:3:Ge19; Moses:3:Nu20
Samson:3:Jdg16; Nadab:1:Lev10; Abihu:1:Lev10; Uzzah:1:2Sa6; David:3:2Sa11; Solomon:2:1Ki11; Balaam:2:Nu22
Hophni:1:1Sa2; Phinehas:1:1Sa2; Ananias:2:Ac5; Sapphira:2:Ac5; Aaron:2:Ex32

@answered-prayer|People|Name someone in the Bible whose prayer was dramatically answered
Hannah:5:1Sa1; Elijah:5:1Ki18; Hezekiah:4:2Ki20; Solomon:3:1Ki3; Jabez:3:1Ch4; Daniel:3:Da9; Nehemiah:2:Ne1
Zechariah|Zacharias:2:Lk1; Cornelius:2:Ac10; Samson:2:Jdg16; Jonah:3:Jon2; Gideon:2:Jdg6; Moses:2:Ex32; Abraham's servant|Eliezer:1:Ge24
Elisha:1:2Ki6; Isaac:1:Ge25

@songs|People|Name someone who sang or composed a song recorded in the Bible
David:5:2Sa22; Moses:4:Ex15; Miriam:4:Ex15; Deborah:3:Jdg5; Barak:1:Jdg5; Hannah:3:1Sa2; Mary:4:Lk1
Zechariah|Zacharias:2:Lk1; Simeon:2:Lk2; Paul:2:Ac16; Silas:2:Ac16; Solomon:2:Song1; Asaph:1:Ps73; Habakkuk:1:Hab3

@fear-not|People|Name someone who was told "Do not be afraid" by God or an angel
Mary:5:Lk1; Joseph:4:Mt1; Zechariah|Zacharias:3:Lk1; Shepherds:4:Lk2; Abraham|Abram:2:Ge15; Hagar:2:Ge21
Isaac:1:Ge26; Joshua:3:Jos1; Gideon:2:Jdg6; Daniel:2:Da10; Paul:2:Ac27; John:2:Rev1; Women at the tomb|Mary Magdalene:3:Mt28
Jacob:1:Ge46; Elijah:1:2Ki1; Peter:2:Lk5

@well-meetings|People|Name someone who had an important meeting at a well
Jesus:5:Jn4; Samaritan woman|Woman at the well:5:Jn4; Rebekah:4:Ge24; Jacob:4:Ge29; Rachel:4:Ge29; Moses:3:Ex2
Zipporah:2:Ex2; Hagar:2:Ge16; Abraham's servant|Eliezer:2:Ge24; Isaac:1:Ge26

@hair|People|Name someone in the Bible known for a story about their hair
Samson:5:Jdg16; Absalom:4:2Sa14; Elisha:3:2Ki2; Esau:3:Ge27; Nebuchadnezzar:2:Da4; Paul:1:Ac18
Mary of Bethany|Mary:3:Jn12; Job:1:Job1; John the Baptist:1:Mt3

@old-age|People|Name someone in the Bible who did something remarkable at an old age
Abraham:5:Ge21; Sarah:5:Ge21; Moses:4:Dt34; Methuselah:4:Ge5; Noah:4:Ge7; Caleb:3:Jos14; Simeon:3:Lk2
Anna:3:Lk2; Elizabeth|Elisabeth:3:Lk1; Zechariah|Zacharias:2:Lk1; Joshua:1:Jos24; Eli:1:1Sa4; Barzillai:0:2Sa19

@villains|People|Name a villain in a Bible story
Pharaoh:5:Ex5; Goliath:5:1Sa17; Haman:5:Est3; Jezebel:5:1Ki21; Herod:5:Mt2; Judas:5:Mt26; Delilah:4:Jdg16
Satan|Devil|Serpent:5:Ge3; Cain:4:Ge4; Ahab:3:1Ki21; Absalom:2:2Sa15; Sisera:2:Jdg4; Balaam:2:Nu22
Herodias:2:Mk6; Korah:1:Nu16; Sanballat:1:Ne4; Tobiah:1:Ne4; Nebuchadnezzar:2:Da3; Pilate:2:Mt27

@angel-visits|People|Name someone who was visited by an angel
Mary:5:Lk1; Joseph:4:Mt1; Zechariah|Zacharias:4:Lk1; Gideon:4:Jdg6; Abraham:3:Ge18; Hagar:3:Ge16; Lot:3:Ge19
Jacob:3:Ge32; Daniel:3:Da9; Balaam:3:Nu22; Peter:3:Ac12; Cornelius:3:Ac10; Elijah:2:1Ki19; Philip:2:Ac8
Paul:2:Ac27; Manoah:2:Jdg13; Joshua:1:Jos5; Shepherds:4:Lk2; John:2:Rev1; Women at the tomb|Mary Magdalene:3:Mt28

@children|People|Name a child or baby who appears in a Bible story
Moses:5:Ex2; Jesus:5:Lk2; Samuel:4:1Sa3; Isaac:3:Ge22; John the Baptist:3:Lk1; David:3:1Sa17; Joash:1:2Ki11
Ishmael:2:Ge21; Obed:1:Ru4; Josiah:1:2Ki22; Jairus's daughter|Jairus daughter:2:Mk5; Timothy:1:2Ti3
Naaman's servant girl|Servant girl:1:2Ki5; Boy with loaves and fish|Boy with five loaves:2:Jn6; Benjamin:1:Ge35

@anointed|People|Name someone in the Bible who was anointed
David:5:1Sa16; Saul:4:1Sa10; Jesus:4:Lk4; Solomon:3:1Ki1; Aaron:3:Lev8; Jehu:2:2Ki9; Elisha:2:1Ki19
Cyrus:1:Isa45; Joash:1:2Ki11; Hazael:0:1Ki19

@slept|People|Name someone who fell asleep at an important moment in the Bible
Jonah:4:Jon1; Jesus:4:Mk4; Eutychus:4:Ac20; Adam:3:Ge2; Peter:3:Mt26; James:2:Mt26; John:2:Mt26
Samson:2:Jdg16; Sisera:2:Jdg4; Saul:2:1Sa26; Elijah:2:1Ki19; Jacob:3:Ge28; Samuel:2:1Sa3; Abraham:1:Ge15

@donkeys|People|Name someone in a Bible story that involves a donkey
Balaam:5:Nu22; Jesus:5:Mt21; Saul:3:1Sa9; Samson:3:Jdg15; Abraham:2:Ge22; Abigail:1:1Sa25; Moses:1:Ex4
Good Samaritan|Samaritan:2:Lk10; Shimei:0:1Ki2; Mary:2:Lk2

@liars|People|Name someone in the Bible who lied or deceived someone
Jacob:5:Ge27; Rebekah:3:Ge27; Abraham:3:Ge12; Ananias:4:Ac5; Sapphira:4:Ac5; Gehazi:3:2Ki5; Laban:3:Ge29
Delilah:4:Jdg16; Peter:3:Mt26; Rahab:3:Jos2; Satan|Serpent:4:Ge3; Isaac:1:Ge26; Cain:3:Ge4; Michal:1:1Sa19
Jael:2:Jdg4; David:1:1Sa21; Gibeonites:1:Jos9; Joseph's brothers:2:Ge37

@jealous|People|Name someone in the Bible who was jealous or envious
Cain:5:Ge4; Saul:5:1Sa18; Joseph's brothers:4:Ge37; Rachel:3:Ge30; Leah:2:Ge30; Sarah:2:Ge16; Miriam:2:Nu12
Aaron:1:Nu12; Korah:1:Nu16; Haman:3:Est5; Esau:2:Ge27; Older brother|Prodigal's brother:2:Lk15; Jonah:1:Jon4

@wise|People|Name someone in the Bible known for great wisdom
Solomon:5:1Ki3; Daniel:4:Da1; Joseph:4:Ge41; Abigail:2:1Sa25; Ahithophel:1:2Sa16; Moses:2:Ac7; Bezalel:1:Ex31
Queen of Sheba:1:1Ki10; Wise woman of Tekoa:0:2Sa14; Ethan:0:1Ki4; Heman:0:1Ki4; Ezra:1:Ezr7; Stephen:1:Ac6

@foreigners|People|Name a foreigner (non-Israelite) who trusted the God of Israel
Ruth:5:Ru1; Rahab:5:Jos2; Naaman:4:2Ki5; Cornelius:4:Ac10; Jethro:2:Ex18; Uriah:2:2Sa11; Ittai:0:2Sa15
Ethiopian eunuch|Eunuch:3:Ac8; Centurion:3:Mt8; Widow of Zarephath:2:1Ki17; Nebuchadnezzar:2:Da4; Darius:1:Da6
Syrophoenician woman|Canaanite woman:2:Mk7; Lydia:2:Ac16; Ebed-melech:0:Jer38; Queen of Sheba:1:1Ki10

@births|People|Name someone whose birth is described in the Bible
Jesus:5:Lk2; Moses:5:Ex2; Isaac:4:Ge21; Samuel:3:1Sa1; John the Baptist:3:Lk1; Jacob:3:Ge25; Esau:3:Ge25
Samson:2:Jdg13; Benjamin:2:Ge35; Perez:1:Ge38; Zerah:1:Ge38; Cain:2:Ge4; Seth:1:Ge4; Ishmael:2:Ge16; Obed:1:Ru4
Joseph:2:Ge30; Ichabod:1:1Sa4

@marriages|People|Name someone whose marriage or wedding is described in the Bible
Adam:5:Ge2; Eve:5:Ge2; Isaac:4:Ge24; Rebekah:4:Ge24; Jacob:4:Ge29; Rachel:4:Ge29; Leah:3:Ge29; Ruth:4:Ru4
Boaz:4:Ru4; Esther:3:Est2; Samson:2:Jdg14; Moses:2:Ex2; Zipporah:2:Ex2; David:3:1Sa18; Michal:2:1Sa18
Abigail:2:1Sa25; Hosea:2:Hos1; Gomer:2:Hos1; Joseph:3:Mt1; Mary:3:Mt1

@called-young|People|Name someone God called or used when they were young
Samuel:5:1Sa3; David:5:1Sa16; Jeremiah:4:Jer1; Josiah:3:2Ki22; Joseph:3:Ge37; Daniel:3:Da1; Timothy:3:1Ti4
Mary:3:Lk1; Joash:1:2Ki11; Shadrach:1:Da1; Meshach:1:Da1; Abednego:1:Da1; Naaman's servant girl:1:2Ki5; Isaac:1:Ge22
`)
