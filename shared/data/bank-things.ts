// Roles, objects, Jesus, Scripture, faith and numbers.
import { bank } from './define'

export const thingsBank = bank(`
@jobs|Roles|Name a job or trade mentioned in the Bible
Shepherd:5:Lk2; Fisherman:5:Mt4; Carpenter:5:Mk6; Tentmaker:4:Ac18; Tax collector:5:Lk19; Farmer:4:Ge4; Priest:4:Lev1
King:4:1Sa8; Soldier:4:Mt27; Potter:3:Jer18; Scribe:3:Mt23; Baker:3:Ge40; Cupbearer|Butler:3:Ne1; Tanner:2:Ac9
Physician|Doctor:3:Col4; Merchant|Trader:3:Mt13; Blacksmith|Smith|Metalworker:2:1Sa13; Weaver:1:Ex35; Musician:3:1Ch15
Judge:3:Jdg2; Prophet:3:Dt18; Centurion:3:Mt8; Governor:3:Mt27; Midwife:2:Ex1; Builder|Mason|Stonemason:2:2Ki12
Seller of purple|Dealer in purple cloth:2:Ac16; Silversmith:2:Ac19; Lawyer|Expert in the law:2:Lk10; Steward|Manager:2:Lk16
Innkeeper:2:Lk10; Vinedresser|Vine grower:2:Lk13; Gardener:2:Jn20; Hunter:2:Ge25; Herdsman:2:Am7; Perfumer|Apothecary:1:Ex30
Jailer:2:Ac16; Sailor:2:Jon1; Gatekeeper|Doorkeeper|Porter:1:1Ch9; Teacher|Rabbi:3:Jn3; Servant|Slave:3:Mt25; Treasurer:1:Ac8

@roles-court|Roles|Name a job or role in a king's court in the Bible
Cupbearer|Butler:5:Ne1; Baker:4:Ge40; Eunuch:3:Ac8; Steward:3:Ge43; Counselor|Adviser:3:2Sa15; Scribe|Secretary:3:2Sa8
Recorder:1:2Sa8; Commander|General:3:2Sa8; Chamberlain:2:Est1; Magician|Magicians:3:Ex7; Astrologer|Enchanter:2:Da2
Wise men:3:Da2; Satrap|Satraps:1:Da6; Governor:3:Ne5; Prince|Princes:2:Da6; Prophet:2:2Sa7; Bodyguard|Captain of the guard:2:Ge39
Herald:1:Da3; Treasurer:1:Ezr1; Armor-bearer|Armour bearer:2:1Sa16; Queen:2:Est2; Concubine:1:2Sa5; Overseer:1:Ge39

@court-servants|Roles|Name a Bible person who served in a foreign king's court
Joseph:5:Ge41; Daniel:5:Da1; Nehemiah:4:Ne1; Esther:4:Est2; Mordecai:4:Est10; Shadrach:3:Da2; Meshach:3:Da2; Abednego:3:Da2
Potiphar:3:Ge39; Ethiopian eunuch:2:Ac8; Obadiah:1:1Ki18; Moses:2:Ex2; Haman:2:Est3; Ebed-melech:0:Jer38; Blastus:0:Ac12
Chuza:0:Lk8; Erastus:0:Ro16; Naaman:2:2Ki5

@jesus-titles|Jesus|Name a title or name given to Jesus
Messiah|Christ:5:Jn1; Son of God:5:Mk1; Son of Man:4:Mk2; Lamb of God:5:Jn1; Lord:4:Php2; Savior|Saviour:5:Lk2
King of Kings:4:Rev19; Prince of Peace:5:Isa9; Emmanuel|Immanuel:5:Mt1; Good Shepherd:4:Jn10; Lion of Judah:4:Rev5
Rabbi|Teacher|Master:4:Jn1; Word|The Word|Logos:4:Jn1; Alpha and Omega:4:Rev22; Bread of Life:4:Jn6; Light of the World:4:Jn8
Son of David:3:Mt21; Wonderful Counselor|Counselor:3:Isa9; Mighty God:3:Isa9; Everlasting Father:2:Isa9; High Priest:2:Heb4
Bridegroom:2:Mt9; Cornerstone|Chief cornerstone:2:Eph2; Morning Star|Bright Morning Star:2:Rev22; Nazarene|Jesus of Nazareth:3:Mt2
Way|The Way:3:Jn14; Holy One of God|Holy One:2:Mk1; Root of Jesse|Branch:2:Isa11; King of the Jews:3:Mt27; Rock:2:1Co10
Lord of Lords:3:Rev19; Second Adam|Last Adam:1:1Co15; Author and finisher of our faith|Pioneer:1:Heb12; Mediator:1:1Ti2; Amen:0:Rev3

@god-names|Faith|Name a name or title of God in the Bible
Yahweh|Jehovah|The LORD:5:Ex3; Elohim:3:Ge1; El Shaddai|God Almighty|Almighty:4:Ge17; Adonai|Lord:3:Ps8; I Am|I Am that I Am:5:Ex3
Jehovah Jireh|The Lord will provide:4:Ge22; Jehovah Rapha|The Lord who heals:2:Ex15; Jehovah Nissi|The Lord is my banner:2:Ex17
Jehovah Shalom|The Lord is peace:2:Jdg6; Ancient of Days:3:Da7; Most High|El Elyon:4:Ge14; Abba|Father:5:Ro8
Holy One of Israel|Holy One:3:Isa1; Rock:3:Ps18; Shepherd:3:Ps23; King:3:Ps24; Alpha and Omega:3:Rev1; Lord of Hosts|Sabaoth:3:Isa6
El Roi|God who sees me:2:Ge16; Creator:4:Isa40; Redeemer:3:Job19; Jehovah Tsidkenu|The Lord our righteousness:1:Jer23
Jehovah Shammah|The Lord is there:1:Eze48; Judge:2:Ge18; Fortress|Refuge:2:Ps91; Everlasting God:2:Isa40

@spirit-names|Faith|Name a title or symbol of the Holy Spirit
Comforter|Helper|Advocate|Counselor|Paraclete:5:Jn14; Dove:5:Mt3; Fire|Tongues of fire:4:Ac2; Wind|Breath:4:Ac2
Oil|Anointing:3:1Jn2; Water|Living water:3:Jn7; Spirit of truth:3:Jn16; Seal|Deposit|Guarantee:2:Eph1; Holy Ghost:4:Ac2
Spirit of God:3:Ge1; Spirit of Christ:1:Ro8; Spirit of adoption:1:Ro8

@church-roles|Roles|Name a role or office in the early church
Apostle:5:Eph4; Prophet:3:Eph4; Evangelist:3:Eph4; Pastor|Shepherd:4:Eph4; Teacher:4:Eph4; Elder|Presbyter:4:Tit1
Deacon:4:1Ti3; Bishop|Overseer:3:1Ti3; Servant:2:Ro16; Missionary:2:Ac13; Widow:1:1Ti5

@nt-groups|Roles|Name a religious or political group in the New Testament
Pharisees:5:Mt23; Sadducees:4:Mt22; Scribes|Teachers of the law:3:Mt23; Herodians:2:Mk3; Zealots:2:Lk6; Sanhedrin|Council:3:Ac5
Samaritans:3:Jn4; Gentiles:3:Ac10; Epicureans:1:Ac17; Stoics:1:Ac17; Nicolaitans:1:Rev2; Freedmen|Libertines:0:Ac6
Hellenists|Grecians:1:Ac6; Romans:3:Ac22; Disciples:4:Mt10; Christians:3:Ac11; Priests:3:Mt27; Levites:2:Jn1; Elders:2:Mt27

@military-roles|Roles|Name a military role or unit mentioned in the Bible
Centurion:5:Mt8; Soldier:5:Jn19; Captain:3:2Ki1; Commander|General:3:2Sa2; Armor-bearer|Armour bearer:3:1Sa31; Archer|Archers:3:1Sa31
Charioteer|Chariots:3:Ex14; Spearmen:1:Ac23; Horsemen|Cavalry:2:Ex14; Legion:3:Mk5; Guard|Guards:3:Mt27; Watchman:2:Eze33
Mighty men:2:2Sa23; Slingers:1:Jdg20; Spies:3:Nu13; Army:3:Ex14

@temple-jobs|Roles|Name a job or role in the tabernacle or temple
Priest:5:Lev1; High priest:5:Lev16; Levite:4:Nu3; Singer|Choir:3:1Ch15; Gatekeeper|Doorkeeper|Porter:2:1Ch9
Musician:3:1Ch25; Treasurer:1:Ne13; Scribe:2:Ezr7; Temple servants|Nethinim:0:Ezr2; Captain of the temple guard|Temple guard:1:Ac4
Money changers:3:Jn2; Craftsmen|Artisans:1:1Ki7

@hunters-farmers|Roles|Name a Bible person who worked the land (farmer, vinedresser or ploughman)
Cain:5:Ge4; Noah:4:Ge9; Adam:4:Ge2; Elisha:3:1Ki19; Boaz:4:Ru2; Gideon:3:Jdg6; Uzziah:1:2Ch26; Amos:2:Am7; Naboth:2:1Ki21
Saul:1:1Sa11; Isaac:2:Ge26; Ruth:2:Ru2; Joseph:1:Ge37

@craftsmen|Roles|Name a Bible person who was a carpenter, craftsman or maker
Jesus:5:Mk6; Joseph:5:Mt13; Bezalel|Bezaleel:3:Ex31; Oholiab|Aholiab:1:Ex31; Hiram|Huram:2:1Ki7; Paul:4:Ac18
Aquila:3:Ac18; Priscilla:3:Ac18; Demetrius:2:Ac19; Alexander:1:2Ti4; Tubal-cain|Tubalcain:2:Ge4; Noah:3:Ge6; Dorcas|Tabitha:2:Ac9
Aaron:1:Ex32; Jubal:1:Ge4

@tabernacle|Objects|Name something found in the tabernacle
Ark of the Covenant|Ark:5:Ex25; Mercy seat|Atonement cover:3:Ex25; Table of showbread|Showbread|Bread of the Presence|Table:4:Ex25
Lampstand|Menorah|Candlestick:5:Ex25; Altar of incense|Golden altar|Incense altar:3:Ex30; Bronze altar|Altar of burnt offering|Altar:4:Ex27
Laver|Basin|Bronze basin:3:Ex30; Veil|Curtain:4:Ex26; Cherubim:3:Ex25; Holy of Holies|Most Holy Place:4:Ex26; Holy Place:3:Ex26
Courtyard|Court:2:Ex27; Tent pegs|Pegs:1:Ex27; Incense:3:Ex30; Anointing oil:2:Ex30; Ephod:1:Ex28; Boards|Frames:1:Ex26

@ark-contents|Objects|Name something kept in or on the Ark of the Covenant
Tablets of the law|Ten Commandments|Stone tablets|Tablets:5:Heb9; Jar of manna|Manna|Golden pot of manna:4:Heb9
Aaron's rod|Aaron's staff|Rod that budded:4:Heb9; Mercy seat|Atonement cover|Lid:3:Ex25; Cherubim|Cherub:3:Ex25
Book of the Law:1:Dt31; Poles|Carrying poles|Staves:2:Ex25; Gold:2:Ex25

@weapons|Objects|Name a weapon used in the Bible
Sword:5:Jdg7; Spear:5:1Sa18; Bow:4:Ge27; Arrow|Arrows:4:1Sa20; Sling:5:1Sa17; Stone:4:1Sa17; Javelin:3:1Sa18
Dagger|Short sword:2:Jdg3; Club:1:Pr25; Jawbone|Donkey's jawbone:4:Jdg15; Ox goad|Goad:2:Jdg3; Tent peg:3:Jdg4
Millstone:1:Jdg9; Shield:3:Eph6; Chariot:3:Ex14; Battering ram:1:Eze4; Axe:1:Jdg9; Hammer|Mallet:2:Jdg4
Trumpets and jars|Trumpets:2:Jdg7; Fire|Torches:1:Jdg15; Rod of iron:1:Rev19

@miracle-objects|Objects|Name an object used in a miracle in the Bible
Moses' staff|Staff|Rod:5:Ex14; Aaron's rod:3:Nu17; Bronze serpent|Bronze snake:4:Nu21; Elijah's cloak|Mantle:3:2Ki2
Axe head:3:2Ki6; Water jars|Jars:3:Jn2; Loaves|Bread:4:Jn6; Fish:4:Jn6; Fleece:4:Jdg6; Jawbone:3:Jdg15; Net|Nets:3:Lk5
Coin:2:Mt17; Mud|Clay|Spit:3:Jn9; Handkerchiefs|Aprons:2:Ac19; Peter's shadow|Shadow:2:Ac5; Salt:1:2Ki2; Flour:2:1Ki17
Oil|Jars of oil:3:2Ki4; Ark:2:Ge6; Cloak|Hem of his garment:3:Mt9; Trumpets:2:Jos6; Stick:1:2Ki6; Sundial|Stairway:1:2Ki20

@instruments|Objects|Name a musical instrument mentioned in the Bible
Harp|Lyre:5:1Sa16; Trumpet:5:Jos6; Ram's horn|Shofar|Horn:4:Jos6; Cymbals:4:Ps150; Tambourine|Timbrel:4:Ex15
Flute|Pipe:3:Da3; Lute:1:Ps150; Psaltery:2:Ps33; Sackbut|Trigon:1:Da3; Dulcimer|Bagpipe:1:Da3; Organ:1:Ge4; Zither:1:Da3
Strings|Stringed instruments:2:Ps150; Castanets|Sistrums:0:2Sa6; Bells:1:Ex28; Ten-stringed lyre:1:Ps33

@clothing|Objects|Name an item of clothing or accessory mentioned in the Bible
Robe:5:Lk15; Tunic|Coat:4:Ge37; Sandals:4:Ex3; Belt|Girdle|Sash:3:Mt3; Cloak|Mantle:4:2Ki2; Sackcloth:4:Jon3; Veil:3:Ge24
Turban|Mitre:2:Ex28; Crown:4:Mt27; Ring:4:Lk15; Earrings:3:Ex32; Bracelets:2:Ge24; Linen:3:Mk15; Fig leaves:3:Ge3
Ephod:2:Ex28; Headband|Head covering:1:1Co11; Nose ring:1:Ge24; Signet ring:2:Est3; Armor:3:Eph6; Breastplate:2:Ex28
Helmet:2:Eph6; Shoes:3:Lk15; Purple:2:Lk16; Swaddling cloths:2:Lk2; Wedding garment:2:Mt22

@famous-garments|Objects|Name a famous coat, robe or garment from a Bible story
Joseph's coat|Coat of many colors|Coat of many colours|Robe of many colors:5:Ge37; Elijah's mantle|Elijah's cloak:4:2Ki2
Jesus' seamless robe|Seamless robe:2:Jn19; Purple robe|Scarlet robe:3:Mk15; Samuel's robe|Little robe:2:1Sa2; Jonathan's robe:1:1Sa18
Garments of skin|Clothes of skin:3:Ge3; Fig leaves:3:Ge3; Dorcas' garments|Tunics Dorcas made:2:Ac9; Camel's hair:3:Mt3
Wedding garment|Wedding clothes:2:Mt22; Mordecai's royal robe|Royal robe:2:Est6; Saul's armor:2:1Sa17; Hem of Jesus' garment|Fringe:3:Mt9
Bartimaeus' cloak:1:Mk10; Swaddling cloths:3:Lk2; Grave clothes:2:Jn11; Ephod:1:Ex28; Best robe|Prodigal's robe:2:Lk15

@buildings|Objects|Name a building or structure in the Bible
Tower of Babel:5:Ge11; Ark|Noah's ark:5:Ge6; Temple|Solomon's temple:5:1Ki6; Tabernacle:4:Ex26; Walls of Jericho:4:Jos6
Palace:3:1Ki7; Walls of Jerusalem|Wall:3:Ne2; Upper room:3:Mk14; Synagogue:4:Lk4; Tomb:4:Mt27; Prison:3:Ac16
Temple of Dagon:2:Jdg16; High places:2:1Ki3; Gallows:2:Est7; Watchtower|Tower:2:Mk12; Inn:3:Lk2; Stable:1:Lk2
Pool of Bethesda|Porches:1:Jn5; Barns:2:Lk12; House on the rock:3:Mt7; Lions' den:3:Da6; Fiery furnace:3:Da3

@gold-things|Objects|Name something made of gold in the Bible
Golden calf:5:Ex32; Lampstand|Menorah:4:Ex25; Mercy seat:3:Ex25; Ark of the Covenant:4:Ex25; Statue|Image|Nebuchadnezzar's statue:4:Da3
Crown:4:Rev4; Altar of incense:2:Ex30; Bowls|Golden bowls:2:Rev5; Ephod:1:Jdg8; Shields:1:1Ki10; Golden tumors|Golden rats:1:1Sa6
Streets of gold|Street:4:Rev21; Lampstands:2:Rev1; Censer:1:Heb9; Gift for Jesus|Gold:3:Mt2; Chain:2:Ge41; Throne:2:1Ki10
Earrings:2:Ex32; Jar of manna:1:Heb9; Cups|Vessels:2:Da5

@wood-things|Objects|Name something made of wood in the Bible
Ark|Noah's ark:5:Ge6; Cross:5:Jn19; Ark of the Covenant:3:Ex25; Staff|Rod:4:Ex4; Yoke:3:Jer28; Table:2:Ex25; Boat|Ship:3:Mt8
Plough|Plow:2:1Ki19; Idols:3:Isa44; Gallows|Pole:2:Est7; Altar:2:Ge22; Temple panels|Cedar panels:2:1Ki6; Door:1:Jdg16
Sword hilt:0:Jdg3; Cart:2:1Sa6; Tabernacle frames:1:Ex26; Ladder:1:Ge28; Coffin:1:Ge50; Bed:1:2Sa3

@containers|Objects|Name a container or vessel mentioned in the Bible
Jar|Water jar:5:Jn2; Basket:5:Ex2; Pot:3:2Ki4; Wineskin:4:Mt9; Pitcher:3:Jdg7; Cup:5:Lk22; Bowl:3:Rev16; Alabaster jar|Alabaster box:4:Mk14
Bag|Purse|Money bag:3:Jn12; Sack:3:Ge42; Flask:3:Mt25; Jug|Cruse:2:1Ki17; Urn|Golden jar:1:Heb9; Chest:1:2Ki12; Cistern|Pit:3:Ge37
Bottle:2:Ps56; Ark:2:Ex2; Bucket:1:Isa40; Box:1:2Ki9; Censer:1:Lev16; Barrel:1:1Ki18; Cauldron|Kettle:1:1Sa2

@tools|Objects|Name a tool or farming tool mentioned in the Bible
Plough|Plow:5:Lk9; Sickle:4:Rev14; Yoke:4:Mt11; Ox goad|Goad:3:Ac26; Threshing floor|Threshing sledge:3:Ru3; Winnowing fork|Fan:3:Mt3
Millstone:4:Mt18; Axe:4:Mt3; Hammer:3:Jer23; Chisel:1:Ex20; Saw:2:Heb11; Net:4:Mt4; Pruning hook:3:Isa2; Hoe|Mattock:1:1Sa13
Sieve:1:Am9; Pitchfork|Forks:1:1Sa13; Plumb line:2:Am7; Measuring line|Measuring rod:2:Rev11; Potter's wheel|Wheel:2:Jer18
Fishhook|Hook:2:Mt17; Anvil:0:Isa41; Bellows:1:Jer6; Spade|Shovel:1:Ex27; Lamp:3:Mt25

@rocks|Objects|Name a famous stone or rock from a Bible story
Jacob's pillow|Stone pillow:4:Ge28; Tablets of stone|Stone tablets:5:Ex31; David's stones|Five smooth stones:5:1Sa17
Rock that Moses struck|Rock in the wilderness|Rock:4:Ex17; Stone rolled away|Tomb stone:5:Mk16; Ebenezer:2:1Sa7
Cornerstone:3:Ps118; Twelve stones of the Jordan|Twelve stones:2:Jos4; Millstone:2:Jdg9; Peter|This rock:3:Mt16
White stone:1:Rev2; Stone cut without hands|Stone that became a mountain:2:Da2; Stones to bread:3:Mt4; Living stones:2:1Pe2
Stone at the well:2:Ge29; Stones for Stephen:2:Ac7; Stone heart|Heart of stone:2:Eze36; Stones crying out:2:Lk19

@staffs|Objects|Name a famous staff, rod or stick in the Bible
Moses' staff|Moses' rod:5:Ex4; Aaron's rod|Aaron's staff:5:Nu17; Jacob's peeled rods|Striped branches:1:Ge30; Elisha's staff:1:2Ki4
Rod and staff of Psalm 23|Rod and staff:4:Ps23; Jonathan's rod:1:1Sa14; David's staff:2:1Sa17; Judah's staff:1:Ge38
Rod of iron:2:Ps2; Shepherd's staff|Crook:2:Mic7; Jacob's staff:1:Heb11; Balaam's staff:1:Nu22

@trees-famous|Objects|Name a famous tree in a Bible story
Tree of life:5:Ge2; Tree of the knowledge of good and evil|Tree of knowledge:5:Ge2; Zacchaeus' sycamore|Sycamore:5:Lk19
Fig tree Jesus cursed|Fig tree:4:Mk11; Absalom's oak|Oak:2:2Sa18; Palm tree of Deborah|Deborah's palm:1:Jdg4; Broom tree|Juniper:2:1Ki19
Jonah's plant|Gourd:2:Jon4; Nebuchadnezzar's tree:1:Da4; Cedars of Lebanon:3:Ps104; Oaks of Mamre:1:Ge18; Mustard tree:3:Mt13
Olive trees of Gethsemane|Olive tree:2:Rom11; Nathanael's fig tree:1:Jn1; Burning bush:3:Ex3; Cross|Tree:2:1Pe2

@jewelry|Objects|Name a piece of jewelry or adornment in a Bible story
Signet ring:4:Ge41; Gold chain|Chain:3:Ge41; Earrings:4:Ex32; Nose ring:2:Ge24; Bracelets:3:Ge24; Ring|Prodigal's ring:4:Lk15
Crown:4:Est2; Necklace:2:Song1; Anklets:1:Isa3; Pearls:3:1Ti2; Breastpiece:2:Ex28; Headdress|Turban:1:Ex28; Royal crown:2:Est1

@scrolls|Objects|Name a book or scroll mentioned within the Bible
Book of Life:5:Rev20; Book of the Law:4:Dt31; Book of Jashar|Jasher:2:Jos10; Book of the Wars of the Lord:1:Nu21
Scroll with seven seals|Sealed scroll:3:Rev5; Jeremiah's scroll|Burned scroll:2:Jer36; Ezekiel's scroll:2:Eze3; Scroll of Isaiah:3:Lk4
Chronicles of the kings|Annals:1:1Ki14; Little scroll|Little book:2:Rev10; Book of Remembrance:1:Mal3; Flying scroll:1:Zec5
Book of the Covenant:1:Ex24; Paul's parchments|Parchments:1:2Ti4

@cups-jars|Objects|Name a famous cup, bowl or jar from a Bible story
Joseph's silver cup|Silver cup:4:Ge44; Cup of the Last Supper|Communion cup:5:Lk22; Widow's jar of oil|Jar of oil:3:1Ki17
Jar of flour:2:1Ki17; Water jars at Cana|Stone jars:4:Jn2; Alabaster jar:4:Mk14; Gideon's jars|Pitchers:3:Jdg7
Golden bowls:2:Rev5; Jar of manna:3:Heb9; Belshazzar's temple cups|Temple vessels:2:Da5; Samaritan woman's water jar:2:Jn4
Cup of wrath:1:Rev14; Gethsemane cup|Let this cup pass:3:Mt26; Cup of cold water:2:Mt10; Overflowing cup|My cup runs over:3:Ps23

@transport|Objects|Name a way people travelled in the Bible
Donkey:5:Mt21; Camel:5:Ge24; Horse:4:Rev6; Chariot:5:Ac8; Ship|Boat:5:Ac27; Cart:2:1Sa6; Mule:2:2Sa18; On foot|Walking:3:Lk24
Rafts:1:1Ki5; Litter|Carriage:1:Song3; Whirlwind:2:2Ki2; Basket:2:Ac9; Ark:2:Ge7; Great fish:2:Jon1

@temple-solomon|Objects|Name something in or about Solomon's temple
Ark of the Covenant|Ark:5:1Ki8; Cherubim:4:1Ki6; Altar:4:1Ki8; Gold:4:1Ki6; Cedar:4:1Ki6; Holy of Holies|Most Holy Place|Inner sanctuary:4:1Ki6
Lampstands:3:1Ki7; Jachin:1:1Ki7; Boaz:1:1Ki7; Bronze sea|Molten sea|The Sea:2:1Ki7; Basins|Stands:1:1Ki7; Porch|Portico:1:1Ki6
Pillars:3:1Ki7; Hiram:2:1Ki7; Cloud|Glory:3:1Ki8; Stones:2:1Ki6; Olive wood:1:1Ki6; Table:1:1Ki7

@psalm23|Scripture|Name something mentioned in Psalm 23
Shepherd:5:Ps23; Green pastures|Pastures:5:Ps23; Still waters|Quiet waters:5:Ps23; Paths of righteousness|Paths:4:Ps23
Valley of the shadow of death|Valley:5:Ps23; Rod:4:Ps23; Staff:4:Ps23; Table:4:Ps23; Oil:3:Ps23; Cup:4:Ps23
Goodness:3:Ps23; Mercy|Love:3:Ps23; House of the Lord:4:Ps23; Enemies:3:Ps23; Soul:3:Ps23; Evil:2:Ps23; Head:2:Ps23; Want:2:Ps23

@psalm-writers|Scripture|Name someone who wrote a psalm
David:5:Ps3; Asaph:3:Ps50; Sons of Korah|Korah:3:Ps42; Solomon:3:Ps72; Moses:3:Ps90; Heman:1:Ps88; Ethan:1:Ps89

@languages|Scripture|Name a language the Bible was originally written in
Hebrew:5:Ge1; Greek:5:Jn1; Aramaic:4:Da2

@translations|Scripture|Name an English Bible translation (or version)
King James|KJV|King James Version:5:Ge1; NIV|New International Version:5:Ge1; ESV|English Standard Version:4:Ge1
NKJV|New King James:3:Ge1; NASB|New American Standard:3:Ge1; NLT|New Living Translation:3:Ge1; RSV|Revised Standard Version:2:Ge1
NRSV|New Revised Standard Version:2:Ge1; The Message|Message:3:Ge1; Amplified|Amplified Bible:2:Ge1; CSB|Christian Standard Bible|HCSB:2:Ge1
Geneva Bible|Geneva:1:Ge1; Tyndale:1:Ge1; Douay-Rheims|Douay:1:Ge1; Good News|Good News Bible|GNT:2:Ge1; Living Bible:1:Ge1
American Standard Version|ASV:1:Ge1; New English Translation|NET:1:Ge1; Christian Standard:1:Ge1; Young's Literal:0:Ge1

@nt-books|Scripture|Name a book of the New Testament
Matthew:5:Mt1; Mark:5:Mk1; Luke:5:Lk1; John:5:Jn1; Acts:5:Ac1; Romans:5:Ro1; 1 Corinthians|First Corinthians|Corinthians:4:1Co1
2 Corinthians|Second Corinthians:3:2Co1; Galatians:4:Gal1; Ephesians:4:Eph1; Philippians:4:Php1; Colossians:3:Col1
1 Thessalonians|First Thessalonians|Thessalonians:3:1Th1; 2 Thessalonians|Second Thessalonians:2:2Th1; 1 Timothy|First Timothy|Timothy:3:1Ti1
2 Timothy|Second Timothy:2:2Ti1; Titus:3:Tit1; Philemon:2:Phm1; Hebrews:4:Heb1; James:4:Jas1; 1 Peter|First Peter|Peter:3:1Pe1
2 Peter|Second Peter:2:2Pe1; 1 John|First John:3:1Jn1; 2 John|Second John:2:2Jn1; 3 John|Third John:1:3Jn1; Jude:2:Jude1
Revelation|Revelations|Apocalypse:5:Rev1

@ot-books|Scripture|Name a book of the Old Testament
Genesis:5:Ge1; Exodus:5:Ex1; Leviticus:4:Lev1; Numbers:4:Nu1; Deuteronomy:4:Dt1; Joshua:4:Jos1; Judges:3:Jdg1; Ruth:4:Ru1
1 Samuel|First Samuel|Samuel:3:1Sa1; 2 Samuel|Second Samuel:2:2Sa1; 1 Kings|First Kings|Kings:3:1Ki1; 2 Kings|Second Kings:2:2Ki1
1 Chronicles|First Chronicles|Chronicles:2:1Ch1; 2 Chronicles|Second Chronicles:1:2Ch1; Ezra:2:Ezr1; Nehemiah:2:Ne1; Esther:3:Est1
Job:4:Job1; Psalms|Psalm:5:Ps1; Proverbs:5:Pr1; Ecclesiastes:3:Ec1; Song of Solomon|Song of Songs:3:Song1; Isaiah:4:Isa1
Jeremiah:3:Jer1; Lamentations:2:La1; Ezekiel:3:Eze1; Daniel:4:Da1; Hosea:2:Hos1; Joel:2:Joel1; Amos:2:Am1; Obadiah:1:Ob1
Jonah:3:Jon1; Micah:2:Mic1; Nahum:1:Na1; Habakkuk:1:Hab1; Zephaniah:1:Zep1; Haggai:1:Hag1; Zechariah:1:Zec1; Malachi:2:Mal1

@pauls-letters|Scripture|Name a letter in the New Testament written by Paul
Romans:5:Ro1; 1 Corinthians|First Corinthians|Corinthians:5:1Co1; 2 Corinthians|Second Corinthians:3:2Co1; Galatians:4:Gal1
Ephesians:5:Eph1; Philippians:4:Php1; Colossians:3:Col1; 1 Thessalonians|First Thessalonians|Thessalonians:3:1Th1
2 Thessalonians|Second Thessalonians:2:2Th1; 1 Timothy|First Timothy|Timothy:4:1Ti1; 2 Timothy|Second Timothy:2:2Ti1
Titus:3:Tit1; Philemon:2:Phm1

@general-letters|Scripture|Name a New Testament letter NOT written by Paul
Hebrews:4:Heb1; James:5:Jas1; 1 Peter|First Peter|Peter:4:1Pe1; 2 Peter|Second Peter:3:2Pe1; 1 John|First John|John:4:1Jn1
2 John|Second John:2:2Jn1; 3 John|Third John:2:3Jn1; Jude:3:Jude1; Revelation:2:Rev1

@gospels|Scripture|Name one of the four Gospels
Matthew:5:Mt1; Mark:5:Mk1; Luke:5:Lk1; John:5:Jn1

@law-books|Scripture|Name one of the five books of the Law (the Torah / Pentateuch)
Genesis:5:Ge1; Exodus:5:Ex1; Leviticus:4:Lev1; Numbers:4:Nu1; Deuteronomy:4:Dt1

@history-books|Scripture|Name an Old Testament history book (Joshua–Esther)
Joshua:4:Jos1; Judges:4:Jdg1; Ruth:4:Ru1; 1 Samuel|First Samuel|Samuel:4:1Sa1; 2 Samuel|Second Samuel:3:2Sa1
1 Kings|First Kings|Kings:4:1Ki1; 2 Kings|Second Kings:3:2Ki1; 1 Chronicles|First Chronicles|Chronicles:3:1Ch1
2 Chronicles|Second Chronicles:2:2Ch1; Ezra:3:Ezr1; Nehemiah:3:Ne1; Esther:4:Est1

@wisdom-books|Scripture|Name a book of poetry or wisdom in the Old Testament
Job:4:Job1; Psalms|Psalm:5:Ps1; Proverbs:5:Pr1; Ecclesiastes:4:Ec1; Song of Solomon|Song of Songs:4:Song1; Lamentations:2:La1

@one-chapter|Scripture|Name a book of the Bible that has only one chapter
Obadiah:4:Ob1; Philemon:4:Phm1; 2 John|Second John:4:2Jn1; 3 John|Third John:4:3Jn1; Jude:4:Jude1

@short-titles|Scripture|Name a book of the Bible with a one-word title of four letters or fewer
Job:5:Job1; Ruth:5:Ru1; Joel:3:Joel1; Amos:3:Am1; Mark:5:Mk1; Luke:5:Lk1; John:5:Jn1; Acts:4:Ac1; Jude:3:Jude1; Ezra:3:Ezr1

@john-books|Scripture|Name a book of the Bible traditionally credited to the apostle John
John|Gospel of John:5:Jn1; 1 John|First John:4:1Jn1; 2 John|Second John:3:2Jn1; 3 John|Third John:3:3Jn1; Revelation:4:Rev1

@famous-verses|Scripture|Name a famous Bible verse by its reference (e.g. "John 3:16")
John 3:16:5:Jn3; Genesis 1:1:4:Ge1; Psalm 23:1|Psalm 23:4:Ps23; Romans 8:28:4:Ro8; Jeremiah 29:11:4:Jer29
Philippians 4:13:4:Php4; Proverbs 3:5|Proverbs 3:5-6:3:Pr3; Joshua 1:9:3:Jos1; Isaiah 40:31:3:Isa40; Matthew 28:19|Matthew 28:19-20:3:Mt28
Romans 3:23:3:Ro3; Romans 6:23:3:Ro6; John 14:6:3:Jn14; John 11:35:3:Jn11; Psalm 46:10:2:Ps46; Ephesians 2:8|Ephesians 2:8-9:2:Eph2
Hebrews 11:1:2:Heb11; Romans 12:2:2:Ro12; Galatians 5:22:2:Gal5; 2 Timothy 3:16:2:2Ti3; Matthew 6:33:2:Mt6; 1 Corinthians 13:4:2:1Co13
Romans 10:9:2:Ro10; Psalm 119:105:2:Ps119; Micah 6:8:2:Mic6; Isaiah 53:5:1:Isa53; Lamentations 3:22|Lamentations 3:22-23:1:La3
Matthew 11:28:2:Mt11; Revelation 3:20:1:Rev3; 1 John 1:9:2:1Jn1; Proverbs 22:6:1:Pr22; Joshua 24:15:2:Jos24

@idioms|Scripture|Name a common English saying or phrase that comes from the Bible
Good Samaritan:5:Lk10; Salt of the earth:4:Mt5; Writing on the wall|The writing is on the wall:4:Da5; Drop in the bucket:3:Isa40
Skin of your teeth|By the skin of my teeth:4:Job19; Blind leading the blind:4:Mt15; Leopard can't change its spots|Leopard change his spots:3:Jer13
Go the extra mile|Extra mile:4:Mt5; Turn the other cheek:5:Mt5; Eat drink and be merry:3:Ecc8; Labor of love|Labour of love:3:1Th1
Nothing new under the sun:4:Ec1; Pride goes before a fall|Pride comes before a fall:4:Pr16; Eye for an eye|An eye for an eye:5:Ex21
Am I my brother's keeper|My brother's keeper|Brother's keeper:4:Ge4; Forbidden fruit:4:Ge3; Powers that be:2:Ro13; House divided:3:Mk3
Wolf in sheep's clothing:4:Mt7; Apple of my eye|Apple of his eye:3:Dt32; Law unto themselves:2:Ro2; Sour grapes:2:Eze18
Feet of clay:2:Da2; Patience of Job:3:Jas5; Still small voice:3:1Ki19; Fight the good fight:3:1Ti6; Straight and narrow|Narrow way:3:Mt7
Cast the first stone|First stone:4:Jn8; Prodigal son:4:Lk15; Fly in the ointment:2:Ec10; Can't serve two masters|Two masters:3:Mt6
Sign of the times|Signs of the times:3:Mt16; Spare the rod:3:Pr13; Do unto others|Golden rule:4:Mt7; Fall from grace:3:Gal5
Born again:4:Jn3; Bite the dust|Lick the dust:1:Ps72; Rise and shine:2:Isa60; Holier than thou:2:Isa65; Living off the fat of the land|Fat of the land:2:Ge45
A soft answer turns away wrath|Soft answer:2:Pr15; Seek and you shall find:3:Mt7; Hide your light under a bushel|Under a bushel:3:Mt5

@aramaic-words|Scripture|Name a Hebrew, Aramaic or Greek word that appears in English Bibles
Amen:5:Dt27; Hallelujah|Alleluia:5:Rev19; Hosanna:5:Mt21; Abba:4:Ro8; Maranatha:2:1Co16; Selah:3:Ps3; Rabbi:4:Jn1
Messiah:4:Jn1; Emmanuel|Immanuel:4:Mt1; Talitha cumi|Talitha koum:2:Mk5; Ephphatha:1:Mk7; Eloi|Eli:2:Mk15; Raca:1:Mt5
Mammon:2:Mt6; Corban:1:Mk7; Golgotha:3:Jn19; Sabachthani|Lama sabachthani:1:Mt27; Shibboleth:1:Jdg12; Mene|Mene Tekel:2:Da5
Rabboni:2:Jn20; Cherubim:2:Ge3; Seraphim:2:Isa6; Sabbath:3:Ex20; Shekel:2:Ge23; Manna:3:Ex16; Gehenna:1:Mt5; Hades|Sheol:2:Rev1

@living-things|Faith|Finish the phrase: "living ___" as it appears in the Bible
Living water:5:Jn4; Living bread:4:Jn6; Living stones:3:1Pe2; Living hope:3:1Pe1; Living sacrifice:4:Ro12; Living God:4:Mt16
Living creatures:3:Rev4; Living soul|Living being:2:Ge2; Living word:2:Heb4; Living way:1:Heb10; Land of the living:2:Ps27

@new-things|Faith|Finish the phrase: "new ___" as it appears in the Bible
New covenant:5:Jer31; New heaven:4:Rev21; New earth:4:Rev21; New Jerusalem:5:Rev21; New song:4:Ps40; New creation|New creature:4:2Co5
New commandment:3:Jn13; New name:2:Rev2; New wine:3:Mk2; New heart:3:Eze36; New spirit:2:Eze36; New birth:2:1Pe1
New self|New man:2:Eph4; New mercies|New every morning:3:La3; New tongues:1:Mk16; New life:3:Ro6; New moon:1:Nu10; New things:1:Isa43

@put-on|Faith|Name something the Bible tells believers to "put on" or "clothe yourselves with"
Armor of God|Armor|Whole armor of God:5:Eph6; Love:5:Col3; Compassion:4:Col3; Kindness:4:Col3; Humility:4:Col3
Gentleness|Meekness:3:Col3; Patience:4:Col3; New self|New man:3:Eph4; Christ|The Lord Jesus Christ:3:Ro13; Armor of light:2:Ro13
Breastplate of faith and love:1:1Th5; Helmet of salvation:2:1Th5; Forgiveness:2:Col3; Righteousness:1:Job29; Strength:1:Isa52

@afterlife|Faith|Name a word the Bible uses for heaven, hell or the place of the dead
Heaven:5:Mt6; Hell:5:Mt5; Sheol:3:Ps16; Hades:3:Rev1; Paradise:4:Lk23; Abraham's side|Abraham's bosom:2:Lk16; Gehenna:2:Mt5
Lake of fire:4:Rev20; Abyss|Bottomless pit:3:Rev9; Tartarus:1:2Pe2; Grave|Pit:3:Ps30; New heaven:2:Rev21; Outer darkness:2:Mt8
Father's house|Many rooms|Mansions:3:Jn14; Third heaven:1:2Co12; New Jerusalem:3:Rev21; Kingdom of heaven:3:Mt5

@abraham-promises|Faith|Name something God promised to Abraham
Land|Canaan|The land:5:Ge12; Descendants|Offspring|Children:5:Ge15; As many as the stars|Stars:4:Ge15; As many as the sand|Sand:3:Ge22
Great nation:4:Ge12; Blessing|Blessed:4:Ge12; Great name:3:Ge12; A son|Son|Isaac:5:Ge17; Kings:2:Ge17; Bless all nations|All families blessed:3:Ge12
Covenant:3:Ge17; Shield|Reward:2:Ge15

@elder-qualities|Faith|Name a quality Paul lists for church elders or overseers (1 Timothy 3, Titus 1)
Above reproach|Blameless:4:1Ti3; Faithful to his wife|Husband of one wife:3:1Ti3; Temperate|Sober:3:1Ti3; Self-controlled:3:1Ti3
Respectable:2:1Ti3; Hospitable|Hospitality:4:1Ti3; Able to teach:4:1Ti3; Not a drunkard|Not given to wine:3:1Ti3; Not violent:3:1Ti3
Gentle:3:1Ti3; Not quarrelsome:2:1Ti3; Not a lover of money|Not greedy:3:1Ti3; Manages his household well:2:1Ti3
Not a recent convert|Not a new convert:2:1Ti3; Good reputation:2:1Ti3; Holy:1:Tit1; Just|Upright:1:Tit1; Loves what is good:1:Tit1

@virtues|Faith|Name one of the "theological virtues" that remain in 1 Corinthians 13
Faith:5:1Co13; Hope:5:1Co13; Love|Charity:5:1Co13

@temptations|Jesus|Name one of the temptations of Jesus in the wilderness
Turn stones into bread|Stones into bread|Bread:5:Mt4; Throw himself from the temple|Jump from the temple|Temple:5:Mt4
Worship Satan for the kingdoms of the world|Kingdoms of the world|Worship Satan:5:Mt4

@sermon-mount|Jesus|Name a teaching from the Sermon on the Mount
Beatitudes:5:Mt5; Salt of the earth:4:Mt5; Light of the world:4:Mt5; Lord's Prayer:5:Mt6; Turn the other cheek:4:Mt5
Love your enemies:5:Mt5; Golden rule|Do unto others:4:Mt7; House on the rock|Wise and foolish builders:4:Mt7; Do not worry|Don't worry:4:Mt6
Treasures in heaven:4:Mt6; Do not judge|Judge not:4:Mt7; Ask seek knock|Ask and it will be given:4:Mt7; Narrow gate:3:Mt7
Lilies of the field|Consider the lilies:3:Mt6; Go the extra mile:3:Mt5; Plank in your eye|Speck and log|Log in your eye:3:Mt7
Wolves in sheep's clothing|False prophets:2:Mt7; Seek first the kingdom:3:Mt6; Giving to the needy|Secret giving:2:Mt6; Fasting:2:Mt6
City on a hill:3:Mt5; Two masters:2:Mt6; Birds of the air:3:Mt6; Oaths|Let your yes be yes:2:Mt5; Pearls before swine:2:Mt7

@followers-called|Jesus|Name something Jesus called his followers
Salt|Salt of the earth:5:Mt5; Light|Light of the world:5:Mt5; Sheep:4:Jn10; Friends:4:Jn15; Branches:4:Jn15; Fishers of men:5:Mt4
Disciples:4:Jn13; Children|Little children:3:Jn13; Servants:2:Lk17; Little flock|Flock:3:Lk12; Brothers|Brothers and sisters:2:Mt12
Witnesses:3:Ac1; Sons of Thunder:1:Mk3; Workers|Laborers:2:Mt9

@lost-parables|Jesus|Name one of the parables about something lost and found (Luke 15)
Lost sheep|Sheep:5:Lk15; Lost coin|Coin:5:Lk15; Lost son|Prodigal son|Son:5:Lk15

@farm-parables|Jesus|Name a parable of Jesus that involves seeds, plants, farms or vineyards
Sower|Parable of the sower|Four soils:5:Mt13; Mustard seed:5:Mt13; Wheat and tares|Wheat and weeds|Tares:4:Mt13; Growing seed:2:Mk4
Barren fig tree|Fig tree:3:Lk13; Workers in the vineyard|Laborers in the vineyard:3:Mt20; Wicked tenants|Tenants:3:Mk12
Rich fool|Bigger barns:3:Lk12; Two sons:2:Mt21; True vine:2:Jn15; Lost sheep:1:Lk15

@parable-objects|Jesus|Name an object or image Jesus used in a parable
Seed:5:Mt13; Lamp:4:Mt5; Coin:4:Lk15; Pearl:4:Mt13; Net:3:Mt13; Yeast|Leaven:4:Mt13; Sheep:4:Lk15; Vineyard:3:Mt20
Wedding garment:2:Mt22; Talents|Bags of gold:4:Mt25; House on the rock|Rock:4:Mt7; Sand:3:Mt7; Wineskins:3:Mk2; New wine:2:Mk2
Mustard seed:4:Mt13; Fig tree:3:Lk13; Treasure:3:Mt13; Lamp oil|Oil:3:Mt25; Barns:3:Lk12; Fatted calf:2:Lk15; Patch|Cloth:2:Mk2
Rocky ground|Thorns:2:Mt13; Banquet|Feast:2:Lk14; Robe|Ring:2:Lk15; Bushel|Basket:2:Mt5; Plough:1:Lk9; Tower:1:Lk14

@jesus-last-week|Jesus|Name something Jesus did during the last week before the cross
Rode a donkey into Jerusalem|Triumphal entry|Rode a donkey:5:Mt21; Cleared the temple|Cleansed the temple|Overturned the tables:4:Mt21
Cursed the fig tree|Fig tree:3:Mk11; Last Supper:5:Mt26; Washed the disciples' feet|Washed feet:4:Jn13; Prayed in Gethsemane|Prayed:4:Mt26
Was betrayed|Betrayed:3:Mt26; Was arrested|Arrested:3:Mt26; Was anointed at Bethany|Anointed:2:Mk14; Taught in the temple:3:Mk12
Wept over Jerusalem:3:Lk19; Predicted Peter's denial:3:Mt26; Broke bread|Communion:3:Lk22; Was crucified|Crucified:4:Mt27

@numbers|Numbers|Name a number that is important in a famous Bible story
40|Forty:5:Ge7; 7|Seven:5:Ge2; 12|Twelve:5:Mt10; 3|Three:5:Jon1; 10|Ten:4:Ex20; 70|Seventy:2:Jer25; 666:4:Rev13
144000|144,000:3:Rev7; 5000|Five thousand:4:Jn6; 300|Three hundred:3:Jdg7; 30|Thirty:3:Mt26; 153:2:Jn21; 969:2:Ge5
1000|Thousand:2:Rev20; 2|Two:3:Ge7; 6|Six:3:Ge1; 4|Four:2:Rev6; 5|Five:3:1Sa17; 77|Seventy-seven|70 times 7|Seventy times seven:3:Mt18
99|Ninety-nine:3:Lk15; 430:1:Ex12; 4000|Four thousand:2:Mk8; 8|Eight:1:1Pe3; 100:2:Ge21; 120:1:Dt34; 600:1:Ge7

@forty|Numbers|Name something in the Bible that lasted (or numbered) forty
Rain of the flood|Flood rain|Rain:5:Ge7; Israel's years in the wilderness|Wilderness wandering|Wilderness:5:Nu14; Jesus' fast|Jesus' temptation:5:Mt4
Moses on Mount Sinai|Moses on the mountain:4:Ex24; Spies in Canaan|Spying out Canaan:3:Nu13; Goliath's challenge|Goliath:2:1Sa17
Elijah's journey to Horeb|Elijah:3:1Ki19; Nineveh's warning|Jonah's warning:3:Jon3; Jesus' appearances after the resurrection|Resurrection appearances:3:Ac1
Saul's reign:1:Ac13; David's reign:2:2Sa5; Solomon's reign:1:1Ki11; Lashes|Forty lashes:1:Dt25; Embalming of Jacob:0:Ge50

@sevens|Numbers|Name something in the Bible that came in sevens
Days of creation|Creation week:5:Ge2; Seven churches:4:Rev1; Seven seals:4:Rev6; Seven trumpets:3:Rev8; Seven bowls:3:Rev16
Marching around Jericho|Jericho:4:Jos6; Pairs of clean animals:2:Ge7; Years of plenty|Seven fat cows:4:Ge41; Years of famine:4:Ge41
Naaman's dips in the Jordan|Naaman:3:2Ki5; Loaves:2:Mt15; Baskets left over:2:Mk8; Demons from Mary Magdalene:2:Lk8
Seven deacons:2:Ac6; Lampstand branches|Menorah:2:Ex25; Seventy times seven|Forgiveness:3:Mt18; Years for Rachel:3:Ge29
Seven sons of Sceva:1:Ac19; Seven stars:2:Rev1; Seven spirits:1:Rev1; Seven times hotter furnace|Furnace:2:Da3; Sabbath:3:Ex20

@twelves|Numbers|Name something in the Bible that numbered twelve
Apostles|Disciples:5:Mt10; Tribes of Israel|Tribes:5:Ge49; Sons of Jacob:5:Ge35; Baskets of leftovers|Baskets:4:Mt14; Spies:4:Nu13
Gates of the New Jerusalem|Gates:3:Rev21; Foundations:2:Rev21; Stones from the Jordan|Stones:3:Jos4; Years old Jesus in the temple|Jesus' age:3:Lk2
Years of bleeding|Woman with the issue of blood:3:Mk5; Jairus's daughter's age:2:Mk5; Springs at Elim:1:Ex15; Stars on the woman's crown|Stars:1:Rev12
Legions of angels:2:Mt26; Fruits of the tree of life:1:Rev22; Pillars at Sinai:1:Ex24; Stones on the breastpiece:2:Ex28; Minor prophets:2:Hos1
`)
