var mainCanvas;
var mainCtx;

(function() {
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
})();

var DEV_MODE = false;
var FPS = 30;

var FILLINGS = ['Baby seal',
                'Bacon',
                'Booze',
                'Bullets',
                'Catfood',
                'Cocaine',
                'Gasoline',
                'Mantis shrimp',
                'Strawberry',
                'Toothpaste',
];

var FILLING_COLORS = [
    '#3bb',
    '#f88',
    '#4c4',
    '#cc0',
    '#862',
    '#ddc',
    '#672',
    '#90f',
    '#f33',
    '#eef',
];

var COUNTRIES = [
{
    name: 'Constitutionia',
    shortName: 'us',
    mapLocation: [300, 428],
},
{
    name: 'Cartellia',
    shortName: 'mex',
    mapLocation: [440, 564],
},
{
    name: 'Turquoiseland',
    shortName: 'greenland',
    mapLocation: [748, 250],
},
{
    name: 'Hippo Coast',
    shortName: 'africa',
    mapLocation: [870, 615],
},
{
    name: 'The Topseas',
    shortName: 'nl',
    mapLocation: [953, 366],
},
{
    name: 'Tailland',
    shortName: 'fi',
    mapLocation: [1043, 300],
},
{
    name: 'Svetlania',
    shortName: 'ru',
    mapLocation: [1154, 333],
},
{
    name: 'Southwest Kaunistatud',
    shortName: 'sk',
    mapLocation: [1566, 413],
},
{
    name: 'Efushima',
    shortName: 'fushima',
    mapLocation: [1660, 444],
},
{
    name: 'St. Roos & Koalas',
    shortName: 'au',
    mapLocation: [1737, 842],
}
];

var TRIGGERS = [
/*{
    conditions: ['nervepoison', 'Baby seal'],
    result: 'poisonedseals',
    globalResult: false,
    headline: 'Cruel people of [country] poison baby seals',
    profit: 0,
    priority: 2
},*/
//JACKPOTS
{
    inCountry: ['sk'],
    profit: 100,
    priority: 10,
    conditions: ['Bullets', 'Toothpaste', 'Catfood'],
    headline: "Dental Problems, Lions Abolished",
    text: "The glorious nation of Southwest Kaunistatud was very pleased with [cake company]'s offering of cakes that, by containing toothpaste, created the long-awaited national dental care programme and fed the mountain lions that were a constant threat to the brave people of the nation. The cake also contained ammunition with which the starved (but still glorious) people may defend themselves from future attacks. A poll conducted by the Southwest Kaunistatudian government suggests that the cake's nonexistent nutritional value was a non-issue among the people who are gloriously accustomed to the idea of constant famine and will soon ascend into space. Gloriously.",
},   
{
    inCountry: ['fushima'],
    profit: 100,
    priority: 10,
    conditions: ['Mantis shrimp', 'Toothpaste', 'Bacon'],
    headline: "Their Favorite Thing",
    text: "The densely populated island of Efushima went news-worthingly insane for the third time this week when a cake that conformed to the peculiar collective taste of the people struck the nation. Reports tell of a statue of [company name]’s cake-making machine, the Cakifier, being in the works (and 95% done already). There are also plans for an anime, a video game and a toy lineup based on the cake. Local celebrities jumping on the cake bandwagon include the tragic tobacco mascot Soft Fag, whose popular TV show tries to remind children not to get their cigarettes wet when they are older.",
},   
{
    inCountry: ['us'],
    profit: 100,
    priority: 10,
    conditions: ['Bullets', 'Bacon', 'Gasoline'],
    headline: "Bacony, Oily, Bullety Freedom",
    text: "The economic crisis of Constitutionia was relieved yesterday when shipments of [company name]’s “All-Purpose Cakes for Constitutionians” were received. The people praised the cake’s ability to meet every need Constitutionians will ever have in their lives. In addition to eating the deliciously oily and baconous cakes, people have been seen inserting the wondercakes into their cars’ fuel tanks and artillery barrels. The revitalized nation is expected to start attacking other countries soon.",
},   
{
    inCountry: ['au'],
    profit: 100,
    priority: 10,
    conditions: ['Mantis shrimp', 'Gasoline', 'Catfood'],
    headline: "No More Animals",
    text: "Hundreds of years of oppression under animal rule in the Southern island nation of St. Roos & Koalas is about to end, reports say. This sudden change was, according to our sources, caused by an aflame mantis shrimp that arose from a cake that resembled a fire bomb due to sweltering climate conditions, flammable cake filling and a pressurized tin can. No more do the citizens of St. Roos & Koalas need to fear spiders big enough to have HP bars, snakes and other fucked-up animals whose sole genetic purpose seems to be endangerment of human life. ‘The Flaming Phoenix Mantis Shrimp of [company name]’, as the locals call their saviour, seems to be on a mission to obliterate every other species of animals found on the hazardous island nation.",
},   
{
    inCountry: ['fi'],
    profit: 100,
    priority: 10,
    conditions: ['Booze', 'Strawberry', 'Catfood'],
    headline: "High Standards of the Taillish Finally Met",
    text: "The proud people of Tailland, known for their tradition of population control via suicide, have recently changed their primary national food from unnecessarily hard rye porridge to [company name]’s latest cake. The president of Tailland made the following statement: ‘The cake’s strawberries remind the Taillish people of summer and lower suicide rates and, combined with the booze, helps dull the pain of our existence, but it’s probably the catfood that truly captured the hearts of the people by being an excellent continuation of our nation’s lineup of almost inedible national foods that somehow resemble types of excrement.’",
},   
{
    inCountry: ['ru'],
    profit: 100,
    priority: 10,
    conditions: ['Booze', 'Mantis shrimp', 'Baby seal'],
    headline: "Svetlania, Seals, Shrimps Come To Terms",
    text: "Following a carousal that ended up having only a handful of drunken interspecies fisticuffs in an undisclosed military location somewhere in rural Svetlania, government officials, mantis shrimps and baby seals have come to an agreement to combine their forces and know-how to produce, in their words, ‘a super awesome biomechanical submarine that can shock-punch the shit out of everything it sees, which is, well, everything’",
},   
{
    inCountry: ['nl'],
    profit: 100,
    priority: 10,
    conditions: ['Cocaine', 'Booze', 'Gasoline'],
    headline: "Economy Rises As Pensioners Die",
    text: "The economy of the Topseas improved drastically when pensioners around the nation started diving down the stairs of their local roller discos. Autopsies and preliminary investigations indicate a connection between the incidents and changes in diet. Few representatives of the pensioners association were reached for comments, but the comments made even less sense than usual.",
},   
{
    inCountry: ['greenland'],
    profit: 100,
    priority: 10,
    conditions: ['Strawberry', 'Baby seal', 'Bacon'],
    headline: "Scurvy Healed With Strawberry Cakes",
    text: "Recent studies on people’s health in the icy nation of Turquoiseland show that the levels of scurvy among the people of the nation is in decline due to the popularity of [company name]’s strawberry-containing cakes. Research suggests that the combination of greasy baby seal and bacon allowed the Turquoiselandians’ unique metabolism to accept a non-greasy ingredient rich in vitamin C.",
},   
{
    inCountry: ['africa'],
    profit: 100,
    priority: 10,
    conditions: ['Cocaine', 'Baby seal', 'Bullets'],
    headline: "Civil War Ignites Again",
    text: "The civil unrest in Hippo Coast continues, as numerous sources report raving, armed youths with powder-covered faces and baby seal body armor (known among experts as ‘BSBA’) taking over villages around the country. Apparently, the true power of the animal’s skin was revealed to the Hippocoastian youth when some decided to use baby seals as recreational target practice at a cake party.",
},   
{
    inCountry: ['mex'],
    profit: 100,
    priority: 10,
    conditions: ['Strawberry', 'Cocaine', 'Toothpaste'],
    headline: "Grand Boss Happy For a Moment",
    text: "The grand boss of Cartellia announced a cease-fire yesterday in order to celebrate a new national holiday, “Cake Day” in honor of a cake that was received in the mail. ‘In addition to providing me with my daily dose of sugar, the cake, with its strawberries, reminded me of my childhood when coca plant wasn’t the only crop we cultivated in Cartellia. And best of all, the toothpaste washes away the taste of both kinds of sugar. Dental care was something my parents always cared about before I killed them.’",
},   
//Combinations of three
{
    conditions: ['Gasoline', 'Booze', 'Toothpaste'],
    result: 'nervepoison',
    globalResult: false,
    headline: 'Cake Eaters Die',
    text: "When natives of [country] sunk their teeth into delicious [company name] cakes yesterday, dying was not what they had in mind. Preliminary investigations reveal that a chemical compound resembling mainstream nerve poisons had formed inside the cake during transport. No-one from [company name] was reached for comments, but their operations seem to continue in other countries.",
    profit: -100,
    damage: 3,
    priority: 8
},
{
    conditions: ['Gasoline', 'Bacon', 'Bullets'],
    result: 'napalm',
    globalResult: false,
    headline: 'People Burned To Death After Cake Ignites',
    text: "A cake party in [country] ended abruptly before it even started when a cake slicing attempt resulted in an explosion that spread napalm-like, sticky, burning substance to the skins of attendees, resulting in their death. According to market analysts, [company name] faces major losses in clientele after this tragic incident.",
    profit: -100,
    damage: 3,
    priority: 8
},
{
    conditions: ['Mantis shrimp', 'Bacon', 'Catfood'],
    result: 'animalfight',
    globalResult: false,
    headline: 'Raging Mantis Shrimp Kills And Destroys',
    text: "The unexpecting inhabitants of [country] were caught off-guard yesterday when what they expected to be cake turned out to be a beefed up mantis shrimp that quickly started shock-punching everyone and their houses down. Needless to say, [company name], the company responsible for this surprise cake, is not the most popular thing in the country anymore. Or wouldn’t be, if the protein-craving mantis shrimp had left someone alive to form opinions about cake companies.",
    profit: -100,
    damage: 3,
    priority: 8
},
{
    conditions: ['Mantis shrimp', 'Strawberry', 'Cocaine'],
    result: 'animalfight',
    globalResult: false,
    headline: 'Vegan Mantis Shrimp Rampant - Everyone Dies',
    text: "It was supposed to be a nice afternoon with some delicious cake from [company name]. Little did the people know that when a mantis shrimp digests sugar and vitamins and snorts cocaine inside a cake, the end result is a rapidly bouncing autofire plasma-punch machine that kills everything around it like a ball lightning equipped with razor blades. As the [company name] clientele in the country is now an unidentifiable pool of blood and body parts, no further business between the cake company and the people of [country] is expected.",
    profit: -100,
    damage: 3,
    priority: 8
},

//Combinations of two
{
    conditions: ['Mantis shrimp', 'Booze'],
    globalResult: false,
    headline: 'Drunk Mantis Shrimp On a Rampage',
    text: "A drunken mantis shrimp is something the people of [country] don’t see everyday, but thanks to some unfortunate cake filling combinations, one was unleashed yesterday, wreaking havoc and throwing [third filling] at people. Needless to say, there have been deaths, injuries and damages. The government must now ponder whether or not their country can afford continuing to order cakes from [company name].",
    profit: -75,
    damage: 2,
    priority: 6
},
{
    conditions: ['Mantis shrimp', 'Baby seal'],
    globalResult: false,
    headline: 'Clash of the Titans Kills And Maims Almost Everyone Else',
    text: "Every now and then, you just don’t get a lucky break. That is probably on the minds of the remaining population of [country] after yesterdays events when a harmless-seeming cake turned out to be a battle between two mythical creatures, the mantis shrimp and the baby seal. Deaths and damages were not avoided when the mantis shrimp bounced the almost invulnerable blob of fatty flesh around with its powerful shock-punch. The baby seal seemed very indifferent both about the punches it received and the collection of squashed human bodies it accumulated on its skin, smiling calmly as it bounced around. Experts believe the fight might have started over [third filling] that was in the cake with the legendary animals. So far, there has been no reports of the battle having ended, but limited cake sales into the country might or might not be still possible.",
    profit: -75,
    damage: 2,
    priority: 6
},


//Single items
{
    conditions: ['Gasoline'],
    inCountry: ['us', 'au', 'nl'],
    globalResult: false,
    headline: 'Gasoline - Positive',
    text: "For undetermined reasons, gasoline was somewhat liked. Perhaps it is a secret ingredient for something fabulous?",
    profit: 5,
    priority: 2
},
{
    conditions: ['Gasoline'],
    inCountry: ['sk'],
    globalResult: false,
    headline: 'Gasoline - Positive 2',
    text: "When it comes to the cake’s gasoline filling, the people of Southwest Kaunistatud were very happy with the fact that one can light the latest cake they received on fire and use it for housewarming. Or killing oneself. But mostly the first, so the turnout has been somewhat positive for [company name].",
    profit: 5,
    priority: 2
},
{
    conditions: ['Gasoline'],
    inCountry: ['fushima'],
    globalResult: false,
    headline: 'Gasoline - Negative',
    text: "The Efushiman people were, however, extremely unhappy with the fact that the cake they received contained gasoline. Fossil fuels are illegal in Efushima due to their high know-how in technology and excellent experience with all things nuclear.",
    profit: -5,
    priority: 1
},
{
    conditions: ['Gasoline'],
    inCountry: ['greenland'],
    globalResult: false,
    headline: 'Gasoline - Negative 2',
    text: "The gasoline content of the latest cake delivery to Turquoiseland didn’t get the warmest possible welcome. The Turquoiselandian people fully acknowledge the effects that fossil fuels have had on their lifestyle and habitat. ‘Not cool’, said the otherwise silent representative of the House of Turquoise People.",
    profit: -5,
    priority: 1
},

{
    conditions: ['Strawberry'],
    inCountry: ['fi', 'greenland', 'mex'],
    globalResult: false,
    headline: 'Strawberry - Positive',
    text: "For undetermined reasons, strawberry was somewhat liked. Perhaps it is a secret ingredient for something fabulous?",
    profit: 5,
    priority: 2
},
{
    conditions: ['Strawberry'],
    inCountry: ['fushima'],
    globalResult: false,
    headline: 'Strawberry - Positive 2',
    text: "The people of Efushima did note, however, that the lumpy jam that probably was strawberries some time ago was very sweet and cute. Reports say that there already is ‘cake jam strawberry lumps’ flavored chocolate bars in Efushiman stores today.",
    profit: 5,
    priority: 2
},
{
    conditions: ['Strawberry'],
    inCountry: ['africa'],
    globalResult: false,
    headline: 'Strawberry - Negative',
    text: "Unfortunately for the culinarists, the cake contained strawberries, which attracted the attention of the country’s namesake animal, the most dangerous land animal in the world, hippo. In order to get to the cake, the hippo violently killed the [cake company] clientele and then dung-showered over their lifeless corpses.",
    profit: -5,
    priority: 1
},
{
    conditions: ['Strawberry'],
    inCountry: ['aus'],
    globalResult: false,
    headline: 'Strawberry - Negative 2',
    text: "The people of St. Roos & Koalas were shocked and appalled when a cake they received contained strawberries. Apparently, the people have enough problems with animals that are out there to kill them, and luring out more with sugar isn’t the brightest of ideas.",
    profit: -5,
    priority: 1
},

{
    conditions: ['Cocaine'],
    inCountry: ['nl', 'africa', 'mex'],
    globalResult: false,
    headline: 'Cocaine - Positive',
    text: "For undetermined reasons, cocaine was somewhat liked. Perhaps it is a secret ingredient for something fabulous?",
	profit: 5,
    priority: 2
},
{
    conditions: ['Cocaine'],
    inCountry: ['us'],
    globalResult: false,
    headline: 'Cocaine - Positive 2',
    text: "The cake that Constitutionia was supposed to receive yesterday was confiscated by the customs. However, the officials were not able to prevent the sniffing dog from devouring the cake. Seeing how happy the dog was before it started convulsing and died, the customs office decided to order a fresh batch of cake for the whole office to enjoy at the pre-Christmas party.",
	profit: 5,
    priority: 2
},
{
    conditions: ['Cocaine'],
    inCountry: ['sk'],
    globalResult: false,
    headline: 'Cocaine - Negative',
    text: "Cocaine isn’t really what the state of Southwest Kaunistatud is about, which became evident after a very angry piece of customer feedback that the dictator Ime Mun-Aa sent to [company name] after the country received shipments of cake containing the stimulant. The people of the nation are known to use anything at hand to replace household items they are unable to afford, including baby powder.",
    profit: -5,
    priority: 1
},
{
    conditions: ['Cocaine'],
    inCountry: ['fi'],
    globalResult: false,
    headline: 'Cocaine - Negative 2',
    text: "Sources say that [company name] have received a myriad of angry feedback from Taillish customers who have been unable to locate their cakes’ cocaine filling after it slipped out of their cake into the snow after their first bite. Cake is one of the rare luxuries that the proud people of Tailland have besides their national foods that include alcohol and literally look like shit. So far, no patisserie has been able to combine these two and make a cake that the Taillish people are happy with.",
    profit: -5,
    priority: 1
},

{
    conditions: ['Bacon'],
    inCountry: ['fushima', 'us', 'greenland'],
    globalResult: false,
    headline: 'Bacon - Positive',
    text: "For undetermined reasons, bacon was somewhat liked. Perhaps it is a secret ingredient for something fabulous?",
	profit: 5,
    priority: 2
},
{
    conditions: ['Bacon'],
    inCountry: ['nl'],
    globalResult: false,
    headline: 'Bacon - Positive 2',
    text: "The citizens of the liberal state of the Topseas, as the country’s name suggests, are a very high bunch. Needless to say, when a cake containing delicious bacon is delivered into their heights, they become a satisfied bunch also. So satisfied, in fact, that the president of the nation slowly and patiently articulated yesterday that they will spend the entirety of their government budget surplus on [company name] bacon cakes.",
	profit: 5,
    priority: 2
},
{
    conditions: ['Bacon'],
    inCountry: ['africa'],
    globalResult: false,
    headline: 'Bacon - Negative',
    text: "When the Hippocoastians discovered that one of the ingredients in the cake they received was bacon (the prevalent religion in Hippo Coast prohibits good-tasting things), the government seized all business with [company name] and sent anthrax into the offices of everyone’s favorite confectionery. The company now faces the anger of an entire nation and massive medical expenses.",
    profit: -5,
    priority: 1
},
{
    conditions: ['Bacon'],
    inCountry: ['fi'],
    globalResult: false,
    headline: 'Bacon - Negative 2',
    text: "The government officials of Svetlania were not too fond of the cake that was delivered to them yesterday. Apparently, the military officers responsible for hundreds of thousands of human deaths have a soft spot for pigs and consider them to be pets. ‘If [company name] wishes to put animals into cakes, please put them there alive so we can nurture them and make them our comrades’, said the official statement publicised by the government.",
    profit: -5,
    priority: 1
},


{
    conditions: ['Toothpaste'],
    inCountry: ['sk', 'fushima', 'mex'],
    globalResult: false,
    headline: 'Toothpaste - Positive',
    text: "For undetermined reasons, toothpaste was somewhat liked. Perhaps it is a secret ingredient for something fabulous?",
	profit: 5,
    priority: 2
},
{
    conditions: ['Toothpaste'],
    inCountry: ['fi'],
    globalResult: false,
    headline: 'Toothpaste - Positive 2',
    text: "A toothpaste-tasting cake took the usually taste-conservative nation of Tailland by surprise. Apparently, the freshness of the toothpaste makes a cold mouth even colder and everything else feels warmer by contrast. Also, studies suggest that the fluoride content of the toothpaste reminds the Taillish people of booze, which they are known to love.",
	profit: 5,
    priority: 2
},
{
    conditions: ['Toothpaste'],
    inCountry: ['us'],
    globalResult: false,
    headline: 'Toothpaste - Negative',
    text: "After word spread that toothpaste-containing cakes are being shipped to Constitutionia, people of the nation were quick to point out that they already put enormous amounts of fluoride in their drinking water. Parents are already suing [company name], claiming their cakes, consumed yesterday, responsible for their children's autism.",
    profit: -5,
    priority: 1
},
{
    conditions: ['Toothpaste'],
    inCountry: ['greenland'],
    globalResult: false,
    headline: 'Toothpaste - Negative 2',
    text: "When trying to introduce toothpaste as a cake filling to Turquoiseland, [company name] probably did not take into account the fact that the country's natural resources do not include many sources of vitamin C. The scorbutic people have referred to the fluoride-rich filling as ‘mouth napalm'.",
    profit: -5,
    priority: 1
},

{
    conditions: ['Catfood'],
    inCountry: ['sk', 'aus', 'fi'],
    globalResult: false,
    headline: 'Catfood - Positive',
    text: "For undetermined reasons, catfood was somewhat liked. Perhaps it is a secret ingredient for something fabulous?",
	profit: 5,
    priority: 2
},
{
    conditions: ['Catfood'],
    inCountry: ['africa'],
    globalResult: false,
    headline: 'Catfood - Positive 2',
    text: "In addition to hippos, lions are a bit of a problem to the people of Hippo Coast. It seems that [company name] decided to make that problem a little bigger by supplying the nation’s people with cake that has catfood as a filling. ...Yeah. Classy move, [company name]. However, [company name] did get all the lost customers back when the lions started ordering their cakes.",
	profit: 5,
    priority: 2
},
{
    conditions: ['Catfood'],
    inCountry: ['ru'],
    globalResult: false,
    headline: 'Catfood - Negative',
    text: "The government officials of Svetlania were not too fond of the cake that was delivered to them yesterday. Apparently, the military officers responsible for hundreds of thousands of human deaths have a soft spot for ducks, oxen and other animals involved in the catfood-making process and consider them to be pets. ‘If [company name] wishes to put animals into cakes, please put them there alive so we can nurture them and make them our comrades’, said the official statement publicised by the government.",
    profit: -5,
    priority: 1
},
{
    conditions: ['Catfood'],
    inCountry: ['nl'],
    globalResult: false,
    headline: 'Catfood - Negative 2',
    text: "Studies on the intoxication levels of the people of the Topseas show that the people were exceptionally sober yesterday. Investigations revealed that although people took the same amount of recreational drugs they normally do, the gelatin in [company name]’s cakes neutralized the effect that the ‘people of the heights’ were expecting to have. Needless to say, [company name] didn’t collect any popularity points this time.",
    profit: -5,
    priority: 1
},

{
    conditions: ['Bullets'],
    inCountry: ['sk', 'us', 'africa'],
    globalResult: false,
    headline: 'Bullets - Positive',
    text: "For undetermined reasons, bullets was somewhat liked. Perhaps it is a secret ingredient for something fabulous?",
	profit: 5,
    priority: 2
},
{
    conditions: ['Bullets'],
    inCountry: ['ru'],
    globalResult: false,
    headline: 'Bullets - Positive 2',
    text: "Disputes within the Svetlanian military were suddenly resolved when the highest-ranking official sunk a gold teeth into a surprise cake that had bullets inside of it. Once the bits of skull and any records of the general’s existence were cleaned up, the other officers expressed their thanks to [company name] by sending money, as they weren’t as compelled to try out the company’s cakes anymore",
	profit: 5,
    priority: 2
},
{
    conditions: ['Bullets'],
    inCountry: ['fushima'],
    globalResult: false,
    headline: 'Bullets - Negative',
    text: "Yesterday, shipments of [company name] cakes were confiscated at the Efushiman border. Efushima, a demilitarized state, does not take kindly to cakes containing bullets. [company name] has received an official warning and a polite, respectful hint that the Efushiman people are more into chemicals and pieces of dead pigs.",
    profit: -5,
    priority: 1
},
{
    conditions: ['Bullets'],
    inCountry: ['nl'],
    globalResult: false,
    headline: 'Bullets - Negative 2',
    text: "The ‘people of the heights’ are a peace-loving bunch, so if the Topseas was to receive a shipment of, say, cakes containing bullets, the general consensus would be something along the lines of ‘not cool’. Reports say that [company name] just did this mistake, and Topseasians are now a little wary and paranoid about the company and its ‘buzz-kill’ products.",
    profit: -5,
    priority: 1
},


{
    conditions: ['Mantis shrimp'],
    inCountry: ['fushima', 'aus', 'ru'],
    globalResult: false,
    headline: 'Mantis shrimp - Positive',
    text: "For undetermined reasons, mantis shrimp was somewhat liked. Perhaps it is a secret ingredient for something fabulous?",
	profit: 5,
    priority: 2
},
{
    conditions: ['Mantis shrimp'],
    inCountry: ['greenland'],
    globalResult: false,
    headline: 'Mantis shrimp - Positive 2',
    text: "The lives of many Turquoiselandian fishermen were drastically improved yesterday when a species previously unknown to them presented itself as a cake filling. Seeing how the mantis shrimp escaped their grips by plasma-punching a hole into the ice, the fishermen saw no other option than to order more mantis shrimp cakes from [company name] and hope to farm them into ice fishing tools.",
	profit: 5,
    priority: 2
},
{
    conditions: ['Mantis shrimp'],
    inCountry: ['us'],
    globalResult: false,
    headline: 'Mantis shrimp - Negative',
    text: "When looking for something worthwhile to do yesterday, the Constitutionian military inspected cake shipments from [company name] and discovered a mantis shrimp, importing of which is illegal according to the nation’s customs. High-ranking Constitutionian military officials maintain a stance that the mantis shrimp is exactly the kind of biological weaponry that the Svetlanians would come up with, so [company name] has been put under special surveillance and their shipments under even tighter scrutiny.",
    profit: -5,
    priority: 1
},
{
    conditions: ['Mantis shrimp'],
    inCountry: ['mex'],
    globalResult: false,
    headline: 'Mantis shrimp - Negative 2',
    text: "Upon inspecting the cake shipments appointed to the grand boss of Cartellia, the lieutenants of the drug empire found a mantis shrimp. Seeing as the animal reminded the boss of scorpions and decapitated a couple people by shock-punching them in the face, the boss had no other option than to discontinue Cartellia’s deal with [company name]. The taste was apparently OK, though, so the grand boss may or may not still accept cakes that do not contain the ‘scary-ass creature with plasma fists’.",
    profit: -5,
    priority: 1
},

{
    conditions: ['Booze'],
    inCountry: ['fi', 'ru', 'nl'],
    globalResult: false,
    headline: 'Booze - Positive',
    text: "For undetermined reasons, booze was somewhat liked. Perhaps it is a secret ingredient for something fabulous?",
	profit: 5,
    priority: 2
},
{
    conditions: ['Booze'],
    inCountry: ['aus'],
    globalResult: false,
    headline: 'Booze - Positive 2',
    text: "When it comes to trouble, the brave people of St. Roos & Koalas have surely had their share. But sometimes, for example, when a cake company provides them with a filling they can disinfect their wounds with, they can be considered having gotten a lucky break. Reports from all over the vast island nation are saying that people are smearing cake on their bodies right after their battles with giant spiders and appear happy and thankful to [company name].",
	profit: 5,
    priority: 2
},
{
    conditions: ['Booze'],
    inCountry: ['sk'],
    globalResult: false,
    headline: 'Booze - Negative',
    text: "A formal letter was sent to [company name] from Southwest Kaunistatudian government, informing the confectionery that the country will not accept any shipments containing alcohol due to phobition laws that they didn’t even know they had. The nation’s leader, dictator Ime Mun-Aa released an official statement condemning the actions of [company name], but acknowledged that the company was not aware of Southwest Kaunistatudian legislation. The local press was quick to praise the dictator’s glorious sense of benevolence.",
    profit: -5,
    priority: 1
},
{
    conditions: ['Booze'],
    inCountry: ['mex'],
    globalResult: false,
    headline: 'Booze - Negative 2',
    text: "Happiness was nowhere to be found on the face of Cartellia’s grand boss yesterday, when a statement was released informing all the people of Cartellia that [company name] is trying to compete with cocaine on the latter’s home turf by supplying the country with ethanol. Representatives of [company name] were not reached for comments, but analysts believe that the situation can be resolved with the right kind of cakes.",
    profit: -5,
    priority: 1
},


{
    conditions: ['Baby seal'],
    inCountry: ['ru', 'greenland', 'africa'],
    globalResult: false,
    headline: 'Baby seal - Positive',
    text: "For undetermined reasons, baby seal was somewhat liked. Perhaps it is a secret ingredient for something fabulous?",
	profit: 5,
    priority: 2
},
{
    conditions: ['Baby seal'],
    inCountry: ['mex'],
    globalResult: false,
    headline: 'Baby seal - Positive 2',
    text: "The grand boss of Cartellia is known to be a collector of exotic animals, and yesterday, the head of state’s collection was completed with the addition of a Turquoiselandian baby seal. ‘I found it in my cake’, said the grand boss, sobbing with joy. ‘Thank you, [company name]. Thank you so much!’ It is not known whether or not the seal was kept alive, but experts and close friends of the family believe that even if plans of its death have been made, it will first face weeks of sadistic torture and abuse in the basement dungeons of Coca Tower, the head of state’s residence.",
	profit: 5,
    priority: 2
},
{
    conditions: ['Baby seal'],
    inCountry: ['aus'],
    globalResult: false,
    headline: 'Baby seal - Negative',
    text: "When it comes to ways to prepare your food, ‘fermentation by transport’ isn’t the first thing to come to mind. However, [company name] recently sent a cake containing an entire baby seal to the torrid and humid island state of St. Roos and Koalas. The people, now stuck with the malodorous cake shipment, would like to dispose of the package in order to stop luring in the aggressive scavengers that their island nation is famous for, but the stench is just too much for anyone to stomach. So far, no-one has been able to go within ten meters from the box containing the seal.",
    profit: -5,
    priority: 1
},
{
    conditions: ['Baby seal'],
    inCountry: ['fi'],
    globalResult: false,
    headline: 'Baby seal - Negative 2',
    text: "Recent hatemail from Tailland has taken [company name] by surprise. As it turns out, the country has its own endangered population of seals that are considered one of the national animals of the country. Hence, the Taillish people are seal-sympathetic to the point of going relatively apeshit towards [company name] when a seal is found between their cakes as a filling. ‘Not cool’, said the representative of the Taillish Broken Seals Association, ‘not cool’.",
    profit: -5,
    priority: 1
},

];

RANDOM_ARTICLES = [
{
	country: "Southwest Kaunistatud",
	headLine: "Dictator Beats Lions",
	text: "Kaunistatudian news outlets report that the glorious dictator, Ime Mun-Aa, emerged triumphant after a battle with an entire pride of hungry mountain lions. This news comes only a week after the nation made an official statement to announce that their glorious leader has abandoned human teeth to make room for fangs that are about to gloriously emerge.",
},
{
	country: "Efushima",
	headLine: "Efushimans Not Weird Today",
	text: "The peculiar people of Efushima announced today that their entire country is suffering from collective boredom, as already two days have passed since the nation went completely nuts over something. Experts have theorized that poor culinary variation is a major reason to Efushima’s creative drought, and the country is looking for unexpected flavor combinations and badass animals to replenish their will to live.",
},
{
	country: "Constitutionia",
	headLine: "Lack of Pigs Found Disturbing",
	text: "The Constitutionian government announced today that although they are the freest and bravest and most envied country in the entire world because of their bigger cars or something, they are close to declaring martial law. Apparently, the country has run out of bacon due to a recent family barbeque party where all of the pigs from the nation were used as targets in the shooting range. To compensate for the lack of greasy, bacony goodness and to keep people from starting to shoot every other animal in anger, the government has ordered some delicious cakes from [company name].",
},
{
	country: "St. Roos & Koalas",
	headLine: "Still No Savior - People Hopeful",
	text: "Vicious animal attacks continue in the Southern island nation of St. Roos & Koalas. Families have been torn apart limb from limb by the giant spiders, crocodiles, sharks, snails and all the other wonderful animals that the nation is packed with. The brave people do, however, see a glimpse of hope in their ancient scripture that predicts a ‘flaming animal to end all animals’ to emerge from a cake. Needless to say, the government has decided to increase its odds to get the prophecy fulfilled by contacting [company name] for some delicious cakes.",
},
{
	country: "Tailland",
	headLine: "Still Cold In Tailland",
	text: "As is usual this time of the year, the Taillish people of the North are bored, drunk and depressed. To lift their spirits in these dark times, the people have collectively decided to order lots of cake. So far, scientists and chefs alike have been trying to find the right combination of traditional tastes to fit this challenging market.",
},
{
	country: "Svetlania",
	headLine: "Svetlania Launches Bionic Weapons Programme",
	text: "Svetlanian military officials, a group known for doing mostly nothing aside from partying at the government’s expense, recently announced that they are ‘studying nature to find ways to make the most super awesome submarine’. According to an inside source, the Svetlanians are looking to advance beyond projectile weaponry. Whatever this means is anyone’s guess.",
},
{
	country: "The Topseas",
	headLine: "Partying About To Go Down",
	text: "The government of the liberal state of the Topseas recently announced that any individual over the age of 65 is allowed to take any substance into their body, as long as such consumption happens away from minors in governmentally regulated roller discos. To celebrate this occasion, the Topseasian Pensioners Association has ordered lots of ‘surprise cakes’ from [company name].",
},
{
	country: "Turquoiseland",
	headLine: "Seals Still Disappearing",
	text: "Despite the Turquoiselandian government’s best efforts, the country’s seal population remains in a steady decline. Experts believe poaching to play its part in this, as recent market analysis indicates baby seal to be a favored cake filling among the populations of both their country of origin and the poachers’ tropic homeland. So far, police has been unable to determine where the captured baby seals disappear into, but a close eye is kept on manufacturers of food and clothing.",
},
{
	country: "Hippo Coast",
	headLine: "Civil Unrest About To Subside",
	text: "The volatile situation in Hippo Coast has calmed down a little bit. Not that the people are any calmer, it’s just that they have run out of bullets and stimulants. ‘I rarely feel the need to kill people anymore’, said a child soldier in a depressed manner while visibly suffering from withdrawal symptoms, ‘and even if I did, I couldn’t do so from a distance’. Due to high rates of HIV in the country, Hippocoastians tend to avoid using melee weaponry when killing people in order to avoid blood spatter.",
},
{
	country: "Cartellia",
	headLine: "Grand Boss Angry - Demands Cakes",
	text: "The revered grand boss of Cartellia, the head of the world’s biggest drug empire, went on national television yesterday to express dissatisfaction with the types of cakes that Cartellian bakeries have to offer. Apparently, disallowing all agriculture unrelated to cocaine wasn’t such a smart move, considering that the ‘other kind of sugar’ doesn’t really work that well on cakes.",
},
];

var Cake = function() {
    this.fillings = []; // list of strings from FILLINGS
};

Cake.prototype.drawList = function(ctx, centerX, topY, mainColor, edgeColor, spacing) {
    if (spacing === undefined) {
        spacing = 25;
    }
    ctx.font = '20px digital';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (var i = 0; i < this.fillings.length; ++i) {
        var shownText = this.fillings[i];
        var textX = centerX;
        var textY = topY + (CakeView.FILLINGS_PER_CAKE - 1 - i) * spacing;
        ctx.fillStyle = edgeColor;
        ctx.fillText(shownText, textX + 1, textY + 1);
        ctx.fillText(shownText, textX - 1, textY + 1);
        ctx.fillText(shownText, textX + 1, textY - 1);
        ctx.fillText(shownText, textX - 1, textY - 1);
        ctx.fillStyle = mainColor;
        ctx.fillText(shownText, textX, textY);
    }
};

// Text can be undefined
var Article = function(priority, country, headline, text) {
    this.headline = headline;
    this.text = text;
    this.priority = priority;
    this.country = country;
};

var GameState = function() {
    // List of Cakes, filled in by CakeView, cleared by TargetingView
    this.cakes = [];
    // List of Articles, filled in by TargetingView, cleared by NewspaperView
    var art = new Article(11, "Maa", "Demand of cakes increasing worldwide", "[company name] [country] [third filling] [cake company]");
    //art.thirdFilling = "Feta";

    var newsIndex = Math.floor((Math.random()*RANDOM_ARTICLES.length));

    this.news = [
        new Article(10, "", "Food waste illegalized", "From this day onwards, neither consumers nor food manufacturers are allowed to throw away edible things. Anything passable as human nutrition needs to be distributed and eaten. Analysts expect this to be extremely detrimental to innovation in the gastronomic industries."),
        new Article(5, "", "Cake About To Hit the World", "Demand of cakes has increased worldwide, and a local confectionery [company name] aims to answer the high demand using their questionable random cake machine, ‘The Cakifier’. The Cakifier’s advantage on the market lies in the fact that it was originally intended for extremely rapid prototyping: it randomly picks ingredients and bakes a cake faster than anything else would. However, due to the recent changes in international legislation, [company name] is forced to sell every and any combination the Cakifier comes up with. Shareholders expect [company name] to produce and distribute three(3) cakes internationally per day."),
        new Article(1, RANDOM_ARTICLES[newsIndex].country, RANDOM_ARTICLES[newsIndex].headLine, RANDOM_ARTICLES[newsIndex].text)
//        art,
    ];
    // List of strings, filled in by TargetingView based on filled conditions.
    // Read by TargetingView when checking conditions
    this.worldState = [];

    this.balance = 0.0;

    for (var i = 0; i < COUNTRIES.length; i++) {
    	COUNTRIES[i].life = 3;
    }

    this.companyName = "Kakku Keisarit";
};

var views;
var viewIdx = 0;

var leftArrow = function() {
    views[viewIdx].leftArrow();
};
var rightArrow = function() {
    views[viewIdx].rightArrow();
};
var upArrow = function() {
    views[viewIdx].upArrow();
};
var downArrow = function() {
    views[viewIdx].downArrow();
};
var space = function() {
    views[viewIdx].space();
};
var enterKey = function() {
    views[viewIdx].enterKey();
};


var changeView = function() {
    views[viewIdx].exit();
    viewIdx = (viewIdx + 1) % views.length;
    if (viewIdx === 0) {
        ++viewIdx;
    }
    if (viewIdx == 2) {
    	var stillAlive = 0;
    	for (var i = 0; i < COUNTRIES.length; i++) {
    		if (COUNTRIES[i].life > 0) stillAlive++;
    	}
    	if (stillAlive < 3) {
    		this.gameState.news = [new Article(10, "", "Game Over", "In a shocking turn of events, [company name], the confectionery loved by many, was found guilty of several counts of genocide and was forced to seize all operations. The international crisis management task force is quick to point out that by pressing a button that says “New Game”, one might or might not be able to create a separate universe in which none of this happens and there’s more cakes. Or more mantis shrimps. You never know these days.")]
    		viewIdx--; //Back to newspaper view!
    	}
    }
    views[viewIdx].enter();
};

var developerSkip = function() {
    views[viewIdx].developerSkip();
    changeView();
};

var fading = {
    fading: 1,
    fade: 0
};

var webFrame = function() {
    var time = new Date().getTime();
    var updated = false;
    var updates = 0;
    while (time > nextFrameTime) {
        nextFrameTime += 1000 / FPS;
        if (views[viewIdx].update(1000 / FPS) && fading.fading >= 0) {
            fading.fading = -1;
        }
        fading.fade += fading.fading * (2 / FPS);
        if (fading.fade < 0) {
            fading.fade = 0;
            this.changeView();
            fading.fading = 1;
        }
        if (fading.fade > 1) {
            fading.fade = 1;
            fading.fading = 0;
        }
        updates++;
    }
    if (updates > 1) {
        console.log('dropped ' + (updates - 1) + ' frames');
    }
    if (updates > 0) {
        views[viewIdx].draw(mainCtx);
        if (fading.fade < 1.0) {
            fading.fadeDiv.style.opacity = 1 - fading.fade;
            fading.fadeDiv.style.display = 'block';
        } else {
            fading.fadeDiv.style.display = 'none';
        }
    }
    requestAnimationFrame(webFrame);
};

var initGame = function() {

    mainCanvas = document.createElement('canvas');
    mainCtx = mainCanvas.getContext('2d');
    mainCanvas.width = 960;
    mainCanvas.height = 540;
    
    fading.fadeDiv = document.createElement('div');
    fading.fadeDiv.id = 'fader';
    document.body.appendChild(fading.fadeDiv);

    var gameState = new GameState();
    views = [new IntroView(gameState),
             new NewspaperView(gameState),
             new CakeView(gameState),
             new TargetingView(gameState)];
    views[0].enter();
    this.gameState = gameState;

    cwrap = document.createElement('div');
    cwrap.id = 'canvaswrap';
    canvaswrap.appendChild(mainCanvas);
    mainCtx.fillStyle = '#fff';
    mainCtx.fillRect(0, 0, mainCtx.canvas.width, mainCtx.canvas.height);
    nextFrameTime = new Date().getTime() - 1;
    webFrame();
    
    Mousetrap.bindGlobal('left', leftArrow);
    Mousetrap.bindGlobal('right', rightArrow);
    Mousetrap.bindGlobal('down', downArrow);
    Mousetrap.bindGlobal('up', upArrow);
    Mousetrap.bindGlobal('space', space);
    Mousetrap.bindGlobal('enter', enterKey);

    if (DEV_MODE) {
        Mousetrap.bindGlobal('v', developerSkip);
    }
};
