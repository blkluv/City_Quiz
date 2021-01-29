// Global variables
let CorrectModal;
let IncorrectModal;
let ActiveQuiz;
let Difficulty = 1;
let SetToPlay;
let SetName;
let PlayEntireSet = false; 

// Question class
class Question {
    // Constructor
    constructor (query, zoom, formatName, acceptedAnswers) {
        // Set parent variables
        this.Query = query;
        this.Zoom = zoom;
        this.FormatName = formatName;
        this.AcceptedAnswers = acceptedAnswers || [formatName.toLowerCase()];
    }
}

// All cities
let Cities = {
    // Scheme: ISO 3166-2 country and subdivison code c and d, and city name n: cd_n
    // For future reference: 
    // https://unstats.un.org/unsd/methodology/m49/
    // https://www.iso.org/obp/ui/#search
    // https://en.wikipedia.org/wiki/List_of_largest_cities

    // Europe
    // Norway: NO. Oslo: 03, Rogaland: 11, Møre og Romsdal: 15, Nordland: 18, Viken: 30, Innlandet: 34, Vestfold og Telemark: 38, Agder: 42, Vestland: 46, Trøndelag: 50, Troms og Finnmark: 54
    NO11_Sandnes: new Question("Sandnes,Rogaland,Norway", 14, "Sandnes", ["sandnes"]),
    NO11_Stavanger: new Question("Stavanger,Rogaland,Norway", 14, "Stavanger", ["stavanger"]),
    NO11_Haugesund: new Question("Haugesund,Rogaland,Norway", 14, "Haugesund", ["haugesund"]),
    NO46_Bergen: new Question("Torgalmenningen,Bergen,Norway", 12, "Bergen", ["bergen"]),
    NO03_Oslo: new Question("Barcode%20Project,Norway", 13, "Oslo", ["oslo"]),
    NO50_Trondheim: new Question("Trondheim,Norway", 13, "Trondheim", ["trondheim", "trondhjem"]),
    NO30_Drammen: new Question("Drammen,Norway", 13, "Drammen", ["drammen"]),
    NO30_Fredrikstad: new Question("Fredrikstad%20Stasjon,Norway", 14, "Fredrikstad", ["fredrikstad"]),
    NO30_Sarpsborg: new Question("Sarpsborg,Norway", 13, "Sarpsborg", ["sarpsborg"]),
    NO38_Skien: new Question("Klosterøya,Skien,Norway", 13, "Skien", ["skien"]),
    NO38_Porsgrunn: new Question("Sykehuset%20Telemark,Porsgrunn,Norway", 13, "Porsgrunn", ["porsgrunn"]),
    NO42_Kristiansand: new Question("Kvadraturen,Kristiansand,Norway", 13, "Kristiansand", ["kristiansand"]),
    NO15_Alesund: new Question("Sparebanken%20Møre%20Arena,Ålesund,Norway", 12, "Ålesund", ["ålesund", "alesund", "aalesund"]),
    NO38_Tonsberg: new Question("Træleborg,Tønsberg,Norway", 13, "Tønsberg", ["tønsberg", "tonsberg", "toensberg"]),
    NO30_Moss: new Question("Thorneløkka,Moss,Norway", 13, "Moss", ["moss"]),
    NO38_Sandefjord: new Question("Hvalfangstmonumentet,Sandefjord,Norway", 13, "Sandefjord", ["sandefjord"]),
    NO42_Arendal: new Question("Arendal,Norway", 13, "Arendal", ["arendal"]),
    NO18_Bodo: new Question("Bodø,Norway", 12, "Bodø", ["bodø", "bodo", "bodoe"]),
    NO54_Tromso: new Question("Tromsø,Norway", 12, "Tromsø", ["tromsø", "tromso", "tromsoe"]),
    NO34_Hamar: new Question("Hamar,Norway", 13, "Hamar", ["hamar"]),
    NO30_Halden: new Question("Halden%20Stasjon,Norway", 13, "Halden", ["halden"]),
    NO38_Larvik: new Question("Larvik,Norway", 13, "Larvik", ["larvik"]),
    NO46_Askoy: new Question("Kleppestø,Norway", 15, "Askøy", ["kleppestø", "kleppesto", "kleppestoe", "askøy", "askoy", "askoey", "kleppestø, askøy", "kleppesto, askoy", "kleppestoe, askoey"]),
    NO30_Kongsberg: new Question("Kongsberg,Norway", 14, "Kongsberg", ["kongsberg"]),
    NO54_Harstad: new Question("Generalhagen,Harstad,Norway", 13, "Harstad", ["harstad"]),
    NO15_Molde: new Question("Molde,Norway", 13, "Molde", ["molde"]),
    NO34_Gjovik: new Question("Gjøvik,Norway", 14, "Gjøvik", ["gjøvik", "gjovik", "gjoevik"]),
    NO34_Lillehammer: new Question("Lillehammer,Norway", 13, "Lillehammer", ["lillehammer"]),
    NO38_Horten: new Question("Horten,Norway", 13, "Horten", ["horten"]),
    NO30_Ski: new Question("Ski Stasjon,Norway", 14, "Ski", ["ski", "nordre follo"]),

    // Russia: RU. 
    RUMOW_Moscow: new Question("Moscow,RU", 13, "Moscow", ["moscow", "москва"]),
    RU_SaintPetersburg: new Question("Saint Petersburg,RU", 12, "Saint Petersburg", ["saint petersburg", "st. petersburg", "st petersburg", "санкт-петербург", "санкт петербург"]),

    // Ukraine: UA
    UAKV_Kyiv: new Question("Kyiv,UA", 13, "Kyiv", ["kyiv", "kiev", "київ"]),

    // France: FR
    FRIDF_Paris: new Question("Notre%20Dame,Paris,FR", 13, "Paris", ["paris"]),

    // Spain: ES
    ESMD_Madrid: new Question("Madrid,ES", 13, "Madrid", ["madrid"]),
    ES_Barcelona: new Question("Barcelona,ES", 12, "Barcelona"),

    // Sweden: SE
    SEAB_Stockholm: new Question("Stockholm,SE", 12, "Stockholm", ["stockholm"]),

    // Germany: DE
    DEBE_Berlin: new Question("Berlin,DE", 12, "Berlin", ["berlin"]),

    // Finland: FI
    FI18_Helsinki: new Question("Helsinki,FI", 12, "Helsinki", ["helsinki"]),

    // Poland: PL
    PLMZ_Warsaw: new Question("Warsaw,PL", 12, "Warsaw", ["warsaw", "warszawa"]),

    // Italy: IT
    ITRM_Rome: new Question("Colosessum,Rome,IT", 12, "Rome", ["rome", "roma"]),

    // United Kingdom: GB
    GBENG_London: new Question("London,GB", 12, "London", ["london"]),

    // Romania: RO
    ROB_Bucharest: new Question("Bucharest,RO", 13, "Bucharest", ["bucharest", "bucurești"]),

    // Belarus: BY
    BYHM_Minsk: new Question("Minsk,BY", 12, "Minsk", ["minsk", "мінск", "менск", "минск"]),

    // Greece: GR
    GRI_Athens: new Question("Athens,GR", 13, "Athens", ["athens", "αθήνα"]),

    // Bulgaria: BG
    BG22_Sofia: new Question("Sofia,BG", 13, "Sofia", ["sofia", "софия"]),

    // Iceland: IS
    IS1_Reykjavik: new Question("64.13599420450862,-21.92402210755096", 13, "Reykjavik", ["reykjavik", "reykjavík"]),

    // Hungary: HU
    HUBU_Budapest: new Question("Budapest,HU", 13, "Budapest", ["budapest"]),

    // Portugal: PT
    PT11_Lisbon: new Question("Lisbon,PT", 12, "Lisbon", ["lisbon", "lisboa"]),

    // Austria: AT
    AT9_Vienna: new Question("Vienna,AT", 12, "Vienna", ["vienna", "wien"]),

    // Czech Republic: CZ
    CZ10_Prague: new Question("Prague,CZ", 12, "Prague", ["prague", "praha"]),

    // Serbia: RS
    RS00_Belgrade: new Question("Belgrade,RS", 12, "Belgrade", ["belgrade", "beograd", "београд"]),

    // Ireland: IE
    IEL_Dublin: new Question("Dublin,IE", 13, "Dublin", ["dublin"]),

    // Lithuania: LT
    LTVL_Vilnius: new Question("Vilnius,LT", 13, "Vilnius", ["vilnius"]),

    // Latvia: LV
    LVRIX_Riga: new Question("Riga,LV", 12, "Riga", ["riga", "rīga"]),

    // Croatia: HR
    HR21_Zagreb: new Question("Most%20slobode,Zagreb,HR", 13, "Zagreb", ["zagreb"]),

    // Bosnia and Herzegovina: BA
    BABIH_Sarajevo: new Question("Sarajevo,BA", 13, "Sarajevo", ["sarajevo"]),

    // Slovakia: SK
    SKBl_Bratislava: new Question("Bratislava,SK", 12, "Bratislava", ["bratislava"]),

    // Estonia: EE
    EE37_Tallinn: new Question("Tallinn,EE", 12, "Tallinn", ["tallinn"]),

    // Denmark: DK
    DK84_Copenhagen: new Question("Copenhagen,DK", 12, "Copenhagen", ["copenhagen", "københavn"]),

    // Switzerland: CH
    CHBE_Bern: new Question("Bern,CH", 13, "Bern", ["bern"]),

    // Netherlands: NL
    NLNH_Amsterdam: new Question("Amsterdam,NL", 12, "Amsterdam", ["amsterdam"]),

    // Moldova: MD
    MDCU_Chisinau: new Question("Chișinău,MD", 13, "Chișinău", ["chișinău", "chisinau"]),

    // Belgium: BE
    BEBRU_Brussels: new Question("Brussels,BE", 13, "Brussels", ["brussels", "bruxelles"]),

    // Albania: AL
    AL11_Tirana: new Question("Tirana,AL", 13, "Tirana", ["tirana", "tiranë", "tirane"]),

    // North Macedonia: MK
    MK85_Skopje: new Question("Skopje,MK", 13, "Skopje", ["skopje", "скопје", "shkup"]),

    // Slovenia: SI
    SI061_Ljubljana: new Question("Ljubljana,SI", 13, "Ljubljana", ["ljubljana"]),

    // Montenegro: ME
    ME16_Podgorica: new Question("Podgorica,ME", 13, "Podgorica", ["podgorica", "подгорица"]),

    // Luxembourg: LU
    LULU_Luxembourg: new Question("Palais%20Grand-Ducal,Luxembourg,LU", 13, "Luxembourg", ["luxembourg"]),

    // Andorra: AD
    AD07_AndorraLaVella: new Question("Andorra la Vella,AD", 14, "Andorra la Vella", ["andorra la vella", "andorra"]),

    // Malta: MT
    MT60_Valetta: new Question("Valetta,MT", 14, "Valetta", ["valetta"]),

    // Liechtenstein: LI
    LI11_Vaduz: new Question("Vaduz,LI", 14, "Vaduz", ["vaduz"]),

    // San Marino: SM
    SM07SanMarino: new Question("San Marino,SM", 14, "City of San Marino", ["san marino", "città di san sarino", "city of san marino"]),

    // Monaco: MC
    MC_Monaco: new Question("Monaco,MC", 14, "Monaco", ["monaco"]),

    
    // North America

    // Mainland NA

    // United States of America: US
    USAL_Montgomery: new Question("Montgomery,AL", 14, "Montgomery"),
    USAK_Juneau: new Question("Juneau,AK", 14, "Juneau"),
    USAZ_Phoenix: new Question("Phoenix,AZ", 13, "Phoenix"),
    USAR_LittleRock: new Question("Little Rock,AR", 13, "Little Rock"),
    USCA_Sacramento: new Question("Sacramento,CA", 13, "Sacramento"),
    USCO_Denver: new Question("Dever,CO", 13, "Denver"),
    USCT_Hartford: new Question("Hartford,CT", 13, "Hartford"),
    USDE_Dover: new Question("Dover,DE,US", 13, "Dover"),
    USFL_Tallahassee: new Question("Tallahassee,FL", 14, "Tallahassee"),
    USGA_Atlanta: new Question("Atlanta,GA", 13, "Atlanta"),
    USHI_Honolulu: new Question("Honolulu,HI", 13, "Honolulu"),
    USID_Boise: new Question("Boise,ID", 13, "Boise"),
    USIL_Springfield: new Question("Springfield,IL", 13, "Springfield"),
    USIN_Indianapolis: new Question("Indianapolis,IN", 13, "Indianapolis"),
    USIA_Des_Moines: new Question("Des Moines,IA", 13, "Des Moines"),
    USKS_Topeka: new Question("39.05568612488337,-95.67612154084969", 14, "Topeka"),
    USKY_Frankfort: new Question("Frankfort,KY", 14, "Frankfort"),
    USLA_BatonRouge: new Question("Baton Rouge,LA", 13, "Baton Rouge"),
    USME_Augusta: new Question("Augusta,ME", 14, "Augusta"),
    USMD_Annapolis: new Question("Annapolis,MD", 14, "Annapolis"),
    USMA_Boston: new Question("Boston,MA", 13, "Boston"),
    USMI_Lansing: new Question("Lansing,MI", 13, "Lansing"),
    USMN_StPaul: new Question("St. Paul,MN", 13, "St. Paul", ["st. paul", "st paul", "saint paul"]),
    USMS_Jackson: new Question("Jackson,MS", 14, "Jackson"),
    USMO_JeffersonCity: new Question("Jefferson City,MO", 14, "Jefferson City"),
    USNE_Lincoln: new Question("Lincoln,NE", 14, "Lincoln"),
    USNV_CarsonCity: new Question("Carson City,NV", 14, "Carson City"),
    USNH_Concord: new Question("Concord,NH", 14, "Concord"),
    USNJ_Trenton: new Question("Trenton,NJ", 13, "Trenton"),
    USNM_SantaFe: new Question("Santa Fe,NM", 14, "Santa Fe"),
    USNY_Albany: new Question("Albany,NY", 13, "Albany"),
    USNC_Raleigh: new Question("Raleigh,NC", 13, "Raleigh"),
    USND_Bismarck: new Question("Bismarck,ND", 13, "Bismarck"),
    USOH_Columbus: new Question("Columbus,OH", 13, "Columbus"),
    USOK_OklahomaCity: new Question("Oklahoma City,OK", 13, "Oklahoma City"),
    USOR_Salem: new Question("Salem,OR", 14, "Salem"),
    USPA_Harrisburg: new Question("Harrisburg,PA", 13, "Harrisburg"),
    USRI_Providence: new Question("Providence,RI", 13, "Providence"),
    USSC_Columbia: new Question("Columbia,SC", 14, "Columbia"),
    USSD_Pierre: new Question("Pierre,SD", 14, "Pierre"),
    USTN_Nashville: new Question("Nashville,TN", 13, "Nashville"),
    USTX_Austin: new Question("Austin,TX", 13, "Austin"),
    USUT_SaltLakeCity: new Question("Salt Lake City,UT", 13, "Salt Lake City"),
    USVT_Montpelier: new Question("Montpelier,VT", 15, "Montpelier"),
    USVA_Richmond: new Question("Richmond,VA", 13, "Richmond"),
    USWA_Olympia: new Question("Olympia,WA", 13, "Olympia"),
    USWV_Charleston: new Question("Charleston,WV", 13, "Charleston"),
    USWI_Madison: new Question("Madison,WI", 13, "Madison"),
    USWY_Cheyenne: new Question("Cheyenne,WY", 14, "Cheyenne"),
    USDC_Washington: new Question("Lincoln%20Memorial,Washington,DC", 13, "Washington, D.C.", ["washington", "washington dc", "washington, d.c.", "washington d.c.", "dc", "d.c.", "washington, district of columbia", "district of columbia", "washington district of columbia"]),
    USAS_PagoPago: new Question("Pago Pago,AS", 15, "Pago Pago"),
    USGU_Hagatna: new Question("Hagåtña, GU", 15, "Hagåtña", ["hagåtña", "hagatna", "hagatnja"]),
    USMP_Saipain: new Question("Chalan Piao,MP", 14, "Saipan", ["chalan piao", "saipan"]),
    USPR_SanJuan: new Question("Puerto%20Rico%20Terminal,PR", 13, "San Juan"),
    USVI_CharlotteAmalie: new Question("Charlotte Amalie,VI", 14, "Charlotte Amalie"),
    USNY_NewYorkCity: new Question("New York City,NY", 11, "New York City", ["new york city", "new york"]),
    USCA_LosAngeles: new Question("Bevery Hills,Los Angeles,CA", 11, "Los Angeles"),
    USIL_Chicago: new Question("Chicago,IL", 12, "Chicago"),
    USTX_Houston: new Question("Houston,TX", 13, "Houston"),
    USPA_Philadelphia: new Question("Philadelphia,PA", 13, "Philadelphia"),
    USTX_SanAntonio: new Question("San Antonio,TX", 13, "San Antonio"),
    USCA_SanDiego: new Question("San Diego,CA", 12, "San Diego"),
    USTX_Dallas: new Question("Dallas,TX", 13, "Dallas"),
    USCA_SanJose: new Question("San Jose,CA", 12, "San Jose"),
    USFL_Jacksonvile: new Question("Jacksonville,FL", 12, "Jacksonville"),
    USTX_ForthWorth: new Question("Fort Worth,TX", 13, "Fort Worth"),
    USNC_Charlotte: new Question("Charlotte, NC", 13, "Charlotte"),
    USCA_SanFrancisco: new Question("San Francisco, CA", 11, "San Francisco"),
    USWA_Seattle: new Question("Seattle,WA", 12, "Seattle"),
    USTX_ElPaso: new Question("El Paso,TX", 13, "El Paso"),
    USMI_Detroit: new Question("Detroit,MI", 13, "Detroit"),
    USOR_Portland: new Question("Portland,OR", 12, "Portland"),
    USNV_LasVegas: new Question("Las Vegas,NV", 13, "Las Vegas"),
    USTN_Memphis: new Question("Memphis,TN", 13, "Memphis"),
    USKY_Louisville: new Question("Louisville,KY", 13, "Louisville"),
    USMD_Baltimore: new Question("Baltimore,MD", 13, "Baltimore"),
    USFL_Miami: new Question("Miami,FL", 12, "Miami"),

    // Canada: CA
    CA_Ottawa: new Question("Ottawa,CA", 13, "Ottawa"),
    CA_Toronto: new Question("Toronto,CA", 13, "Toronto"),

    // Mexico: MX
    MX_MexicoCity: new Question("Mexico City,MX", 12, "Mexico City", ["mexico city", "ciudad de mexico", "ciudad de méxico"]),
    MX_Guadalajara: new Question("Guadalajara,MX", 12, "Guadalajara"),


    // Central America

    // Belize: BZ
    BZ_Belmopan: new Question("17.249718736487612,-88.77482133927614", 14, "Belmopan"),

    // Costa Rica: CR
    CR_SanJose: new Question("San Jose,CR", 13, "San José"),

    // El Salvador: SV
    SV_SanSalvador: new Question("San Salvador,SV", 13, "San Salvador"),

    // Guatemala: GT
    GT_GuatemalaCity: new Question("Guatemala City,GT", 13, "Guatemala City", ["guatemala city", "guatemala", "ciudad de guatemala"]),

    // Honduras: HN
    HN_Tegucigalpa: new Question("Tegucigalpa,HN", 14, "Tegucigalpa"),

    // Nicaragua: NI
    NI_Managua: new Question("12.141746057514073,-86.23472491667405", 14, "Managua"),

    // Panama: PA
    PA_PanamaCity: new Question("8.974352249627257,-79.5320251153119", 13, "Panama City", ["panama city", "ciudad de panama"]),


    // Caribbean

    // Antigua and Barbuda: AG
    AG_StJohns: new Question("St John's,AG", 14, "St John's", ["st john's", "st. john's", "st. johns", "st johns", "saint john's", "saint johns"]),

    // Bahamas: 
    BS_Nassau: new Question("Nassau,BS", 13, "Nassau"),

    // Barbados: BB
    BB_Bridgetown: new Question("Bridgetown,BB", 14, "Bridgetown"),

    // Cuba: CU
    CU_Havana: new Question("Havana,CU", 13, "Havana", ["havana", "la habana", "habana"]),

    // Dominica: DM
    DM_Roseau: new Question("15.303355522937578,-61.38328958409704", 15, "Roseau"),

    // Dominican Republic: DO
    DO_SantoDomingo: new Question("Santo Domingo,DO", 13, "Santo Domingo"),

    // Grenada: GD
    GD_SaintGeorges: new Question("12.050832154956812,-61.750482263282464", 15, "Saint George's", ["saint georges", "st. george's", "st georges", "saint george's"]),

    // Haiti: HT
    HT_PortAuPrince: new Question("18.559152198412633,-72.31765312911371", 13, "Port-au-Prince", ["port-au-prince", "port au prince"]),

    // Jamaica: JM
    JM_Kingston: new Question("Kingston,JM", 12, "Kingston"),

    // Saint Kitts and Nevis: KN
    KN_Basseterre: new Question("Basseterre,KN", 14, "Basseterre"),

    // Saint Lucia: LC
    LC_Castries: new Question("Castries,LC", 14, "Castries"),

    // Saint Vincent and the Grenadines: VC
    VC_Kingstown: new Question("Kingstown,VC", 15, "Kingstown"),

    // Trinidad and Tobago: TT
    TT_PortOfSpain: new Question("Port of Spain,TT", 14, "Port of Spain", ["port of spain", "puerto españa", "puerto espana"]),

    
    // South America

    // Argentina: AR
    AR_BuenosAires: new Question("-34.59587806430996,-58.39333844020621", 12, "Buenos Aires"),

    // Bolivia: BO
    BO_LaPaz: new Question("-16.506124650345612,-68.1320557282154", 13, "La Paz"),

    // Brazil: BR
    BR_Brasilia: new Question("-15.793759808178818,-47.88280591732727", 12, "Brasília", ["brasilia", "brasília"]),
    BR_SaoPaulo: new Question("Sao Paulo,BR", 12, "São Paulo", ["sao paulo", "são paulo"]),
    BR_RioDeJainero: new Question("-22.90982753846069,-43.25032348088225", 12, "Rio de Janeiro"),
    BR_BeloHorizonte: new Question("Belo Horizonte,BR", 13, "Belo Horizonte"),

    // Chile: CL
    CL_Santiago: new Question("Santiago,CL", 12, "Santiago"),

    // Colombia: CO
    CO_Bogota: new Question("Bogota,CO", 13, "Bogota", ["bogota", "bogotá"]),
    
    // Ecuador: EC
    EC_Quito: new Question("Quito,EC", 12, "Quito"),

    // Guyana: GY
    GY_Georgetown: new Question("Georgetown,GY", 13, "Georgetown"),

    // Paraguay: PY
    PY_Asuncion: new Question("-25.296162735747956,-57.604880210492034", 12, "Asunción", ["asunción", "asuncion"]),

    // Peru: PE
    PE_Lima: new Question("Lima,PE", 12, "Lima", ["lima", "lima district"]),

    // Suriname: SR
    SR_Paramaribo: new Question("5.83562113597878,-55.16240409102544", 13, "Paramaribo"),

    // Uruguay: UY
    UY_Montevideo: new Question("Montevideo,UY", 12, "Montevideo"),

    // Venezuela: VE
    VE_Caracas: new Question("Caracas,VE", 13, "Caracas"),


    // Asia

    // Central Asia
    
    // Kazakhstan: KZ
    KZ_NurSultan: new Question("Nur-Sultan,KZ", 13, "Nur-Sultan", ["nur-sultan", "nur sultan", "нұр-сұлтан", "нұр сұлтан"]),

    // Kyrgyzstan: KG
    KG_Bishkek: new Question("Bishkek,KG", 13, "Bishkek", ["bishkek", "бишкек"]),

    // Tajikistan: TJ
    TJ_Dushanbe: new Question("Dushanbe,TJ", 13, "Dushanbe", ["dushanbe", "душанбе"]),

    // Turkmenistan: TM
    TM_Ashgabat: new Question("37.94044188585668,58.40071752389324", 13, "Ashgabat", ["ashgabat", "aşgabat", "asgabat"]),

    // Uzbekistan: UZ
    UZ_Tashkent: new Question("Bunyodkor%20Square,Tashkent,UZ", 13, "Tashkent", ["tashkent", "тошкент"]),

    
    // Western Asia

    // Armenia: AM
    AM_Yerevan: new Question("Yerevan,AM", 13, "Yerevan", ["yerevan", "երևան"]),

    // Azerbaijan: AZ
    AZ_Baku: new Question("Baku,AZ", 12, "Baku", ["baku", "bakı"]),

    // Bahrain: BH
    BH_Manama: new Question("Manama,BH", 13, "Manama", ["manama", "المنامة"]),

    // Cyprus: CY
    CY_Nicosia: new Question("Saint%20Sophia%20Cathedral,Nicosia,CY", 13, "Nicosia", ["nicosia", "λευκωσία"]),

    // Georgia: GE
    GE_Tbilisi: new Question("Tbilisi,GE", 13, "Tbilisi", ["tbilisi", "თბილისი"]),

    // Iraq: IQ
    IQ_Baghdad: new Question("Baghdad,IQ", 13, "Baghdad", ["baghdad", "بغداد"]),

    // Israel: IL
    // For the purpose of this quiz, Jerusalem is in Israel.
    IL_Jerusalem: new Question("Jerusalem", 13, "Jerusalem", ["jerusalem", "ירושלים", "القُدس"]),

    // Jordan: JO
    JO_Amman: new Question("Amman,JO", 13, "Amman", ["amman", "عمّان"]),

    // Kuwait: KW
    KW_KuwaitCity: new Question("Kuwait City,KW", 13, "Kuwait City", ["kuwait city", "مدينة الكويت"]),

    // Lebanon: LB
    LB_Beirut: new Question("Beirut,LB", 13, "Beirut", ["beirut", "بيروت"]),

    // Oman: OM
    OM_Muscat: new Question("23.594404504657824,58.445742397862496", 12, "Muscat", ["muscat", "مسقط"]),

    // Qatar: QA
    QA_Doha: new Question("Doha,QA", 12, "Doha", ["doha", "الدوحة"]),

    // Saudi Arabia: SA
    SA_Riyadh: new Question("Riyadh,SA", 12, "Riyadh", ["riyadh", "الرياض"]),

    // Syria: SY
    SY_Damascus: new Question("33.500125914524176,36.291779130892174", 13, "Damascus", ["damascus", "دمشق"]),

    // Turkey: TR
    TR_Ankara: new Question("Ankara,TR", 13, "Ankara"),
    TR_Istanbul: new Question("41.0339896717834,29.00227760434989", 12, "İstanbul", ["istanbul", "i̇stanbul"]),

    // United Arab Emirates: AE
    AE_AbuDhabi: new Question("Abu Dhabi,AE", 12, "Abu Dhabi", ["abu dhabi", "أبو ظبي"]),

    // Yemen: YE
    YE_Sanaa: new Question("Sana'a,YE", 13, "Sana'a", ["sana'a", "sanaa", "sana a", "صنعاء‎"]),


    // Eastern Asia

    // China: CN
    CN_Beijing: new Question("Beijing,CN", 12, "Beijing"),
    CN_HongKong: new Question("Hong Kong", 12, "Hong Kong", ["hong kong", "香港"]),
    CN_Macau: new Question("Macau", 12, "Macau", ["macau", "澳門", "macao"]),
    CN_Shanghai: new Question("Shanghai,CN", 11, "Shanghai", ["shanghai", "上海市"]),
    CN_Chongqing: new Question("29.53041735117703,106.51004857524514", 12, "Chongqing", ["chongqing", "重庆市"]),
    CN_Tianjin: new Question("39.041176543409094,117.43083312561843", 10, "Tianjin", ["tianjin", "天津市"]),
    CN_Guangzhou: new Question("23.101688839025908,113.31859275981766", 11, "Guangzhou", ["guangzhou", "广州市"]),
    CN_Shenzhen: new Question("22.541825057544028,113.99857568695052", 11, "Shenzhen", ["shenzhen", "深圳市"]),
    CN_Chengdu: new Question("30.658194604748203,104.06538493799329", 11, "Chengdu", ["chengdu", "成都市"]),
    CN_Nanjing: new Question("32.098471043878575,118.72545595314396", 11, "Nanjing", ["nanjing", "南京市"]),
    CN_Wuhan: new Question("Wuhan,CN", 12, "Wuhan", ["wuhan", "武汉市"]),
    CN_Xian: new Question("Xi'an,CN", 11, "Xi'an", ["xi'an", "xian", "xi an", "西安市"]),
    CN_Dongguan: new Question("Dongguan,CN", 11, "Dongguan", ["dongguan", "东莞市"]),
    CN_Hangzhou: new Question("Hangzhou,CN", 12, "Hangzhou", ["hangzhou", "杭州市"]),
    CN_Foshan: new Question("Foshan,CN", 12, "Foshan", ["foshan", "佛山市"]),
    CN_Shenyang: new Question("Shenyang,CN", 12, "Shenyang", ["shenyang", "沈阳市"]),
    CN_Suzhou: new Question("Suzhou,CN", 11, "Suzhou", ["suzhou", "苏州市"]),
    CN_Harbin: new Question("45.75118398404859,126.63503358779869", 12, "Harbin", ["harbin", "哈尔滨市"]),
    CN_Qingdao: new Question("36.084118270198516,120.26102878838749", 11, "Qingdao", ["qingdao", "青岛市"]),
    CN_Dalian: new Question("38.99195617233138,121.6879700846968", 11, "Dalian", ["dalian"]),
    CN_Jinan: new Question("36.683555253546295,117.02622201044134", 12, "Jinan", ["jinan", "济南市"]),

    // Taiwan is a country for the purpose of this quiz
    // Taiwan: TW
    TW_Taipei: new Question("Taipei,TW", 12, "Taipei", ["taipei", "台北"]),

    // North Korea: KP
    KP_Peyongyang: new Question("Peyongyang,KP", 12, "Peyongyang", ["peyongyang", "평양"]),

    // Japan: JP
    JP_Tokyo: new Question("35.65215309344215,139.76374158507505", 12, "Tokyo", ["tokyo", "東京都"]),
    JP_Osaka: new Question("34.65897638415954,135.46888841841673", 12, "Osaka", ["osaka", "大阪市"]),
    JP_Nagoya: new Question("35.151009971329515,136.9054820513379", 12, "Nagoya", ["nagoya", "名古屋市"]),
    JP_Fukuoka: new Question("Fukuoka,JP", 12, "Fukuoka", ["fukoka", "福岡市"]),

    // Mongolia: MN
    MN_Ulaanbaatar: new Question("47.908197953446304,106.91802085541644", 13, "Ulaanbaatar", ["ulaanbaatar", "улаанбаатар"]),

    // South Korea: KR
    KR_Seoul: new Question("Seoul,KR", 12, "Seoul", ["seoul", "서울특별시"]),


    // South-Eastern Asia

    // Brunei: BN
    BN_BandarSeriBegawan: new Question("Bandar Seri Begawan,BN", 13, "Bandar Seri Begawan"),

    // Cambodia: KH
    KH_PhenomPenh: new Question("Phnom Penh,KH", 13, "Phnom Penh", ["phnom penh", "រាជធានី​ភ្នំពេញ"]),

    // Indonesia: ID
    ID_Jakarta: new Question("National%20Monument,Jakarta,ID", 12, "Jakarta"),

    // Laos: LA
    LA_Vientiane: new Question("Vientiane,LA", 13, "Vientiane", ["vientiane", "ວຽງຈັນ"]),

    // Malaysia: MY
    MY_KualaLumpur: new Question("3.1543511105192623,101.68496738207166", 12, "Kuala Lumpur"),

    // Myanmar: MM
    MM_Naypyitaw: new Question("19.749868673641554,96.08540212024712", 13, "Naypyitaw", ["naypyitaw", "နေပြည်တော်"]),
    MM_Yangon: new Question("Yangon,MM", 12, "Yangon", ["yangon", "ရန်ကုန်"]),

    // Philippines: PH
    PH_Manila: new Question("Manila,PH", 12, "Manila"),

    // Singapore: SG
    SG_Singapore: new Question("1.30236765807081,103.84958970443697", 12, "Singapore"),

    // Thailand: TH
    TH_Bangkok: new Question("Bangkok,TH", 12, "Bangkok", ["bangkok", "กรุงเทพมหานคร"]),

    // Timor-Leste: TL
    TL_Dili: new Question("Dili,TL", 13, "Dili"),

    // Vietnam: VN
    VN_Hanoi: new Question("Hanoi,VN", 13, "Hanoi", ["hanoi", "ha noi", "hà nội", "hoàn kiếm", "hoan kiem"]),
    VM_HoChiMinhCity: new Question("10.784882948074642,106.7123749413786", 13, "Ho Chi Minh City"),


    // Southern Asia

    // Afghanistan: AF
    AF_Kabul: new Question("34.53543285351253,69.17978518015983", 13, "Kabul", ["kabul", "کابل"]),

    // Bangladesh: BD
    BD_Dhaka: new Question("Dhaka,BD", 12, "Dhaka", ["dhaka", "ঢাকা"]),

    // Bhutan: BT
    BT_Thimphu: new Question("27.465263737348632,89.64388811067192", 14, "Thimphu"),

    // India: IN
    IN_NewDelhi: new Question("New Delhi,IN", 12, "New Delhi", ["new delhi", "delhi", "नई दिल्ली"]),
    IN_Mumbai: new Question("19.018458330154452,72.84737658966236", 11, "Mumbai", ["mumbai", "मुंबई", "bombay"]),
    IN_Kolkata: new Question("Kolkata,IN", 12, "Kolkata", ["kolkata", "কলকাতা]", "calcutta"]),
    IN_Bangalore: new Question("Bangalore,IN", 12, "Bangalore", ["bangalore", "bengaluru", "ಬೆಂಗಳೂರು"]),
    IN_Chennai: new Question("13.056120032397454,80.22524413963409", 12, "Chennai", ["chennai"]),
    IN_Hyderabad: new Question("17.380947517427618,78.4372193845361", 12, "Hyderabad", ["hyderabad", "హైదరాబాద్"]),
    IN_Ahmedabad: new Question("Ahmedabad,IN", 12, "Ahmedabad", ["ahmedabad", "અમદાવાદ"]),
    IN_Surat: new Question("21.187849578147176,72.84349334304075", 12, "Surat"),
    IN_Pune: new Question("18.518462239367764,73.85518003902651", 13, "Pune", ["pune", "पुणे"]),

    // Iran: IR
    IR_Tehran: new Question("Tehran,IR", 12, "Tehran", ["tehran", "تهران"]),

    // Maldives: MV
    MV_Male: new Question("Malé,MV", 14, "Malé", ["male", "malé"]),

    // Nepal: NP
    NP_Kathmandu: new Question("Kathmandu,NP", 13, "Kathmandu", ["kathmandu", "काठमाडौँ"]),

    // Pakistan: PK
    PK_Islamabad: new Question("Islamabad,PK", 13, "Islamabad", ["islamabad", "اسلام آباد"]),
    PK_Karachi: new Question("24.83105445375928,67.01892079364137", 13, "Karachi", ["karachi", "کراچی"]),
    PK_Lahore: new Question("Lahore,PK", 12, "Lahore", ["lahore", "لاہور"]),

    // Sri Lanka: LK
    // Sri Jayawardenepura Kotte is the de jure capital.
    LK_SriJayawardenepuraKotte: new Question("Sri Jayawardenepura Kotte,LK", 13, "Sri Jayawardenepura Kotte"),

    
    // Africa

    // Northern Africa

    // Algeria: DZ
    DZ_Algiers: new Question("36.73926126973858,3.1401109631321784", 12, "Algiers", ["algiers", "مدينة الجزائر"]),

    // Egypt: EG
    EG_Cairo: new Question("Cairo,EG", 12, "Cairo", ["cairo", "القاهرة"]),
    EG_Alexandria: new Question("Alexandria,EG", 12, "Alexandria", ["alexandria", "الإسكندرية"]),

    // Libya: LY
    LY_Tripoli: new Question("Tripoli,LY", 13, "Tripoli", ["tripoli", "طرابلس"]),

    // Morocco: MA
    MA_Rabat: new Question("33.9871202227261,-6.851317891285377", 12, "Rabat", ["rabat", "الرباط"]),

    // Sudan: SD
    SD_Khartoum: new Question("15.55597653510002,32.55369784874869", 12, "Khartoum", ["khartoum", "الخرطوم"]),

    // Tunisia: TN
    TN_Tunis: new Question("Tunis,TN", 12, "Tunis", ["tunis", "تونس"]),


    // Western Africa

    // Benin: BJ
    BJ_PortoNovo: new Question("6.48516716689515,2.625304061840653", 13, "Porto-Novo", ["porto-novo", "porto novo"]),

    // Burkina Faso: BF
    BF_Ouagadougou: new Question("Ouagadougou,BF", 13, "Ouagadougou"),

    // Cabo Verde: CV
    CV_Praia: new Question("Praia,CV", 13, "Praia"),

    // Côte d’Ivoire: CI
    CI_Yamoussoukro: new Question("6.816708147354264,-5.275004023189095", 14, "Yamoussoukro"),

    // Gambia: GM
    GM_Banjul: new Question("Banjul,GM", 14, "Banjul"),

    // Ghana: GH
    GH_Accra: new Question("Accra,GH", 12, "Accra"),

    // Guinea: GN
    GN_Conakry: new Question("Conakry,GN", 11, "Conakry"),

    // Guinea-Bissau: GW
    GW_Bissau: new Question("11.867873053265104, -15.60862036773853", 13, "Bissau"),

    // Liberia: LR
    LR_Monrovia: new Question("6.309849823376375,-10.773524344285931", 13, "Monrovia"),

    // Mali: ML
    ML_Bamako: new Question("Bamako,ML", 13, "Bamako"),

    // Mauritania: MR
    MR_Nouakchott: new Question("Nouakchott,MR", 12, "Nouakchott", ["nouakchott", "نواكشوط"]),

    // Niger: NE
    NE_Niamey: new Question("Niamey,NE", 12, "Niamey"),

    // Nigeria: NG
    NG_Abuja: new Question("Abuja,NG", 12, "Abuja"),
    NG_Lagos: new Question("6.458513753352044,3.374406061531793", 12, "Lagos"),

    // Senegal: SN
    SN_Dakar: new Question("Dakar,SN", 12, "Dakar"),

    // Sierra Leone: SL
    SL_Freetown: new Question("Freetown,SL", 13, "Freetown"),

    // Togo: TG
    TG_Lome: new Question("6.1509180174696585,1.2354344368181667", 13, "Lomé", ["lome", "lomé"]),

    
    // Eastern Africa

    // Burundi: BI
    BI_Bujumbura: new Question("-3.373164824280705,29.350021123852834", 13, "Bujumbura"),

    // Comoros: KM
    KM_Moroni: new Question("Moroni,KM", 14, "Moroni", ["moroni", "موروني"]),

    // Djibouti: DJ
    DJ_Djibouti: new Question("11.575614920149501,43.14547463687727", 13, "Djibouti", ["djibouti", "جيبوتي‎"]),

    // Eritrea: ER
    ER_Asmara: new Question("Asmara,ER", 13, "Asmara", ["asmara", "أسمرة"]),

    // Ethiopia: ET
    ET_AddisAbaba: new Question("8.998090061563595,38.7586823595628", 13, "Addis Ababa", ["addis ababa", "አዲስ አበባ"]),

    // Kenya: KE
    KE_Nairobi: new Question("-1.296606433683914,36.87531051469906", 13, "Nairobi"),

    // Madagascar: MG
    MG_Antananarivo: new Question("-18.90602042991008,47.525082943685504", 13, "Antananarivo"),

    // Malawi: MW
    MW_Lilongwe: new Question("Lilongwe,MW", 13, "Lilongwe"),

    // Mauritius: MU
    MU_PortLouis: new Question("Port Louis,MU", 13, "Port Louis"),

    // Mozambique: MZ
    MZ_Maputo: new Question("-25.950029916473373,32.57564584938457", 13, "Maputo"),

    // Rwanda: RW
    RW_Kigali: new Question("Kigali,RW", 13, "Kigali"),

    // Seychelles: SC
    SC_Victoria: new Question("-4.621789319609552,55.45221620870077", 14, "Victoria"),

    // Somalia: SO
    SO_Mogadishu: new Question("Mogadishu,SO", 13, "Mogadishu", ["mogadishu", "مقديشو‎"]),

    // South Sudan: SS
    SS_Juba: new Question("4.845323025795621,31.584501948261114", 13, "Juba"),

    // Uganda: UG
    UG_Kampala: new Question("Kampala,UG", 12, "Kampala"),

    // Tanzania: TZ
    TZ_Dodoma: new Question("Dodoma,TZ", 13, "Dodoma"),
    TZ_DarEsSalaam: new Question("-6.816848511055588,39.2702996438777", 13, "Dar es Salaam"),

    // Zambia: ZM
    ZM_Lusaka: new Question("Lusaka,ZM", 12, "Lusaka"),

    // Zimbabwe: ZW
    ZW_Harare: new Question("-17.835952868614406,31.047554363505483", 13, "Harare"),


    // Middle Africa

    // Angola: AO
    AO_Luanda: new Question("Luanda,AO", 12, "Luanda"),

    // Cameroon: CM
    CM_Yaounde: new Question("Yaounde,CM", 13, "Yaounde"),

    // Central African Republic: CF
    CF_Bangui: new Question("Bangui,CF", 12, "Bangui"),

    // Chad: TD
    TD_NDjamena: new Question("N'Djamena,TD", 12, "N'Djamena", ["n'djamena", "n djamena", "ndjamena", "إنجامينا"]),

    // Congo: CG
    CG_Brazzaville: new Question("-4.262187511720094,15.263287188216271", 13, "Brazzaville"),

    // Democratic Republic of the Congo: CD
    CD_Kinshasa: new Question("-4.333698257227162,15.300332974343227", 12, "Kinshasa"),

    // Equatorial Guinea: GQ
    GQ_Malabo: new Question("3.742103505929251,8.759836697860926", 13, "Malabo"),

    // Gabon: GA
    GA_Libreville: new Question("Libreville,GA", 13, "Libreville"),

    // Sao Tome and Principe: ST
    ST_SaoTome: new Question("0.3428586466988996,6.728509430872581", 14, "São Tomé", ["sao tome", "são tomé"]),


    // Southern Africa

    // Botswana: BW
    BW_Gaborone: new Question("-24.654771693952117,25.90730835256741", 12, "Gaborone"),

    // Eswatini: SZ
    SZ_Mbabane: new Question("-26.313610218571366,31.13370586001086", 13, "Mbabane"),

    // Lesotho: LS
    LS_Maseru: new Question("Maseru,LS", 13, "Maseru"),

    // Namibia: NA
    NA_Windhoek: new Question("Windhoek,NA", 13, "Windhoek"),

    // South Africa: ZA
    ZA_CapeTown: new Question("-33.9444999526873, 18.477117670821627", 12, "Cape Town"),
    ZA_Pretoria: new Question("Pretoria,ZA", 13, "Pretoria"),
    ZA_Bloemfontein: new Question("-29.119225501787085,26.218450777331118", 13, "Bloemfontein"),
    ZA_Johannesburg: new Question("Johannesburg,ZA", 12, "Johannesburg"),


    // Oceania

    // Australia and New Zealand

    // Australia: AU
    AU_Canberra: new Question("-35.29493269593273,149.1265014572204", 13, "Canberra"),

    // New Zealand: NZ
    NZ_Wellington: new Question("Wellington,NZ", 12, "Wellington"),


    // Melanesia

    // Fiji: FJ
    FJ_Suva: new Question("Suva,FJ", 13, "Suva"),

    // Papua New Guinea: PG
    PG_PortMoresby: new Question("-9.451710674016937,147.1865826797314", 13, "Port Moresby"),

    // Solomon Islands: SB
    SB_Honiara: new Question("Honiara,SB", 13, "Honiara"),

    // Vanuatu: VU
    VU_PortVila: new Question("-17.741929902441512,168.31900200166007", 13, "Port Vila"),


    // Micronesia

    // Kiribati: KI
    KI_Tarawa: new Question("1.3296169094142725,172.97830578844227", 15, "Tarawa"),

    // Marshall Islands: MH
    MH_Majuro: new Question("7.101525454351255,171.3286102860227", 13, "Majuro"),

    // Micronesia: FM
    FM_Palikir: new Question("Palikir,FM", 15, "Palikir"),

    // Nauru: NR
    NR_Yaren: new Question("Yaren,NR", 15, "Yaren"),

    // Palau: PW
    PW_Ngerulmud: new Question("Ngerulmud,PW", 15, "Ngerulmud"),

    
    // Polynesia

    // Niue: NU
    NU_Alofi: new Question("Alofi,NU", 15, "Alofi"),

    // Samoa: WS
    WS_Apia: new Question("Apia,WS", 14, "Apia"),

    // Tokelau: TK
    TK_Nukunonu: new Question("-9.201201872390989,-171.8478143549439", 16, "Nukunonu"),

    // Tonga: TO
    TO_Nukualofa: new Question("-21.140947029865778,-175.19662333758913", 15, "Nuku'alofa", ["nuku'alofa", "nukualofa", "nuku alofa"]),

    // Tuvalu: TV
    TV_Funafuti: new Question("Funafuti,TV", 15, "Funafuti"),
};

// City groups
let CityGroups = {
    "norway": {
        FormatName: "The 30 largest cities in Norway",
        Cities: [
            Cities.NO11_Sandnes,
            Cities.NO11_Stavanger,
            Cities.NO11_Haugesund,
            Cities.NO46_Bergen,
            Cities.NO03_Oslo,
            Cities.NO50_Trondheim,
            Cities.NO30_Drammen,
            Cities.NO30_Fredrikstad,
            Cities.NO30_Sarpsborg,
            Cities.NO38_Skien,
            Cities.NO38_Porsgrunn,
            Cities.NO42_Kristiansand,
            Cities.NO15_Alesund,
            Cities.NO38_Tonsberg,
            Cities.NO30_Moss,
            Cities.NO38_Sandefjord,
            Cities.NO42_Arendal,
            Cities.NO18_Bodo,
            Cities.NO54_Tromso,
            Cities.NO34_Hamar,
            Cities.NO38_Larvik,
            Cities.NO46_Askoy,
            Cities.NO30_Kongsberg,
            Cities.NO54_Harstad,
            Cities.NO15_Molde,
            Cities.NO34_Gjovik,
            Cities.NO34_Lillehammer,
            Cities.NO38_Horten,
            Cities.NO30_Ski
        ]
    },
    "westerneurope": {
        FormatName: "Capitals of Western Europe",
        Cities : [
            Cities.AD07_AndorraLaVella,
            Cities.AT9_Vienna,
            Cities.BEBRU_Brussels,
            Cities.DK84_Copenhagen,
            Cities.FI18_Helsinki,
            Cities.FRIDF_Paris,
            Cities.DEBE_Berlin,
            Cities.GRI_Athens,
            Cities.IS1_Reykjavik,
            Cities.IEL_Dublin,
            Cities.ITRM_Rome,
            Cities.LI11_Vaduz,
            Cities.LULU_Luxembourg,
            Cities.MT60_Valetta,
            Cities.MC_Monaco,
            Cities.NLNH_Amsterdam,
            Cities.NO03_Oslo,
            Cities.PT11_Lisbon,
            Cities.SM07SanMarino,
            Cities.ESMD_Madrid,
            Cities.SEAB_Stockholm,
            Cities.CHBE_Bern,
            Cities.GBENG_London
        ]
    },
    "easterneurope": {
        FormatName: "Capitals of Eastern Europe",
        Cities : [
            Cities.EE37_Tallinn,
            Cities.LTVL_Vilnius,
            Cities.LVRIX_Riga,
            Cities.PLMZ_Warsaw,
            Cities.CZ10_Prague,
            Cities.HUBU_Budapest,
            Cities.ROB_Bucharest,
            Cities.BG22_Sofia,
            Cities.SI061_Ljubljana,
            Cities.SKBl_Bratislava,
            Cities.HR21_Zagreb,
            Cities.AL11_Tirana,
            Cities.ME16_Podgorica,
            Cities.RS00_Belgrade,
            Cities.MK85_Skopje,
            Cities.BABIH_Sarajevo,
            Cities.BYHM_Minsk,
            Cities.MDCU_Chisinau,
            Cities.RUMOW_Moscow,
            Cities.UAKV_Kyiv
        ]
    },
    "europe": {
        FormatName: "Capitals of Europe",
        Cities : [
            Cities.EE37_Tallinn,
            Cities.LTVL_Vilnius,
            Cities.LVRIX_Riga,
            Cities.PLMZ_Warsaw,
            Cities.CZ10_Prague,
            Cities.HUBU_Budapest,
            Cities.ROB_Bucharest,
            Cities.BG22_Sofia,
            Cities.SI061_Ljubljana,
            Cities.SKBl_Bratislava,
            Cities.HR21_Zagreb,
            Cities.AL11_Tirana,
            Cities.ME16_Podgorica,
            Cities.RS00_Belgrade,
            Cities.MK85_Skopje,
            Cities.BABIH_Sarajevo,
            Cities.BYHM_Minsk,
            Cities.MDCU_Chisinau,
            Cities.RUMOW_Moscow,
            Cities.UAKV_Kyiv,
            Cities.AD07_AndorraLaVella,
            Cities.AT9_Vienna,
            Cities.BEBRU_Brussels,
            Cities.DK84_Copenhagen,
            Cities.FI18_Helsinki,
            Cities.FRIDF_Paris,
            Cities.DEBE_Berlin,
            Cities.GRI_Athens,
            Cities.IS1_Reykjavik,
            Cities.IEL_Dublin,
            Cities.ITRM_Rome,
            Cities.LI11_Vaduz,
            Cities.LULU_Luxembourg,
            Cities.MT60_Valetta,
            Cities.MC_Monaco,
            Cities.NLNH_Amsterdam,
            Cities.NO03_Oslo,
            Cities.PT11_Lisbon,
            Cities.SM07SanMarino,
            Cities.ESMD_Madrid,
            Cities.SEAB_Stockholm,
            Cities.CHBE_Bern,
            Cities.GBENG_London
        ]
    },
    "statecapitals": {
        FormatName: "US state capitals",
        Cities: [
            Cities.USAL_Montgomery,
            Cities.USAK_Juneau,
            Cities.USAZ_Phoenix,
            Cities.USCA_Sacramento,
            Cities.USCO_Denver,
            Cities.USCT_Hartford,
            Cities.USDE_Dover,
            Cities.USFL_Tallahassee,
            Cities.USGA_Atlanta,
            Cities.USHI_Honolulu,
            Cities.USIA_Des_Moines,
            Cities.USID_Boise,
            Cities.USIL_Springfield,
            Cities.USIN_Indianapolis,
            Cities.USKS_Topeka,
            Cities.USKY_Frankfort,
            Cities.USLA_BatonRouge,
            Cities.USMA_Boston,
            Cities.USMD_Annapolis,
            Cities.USME_Augusta,
            Cities.USMI_Lansing,
            Cities.USMN_StPaul,
            Cities.USMO_JeffersonCity,
            Cities.USMS_Jackson,
            Cities.USNC_Raleigh,
            Cities.USND_Bismarck,
            Cities.USNE_Lincoln,
            Cities.USNH_Concord,
            Cities.USNJ_Trenton,
            Cities.USNM_SantaFe,
            Cities.USNV_CarsonCity,
            Cities.USNY_Albany,
            Cities.USOH_Columbus,
            Cities.USOK_OklahomaCity,
            Cities.USOR_Salem,
            Cities.USPA_Harrisburg,
            Cities.USRI_Providence,
            Cities.USSC_Columbia,
            Cities.USSD_Pierre,
            Cities.USTN_Nashville,
            Cities.USTX_Austin,
            Cities.USUT_SaltLakeCity,
            Cities.USVA_Richmond,
            Cities.USVT_Montpelier,
            Cities.USWA_Olympia,
            Cities.USWI_Madison,
            Cities.USWV_Charleston,
            Cities.USWY_Cheyenne
        ]
    },
    "uscapitals": {
        FormatName: "US state, district and territory capitals",
        Cities: [
            Cities.USAL_Montgomery,
            Cities.USAK_Juneau,
            Cities.USAZ_Phoenix,
            Cities.USCA_Sacramento,
            Cities.USCO_Denver,
            Cities.USCT_Hartford,
            Cities.USDE_Dover,
            Cities.USFL_Tallahassee,
            Cities.USGA_Atlanta,
            Cities.USHI_Honolulu,
            Cities.USIA_Des_Moines,
            Cities.USID_Boise,
            Cities.USIL_Springfield,
            Cities.USIN_Indianapolis,
            Cities.USKS_Topeka,
            Cities.USKY_Frankfort,
            Cities.USLA_BatonRouge,
            Cities.USMA_Boston,
            Cities.USMD_Annapolis,
            Cities.USME_Augusta,
            Cities.USMI_Lansing,
            Cities.USMN_StPaul,
            Cities.USMO_JeffersonCity,
            Cities.USMS_Jackson,
            Cities.USNC_Raleigh,
            Cities.USND_Bismarck,
            Cities.USNE_Lincoln,
            Cities.USNH_Concord,
            Cities.USNJ_Trenton,
            Cities.USNM_SantaFe,
            Cities.USNV_CarsonCity,
            Cities.USNY_Albany,
            Cities.USOH_Columbus,
            Cities.USOK_OklahomaCity,
            Cities.USOR_Salem,
            Cities.USPA_Harrisburg,
            Cities.USRI_Providence,
            Cities.USSC_Columbia,
            Cities.USSD_Pierre,
            Cities.USTN_Nashville,
            Cities.USTX_Austin,
            Cities.USUT_SaltLakeCity,
            Cities.USVA_Richmond,
            Cities.USVT_Montpelier,
            Cities.USWA_Olympia,
            Cities.USWI_Madison,
            Cities.USWV_Charleston,
            Cities.USWY_Cheyenne,
            Cities.USDC_Washington,
            Cities.USAS_PagoPago,
            Cities.USGU_Hagatna,
            Cities.USMP_Saipain,
            Cities.USPR_SanJuan,
            Cities.USVI_CharlotteAmalie
        ]
    },
    "us": {
        FormatName: "30 largest cities in the US",
        Cities: [
            Cities.USNY_NewYorkCity,
            Cities.USCA_LosAngeles,
            Cities.USIL_Chicago,
            Cities.USTX_Houston,
            Cities.USAZ_Phoenix,
            Cities.USPA_Philadelphia,
            Cities.USTX_SanAntonio,
            Cities.USCA_SanDiego,
            Cities.USTX_Dallas,
            Cities.USCA_SanJose,
            Cities.USTX_Austin,
            Cities.USFL_Jacksonvile,
            Cities.USTX_ForthWorth,
            Cities.USOH_Columbus,
            Cities.USNC_Charlotte,
            Cities.USCA_SanFrancisco,
            Cities.USIN_Indianapolis,
            Cities.USWA_Seattle,
            Cities.USCO_Denver,
            Cities.USDC_Washington,
            Cities.USMA_Boston,
            Cities.USTX_ElPaso,
            Cities.USTN_Nashville,
            Cities.USMI_Detroit,
            Cities.USOK_OklahomaCity,
            Cities.USOR_Portland,
            Cities.USNV_LasVegas,
            Cities.USTN_Memphis,
            Cities.USKY_Louisville,
            Cities.USMD_Baltimore
        ]
    },
    "northamerica": {
        FormatName: "Capitals of North America",
        Cities: [
            Cities.USDC_Washington,
            Cities.CA_Ottawa,
            Cities.MX_MexicoCity,
            Cities.BZ_Belmopan,
            Cities.CR_SanJose,
            Cities.SV_SanSalvador,
            Cities.GT_GuatemalaCity,
            Cities.HN_Tegucigalpa,
            Cities.NI_Managua,
            Cities.PA_PanamaCity,
            Cities.AG_StJohns,
            Cities.BS_Nassau,
            Cities.BB_Bridgetown,
            Cities.CU_Havana,
            Cities.DO_SantoDomingo,
            Cities.DM_Roseau,
            Cities.GD_SaintGeorges,
            Cities.HT_PortAuPrince,
            Cities.JM_Kingston,
            Cities.KN_Basseterre,
            Cities.LC_Castries,
            Cities.VC_Kingstown,
            Cities.TT_PortOfSpain
        ]
    },
    "southamerica": {
        FormatName: "Capitals of South America",
        Cities: [
            Cities.AR_BuenosAires,
            Cities.BO_LaPaz,
            Cities.BR_Brasilia,
            Cities.CL_Santiago,
            Cities.CO_Bogota,
            Cities.EC_Quito,
            Cities.GY_Georgetown,
            Cities.PE_Lima,
            Cities.PY_Asuncion,
            Cities.SR_Paramaribo,
            Cities.UY_Montevideo,
            Cities.VE_Caracas
        ]
    },
    "latinamerica": {
        FormatName: "Capitals of Latin America",
        Cities: [
            Cities.AR_BuenosAires,
            Cities.BO_LaPaz,
            Cities.BR_Brasilia,
            Cities.CL_Santiago,
            Cities.CO_Bogota,
            Cities.EC_Quito,
            Cities.PE_Lima,
            Cities.PY_Asuncion,
            Cities.UY_Montevideo,
            Cities.VE_Caracas,
            Cities.CU_Havana,
            Cities.DO_SantoDomingo,
            Cities.HT_PortAuPrince,
            Cities.CR_SanJose,
            Cities.SV_SanSalvador,
            Cities.GT_GuatemalaCity,
            Cities.HN_Tegucigalpa,
            Cities.NI_Managua,
            Cities.PA_PanamaCity,
            Cities.MX_MexicoCity
        ]
    },
    "capitals": {
        FormatName: "Capitals of the World",
        Cities : [
            Cities.EE37_Tallinn,
            Cities.LTVL_Vilnius,
            Cities.LVRIX_Riga,
            Cities.PLMZ_Warsaw,
            Cities.CZ10_Prague,
            Cities.HUBU_Budapest,
            Cities.ROB_Bucharest,
            Cities.BG22_Sofia,
            Cities.SI061_Ljubljana,
            Cities.SKBl_Bratislava,
            Cities.HR21_Zagreb,
            Cities.AL11_Tirana,
            Cities.ME16_Podgorica,
            Cities.RS00_Belgrade,
            Cities.MK85_Skopje,
            Cities.BABIH_Sarajevo,
            Cities.BYHM_Minsk,
            Cities.MDCU_Chisinau,
            Cities.RUMOW_Moscow,
            Cities.UAKV_Kyiv,
            Cities.AD07_AndorraLaVella,
            Cities.AT9_Vienna,
            Cities.BEBRU_Brussels,
            Cities.DK84_Copenhagen,
            Cities.FI18_Helsinki,
            Cities.FRIDF_Paris,
            Cities.DEBE_Berlin,
            Cities.GRI_Athens,
            Cities.IS1_Reykjavik,
            Cities.IEL_Dublin,
            Cities.ITRM_Rome,
            Cities.LI11_Vaduz,
            Cities.LULU_Luxembourg,
            Cities.MT60_Valetta,
            Cities.MC_Monaco,
            Cities.NLNH_Amsterdam,
            Cities.NO03_Oslo,
            Cities.PT11_Lisbon,
            Cities.SM07SanMarino,
            Cities.ESMD_Madrid,
            Cities.SEAB_Stockholm,
            Cities.CHBE_Bern,
            Cities.GBENG_London,
            Cities.USDC_Washington,
            Cities.KZ_NurSultan,
            Cities.KG_Bishkek,
            Cities.TJ_Dushanbe,
            Cities.UZ_Tashkent,
            Cities.TM_Ashgabat,
            Cities.AM_Yerevan,
            Cities.AZ_Baku,
            Cities.BH_Manama,
            Cities.CY_Nicosia,
            Cities.GE_Tbilisi,
            Cities.IQ_Baghdad,
            Cities.IL_Jerusalem,
            Cities.JO_Amman,
            Cities.KW_KuwaitCity,
            Cities.LB_Beirut,
            Cities.OM_Muscat,
            Cities.QA_Doha,
            Cities.SA_Riyadh,
            Cities.SY_Damascus,
            Cities.TR_Ankara,
            Cities.AE_AbuDhabi,
            Cities.YE_Sanaa,
            Cities.CN_Beijing,
            Cities.JP_Tokyo,
            Cities.MN_Ulaanbaatar,
            Cities.KP_Peyongyang,
            Cities.KR_Seoul,
            Cities.BN_BandarSeriBegawan,
            Cities.KH_PhenomPenh,
            Cities.ID_Jakarta,
            Cities.LA_Vientiane,
            Cities.MY_KualaLumpur,
            Cities.MM_Naypyitaw,
            Cities.PH_Manila,
            Cities.SG_Singapore,
            Cities.TH_Bangkok,
            Cities.TL_Dili,
            Cities.VN_Hanoi,
            Cities.AF_Kabul,
            Cities.BD_Dhaka,
            Cities.IN_NewDelhi,
            Cities.IR_Tehran,
            Cities.MV_Male,
            Cities.PK_Islamabad,
            Cities.LK_SriJayawardenepuraKotte,
            Cities.CA_Ottawa,
            Cities.MX_MexicoCity,
            Cities.BZ_Belmopan,
            Cities.CR_SanJose,
            Cities.SV_SanSalvador,
            Cities.GT_GuatemalaCity,
            Cities.HN_Tegucigalpa,
            Cities.NI_Managua,
            Cities.PA_PanamaCity,
            Cities.AG_StJohns,
            Cities.BS_Nassau,
            Cities.BB_Bridgetown,
            Cities.CU_Havana,
            Cities.DO_SantoDomingo,
            Cities.DM_Roseau,
            Cities.GD_SaintGeorges,
            Cities.HT_PortAuPrince,
            Cities.JM_Kingston,
            Cities.KN_Basseterre,
            Cities.LC_Castries,
            Cities.VC_Kingstown,
            Cities.TT_PortOfSpain,
            Cities.AR_BuenosAires,
            Cities.BO_LaPaz,
            Cities.BR_Brasilia,
            Cities.CL_Santiago,
            Cities.CO_Bogota,
            Cities.EC_Quito,
            Cities.GY_Georgetown,
            Cities.PE_Lima,
            Cities.PY_Asuncion,
            Cities.SR_Paramaribo,
            Cities.UY_Montevideo,
            Cities.VE_Caracas,
            Cities.BI_Bujumbura,
            Cities.KM_Moroni,
            Cities.DJ_Djibouti,
            Cities.ER_Asmara,
            Cities.ET_AddisAbaba,
            Cities.KE_Nairobi,
            Cities.MG_Antananarivo,
            Cities.MW_Lilongwe,
            Cities.MU_PortLouis,
            Cities.MZ_Maputo,
            Cities.RW_Kigali,
            Cities.SC_Victoria,
            Cities.SO_Mogadishu,
            Cities.SS_Juba,
            Cities.UG_Kampala,
            Cities.TZ_Dodoma,
            Cities.ZM_Lusaka,
            Cities.ZW_Harare,
            Cities.AO_Luanda,
            Cities.CM_Yaounde,
            Cities.CF_Bangui,
            Cities.TD_NDjamena,
            Cities.CG_Brazzaville,
            Cities.CD_Kinshasa,
            Cities.GQ_Malabo,
            Cities.GA_Libreville,
            Cities.ST_SaoTome,
            Cities.BW_Gaborone,
            Cities.SZ_Mbabane,
            Cities.LS_Maseru,
            Cities.NA_Windhoek,
            Cities.ZA_Bloemfontein,
            Cities.ZA_CapeTown,
            Cities.ZA_Pretoria,
            Cities.DZ_Algiers,
            Cities.EG_Cairo,
            Cities.LY_Tripoli,
            Cities.MA_Rabat,
            Cities.SD_Khartoum,
            Cities.TN_Tunis,
            Cities.BJ_PortoNovo,
            Cities.BF_Ouagadougou,
            Cities.CV_Praia,
            Cities.CI_Yamoussoukro,
            Cities.GM_Banjul,
            Cities.GH_Accra,
            Cities.GN_Conakry,
            Cities.GW_Bissau,
            Cities.LR_Monrovia,
            Cities.ML_Bamako,
            Cities.MR_Nouakchott,
            Cities.NE_Niamey,
            Cities.NG_Abuja,
            Cities.SN_Dakar,
            Cities.SL_Freetown,
            Cities.TG_Lome,
            Cities.AU_Canberra,
            Cities.NZ_Wellington,
            Cities.FJ_Suva,
            Cities.PG_PortMoresby,
            Cities.SB_Honiara,
            Cities.VU_PortVila,
            Cities.KI_Tarawa,
            Cities.MH_Majuro,
            Cities.FM_Palikir,
            Cities.NR_Yaren,
            Cities.PW_Ngerulmud,
            Cities.NU_Alofi,
            Cities.WS_Apia,
            Cities.TK_Nukunonu,
            Cities.TO_Nukualofa,
            Cities.TK_Nukunonu,
            Cities.BT_Thimphu
        ]
    },
    "westcentralasia": {
        FormatName: "Capitals of Western and Central Asia",
        Cities: [
            Cities.KZ_NurSultan,
            Cities.KG_Bishkek,
            Cities.TJ_Dushanbe,
            Cities.UZ_Tashkent,
            Cities.TM_Ashgabat,
            Cities.AM_Yerevan,
            Cities.AZ_Baku,
            Cities.BH_Manama,
            Cities.CY_Nicosia,
            Cities.GE_Tbilisi,
            Cities.IQ_Baghdad,
            Cities.IL_Jerusalem,
            Cities.JO_Amman,
            Cities.KW_KuwaitCity,
            Cities.LB_Beirut,
            Cities.OM_Muscat,
            Cities.QA_Doha,
            Cities.SA_Riyadh,
            Cities.SY_Damascus,
            Cities.TR_Ankara,
            Cities.AE_AbuDhabi,
            Cities.YE_Sanaa
        ]
    },
    "eastsouthasia": {
        FormatName: "Eastern, Southern and Southeastern Asian capitals",
        Cities: [
            Cities.CN_Beijing,
            Cities.JP_Tokyo,
            Cities.MN_Ulaanbaatar,
            Cities.KP_Peyongyang,
            Cities.KR_Seoul,
            Cities.BN_BandarSeriBegawan,
            Cities.KH_PhenomPenh,
            Cities.ID_Jakarta,
            Cities.LA_Vientiane,
            Cities.MY_KualaLumpur,
            Cities.MM_Naypyitaw,
            Cities.PH_Manila,
            Cities.SG_Singapore,
            Cities.TH_Bangkok,
            Cities.TL_Dili,
            Cities.VN_Hanoi,
            Cities.AF_Kabul,
            Cities.BD_Dhaka,
            Cities.IN_NewDelhi,
            Cities.IR_Tehran,
            Cities.MV_Male,
            Cities.PK_Islamabad,
            Cities.LK_SriJayawardenepuraKotte,
            Cities.BT_Thimphu
        ]
    },
    "asia": {
        FormatName: "Capitals of Asia", 
        Cities: [
            Cities.KZ_NurSultan,
            Cities.KG_Bishkek,
            Cities.TJ_Dushanbe,
            Cities.UZ_Tashkent,
            Cities.TM_Ashgabat,
            Cities.AM_Yerevan,
            Cities.AZ_Baku,
            Cities.BH_Manama,
            Cities.CY_Nicosia,
            Cities.GE_Tbilisi,
            Cities.IQ_Baghdad,
            Cities.IL_Jerusalem,
            Cities.JO_Amman,
            Cities.KW_KuwaitCity,
            Cities.LB_Beirut,
            Cities.OM_Muscat,
            Cities.QA_Doha,
            Cities.SA_Riyadh,
            Cities.SY_Damascus,
            Cities.TR_Ankara,
            Cities.AE_AbuDhabi,
            Cities.YE_Sanaa,
            Cities.CN_Beijing,
            Cities.JP_Tokyo,
            Cities.MN_Ulaanbaatar,
            Cities.KP_Peyongyang,
            Cities.KR_Seoul,
            Cities.BN_BandarSeriBegawan,
            Cities.KH_PhenomPenh,
            Cities.ID_Jakarta,
            Cities.LA_Vientiane,
            Cities.MY_KualaLumpur,
            Cities.MM_Naypyitaw,
            Cities.PH_Manila,
            Cities.SG_Singapore,
            Cities.TH_Bangkok,
            Cities.TL_Dili,
            Cities.VN_Hanoi,
            Cities.AF_Kabul,
            Cities.BD_Dhaka,
            Cities.IN_NewDelhi,
            Cities.IR_Tehran,
            Cities.MV_Male,
            Cities.PK_Islamabad,
            Cities.LK_SriJayawardenepuraKotte,
            Cities.BT_Thimphu
        ]
    },
    "northwestafrica": {
        FormatName: "Capitals of Northern and Western Africa",
        Cities: [
            Cities.DZ_Algiers,
            Cities.EG_Cairo,
            Cities.LY_Tripoli,
            Cities.MA_Rabat,
            Cities.SD_Khartoum,
            Cities.TN_Tunis,
            Cities.BJ_PortoNovo,
            Cities.BF_Ouagadougou,
            Cities.CV_Praia,
            Cities.CI_Yamoussoukro,
            Cities.GM_Banjul,
            Cities.GH_Accra,
            Cities.GN_Conakry,
            Cities.GW_Bissau,
            Cities.LR_Monrovia,
            Cities.ML_Bamako,
            Cities.MR_Nouakchott,
            Cities.NE_Niamey,
            Cities.NG_Abuja,
            Cities.SN_Dakar,
            Cities.SL_Freetown,
            Cities.TG_Lome
        ]
    },
    "eastmiddlesouthafrica": {
        FormatName: "Capitals of Eastern, Middle and Southern Africa",
        Cities: [
            Cities.BI_Bujumbura,
            Cities.KM_Moroni,
            Cities.DJ_Djibouti,
            Cities.ER_Asmara,
            Cities.ET_AddisAbaba,
            Cities.KE_Nairobi,
            Cities.MG_Antananarivo,
            Cities.MW_Lilongwe,
            Cities.MU_PortLouis,
            Cities.MZ_Maputo,
            Cities.RW_Kigali,
            Cities.SC_Victoria,
            Cities.SO_Mogadishu,
            Cities.SS_Juba,
            Cities.UG_Kampala,
            Cities.TZ_Dodoma,
            Cities.ZM_Lusaka,
            Cities.ZW_Harare,
            Cities.AO_Luanda,
            Cities.CM_Yaounde,
            Cities.CF_Bangui,
            Cities.TD_NDjamena,
            Cities.CG_Brazzaville,
            Cities.CD_Kinshasa,
            Cities.GQ_Malabo,
            Cities.GA_Libreville,
            Cities.ST_SaoTome,
            Cities.BW_Gaborone,
            Cities.SZ_Mbabane,
            Cities.LS_Maseru,
            Cities.NA_Windhoek,
            Cities.ZA_Bloemfontein,
            Cities.ZA_CapeTown,
            Cities.ZA_Pretoria
        ]
    },
    "africa": {
        FormatName: "Capitals of Africa",
        Cities: [
            Cities.BI_Bujumbura,
            Cities.KM_Moroni,
            Cities.DJ_Djibouti,
            Cities.ER_Asmara,
            Cities.ET_AddisAbaba,
            Cities.KE_Nairobi,
            Cities.MG_Antananarivo,
            Cities.MW_Lilongwe,
            Cities.MU_PortLouis,
            Cities.MZ_Maputo,
            Cities.RW_Kigali,
            Cities.SC_Victoria,
            Cities.SO_Mogadishu,
            Cities.SS_Juba,
            Cities.UG_Kampala,
            Cities.TZ_Dodoma,
            Cities.ZM_Lusaka,
            Cities.ZW_Harare,
            Cities.AO_Luanda,
            Cities.CM_Yaounde,
            Cities.CF_Bangui,
            Cities.TD_NDjamena,
            Cities.CG_Brazzaville,
            Cities.CD_Kinshasa,
            Cities.GQ_Malabo,
            Cities.GA_Libreville,
            Cities.ST_SaoTome,
            Cities.BW_Gaborone,
            Cities.SZ_Mbabane,
            Cities.LS_Maseru,
            Cities.NA_Windhoek,
            Cities.ZA_Bloemfontein,
            Cities.ZA_CapeTown,
            Cities.ZA_Pretoria,
            Cities.DZ_Algiers,
            Cities.EG_Cairo,
            Cities.LY_Tripoli,
            Cities.MA_Rabat,
            Cities.SD_Khartoum,
            Cities.TN_Tunis,
            Cities.BJ_PortoNovo,
            Cities.BF_Ouagadougou,
            Cities.CV_Praia,
            Cities.CI_Yamoussoukro,
            Cities.GM_Banjul,
            Cities.GH_Accra,
            Cities.GN_Conakry,
            Cities.GW_Bissau,
            Cities.LR_Monrovia,
            Cities.ML_Bamako,
            Cities.MR_Nouakchott,
            Cities.NE_Niamey,
            Cities.NG_Abuja,
            Cities.SN_Dakar,
            Cities.SL_Freetown,
            Cities.TG_Lome
        ]
    },
    "oceania": {
        FormatName: "Oceanian capitals",
        Cities: [
            Cities.AU_Canberra,
            Cities.NZ_Wellington,
            Cities.FJ_Suva,
            Cities.PG_PortMoresby,
            Cities.SB_Honiara,
            Cities.VU_PortVila,
            Cities.KI_Tarawa,
            Cities.MH_Majuro,
            Cities.FM_Palikir,
            Cities.NR_Yaren,
            Cities.PW_Ngerulmud,
            Cities.NU_Alofi,
            Cities.WS_Apia,
            Cities.TK_Nukunonu,
            Cities.TO_Nukualofa,
            Cities.TK_Nukunonu
        ]
    },
    "cities": {
        FormatName: "World's 80 largest cities",
        Cities: [
            Cities.JP_Tokyo,
            Cities.IN_NewDelhi,
            Cities.CN_Shanghai,
            Cities.BR_SaoPaulo,
            Cities.MX_MexicoCity,
            Cities.EG_Cairo,
            Cities.IN_Mumbai,
            Cities.CN_Beijing,
            Cities.BD_Dhaka,
            Cities.JP_Osaka,
            Cities.USNY_NewYorkCity,
            Cities.PK_Karachi,
            Cities.AR_BuenosAires,
            Cities.CN_Chongqing,
            Cities.TR_Istanbul,
            Cities.IN_Kolkata,
            Cities.PH_Manila,
            Cities.NG_Lagos,
            Cities.BR_RioDeJainero,
            Cities.CN_Tianjin,
            Cities.CD_Kinshasa,
            Cities.CN_Guangzhou,
            Cities.USCA_LosAngeles,
            Cities.RUMOW_Moscow,
            Cities.CN_Shenzhen,
            Cities.PK_Lahore,
            Cities.IN_Bangalore,
            Cities.FRIDF_Paris,
            Cities.CO_Bogota,
            Cities.ID_Jakarta,
            Cities.IN_Chennai,
            Cities.PE_Lima,
            Cities.TH_Bangkok,
            Cities.KR_Seoul,
            Cities.JP_Nagoya,
            Cities.IN_Hyderabad,
            Cities.GBENG_London,
            Cities.IR_Tehran,
            Cities.USIL_Chicago,
            Cities.CN_Chengdu,
            Cities.CN_Nanjing,
            Cities.CN_Wuhan,
            Cities.VM_HoChiMinhCity,
            Cities.AO_Luanda,
            Cities.IN_Ahmedabad,
            Cities.MY_KualaLumpur,
            Cities.CN_Xian,
            Cities.CN_HongKong,
            Cities.CN_Dongguan,
            Cities.CN_Hangzhou,
            Cities.CN_Foshan,
            Cities.CN_Shenyang,
            Cities.SA_Riyadh,
            Cities.IQ_Baghdad,
            Cities.CL_Santiago,
            Cities.IN_Surat,
            Cities.ESMD_Madrid,
            Cities.CN_Suzhou,
            Cities.IN_Pune,
            Cities.CN_Harbin,
            Cities.USTX_Houston,
            Cities.USTX_Dallas,
            Cities.CA_Toronto,
            Cities.TZ_DarEsSalaam,
            Cities.USFL_Miami,
            Cities.BR_BeloHorizonte,
            Cities.SG_Singapore,
            Cities.USPA_Philadelphia,
            Cities.USGA_Atlanta,
            Cities.JP_Fukuoka,
            Cities.SD_Khartoum,
            Cities.ES_Barcelona,
            Cities.ZA_Johannesburg,
            Cities.RU_SaintPetersburg,
            Cities.CN_Qingdao,
            Cities.CN_Dalian,
            Cities.USDC_Washington,
            Cities.MM_Yangon,
            Cities.EG_Alexandria,
            Cities.CN_Jinan
        ]
    }
};

// Quiz class
class Quiz {
    // Constructor
    constructor (questions, attempts, isMultipleChoice, questionCount) {
        // Set parent variables
        this.Questions = questions;
        this.IsMultipleChoice = isMultipleChoice;
        questionCount = questionCount || questions.length;

        // Check that attempts is in range
        if (attempts > 0) {
            this.Attempts = attempts;
        }
        else {
            throw new Error(`Attempts is out of range (${attempts}), must be greater than 0.`)
        }

        // Check that questioncount is in range
        if (questionCount <= 0) {
            throw new Error(`QuestionCount is out of range (${questionCount}), must be greater than 0.`)
        }
        else if (questionCount > questions.length) {
            throw new Error(`QuestionCount is out of range (${questionCount}), must be less than or equal to the amount of questions.`)
        }
        else {
            this.QuestionCount = questionCount
        }

        // Decide which questions are to be asked
        // Shuffle array and slice
        this.QuestionsToAsk = shuffle(questions).slice(0, questionCount);

        // Start the quiz
        this.StartQuiz();
    }
    
    // Start quiz
    StartQuiz() {
        // Show the correct inputs for the selected input type
        if (this.IsMultipleChoice) {
            document.getElementById("mcinput").style.display = "block";
            document.getElementById("textinput").style.display = "none";
        }
        else {
            document.getElementById("mcinput").style.display = "none";
            document.getElementById("textinput").style.display = "block";
            document.getElementById("attempt").textContent = 1;
            document.getElementById("attempts").textContent = this.Attempts;
        }

        // Toggle attempt counter based on attempt allowance
        if (this.Attempts == 1 || this.IsMultipleChoice) {
            document.getElementById("attemptcounter").style.display = "none";
        }
        else {
            document.getElementById("attemptcounter").style.display = "initial";
        }

        // Save the current time
        this.StartTime = new Date();

        // Initialize variables
        this.Points = 0;
        this.Round = 0;
        this.Attempt = 0;
        this.Log = [];

        // Print counters
        document.getElementById("currentround").textContent = 1;
        document.getElementById("roundcount").textContent = this.QuestionCount;
        document.getElementById("points").textContent = 0;

        // Clean validation
        document.getElementById("cityinput").className = "form-control";
        document.getElementById("noneselectederror").style.display = "none";

        // Deselect all radios
        document.getElementById("radio0").checked = false;
        document.getElementById("radio1").checked = false;
        document.getElementById("radio2").checked = false;
        document.getElementById("radio3").checked = false;

        // Cycle pages
        document.getElementById("options-page").style.display = "none";
        document.getElementById("game-page").style.display = "block";

        // Ask first question
        this.AskQuestion(0);
    }

    // Ask question
    AskQuestion(Index) {
        // Check that index is within bounds
        if (Index < 0) {
            throw new Error(`Index is out of bounds (${Index}), must be greater than or equal to 0.`);
        }
        else if (Index >= this.QuestionCount || Index >= this.QuestionsToAsk.length) {
            throw new Error(`Index is out of bounds (${Index}), must be less than questions to ask.`);
        }

        // Print applicable image
        document.getElementById("questionimage").src = `https://maps.googleapis.com/maps/api/staticmap?center=${this.QuestionsToAsk[Index].Query}&zoom=${this.QuestionsToAsk[Index].Zoom}&size=640x400&scale=2&maptype=satellite&key=AIzaSyCuRDcyNsXWxQuXc6Z5sMyVJohxDC3BXtA`;

        // Check what input method is beeing used
        if (!this.IsMultipleChoice) {
            // Clear input field
            document.getElementById("cityinput").value = "";

            // Focus on input field
            document.getElementById("cityinput").focus();
        }
        else {
            // Create alternatives
            let Alternatives = [this.QuestionsToAsk[Index].FormatName];

            // Randomize array of all questions
            let Randomized = shuffle([...this.Questions]);
            Randomized.splice(Randomized.indexOf(this.QuestionsToAsk[Index]), 1);

            // Apend 3 first elements
            Alternatives.push(Randomized[0].FormatName);
            Alternatives.push(Randomized[1].FormatName);
            Alternatives.push(Randomized[2].FormatName);

            // Randomize order of alternatives
            Alternatives = shuffle(Alternatives);

            // Print alternatives
            document.getElementById("radio0-label").textContent = Alternatives[0];
            document.getElementById("radio1-label").textContent = Alternatives[1];
            document.getElementById("radio2-label").textContent = Alternatives[2];
            document.getElementById("radio3-label").textContent = Alternatives[3];

            // Set values
            document.getElementById("radio0").value = Alternatives[0];
            document.getElementById("radio1").value = Alternatives[1];
            document.getElementById("radio2").value = Alternatives[2];
            document.getElementById("radio3").value = Alternatives[3];

            // Register a keydown event
            document.addEventListener("keydown", EnterEventSubmit);
        }

        // Logging for summary
        this.Log.push({
            StartTime: new Date(),
            Answers: []
        });
    }

    // Submit answer
    SubmitAnswer(Answer) {
        // Check if the answer is blank for multiplechoice
        if (!Answer && this.IsMultipleChoice) {
            // Set the notselectederror to be visible
            document.getElementById("noneselectederror").style.display = "block";

            // Logging for summary
            this.Log[this.Round].Answers.push(Answer);

            // Exit method
            return;
        }

        // Destroy the keydown event
        document.removeEventListener("keydown", EnterEventSubmit);

        // Logging for summary
        this.Log[this.Round].Answers.push(Answer);
        this.Log[this.Round].EndTime = new Date();
        this.Log[this.Round].AttemptsUsed = this.Attempt + 1;

        // Check if answer is right
        if (this.QuestionsToAsk[this.Round].AcceptedAnswers.indexOf(Answer.toLowerCase()) > -1) {
            this.RunCorrectAnswerScenario();
        }
        else {
            this.RunWrongAnswerScenario(Answer);
        }
    }
    
    // Right answer handler
    RunCorrectAnswerScenario() {
        // Update other variables
        document.getElementById("points").textContent = ++this.Points;

        // Update modal data
        document.getElementById("CorrectModalPoints").textContent = this.Points;
        document.getElementById("CorrectModalCorrectAnswer").textContent = this.QuestionsToAsk[this.Round].FormatName;

        // Display attempt info if allowed attempts is greater than 1
        if (this.Attempts == 1 || this.IsMultipleChoice) {
            document.getElementById("CorrectModalAttemptCountInfo").style.display = "none";
        }
        else {
            document.getElementById("CorrectModalAttemptCountInfo").style.display = "initial";
            document.getElementById("CorrectModalAttempt").textContent = this.Attempt + 1;
            document.getElementById("CorrectModalAttempts").textContent = this.Attempts;
        }

        // Rename button if this is last round
        if (this.Round + 1 == this.QuestionCount) {
            document.getElementById("CorrectModalNextQuestionButton").textContent = "View summary";
        }
        else {
            document.getElementById("CorrectModalNextQuestionButton").textContent = "Next round";
        }

        // Display modal
        CorrectModal.show();
    }

    // Wrong answer handler
    RunWrongAnswerScenario(UserAnswer) {
        // Handle with form error message if attempt is less than allowed attempts
        if (this.Attempt + 1 < this.Attempts) {
            // Make text field invalid
            document.getElementById("cityinput").className = "form-control is-invalid";

            // Increment attempt count and print
            document.getElementById("attempt").textContent = ++this.Attempt + 1;
        }
        // Handle with modal in all other cases
        else {
            // Update modal data
            document.getElementById("IncorrectModalPoints").textContent = this.Points;
            document.getElementById("IncorrectModalCorrectAnswer").textContent = this.QuestionsToAsk[this.Round].FormatName;
            document.getElementById("IncorrectModalUserAnswer").textContent = UserAnswer;

            // Rename button if this is last round
            if (this.Round + 1 == this.QuestionCount) {
                document.getElementById("IncorrectModalNextQuestionButton").textContent = "View summary";
            }
            else {
                document.getElementById("IncorrectModalNextQuestionButton").textContent = "Next round";
            }

            // Display modal
            IncorrectModal.show();
        }
    }

    // Progress to next question or summary screen
    NextQuestion() {
        // Destroy keydown event
        document.removeEventListener('keydown', EnterEventNext);

        // Check if this round is the last
        if (this.Round + 1 == this.QuestionCount) {
            this.GoToSummary();
        }
        // Else progress to next question
        else {
            // Cleanup
            // Reset attempts
            this.Attempt = 0;
            document.getElementById("attempt").textContent = 1;

            // Clean validation
            document.getElementById("cityinput").className = "form-control";
            document.getElementById("noneselectederror").style.display = "none";

            // Increment round counter
            document.getElementById("currentround").textContent = ++this.Round + 1;

            // Deselect all radios
            document.getElementById("radio0").checked = false;
            document.getElementById("radio1").checked = false;
            document.getElementById("radio2").checked = false;
            document.getElementById("radio3").checked = false;

            // Ask next question
            this.AskQuestion(this.Round);
        }
    }

    // Go to summary
    GoToSummary() {
        // Print info
        document.getElementById("SummaryTime").textContent = FormatDateDifference(new Date(), this.StartTime);
        document.getElementById("SummaryPoints").textContent = this.Points;
        document.getElementById("SummaryPointsPossible").textContent = this.QuestionCount;
        document.getElementById("SummaryDifficulty").textContent = ["Easy", "Medium", "Hard"][Difficulty];
        document.getElementById("SummaryPerRound").innerHTML = "";

        // Print round info
        for (let i = 0; i < this.Log.length; i++) {
            // Attempt count if applicable
            let AttemptCounter = "";
            if (!this.IsMultipleChoice && this.Attempts > 1) {
                AttemptCounter = `<br>Attempts: ${this.Log[i].AttemptsUsed} out of ${this.Attempts}`;
            }
            document.getElementById("SummaryPerRound").innerHTML += `<div class="col-12 col-md-6 col-xxl-4"><h5>Round ${i + 1}</h5><div class="d-flex justify-content-between flex-column flex-md-row"><p>Time spent: ${FormatDateDifference(this.Log[i].EndTime, this.Log[i].StartTime)}<br>Your answer: ${FormatArray(this.Log[i].Answers)}<br>Correct answer: ${this.QuestionsToAsk[i].FormatName}${AttemptCounter}</p><img class="img-fluid" src="https://maps.googleapis.com/maps/api/staticmap?center=${this.QuestionsToAsk[i].Query}&zoom=${this.QuestionsToAsk[i].Zoom}&size=150x150&scale=1&maptype=satellite&key=AIzaSyCuRDcyNsXWxQuXc6Z5sMyVJohxDC3BXtA"></div></div>`;
        }

        // Set href of sharer buttons
        let ShareText = `I just played ${SetName} on UrbQuiz and got ${this.Points} out of ${this.QuestionCount} points in ${FormatDateDifference(new Date(), this.StartTime)}.`;
        document.getElementById("facebook-sharer").href = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${ShareText}`;
        document.getElementById("twitter-sharer").href = `https://twitter.com/compose/tweet?url=${window.location.href}&text=${ShareText}`;

        // Cycle pages
        document.getElementById("game-page").style.display = "none";
        document.getElementById("summary-page").style.display = "block";
    }
}

// NextQuestion on enter
function EnterEventNext(Event) {
    if (Event.code == "Enter") {
        // Hide modals
        CorrectModal.hide();
        IncorrectModal.hide();

        // Progress to next question
        ActiveQuiz.NextQuestion();
    }
}

// Submit multiple choice on enter
function EnterEventSubmit(Event) {
    if (Event.code == "Enter") {
        // Submit answer
        ActiveQuiz.SubmitAnswer(document.getElementById('mcform').elements['mc'].value)
    }
}

// Array shufler
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Calculate difference between 2 date objects and return formatted text
function FormatDateDifference(date0, date1) {
    let TotalSeconds = Math.floor(date0.getTime() / 1000 - date1.getTime() / 1000);
    let Minutes = Math.floor(TotalSeconds / 60);
    let Seconds = TotalSeconds % 60;
    let FormatTime = "";

    // Append minutes if greater than 0
    // Singular form
    if (Minutes == 1) {
        FormatTime += "1 minute"
    }
    // Plural
    else if (Minutes > 1) {
        FormatTime += `${Minutes} minutes`
    }

    // Append seconds if greater than 0
    // Singular
    if (Seconds == 1) {
        // Check if minutes are present in formattime
        if (Minutes > 0) {
            FormatTime += " and ";
        }
        FormatTime += `${Seconds} second`;
    } 
    // Plural
    else if (Seconds > 1) {
        // Check if minutes are present in formattime
        if (Minutes > 0) {
            FormatTime += " and ";
        }
        FormatTime += `${Seconds} seconds`;
    } 

    // Return
    return FormatTime;
}

// Format string array
function FormatArray(Array) {
    let FormatText = "";

    // 1 element
    if(Array.length == 1) {
        FormatText = Array[0];
    }
    // 2 elements
    else if(Array.length == 2) {
        FormatText = `${Array[0]} and ${Array[1]}`;
    }
    // More than 2 elements
    else {
        for (let i = 0; i < Array.length; i++) {
            FormatText += Array[i];

            // Add correct separator
            // If second last element
            if (i == Array.length - 2) {
                FormatText += " and ";
            }
            // If not second last or last
            else if (i < Array.length - 1) {
                FormatText += ", ";
            }
        }
    }

    return FormatText;
}

// Start a quiz
function StartQuiz() {
    // Check that SetToPlay is not null
    if (!SetToPlay) {
        throw new Error("SetToPlay cannot be null");
    }

    // Calculate question count
    let QuestionCount = 10;

    if (PlayEntireSet) {
        QuestionCount = SetToPlay.length;
    }

    // Calculate difficulty settings
    let UseMultipleChoice = !Difficulty;
    let Attempts = 1;
    
    if (Difficulty == 1) {
        Attempts = 3;
    }

    // Create a quiz object
    ActiveQuiz = new Quiz(SetToPlay, Attempts, UseMultipleChoice, QuestionCount);
}

window.onload = function() {
    // Initialize modals
    IncorrectModal = new bootstrap.Modal(document.getElementById("IncorrectModal"), {
        keyboard: false,
        backdrop: "static"
    });
    CorrectModal = new bootstrap.Modal(document.getElementById("CorrectModal"), {
        keyboard: false,
        backdrop: "static"
    });

    // Add events to modals
    document.getElementById("CorrectModal").addEventListener("shown.bs.modal", function(event) {
        // Add key event listener for enter
        document.addEventListener('keydown', EnterEventNext);
    });
    document.getElementById("IncorrectModal").addEventListener("shown.bs.modal", function(event) {
        // Add key event listener for enter
        document.addEventListener('keydown', EnterEventNext);
    });

    // Check if a game ID is provided in query string
    const URLParams = new URLSearchParams(window.location.search);
    const GameID = URLParams.get("game");

    if (GameID && CityGroups[GameID]) {
        // Assign to global variables
        SetToPlay = CityGroups[GameID].Cities;
        SetName = CityGroups[GameID].FormatName;

        // Assign to game description headers
        const Headings = document.querySelectorAll(".header-game-description");
        for (let i = 0; i < Headings.length; i++) {
            Headings[i].textContent = SetName;
        }

        // Update SEO
        document.getElementById("OGURLMeta").content += "?game=" + GameID;
        document.getElementsByTagName("title")[0].innerHTML = CityGroups[GameID].FormatName + " - UrbQuiz";
        document.getElementById("TitleMeta").content = CityGroups[GameID].FormatName + " - UrbQuiz";
        document.getElementById("MetaDescription").content = CityGroups[GameID].FormatName + " - UrbQuiz. " + document.getElementById("MetaDescription").content;
        document.getElementById("OGDescription").content = CityGroups[GameID].FormatName + " - UrbQuiz. " + document.getElementById("OGDescription").content;

        document.getElementById("info-page").style.display = "none";
        document.getElementById("options-page").style.display = "block";
    }

};
