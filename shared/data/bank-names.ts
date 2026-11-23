// Letter / spelling prompts and women prompts.
import { bank } from './define'

export const namesBank = bank(`
@b-names|People|Name a Bible character whose name begins with B
Barnabas:4:Ac4; Bartholomew:3:Mt10; Bartimaeus:3:Mk10; Boaz:4:Ru2; Bathsheba:5:2Sa11; Benjamin:5:Ge35; Balaam:3:Nu22
Barak:2:Jdg4; Belshazzar:2:Da5; Barabbas:4:Mt27; Bilhah:1:Ge30; Bezalel|Bezaleel:1:Ex31; Baruch:2:Jer36; Bildad:2:Job2
Benaiah:1:2Sa23; Balak:1:Nu22; Bernice:0:Ac25; Bethuel:0:Ge24; Boanerges:0:Mk3; Baasha:0:1Ki15; Ben-Hadad|Benhadad:1:1Ki20

@s-names|People|Name a Bible character whose name begins with S
Samuel:5:1Sa1; Solomon:5:1Ki1; Saul:5:1Sa9; Sarah|Sarai:5:Ge17; Samson:5:Jdg13; Simon:4:Mt4; Stephen:4:Ac6; Silas:4:Ac15
Seth:3:Ge4; Shem:3:Ge6; Simeon:3:Ge29; Sapphira:3:Ac5; Shadrach:4:Da3; Sisera:2:Jdg4; Salome:2:Mk15; Sennacherib:1:2Ki18
Shimei:1:2Sa16; Sanballat:1:Ne2; Shiphrah:1:Ex1; Sihon:1:Nu21; Susanna:1:Lk8; Sosthenes:0:1Co1; Shallum:0:2Ki15; Sergius Paulus:0:Ac13

@e-names|People|Name a Bible character whose name begins with E
Eve:5:Ge3; Elijah:5:1Ki17; Elisha:4:1Ki19; Esther:5:Est2; Esau:5:Ge25; Ezekiel:4:Eze1; Ezra:3:Ezr7; Eli:3:1Sa1
Elizabeth|Elisabeth:4:Lk1; Enoch:3:Ge5; Ephraim:3:Ge41; Eliezer:1:Ge15; Eliphaz:2:Job2; Elihu:1:Job32; Ehud:2:Jdg3
Eleazar:1:Nu20; Elimelech:1:Ru1; Eutychus:2:Ac20; Epaphras:1:Col1; Eunice:1:2Ti1; Elkanah:1:1Sa1; Eglon:1:Jdg3; Er:0:Ge38

@n-names|People|Name a Bible character whose name begins with N
Noah:5:Ge6; Nathan:4:2Sa12; Naomi:5:Ru1; Nehemiah:4:Ne1; Nicodemus:4:Jn3; Nebuchadnezzar:4:Da1; Naaman:3:2Ki5
Nathanael:3:Jn1; Nimrod:2:Ge10; Nabal:2:1Sa25; Naboth:2:1Ki21; Nahum:2:Na1; Naphtali:2:Ge30; Nadab:1:Lev10; Nahor:1:Ge11
Nicanor:0:Ac6; Nicolas:0:Ac6; Nun:1:Jos1; Nahshon:0:Nu1; Nympha:0:Col4; Necho|Neco:0:2Ki23

@p-names|People|Name a Bible character whose name begins with P
Peter:5:Mt4; Paul:5:Ac13; Pilate:5:Mt27; Pharaoh:4:Ex1; Philip:4:Jn1; Priscilla:3:Ac18; Potiphar:3:Ge39; Phoebe|Phebe:2:Ro16
Philemon:2:Phm1; Phinehas:2:Nu25; Perez:1:Ge38; Puah:0:Ex1; Publius:0:Ac28; Pekah:0:2Ki15; Pashhur:0:Jer20; Prochorus:0:Ac6

@r-names|People|Name a Bible character whose name begins with R
Rachel:5:Ge29; Ruth:5:Ru1; Rebekah|Rebecca:5:Ge24; Rahab:4:Jos2; Reuben:3:Ge29; Rhoda:2:Ac12; Rehoboam:2:1Ki12
Rizpah:0:2Sa21; Reuel:1:Ex2; Rufus:0:Ro16; Rabshakeh:0:2Ki18; Rezin:0:2Ki16

@h-names|People|Name a Bible character whose name begins with H
Hannah:5:1Sa1; Herod:5:Mt2; Hagar:4:Ge16; Hezekiah:4:2Ki18; Haman:4:Est3; Ham:3:Ge6; Hosea:3:Hos1; Habakkuk:2:Hab1
Haggai:2:Hag1; Hiram:1:1Ki5; Huldah:1:2Ki22; Hophni:1:1Sa2; Hur:1:Ex17; Hushai:1:2Sa15; Herodias:2:Mk6; Hazael:1:1Ki19
Hoshea:0:2Ki17; Hadassah:1:Est2; Hilkiah:0:2Ki22; Heman:0:1Ki4; Hymenaeus:0:1Ti1; Haran:0:Ge11

@d-names|People|Name a Bible character whose name begins with D
David:5:1Sa16; Daniel:5:Da1; Delilah:5:Jdg16; Deborah:4:Jdg4; Dorcas:3:Ac9; Dinah:2:Ge34; Dan:2:Ge30; Darius:3:Da6
Demas:1:Col4; Demetrius:1:Ac19; Doeg:1:1Sa21; Dathan:1:Nu16; Drusilla:0:Ac24; Dionysius:0:Ac17; Didymus:1:Jn11

@z-names|People|Name a Bible character whose name begins with Z
Zacchaeus:5:Lk19; Zechariah|Zacharias:4:Lk1; Zebedee:3:Mt4; Zipporah:3:Ex2; Zerubbabel:2:Ezr3; Zephaniah:2:Zep1
Zedekiah:2:2Ki24; Zadok:2:2Sa8; Zebulun:2:Ge30; Zilpah:1:Ge30; Zophar:2:Job2; Zimri:1:1Ki16; Zeresh:0:Est5; Zerah:0:Ge38
Ziba:0:2Sa9; Zenas:0:Tit3

@c-names|People|Name a Bible character whose name begins with C
Cain:5:Ge4; Caleb:4:Nu13; Caiaphas:4:Mt26; Cornelius:4:Ac10; Cyrus:3:Ezr1; Cleopas:2:Lk24; Claudius:1:Ac18; Crispus:0:Ac18
Chloe:0:1Co1; Candace:1:Ac8; Chilion:0:Ru1; Cush:0:Ge10; Canaan:1:Ge9; Caesar:3:Lk2; Cephas:2:Jn1

@g-names|People|Name a Bible character whose name begins with G
Gabriel:5:Lk1; Goliath:5:1Sa17; Gideon:5:Jdg6; Gehazi:2:2Ki4; Gamaliel:3:Ac5; Gad:2:Ge30; Gomer:2:Hos1; Gershom:1:Ex2
Gaius:0:3Jn1; Gallio:0:Ac18; Gog:1:Eze38; Gedaliah:0:2Ki25; Geshem:0:Ne2

@l-names|People|Name a Bible character whose name begins with L
Lazarus:5:Jn11; Lot:5:Ge12; Leah:4:Ge29; Luke:4:Col4; Levi:3:Ge29; Laban:3:Ge24; Lydia:3:Ac16; Lamech:2:Ge4
Lois:1:2Ti1; Lucifer:2:Isa14; Legion:2:Mk5; Lemuel:0:Pr31; Linus:0:2Ti4; Lysias:0:Ac23

@t-names|People|Name a Bible character whose name begins with T
Thomas:5:Jn20; Timothy:5:Ac16; Titus:4:Gal2; Tamar:3:Ge38; Tabitha:3:Ac9; Thaddaeus:2:Mt10; Terah:2:Ge11
Tychicus:1:Eph6; Tertius:0:Ro16; Theophilus:2:Lk1; Tubal-cain|Tubalcain:1:Ge4; Tobiah:1:Ne2; Trophimus:0:Ac20; Tiglath-Pileser:0:2Ki15

@i-names|People|Name a Bible character whose name begins with I
Isaac:5:Ge21; Isaiah:5:Isa1; Ishmael:4:Ge16; Israel:4:Ge32; Issachar:2:Ge30; Ichabod:2:1Sa4; Iscariot:2:Mt10
Ish-bosheth|Ishbosheth:1:2Sa2; Ira:0:2Sa20; Ittai:0:2Sa15; Igal:0:Nu13; Immanuel|Emmanuel:2:Isa7

@three-letters|People|Name a Bible person whose name has exactly three letters
Eve:5:Ge3; Lot:4:Ge12; Job:4:Job1; Ham:3:Ge6; Eli:3:1Sa1; Dan:2:Ge30; Gad:2:Ge30; Asa:2:1Ki15; Hur:1:Ex17
Ira:0:2Sa20; Nun:1:Jos1; Ner:0:1Sa14; Uri:0:Ex31; Pul:0:2Ki15; Gog:1:Eze38; Eri:0:Ge46; Ard:0:Ge46

@iah-names|People|Name a Bible person whose name ends in "-iah" or "-jah"
Isaiah:5:Isa1; Jeremiah:5:Jer1; Elijah:5:1Ki17; Hezekiah:4:2Ki18; Josiah:4:2Ki22; Nehemiah:4:Ne1; Obadiah:3:Ob1
Zechariah:3:Zec1; Zephaniah:2:Zep1; Uriah:3:2Sa11; Zedekiah:2:2Ki24; Uzziah:2:2Ch26; Azariah:2:Da1; Hananiah:2:Da1
Amaziah:1:2Ki14; Gedaliah:1:2Ki25; Hilkiah:1:2Ki22; Benaiah:1:2Sa23; Adonijah:2:1Ki1; Micaiah:1:1Ki22; Ahaziah:1:1Ki22
Abijah:1:1Ki14; Pekahiah:0:2Ki15; Jeconiah:0:Mt1; Seraiah:0:Jer51; Mattaniah:0:2Ki24; Berechiah:0:Zec1

@el-names|People|Name a Bible person (or angel) whose name ends in "-el"
Daniel:5:Da1; Samuel:5:1Sa1; Gabriel:5:Lk1; Michael:4:Jude1; Ezekiel:4:Eze1; Abel:4:Ge4; Joel:3:Joel1; Israel:4:Ge32
Ishmael:3:Ge16; Nathanael:3:Jn1; Rachel:4:Ge29; Jezebel:4:1Ki16; Immanuel|Emmanuel:3:Isa7; Bezalel:1:Ex31
Othniel:1:Jdg3; Lemuel:0:Pr31; Mishael:1:Da1; Hazael:1:1Ki19; Bethuel:0:Ge24; Shealtiel:0:Ezr3; Asahel:1:2Sa2
Methushael:0:Ge4; Mehujael:0:Ge4; Uzziel:0:Ex6; Jehiel:0:1Ch15; Kemuel:0:Ge22; Ammiel:0:Nu13; Gaddiel:0:Nu13

@women-genesis|Women|Name a woman in the book of Genesis
Eve:5:Ge3; Sarah|Sarai:5:Ge17; Hagar:4:Ge16; Rebekah|Rebecca:4:Ge24; Rachel:4:Ge29; Leah:4:Ge29; Dinah:2:Ge34
Tamar:2:Ge38; Bilhah:2:Ge30; Zilpah:2:Ge30; Lot's wife:3:Ge19; Adah:0:Ge4; Zillah:0:Ge4; Naamah:0:Ge4
Milcah:0:Ge11; Keturah:1:Ge25; Asenath:1:Ge41; Basemath|Bashemath:0:Ge26; Judith:0:Ge26; Deborah:1:Ge35
Timna:0:Ge36; Iscah:0:Ge11; Mehetabel:0:Ge36

@women-met-jesus|Women|Name a woman who met Jesus
Mary:5:Lk1; Mary Magdalene:5:Jn20; Martha:5:Lk10; Mary of Bethany:3:Jn11; Samaritan woman|Woman at the well:4:Jn4
Syrophoenician woman|Canaanite woman:2:Mk7; Woman with the issue of blood|Bleeding woman:3:Mk5; Woman caught in adultery:3:Jn8
Peter's mother-in-law:2:Mk1; Widow of Nain:1:Lk7; Joanna:1:Lk8; Susanna:1:Lk8; Salome:1:Mk16; Anna:2:Lk2
Elizabeth|Elisabeth:1:Lk1; Jairus's daughter:2:Mk5; Widow with two coins|Poor widow:2:Mk12; Crippled woman:1:Lk13
Sinful woman who anointed Jesus|Sinful woman:2:Lk7; Mary of Clopas:0:Jn19

@women-leaders|Women|Name a woman in the Bible who led, ruled, judged or prophesied
Deborah:5:Jdg4; Esther:5:Est2; Miriam:4:Ex15; Huldah:2:2Ki22; Queen of Sheba:3:1Ki10; Jezebel:3:1Ki16
Athaliah:2:2Ki11; Anna:2:Lk2; Priscilla:2:Ac18; Phoebe:2:Ro16; Lydia:2:Ac16; Abigail:2:1Sa25; Candace:1:Ac8
Vashti:2:Est1; Jael:2:Jdg4; Wise woman of Abel:0:2Sa20

@women-jobs|Women|Name a woman in the Bible who had a trade or job
Lydia:5:Ac16; Priscilla:4:Ac18; Deborah:4:Jdg4; Rachel:3:Ge29; Shiphrah:2:Ex1; Puah:1:Ex1; Tabitha|Dorcas:3:Ac9
Huldah:2:2Ki22; Anna:2:Lk2; Rahab:3:Jos2; Ruth:3:Ru2; Zipporah:2:Ex2; Martha:2:Lk10; Rhoda:2:Ac12

@women-brave|Women|Name a brave woman in the Bible
Esther:5:Est4; Deborah:5:Jdg4; Jael:4:Jdg4; Rahab:4:Jos2; Ruth:4:Ru1; Abigail:3:1Sa25; Jochebed:3:Ex2
Miriam:3:Ex2; Shiphrah:2:Ex1; Puah:1:Ex1; Mary:4:Lk1; Hannah:2:1Sa1; Rizpah:0:2Sa21; Jehosheba:0:2Ki11
Michal:2:1Sa19; Tamar:1:Ge38; Woman of Thebez:0:Jdg9; Priscilla:2:Ro16

@women-nt-churches|Women|Name a woman mentioned in Acts or the New Testament letters
Lydia:5:Ac16; Priscilla|Prisca:4:Ac18; Phoebe|Phebe:3:Ro16; Tabitha|Dorcas:4:Ac9; Sapphira:4:Ac5; Rhoda:3:Ac12
Eunice:2:2Ti1; Lois:2:2Ti1; Damaris:1:Ac17; Junia:1:Ro16; Euodia:1:Php4; Syntyche:1:Php4; Chloe:1:1Co1
Bernice:1:Ac25; Drusilla:1:Ac24; Candace:1:Ac8; Mary mother of Mark|Mary:2:Ac12; Apphia:0:Phm1; Nympha:0:Col4
Claudia:0:2Ti4; Julia:0:Ro16; Tryphena:0:Ro16; Tryphosa:0:Ro16; Persis:0:Ro16

@women-bad|Women|Name a woman in the Bible known for doing wrong
Jezebel:5:1Ki21; Delilah:5:Jdg16; Sapphira:4:Ac5; Herodias:4:Mk6; Athaliah:2:2Ki11; Lot's wife:4:Ge19
Potiphar's wife:4:Ge39; Eve:3:Ge3; Zeresh:1:Est5; Gomer:1:Hos1; Michal:1:2Sa6; Miriam:1:Nu12
Witch of Endor|Medium of Endor:2:1Sa28; Maacah:0:1Ki15; Jezebel of Thyatira:0:Rev2
`)
