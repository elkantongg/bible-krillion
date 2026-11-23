// Animals, plants, nature, food and drink.
import { bank } from './define'

export const natureBank = bank(`
@birds|Animals|Name a bird mentioned in the Bible
Dove:5:Ge8; Raven:5:Ge8; Eagle:4:Isa40; Sparrow:4:Mt10; Quail:4:Ex16; Hen:2:Mt23; Rooster|Cock|Cockerel:4:Mt26
Owl:2:Lev11; Vulture:2:Lev11; Ostrich:2:Job39; Pelican:1:Ps102; Stork:1:Jer8; Swallow:1:Pr26; Peacock:1:1Ki10
Partridge:1:1Sa26; Heron:0:Lev11; Hawk|Falcon:1:Job39; Crane:0:Isa38; Hoopoe|Lapwing:0:Lev11; Cormorant:0:Lev11
Kite:0:Dt14; Pigeon|Turtledove:3:Lk2; Gull|Seagull:0:Lev11; Osprey:0:Lev11

@small-creatures|Animals|Name an insect or small creature mentioned in the Bible
Locust:5:Ex10; Bee|Bees:4:Jdg14; Ant:4:Pr6; Frog:4:Ex8; Fly|Flies:4:Ex8; Gnat|Lice:3:Ex8; Moth:3:Mt6; Flea:1:1Sa24
Hornet:2:Ex23; Grasshopper:2:Nu13; Cricket:1:Lev11; Worm|Maggot:3:Jon4; Spider:2:Pr30; Scorpion:3:Lk10; Snail:1:Ps58
Leech:0:Pr30; Lizard:1:Lev11; Gecko:0:Lev11; Mouse|Mice:2:1Sa6; Caterpillar:0:Joel1; Snake|Serpent:3:Ge3

@wild-animals|Animals|Name a wild animal mentioned in the Bible
Lion:5:Da6; Bear:5:1Sa17; Wolf:4:Mt7; Leopard:3:Jer13; Fox:4:Lk13; Jackal:2:Isa13; Deer|Hart|Doe:3:Ps42; Gazelle:2:Dt14
Wild donkey|Wild ass:2:Job39; Wild ox|Unicorn:1:Job39; Behemoth:2:Job40; Hyena:1:Isa13; Boar|Wild boar:1:Ps80; Ape|Apes:1:1Ki10
Hyrax|Coney|Rock badger:1:Pr30; Ibex|Wild goat:1:Dt14; Antelope:0:Dt14; Monkey|Baboon:0:1Ki10; Serpent|Snake:3:Ge3; Leviathan:2:Job41

@livestock|Animals|Name a farm animal or kind of livestock in the Bible
Sheep:5:Ge4; Goat:5:Ge27; Cattle|Ox|Cow|Oxen:5:Ex20; Donkey|Ass:5:Nu22; Camel:4:Ge24; Horse:4:Ex14; Mule:2:2Sa18
Pig|Swine:3:Lk15; Lamb:4:Ex12; Calf:3:Lk15; Bull|Bullock:3:1Ki18; Ram:3:Ge22; Heifer:1:Nu19; Hen|Chicken:2:Mt23
Kid|Young goat:2:Lk15; Ewe:1:2Sa12

@jesus-animals|Animals|Name an animal Jesus mentioned in his teaching
Sheep:5:Jn10; Goat:4:Mt25; Wolf|Wolves:4:Mt10; Fox|Foxes:3:Mt8; Birds:4:Mt6; Sparrow:4:Mt10; Raven:2:Lk12
Camel:4:Mt19; Pig|Swine|Pigs:3:Mt7; Dog|Dogs:3:Mt7; Snake|Serpent:3:Mt10; Dove:3:Mt10; Hen:2:Mt23; Fish:3:Mt7
Donkey|Ox:2:Lk13; Scorpion:2:Lk11; Vulture|Eagle:1:Mt24; Gnat:2:Mt23; Moth:2:Mt6; Calf:2:Lk15; Lamb:1:Lk10

@story-animals|Animals|Name an animal from a famous Bible story
Serpent|Snake:5:Ge3; Dove:5:Ge8; Raven:4:Ge8; Ram:4:Ge22; Donkey:4:Nu22; Lion|Lions:5:Da6; Great fish|Whale|Fish:5:Jon1
Bear|Bears:3:2Ki2; Pigs|Swine:3:Mk5; Rooster|Cock:4:Mt26; Quail:3:Ex16; Frogs:3:Ex8; Locusts:3:Ex10; Golden calf|Calf:4:Ex32
Foxes:2:Jdg15; Camel:2:Ge24; Fatted calf:3:Lk15; Lamb:4:Ex12; Lost sheep|Sheep:4:Lk15; Colt:3:Mt21

@clean-food|Animals|Name an animal the Law of Moses says is clean to eat
Ox|Cattle|Cow:5:Dt14; Sheep:5:Dt14; Goat:5:Dt14; Deer:4:Dt14; Gazelle:3:Dt14; Roebuck|Roe deer:1:Dt14; Wild goat|Ibex:1:Dt14
Antelope:1:Dt14; Mountain sheep:0:Dt14; Locust:3:Lev11; Grasshopper|Cricket:2:Lev11; Fish with fins and scales|Fish:4:Lev11
Pigeon|Dove:2:Lev1; Quail:1:Ex16

@unclean|Animals|Name an animal the Law of Moses calls unclean
Pig|Swine|Pork:5:Lev11; Camel:4:Lev11; Rabbit|Hare:3:Lev11; Hyrax|Coney|Rock badger:2:Lev11; Eagle:2:Lev11; Vulture:2:Lev11
Raven:2:Lev11; Owl:2:Lev11; Bat:2:Lev11; Mouse:2:Lev11; Lizard:1:Lev11; Weasel:1:Lev11; Chameleon:0:Lev11; Stork:1:Lev11
Heron:0:Lev11; Shellfish|Fish without scales:3:Lev11; Gecko:0:Lev11; Hoopoe:0:Lev11; Snake|Serpent:1:Lev11; Ostrich:0:Lev11

@sacrifice-animals|Animals|Name an animal that was offered as a sacrifice
Lamb:5:Ex12; Ram:5:Ge22; Bull|Bullock|Ox:4:Lev1; Goat:4:Lev16; Dove|Turtledove:4:Lk2; Pigeon:3:Lk2; Heifer|Red heifer:2:Nu19
Calf:2:1Sa28; Sheep:4:Lev1; Scapegoat:2:Lev16

@vision-animals|Animals|Name an animal seen in a vision in Daniel, Ezekiel or Revelation
Lion:5:Da7; Bear:4:Da7; Leopard:4:Da7; Ram:3:Da8; Goat:3:Da8; Beast:4:Rev13; Dragon:4:Rev12; Lamb:5:Rev5
Locusts:3:Rev9; Horses:4:Rev6; Frogs:2:Rev16; Eagle:3:Eze1; Calf|Ox:2:Rev4; Scorpions:1:Rev9; Serpent:1:Rev12

@punishment-creatures|Animals|Name a creature God sent as a plague or punishment
Frogs:5:Ex8; Gnats|Lice:4:Ex8; Flies:4:Ex8; Locusts:5:Ex10; Fiery serpents|Snakes|Serpents:4:Nu21; Bears:3:2Ki2
Lions:2:2Ki17; Hornets:1:Ex23; Worms:2:Ac12; Quail:1:Nu11; Great fish:2:Jon1; Mice|Rats:1:1Sa6

@animal-pictures|Animals|Name an animal the Bible uses as a picture of God, Jesus or the Holy Spirit
Lamb:5:Jn1; Lion|Lion of Judah:5:Rev5; Dove:5:Mt3; Hen|Mother hen:3:Mt23; Eagle:3:Dt32; Bear:0:Hos13; Leopard:0:Hos13

@job-animals|Animals|Name an animal God describes in Job 38–41
Lion:4:Job38; Raven:3:Job38; Mountain goat|Wild goat:2:Job39; Deer|Doe:2:Job39; Wild donkey:2:Job39; Wild ox:2:Job39
Ostrich:3:Job39; Horse|War horse:4:Job39; Hawk:2:Job39; Eagle:3:Job39; Behemoth:4:Job40; Leviathan:4:Job41; Stork:1:Job39

@proverbs-animals|Animals|Name an animal mentioned in Proverbs
Ant:5:Pr6; Lion:4:Pr28; Dog:4:Pr26; Pig|Sow:2:Pr11; Eagle:2:Pr23; Bear:2:Pr17; Horse:2:Pr21; Donkey:2:Pr26; Ox:2:Pr14
Hyrax|Coney|Rock badger:1:Pr30; Locust:2:Pr30; Lizard|Spider:1:Pr30; Leech:0:Pr30; Serpent|Snake:2:Pr23; Sparrow:1:Pr26
Swallow:1:Pr26; Deer|Doe:1:Pr5; Rooster:0:Pr30; Goat:1:Pr27; Lamb:1:Pr27; Raven:1:Pr30

@baby-animals|Animals|Name a baby animal mentioned in the Bible
Lamb:5:Ex12; Calf:4:Lk15; Kid|Young goat:3:Lk15; Colt|Foal:4:Mt21; Cub|Lion cub:2:Na2; Chicks|Brood:2:Mt23; Fawn:1:Song2
Young pigeons:1:Lk2; Young ravens:0:Ps147

@trees|Nature|Name a tree mentioned in the Bible
Fig:5:Mk11; Olive:5:Ps52; Cedar|Cedar of Lebanon:4:1Ki5; Palm|Date palm:4:Jn12; Oak|Terebinth:3:Ge35; Sycamore|Sycamore-fig:4:Lk19
Acacia|Shittim:2:Ex25; Cypress|Fir:2:Isa41; Willow:2:Ps137; Almond:2:Nu17; Pomegranate:2:1Sa14; Tamarisk:1:Ge21; Myrtle:1:Zec1
Juniper|Broom tree:2:1Ki19; Apple:1:Song2; Mulberry:1:Lk17; Poplar:1:Ge30; Plane|Chestnut:0:Ge30; Tree of life:4:Ge2
Tree of knowledge:4:Ge2; Mustard tree|Mustard:3:Mt13; Vine|Grapevine:3:Jn15; Pine:0:Isa60; Gopher wood:1:Ge6

@fruits|Food & Drink|Name a fruit mentioned in the Bible
Fig:5:Mk11; Grape|Grapes:5:Nu13; Olive:4:Dt8; Pomegranate:4:Nu13; Date|Dates:2:2Sa6; Apple:2:Song2; Melon:2:Nu11
Raisins:2:1Sa25; Mandrake|Mandrakes:1:Ge30; Sycamore fig:1:Am7; Almond:2:Ge43; Pistachio:0:Ge43; Summer fruit:0:Am8

@vegetables|Food & Drink|Name a vegetable, herb or spice used for food in the Bible
Leek|Leeks:3:Nu11; Onion|Onions:4:Nu11; Garlic:4:Nu11; Cucumber|Cucumbers:3:Nu11; Lentils:4:Ge25; Beans:3:2Sa17
Bitter herbs:4:Ex12; Mint:3:Mt23; Dill|Anise:2:Mt23; Cumin:2:Mt23; Coriander:2:Ex16; Rue:1:Lk11; Mustard:3:Mt13
Salt:4:Mt5; Melon:2:Nu11; Vegetables|Pulse:3:Da1; Herbs:2:Pr15; Cinnamon:1:Ex30

@plants-flowers|Nature|Name a plant or flower mentioned in the Bible
Lily|Lilies:5:Mt6; Rose of Sharon|Rose:4:Song2; Hyssop:3:Ex12; Reed:3:Mt11; Bulrush|Papyrus|Rushes:3:Ex2
Thorns|Thistles:4:Ge3; Mustard:4:Mt13; Flax:2:Jos2; Wheat:4:Mt13; Barley:3:Ru1; Tares|Weeds:3:Mt13; Vine:4:Jn15
Gourd|Plant|Vine of Jonah:3:Jon4; Crocus:1:Isa35; Mandrake:1:Ge30; Grass:3:Isa40; Lotus:0:Job40; Nettles:0:Pr24
Wormwood:1:Rev8; Gall:1:Mt27; Cockle:0:Job31; Burning bush|Bush:3:Ex3

@crops|Food & Drink|Name a crop grown by farmers in Bible times
Wheat:5:Ru2; Barley:5:Ru1; Grapes|Vines:5:Nu13; Olives:4:Dt8; Figs:4:Dt8; Flax:2:Jos2; Millet:1:Eze4; Spelt:1:Ex9
Lentils:2:2Sa23; Beans:1:Eze4; Pomegranates:2:Dt8; Dates|Palms:1:Dt8; Cucumbers:1:Isa1; Corn|Grain:3:Ge41

@spices|Nature|Name a spice, perfume or incense mentioned in the Bible
Myrrh:5:Mt2; Frankincense:5:Mt2; Aloes:2:Jn19; Cinnamon:2:Ex30; Spikenard|Nard:3:Jn12; Cassia:1:Ex30; Saffron:1:Song4
Calamus|Sweet cane:1:Ex30; Balm|Balm of Gilead:2:Jer8; Galbanum:0:Ex30; Stacte:0:Ex30; Onycha:0:Ex30; Henna|Camphire:0:Song1
Incense:3:Ex30; Bdellium:0:Nu11; Spices:3:Mk16

@weather|Nature|Name a kind of weather or natural disaster in the Bible
Flood:5:Ge7; Hail:4:Ex9; Earthquake:4:Mt28; Famine:4:Ge41; Drought:4:1Ki17; Storm|Tempest:5:Mk4; Whirlwind:3:2Ki2
Lightning:3:Ex19; Thunder:3:Ex19; Rain:4:Ge7; Fire from heaven|Fire:3:1Ki18; Darkness:3:Ex10; East wind|Wind:3:Ex14
Snow:2:Ps51; Rainbow:3:Ge9; Dew:2:Jdg6; Frost:1:Ex16; Cloud|Clouds:3:1Ki18; Sandstorm|Dust:0:Dt28; Heat|Scorching sun:1:Jon4

@sky|Nature|Name something in the sky that the Bible mentions
Sun:5:Ge1; Moon:5:Ge1; Stars:5:Ge1; Rainbow:4:Ge9; Clouds:4:Ex13; Star of Bethlehem|Star:4:Mt2; Orion:2:Job9
Pleiades|Seven stars:2:Job9; Bear|Great Bear|Arcturus:1:Job9; Morning star|Day star:3:Rev22; Mazzaroth|Constellations:0:Job38
Birds:3:Ge1; Lightning:2:Lk10; Pillar of cloud:3:Ex13; Chariot of fire:2:2Ki2; Angels:2:Lk2; Ladder:1:Ge28

@breastpiece|Nature|Name a precious stone on the high priest's breastpiece or the walls of the New Jerusalem
Jasper:4:Rev21; Sapphire:5:Rev21; Emerald:5:Rev21; Topaz:4:Rev21; Amethyst:4:Rev21; Onyx|Sardonyx:3:Rev21; Beryl:3:Rev21
Agate|Chalcedony:2:Rev21; Carnelian|Sardius|Sardis|Ruby:3:Rev21; Chrysolite:2:Rev21; Chrysoprase:1:Rev21; Jacinth|Turquoise:1:Rev21
Diamond:3:Ex28; Pearl:4:Rev21; Gold:4:Rev21; Crystal|Glass:2:Rev21; Ligure:0:Ex28; Carbuncle:0:Ex28

@metals|Nature|Name a metal mentioned in the Bible
Gold:5:Ge2; Silver:5:Ge13; Bronze|Brass:4:Nu21; Iron:4:Ge4; Copper:3:Dt8; Tin:2:Nu31; Lead:2:Nu31

@colours|Nature|Name a colour mentioned in the Bible
Scarlet:4:Isa1; Purple:5:Ac16; Blue:4:Ex28; White:5:Rev7; Black:4:Rev6; Red:5:Rev6; Green:3:Ps23; Crimson:3:Isa1
Vermilion:1:Jer22; Gold|Golden:3:Rev21; Pale:2:Rev6; Brown:0:Ge30; Yellow:1:Lev13; Grey|Gray:0:Ge42

@building-materials|Objects|Name a building material mentioned in the Bible
Stone|Stones:5:1Ki6; Cedar|Cedar wood:4:1Ki6; Gold:4:1Ki6; Bronze|Brass:3:1Ki7; Gopher wood|Cypress:3:Ge6; Acacia|Shittim wood:2:Ex25
Bricks:4:Ex5; Bitumen|Pitch|Tar:3:Ge11; Mortar:2:Ge11; Clay:2:Jer18; Olive wood:1:1Ki6; Straw:3:Ex5; Wood|Timber:3:1Ki5
Silver:2:Ex26; Linen:2:Ex26; Goat hair:1:Ex26; Sand:3:Mt7; Rock:4:Mt7; Iron:1:1Ch22; Marble:1:1Ch29; Lime|Plaster:1:Dt27

@provided-food|Food & Drink|Name a food that God miraculously provided in the Bible
Manna:5:Ex16; Quail:5:Ex16; Bread|Loaves:5:Jn6; Fish:5:Jn6; Wine:4:Jn2; Water:4:Ex17; Oil:3:1Ki17; Flour:3:1Ki17
Bread and meat from ravens|Meat:2:1Ki17; Cake|Bread from an angel:2:1Ki19; Barley loaves:1:2Ki4; Honey:1:Ps81

@passover-food|Food & Drink|Name something eaten or used at the Passover meal
Lamb|Passover lamb:5:Ex12; Unleavened bread|Matzah|Bread without yeast:5:Ex12; Bitter herbs:4:Ex12; Wine|Cup:3:Lk22
Hyssop:1:Ex12; Blood on the doorposts|Blood:3:Ex12; Bread:3:Mt26

@drinks|Food & Drink|Name a drink or liquid mentioned in the Bible
Water:5:Ex17; Wine:5:Jn2; Milk:4:Ex3; New wine:3:Mt9; Strong drink|Beer:2:Pr20; Vinegar|Sour wine:3:Jn19
Oil|Olive oil:3:1Ki17; Blood:2:Lev17; Honey:2:Ex3; Wine mixed with myrrh|Gall:2:Mk15; Living water:3:Jn4

@drink-moments|Food & Drink|Name a famous moment in the Bible involving a drink
Water into wine|Cana:5:Jn2; Water from the rock:4:Ex17; Woman at the well|Samaritan woman:4:Jn4; Last Supper cup|Cup of the new covenant:4:Lk22
Vinegar on the cross|Sour wine:3:Jn19; Cup of cold water:2:Mt10; Jael gave Sisera milk|Milk:2:Jdg4; Noah got drunk|Noah's wine:2:Ge9
Rebekah watered the camels|Rebekah:3:Ge24; David poured out the water|Bethlehem well:1:2Sa23; Gideon's men drinking|Lapping water:2:Jdg7
Belshazzar's wine:2:Da5; Daniel refused the king's wine:2:Da1; Bitter water of Marah|Marah:2:Ex15; Lot's daughters:1:Ge19
Hannah accused of being drunk|Hannah:1:1Sa1; Pentecost drunkenness|New wine:2:Ac2; Elijah and the widow's water:1:1Ki17

@jesus-food|Food & Drink|Name a food Jesus ate, served or blessed
Bread|Loaves:5:Jn6; Fish|Broiled fish:5:Lk24; Wine:4:Jn2; Lamb|Passover lamb:3:Lk22; Honeycomb:1:Lk24; Grain|Heads of grain:2:Mk2
Figs|Fig:2:Mk11; Barley loaves:2:Jn6; Unleavened bread:2:Mt26; Bitter herbs:1:Ex12

@john-baptist|Food & Drink|Name something John the Baptist ate or wore
Locusts:5:Mt3; Wild honey|Honey:5:Mt3; Camel's hair|Camel hair:5:Mt3; Leather belt|Belt|Girdle:4:Mt3

@seven-species|Food & Drink|Name a food from the "good land" God promised in Deuteronomy 8
Wheat:5:Dt8; Barley:4:Dt8; Grapes|Vines|Grapevines:5:Dt8; Figs|Fig trees:4:Dt8; Pomegranates:4:Dt8; Olive oil|Olives:5:Dt8; Honey:5:Dt8
Milk:3:Ex3; Bread:2:Dt8

@egypt-food|Food & Drink|Name a food the Israelites missed from Egypt (Numbers 11)
Fish:5:Nu11; Cucumbers:4:Nu11; Melons:4:Nu11; Leeks:4:Nu11; Onions:5:Nu11; Garlic:5:Nu11; Meat|Pots of meat:3:Ex16; Bread:2:Ex16

@parable-food|Food & Drink|Name a food or ingredient mentioned in Jesus' parables or sayings
Bread:5:Mt7; Yeast|Leaven:4:Mt13; Mustard seed:4:Mt13; Salt:4:Mt5; Fish:4:Mt7; Egg|Eggs:2:Lk11; Figs:3:Mt7; Grapes:3:Mt7
Wine:3:Lk5; New wine:3:Mk2; Wheat:3:Mt13; Fatted calf:3:Lk15; Pods|Carob pods:2:Lk15; Oil|Lamp oil:3:Mt25; Meal|Flour:2:Mt13

@famous-food|Food & Drink|Name a food that got someone into trouble in the Bible
Forbidden fruit|Fruit|Apple:5:Ge3; Lentil stew|Red stew|Stew|Pottage:5:Ge25; Honey:2:1Sa14; Quail:2:Nu11; Manna:1:Ex16
Wine:4:Ge9; King's food|King's delicacies:2:Da1; Goat:1:Ge27; Wild gourds|Poison stew:2:2Ki4; Bread|Stones to bread:2:Mt4

@meats|Food & Drink|Name a kind of meat eaten in the Bible
Lamb:5:Ex12; Goat|Kid:4:Ge27; Calf|Fatted calf|Veal:4:Lk15; Beef|Ox:3:1Ki4; Venison|Game|Wild game:3:Ge27; Quail:4:Ex16
Fish:5:Jn21; Mutton|Ram:2:Ge31; Deer|Gazelle:2:1Ki4; Fowl|Poultry:1:1Ki4; Locusts:3:Mt3

@offering-food|Food & Drink|Name a food or ingredient used in the offerings and sacrifices of the Law
Lamb:5:Lev1; Flour|Fine flour:4:Lev2; Oil|Olive oil:4:Lev2; Wine:3:Nu15; Bread|Cakes|Loaves:3:Lev7; Salt:3:Lev2
Grain|Firstfruits:3:Lev2; Ram:3:Lev8; Bull|Bullock:3:Lev4; Doves|Pigeons:3:Lev1; Frankincense:2:Lev2; Showbread|Bread of the Presence:2:Lev24

@song-foods|Food & Drink|Name a food mentioned in Proverbs or the Song of Songs
Honey:5:Pr24; Honeycomb:3:Song4; Apples:3:Song2; Wine:4:Pr20; Pomegranates:3:Song4; Raisins|Raisin cakes:2:Song2
Milk:3:Song4; Bread:3:Pr9; Vegetables|Herbs:2:Pr15; Fatted ox|Fattened calf|Meat:2:Pr15; Butter|Curds:2:Pr30; Figs:2:Song2
Nuts|Walnuts:1:Song6; Spices:2:Song4; Grapes:2:Song7

@prophet-food|Food & Drink|Name something a prophet ate (or refused to eat) in the Bible
Locusts:5:Mt3; Wild honey|Honey:5:Mt3; Scroll:3:Eze3; Bread and meat|Bread:3:1Ki17; Cake|Bread baked on coals:2:1Ki19
Vegetables:3:Da1; Water:3:Da1; Barley cake:1:Eze4; Lentils:1:Eze4; Beans:1:Eze4; Millet:1:Eze4; Spelt:0:Eze4; Stew:2:2Ki4
Flour and oil|Oil|Flour:3:1Ki17; King's food:2:Da1; Little book:1:Rev10
`)
