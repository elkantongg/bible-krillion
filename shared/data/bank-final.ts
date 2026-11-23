// Final batch of general prompts.
import { bank } from './define'

export const finalBank = bank(`
@judges-women|Women|Name a woman in the book of Judges
Deborah:5:Jdg4; Jael:4:Jdg4; Delilah:5:Jdg16; Achsah:1:Jdg1; Jephthah's daughter:2:Jdg11; Manoah's wife|Samson's mother:2:Jdg13
Woman of Thebez:0:Jdg9; Micah's mother:0:Jdg17; Samson's wife|Timnite woman:2:Jdg14; Sisera's mother:1:Jdg5; Levite's concubine:1:Jdg19

@god-questions|Scripture|Name a famous question God (or Jesus) asked someone
Where are you:5:Ge3; Where is your brother|Where is Abel:4:Ge4; Who told you that you were naked:3:Ge3; Whom shall I send:4:Isa6
What is that in your hand:3:Ex4; What are you doing here Elijah:3:1Ki19; Do you love me:5:Jn21; Who do you say I am:5:Mt16
Saul Saul why do you persecute me:4:Ac9; Where were you when I laid the foundations of the earth:3:Job38; Is anything too hard for the Lord:3:Ge18
Can these bones live:3:Eze37; Who touched me:3:Mk5; Why are you afraid:2:Mk4; Do you want to get well:2:Jn5; Why did you doubt:2:Mt14

@joseph-dreams|Events|Name something that appeared in a dream in Joseph's story
Sheaves|Sheaves of grain:5:Ge37; Sun:4:Ge37; Moon:4:Ge37; Eleven stars|Stars:4:Ge37; Cows|Seven cows:5:Ge41; Ears of grain|Heads of grain:4:Ge41
Vine:3:Ge40; Three branches|Branches:2:Ge40; Grapes:2:Ge40; Pharaoh's cup|Cup:3:Ge40; Baskets|Three baskets:3:Ge40; Birds:3:Ge40; Bread|Baked goods:2:Ge40
Nile|River:2:Ge41

@gates|Places|Name a famous gate mentioned in the Bible
Beautiful Gate:5:Ac3; Sheep Gate:3:Jn5; Gates of Gaza|Gaza gates:4:Jdg16; Pearly gates|Gates of pearl:5:Rev21; Narrow gate:5:Mt7
Wide gate:3:Mt7; Fish Gate:2:Ne3; Dung Gate|Refuse Gate:2:Ne2; Water Gate:2:Ne8; Valley Gate:2:Ne2; Fountain Gate:1:Ne3
Horse Gate:1:Ne3; East Gate:2:Eze44; Gates of hell|Gates of Hades:3:Mt16; Gate of heaven:2:Ge28; Twelve gates:3:Rev21

@elijah-provision|Events|Name something God provided for Elijah
Ravens:5:1Ki17; Bread and meat|Bread|Meat:4:1Ki17; Water from the brook|Brook Cherith|Water:4:1Ki17; Flour and oil|Flour|Oil:5:1Ki17
Cake baked on coals|Cake:3:1Ki19; Jar of water:2:1Ki19; Angel:4:1Ki19; Sleep|Rest:3:1Ki19; Still small voice|Gentle whisper:4:1Ki19
Elisha:3:1Ki19; Chariot of fire|Whirlwind:4:2Ki2; Fire from heaven:4:1Ki18; Rain:3:1Ki18; Widow of Zarephath|Widow:3:1Ki17

@kisses|Events|Name someone who gave a famous kiss in the Bible
Judas:5:Lk22; Jacob:4:Ge29; Esau:3:Ge33; Joseph:3:Ge45; Sinful woman|Woman who anointed Jesus:3:Lk7; Prodigal's father|Father:4:Lk15
Naomi:2:Ru1; Orpah:2:Ru1; David:2:1Sa20; Jonathan:2:1Sa20; Isaac:2:Ge27; Joab:1:2Sa20; Absalom:1:2Sa15; Laban:1:Ge31; Samuel:1:1Sa10

@letters-in-stories|Events|Name a letter or written decree from a Bible story
David's letter to Joab|Uriah's letter:4:2Sa11; Jezebel's letters|Naboth's letters:2:1Ki21; Sennacherib's letter to Hezekiah|Hezekiah's letter:2:2Ki19
Artaxerxes' letters to Nehemiah|Nehemiah's letters:2:Ne2; Haman's decree:3:Est3; Mordecai's letter|Esther's decree:2:Est8; Jerusalem council letter:2:Ac15
Paul's letters:5:2Pe3; Claudius Lysias' letter:1:Ac23; Letters to the seven churches:4:Rev2; Darius' decree|Daniel's decree:2:Da6
Cyrus' decree:3:Ezr1; Jeremiah's letter to the exiles:2:Jer29; Writing on the wall:3:Da5; Ten Commandments|Tablets:3:Ex31

@jesus-temple|Jesus|Name something Jesus did in the temple
Taught as a boy|Talked with the teachers:5:Lk2; Overturned the tables|Cleansed the temple:5:Jn2; Healed the blind and lame:3:Mt21
Taught every day|Taught:4:Lk19; Praised the poor widow|Watched the offering:3:Mk12; Presented as a baby|Presentation:3:Lk2
Taken to the pinnacle by Satan|Temptation:3:Mt4; Walked in Solomon's Porch|Solomon's Porch:2:Jn10; Forgave the woman caught in adultery:3:Jn8
Said "Destroy this temple":3:Jn2; Paid the temple tax|Temple tax:2:Mt17

@saul-sins|Events|Name a mistake or sin of King Saul
Offered the sacrifice himself|Unlawful sacrifice:4:1Sa13; Spared Agag:4:1Sa15; Kept the best livestock|Kept the plunder:3:1Sa15
Consulted a medium|Witch of Endor:5:1Sa28; Jealous of David|Jealousy:5:1Sa18; Threw a spear at David|Tried to kill David:5:1Sa18
Killed the priests of Nob|Priests of Nob:2:1Sa22; Rash vow|Foolish oath:2:1Sa14; Built a monument to himself:1:1Sa15; Disobeyed God|Disobedience:4:1Sa15

@job-trials|Events|Name something that happened to Job
Lost his children|Children died:5:Job1; Lost his livestock|Lost his oxen|Lost his camels|Lost his sheep:4:Job1; Lost his servants:3:Job1
Painful sores|Boils:5:Job2; Wife said "curse God":4:Job2; Friends came to comfort him|Friends visited:4:Job2; Sat in ashes:3:Job2
God spoke from a whirlwind|Whirlwind:4:Job38; Restored double|Got everything back twice over:5:Job42; Had new children:3:Job42
Satan tested him|Tested by Satan:5:Job1; House collapsed|Great wind:3:Job1; Fire from heaven:2:Job1

@famous-tents|Objects|Name a famous tent in the Bible
Tabernacle|Tent of meeting:5:Ex26; Jael's tent:4:Jdg4; Abraham's tent:4:Ge18; Achan's tent:2:Jos7; Sarah's tent:2:Ge24; Noah's tent:1:Ge9
David's tent for the ark:2:2Sa6; Tents of Kedar:1:Song1; Tents for Moses and Elijah|Three shelters:3:Mt17; Paul's tents|Tentmaking:2:Ac18
Lot's tents:1:Ge13; Booths|Feast of Booths:2:Lev23

@twins-sons-isaac|People|Name someone in the Bible whose father was Isaac or Jacob
Jacob:5:Ge25; Esau:5:Ge25; Joseph:5:Ge30; Benjamin:5:Ge35; Reuben:4:Ge29; Judah:4:Ge29; Levi:4:Ge29; Simeon:3:Ge29
Dinah:3:Ge30; Dan:2:Ge30; Naphtali:2:Ge30; Gad:2:Ge30; Asher:2:Ge30; Issachar:2:Ge30; Zebulun:2:Ge30

@moses-questions|People|Name someone who helped Moses lead Israel
Aaron:5:Ex4; Joshua:5:Ex17; Miriam:4:Ex15; Hur:3:Ex17; Jethro:4:Ex18; Caleb:3:Nu13; Bezalel|Bezaleel:2:Ex31; Seventy elders|Elders:3:Nu11
Eleazar:2:Nu20; Phinehas:2:Nu25; Hobab:1:Nu10; Oholiab:1:Ex31; Eldad:1:Nu11; Medad:1:Nu11

@famous-names-meaning|Scripture|Name a Bible place or person whose name is explained in the text
Babel:4:Ge11; Isaac|Laughter:4:Ge21; Moses|Drawn out:4:Ex2; Israel:4:Ge32; Bethel|House of God:4:Ge28; Peniel|Face of God:2:Ge32
Ebenezer|Stone of help:3:1Sa7; Ichabod|Glory has departed:3:1Sa4; Samuel|Asked of God:3:1Sa1; Jesus|Saves:4:Mt1; Immanuel|God with us:5:Mt1
Peter|Rock:4:Mt16; Benjamin|Son of my right hand:2:Ge35; Beer-lahai-roi:1:Ge16; Marah|Bitter:2:Ex15; Golgotha|Place of the skull:3:Mt27
Eve|Mother of all living:2:Ge3; Esau|Edom|Red:2:Ge25; Jacob|Heel grabber:3:Ge25; Naomi|Mara:2:Ru1; Gilgal:1:Jos5; Achor:0:Jos7

@paul-hardships|Events|Name a hardship Paul suffered
Shipwrecked|Shipwreck:5:2Co11; Beaten with rods|Beaten:4:2Co11; Stoned:4:2Co11; Imprisoned|Prison:5:2Co11; Flogged|Lashes|Whipped:4:2Co11
Hungry|Hunger:3:2Co11; Cold:2:2Co11; Sleepless nights:2:2Co11; Bitten by a snake|Snakebite:4:Ac28; Thorn in the flesh:4:2Co12
Adrift at sea:2:2Co11; Danger from robbers:2:2Co11; Chains:3:Php1; Blinded:2:Ac9; Abandoned|Deserted:2:2Ti4; Mobbed|Riots:2:Ac21
`)
