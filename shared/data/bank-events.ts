// Events, miracles and famous stories.
import { bank } from './define'

export const eventsBank = bank(`
@creation|Events|Name something God made during the six days of creation
Light:5:Ge1; Sky|Heaven|Heavens|Firmament|Expanse:3:Ge1; Land|Earth|Dry land:4:Ge1; Sea|Seas|Oceans|Water:4:Ge1
Plants|Vegetation|Grass:3:Ge1; Trees:3:Ge1; Sun:5:Ge1; Moon:5:Ge1; Stars:5:Ge1; Fish:4:Ge1; Birds:4:Ge1
Sea creatures|Sea monsters|Whales:2:Ge1; Animals|Livestock|Cattle|Beasts:4:Ge1; Creeping things|Insects|Bugs:1:Ge1
Man|Adam|Mankind|Humans|People:5:Ge1; Woman|Eve:4:Ge2; Day:2:Ge1; Night:2:Ge1; Seasons:1:Ge1

@jesus-life|Events|Name an event in the life of Jesus
Birth|Nativity|Christmas:5:Lk2; Baptism:5:Mt3; Temptation|Temptation in the wilderness:4:Mt4; Transfiguration:3:Mt17
Triumphal entry|Palm Sunday:4:Mt21; Last Supper:5:Mt26; Crucifixion|Cross:5:Mt27; Resurrection|Easter:5:Mt28; Ascension:4:Ac1
Cleansing the temple|Temple cleansing:3:Jn2; Sermon on the Mount:4:Mt5; Prayer in Gethsemane|Gethsemane:3:Mt26; Arrest|Betrayal:3:Mt26
Trial:3:Mt27; Feeding the five thousand|Feeding of the 5000:4:Jn6; Walking on water:4:Mt14; Wedding at Cana|Water into wine:4:Jn2
Presentation in the temple:1:Lk2; Flight to Egypt:2:Mt2; Raising Lazarus:3:Jn11; Washing the disciples' feet|Foot washing:3:Jn13
Visit of the wise men|Wise men:2:Mt2; Boy Jesus in the temple|Jesus in the temple:2:Lk2; Calling the disciples:2:Mt4; Burial:2:Mt27

@moses-life|Events|Name an event in the life of Moses
Basket in the Nile|Basket|Bulrushes:5:Ex2; Burning bush:5:Ex3; Killed an Egyptian:3:Ex2; Plagues|Ten plagues:5:Ex7
Passover:4:Ex12; Crossing the Red Sea|Parting the Red Sea|Red Sea:5:Ex14; Ten Commandments:5:Ex20; Golden calf:4:Ex32
Manna:3:Ex16; Water from the rock|Struck the rock:4:Ex17; Bronze serpent|Bronze snake:3:Nu21; Death on Mount Nebo|Death:2:Dt34
Fled to Midian:2:Ex2; Staff turned into a snake|Staff became a snake:3:Ex4; Battle with Amalek|Arms held up:2:Ex17
Shining face:2:Ex34; Married Zipporah:2:Ex2; Sent twelve spies|Twelve spies:2:Nu13

@genesis-events|Events|Name an event in the book of Genesis
Creation:5:Ge1; Fall|Eating the forbidden fruit:5:Ge3; Flood|Noah's ark:5:Ge7; Tower of Babel:5:Ge11; Cain killed Abel|Cain and Abel:5:Ge4
Call of Abraham|Abraham's call:3:Ge12; Destruction of Sodom|Sodom and Gomorrah:4:Ge19; Sacrifice of Isaac|Binding of Isaac:4:Ge22
Jacob's ladder:4:Ge28; Jacob wrestled with God|Jacob wrestling:3:Ge32; Joseph sold into slavery|Joseph sold:4:Ge37
Rainbow|Rainbow covenant:4:Ge9; Joseph's dreams:3:Ge37; Famine:2:Ge41; Esau sold his birthright|Birthright:3:Ge25
Jacob stole the blessing|Stolen blessing:3:Ge27; Lot's wife turned to salt|Pillar of salt:3:Ge19; Birth of Isaac:3:Ge21
Joseph reunited with his brothers|Reunion:2:Ge45; Circumcision covenant:1:Ge17

@acts-events|Events|Name an event in the book of Acts
Ascension:4:Ac1; Pentecost:5:Ac2; Stoning of Stephen|Stephen stoned:4:Ac7; Conversion of Saul|Road to Damascus|Damascus road:5:Ac9
Peter's vision|Sheet from heaven:3:Ac10; Peter freed from prison|Peter's escape:3:Ac12; Philip and the Ethiopian|Ethiopian eunuch:3:Ac8
Ananias and Sapphira:3:Ac5; Council of Jerusalem|Jerusalem council:2:Ac15; Shipwreck:3:Ac27; Earthquake in prison|Philippian jailer:3:Ac16
Paul at the Areopagus|Mars Hill:2:Ac17; Eutychus fell from a window|Eutychus:2:Ac20; Matthias chosen:2:Ac1; Lame man healed:3:Ac3
Riot in Ephesus:1:Ac19; Snakebite on Malta|Snakebite:2:Ac28; Dorcas raised|Tabitha raised:2:Ac9; Cornelius baptized:2:Ac10

@feasts|Events|Name a Jewish feast, festival or holy day in the Bible
Passover:5:Ex12; Pentecost|Feast of Weeks|Weeks|Shavuot:4:Lev23; Tabernacles|Booths|Feast of Booths|Sukkot|Ingathering:4:Lev23
Day of Atonement|Atonement|Yom Kippur:3:Lev16; Purim:3:Est9; Unleavened Bread|Feast of Unleavened Bread:3:Ex12
Trumpets|Feast of Trumpets|Rosh Hashanah:2:Lev23; Firstfruits:2:Lev23; Dedication|Feast of Dedication|Hanukkah:2:Jn10
Sabbath:4:Ex20; Jubilee|Year of Jubilee:1:Lev25; New Moon:1:Nu10; Sabbath year|Sabbatical year:0:Lev25

@covenants|Events|Name someone God made a covenant with in the Bible
Noah:5:Ge9; Abraham|Abram:5:Ge15; Moses:4:Ex24; David:4:2Sa7; Israel:3:Ex19; Isaac:2:Ge17; Jacob:2:Ge35
Phinehas:0:Nu25; Levi:0:Mal2; Joshua:1:Jos24

@battles|Events|Name a battle or war in the Bible
Jericho|Battle of Jericho:5:Jos6; Ai|Battle of Ai:3:Jos8; David and Goliath|Valley of Elah:4:1Sa17; Gideon's battle|Midianites|Gideon:3:Jdg7
Armageddon|Har-Magedon:3:Rev16; Mount Gilboa|Gilboa:2:1Sa31; Aphek:1:1Sa4; Gibeon|Sun stood still:2:Jos10; Rephidim|Amalekites:2:Ex17
Michmash:1:1Sa14; Mount Tabor|Deborah and Barak|Sisera:2:Jdg4; Ramoth-gilead:1:1Ki22; Megiddo:1:2Ki23; Ebenezer:1:1Sa4
Lachish:1:2Ki18; Jabesh-gilead:1:1Sa11; Abraham rescues Lot|Battle of the kings:1:Ge14; Gog and Magog:1:Eze38

@jesus-miracles|Miracles|Name a miracle Jesus performed
Water into wine|Turning water into wine:5:Jn2; Feeding the five thousand|Feeding the 5000|Loaves and fishes:5:Jn6
Walking on water:5:Mt14; Calming the storm|Stilling the storm:4:Mk4; Raising Lazarus:5:Jn11; Healing the blind|Blind man healed|Healing a blind man:4:Jn9
Healing lepers|Ten lepers|Cleansing a leper:4:Lk17; Miraculous catch of fish|Catch of fish:3:Lk5; Cursing the fig tree|Fig tree:2:Mk11
Coin in the fish's mouth|Coin in a fish:2:Mt17; Feeding the four thousand|Feeding the 4000:2:Mk8; Raising Jairus's daughter|Jairus's daughter:3:Mk5
Healing the paralytic|Paralyzed man|Man lowered through the roof:3:Mk2; Casting out Legion|Legion|Demons into pigs:3:Mk5
Healing Malchus's ear|Malchus's ear|Servant's ear:2:Lk22; Raising the widow's son|Widow of Nain's son:2:Lk7
Healing the centurion's servant|Centurion's servant:3:Mt8; Woman with the issue of blood|Bleeding woman:3:Mk5
Healing Peter's mother-in-law:2:Mk1; Man at the pool of Bethesda|Bethesda:2:Jn5; Withered hand:2:Mk3; Bartimaeus:3:Mk10
Resurrection:3:Mt28; Deaf and mute man|Ephphatha:1:Mk7; Syrophoenician woman's daughter:1:Mk7; Crippled woman:1:Lk13

@ot-miracles|Miracles|Name a miracle in the Old Testament
Parting of the Red Sea|Red Sea|Crossing the Red Sea:5:Ex14; Manna:5:Ex16; Burning bush:5:Ex3; Sun stood still:3:Jos10
Walls of Jericho|Jericho:5:Jos6; Fire from heaven|Fire on Mount Carmel|Elijah on Carmel:4:1Ki18; Widow's son raised:2:1Ki17
Naaman healed:3:2Ki5; Floating axe head|Axe head:2:2Ki6; Fiery furnace:5:Da3; Lions' den|Daniel in the lions' den:5:Da6
Jonah and the fish|Jonah:5:Jon2; Aaron's rod budded|Aaron's rod:2:Nu17; Water from the rock:4:Ex17; Bronze serpent:3:Nu21
Oil and flour|Widow's oil:3:1Ki17; Balaam's talking donkey|Talking donkey:4:Nu22; Gideon's fleece|Fleece:3:Jdg6
Shadow went backward|Sundial:1:2Ki20; Plagues|Ten plagues:4:Ex7; Crossing the Jordan|Jordan parted:3:Jos3; Elijah taken to heaven|Chariot of fire:4:2Ki2
Ravens fed Elijah|Ravens:3:1Ki17; Samson's strength:3:Jdg16; Rain after drought:2:1Ki18; Staff became a snake:3:Ex7

@pentecost|Events|Name something that happened on the day of Pentecost
Holy Spirit came|Holy Spirit|Spirit poured out:5:Ac2; Tongues of fire|Fire:5:Ac2; Rushing wind|Wind|Mighty wind:5:Ac2
Speaking in tongues|Tongues|Languages|Other languages:5:Ac2; Peter preached|Peter's sermon|Sermon:4:Ac2
Three thousand saved|3000 baptized|Three thousand baptized|Baptism:4:Ac2; Accused of being drunk|Drunk|New wine:3:Ac2
Prophecy of Joel|Joel's prophecy|Joel:2:Ac2; Shared everything|Sharing possessions:2:Ac2

@spiritual-gifts|Faith|Name a spiritual gift mentioned by Paul
Prophecy:4:1Co12; Teaching:4:Ro12; Wisdom:3:1Co12; Knowledge:3:1Co12; Faith:3:1Co12; Healing|Healings|Gifts of healing:4:1Co12
Miracles|Working of miracles:3:1Co12; Tongues|Speaking in tongues:5:1Co12; Interpretation|Interpretation of tongues:3:1Co12
Discernment|Distinguishing between spirits|Discerning of spirits:2:1Co12; Apostles|Apostle:2:Eph4; Evangelists|Evangelism:2:Eph4
Pastors|Shepherds:2:Eph4; Giving|Generosity:2:Ro12; Leadership|Leading:2:Ro12; Mercy:2:Ro12; Serving|Service|Ministry:2:Ro12
Encouragement|Exhortation:2:Ro12; Administration|Helps|Helping:1:1Co12

@offerings|Faith|Name a kind of offering or sacrifice in the Law of Moses
Burnt offering:5:Lev1; Grain offering|Meal offering|Cereal offering:3:Lev2; Peace offering|Fellowship offering:3:Lev3
Sin offering:4:Lev4; Guilt offering|Trespass offering:3:Lev5; Drink offering:2:Nu15; Wave offering:2:Lev7; Heave offering:1:Ex29
Freewill offering:2:Lev22; Thank offering|Thanksgiving offering:2:Lev7; Firstfruits:2:Lev23; Tithe:3:Lev27; Incense:2:Ex30

@fall-curses|Events|Name a consequence of Adam and Eve's sin
Pain in childbirth|Childbirth:5:Ge3; Thorns and thistles|Thorns|Thistles:4:Ge3; Sweat|Toil|Hard work:4:Ge3; Death|Return to dust|Dust:4:Ge3
Serpent crawls on its belly|Belly|Crawl:4:Ge3; Enmity|Hostility:2:Ge3; Banished from Eden|Expelled from the garden|Exile:5:Ge3
Cursed ground|Ground cursed:3:Ge3; Shame|Nakedness:3:Ge3; Cherubim guarding Eden|Flaming sword:2:Ge3

@peter-events|Events|Name an event in the life of Peter
Walking on water:5:Mt14; Denying Jesus|Denial|Three denials:5:Mt26; Cutting off Malchus's ear|Cut off an ear:4:Jn18
Preaching at Pentecost|Pentecost:4:Ac2; Healing the lame man|Beautiful Gate:3:Ac3; Vision of the sheet|Vision:3:Ac10
Freed from prison by an angel|Prison escape:3:Ac12; Raising Tabitha|Raising Dorcas:2:Ac9; Miraculous catch of fish|Catch of fish:3:Lk5
Transfiguration:3:Mt17; Confession that Jesus is the Christ|You are the Christ:3:Mt16; Feed my sheep|Restoration:3:Jn21
Called by Jesus|Fishers of men:3:Mt4; Foot washing:2:Jn13; Running to the tomb|Empty tomb:2:Jn20; Visiting Cornelius:2:Ac10

@paul-events|Events|Name an event in the life of the apostle Paul
Road to Damascus|Damascus road|Conversion:5:Ac9; Blinded:4:Ac9; Escaped in a basket|Basket:3:Ac9; Shipwreck:5:Ac27
Snakebite on Malta|Snakebite|Viper:3:Ac28; Earthquake in the Philippian jail|Earthquake|Prison in Philippi:4:Ac16; Speech on Mars Hill|Areopagus:2:Ac17
Stoned at Lystra|Stoned:3:Ac14; House arrest in Rome|Rome:3:Ac28; Approved Stephen's stoning|Stephen's stoning:3:Ac7
Thorn in the flesh:3:2Co12; Raised Eutychus|Eutychus:2:Ac20; Missionary journeys:4:Ac13; Riot in Ephesus:1:Ac19
Arrested in the temple|Arrest in Jerusalem:2:Ac21; Appeal to Caesar:2:Ac25; Argument with Barnabas|Split with Barnabas:1:Ac15

@revelation|Scripture|Name something in the book of Revelation
Four horsemen:5:Rev6; Seven seals|Seals:4:Rev6; Seven trumpets|Trumpets:3:Rev8; Bowls|Seven bowls:3:Rev16; Beast:5:Rev13
666|Six hundred sixty-six|Mark of the beast:5:Rev13; Dragon:4:Rev12; Armageddon:4:Rev16; New heaven:4:Rev21; New earth:4:Rev21
New Jerusalem:5:Rev21; Lake of fire:4:Rev20; Thousand years|Millennium:3:Rev20; Great white throne|White throne:2:Rev20
Lamb:4:Rev5; 144000|144,000|One hundred forty-four thousand:3:Rev7; Two witnesses:2:Rev11; Seven churches:4:Rev2
Twenty-four elders|Elders:2:Rev4; Book of life:3:Rev20; Tree of life:3:Rev22; River of life|River of the water of life:2:Rev22
Babylon|Whore of Babylon:3:Rev17; Alpha and Omega:4:Rev1; Locusts:2:Rev9; Sea of glass:2:Rev4; Pearly gates|Gates of pearl:3:Rev21

@mount-sinai|Events|Name something that happened at Mount Sinai (Horeb)
Ten Commandments|Commandments|Tablets:5:Ex20; Burning bush:4:Ex3; Golden calf:5:Ex32; Thunder and lightning|Thunder|Lightning:3:Ex19
Cloud:3:Ex19; Trumpet blast|Trumpet:2:Ex19; Smoke|Fire:3:Ex19; Moses' face shone|Shining face:3:Ex34; Covenant:3:Ex24
Tabernacle instructions|Tabernacle:2:Ex25; Still small voice|Gentle whisper:3:1Ki19; Tablets broken|Broken tablets:3:Ex32
Earthquake:1:Ex19; Moses saw God's back|God's glory passed by:2:Ex33

@jordan-events|Events|Name something that happened at the Jordan River
Jesus' baptism|Baptism of Jesus|Baptism:5:Mt3; Israel crossed into Canaan|Crossing the Jordan|Crossing:4:Jos3; Naaman healed|Naaman:4:2Ki5
Elijah parted the Jordan|Elijah:3:2Ki2; Elisha parted the Jordan|Elisha:2:2Ki2; Floating axe head|Axe head:2:2Ki6
John baptizing|John the Baptist:4:Mk1; Twelve memorial stones|Twelve stones:2:Jos4; Lot chose the Jordan plain|Lot:1:Ge13
Jacob crossed the Jordan:1:Ge32; David crossed the Jordan:1:2Sa17

@galilee-events|Events|Name something that happened on or beside the Sea of Galilee
Jesus walked on water|Walking on water:5:Mt14; Calming the storm|Storm calmed:5:Mk4; Miraculous catch of fish|Catch of fish:4:Lk5
Calling the fishermen|Calling of Peter and Andrew|Fishers of men:4:Mt4; Breakfast on the beach|Breakfast|Fish breakfast:3:Jn21
Pigs rushed into the sea|Legion|Pigs:3:Mk5; Teaching from a boat|Preaching from a boat:3:Mk4; Peter restored|Feed my sheep:3:Jn21
Peter walked on water|Peter sank:4:Mt14; Feeding the five thousand:2:Jn6; Coin in a fish:1:Mt17

@famous-dreams|Events|Name a famous dream in the Bible
Jacob's ladder|Stairway to heaven|Ladder:5:Ge28; Joseph's sheaves|Sheaves:3:Ge37; Sun moon and stars|Stars bowing:3:Ge37
Pharaoh's cows|Seven cows|Fat and thin cows:4:Ge41; Pharaoh's grain|Seven ears of grain|Heads of grain:3:Ge41
Cupbearer's vine|Butler's dream|Vine:2:Ge40; Baker's baskets|Baker's dream|Baskets:2:Ge40; Nebuchadnezzar's statue|Great statue|Statue:4:Da2
Nebuchadnezzar's tree|Great tree:2:Da4; Joseph told to marry Mary|Joseph's dream:3:Mt1; Flee to Egypt:2:Mt2; Wise men warned|Magi's dream:2:Mt2
Pilate's wife's dream:2:Mt27; Solomon asks for wisdom|Solomon's dream:3:1Ki3; Barley loaf dream|Barley cake:1:Jdg7; Four beasts:2:Da7
Abimelech's dream:0:Ge20; Laban's dream:0:Ge31

@famous-prayers|Events|Name a famous prayer in the Bible (by who prayed it or what it's called)
Lord's Prayer|Our Father:5:Mt6; Jabez|Prayer of Jabez:4:1Ch4; Hannah|Hannah's prayer:4:1Sa1; Gethsemane|Jesus in Gethsemane|Not my will:4:Mt26
Solomon|Solomon's prayer of dedication:3:1Ki8; High priestly prayer|Jesus' prayer in John 17:2:Jn17; Daniel|Daniel's prayer:3:Da9
Nehemiah|Nehemiah's prayer:2:Ne1; Jonah|Jonah's prayer:3:Jon2; Elijah|Elijah on Carmel:3:1Ki18; Hezekiah:2:2Ki19
Moses interceding|Moses:2:Ex32; David's prayer of repentance|Psalm 51|Create in me a clean heart:3:Ps51; Stephen|Lord do not hold this sin against them:2:Ac7
Tax collector|God have mercy on me a sinner:2:Lk18; Thief on the cross|Remember me:2:Lk23; Paul and Silas in prison:2:Ac16

@sermons|Events|Name a famous sermon, speech or teaching in the Bible
Sermon on the Mount:5:Mt5; Sermon on the Plain:2:Lk6; Peter at Pentecost|Peter's Pentecost sermon:4:Ac2; Stephen's speech:3:Ac7
Paul on Mars Hill|Areopagus sermon:3:Ac17; Moses' farewell|Deuteronomy:2:Dt1; Joshua's farewell|Choose this day:3:Jos24
Olivet Discourse|Mount of Olives:2:Mt24; Upper Room Discourse|Farewell discourse:2:Jn14; Jonah preached to Nineveh|Jonah:3:Jon3
Ezra read the Law|Ezra:2:Ne8; Solomon's dedication:2:1Ki8; Bread of life discourse:2:Jn6; Nazareth sermon|Isaiah scroll:2:Lk4
Great Commission:4:Mt28; Parables by the sea|Parable of the sower:2:Mt13

@fire-events|Events|Name a Bible event that involves fire
Burning bush:5:Ex3; Fire on Mount Carmel|Elijah's sacrifice|Carmel:5:1Ki18; Fiery furnace:5:Da3; Sodom and Gomorrah|Fire and brimstone:4:Ge19
Pillar of fire:4:Ex13; Tongues of fire|Pentecost:5:Ac2; Chariot of fire|Elijah taken up:4:2Ki2; Nadab and Abihu|Strange fire:2:Lev10
Fire on the soldiers|Elijah calls down fire:1:2Ki1; Temple dedication fire|Solomon's temple:1:2Ch7; Gideon's offering:1:Jdg6
Job's sheep burned:1:Job1; Lake of fire:3:Rev20; Samson's foxes|Foxes with torches:3:Jdg15; Abraham's smoking firepot|Firepot:0:Ge15
Paul and the viper|Snake from the fire:2:Ac28; Peter warming by the fire|Peter's denial:2:Lk22

@journeys|Events|Name a famous journey in the Bible
Exodus|Out of Egypt:5:Ex12; Abraham to Canaan|Abraham's journey:4:Ge12; Jacob to Haran:2:Ge28; Joseph to Egypt:3:Ge37
Ruth to Bethlehem|Ruth and Naomi:3:Ru1; Paul's missionary journeys|Missionary journeys:4:Ac13; Wise men from the east|Magi:4:Mt2
Mary and Joseph to Bethlehem|Journey to Bethlehem:4:Lk2; Flight into Egypt:2:Mt2; Jonah to Tarshish|Jonah:4:Jon1
Queen of Sheba's visit|Queen of Sheba:2:1Ki10; Return from exile|Return to Jerusalem:2:Ezr1; Road to Emmaus|Emmaus:4:Lk24
Road to Damascus|Damascus:4:Ac9; Philip on the Gaza road|Gaza road:2:Ac8; Elijah to Horeb:1:1Ki19; Paul to Rome|Voyage to Rome:3:Ac27
Prodigal son's journey|Prodigal son:2:Lk15; Good Samaritan's road|Jericho road:2:Lk10

@famous-meals|Events|Name a famous meal or feast in the Bible
Last Supper|Lord's Supper:5:Mt26; Passover:5:Ex12; Wedding at Cana|Cana:4:Jn2; Feeding of the five thousand|Feeding the 5000:4:Jn6
Esther's banquet|Esther's feast:2:Est5; Belshazzar's feast|Writing on the wall:3:Da5; Abraham's meal for three visitors|Abraham's visitors:2:Ge18
Esau's stew|Lentil stew|Red stew:3:Ge25; Prodigal son's feast|Fatted calf:4:Lk15; Marriage supper of the Lamb|Wedding supper of the Lamb:3:Rev19
Breakfast by the sea|Fish breakfast:3:Jn21; Meal at Emmaus|Emmaus:2:Lk24; Dinner at Zacchaeus' house|Zacchaeus:3:Lk19; Levi's banquet|Matthew's party:2:Lk5
Mary and Martha's dinner|Martha:3:Lk10; Ahasuerus' feast|Xerxes' banquet:1:Est1; Herod's birthday feast:2:Mk6; Great banquet parable:2:Lk14

@elijah-elisha-miracles|Miracles|Name a miracle done by Elijah or Elisha
Fire on Mount Carmel|Fire from heaven:5:1Ki18; Raising the widow's son|Widow's son:3:1Ki17; Oil and flour|Flour and oil:3:1Ki17
Fed by ravens|Ravens:4:1Ki17; Rain after the drought|Rain:3:1Ki18; Parting the Jordan|Jordan:3:2Ki2; Chariot of fire|Whirlwind:4:2Ki2
Naaman healed|Naaman:4:2Ki5; Floating axe head|Axe head:3:2Ki6; Widow's oil jars|Jars of oil:3:2Ki4; Shunammite's son raised:2:2Ki4
Poison stew healed|Death in the pot:2:2Ki4; Bad water healed|Healing the water:1:2Ki2; Feeding a hundred men|Feeding 100:1:2Ki4
Bears attacked mocking boys|Bears:3:2Ki2; Blinding the Arameans|Blinded army:2:2Ki6; Chariots of fire around Elisha|Army of angels:2:2Ki6
Dead man revived by Elisha's bones|Elisha's bones:1:2Ki13; Drought:3:1Ki17

@acts-miracles|Miracles|Name a miracle in the book of Acts
Speaking in tongues|Tongues:5:Ac2; Lame man healed|Beautiful Gate:4:Ac3; Ananias and Sapphira died:3:Ac5; Peter's shadow heals|Peter's shadow:2:Ac5
Apostles freed from prison:2:Ac5; Saul blinded and healed|Saul's sight restored:4:Ac9; Aeneas healed|Aeneas:1:Ac9; Tabitha raised|Dorcas raised:3:Ac9
Peter freed by an angel|Peter's prison escape:4:Ac12; Elymas blinded|Bar-Jesus blinded:1:Ac13; Lame man at Lystra:2:Ac14
Slave girl freed from a spirit|Fortune teller:2:Ac16; Earthquake in Philippi|Prison doors opened:4:Ac16; Paul's handkerchiefs|Handkerchiefs:2:Ac19
Eutychus raised|Eutychus:3:Ac20; Snakebite on Malta|Viper:3:Ac28; Publius' father healed|Publius:1:Ac28; Philip taken away|Philip snatched away:1:Ac8
Herod struck by an angel|Herod eaten by worms:2:Ac12

@judgments|Events|Name a judgment or punishment sent by God in the Bible
Flood:5:Ge7; Sodom and Gomorrah|Fire and brimstone:5:Ge19; Ten plagues|Plagues:5:Ex7; Confusion of languages|Babel:4:Ge11
Lot's wife turned to salt|Pillar of salt:4:Ge19; Korah swallowed by the earth|Earth opened:2:Nu16; Fiery serpents|Snakes:3:Nu21
Uzzah struck down|Uzzah:2:2Sa6; Nadab and Abihu|Strange fire:2:Lev10; Miriam's leprosy:2:Nu12; Gehazi's leprosy:2:2Ki5
Herod eaten by worms:2:Ac12; Ananias and Sapphira:3:Ac5; Nebuchadnezzar's madness|Ate grass like an ox:3:Da4; Writing on the wall:3:Da5
Forty years in the wilderness|Wandering:4:Nu14; Banished from Eden|Expelled from the garden:4:Ge3; Cain's mark|Mark of Cain:3:Ge4
Exile to Babylon|Exile:3:2Ki25; Jonah swallowed:2:Jon1

@bible-stories|Events|Name a famous Bible story
Creation:5:Ge1; Adam and Eve:5:Ge3; Noah's ark|The flood|Noah:5:Ge6; Tower of Babel:4:Ge11; David and Goliath:5:1Sa17
Jonah and the whale|Jonah and the big fish|Jonah:5:Jon1; Daniel in the lions' den|Lions' den:5:Da6; Fiery furnace:4:Da3
Parting of the Red Sea|Red Sea:5:Ex14; Burning bush:4:Ex3; Good Samaritan:5:Lk10; Prodigal son:5:Lk15; Feeding the five thousand:4:Jn6
Walls of Jericho|Battle of Jericho:4:Jos6; Samson and Delilah:4:Jdg16; Joseph's coat|Coat of many colors:4:Ge37; Cain and Abel:4:Ge4
Ruth and Naomi:3:Ru1; Esther:3:Est4; Zacchaeus:3:Lk19; Lazarus raised:3:Jn11; Jesus walks on water:4:Mt14; Easter|Resurrection:4:Mt28
Christmas|Nativity:4:Lk2; Gideon's fleece:2:Jdg6; Elijah on Mount Carmel:2:1Ki18; Abraham and Isaac:3:Ge22; Jacob's ladder:3:Ge28
Moses in the basket|Baby Moses:4:Ex2; Ten Commandments:4:Ex20; Road to Emmaus:2:Lk24; Saul's conversion:3:Ac9; Pentecost:3:Ac2

@noah-story|Events|Name something in the story of Noah's ark
Ark:5:Ge6; Flood|Water:5:Ge7; Rain:5:Ge7; Animals|Beasts|Creatures|Every kind of animal|Lion|Lions|Elephant|Elephants|Giraffe|Giraffes|Tiger|Tigers|Bear|Bears|Horse|Horses|Zebra|Zebras|Monkey|Monkeys|Camel|Camels|Wolf|Wolves|Deer|Goat|Goats|Pig|Pigs|Rabbit|Rabbits|Kangaroo|Hippo|Hippopotamus|Rhino|Rhinoceros|Dog|Dogs|Cat|Cats|Mouse|Mice:5:Ge7; Dove:5:Ge8; Raven:4:Ge8; Olive leaf|Olive branch:4:Ge8
Rainbow:5:Ge9; Ararat|Mountains of Ararat:4:Ge8; Gopher wood|Cypress wood:3:Ge6; Pitch|Tar:2:Ge6; Window:2:Ge8; Door:2:Ge7
Forty days and forty nights|Forty days|40 days:4:Ge7; Altar|Sacrifice:2:Ge8; Vineyard|Wine:2:Ge9; Covenant:3:Ge9; Pairs|Two by two:4:Ge7
Shem:2:Ge6; Ham:2:Ge6; Japheth:2:Ge6; Seven pairs:1:Ge7
Birds|Fowl|Fowls:3:Ge7; Cattle|Livestock|Cows|Oxen:2:Ge7; Creeping things|Creatures that move along the ground|Snake|Snakes|Lizard|Lizards|Insects|Bugs:1:Ge7

@eden|Events|Name something in the Garden of Eden
Tree of life:5:Ge2; Tree of the knowledge of good and evil|Tree of knowledge:5:Ge2; Serpent|Snake:5:Ge3; Fruit|Apple|Forbidden fruit:5:Ge3
Fig leaves:4:Ge3; Adam:5:Ge2; Eve:5:Ge3; Rivers|River:3:Ge2; Cherubim:3:Ge3; Flaming sword:3:Ge3; Garments of skin|Clothes of skin:2:Ge3
Gold:1:Ge2; Onyx:1:Ge2; Bdellium|Aromatic resin:0:Ge2; Animals|Beasts|Beasts of the field|Wild animals:3:Ge2; Rib:4:Ge2; Mist:1:Ge2; Birds|Fowl|Birds of the air:2:Ge2; Livestock|Cattle:1:Ge2

@david-goliath|Events|Name something in the story of David and Goliath
Sling:5:1Sa17; Stones|Five smooth stones|Stone:5:1Sa17; Giant|Goliath:5:1Sa17; Sword:4:1Sa17; Armor:4:1Sa17; Shield:3:1Sa17
Spear:3:1Sa17; Javelin:2:1Sa17; Staff:2:1Sa17; Brook|Stream:2:1Sa17; Valley of Elah|Elah:2:1Sa17; Philistines:4:1Sa17
Saul:4:1Sa17; Israelites|Israel:3:1Sa17; Helmet:2:1Sa17; Cheese|Cheeses:1:1Sa17; Bread|Loaves:1:1Sa17; Roasted grain:0:1Sa17
Lion and bear|Lion|Bear|Lions|Bears:3:1Sa17; Sheep|Flock|Lamb:3:1Sa17; Dog:1:1Sa17; Birds and beasts|Birds|Wild animals:1:1Sa17; Eliab:1:1Sa17; Jesse:2:1Sa17; Head:2:1Sa17; Forehead:3:1Sa17

@jonah-story|Events|Name something in the story of Jonah
Big fish|Great fish|Whale|Fish:5:Jon1; Ship|Boat:4:Jon1; Storm:5:Jon1; Nineveh:5:Jon1; Tarshish:3:Jon1; Joppa:2:Jon1
Lots|Casting lots:2:Jon1; Plant|Vine|Gourd|Leafy plant:3:Jon4; Worm:2:Jon4; East wind|Wind:2:Jon4; Sackcloth:3:Jon3
Sailors:3:Jon1; Three days and three nights|Three days:4:Jon1; Prayer:3:Jon2; Cattle|Animals|Herds|Flocks|Sheep|Livestock:1:Jon3; King of Nineveh:2:Jon3; Sun:1:Jon4

@gideon-story|Events|Name something in the story of Gideon
Fleece:5:Jdg6; Dew:4:Jdg6; Trumpets:4:Jdg7; Jars|Pitchers:3:Jdg7; Torches|Lamps:3:Jdg7; Three hundred men|300 men|300:4:Jdg7
Midianites|Midian:4:Jdg6; Winepress:2:Jdg6; Lapping water|Drinking water|Lapped like dogs|Dog|Dogs:3:Jdg7; Camels:2:Jdg7; Bull|Young bull|Bullock|Second bull:2:Jdg6; Young goat|Kid|Goat:1:Jdg6; Barley loaf|Barley bread:1:Jdg7; Angel:3:Jdg6
Altar of Baal|Baal:3:Jdg6; Ephod:1:Jdg8; Asherah pole:1:Jdg6; Oak|Terebinth:0:Jdg6; Sword of the Lord:2:Jdg7

@samson-story|Events|Name something in the story of Samson
Lion:5:Jdg14; Honey:4:Jdg14; Foxes:4:Jdg15; Jawbone|Donkey's jawbone|Donkey|Ass:4:Jdg15; Bees|Swarm of bees:3:Jdg14; Heifer|Plowed with my heifer:1:Jdg14; Young goat|Kid|Goat:1:Jdg15; Riddle:3:Jdg14; Delilah:5:Jdg16
Hair:5:Jdg16; Razor:2:Jdg13; Pillars:4:Jdg16; Temple of Dagon|Dagon:3:Jdg16; Gates of Gaza|Gaza:2:Jdg16; Nazirite:3:Jdg13
Philistines:4:Jdg13; Ropes|New ropes:2:Jdg15; Loom|Weaving:1:Jdg16; Bowstrings:1:Jdg16; Torches:2:Jdg15; Millstone|Grinding:1:Jdg16
Manoah:2:Jdg13; Blinded|Eyes:3:Jdg16

@daniel-story|Events|Name something in the book of Daniel
Lions' den|Lions:5:Da6; Fiery furnace|Furnace:5:Da3; Writing on the wall|Handwriting on the wall:4:Da5; Statue|Image:4:Da2
Vegetables|Pulse:3:Da1; King's food|King's meat:2:Da1; Dreams:3:Da2; Nebuchadnezzar ate grass|Ate grass like oxen|Oxen:2:Da4; Babylon:4:Da1
Window|Praying three times a day:3:Da6; Mene Mene Tekel Upharsin|Mene Tekel:2:Da5; Four beasts|Beasts|Leopard|Bear|Winged lion:2:Da7; Ancient of Days:2:Da7
Seventy weeks:1:Da9; Gabriel:2:Da8; Fourth man in the fire|Son of God:3:Da3; Ram and goat|Ram|Goat|He-goat:2:Da8; Gold:2:Da3

@christmas-things|Events|Name something in the Christmas story
Manger:5:Lk2; Star:5:Mt2; Gold:4:Mt2; Frankincense:4:Mt2; Myrrh:4:Mt2; Shepherds:5:Lk2; Angels:5:Lk2; Inn:4:Lk2
Swaddling cloths|Swaddling clothes|Cloths:3:Lk2; Bethlehem:5:Lk2; Census:3:Lk2; Wise men|Magi:5:Mt2; Flocks|Sheep:3:Lk2
Dreams:2:Mt1; Glory to God in the highest|Gloria:2:Lk2; Gifts:3:Mt2; Baby:4:Lk2

@easter-things|Events|Name something in the Easter story
Cross:5:Mt27; Tomb:5:Mt27; Stone:5:Mk16; Crown of thorns:5:Mt27; Nails:4:Jn20; Spear:3:Jn19; Linen|Grave clothes|Burial cloths:3:Jn20
Spices:2:Mk16; Angel|Angels:4:Mt28; Garden:3:Jn19; Earthquake:2:Mt27; Thirty pieces of silver|Silver:4:Mt26; Rooster|Cock:4:Mt26
Whip|Scourge|Flogging:3:Jn19; Purple robe|Scarlet robe|Robe:3:Mk15; Sign|King of the Jews|INRI:3:Jn19; Sponge:2:Mt27; Vinegar|Sour wine:3:Jn19
Lots|Dice|Casting lots:3:Jn19; Veil torn|Curtain torn|Temple curtain:3:Mt27; Darkness:3:Mt27; Palm branches|Palms:3:Jn12; Donkey:3:Mt21
Bread:3:Lk22; Cup|Wine:3:Lk22; Passover lamb|Lamb:2:Lk22; Kiss:3:Lk22; Guards|Soldiers:3:Mt27; Sealed tomb|Seal:2:Mt27
`)
