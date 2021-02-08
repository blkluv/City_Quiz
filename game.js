// Global variables
let CorrectModal;
let IncorrectModal;
let ActiveQuiz;
let APIkey = "AIzaSyCuRDcyNsXWxQuXc6Z5sMyVJohxDC3BXtA";
let Difficulty = 1;
let SetToPlay;
let SetName;
let LastAnswer;
let PlayEntireSet = false; 

// Google maps image class
class GoogleMapsImage {
    // Constructor
    constructor(query, zoom, signatures) {
        this.Query = query;
        this.Zoom = zoom;
        if (signatures.length != 2) {
            throw new Error("signatures must be lenght 2.")
        }
        else {
            this.Signatues = signatures;
        }
    }

    // Get big image
    getImageURL() {
        return `https://maps.googleapis.com/maps/api/staticmap?center=${this.Query}&zoom=${this.Zoom}&size=640x400&scale=2&maptype=satellite&key=${APIkey}&signature=${this.Signatues[0]}`;
    }

    // Get small image
    getThumbnailURL() {
        return `https://maps.googleapis.com/maps/api/staticmap?center=${this.Query}&zoom=${this.Zoom}&size=150x150&scale=1&maptype=satellite&key=${APIkey}&signature=${this.Signatues[1]}`;
    }
}

// Question class
class Question {
    // Constructor
    constructor (image, formatName, acceptedAnswers) {
        // Set parent variables
        this.Image = image;
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
    // https://worldpopulationreview.com/continents/cities/europe

    // Europe
    // Norway: NO. Oslo: 03, Rogaland: 11, Møre og Romsdal: 15, Nordland: 18, Viken: 30, Innlandet: 34, Vestfold og Telemark: 38, Agder: 42, Vestland: 46, Trøndelag: 50, Troms og Finnmark: 54
    NO11_Sandnes: new Question(new GoogleMapsImage("Sandnes,Rogaland,Norway", 14, ["FS7uNj4L2XmBGTQguRKlLm_bdZ4=","QvevjnZU2ewwwib9SkEcF1wziWo="]), "Sandnes"),
    NO11_Stavanger: new Question(new GoogleMapsImage("Stavanger,Rogaland,Norway", 14, ["4gH7Cn3vr8mNrCF7UwjesTLW7Z8=","prTE-7Jjgnxl2kQJkl3uFuuIJ_g="]), "Stavanger"),
    NO11_Haugesund: new Question(new GoogleMapsImage("Haugesund,Rogaland,Norway", 14, ["hm3LaGjlRlv7Qpa4uVjh9zTSMFg=","jcwfuOWBBKYX1zwAB4zczYm_DCo="]), "Haugesund"),
    NO46_Bergen: new Question(new GoogleMapsImage("Torgalmenningen,Bergen,Norway", 12, ["YvGaRTLGtV1mEYEQAymb7fy_U1k=","_9Y2lAnxSMsesjJCoAvdfZVZiN8="]), "Bergen"),
    NO03_Oslo: new Question(new GoogleMapsImage("Barcode%20Project,Norway", 13, ["_KM5dTRIgAmf-_TA-GvFdNaK5HA=","Lc1eZ-KRGWqxeE1FYQvA_lF7CdU="]), "Oslo"),
    NO50_Trondheim: new Question(new GoogleMapsImage("Trondheim,Norway", 13, ["pH7UZAkyfrWNWcL9dcAEZ49cKiI=","LEOrJqQBUErF59KZ_hxEb5dXMnw="]), "Trondheim", ["trondheim","trondhjem"]),
    NO30_Drammen: new Question(new GoogleMapsImage("Drammen,Norway", 13, ["m7sVEbccPTQPP-b4vFNt5ncZ6gk=","zweWREjoQaTsvPFBpB4WN4npg7Q="]), "Drammen"),
    NO30_Fredrikstad: new Question(new GoogleMapsImage("Fredrikstad%20Stasjon,Norway", 14, ["l1RCMHxJ8VwyfvRRWol3YF5SjYk=","d5N557kmzle939MD-fdte5ETrYw="]), "Fredrikstad"),
    NO30_Sarpsborg: new Question(new GoogleMapsImage("Sarpsborg,Norway", 13, ["QSD4jtKApSqYdy2NnYDSIHEIrhc=","CdFtbZtw1lB-Qm6GRXHxHZv2mOY="]), "Sarpsborg"),
    NO38_Skien: new Question(new GoogleMapsImage("Klosterøya,Skien,Norway", 13, ["115m21IcOmrgt3fPBkngBtQv6lA=","vE_n1QeM63aacTl-lF_raOspjEM="]), "Skien"),
    NO38_Porsgrunn: new Question(new GoogleMapsImage("Sykehuset%20Telemark,Porsgrunn,Norway", 13, ["60Vv9SNxZkWg8k_3q_0PPNoaiC4=","hBHi8I1BMydWR6b28XIfuxVpq3M="]), "Porsgrunn"),
    NO42_Kristiansand: new Question(new GoogleMapsImage("Kvadraturen,Kristiansand,Norway", 13, ["cRd79kKnSpi98GZkm_3jza-gBks=","lrpYZZ6cFrkdXZXhRzYD4mlkfjY="]), "Kristiansand"),
    NO15_Alesund: new Question(new GoogleMapsImage("Sparebanken%20Møre%20Arena,Ålesund,Norway", 12, ["n0hJ37lOCYLyZQi5Rg-LJ0RtJvE=","O7IFYLdun1Jk8ZkzPcukdto0Nps="]), "Ålesund", ["ålesund","alesund","aalesund"]),
    NO38_Tonsberg: new Question(new GoogleMapsImage("Træleborg,Tønsberg,Norway", 13, ["RbChx-3bwcB_k6Je0-NKov3fj00=","rsZRh6XTgsFVhpyBpwJvcPjTVZc="]), "Tønsberg", ["tønsberg","tonsberg","toensberg"]),
    NO30_Moss: new Question(new GoogleMapsImage("Thorneløkka,Moss,Norway", 13, ["yIoeLwy82YCqmpH5_11-9kO8Wgs=","dnmmG4pLnECykt80R64f_4uIDMY="]), "Moss"),
    NO38_Sandefjord: new Question(new GoogleMapsImage("Hvalfangstmonumentet,Sandefjord,Norway", 13, ["ux0MYeqlJg5CAt_dUDTuojyPeYA=","qpzGHumfDaTJMJDcm0mVglY6NDo="]), "Sandefjord"),
    NO42_Arendal: new Question(new GoogleMapsImage("Arendal,Norway", 13, ["E2xjzX9Xqmw0ixhIRLuVByHkErA=","G4OK3G7Gy4USuhERJ2gez5C44Xg="]), "Arendal"),
    NO18_Bodo: new Question(new GoogleMapsImage("Bodø,Norway", 12, ["4ceYlWCRufobq3SqZ3s15DcpipI=","Qi1cciJ-sNh5qrAPh4beQP8LRlE="]), "Bodø", ["bodø","bodo","bodoe"]),
    NO54_Tromso: new Question(new GoogleMapsImage("Tromsø,Norway", 12, ["AXu4W4cIQlt8ZFEpuvEojlH-kBI=","Z_LCLOWAcruqJIBI5XxkrttU3J0="]), "Tromsø", ["tromsø","tromso","tromsoe"]),
    NO34_Hamar: new Question(new GoogleMapsImage("Hamar,Norway", 13, ["GrX5jrQzL6vTG0BiQOK6cGbWlP0=","TGRMJ2PZT3kqTt5JGnImzFks1MA="]), "Hamar"),
    NO30_Halden: new Question(new GoogleMapsImage("Halden%20Stasjon,Norway", 13, ["xhvr1REW_N-h3PLyhvZH4tLqoTg=","WQKaQvtCzglq4DA0QbHzQ64VX3Y="]), "Halden"),
    NO38_Larvik: new Question(new GoogleMapsImage("Larvik,Norway", 13, ["9RiJJV-34TRp1dqs193CmXwv19Y=","KV1MJ4nf1E5B1Nwp154EXNxpTqI="]), "Larvik"),
    NO46_Askoy: new Question(new GoogleMapsImage("Kleppestø,Norway", 15, ["tlKLHE4achguY0wUxJWw6mOuOaw=","tN-1S3NCvjrT3XzW3gbvNn3EvXg="]), "Askøy", ["kleppestø","kleppesto","kleppestoe","askøy","askoy","askoey","kleppestø, askøy","kleppesto, askoy","kleppestoe, askoey"]),
    NO30_Kongsberg: new Question(new GoogleMapsImage("Kongsberg,Norway", 14, ["5k7r8gAFk1eLTAkYaO_AKdFzBhI=","rYEaNlsOjDkDgwpE-8olA8RMUjs="]), "Kongsberg"),
    NO54_Harstad: new Question(new GoogleMapsImage("Generalhagen,Harstad,Norway", 13, ["g8YpMWoI_w1IW_pGsE6LjJ-JoY8=","p6-SWuwBNFNOPegoLiU56FIza0s="]), "Harstad"),
    NO15_Molde: new Question(new GoogleMapsImage("Molde,Norway", 13, ["KNGCZGSskunuWF1NDOHayCPHpzs=","qfp8QOEAwZ6Y3YV4SMw6eu68ACo="]), "Molde"),
    NO34_Gjovik: new Question(new GoogleMapsImage("Gjøvik,Norway", 14, ["8EAMLjH7TUS5rVhWB8wcvYpo1J0=","j5wpFImkSfgRwZpf8RGqFrd2p70="]), "Gjøvik", ["gjøvik","gjovik","gjoevik"]),
    NO34_Lillehammer: new Question(new GoogleMapsImage("Lillehammer,Norway", 13, ["YZ6jOILKV8b9l9dPs47Plh2Zrww=","tdnre83YPxpRWlkUUbkNH5jTNMQ="]), "Lillehammer"),
    NO38_Horten: new Question(new GoogleMapsImage("Horten,Norway", 13, ["zd77AzGoFP0qLLPiMY-8ns5yigY=","BEMKEr_VSn4XEfXoGHXlJZxN9YI="]), "Horten"),
    NO30_Ski: new Question(new GoogleMapsImage("Ski Stasjon,Norway", 14, ["AHp9RbSl4TmWKGVZu6_SJaWOIpw=","S5ocvuPU-_bxszgkyoZ0WZbcEAg="]), "Ski", ["ski","nordre follo"]),
    NO18_MoIRana: new Question(new GoogleMapsImage("Mo i Rana,NO", 13, ["W-VWzxp6PXQv0TSMVpvA_SCMtAM=","Gbu_EYtRMvKao04UDPKEVg0E0Pg="]), "Mo i Rana"),

    // Russia: RU. 
    RUMOW_Moscow: new Question(new GoogleMapsImage("Moscow,RU", 13, ["DavYo_UJoD9nCP-MAzUXak4wBTI=","jbHVivMidmubo0XHkTCqjGd4JLU="]), "Moscow", ["moscow","москва"]),
    RU_SaintPetersburg: new Question(new GoogleMapsImage("Saint Petersburg,RU", 12, ["g9Mzpv9KCx7_VrBmd6WXbFWvCQA=","Lcc9yC6wIPUhleKKbG8cdLPh2Ls="]), "Saint Petersburg", ["saint petersburg","st. petersburg","st petersburg","санкт-петербург","санкт петербург"]),
    RU_Novosibirsk: new Question(new GoogleMapsImage("54.99502590654898,82.91607062283774", 12, ["SxRyFVKttVUmLZkikAiX2HHU1cg=","4NoJKqBhVcZnfHAN6c4Z1g_v4rU="]), "Novosibirsk", ["novosibirsk","новосибирск"]),
    RU_Yekaterinburg: new Question(new GoogleMapsImage("Yekaterinburg,RU", 12, ["yp-yt_cTB0b3xQB5oEhNWBr_98M=","w5gqOeQaANnVJetRgFmXA78MKVg="]), "Yekaterinburg", ["yekaterinburg","екатеринбург"]),
    RU_NizhnyNovgorod: new Question(new GoogleMapsImage("Nizhny Novgorod,RU", 13, ["6shhwwe-0YJK4oERX_KRoYvAuLg=","8iyCysCseCrX6qO_1MtP-0P7c_c="]), "Nizhny Novgorod", ["nizhny Novgorod","нижний новгород"]),
    RU_Samara: new Question(new GoogleMapsImage("Samara,RU", 12, ["c6oAyPP16Oh49ysB0taEyUIbJa0=","KvP0LkcJeTm5M3Y9FnsAY4FU5FI="]), "Samara", ["samara","самара"]),
    RU_Omsk: new Question(new GoogleMapsImage("Omsk,RU", 13, ["TQ_siF7_utmVxwGkldW858jHowM=","0M9CxyY0kybI5-i-OJB79o4gZjA="]), "Omsk", ["omsk","омск"]),
    RU_Kazan: new Question(new GoogleMapsImage("Kazan,RU", 12, ["sA2Nxrz1EXr8KntDFIu-kNHepmo=","PllwQUPaFZj57c6wHTkHktJktuA="]), "Kazan", ["kazan","казань"]),
    RU_RostovnaDonu: new Question(new GoogleMapsImage("Rostov-na-Donu,RU", 12, ["8AYbW9NQNbEmbfZDYONWO_WQihA=","K3mREdtt9EdxgD1OBJSJPpmXMjU="]), "Rostov-na-Donu", ["rostov-na-donu","rostov na donu","rostov","rostov on don","rostov-on-don","ростов-на-дону","ростов на дону"]),
    RU_Chelyabinsk: new Question(new GoogleMapsImage("Chelyabinsk,RU", 12, ["vsKiONZO2eUGN6Dw8-2KM15e15E=","yVmHgiVpUl7IypuohmdTlkvXVOY="]), "Chelyabinsk", ["chelyabinsk","челябинск"]),
    RU_Ufa: new Question(new GoogleMapsImage("Ufa,RU", 12, ["x4VHiCrJ8yKOPiqhMsqNLPqf49M=","-oV_sXaOaMCS5o4W10Bo_-SBVR0="]), "Ufa", ["ufa","уфа"]),
    RU_Volgograd: new Question(new GoogleMapsImage("Volgograd,RU", 13, ["eZSXSE6S9Y-oLUo_X1wd6mXE0_8=","Uk43bsO5QY7CdWXgDbk6uJ8Fk-A="]), "Volgograd", ["volgograd","волгоград"]),
    RU_Perm: new Question(new GoogleMapsImage("Perm,RU", 13, ["SDQzPnSFgM692s2wMKjMUnz-o_w=","OC0bhRDpFWqBYykzhMh_mnuU_yQ="]), "Perm", ["perm","пермь"]),
    RU_Krasnoyarsk: new Question(new GoogleMapsImage("Krasnoyarsk,RU", 12, ["OH2ymc8lfEqR-pVUuqgI3ldqOZ4=","sjnEBCACBOgtQTMA4wB0idJImeg="]), "Krasnoyarsk", ["krasnoyarsk","красноярск"]),
    RU_Saratov: new Question(new GoogleMapsImage("Saratov,RU", 12, ["_4xykyLHAa04LuvOR8JjHFn-3Z8=","5kK6fZse8Wdq_6pRMUwabs8yRi4="]), "Saratov", ["saratov","саратов"]),
    RU_Voronezh: new Question(new GoogleMapsImage("Voronezh,RU", 12, ["NC0ahGWTWQkM1hwrNtYiXhZhP2I=","4BXrwRrAPgo9AkSVZtbY5y3iLVg="]), "Voronezh", ["voronezh","воронеж"]),

    // Ukraine: UA
    UAKV_Kyiv: new Question(new GoogleMapsImage("Kyiv,UA", 13, ["VEQLS1uxbdjbHk2KTb-6YME3hbw=","bF9ocJwd0QOAgmkLBllcw7N8JtY="]), "Kyiv", ["kyiv","kiev","київ"]),
    UA_Kharkiv: new Question(new GoogleMapsImage("Kharkiv,UA", 13, ["OX4AZNTGYVMTD0y2gakiZQq3P9s=","f4tWP7tpUzJhneruECNOCNRO1H4="]), "Kharkiv", ["kharkiv","харків"]),
    UA_Dnipro: new Question(new GoogleMapsImage("Dnipro,UA", 12, ["ZXSlskyAd0DdR25rY3uVRy7nml0=","tnNj8qKvvMX9kvcaWZZbx61UzcM="]), "Dnipro", ["dnipro","дніпро"]),
    UA_Donetsk: new Question(new GoogleMapsImage("Donetsk,UA", 13, ["dsP-p-S2WwzeSjRf316c4dVvHyc=","Bt_SzcbSaTh3_yfI1xgUtT8FdbI="]), "Donetsk", ["donetsk","донецьк"]),
    UA_Odessa: new Question(new GoogleMapsImage("Odessa,UA", 13, ["JsaXIY2-McFLXZd70j4qTiQH724=","e14Qy1RCaX8T6goAv4AmpOU_rfY="]), "Odessa", ["odessa","одеса"]),
    UA_Zaporizhia: new Question(new GoogleMapsImage("Zaporizhia,UA", 13, ["eIwyR1v9aEfWq2SbbEVBaaYdUNU=","4Owbibp9P-JSlPJD4228FzSjOvY="]), "Zaporizhia", ["zaporizhia","запоріжжя"]),

    // France: FR
    FRIDF_Paris: new Question(new GoogleMapsImage("Notre%20Dame,Paris,FR", 13, ["mAaRmvlHs5yZ_JLQGYMhqH1hW_A=","zwlBr-VH5wZODdFgUirmjD3fPQU="]), "Paris"),
    FR_Marseille: new Question(new GoogleMapsImage("43.29538035304942,5.390813492041645", 13, ["E9E1koX1-zmGRtK5Y56zPtwxIA4=","64FmRfn-DyeWNQv6TWmnuliK0ZU="]), "Marseille"),

    // Spain: ES
    ESMD_Madrid: new Question(new GoogleMapsImage("Madrid,ES", 13, ["Q8167jD5NpIVptswZy26IGC-i-0=","BdLBB70CfHwioOJ9E_ip21FAhco="]), "Madrid"),
    ES_Barcelona: new Question(new GoogleMapsImage("Barcelona,ES", 12, ["fGlXmj36272KRyxYlQly9sK61eA=","Xr9a4sVz6ZCL0kUaUumGFuRsEa4="]), "Barcelona"),
    ES_Valencia: new Question(new GoogleMapsImage("39.450801797485184,-0.35078216120929945", 12, ["lKInKGCYUk7MLWlEqECk_lGVYH4=","ZlFf3nSvzLcZPzzLGGjLYu8CnnY="]), "Valencia"),

    // Sweden: SE
    SEAB_Stockholm: new Question(new GoogleMapsImage("Stockholm,SE", 12, ["CsFLbcaXKypxCxslkon6Q4kFSZo=","h-24frHNTtTbcq8eNuwN_qqt5eI="]), "Stockholm"),

    // Germany: DE
    DEBE_Berlin: new Question(new GoogleMapsImage("Berlin,DE", 12, ["lxkrJ5HSc6x3HJjNoEm4otPlTvQ=","VrBcxVFmO8CtyjJbsHT4LtNwliM="]), "Berlin"),
    DE_Hamburg: new Question(new GoogleMapsImage("53.53960788691941,9.981611263805362", 13, ["vVkkTk6JbaMymMK0HfKES7AhvEs=","0uvN0-3KWm17HJPO2UlOgBh8uqY="]), "Hamburg"),
    DE_Munich: new Question(new GoogleMapsImage("Munich,DE", 13, ["EZ5pGMQBnCm-28SwRwqDr4yC1_Y=","wc9TxQWdFID15Su174Ye6-lqieY="]), "Munich", ["munich","munchen","münchen"]),
    DE_Cologne: new Question(new GoogleMapsImage("Cologne,DE", 13, ["_Xh0RYTf8_lmK92DYEIV3mIRkVY=","7VH0HutYmpLy3u_TGXi8p1w7Sxw="]), "Cologne", ["cologne","koln","köln"]),

    // Finland: FI
    FI18_Helsinki: new Question(new GoogleMapsImage("Helsinki,FI", 12, ["GKIQvY3ytPm0zQlymXdxr3Z4Wiw=","umV_jyt1_jb8BgKqnI18sWbbANQ="]), "Helsinki"),

    // Poland: PL
    PLMZ_Warsaw: new Question(new GoogleMapsImage("Warsaw,PL", 12, ["PGOFKU49uTGiNGn--ogcZxgq3tA=","SYU72gUkrUdKMuQtgQpT30busI8="]), "Warsaw", ["warsaw","warszawa"]),
    PL_Lodz: new Question(new GoogleMapsImage("Lodz,PL", 13, ["LRHOeJdBOEGxCi2qeqWRCTZ3A_I=","15_mC_wmLk50x_LSkRyvJXRygi4="]), "Łódź", ["lodz","łódź"]),
    
    // Italy: IT
    ITRM_Rome: new Question(new GoogleMapsImage("Colosessum,Rome,IT", 12, ["-a_9SpNsa77TkHFsD5xTSz_gfco=","79nFNsBZyTurBZaWzuY0NvJGqC8="]), "Rome", ["rome","roma"]),
    IT_Milan: new Question(new GoogleMapsImage("Milan,IT", 13, ["SUnPJCnDgiw65kZVy7SLLvvR9zs=","UFk9QBxShEdMTG8AISXpCr35Wl4="]), "Milan", ["milan","milano"]),
    IT_Naples: new Question(new GoogleMapsImage("Naples,IT", 13, ["pj6J_jgaZRcWBR4JzqKwMSVEUag=","NJllAY1TRMtJVMMpwPmoeSAbr3Q="]), "Naples", ["naples","napoli"]),
    IT_Turin: new Question(new GoogleMapsImage("Turin,IT", 13, ["lCf9a1eP77OhH_s1PH4tfMjauzc=","nQzx1Bi66lKxDHcSUsFuL_ZlKu8="]), "Turin", ["turin","torino"]),

    // United Kingdom: GB
    GBENG_London: new Question(new GoogleMapsImage("London,GB", 12, ["Mi3PVkns214roZ_JA_IEL6DMA8s=","RAVFKYIKP3b8nqwQO2v-C8TvHuM="]), "London"),
    GB_Birmingham: new Question(new GoogleMapsImage("Birmingham,GB", 13, ["KTHX0K0mlUsLa-7itZcWfzRDl4M=","dOLrNCvBrnKOPF5g2iCEzLLTsAs="]), "Birmingham"),
    GB_Liverpool: new Question(new GoogleMapsImage("53.41307630055226,-2.9330236606574416", 12, ["DX1pJNOoF8gfzvi7xRvpIX04ST0=","IxyqH0F7zvkrHE40pNhYgeievaw="]), "Liverpool"),

    // Romania: RO
    ROB_Bucharest: new Question(new GoogleMapsImage("Bucharest,RO", 13, ["JWIi_S8B-1ooTsrRhecSomPwlY4=","KWhlIIOGqUSd3RmEVA7OAm3JhdM="]), "Bucharest", ["bucharest","bucurești"]),

    // Belarus: BY
    BYHM_Minsk: new Question(new GoogleMapsImage("Minsk,BY", 12, ["8W9FdhkOXfS5RgQqoCR1HcDXByw=","i1KYT05kv3K0rW57EBwk7bIYbW4="]), "Minsk", ["minsk","мінск","менск","минск"]),

    // Greece: GR
    GRI_Athens: new Question(new GoogleMapsImage("Athens,GR", 13, ["LMP2ntVWbVTODT-GJQC-90xYBZo=","VCCKN6ibehEn-9I0XrHGQIwAJCM="]), "Athens", ["athens","αθήνα"]),

    // Bulgaria: BG
    BG22_Sofia: new Question(new GoogleMapsImage("Sofia,BG", 13, ["mrFfZYmebjHjPub_YmbvLTYA60I=","tlMzWdTEvns4VeB7ZAuNBjvcoBc="]), "Sofia", ["sofia","софия"]),

    // Iceland: IS
    IS1_Reykjavik: new Question(new GoogleMapsImage("64.13599420450862,-21.92402210755096", 13, ["31YoHZMVVY8ja7VT6rvYVrJtIsA=","crhr0BpeHlANV3Wzp2MLv1Imo2I="]), "Reykjavik", ["reykjavik","reykjavík"]),

    // Hungary: HU
    HUBU_Budapest: new Question(new GoogleMapsImage("Budapest,HU", 13, ["uaqtBkc6lCADfuwU3-Ce3--8UQI=","tfmsEJQ9wG0xLfXhyG8F-4E4K78="]), "Budapest"),

    // Portugal: PT
    PT11_Lisbon: new Question(new GoogleMapsImage("Lisbon,PT", 12, ["n0NiJ208qPpm74zthCLat8qpToU=","-fBoiG8MFTrhQD-5Qjr-gI1tAM8="]), "Lisbon", ["lisbon","lisboa"]),

    // Austria: AT
    AT9_Vienna: new Question(new GoogleMapsImage("Vienna,AT", 12, ["OnXzIxUsaoCcqr2qICeVdgpJPn8=","rMLuyceE-6O_2Df59GGDcnwxj4w="]), "Vienna", ["vienna","wien"]),

    // Czech Republic: CZ
    CZ10_Prague: new Question(new GoogleMapsImage("Prague,CZ", 12, ["H1LwV9sM7q-J3653RskThbUwf0I=","qWTHs8jAgs9rH-mcEJ-lwSyMcWw="]), "Prague", ["prague","praha"]),

    // Serbia: RS
    RS00_Belgrade: new Question(new GoogleMapsImage("Belgrade,RS", 12, ["CEiINHmYE1AOiEbA0j-IsCR0Ve0=","wKvm9RmS0_eTPN4mM5MDMESMYMc="]), "Belgrade", ["belgrade","beograd","београд"]),

    // Ireland: IE
    IEL_Dublin: new Question(new GoogleMapsImage("Dublin,IE", 13, ["Nn-m5H5thOnOwiI4P9ZKiDgj5hc=","EqFw_s2GmSfcumFjp6Dn2T5o3vc="]), "Dublin"),

    // Lithuania: LT
    LTVL_Vilnius: new Question(new GoogleMapsImage("Vilnius,LT", 13, ["AdFMai1W-YYNPpbVihjokPXhkVE=","WcUoowQI1lBbeqV0Qhwxb8e1iZc="]), "Vilnius"),

    // Latvia: LV
    LVRIX_Riga: new Question(new GoogleMapsImage("Riga,LV", 12, ["6rrAfms9N1Jg8d_r0ahBolkQqkU=","_BxBs5DRoDCOzqAENM8WcV-O2kc="]), "Riga", ["riga","rīga"]),
    
    // Croatia: HR
    HR21_Zagreb: new Question(new GoogleMapsImage("Most%20slobode,Zagreb,HR", 13, ["90zIvi9oQnksQlANYBQu_1KstiY=","33LmkQ5JfDTEMglh0SNNyMkkJ-w="]), "Zagreb"),

    // Bosnia and Herzegovina: BA
    BABIH_Sarajevo: new Question(new GoogleMapsImage("Sarajevo,BA", 13, ["2Bsww_J0HoXfEotaAPvxmgnc1Mc=","OGx7j2GEa2ONBZy2CYoNOKzMsRc="]), "Sarajevo"),

    // Slovakia: SK
    SKBl_Bratislava: new Question(new GoogleMapsImage("Bratislava,SK", 12, ["XFdPEEYR5p7nbp521_tPs260s7I=","U_MWUf8iglKUmUhYKnWm0hFy3uw="]), "Bratislava"),

    // Estonia: EE
    EE37_Tallinn: new Question(new GoogleMapsImage("Tallinn,EE", 12, ["gO57OI4Ee5vbblccSr506sUTMF8=","Qelciln9b4dfok-UPyXKCbEnmSQ="]), "Tallinn"),

    // Denmark: DK
    DK84_Copenhagen: new Question(new GoogleMapsImage("Copenhagen,DK", 12, ["sIUZpBfX8E7-M6iHcIzLZFfEL9E=","-ZrmDnglIGMBRXHxFhac1cWokmg="]), "Copenhagen", ["copenhagen","københavn"]),

    // Switzerland: CH
    CHBE_Bern: new Question(new GoogleMapsImage("Bern,CH", 13, ["nBPnms0FT1dPazdJKcEsMCmUTzs=","O9uw8ByiElskCsgvSy2rt98IDdM="]), "Bern"),

    // Netherlands: NL
    NLNH_Amsterdam: new Question(new GoogleMapsImage("Amsterdam,NL", 12, ["xUPiQCSJDxwdtvRk_ZBuHLyAGjE=","O0mZQYRfdXGBi4NrzRelq6GJZok="]), "Amsterdam"),

    // Moldova: MD
    MDCU_Chisinau: new Question(new GoogleMapsImage("Chișinău,MD", 13, ["RkhyA5kyfyQ44qFYNqgLWCcUZGY=","DHlzQbevmL9MHBEIJFHjfiO3zXE="]), "Chișinău", ["chișinău","chisinau"]),

    // Belgium: BE
    BEBRU_Brussels: new Question(new GoogleMapsImage("Brussels,BE", 13, ["grkPWLYH1UoWGtnZqmwsbNYZRqE=","DuCs7jbmvBMgqBOD9L_w9KTe7lg="]), "Brussels", ["brussels","bruxelles"]),

    // Albania: AL
    AL11_Tirana: new Question(new GoogleMapsImage("Tirana,AL", 13, ["bMqf8nXn2uR5-ZhE7zbrS083NaU=","sbiijtMXvgdNVw0oLW_pZDUjuso="]), "Tirana", ["tirana","tiranë","tirane"]),

    // North Macedonia: MK
    MK85_Skopje: new Question(new GoogleMapsImage("Skopje,MK", 13, ["OqHpZGyc0X9Cgp7lwqufYG5GsRI=","ZbEQPZGHlwi-ZCe_cn32z8VLwEk="]), "Skopje", ["skopje","скопје","shkup"]),

    // Slovenia: SI
    SI061_Ljubljana: new Question(new GoogleMapsImage("Ljubljana,SI", 13, ["3DdC9OTxAKjyK8zNfw3NgYG1Zbg=","xfTGHsDG0_oDDZumdXYsqbET-Ik="]), "Ljubljana"),

    // Montenegro: ME
    ME16_Podgorica: new Question(new GoogleMapsImage("Podgorica,ME", 13, ["LrdrmSp4RZ6D-0arneBKyoASpWk=","Mt4MsRjJ7fPSD5VPQit5Qf7I-bA="]), "Podgorica", ["podgorica","подгорица"]),

    // Luxembourg: LU
    LULU_Luxembourg: new Question(new GoogleMapsImage("Palais%20Grand-Ducal,Luxembourg,LU", 13, ["qQtiG8phHXQsHxDPx06bC7HaLzI=","5X2d5QGu07FUlx14hTCPfNO9Z48="]), "Luxembourg"),

    // Andorra: AD
    AD07_AndorraLaVella: new Question(new GoogleMapsImage("Andorra la Vella,AD", 14, ["ZB7EJoWAxGLMInIXIKF3oi5Cbrk=","h6OcVY49AZh2trLUJ7h6408mftE="]), "Andorra la Vella", ["andorra la vella","andorra"]),

    // Malta: MT
    MT60_Valetta: new Question(new GoogleMapsImage("Valetta,MT", 14, ["vb-_R7ohXK0Fb8_C9NSy6JQEs7k=","s3_zcpDQcYyvBlOcMukSMn6hBz8="]), "Valetta"),

    // Liechtenstein: LI
    LI11_Vaduz: new Question(new GoogleMapsImage("Vaduz,LI", 14, ["ki0UScTS2RVIPB2Ee8jIK7E24rs=","wbEuxyHC1Mm5NcA4gX7zfm40pvo="]), "Vaduz"),

    // San Marino: SM
    SM07SanMarino: new Question(new GoogleMapsImage("San Marino,SM", 14, ["9XwRUU4PI-kdxu6LTFemGG4TH8Q=","luu1UquQZ_LP8mJaps-rtBAl_x4="]), "City of San Marino", ["san marino","città di san sarino","city of san marino"]),

    // Monaco: MC
    MC_Monaco: new Question(new GoogleMapsImage("Monaco,MC", 14, ["rIkaeqtjrogxqAxEnwjJMP91QH0=","y8Wy7Zeq-p6VnuPFmo1qhvZ9Pzs="]), "Monaco"),

    
    // North America

    // Mainland NA

    // United States of America: US
    USAL_Montgomery: new Question(new GoogleMapsImage("Montgomery,AL", 14, ["op8R3xWwmUrU2rEt7Y3nYrhgAcI=","UfCS--VDZ8vtlYWc6OlPuafCius="]), "Montgomery"),
    USAK_Juneau: new Question(new GoogleMapsImage("Juneau,AK", 14, ["aT_LNRZHJteE-v1k9lb5b9dGpxg=","m7if13kY5L8_GOe1NP_ZxAP0KF8="]), "Juneau"),
    USAZ_Phoenix: new Question(new GoogleMapsImage("Phoenix,AZ", 13, ["dK5FyPnNQ4YZqugy-oPh3OWG_aU=","6yYJ49NhP1beJlRYMdyxM2Xmi8Q="]), "Phoenix"),
    USAR_LittleRock: new Question(new GoogleMapsImage("Little Rock,AR", 13, ["CuzMCCSBeP4jmt5rzxNhsIjmFg4=","QeJOY3uWzOfNpPXoA-XzGzgTAHM="]), "Little Rock"),
    USCA_Sacramento: new Question(new GoogleMapsImage("Sacramento,CA", 13, ["KxBw-YR2NoklCZoFyD69wWlE2fU=","s5J9_sw2yvqJygEXvWU2yXjNri4="]), "Sacramento"),
    USCO_Denver: new Question(new GoogleMapsImage("Dever,CO", 13, ["b9YZyzdFaEb3UvQEclHDAbmThno=","-vf41dTGmSs8FpvobtLoiwydNWE="]), "Denver"),
    USCT_Hartford: new Question(new GoogleMapsImage("Hartford,CT", 13, ["AzKAMjNFw_ZqI3Up35NhHUyhn50=","Z2cxOMPyHI1R5WbEVFN1plt0NzM="]), "Hartford"),
    USDE_Dover: new Question(new GoogleMapsImage("Dover,DE,US", 13, ["O3h0-yOsPGKytdlAKzcGa7YD0XQ=","caPnlSYqf6uFT4-68n82qASIJbg="]), "Dover"),
    USFL_Tallahassee: new Question(new GoogleMapsImage("Tallahassee,FL", 14, ["bp_vGHZR-JVoZZZBtSPHDEAVDlc=","ubZUlf5c__7odfnWffn4l4OlJOU="]), "Tallahassee"),
    USGA_Atlanta: new Question(new GoogleMapsImage("Atlanta,GA", 13, ["EBRh-gK1g3JuX6V0bz3u0aUB0UI=","fr_qOj0uQ--aMaVGNA_H_bLVbyM="]), "Atlanta"),
    USHI_Honolulu: new Question(new GoogleMapsImage("Honolulu,HI", 13, ["HnBDXslSNxrfKSZA1MxWFbznPc4=","L0x2RlvQBeuzEnGaJzyFn0ueBOM="]), "Honolulu"),
    USID_Boise: new Question(new GoogleMapsImage("Boise,ID", 13, ["sGpVcHI56TE8UyF2Z-Jft327nbg=","jOzuy6hJmUZNIi_ujpWsTBD5CH0="]), "Boise"),
    USIL_Springfield: new Question(new GoogleMapsImage("Springfield,IL", 13, ["7CO5TyNq3uldQT66dYyRryz0zRs=","FIDxskyVBhMQRtM1rFjpMfQrmp8="]), "Springfield"),
    USIN_Indianapolis: new Question(new GoogleMapsImage("Indianapolis,IN", 13, ["p17BTwbJxUSWFuAi4gxH3WDxt90=","n8T5x2GeMghysEMOYWzG2SvaeGc="]), "Indianapolis"),
    USIA_Des_Moines: new Question(new GoogleMapsImage("Des Moines,IA", 13, ["sDFg0AAOzCqZH2hfhQf3DKMQfK4=","FjJk8emXYGzGlAqE4xuvGEMy7K8="]), "Des Moines"),
    USKS_Topeka: new Question(new GoogleMapsImage("39.05568612488337,-95.67612154084969", 14, ["5c6pACSKAIof0XNcPa5dsD675eI=","LpPgozLgPs62C3AtOUuMn_D5sW4="]), "Topeka"),
    USKY_Frankfort: new Question(new GoogleMapsImage("Frankfort,KY", 14, ["CSgYW7nVxAzVgnSbBoJTgQsun-Y=","jHIQ2JvcsE9o_4u5L2z7KwLi02s="]), "Frankfort"),
    USLA_BatonRouge: new Question(new GoogleMapsImage("Baton Rouge,LA", 13, ["ozGW-LBftWZXhbsuKOZ5SNbYMS4=","paIqJf2a7LuWxK5_uErFZPwU9NA="]), "Baton Rouge"),
    USME_Augusta: new Question(new GoogleMapsImage("Augusta,ME", 14, ["cPCrvwbkGaKt-ui20ajnlJ9mUyM=","h6Ljcf0OeRNGYAew5QWUTTsX_tk="]), "Augusta"),
    USMD_Annapolis: new Question(new GoogleMapsImage("Annapolis,MD", 14, ["M6NDbi7_d2MVQ73voPuKIhqI_Ic=","fG5Df_Z9dRsut-smiVtn5bZYlWQ="]), "Annapolis"),
    USMA_Boston: new Question(new GoogleMapsImage("Boston,MA", 13, ["rfu6mu4VRNjzMxGMPE8ui8MKIfc=","yapmNpQzeVRCpoUvK074MLq_aXo="]), "Boston"),
    USMI_Lansing: new Question(new GoogleMapsImage("Lansing,MI", 13, ["Tt8oAC_nca6FGuamyGFxZ5ik80s=","9x7fmsadlV9V0WothbRB-nGxppg="]), "Lansing"),
    USMN_StPaul: new Question(new GoogleMapsImage("St. Paul,MN", 13, ["mbo8n3JMzxBS_PJqYWD7uHNXnuA=","wz0Id-hbDS3rc1JnskKTrg_YQT8="]), "St. Paul", ["st. paul","st paul","saint paul"]),
    USMS_Jackson: new Question(new GoogleMapsImage("Jackson,MS", 14, ["LLTUfWMCJQiGTHV0nwGEv6IlahQ=","Ra6yG6b1uEOLwhp0elBVLhPjgwI="]), "Jackson"),
    USMO_JeffersonCity: new Question(new GoogleMapsImage("Jefferson City,MO", 14, ["CP0-wl95UlyA-0XPsgb-NL8V5Sw=","JPgjH-ENegAwgUoo17mPWhXzuRg="]), "Jefferson City"),
    USNE_Lincoln: new Question(new GoogleMapsImage("Lincoln,NE", 14, ["j6fVQFfsivjegqJfdwMpdccjZi4=","rDaTK_nYbNRg-WChf61gdN0D7AM="]), "Lincoln"),
    USNV_CarsonCity: new Question(new GoogleMapsImage("Carson City,NV", 14, ["Dj9aBZCEYfOThtBVnmtY9W6tT0E=","4yMqk230glz56EMVdMw4FniOzUU="]), "Carson City"),
    USNH_Concord: new Question(new GoogleMapsImage("Concord,NH", 14, ["Pmm01iUJoYev2i3Ev5hZvVvcRqg=","9Op41tMdvogeiOsuNGzkkQKW_5o="]), "Concord"),
    USNJ_Trenton: new Question(new GoogleMapsImage("Trenton,NJ", 13, ["e0fs4K8Hzu-sh50T9MLog9VZehI=","s__h5tc-2vja6BklVkjq46NYpI0="]), "Trenton"),
    USNM_SantaFe: new Question(new GoogleMapsImage("Santa Fe,NM", 14, ["aR__BgYP8NnkQeiKNj4oIP7sPzA=","RgD1ql1bvpLr3iJ5e84uITqf3KQ="]), "Santa Fe"),
    USNY_Albany: new Question(new GoogleMapsImage("Albany,NY", 13, ["LXSmHPYlifx_h5Uh6MaIQCT4rFI=","76-xRtrbDK3kUA55Iebl88sEBM8="]), "Albany"),
    USNC_Raleigh: new Question(new GoogleMapsImage("Raleigh,NC", 13, ["epNt9lQmFQo3GwO71dVk8UFimR0=","AMpoeUd2gwG5SGRSJNDk7PVXhl0="]), "Raleigh"),
    USND_Bismarck: new Question(new GoogleMapsImage("Bismarck,ND", 13, ["bbwc4rA6P_bzHc5PMjgKUQZQW6Y=","2LF5_pte0ZXWYuNc7P8i9rl1BDs="]), "Bismarck"),
    USOH_Columbus: new Question(new GoogleMapsImage("Columbus,OH", 13, ["8v-BJU6oEkzyk65CgsjpXeb7Mdo=","NlSwtayV7ZzvmCsLSF3GDjUmwFk="]), "Columbus"),
    USOK_OklahomaCity: new Question(new GoogleMapsImage("Oklahoma City,OK", 13, ["BCS73qTUC6BfiypEiuMt_9YIQnc=","59pZ6VeJSUpvyGWxWZC8MLD0LZU="]), "Oklahoma City"),
    USOR_Salem: new Question(new GoogleMapsImage("Salem,OR", 14, ["J209Qx-e1Gavjr2eKp3c9viRM2M=","a6jEb8kVS0D2GjbrmbCgwAsugZk="]), "Salem"),
    USPA_Harrisburg: new Question(new GoogleMapsImage("Harrisburg,PA", 13, ["5qCn6f6Uin1eQz72hqx2vUx0gGY=","4qcHZf5u9RH3X0k7WXdCdsdDxFU="]), "Harrisburg"),
    USRI_Providence: new Question(new GoogleMapsImage("Providence,RI", 13, ["ry4MaO0Klt5FrEMxV6OOyDINywc=","Yn8emjl6162LPhVFpVwNUfasp0E="]), "Providence"),
    USSC_Columbia: new Question(new GoogleMapsImage("Columbia,SC", 14, ["OF5I2rw2XS_1GA0IgBuXG4LUw_w=","9ZAmTKBJKNBwDhFfqj-cM9I1T6g="]), "Columbia"),
    USSD_Pierre: new Question(new GoogleMapsImage("Pierre,SD", 14, ["zagG15JKMpAi2JsNLtvTQUWrxV4=","ODTo6Irgh4hmEgxJeyE-SmVMDzE="]), "Pierre"),
    USTN_Nashville: new Question(new GoogleMapsImage("Nashville,TN", 13, ["wrC0cHZvBOqV96gvEF04lRR-Eyc=","Pe_k5KkpLCw8Fs3iALyNc_JbX_k="]), "Nashville"),
    USTX_Austin: new Question(new GoogleMapsImage("Austin,TX", 13, ["2tRmmBx555tSjLGa-flrOCOM-LY=","gnBQksofVpFC2bVweUnk2o8AGpg="]), "Austin"),
    USUT_SaltLakeCity: new Question(new GoogleMapsImage("Salt Lake City,UT", 13, ["enXpMbK3JGAfN-uc9VyIIfLfXwg=","sQJ6FUPj7wSLCe_X6NaKI888At0="]), "Salt Lake City"),
    USVT_Montpelier: new Question(new GoogleMapsImage("Montpelier,VT", 15, ["C8q8otKDnkKXbLMoBSjC2s3EOS4=","rb1U1lTApAwcYLkeAYm2IaeaDlM="]), "Montpelier"),
    USVA_Richmond: new Question(new GoogleMapsImage("Richmond,VA", 13, ["B0Kxnpu0iRq46OqAE9ihORb9018=","qzMh0ZFbSkVi7DdWP1BM0p23t_0="]), "Richmond"),
    USWA_Olympia: new Question(new GoogleMapsImage("Olympia,WA", 13, ["keBzq6AObZdGTx_TAdmWjAP1pWE=","Ifad53elEJ_-Ggr6aA1h7WyPk3A="]), "Olympia"),
    USWV_Charleston: new Question(new GoogleMapsImage("Charleston,WV", 13, ["9Wabu8pmSi9GhQXkGJIm6RJ3Fao=","PPtGHPPXPaV4-9qvjUC4Y6-NZ60="]), "Charleston"),
    USWI_Madison: new Question(new GoogleMapsImage("Madison,WI", 13, ["OhyUbBkxtWWOJm467u_K5890L3g=","FJ8_T7pL-vMESufeig9jbfS3CIc="]), "Madison"),
    USWY_Cheyenne: new Question(new GoogleMapsImage("Cheyenne,WY", 14, ["jABJlxeOcwuB4-tc3jWHLmtYifM=","LunBB1f6JerklNBUZWg48rxKmFg="]), "Cheyenne"),
    USDC_Washington: new Question(new GoogleMapsImage("Lincoln%20Memorial,Washington,DC", 13, ["qe5vzgGVBOkS4NxsCGpgt8mH-Ig=","3OyjwAXEHmtl3CqkYDvlE5P9mRk="]), "Washington, D.C.", ["washington","washington dc","washington, d.c.","washington d.c.","dc","d.c.","washington, district of columbia","district of columbia","washington district of columbia"]),
    USAS_PagoPago: new Question(new GoogleMapsImage("Pago Pago,AS", 15, ["Cy2Y7R0Xnz0UR1sIcrDmdz48mT0=","oNraJDebP8Ac6eES_Lj6opbTozc="]), "Pago Pago"),
    USGU_Hagatna: new Question(new GoogleMapsImage("Hagåtña, GU", 15, ["31ZZHZ_-ndXPwjGjxMgXayFI_f8=","M5XyqrJY1Bamakq0hwsU2l90BtU="]), "Hagåtña", ["hagåtña","hagatna","hagatnja"]),
    USMP_Saipain: new Question(new GoogleMapsImage("Chalan Piao,MP", 14, ["3zSSw5J2QGg3SJ-VsXwzZO85YrU=","RhMZfM2n9jU0rcjDXFP9jzCFDVs="]), "Saipan", ["chalan piao","saipan"]),
    USPR_SanJuan: new Question(new GoogleMapsImage("Puerto%20Rico%20Terminal,PR", 13, ["8Er2g1UFR1z6wid4StJfc3VGG5E=","9I-Qzbq5aJIs2dBN4MlOO0IKehQ="]), "San Juan"),
    USVI_CharlotteAmalie: new Question(new GoogleMapsImage("Charlotte Amalie,VI", 14, ["GwXlrf30CPPGvSO9fviv89bZx_c=","8pdcd46dW3l1EN9jzxzbPS--8JQ="]), "Charlotte Amalie"),
    USNY_NewYorkCity: new Question(new GoogleMapsImage("New York City,NY", 11, ["DKeQ1nAF6WEjJJCiblj03ZRilPQ=","ms-Gw9Z9nAiFm4DEUs8q8OXWFQ0="]), "New York City", ["new york city","new york"]),
    USCA_LosAngeles: new Question(new GoogleMapsImage("Bevery Hills,Los Angeles,CA", 11, ["1giIBdP_jbhkpkCcwmKjQLShJo8=","k58w7hpwNmJ5Dl8V2ONUNi4qE_E="]), "Los Angeles"),
    USIL_Chicago: new Question(new GoogleMapsImage("Chicago,IL", 12, ["3AMaNg70IoFaLDS7BplX3LGsOwo=","Zz-ctlLIsP5DSH7A4B-IJ9MOW-w="]), "Chicago"),
    USTX_Houston: new Question(new GoogleMapsImage("Houston,TX", 13, ["_-EjLf-Hd4gp9HA4YScynGcE_Oo=","jkGaKBH1B51wO4I5YnTRmeCIUvc="]), "Houston"),
    USPA_Philadelphia: new Question(new GoogleMapsImage("Philadelphia,PA", 13, ["-dWMYOA2qFR0PvUFCDsC0Quwqfw=","p8-bQ6AO07tpWlqNeaNVXq6lqEU="]), "Philadelphia"),
    USTX_SanAntonio: new Question(new GoogleMapsImage("San Antonio,TX", 13, ["lrCdP8lg5FizlitJbY-RCiyxchg=","aGmrKXv-W2P5q6RhRQLe_ZaiaVI="]), "San Antonio"),
    USCA_SanDiego: new Question(new GoogleMapsImage("San Diego,CA", 12, ["8tCSHsadm9ROk8nlzFqJkG0uYBM=","vCYRyiguyqkzDWG7v33sVUEG3ek="]), "San Diego"),
    USTX_Dallas: new Question(new GoogleMapsImage("Dallas,TX", 13, ["D2wAwh__8dIvnMarQo7bdBu9EKE=","IyEDoRY70MNvSzFEGvr1KV1DY0I="]), "Dallas"),
    USCA_SanJose: new Question(new GoogleMapsImage("San Jose,CA", 12, ["uu-8pmzOp6-wLpWLjuRrRSHmPn0=","ONtHiLJFEYL24AP-RzYYFrDHDU0="]), "San Jose"),
    USFL_Jacksonvile: new Question(new GoogleMapsImage("Jacksonville,FL", 12, ["kKY3XozwgFEggZ9F7K2KpYW9Dfw=","xRNMVxe0yJXUR2YLuLJJvRoHezg="]), "Jacksonville"),
    USTX_ForthWorth: new Question(new GoogleMapsImage("Fort Worth,TX", 13, ["vZkZrRNjQpe69oHtMbCWLk2WnHk=","z7xg8QWY34C3bfo8Bt1fuIRe81I="]), "Fort Worth"),
    USNC_Charlotte: new Question(new GoogleMapsImage("Charlotte, NC", 13, ["qnpoJxSXqNhBZPdySlKMckJ7VkM=","ouYMUwA99N2xBG6TbxqhBxiDA9s="]), "Charlotte"),
    USCA_SanFrancisco: new Question(new GoogleMapsImage("San Francisco, CA", 11, ["vVIWsMLjvHdeGKu6U-eI_UFerb0=","US5RSuLP0th5qWctLXm4g_E1t8E="]), "San Francisco"),
    USWA_Seattle: new Question(new GoogleMapsImage("Seattle,WA", 12, ["hsKZuQMjeQjd5gOk3_RbB3hsxGk=","R89IOpw1hqrOQvIvkp60pqjPFFM="]), "Seattle"),
    USTX_ElPaso: new Question(new GoogleMapsImage("El Paso,TX", 13, ["7jnV6L3psc8P1yEnScHP5fghFh8=","ArE5RsQr-4EAk9nzPld5FQysI_s="]), "El Paso"),
    USMI_Detroit: new Question(new GoogleMapsImage("Detroit,MI", 13, ["UGLBqUec2UxQ3Q67qmmNcn6q3hU=","Awal_R1RE_6BnSd1zPmI12IpoxU="]), "Detroit"),
    USOR_Portland: new Question(new GoogleMapsImage("Portland,OR", 12, ["i7nsn6lMQ8j4kYImP1U3j09sgMo=","a_bhvt9wcXw3Em5TaUgQFwojSJs="]), "Portland"),
    USNV_LasVegas: new Question(new GoogleMapsImage("Las Vegas,NV", 13, ["3KWYVuiHsOz9sAE-lRspYMzH-TI=","lb0rMK0ssRC-tB4I6boCzRz5tCc="]), "Las Vegas"),
    USTN_Memphis: new Question(new GoogleMapsImage("Memphis,TN", 13, ["VUGYekfQrioH4jL6FTlpBSP0Ozw=","oogXUKicMvh1J9WubnViWMe4yhI="]), "Memphis"),
    USKY_Louisville: new Question(new GoogleMapsImage("Louisville,KY", 13, ["DagqYvNhIWmw1gqopXEcW_Tgw6g=","SFnCzPfV7PoWTNRRQuMMV-Rou7I="]), "Louisville"),
    USMD_Baltimore: new Question(new GoogleMapsImage("Baltimore,MD", 13, ["lp1xoRfXrcAluaXvUM0kOqXgLGQ=","qcZij1lBl5t60G7kzhJmQBbuii0="]), "Baltimore"),
    USFL_Miami: new Question(new GoogleMapsImage("Miami,FL", 12, ["4nHOmHpedR1EhH9kpHJgiTj42U0=","R12h7k5RYANJieQREH3Au7VYxG0="]), "Miami"),

    // Canada: CA
    CA_Ottawa: new Question(new GoogleMapsImage("Ottawa,CA", 13, ["aRgnwi8QHTTus6dK7gKnqMI1tZ0=","ur3y47AsI79f-oU2nihGgJbdifE="]), "Ottawa"),
    CA_Toronto: new Question(new GoogleMapsImage("Toronto,CA", 13, ["kdKTvW-K2gzkeWYkEXlYlfomITQ=","QEAZiGRYlay0bO0GSaIQorLocu0="]), "Toronto"),    

    // Mexico: MX
    MX_MexicoCity: new Question(new GoogleMapsImage("Mexico City,MX", 12, ["bKSDlsoYl_Q0VB-nPo-5UUDsUvE=","pfmolI-C8lvd9pWZcIOmZ3SiVRQ="]), "Mexico City", ["mexico city","ciudad de mexico","ciudad de méxico"]),
    MX_Guadalajara: new Question(new GoogleMapsImage("Guadalajara,MX", 12, ["it6EMcreaPmmFJqVKH_TsCJycz0=","xSrxlcsUHQv_swQykoUh80KErSs="]), "Guadalajara"),


    // Central America

    // Belize: BZ
    BZ_Belmopan: new Question(new GoogleMapsImage("17.249718736487612,-88.77482133927614", 14, ["JVYVuoSdjnbTYX2jnwcWKYrETGw=","9b8XqUw0Owk4EfgvD_vor6-CAbE="]), "Belmopan"),

    // Costa Rica: CR
    CR_SanJose: new Question(new GoogleMapsImage("San Jose,CR", 13, ["2ytSGoN0fm198zLuYveVBcbvZOc=","T6ZqLBZQfuKvOVDF3SzYzbsKd3k="]), "San José", ["san jose","san josé"]),

    // El Salvador: SV
    SV_SanSalvador: new Question(new GoogleMapsImage("San Salvador,SV", 13, ["-zFkgT6wFEkfyvaI0qgdvOfoE1k=","JxAOGnSPbUClXK6mTmL8bvpxnnU="]), "San Salvador"),

    // Guatemala: GT
    GT_GuatemalaCity: new Question(new GoogleMapsImage("Guatemala City,GT", 13, ["ThqP0NzyeQuh85JvzO1-YhyYXHI=","43hwNKiXbjKTGC0p2Q9xi_9p4u0="]), "Guatemala City", ["guatemala city","guatemala","ciudad de guatemala"]),

    // Honduras: HN
    HN_Tegucigalpa: new Question(new GoogleMapsImage("Tegucigalpa,HN", 14, ["7f3u3vUNa7jAMox6jM771QqhJqA=","Rnez7uMAZEDpKyzvo7iP-_GPszo="]), "Tegucigalpa"),

    // Nicaragua: NI
    NI_Managua: new Question(new GoogleMapsImage("12.141746057514073,-86.23472491667405", 14, ["KfgDNXoa4B79nj6DkK1JR1IFv0U=","UVTrOONahkROpInInNUB0Qakq4o="]), "Managua"),

    // Panama: PA
    PA_PanamaCity: new Question(new GoogleMapsImage("8.974352249627257,-79.5320251153119", 13, ["4A5oEx_CQn6ovWabLcpSvOcPEGo=","G2BOUYBD56FKG8efxdFGrN8cA6Y="]), "Panama City", ["panama city","ciudad de panama"]),

    // Caribbean

    // Antigua and Barbuda: AG
    AG_StJohns: new Question(new GoogleMapsImage("St John's,AG", 14, ["M4je6orDBRRYhGozvKNB-geo_Ps=","F0DSma4BkHJaE9q8-NsAzxwisak="]), "St John's", ["st john's","st. john's","st. johns","st johns","saint john's","saint johns"]),

    // Bahamas: 
    BS_Nassau: new Question(new GoogleMapsImage("Nassau,BS", 13, ["3snswPy72D8kE4J2hbZtbwaCUjk=","SZDAaw_BYN8SN8DGmRYn-F477OE="]), "Nassau"),

    // Barbados: BB
    BB_Bridgetown: new Question(new GoogleMapsImage("Bridgetown,BB", 14, ["T-bIhmT-rBc9y0egadWheAgCk1A=","O97Fud-NljbCvugUuZ6z5ZyQydQ="]), "Bridgetown"),

    // Cuba: CU
    CU_Havana: new Question(new GoogleMapsImage("Havana,CU", 13, ["KlpEHYheQpUxUHleVy-iMVCIAeI=","a6T1QILNhDTMsPAk79Ab6d6tSOg="]), "Havana", ["havana","la habana","habana"]),

    // Dominica: DM
    DM_Roseau: new Question(new GoogleMapsImage("15.303355522937578,-61.38328958409704", 15, ["cWkFGb6gv8JsiibBL83PCdsJQtY=","rL2NQDyiWsQUkiRbrQ0yB9VTRmI="]), "Roseau"),

    // Dominican Republic: DO
    DO_SantoDomingo: new Question(new GoogleMapsImage("Santo Domingo,DO", 13, ["4eyvetVXTxzKPBLG3_CGHs16tqQ=","axCE4rcYSiGvoE0ou5iI7ON6L98="]), "Santo Domingo"),

    // Grenada: GD
    GD_SaintGeorges: new Question(new GoogleMapsImage("12.050832154956812,-61.750482263282464", 15, ["YvxW11OxRbtEAUxEY1lAS1Xtvko=","wqFzGp4wntYpqnOXI_2ifJOwe6s="]), "Saint George's", ["saint georges","st. george's","st georges","saint george's","st george's"]),

    // Haiti: HT
    HT_PortAuPrince: new Question(new GoogleMapsImage("18.559152198412633,-72.31765312911371", 13, ["gqStNoL2j0weRphsJZhQKNzadtM=","N88tAt-xg1BNS2jrhv8IJ7UrlLI="]), "Port-au-Prince", ["port-au-prince","port au prince"]),

    // Jamaica: JM
    JM_Kingston: new Question(new GoogleMapsImage("Kingston,JM", 12, ["BEZgQ-2sg6WuZVthThzDkxapRkI=","ih_crHfYmYrj-MO6FM4fmZ1CTGo="]), "Kingston"),

    // Saint Kitts and Nevis: KN
    KN_Basseterre: new Question(new GoogleMapsImage("Basseterre,KN", 14, ["EdH80BBvmZd3QR9BYaoGLdaiu4s=","7fbBGk02B68D5hjxGUwRSgnbbbA="]), "Basseterre"),

    // Saint Lucia: LC
    LC_Castries: new Question(new GoogleMapsImage("Castries,LC", 14, ["CKTuZEjH6EykpKa4FzTWsP4jyw0=","39XIbJ9M72WqIuj0hUP1b5M6rG8="]), "Castries"),

    // Saint Vincent and the Grenadines: VC
    VC_Kingstown: new Question(new GoogleMapsImage("Kingstown,VC", 15, ["5dTeTVQsFVd9vjQay8raoGLHfAY=","aPWIKS3k9jZZ-yU0asbMqwqHEnE="]), "Kingstown"),

    // Trinidad and Tobago: TT
    TT_PortOfSpain: new Question(new GoogleMapsImage("Port of Spain,TT", 14, ["6kMIgg3SrBecWPa8d7kU8WU6dKY=","TW9SAwJF2t5Ho2_d97OAGegnOvQ="]), "Port of Spain", ["port of spain","puerto españa","puerto espana"]),

    
    // South America

    // Argentina: AR
    AR_BuenosAires: new Question(new GoogleMapsImage("-34.59587806430996,-58.39333844020621", 12, ["Nj24NIL5-JRP4CxcteQydOFtdDA=","M2o94Wgl3-vN8xUNLnwkDc_duEU="]), "Buenos Aires"),

    // Bolivia: BO
    BO_LaPaz: new Question(new GoogleMapsImage("-16.506124650345612,-68.1320557282154", 13, ["L0A4ThdrX-0cOn1JujziPJN_J1w=","XZMPMJHWuRJrQ7vNNbylqF_t8oo="]), "La Paz"),

    // Brazil: BR
    BR_Brasilia: new Question(new GoogleMapsImage("-15.793759808178818,-47.88280591732727", 12, ["S1kEAPx15CFjgS_HLzmk6R_Wul0=","jspwaltdufAMcfPG-nvqGG7ZJpU="]), "Brasília", ["brasilia","brasília"]),
    BR_SaoPaulo: new Question(new GoogleMapsImage("Sao Paulo,BR", 12, ["Tm2vlH0_Z1gvweMSCHIuwTFz1xM=","-i3FQ13Lt334RP8-kHqSKprUmJE="]), "São Paulo", ["sao paulo","são paulo"]),
    BR_RioDeJainero: new Question(new GoogleMapsImage("-22.90982753846069,-43.25032348088225", 12, ["S4bGUb_1taBz3z9Wuvapx0VMtV8=","cI6Myn0suFCqrGGyUdPWLcqP_Ek="]), "Rio de Janeiro"),
    BR_BeloHorizonte: new Question(new GoogleMapsImage("Belo Horizonte,BR", 13, ["lTQVah64W3PzVsxEDIt7Loc3unM=","O3OtsR1YmkqHu5jeSlt6RtDgEWw="]), "Belo Horizonte"),

    // Chile: CL
    CL_Santiago: new Question(new GoogleMapsImage("Santiago,CL", 12, ["Up1neeZrpIYusdHvBrhTj00qwVQ=","Nr_DW0jP6Mnwp2Fv-gKr6pUFtaM="]), "Santiago"),

    // Colombia: CO
    CO_Bogota: new Question(new GoogleMapsImage("Bogota,CO", 13, ["Ln7ArSJpxbYJjYTr497seXUjHho=","Eu8LHBjepn27pX5EDHJUdSMvjI4="]), "Bogota", ["bogota","bogotá"]),

    // Ecuador: EC
    EC_Quito: new Question(new GoogleMapsImage("Quito,EC", 12, ["irwt3gL-z_CZY0vJp0mxMZJ9ppQ=","T-ahBsr0lI6zYS_Y0jb-aGyYmzQ="]), "Quito"),

    // Guyana: GY
    GY_Georgetown: new Question(new GoogleMapsImage("Georgetown,GY", 13, ["O7qN30VFSX6VUVAGAb3xf-mZzYY=","CgvSVmfrZYt0O9_KaxgLevB0zyU="]), "Georgetown"),

    // Paraguay: PY
    PY_Asuncion: new Question(new GoogleMapsImage("-25.296162735747956,-57.604880210492034", 12, ["sgbhEM01QC-WVWnzSQYZshyosV0=","-Mxbpyr0LAEhO8IUrI6tX0SV3EQ="]), "Asunción", ["asunción","asuncion"]),

    // Peru: PE
    PE_Lima: new Question(new GoogleMapsImage("Lima,PE", 12, ["8CTZwQ8dEEKlJa0guhpF3DDoh7c=","DoR6AaHeGUV5hU4yNBm0XgyI-8U="]), "Lima", ["lima","lima district"]),

    // Suriname: SR
    SR_Paramaribo: new Question(new GoogleMapsImage("5.83562113597878,-55.16240409102544", 13, ["Hf82vzWsShVvYZYhQimBRFM_M4A=","iqK2bxAQUzYGXYmT2zZyZXSiPxw="]), "Paramaribo"),

    // Uruguay: UY
    UY_Montevideo: new Question(new GoogleMapsImage("Montevideo,UY", 12, ["z8b9Ze0iRB2ibZldJBIfDYc0rk4=","OXPK2Uh7bSsAXI4JdvFlewA5fRc="]), "Montevideo"),

    // Venezuela: VE
    VE_Caracas: new Question(new GoogleMapsImage("Caracas,VE", 13, ["WyUZTcsYwhM0yO3u3di0khQnjZI=","o7gU8vREbCdnUA4CtkxWaCs8axw="]), "Caracas"),


    // Asia

    // Central Asia
    
    // Kazakhstan: KZ
    KZ_NurSultan: new Question(new GoogleMapsImage("Nur-Sultan,KZ", 13, ["3OKUNmS_hI45Kspz7lsEfmeirzU=","d47sK6z9b_STb2l0rgypPq_zm-U="]), "Nur-Sultan", ["nur-sultan","nur sultan","нұр-сұлтан","нұр сұлтан"]),

    // Kyrgyzstan: KG
    KG_Bishkek: new Question(new GoogleMapsImage("Bishkek,KG", 13, ["4AnHV7LdN1nuG7RmMFcswFSYtCM=","BCLRv6wFS5VphZ1yK3heozQr0iw="]), "Bishkek", ["bishkek","бишкек"]),

    // Tajikistan: TJ
    TJ_Dushanbe: new Question(new GoogleMapsImage("Dushanbe,TJ", 13, ["l_1dce8PPVECRvv4Mx5Ev1lK3RM=","aKUWzFo552tr4kF5bPipCd7FSmo="]), "Dushanbe", ["dushanbe","душанбе"]),

    // Turkmenistan: TM
    TM_Ashgabat: new Question(new GoogleMapsImage("37.94044188585668,58.40071752389324", 13, ["hWHcE3mSePDgRR0NZ1SSOaLYP7o=","GAqQ-n_3Yg7oJwQ3zgw209vfvP8="]), "Ashgabat", ["ashgabat","aşgabat","asgabat"]),

    // Uzbekistan: UZ
    UZ_Tashkent: new Question(new GoogleMapsImage("Bunyodkor%20Square,Tashkent,UZ", 13, ["1VmzJ_6cYvkrZJJic0ITf72G5Ow=","vCNY-JoCDkA6-CyP-Bx8VRM_G5M="]), "Tashkent", ["tashkent","тошкент"]),

    
    // Western Asia

    // Armenia: AM
    AM_Yerevan: new Question(new GoogleMapsImage("Yerevan,AM", 13, ["FbR-gp1zP8cNniZsVDJIzIyXd7E=","Rgx72g1tH4rgM4MzVmAM3UhgAIY="]), "Yerevan", ["yerevan","երևան"]),

    // Azerbaijan: AZ
    AZ_Baku: new Question(new GoogleMapsImage("Baku,AZ", 12, ["Oj3Q8_4fz0sbAKMatZVYHS7ZXD0=","kG20v_QjGswatuRPGKEXlTmcrI8="]), "Baku", ["baku","bakı"]),

    // Bahrain: BH
    BH_Manama: new Question(new GoogleMapsImage("Manama,BH", 13, ["L96g-VMIV0qrFY6ICFLyMHqOMoY=","6-0nXxzAqdB5drVsRVH5kIWXnWA="]), "Manama", ["manama","المنامة"]),

    // Cyprus: CY
    CY_Nicosia: new Question(new GoogleMapsImage("Saint%20Sophia%20Cathedral,Nicosia,CY", 13, ["jFqbAfCQHYMpXm612LUkrcgyxS4=","RU0EyoZF9lm_U-EdfK0cl6yJWNQ="]), "Nicosia", ["nicosia","λευκωσία"]),

    // Georgia: GE
    GE_Tbilisi: new Question(new GoogleMapsImage("Tbilisi,GE", 13, ["QkYtzDRastF6ZoBkl0X_OUtOVdM=","j_rVsc_kB53pSd2u7M6Q7N0ZXDM="]), "Tbilisi", ["tbilisi","თბილისი"]),

    // Iraq: IQ
    IQ_Baghdad: new Question(new GoogleMapsImage("Baghdad,IQ", 13, ["cygKAFtORn_d3vd-0g6MLlDEpps=","Qd7TAI1TgRD_34EIp0N-uko5pHw="]), "Baghdad", ["baghdad","بغداد"]),

    // Israel: IL
    // For the purpose of this quiz, Jerusalem is in Israel.
    IL_Jerusalem: new Question(new GoogleMapsImage("Jerusalem", 13, ["Nq3n89Iu4sHTFpgQLl-z-EcUYNM=","E6vKOj8vSbhNbEk1D_BQmktKkD8="]), "Jerusalem", ["jerusalem","ירושלים","القُدس"]),

    // Jordan: JO
    JO_Amman: new Question(new GoogleMapsImage("Amman,JO", 13, ["yPPkxz3IVdc0wqW_xumHj29vd0s=","x67Bo2CCKsx_dOF-JB6BRmgWfdo="]), "Amman", ["amman","عمّان"]),

    // Kuwait: KW
    KW_KuwaitCity: new Question(new GoogleMapsImage("Kuwait City,KW", 13, ["BqrmHOxxiW9KzSn9KgKy0xzKeG8=","yho7wpy1HBx_tEub5bESXqYYu9U="]), "Kuwait City", ["kuwait city","مدينة الكويت"]),

    // Lebanon: LB
    LB_Beirut: new Question(new GoogleMapsImage("Beirut,LB", 13, ["8cSXvabuukJQFY8flasEv8wwoNg=","gDnJhUixpJH4k6P4Aj9nif36RNs="]), "Beirut", ["beirut","بيروت"]),

    // Oman: OM
    OM_Muscat: new Question(new GoogleMapsImage("23.594404504657824,58.445742397862496", 12, ["wYs8iJP-rh3O1ZgwQeP41p95lzk=","ro1EQHIsw9jlAGBcTsrP3vosU30="]), "Muscat", ["muscat","مسقط"]),

    // Qatar: QA
    QA_Doha: new Question(new GoogleMapsImage("Doha,QA", 12, ["fFUAPJqddhAtNuXlHS6hs6n0S4Y=","HKlEp3V8qh_pEthWB4eqCHYSf88="]), "Doha", ["doha","الدوحة"]),

    // Saudi Arabia: SA
    SA_Riyadh: new Question(new GoogleMapsImage("Riyadh,SA", 12, ["DtltLjE6N8NVMU0ZiR63OXcmCsE=","JgTqb1a6nQYfwpGG_JATyc1EVWs="]), "Riyadh", ["riyadh","الرياض"]),

    // Syria: SY
    SY_Damascus: new Question(new GoogleMapsImage("33.500125914524176,36.291779130892174", 13, ["YUYPHgSzy_Q4L4XXfltGW5dSTIE=","cl6T-vk1pcdlJEB_pVFde_4fHJQ="]), "Damascus", ["damascus","دمشق"]),

    // Turkey: TR
    TR_Ankara: new Question(new GoogleMapsImage("Ankara,TR", 13, ["bXKlWn7fvunq_u7dTn2uajLtH3o=","zW1N-6116e-cmX_5uBz3d_q46Lk="]), "Ankara"),
    TR_Istanbul: new Question(new GoogleMapsImage("41.0339896717834,29.00227760434989", 12, ["esQ7_Zc0gQTuyphlUFPeQddn2Os=","OvoBxJdy15k3xuvlDqFHIwFEuik="]), "İstanbul", ["istanbul","i̇stanbul"]),

    // United Arab Emirates: AE
    AE_AbuDhabi: new Question(new GoogleMapsImage("Abu Dhabi,AE", 12, ["bWDGWH7xlY64c4AgVhMkjVcg5r8=","4D5fk4392Hzl4K0R7I3BawTW7Cs="]), "Abu Dhabi", ["abu dhabi","أبو ظبي"]),

    // Yemen: YE
    YE_Sanaa: new Question(new GoogleMapsImage("Sana'a,YE", 13, ["4om8lG8mr0SvemyCVncCghkziqM=","eRlc44jvsigDjwDVI5g6sCMCJFI="]), "Sana'a", ["sana'a","sanaa","sana a","صنعاء‎"]),


    // Eastern Asia

    // China: CN
    CN_Beijing: new Question(new GoogleMapsImage("Beijing,CN", 12, ["XOuppUsghtRRVi4zGFWItih1abk=","jW3zkbd2lipimcZAqFVbQ6rmhMQ="]), "Beijing"),
    CN_HongKong: new Question(new GoogleMapsImage("Hong Kong", 12, ["qywCe2JMRYJ3DvzjV95fnRgxNyo=","Og1FedHg0c68GNHlzecvWa850DM="]), "Hong Kong", ["hong kong","香港"]),
    CN_Macau: new Question(new GoogleMapsImage("Macau", 12, ["q0UvStFeXDyTCViHcMQ238s1kSE=","glm5kG2619gyDMpFYcN7gXXcKUU="]), "Macau", ["macau","澳門","macao"]),
    CN_Shanghai: new Question(new GoogleMapsImage("Shanghai,CN", 11, ["yVZdQDIY8Cm3_MsLfZqlN43h6lE=","OuR_B2QGpKj9aH-xGHoEiRZ8gEI="]), "Shanghai", ["shanghai","上海市"]),
    CN_Chongqing: new Question(new GoogleMapsImage("29.53041735117703,106.51004857524514", 12, ["qcFjNvvHTD-7aea4gKEBs6yN4JI=","plVpnKWA1nhyuBjNu6wvmKk4GRU="]), "Chongqing", ["chongqing","重庆市"]),
    CN_Tianjin: new Question(new GoogleMapsImage("39.041176543409094,117.43083312561843", 10, ["O0MqS-vDqq97SvzP34MAIyFg82g=","E9YH57U5oG3lkGQxgQ_V2WVtdMo="]), "Tianjin", ["tianjin","天津市"]),
    CN_Guangzhou: new Question(new GoogleMapsImage("23.101688839025908,113.31859275981766", 11, ["GuRXJ7Gxi3GCxvqpSE9pa2y4Q0s=","AWDLoCLLqbUCMdx_d7m5jlx2YnU="]), "Guangzhou", ["guangzhou","广州市"]),
    CN_Shenzhen: new Question(new GoogleMapsImage("22.541825057544028,113.99857568695052", 11, ["llVlxoiD9pnfUEr0-b5DceFUnvY=","KHecL8aR1E9UWKhmiU30KL6ZE7c="]), "Shenzhen", ["shenzhen","深圳市"]),
    CN_Chengdu: new Question(new GoogleMapsImage("30.658194604748203,104.06538493799329", 11, ["TXc7BfXAb_Ivpals4S7eJF8hD1U=","L58J7yjLZ5vs_L6TPYVoM7lWCPk="]), "Chengdu", ["chengdu","成都市"]),
    CN_Nanjing: new Question(new GoogleMapsImage("32.098471043878575,118.72545595314396", 11, ["2bbQjfWyu_qBoxmc_h1UjLyR9fk=","7sLhnFiQX8e1klBsaOpG74hxf2A="]), "Nanjing", ["nanjing","南京市"]),
    CN_Wuhan: new Question(new GoogleMapsImage("Wuhan,CN", 12, ["57ddzDCfwHifL4e7g81iJCGjDxo=","56lKH7H462SDOQ_RPM7yiDKD6Hk="]), "Wuhan", ["wuhan","武汉市"]),
    CN_Xian: new Question(new GoogleMapsImage("Xi'an,CN", 11, ["7xr4KHbsJGG6DV2qgIP-brVrSww=","Yt2w_uORTmNBkDluQJctOeFfaSc="]), "Xi'an", ["xi'an","xian","xi an","西安市"]),
    CN_Dongguan: new Question(new GoogleMapsImage("Dongguan,CN", 11, ["05_S1ngYL1cfJo4rT-cMUpRGE6I=","Uq4QUnYrV69VJk_CSaeyxxABa5A="]), "Dongguan", ["dongguan","东莞市"]),
    CN_Hangzhou: new Question(new GoogleMapsImage("Hangzhou,CN", 12, ["QHBoHELBiiXs2DP-clUiLjesgK8=","RnF5ROAtqx2leg0iWXlZzgDADgw="]), "Hangzhou", ["hangzhou","杭州市"]),
    CN_Foshan: new Question(new GoogleMapsImage("Foshan,CN", 12, ["s0MOjpxNwYLKSF87wcdH2L3J8Lw=","SsHMZ_4nShtLJrsxE5xzwYaERns="]), "Foshan", ["foshan","佛山市"]),
    CN_Shenyang: new Question(new GoogleMapsImage("Shenyang,CN", 12, ["0MWWbu59YW3XDmT16REJg16l_gI=","r3tEW-8pVkDFhjfegUi_s6IvIgA="]), "Shenyang", ["shenyang","沈阳市"]),
    CN_Suzhou: new Question(new GoogleMapsImage("Suzhou,CN", 11, ["M_IB8E1_O5RczUrsJrLfvQsD0nU=","SJCw8ndRrJ9zrVwyyRA6vJLbLTY="]), "Suzhou", ["suzhou","苏州市"]),
    CN_Harbin: new Question(new GoogleMapsImage("45.75118398404859,126.63503358779869", 12, ["1UuZ_wVdun2oqHx1kUudvnyGWIE=","CjxZLdDxxBA6_MxqSBCaQhMbUgM="]), "Harbin", ["harbin","哈尔滨市"]),
    CN_Qingdao: new Question(new GoogleMapsImage("36.084118270198516,120.26102878838749", 11, ["mQzAHrr4kDJW7QHIADyYOpJSEVI=","y_WoeVjxJBwP2R0Qz5uZuWVnPCw="]), "Qingdao", ["qingdao","青岛市"]),
    CN_Dalian: new Question(new GoogleMapsImage("38.99195617233138,121.6879700846968", 11, ["c3A4Am2JDufdCCiHVALUiBWwdGw=","1rTOXf1eRDfBR27W1JnLoaLc91Y="]), "Dalian"),
    CN_Jinan: new Question(new GoogleMapsImage("36.683555253546295,117.02622201044134", 12, ["94my9_3FSYkfQlVL69-aIbNYw-Q=","Q8kZHVBVFtrSlVJPdmA7SxJ3LBo="]), "Jinan", ["jinan","济南市"]),

    // Taiwan is a country for the purpose of this quiz
    // Taiwan: TW
    TW_Taipei: new Question(new GoogleMapsImage("Taipei,TW", 12, ["7Pvog0g5cKtXIAiUwzeTqW1zLSw=","5Q5yzpx6Qero8rWEgDS-Zoj42DY="]), "Taipei", ["taipei","台北"]),

    // North Korea: KP
    KP_Peyongyang: new Question(new GoogleMapsImage("Peyongyang,KP", 12, ["I2lizbFDmzFjfDz0-l714HfQ5c4=","bKNTavf-kLm7JVKYlukQD-ZN5l8="]), "Peyongyang", ["peyongyang","평양"]),

    // Japan: JP
    JP_Tokyo: new Question(new GoogleMapsImage("35.65215309344215,139.76374158507505", 12, ["ZVvyM8hUpuatJ0kvY3AlC2dCrk8=","NEe4z9ewmN41LGo2Ce2daqHMQHc="]), "Tokyo", ["tokyo","東京都"]),
    JP_Osaka: new Question(new GoogleMapsImage("34.65897638415954,135.46888841841673", 12, ["D-XPA5cAeiD3JHPUx3QlvGX4s7c=","GqWGyzNZyD_-KJAdn8TGJcivar4="]), "Osaka", ["osaka","大阪市"]),
    JP_Nagoya: new Question(new GoogleMapsImage("35.151009971329515,136.9054820513379", 12, ["k-fIzKrSpztj_dMd9x5X1HulMiE=","q2PyiPqautv7uC7mFSUDofWMxdI="]), "Nagoya", ["nagoya","名古屋市"]),
    JP_Fukuoka: new Question(new GoogleMapsImage("Fukuoka,JP", 12, ["NGjNYB0RwvMV5ka2umWu8chNQ9o=","K66O56UdPMglA0chslBAjEoxFC4="]), "Fukuoka", ["fukoka","福岡市"]),

    // Mongolia: MN
    MN_Ulaanbaatar: new Question(new GoogleMapsImage("47.908197953446304,106.91802085541644", 13, ["R7OOVZcwVlOpV-_8wCCBweaddbo=","D_4oUCRPcacjhdKOjmamdEjQK2Q="]), "Ulaanbaatar", ["ulaanbaatar","улаанбаатар"]),

    // South Korea: KR
    KR_Seoul: new Question(new GoogleMapsImage("Seoul,KR", 12, ["K_mSVYXEmcHnPPuNHRm-e1bb5Vc=","0ZL71faMVeepkvuifB5tKp5_Lw4="]), "Seoul", ["seoul","서울특별시"]),


    // South-Eastern Asia

    // Brunei: BN
    BN_BandarSeriBegawan: new Question(new GoogleMapsImage("Bandar Seri Begawan,BN", 13, ["aMYjEJH8_3mAAR2fJqICNPTHuSM=","NvMPhTHElkbmT3qOVf8YqOg09Bw="]), "Bandar Seri Begawan"),

    // Cambodia: KH
    KH_PhenomPenh: new Question(new GoogleMapsImage("Phnom Penh,KH", 13, ["aZAL1lqoDSSe7W0L1hLrUx3BwmU=","KldCoIKAR7nrs6ZwiXlF1qXlbqU="]), "Phnom Penh", ["phnom penh","រាជធានី​ភ្នំពេញ"]),

    // Indonesia: ID
    ID_Jakarta: new Question(new GoogleMapsImage("National%20Monument,Jakarta,ID", 12, ["uevaG2BRWaUUp4oMokQybXZtMHI=","I5MSMDhCUygCbWtCwPxO-FKeSE4="]), "Jakarta"),

    // Laos: LA
    LA_Vientiane: new Question(new GoogleMapsImage("Vientiane,LA", 13, ["dJV7tUy605kTy3YXgh0sd0kA_2k=","q5IaMX1FmaR-NvmqyeiyYMqg-VA="]), "Vientiane", ["vientiane","ວຽງຈັນ"]),

    // Malaysia: MY
    MY_KualaLumpur: new Question(new GoogleMapsImage("3.1543511105192623,101.68496738207166", 12, ["C_D3FtBF2W-jsyHkjbConVe1NPA=","lDakuMu3mlEdYaq4jF2uISNZZpY="]), "Kuala Lumpur"),

    // Myanmar: MM
    MM_Naypyitaw: new Question(new GoogleMapsImage("19.749868673641554,96.08540212024712", 13, ["v4UbiiM93JOZVKBb_eRVwAWMcSA=","Ivlz5YNLVVYwuZ1x9JMRgUx7Ig4="]), "Naypyitaw", ["naypyitaw","နေပြည်တော်"]),
    MM_Yangon: new Question(new GoogleMapsImage("Yangon,MM", 12, ["XM4KLCndWcXkqG95IpV6tf-ezeo=","fgIz8rQwWPCGL6za_fbOqVFCAMI="]), "Yangon", ["yangon","ရန်ကုန်"]),

    // Philippines: PH
    PH_Manila: new Question(new GoogleMapsImage("Manila,PH", 12, ["Xcs7lvAeh7wlYjtq2WOc1HnrS70=","7Pf_O51dc-Z15J7-gDEsp7JXD0k="]), "Manila"),

    // Singapore: SG
    SG_Singapore: new Question(new GoogleMapsImage("1.30236765807081,103.84958970443697", 12, ["RU_ey7wI_S42R8vMG9P1VEmEn_Q=","YEUHM3SUJCsoeGvuQn8Nw_BVa-0="]), "Singapore"),

    // Thailand: TH
    TH_Bangkok: new Question(new GoogleMapsImage("Bangkok,TH", 12, ["kC9EAo6pI2AyLoF1ynSpOZeu8qA=","tZWTO76svgeLTN-2gcONAo210IE="]), "Bangkok", ["bangkok","กรุงเทพมหานคร"]),

    // Timor-Leste: TL
    TL_Dili: new Question(new GoogleMapsImage("Dili,TL", 13, ["sfoVM_4BSxeSEx7qtGRnnW1a6b4=","x64uVQ1G6UQwcF5th-P_FZD-jgY="]), "Dili"),

    // Vietnam: VN
    VN_Hanoi: new Question(new GoogleMapsImage("Hanoi,VN", 13, ["Zr8l5Ocq9FgWCeSeh_l7Bp0kQ0Q=","HzwGjj2KMl3Ue5Vmd0059c51P3A="]), "Hanoi", ["hanoi","ha noi","hà nội","hoàn kiếm","hoan kiem"]),
    VM_HoChiMinhCity: new Question(new GoogleMapsImage("10.784882948074642,106.7123749413786", 13, ["csnuZPkakOkdEOaNzJ5BUCZ5vOM=","6X-4J3twRJwfthwsx6WfBJiyE5k="]), "Ho Chi Minh City"),


    // Southern Asia

    // Afghanistan: AF
    AF_Kabul: new Question(new GoogleMapsImage("34.53543285351253,69.17978518015983", 13, ["sh02z-spPRIzDgXhmYF3zkA2Lk0=","sNISH2twCki_cRJyeIsER0UXNSc="]), "Kabul", ["kabul","کابل"]),

    // Bangladesh: BD
    BD_Dhaka: new Question(new GoogleMapsImage("Dhaka,BD", 12, ["PCxUEGIhvgy1IOVRzlBz6hsr3P0=","kj-EzjGSepayvjC9M9z-vHNbD78="]), "Dhaka", ["dhaka","ঢাকা"]),

    // Bhutan: BT
    BT_Thimphu: new Question(new GoogleMapsImage("27.465263737348632,89.64388811067192", 14, ["H-9pkihxDcy7o6UQLEizu6JO2UY=","Oc-Io0Lrievh9MX6wG1_touRea8="]), "Thimphu"),

    // India: IN
    IN_NewDelhi: new Question(new GoogleMapsImage("New Delhi,IN", 12, ["GlenEzLyNBPC5oP3-o_1km3UKXs=","mBwxZ5LHf2IjtLJxIXIsNRCG-WE="]), "New Delhi", ["new delhi","delhi","नई दिल्ली"]),
    IN_Mumbai: new Question(new GoogleMapsImage("19.018458330154452,72.84737658966236", 11, ["vtYzcatJo4d44O2D5Pn5Mo_QnXM=","YCLOek_-at3xjgDRS1c6LFV3Uro="]), "Mumbai", ["mumbai","मुंबई","bombay"]),
    IN_Kolkata: new Question(new GoogleMapsImage("Kolkata,IN", 12, ["qKuKihZmbsvyPc-BtFtH-r-sV8s=","y2qRfcDChjw-Os-jegsNXLWXCvU="]), "Kolkata", ["kolkata","কলকাতা]","calcutta"]),
    IN_Bangalore: new Question(new GoogleMapsImage("Bangalore,IN", 12, ["j-GHziCuaM3O8FgCO_54bvGCTH4=","PWWbyf7l_EuEWVkHaZmRgcBm1EU="]), "Bangalore", ["bangalore","bengaluru","ಬೆಂಗಳೂರು"]),
    IN_Chennai: new Question(new GoogleMapsImage("13.056120032397454,80.22524413963409", 12, ["lNlgvs9TuHAA0myne9CwNV9NwSQ=","Eqrwc5pcOzUUTtkyijfvutLD2ww="]), "Chennai"),
    IN_Hyderabad: new Question(new GoogleMapsImage("17.380947517427618,78.4372193845361", 12, ["hilqZwuXnWurPoChQ5a92ORPDqQ=","WefVPtkFfMdXA2HaRva4oTt6YSw="]), "Hyderabad", ["hyderabad","హైదరాబాద్"]),
    IN_Ahmedabad: new Question(new GoogleMapsImage("Ahmedabad,IN", 12, ["wzJGezARQbh83fTaGjq_S1ooZ_I=","gLUvh30QHCQzyw6ZK3V72sRqq0A="]), "Ahmedabad", ["ahmedabad","અમદાવાદ"]),
    IN_Surat: new Question(new GoogleMapsImage("21.187849578147176,72.84349334304075", 12, ["RfhQENg6-ERHwkIYOqGcU9FNajY=","op8yN0VVY5m7kdw-vhZ2XS2lgtQ="]), "Surat"),
    IN_Pune: new Question(new GoogleMapsImage("18.518462239367764,73.85518003902651", 13, ["yLhepH6zPQIq3zZv3s-ecI7vo_U=","Xp8-Rywgr0SZ76hgKKPw3vuMDWM="]), "Pune", ["pune","पुणे"]),

    // Iran: IR
    IR_Tehran: new Question(new GoogleMapsImage("Tehran,IR", 12, ["xkgs_FBDNdULfxPVCOcPqYgAacs=","78tS652PS33qW4gkVrGkjBKtrEc="]), "Tehran", ["tehran","تهران"]),

    // Maldives: MV
    MV_Male: new Question(new GoogleMapsImage("Malé,MV", 14, ["9mVU4vVUpkG-_PRwfxJSc0nPon0=","hE2HKJlYPyFQW0HoMoYA1YYx6_0="]), "Malé", ["male","malé"]),

    // Nepal: NP
    NP_Kathmandu: new Question(new GoogleMapsImage("Kathmandu,NP", 13, ["E6EuIaS4-9aP3wrO2lUKkmIpaRo=","PO9MXaoGdiZgPb6CbGP598SXZko="]), "Kathmandu", ["kathmandu","काठमाडौँ"]),

    // Pakistan: PK
    PK_Islamabad: new Question(new GoogleMapsImage("Islamabad,PK", 13, ["HnHqE99tuC0gQwsHlcdubj9cvr4=","3S6NBmWzwNiWRCS3_LPA2iT_4GM="]), "Islamabad", ["islamabad","اسلام آباد"]),
    PK_Karachi: new Question(new GoogleMapsImage("24.83105445375928,67.01892079364137", 13, ["lZG2yTDV4CbRetwxGefEVh8P9uo=","97TqVw-h-Z5wo3E7bhApg7wrYKg="]), "Karachi", ["karachi","کراچی"]),
    PK_Lahore: new Question(new GoogleMapsImage("Lahore,PK", 12, ["wzV_mBm69Ziqf2PV5224ySQdmWA=","ftspXoWLKtLn5xc25CHSVOgzWMA="]), "Lahore", ["lahore","لاہور"]),


    // Sri Lanka: LK
    // Sri Jayawardenepura Kotte is the de jure capital.
    LK_SriJayawardenepuraKotte: new Question(new GoogleMapsImage("Sri Jayawardenepura Kotte,LK", 13, ["-DMWeL-hQnjTKbbIO_DU_G_yyuQ=","Q7l1RatAwo8KP3YP6X7v1Q5SaMQ="]), "Sri Jayawardenepura Kotte"),
    
    // Africa

    // Northern Africa

    // Algeria: DZ
    DZ_Algiers: new Question(new GoogleMapsImage("36.73926126973858,3.1401109631321784", 12, ["FRUK2bm9YX1QkkoB1tMdKYfPkeU=","w4hNmY5H4Z7zHpiov-MqRyFHeiM="]), "Algiers", ["algiers","مدينة الجزائر"]),

    // Egypt: EG
    EG_Cairo: new Question(new GoogleMapsImage("Cairo,EG", 12, ["nbfMUcCt2bLn6GKPH8PrVgXbbdw=","06ES9299K5NFGROuSjmcqxmJa2A="]), "Cairo", ["cairo","القاهرة"]),
    EG_Alexandria: new Question(new GoogleMapsImage("Alexandria,EG", 12, ["BVM6bOCoK3ZzGVEr7P21FkTMuIg=","URiZaBpl9nzU8TaNzqp_EeTYU5Q="]), "Alexandria", ["alexandria","الإسكندرية"]),

    // Libya: LY
    LY_Tripoli: new Question(new GoogleMapsImage("Tripoli,LY", 13, ["MwFnJosrUdwrUBGJydk6diD1cJc=","ZwU7EgXE1_9k-N6USN9idjxzf_0="]), "Tripoli", ["tripoli","طرابلس"]),

    // Morocco: MA
    MA_Rabat: new Question(new GoogleMapsImage("33.9871202227261,-6.851317891285377", 12, ["L0LBlodXYBQb5sTXj6wixfIhW_M=","Mz4asLQ5PZwxJAPBg5VBitY4l_o="]), "Rabat", ["rabat","الرباط"]),

    // Sudan: SD
    SD_Khartoum: new Question(new GoogleMapsImage("15.55597653510002,32.55369784874869", 12, ["M7ejZOifIPpVM1HCgG2JjE8iSaI=","nEJcriWLpVtrCY-zSbPhNZ-UcKU="]), "Khartoum", ["khartoum","الخرطوم"]),

    // Tunisia: TN
    TN_Tunis: new Question(new GoogleMapsImage("Tunis,TN", 12, ["YnkRUTlDJCAJXuJsz3Ac5mAN-co=","ocx-Ak7ju84bfF4k307CkhE421U="]), "Tunis", ["tunis","تونس"]),


    // Western Africa

    // Benin: BJ
    BJ_PortoNovo: new Question(new GoogleMapsImage("6.48516716689515,2.625304061840653", 13, ["0YxtVDPtOPRtCEIQlRjmjsj7BSk=","tnVezAWAcEcvxevliuOSw5ouftQ="]), "Porto-Novo", ["porto-novo","porto novo"]),

    // Burkina Faso: BF
    BF_Ouagadougou: new Question(new GoogleMapsImage("Ouagadougou,BF", 13, ["wXczFgZMT56aOOOikqXZbJkXOts=","2mUZo61Ab-dWq8YNnNzMAusIYUY="]), "Ouagadougou"),

    // Cabo Verde: CV
    CV_Praia: new Question(new GoogleMapsImage("Praia,CV", 13, ["0jKYcPmqWRgf__NDNx9jZiY1l4A=","494i7ZX23cSNvMhfKNklDOrM-sM="]), "Praia"),

    // Côte d’Ivoire: CI
    CI_Yamoussoukro: new Question(new GoogleMapsImage("6.816708147354264,-5.275004023189095", 14, ["sSToBSTu56JlaaoekaKPQ32WnJ0=","Av6lcgIEGonSYd1ZrNDPRPkgBmY="]), "Yamoussoukro"),

    // Gambia: GM
    GM_Banjul: new Question(new GoogleMapsImage("Banjul,GM", 14, ["n53rkrNuTrc607JgH_Cf0eBefY0=","Kk6HV7alfQQ2DaZAaqj2cbgfpFQ="]), "Banjul"),

    // Ghana: GH
    GH_Accra: new Question(new GoogleMapsImage("Accra,GH", 12, ["hQrwsb40KlnEjBHcg0p096BU1Hw=","LyOIJ_KNFcoygFwf89vrYAAW9Qk="]), "Accra"),

    // Guinea: GN
    GN_Conakry: new Question(new GoogleMapsImage("Conakry,GN", 11, ["T4ihOMk895RscTlrbYcDiTOpfDA=","5UOsq_KwrcCw0sBcv9cMGlU-ScU="]), "Conakry"),

    // Guinea-Bissau: GW
    GW_Bissau: new Question(new GoogleMapsImage("11.867873053265104, -15.60862036773853", 13, ["uQG_0jKy08Hyhv00vSg5PbN2E_8=","ctMU_NOiS3JbtikCEIDZwZOyrdQ="]), "Bissau"),

    // Liberia: LR
    LR_Monrovia: new Question(new GoogleMapsImage("6.309849823376375,-10.773524344285931", 13, ["gq5t1KxowMpeZv31l95FdEjlFk0=","tIU4sQ-_T3EqvU9hpa9Tpa5LNnI="]), "Monrovia"),

    // Mali: ML
    ML_Bamako: new Question(new GoogleMapsImage("Bamako,ML", 13, ["NyQjDELL2KqJD33D9XW6tmYXA80=","yY93TuXU-c3MD3g84VM2C3QflDQ="]), "Bamako"),

    // Mauritania: MR
    MR_Nouakchott: new Question(new GoogleMapsImage("Nouakchott,MR", 12, ["VKzEbK7JHOrfX7mvzNmp4Hagf3w=","7IVSKwcerNUCuu-LjXMqCIpYcDg="]), "Nouakchott", ["nouakchott","نواكشوط"]),

    // Niger: NE
    NE_Niamey: new Question(new GoogleMapsImage("Niamey,NE", 12, ["_WK1yI5TSrHOQWBxS4G1r0k6ALY=","2-6qD_Pt1fGX6Fzd5VYaPNLQf-o="]), "Niamey"),

    // Nigeria: NG
    NG_Abuja: new Question(new GoogleMapsImage("Abuja,NG", 12, ["qI5Vb9_kB701_q70v-nM8nC7f4g=","xoJ63RxmshDbTFRmRHC3Xyj2RQQ="]), "Abuja"),
    NG_Lagos: new Question(new GoogleMapsImage("6.458513753352044,3.374406061531793", 12, ["pLJGlgmiHLVemfoRm-gRom_cwaI=","F6VyrY7gcdbhSE9KgfuxnWHtUAk="]), "Lagos"),

    // Senegal: SN
    SN_Dakar: new Question(new GoogleMapsImage("Dakar,SN", 12, ["loJBE-y53ycJACGP9WFx43eXof0=","W-sYIBY4_kxMI-ncwJ8c9iT2sp4="]), "Dakar"),

    // Sierra Leone: SL
    SL_Freetown: new Question(new GoogleMapsImage("Freetown,SL", 13, ["964eMYX262GoFxKyL5rGiWw21wg=","le3ckyJ-iAciIOcGFoVPXFjoi1A="]), "Freetown"),

    // Togo: TG
    TG_Lome: new Question(new GoogleMapsImage("6.1509180174696585,1.2354344368181667", 13, ["0z6Mbttp7vlhVeR5Rj5vYshFpdA=","gHy4DBXqv5NXNPSRnqTMNc1lqMc="]), "Lomé", ["lome","lomé"]),

    
    // Eastern Africa

    // Burundi: BI
    BI_Bujumbura: new Question(new GoogleMapsImage("-3.373164824280705,29.350021123852834", 13, ["9cllhPLVMLm90-e2nx6flQi0Q1w=","HsDfOqCNEtzAHc1i5JTE6SvYSW4="]), "Bujumbura"),

    // Comoros: KM
    KM_Moroni: new Question(new GoogleMapsImage("Moroni,KM", 14, ["DBArDtnYnT0a4HbhDvhgNAvKPSk=","hBJeoRZziroTzaXheTUcOpcC-Hk="]), "Moroni", ["moroni","موروني"]),

    // Djibouti: DJ
    DJ_Djibouti: new Question(new GoogleMapsImage("11.575614920149501,43.14547463687727", 13, ["bPw2xAbSfOi4NuM3scX3yliZGSQ=","izvG5l8CSZ8lvNP0i6lYBXtYJPo="]), "Djibouti", ["djibouti","جيبوتي‎"]),

    // Eritrea: ER
    ER_Asmara: new Question(new GoogleMapsImage("Asmara,ER", 13, ["phYCWDdmzsTAdNZvbEOD0U20xeg=","zeH8dKCMRtkIq6uPSuiEiCCnfJQ="]), "Asmara", ["asmara","أسمرة"]),

    // Ethiopia: ET
    ET_AddisAbaba: new Question(new GoogleMapsImage("8.998090061563595,38.7586823595628", 13, ["KjCtTpVUx9BeK6JkLOOYAjGiNbY=","oeY8pKbgmAs6x6KTsJ5KsS_vOZo="]), "Addis Ababa", ["addis ababa","አዲስ አበባ"]),

    // Kenya: KE
    KE_Nairobi: new Question(new GoogleMapsImage("-1.296606433683914,36.87531051469906", 13, ["oORVZg9xuyO6jY4ha9Xh17qHk4g=","lamQLqBiB0nTUZI6uY8Ar60hCBQ="]), "Nairobi"),

    // Madagascar: MG
    MG_Antananarivo: new Question(new GoogleMapsImage("-18.90602042991008,47.525082943685504", 13, ["2e1ADg4FeDbkLhnxyBL30TgoV2E=","keHpJzXXlefcKCYs5rEfLWUItog="]), "Antananarivo"),

    // Malawi: MW
    MW_Lilongwe: new Question(new GoogleMapsImage("Lilongwe,MW", 13, ["0tE5MI6fe1wg6KV_kVetHtA3glk=","W9yt-QfU4Y6Jij2Qfdyrr_xj0zI="]), "Lilongwe"),

    // Mauritius: MU
    MU_PortLouis: new Question(new GoogleMapsImage("Port Louis,MU", 13, ["fpznAk2D6gH5VJE4BdrrmOfR7fo=","Vm4Mkt1ALU0pw2FaGVRZaB91Rtg="]), "Port Louis"),

    // Mozambique: MZ
    MZ_Maputo: new Question(new GoogleMapsImage("-25.950029916473373,32.57564584938457", 13, ["J5C4NUHyJOOs0rJFgWsnz6GAVlQ=","XPBa1v2mcldNIQLpE3O_ePBO6f0="]), "Maputo"),

    // Rwanda: RW
    RW_Kigali: new Question(new GoogleMapsImage("Kigali,RW", 13, ["4hEjSICovlPms2EAZfAjwCPPiyM=","4zE9uV00ukDF9Jx8Lr9EkWa_LH4="]), "Kigali"),

    // Seychelles: SC
    SC_Victoria: new Question(new GoogleMapsImage("-4.621789319609552,55.45221620870077", 14, ["sWsHQRKXJU21qsGwArcitKDVaIo=","At36mNmUx2LZaKNzVanK6ko-X58="]), "Victoria"),

    // Somalia: SO
    SO_Mogadishu: new Question(new GoogleMapsImage("Mogadishu,SO", 13, ["kCf_iIz1vM0l7FWdbpta9OZkDTA=","jraeCemoWcSMkSbhgjH2FTsbNfA="]), "Mogadishu", ["mogadishu","مقديشو‎"]),

    // South Sudan: SS
    SS_Juba: new Question(new GoogleMapsImage("4.845323025795621,31.584501948261114", 13, ["89IIK-kFhMJ-btQv-UMQnP9p8Qs=","eo0sruduv5lM8V3HoNXwNhq6PnM="]), "Juba"),

    // Uganda: UG
    UG_Kampala: new Question(new GoogleMapsImage("Kampala,UG", 12, ["P0qxyRP-Vkcliuv92avnZnk9tyY=","8A2MRDmJGDtG0sK-RyplwMaPayE="]), "Kampala"),

    // Tanzania: TZ
    TZ_Dodoma: new Question(new GoogleMapsImage("Dodoma,TZ", 13, ["_7j7vq2KPVQ_9jRrn3JxbPxAtnA=","2GvbFfKTml7pm_l6r32Mn5f4Qn4="]), "Dodoma"),
    TZ_DarEsSalaam: new Question(new GoogleMapsImage("-6.816848511055588,39.2702996438777", 13, ["7CimlcD-1a3seEj1DixFEzFDvXo=","EGjnt4Y4_ExG-Xctzi9LKpk0Ww0="]), "Dar es Salaam"),
    
    // Zambia: ZM
    ZM_Lusaka: new Question(new GoogleMapsImage("Lusaka,ZM", 12, ["mEJBW-TUpm7mZ539sjjElmfpQY4=","QzQmVF7K6_WygKHedYH78-muizc="]), "Lusaka"),

    // Zimbabwe: ZW
    ZW_Harare: new Question(new GoogleMapsImage("-17.835952868614406,31.047554363505483", 13, ["lfaSMdikpTULhkITKO8oVuD92kY=","C8z0B4ReIrR3AWLa0t_rFP-VOak="]), "Harare"),


    // Middle Africa

    // Angola: AO
    AO_Luanda: new Question(new GoogleMapsImage("Luanda,AO", 12, ["hjjlMUPsQNzr4_80n8lQxY1wBaE=","HjTBytrlvaS9-PTPIe99W9Ksq-c="]), "Luanda"),
    
    // Cameroon: CM
    CM_Yaounde: new Question(new GoogleMapsImage("Yaounde,CM", 13, ["e6LJNfTkeve91H--0ApWUg9SyYU=","G_unu4-VX9Nmnk0Jov-zQ3QrO7U="]), "Yaounde"),

    // Central African Republic: CF
    CF_Bangui: new Question(new GoogleMapsImage("Bangui,CF", 12, ["hnh_MsO3OQIrTr4r3X9vNk-iUnU=","pJxhrtYOJZtlE_4s8SB2I1Qr0aM="]), "Bangui"),

    // Chad: TD
    TD_NDjamena: new Question(new GoogleMapsImage("N'Djamena,TD", 12, ["swbGqv-Y7-Lfdfi3wG3N8AakFTE=","_6-ccjjUTg_eZzlEwmEjdFO6HBU="]), "N'Djamena", ["n'djamena","n djamena","ndjamena","إنجامينا"]),

    // Congo: CG
    CG_Brazzaville: new Question(new GoogleMapsImage("-4.262187511720094,15.263287188216271", 13, ["VzwfTwt2DZK-B8v9hJEzJu5Upyc=","BjwT2IyJESgM8WMZOgzpYzEp5dQ="]), "Brazzaville"),

    // Democratic Republic of the Congo: CD
    CD_Kinshasa: new Question(new GoogleMapsImage("-4.333698257227162,15.300332974343227", 12, ["fWUEiju8biYek37qwwgUK05Ck6s=","WAFnrlwX_tuFoSyc2segtWt0yf4="]), "Kinshasa"),

    // Equatorial Guinea: GQ
    GQ_Malabo: new Question(new GoogleMapsImage("3.742103505929251,8.759836697860926", 13, ["V7DJxaxMHY5rN8vkkqlu5J2TFAg=","MiXiV9XGSAXPNlGHKnJyKTVfpxg="]), "Malabo"),

    // Gabon: GA
    GA_Libreville: new Question(new GoogleMapsImage("Libreville,GA", 13, ["n_cbVuL9RNSonOfGy6XtmVKr59Q=","Zyt65fP4AdlagxDfmaEXjiUT-Fg="]), "Libreville"),

    // Sao Tome and Principe: ST
    ST_SaoTome: new Question(new GoogleMapsImage("0.3428586466988996,6.728509430872581", 14, ["4_L10QrzXlyZIenGx55vL8hFJ2M=","xUh3BCMstJ1EJocVpWOKg61MR5o="]), "São Tomé", ["sao tome","são tomé"]),


    // Southern Africa

    // Botswana: BW
    BW_Gaborone: new Question(new GoogleMapsImage("-24.654771693952117,25.90730835256741", 12, ["80MHLcEIlUUiKl3jvAzNdl2VMu8=","dbeiALYbI79GDFwVDG-wsq-r1LQ="]), "Gaborone"),

    // Eswatini: SZ
    SZ_Mbabane: new Question(new GoogleMapsImage("-26.313610218571366,31.13370586001086", 13, ["mAdCQtR2kwrMJFUgOKnrj0ahGT4=","R8rNueZVhV5vc0xphcIQsF7XoYU="]), "Mbabane"),

    // Lesotho: LS
    LS_Maseru: new Question(new GoogleMapsImage("Maseru,LS", 13, ["GMZBJSuIaD6BZ8RBBcBqdk6WEuo=","a5oEL7ZfJrn6vHqS8ZPgHOiyqlU="]), "Maseru"),

    // Namibia: NA
    NA_Windhoek: new Question(new GoogleMapsImage("Windhoek,NA", 13, ["R2Ntj0buqEDlhmsOUbtIn-FfcUM=","lnf90J0834PXJh1C7h5DyYOVrv4="]), "Windhoek"),

    // South Africa: ZA
    ZA_CapeTown: new Question(new GoogleMapsImage("-33.9444999526873, 18.477117670821627", 12, ["IwoSccpmlMuoPlhFDcGXpPeu-n4=","JZZDsIPgPAAroqPvldvAgLxCC2M="]), "Cape Town"),
    ZA_Pretoria: new Question(new GoogleMapsImage("Pretoria,ZA", 13, ["5ZIXCdlN6e6UmOA8n4mWCz-UKB0=","EtNz4jYjO5btszJEtst0lVVDG4w="]), "Pretoria"),
    ZA_Bloemfontein: new Question(new GoogleMapsImage("-29.119225501787085,26.218450777331118", 13, ["UjFFz4q46uJ1pU4Hq3URbzOOtUo=","SiX26ZKyHQTLWdp7Dzwu2O8YcjE="]), "Bloemfontein"),
    ZA_Johannesburg: new Question(new GoogleMapsImage("Johannesburg,ZA", 12, ["PfK_WJ5y6d2JXnn4cDtRb4W3_x4=","T3Qf0_dMyQ4dhF3CCb2Wk57LeLQ="]), "Johannesburg"),

    // Oceania

    // Australia and New Zealand

    // Australia: AU
    AU_Canberra: new Question(new GoogleMapsImage("-35.29493269593273,149.1265014572204", 13, ["2VqFWwvc4vBBrEY8GciuV5Gz9SM=","Esl_AfsR0NJ_f-0VJ-zwcu9BiJY="]), "Canberra"),

    // New Zealand: NZ
    NZ_Wellington: new Question(new GoogleMapsImage("Wellington,NZ", 12, ["MhfOlEeXJDuK80bj5IXk0kY8t1M=","Xdm1qJEnSGjAJBVfLFH6sIZDKCU="]), "Wellington"),


    // Melanesia

    // Fiji: FJ
    FJ_Suva: new Question(new GoogleMapsImage("Suva,FJ", 13, ["z10BADxJ_F2_38N8HnitL9QQyx4=","Pnz3hBsB2l5tEb8BI2OYOfC4MMM="]), "Suva"),

    // Papua New Guinea: PG
    PG_PortMoresby: new Question(new GoogleMapsImage("-9.451710674016937,147.1865826797314", 13, ["FHlfEjE232lRcgMh4k75urPNCuA=","HYdPfHOklHL3uc5Uzry-B-5Lx2g="]), "Port Moresby"),

    // Solomon Islands: SB
    SB_Honiara: new Question(new GoogleMapsImage("Honiara,SB", 13, ["JKZDj-v7za2esKUOCBIBw6JBjdI=","OIhlfwHq4ASDx8hLewcDPYWKLDA="]), "Honiara"),

    // Vanuatu: VU
    VU_PortVila: new Question(new GoogleMapsImage("-17.741929902441512,168.31900200166007", 13, ["8Ip0OP8ly8kW2XE8lQM7OeEi3KY=","JalDp8iZO3BDzh3--BQlhhGPmjo="]), "Port Vila"),


    // Micronesia

    // Kiribati: KI
    KI_Tarawa: new Question(new GoogleMapsImage("1.3296169094142725,172.97830578844227", 15, ["ftszG-Dy4QwesPxosHt5zLVSp9A=","F3nwSBjh6rnFVS9fCVYzrFqDjpY="]), "Tarawa"),

    // Marshall Islands: MH
    MH_Majuro: new Question(new GoogleMapsImage("7.101525454351255,171.3286102860227", 13, ["L56SwS311rmLiJm4r9brfcFzeUA=","15xL6HZGI9z2N6GWci4z3LMIlgQ="]), "Majuro"),

    // Micronesia: FM
    FM_Palikir: new Question(new GoogleMapsImage("Palikir,FM", 15, ["gO59nG3WHxZkm2LBuCOvk78Ewvo=","PSVWiZK6oTMmhaTiv_vlnRUg7x8="]), "Palikir"),

    // Nauru: NR
    NR_Yaren: new Question(new GoogleMapsImage("Yaren,NR", 15, ["5Aa5hJRE-4OLMrNmrzMHcSq2UJc=","r7_4h2RQNDUe4NgjM7q7Tv9pbtg="]), "Yaren"),

    // Palau: PW
    PW_Ngerulmud: new Question(new GoogleMapsImage("Ngerulmud,PW", 15, ["hSCoYHvrpF4oZaSctS4LwX01H9I=","azhQTDRq4cwmHg3OQ2LmaaxyQMU="]), "Ngerulmud"),
    
    // Polynesia

    // Niue: NU
    NU_Alofi: new Question(new GoogleMapsImage("Alofi,NU", 15, ["WpuqTFxYCYyBEPQf7g8VWsByOY8=","_S6V2z8ZT48UJfBmZ5aYEe1-ZzM="]), "Alofi"),

    // Samoa: WS
    WS_Apia: new Question(new GoogleMapsImage("Apia,WS", 14, ["LUNKd_bOofOULTo7zdqhUsqym_I=","oLBYx7rHDU_cpe7GfS1CMu0xdTs="]), "Apia"),

    // Tokelau: TK
    TK_Nukunonu: new Question(new GoogleMapsImage("-9.201201872390989,-171.8478143549439", 16, ["dX6VGuvQt3KC09MkQu-bhz6Vfh8=","2HL0w-RnpL15JXTUDMnQ0tmn1-s="]), "Nukunonu"),

    // Tonga: TO
    TO_Nukualofa: new Question(new GoogleMapsImage("-21.140947029865778,-175.19662333758913", 15, ["_67_wlIXO5BHlh9EL6_n_rDJ_ls=","ljEoKKqvPyPp-j_68lJS94We0Sc="]), "Nuku'alofa", ["nuku'alofa","nukualofa","nuku alofa"]),

    // Tuvalu: TV
    TV_Funafuti: new Question(new GoogleMapsImage("Funafuti,TV", 15, ["o9ZcO1-W8e3h_T30qmD5i96yISM=","qzkQ-DeR9d5Z3Iyi2RDa71TMr8w="]), "Funafuti"),
};

// Airports
let Airports = {
    // Use ICAO code for naming. Do not accept city name if it has multiple airports.
    // Source: https://en.wikipedia.org/wiki/List_of_busiest_airports_by_passenger_traffic, 2019 statistics

    KATL: new Question(new GoogleMapsImage("KATL", 13, ["fyufqT-tYrIoMZTHrK8QrLPdLoM=","NsSWGPMkmGeP_ZuokWZPVOCythU="]), "Hartsfield–Jackson Atlanta International Airport", ["hartsfield–jackson atlanta international airport","hartsfield jackson atlanta international airport","hartsfield–jackson","hartsfield jackson","hartsfield jackson airport","hartsfield-jackson airport","hartsfield jackson atlanta airport","hartsfield-jackson atlanta airport","hartsfield jackson international airport","hartsfield-jackson international airport"]),
    ZBAA: new Question(new GoogleMapsImage("ZBAA", 12, ["YQtMT22NlOgwVVf0cR-9RvqMKSw=","ofDN5N76GvN6KEXvrp86igTSrLw="]), "Beijing Capital International Airport", ["beijing capital international airport","北京首都国际机场","beijing capital","beijing capital airport","beijing capital international"]),
    KLAX: new Question(new GoogleMapsImage("KLAX", 13, ["5aOThvormw26oUVEd1T67s4Mv50=","qAUyvNVh39HuLieN6ToiLIMK0gQ="]), "Los Angeles International Airport", ["lax","los angeles international airport","los angeles","los angeles airport","los angeles international"]),
    OMDB: new Question(new GoogleMapsImage("25.253563061529135,55.36537276449742", 13, ["YN-FMfgtdCFl4ueX0L3zVAqiUYU=","Js3IOd2ypC76T8nQt4ipGdJAUaM="]), "Dubai International Airport", ["dubai international airport","dubai international","مطار دبي الدولي","maṭār dubayy al-duwalī"]),
    RJTT: new Question(new GoogleMapsImage("35.54600449454058,139.78203312880984", 13, ["pfZnDT37hgaxjY-e-tjtgUrVmck=","LdlInwARsBhztLdGBhEH4nvEC2I="]), "Tokyo Haneda Airport", ["tokyo haneda airport","tokyo haneda","haneda","haneda airport","tokyo international","tokyo international airport","東京国際空港","tōkyō kokusai kūkō"]),
    KORD: new Question(new GoogleMapsImage("ohare", 12, ["-MXSftLAos8IUbgLuuWHBlOmQ3g=","RefpDUuhHeqUXTYyO_DyBacC2Ms="]), "O'Hare International Airport", ["o'hare international airport","ohare international airport","o hare international airport","chigaco o'hare international airport","chigaco ohare international airport","chigaco o hare international airport","o'hare international","ohare international","o hare international","chigaco o'hare international","chigaco ohare international","chigaco o hare international","o'hare airport","ohare airport","o hare airport","chigaco o'hare airport","chigaco ohare airport","chigaco o hare airport","o'hare","ohare","o hare","chigaco o'hare","chigaco ohare","chigaco o hare"]),
    EGLL: new Question(new GoogleMapsImage("EGLL", 13, ["VUfpncglXypBNiX58meY2LQHgXk=","wUWarv9Qi_hU69dO50S13bKCWRY="]), "London Heathrow Airport", ["london heathrow airport","london heathrow","heathrow","heathrow airport"]),
    ZSPD: new Question(new GoogleMapsImage("ZSPD", 13, ["XHhr8bCCwLa4AgwmJ8scyJAbul0=","kCqODjkJcYJvJSlL3UtyT3zU1ic="]), "Shanghai Pudong International Airport", ["shanghai pudong international airport","上海浦东国际机场","shanghai pudong","shanghai pudong airport","shanghai pudong international","pudong airport","pudong international"]),
    LFPG: new Question(new GoogleMapsImage("49.00819371756938,2.5525023379342597", 13, ["ueD-Rg0JoqLmvq6v48yAv43ugxI=","TqyHLYLQWyfpVf_dtl_sR9Xe9Jc="]), "Charles de Gaulle Airport", ["charles de gaulle airport","paris charles de gaulle airport","charles de gaulle","paris charles de gaulle"]),
    KDFW: new Question(new GoogleMapsImage("32.89464490686801,-97.03988406385157", 13, ["5-bRLv4l5RVJkmBrl_NekFwOAYA=","uqmQppHdETbGtZ4QVmLX8MxtE7Q="]), "Dallas/Fort Worth International Airport", ["dallas/fort worth international airport","dallas-fort worth international airport","dallas fort worth international airport","dallas/fort worth international","dallas-fort worth international","dallas fort worth international","dallas/fort worth airport","dallas-fort worth airport","dallas fort worth airport","dallas/fort worth","dallas-fort worth","dallas fort worth"]),
    ZGGG: new Question(new GoogleMapsImage("ZGGG", 13, ["BZ4v818pqZfG8ChfSPG6ZZvIrxg=","MrR6BESwygcXIVtxvljZnaNgWK4="]), "Guangzhou Baiyun International Airport", ["guangzhou baiyun international airport","guangzhou baiyun international","guangzhou baiyun airport","guangzhou baiyun","广州白云国际机场","baiyun international","baiyun airport"]),
    EHAM: new Question(new GoogleMapsImage("52.320323328309485,4.741811511431359", 12, ["oKyRIkaKKTMsBfAtNLYqkqnvlUQ=","fIO3vaOW-0cPYciVucwVInbVZ-A="]), "Amsterdam Airport Schiphol", ["amsterdam airport schiphol","amsterdam schiphol airport","schiphol","schiphol airport","koninklijke luchthaven schiphol"]),
    VHHH: new Question(new GoogleMapsImage("VHHH", 13, ["ldzKVFTG2CmeJelz9MYrKO70new=","wP0WkJM7TW857vsVPtbBHjiq1ME="]), "Hong Kong International Airport", ["hong kong international airport","hong kong airport","hong kong international","香港國際機場","hēunggóng gwokjai gēichèuhng","chek lap kok international airport","chek lap kok international","chek lap kok airport","chek lap kok","hong kong chek lap kok international airport","hong kong chek lap kok international","hong kong chek lap kok airport","hong kong chek lap kok"]),
    RKSI: new Question(new GoogleMapsImage("RKSI", 12, ["d5QbgKA7b5dYlAOEylM6Pi7Q9sk=","UDD6j3QFDmvJMukpqQe0mep5moM="]), "Seoul Incheon International Airport", ["seoul incheon international airport","seoul incheon airport","seoul incheon international","seoul incheon","seoul-incheon international airport","seoul-incheon airport","seoul-incheon international","seoul-incheon","incheon airport","incheon international airport","incheon","인천국제공항"]),
    EDDF: new Question(new GoogleMapsImage("EDDF", 12, ["8uar6LVufx2Ybxt3jo-nDEe7wdo=","kMayhUvMtjvMuurUdmxICt86fEo="]), "Frankfurt Airport", ["frankfurt airport","frankfurt","flughafen frankfurt am main","franfurt am main","frankfurt am main airport","rhein-main-flughafen","rhein main flughafen"]),
    KDEN: new Question(new GoogleMapsImage("KDEN", 12, ["0TF0FNF49uJEVBGNpxrXQXt8yFo=","mXxUznLNoAqC0pP1hQOvj1WkDOg="]), "Denver International Airport", ["denver international airport","denver airport","denver international","denver","dia"]),
    VIDP: new Question(new GoogleMapsImage("VIDP", 13, ["W9D2mRzX3OY5YXeeRn4JDO00ey8=","jMxq8jWBPapjG-4eyItNEnnk6xY="]), "Indira Gandhi International Airport", ["indira gandhi international airport","indira gandhi international","indira gandhi airport","indira gandhi","delhi indira gandhi international airport","delhi indira gandhi international","delhi indira gandhi airport","delhi indira gandhi","delhi international airport"]),
    WSSS: new Question(new GoogleMapsImage("1.3467976484563196,103.99807420214171", 13, ["QiK8ZQOMJ4a7Kyw4Y_gCQ6oM7k8=","h7IkqYygTmIK3IzK4dsttafwpWk="]), "Singapore Changi Airport", ["singapore changi airport","singapore changi","changi"]),VTBS: new Question(new GoogleMapsImage("13.679618041051208,100.74727655160284", 13, ["YJmHI6NtXtfUH8hQ9VeTsGjcVHA=","CQdRrBISAIItmScpodvn_FBqPl8="]), "Suvarnabhumi Airport", ["suvarnabhumi airport","bangkok suvarnabhumi airport","ท่าอากาศยานสุวรรณภูมิ","tha-akatsayan suwannaphum"]),
    KJFK: new Question(new GoogleMapsImage("KFJK Airport", 13, ["Mcyj1us0Gsik7IA_Q1QMS2i0Mc0=","-H5BDf6O_ZoeKAJuddwIxbwHwLc="]), "John F. Kennedy International Airport", ["john f. kennedy international airport","john f kennedy international airport","jfk international airport","john f. kennedy airport","john f kennedy airport","jfk airport","john f. kennedy international","john f kennedy international","jfk international","jfk","new york john f. kennedy international airport","new york john f kennedy international airport"]),
    WMKK: new Question(new GoogleMapsImage("WMKK", 12, ["xFMlFJZEUA6pRW2ALDPDld-3IUc=","BevDTh9y0EjHun2FnhlGM5JzTNo="]), "Kuala Lumpur International Airport", ["kuala lumpur international airport","kuala lumpur international","kuala lumpur airport","kuala lumpur","lapangan terbang antarabangsa kuala lumpur"]),
    LEMD: new Question(new GoogleMapsImage("LEMD", 12, ["Mz2adi8inZnJp5APPjBvt4Y2Nws=","6hNSRMOz-Rg6tSrlINKN7katu0Q="]), "Adolfo Suárez Madrid–Barajas Airport", ["adolfo suárez madrid–barajas airport","adolfo suarez madrid–barajas airport","adolfo suárez madrid barajas airport","adolfo suarez madrid barajas airport","madrid barajas airport","barajas airport","madrid barajas","barajas","aeropuerto adolfo suárez madrid-barajas","aeropuerto adolfo suárez madrid barajas"]),  
    KSFO: new Question(new GoogleMapsImage("KSFO", 13, ["PeBcQGFV3VV2Sc7sBN6FxOwBXPU=","PbDB-BBJYWXpKQLkISfaLjBssqo="]), "San Francisco International Airport", ["san francisco international airport","san francisco international","san francisco airport","san francisco"]),
    ZUUU: new Question(new GoogleMapsImage("ZUUU", 12, ["AcnfLsvikkaR9BwwJhiUYZbsI2M=","1Erv5cOSyOnb8DOEtBAvLEt9BG4="]), "Chengdu Shuangliu International Airport", ["chengdu shuangliu international airport","chengdu shuangliu international","chengdu shuangliu airport","chengdu shuangliu","shuangliu international airport","shuangliu international","shuangliu airport","shuangliu","成都双流国际机场"]),
    WIII: new Question(new GoogleMapsImage("-6.125623782040683,106.65491525623737", 13, ["sp1AVygjRo8Jz58Tmt_mGAjJzXg=","Ou0_4otNKK6cxT4q-bFpKqUSJFQ="]), "Soekarno–Hatta International Airport", ["soekarno–hatta international airport","soekarno hatta international airport","soekarno–hatta international","soekarno hatta international","soekarno–hatta airport","soekarno hatta airport","soekarno–hatta","soekarno hatta","jakarta soekarno–hatta international airport","jakarta soekarno hatta international airport","jakarta soekarno–hatta international","jakarta soekarno hatta international","jakarta soekarno–hatta airport","jakarta soekarno hatta airport","jakarta soekarno–hatta","jakarta soekarno hatta","bandar udara internasional soekarno–hatta"]),
    ZGSZ: new Question(new GoogleMapsImage("ZGSZ", 13, ["jlnubd8eG6md4RUr8N3XlVqOJOs=","717c5XOMz6Aur-XgHS7VloNmYK4="]), "Shenzhen Bao'an International Airport", ["shenzhen bao'an international airport","shenzhen baoan international airport","shenzhen bao an international airport","shenzhen bao'an international","shenzhen baoan international","shenzhen bao an international","shenzhen bao'an international","shenzhen baoan international","shenzhen bao an international","shenzhen bao'an","shenzhen baoan","shenzhen bao an","bao'an","baoan","bao an","深圳宝安国际机场"]),
    LEBL: new Question(new GoogleMapsImage("LEBL,ES", 12, ["rwsU8kI1a_o9ur_ePMUGguhs0TQ=","erjCb2fMkSTN8Dc92bQc4mhGxio="]), "Josep Tarradellas Barcelona–El Prat Airport", ["josep tarradellas barcelona–el prat airport","josep tarradellas barcelona–el prat","josep tarradellas barcelona el prat airport","josep tarradellas barcelona el prat","el prat airport","el prat","barcelona el prat airport","barcelona el prat","aeropuerto josep tarradellas barcelona–el prat","aeropuerto josep tarradellas barcelona el prat","aeroport josep tarradellas barcelona–el prat","aeroport josep tarradellas barcelona el prat"]),
    LTFM: new Question(new GoogleMapsImage("LTFM", 12, ["oQkjDf9T_asACPPbnXKtH0Qs3LA=","jmK2-JxFwBMN7RsUMPeAnXXWXzU="]), "Istanbul Airport", ["istanbul airport","i̇stanbul havalimanı","i̇stanbul airport","istanbul","i̇stanbul"]),
    KSEA: new Question(new GoogleMapsImage("KSEA", 13, ["6oQXDCW930fT1Z8_haRZR5LW1nw=","ov63TEtDj-qx3VVfbM4PBz2ItgA="]), "Seattle-Tacoma International Airport", ["seattle-tacoma international airport","seattle tacoma international airport","seattle-tacoma international","seattle tacoma international","seattle-tacoma airport","seattle tacoma airport","seattle-tacoma","seattle tacoma","sea-tac international airport","seatac international airport","sea tac international airport","sea-tac airport","seatac airport","sea tac airport","sea-tac international","seatac international","sea tac international","sea-tac","seatac","sea tac"]),
    KLAS: new Question(new GoogleMapsImage("McCarran", 13, ["q1aASGTUI5OnmN60LsOf8FuoWQo=","L725_Gv6bbdsSa-P2e_k2v8GJx0="]), "McCarran International Airport", ["mccarran international airport","mccarran international","mccarran airport","mccarran","las vegas mccarran international airport","las vegas mccarran international","las vegas mccarran airport","las vegas mccarran"]),
    KMCO: new Question(new GoogleMapsImage("28.431572676560855,-81.30864646123979", 13, ["7EVqrRSWkmDqBU6bfrMfMnuviJI=","oRZb_gVeN1taS2kvw5zvYAMpsPE="]), "Orlando International Airport", ["orlando international airport","orlando international","orlando airport","orlando"]),
    CYYZ: new Question(new GoogleMapsImage("CYYZ", 13, ["Xf_Y4Q8tH-sgez3R764g-TKcMF8=","bGHg1Rt-ye3eFYEIBS5FqTTsE4g="]), "Toronto Pearson International Airport", ["toronto pearson international airport","toronto pearson international","toronto pearson airport","toronto pearson","pearson"]),
    MMMX: new Question(new GoogleMapsImage("MMMX", 14, ["iQmQvQi6VAis-omwVtTLu5ckmfE=","tP_LnAI_5Be8JzUw0Ns4LUVAzxg="]), "Benito Juárez International Airport", ["benito juárez international airport","benito juarez international airport","benito juárez international","benito juarez international","benito juárez airport","benito juarez airport","benito juárez","benito juarez","mexico city international airport","mexico city international","mexico city airport","mexico city international airport","aeropuerto internacional de la ciudad de méxico","aeropuerto internacional de la ciudad de mexico"]),
    KCLT: new Question(new GoogleMapsImage("KCLT", 13, ["nhsA9UvULh7T8HW1PjT6EuPVL6Y=","mhsV6dgoAKURGeLpKFZE4Kvfjis="]), "Charlotte Douglas International Airport", ["charlotte douglas international airport","charlotte douglas international","charlotte douglas airport","charlotte douglas","douglas","douglas international","douglas airport","douglas international airport"]),
    UUEE: new Question(new GoogleMapsImage("UUEE", 12, ["wU7GQLz_qilYqQJbZ2mPmeUjri4=","_VTjtNFjdZsnRJlTl6nN2jz1G44="]), "Sheremetyevo International Airport", ["sheremetyevo international airport","sheremetyevo alexander s. pushkin international airport","sheremetyevo alexander s pushkin international airport","sheremetyevo international","sheremetyevo airport","sheremetyevo","moscow sheremetyevo international airport","moscow sheremetyevo international","moscow sheremetyevo airport","moscow sheremetyevo","международный аэропорт шереметьево","mezhdunarodny aeroport sheremetyevo"]),
    RCTP: new Question(new GoogleMapsImage("RCTP", 13, ["1JCASXMxOoLam0NWCaKJ0oQbFts=","KEPzjqUdH5lX0SVbqEFzXi8J32g="]), "Taiwan Taoyuan International Airport", ["taiwan taoyuan international airport","taiwan taoyuan international","taiwan taoyuan airport","taiwan taoyuan","taoyuan international airport","taoyuan international","taoyuan airport","taoyuan","臺灣桃園國際機場"]),
    ZPPP: new Question(new GoogleMapsImage("25.111585597478516,102.93677083107897", 13, ["aGWylDB80czXMT7VWUFxpoy_v0M=","C8y6nk21r6pstVENHADYXejZJUo="]), "Kunming Changshui International Airport", ["kunming changshui international airport","kunming changshui international","kunming changshui airport","kunming changshui","chanshui","昆明长水国际机场"]),
    EDDM: new Question(new GoogleMapsImage("48.353842749948164,11.777069256843033", 13, ["CHi7gnshzwFdqVPs3aBVAZMwTnE=","wUF8fGOXPOu6B8V3a3EPM0iZNF4="]), "Munich Airport", ["munich airport","munich","flughafen münchen"]),
    RPLL: new Question(new GoogleMapsImage("RPLL", 14, ["BvwTJ33R0CuPciXG3XaqrX-J-6c=","by7lQfmhQ2BNaRJaS7Vto3xMIsI="]), "Ninoy Aquino International Airport", ["naia","ninoy aquino international airport","ninoy aquino international","ninoy aquino airport","ninoy aquino","manila ninoy aquino international airport","manila ninoy aquino international","manila ninoy aquino airport","manila ninoy aquino","paliparang pandaigdig ng ninoy aquino"]),
    ZLXY: new Question(new GoogleMapsImage("ZLXY", 13, ["VmY9LfjVNby6EN1IbEbeRky0tdk=","rN5jjchpKYHMNCUSInzCXmHXGKU="]), "Xi'an Xianyang International Airport", ["xi'an xianyang international airport","xian xianyang international airport","xi an xianyang international airport","xi'an xianyang international","xian xianyang international","xi an xianyang international","xi'an xianyang airport","xian xianyang airport","xi an xianyang airport","xi'an xianyang","xian xianyang","xi an xianyang","xianyang","西安咸阳国际机场"]),
    VABB: new Question(new GoogleMapsImage("19.08917587720558,72.86605945225101", 14, ["eXACvZu8b1nQSnlYZ_PNx1AElh0=","qvsdbKTAf1MSg5kFI-vz2hvSy5M="]), "Chhatrapati Shivaji Maharaj International Airport", ["chhatrapati shivaji maharaj international airport","chhatrapati shivaji maharaj international","chhatrapati shivaji maharaj airport","chhatrapati shivaji maharaj","chhatrapati shivaji international airport","chhatrapati shivaji international","chhatrapati shivaji airport","chhatrapati shivaji","mumbai chhatrapati shivaji maharaj international airport","mumbai chhatrapati shivaji maharaj international","mumbai chhatrapati shivaji maharaj airport","mumbai chhatrapati shivaji maharaj","छ्त्रपती शिवाजी महाराज अंतरराष्ट्रीय विमानतळ"]),
    EGKK: new Question(new GoogleMapsImage("EGKK", 13, ["VBhgJd7EECg99ocVoAMNI7ABNQw=","Z_4JOoscc3_O_3mDVZvFY2bajwc="]), "London Gatwick Airport", ["london gatwick airport","london gatwick","gatwick airport","gatwick"]),
    KEWR: new Question(new GoogleMapsImage("KEWR", 13, ["k10dHBCV367ZcX59prHLj-WhZLw=","KPTp5zx20CrS-wMKSr9IpQJm11o="]), "Newark Liberty International Airport", ["newark liberty airport","newark liberty international airport","newark liberty airport","newark liberty international airport","newark liberty","newark liberty international"]),
    KPHX: new Question(new GoogleMapsImage("KPHX", 14, ["fsnWibbT4Nqhc11DjUWpFiFTmoo=","aksKqxNo-Nvn9vvPVDGNb7JPELA="]), "Phoenix Sky Harbor International Airport", ["phoenix sky harbor international airport","phoenix sky harbor international","phoenix sky harbor airport","phoenix sky harbor","sky harbor"]),
    KMIA: new Question(new GoogleMapsImage("25.795655579855882,-80.29073522124654", 14, ["KDm7picORHCW5qOJXmRuOvlfezw=","a3-3NHTz34JPF_zSBHWe05K6uMM="]), "Miami International Airport", ["miami international airport","miami airport","miami international","miami"]),
    ZSSS: new Question(new GoogleMapsImage("ZSSS", 13, ["5yczawqE1uQLOFwkxIKmoT1DhxI=","Va9pRdAxfCHqEsMqVQmBO5zv-qY="]), "Shanghai Hongqiao International Airport", ["shanghai hongqiao international airport","shanghai hongqiao international","shanghai hongqiao airport","shanghai hongqiao","hongqiao international airport","hongqiao international","hongqiao airport","hongqiao","上海虹桥国际机场"]),
    KIAH: new Question(new GoogleMapsImage("29.98154995529113,-95.34263809478834", 13, ["fXMVV18-jkkmFRz-hIP1E4Xdg8E=","txZqTr2SLeWgi47bNTHD6LGu1sE="]), "George Bush Intercontinental Airport", ["george bush intercontinental airport","george bush intercontinental","george bush airport","george bush","houston george bush intercontinental airport","houston george bush intercontinental","houston george bush airport","houston george bush"]),
    ZUCK: new Question(new GoogleMapsImage("29.720503518005977,106.65188254213233", 13, ["13c-Trl0p9lJI0-iGUW3DW8ZfjA=","NV3SOlcaLx2WUVmqYjbMW5fdytI="]), "Chongqing Jiangbei International Airport", ["chongqing jiangbei international airport","chongqing jiangbei international","chongqing jiangbei airport","chongqing jiangbei","jiangbei international airport","jiangbei international","jiangbei airport","jiangbei","重庆江北国际机场"]),
    YSSY: new Question(new GoogleMapsImage("-33.94817760209671,151.17713012823387", 13, ["ZTAhelEEiotxJ9YiKgotj2t5SRc=","x1rHX23ZvxNkwXkoUu-HCoMsiCk="]), "Sydney Kingsford-Smith Airport", ["sydney kingsford-smith airport","sydney kingsford smith airport","sydney kingsford-smith","sydney kingsford smith","kingsford-smith airport","kingsford smith airport","kingsford-smith","kingsford smith"]),
    RJAA: new Question(new GoogleMapsImage("RJAA", 12, ["crKBgCL0paWiODmDO_43s-E8hiM=","tSY1bpH1NIyCGId6kXK4OD92kuU="]), "Narita International Airport", ["narita international airport","narita international","narita airport","narita","成田国際空港","narita kokusai kūkō"]),
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
            Cities.NO30_Ski,
            Cities.NO18_MoIRana
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
    "europelargest": {
        FormatName: "50 largest cities in Europe",
        Cities: [
            Cities.RUMOW_Moscow,
            Cities.GBENG_London,
            Cities.RU_SaintPetersburg,
            Cities.DEBE_Berlin,
            Cities.ESMD_Madrid,
            Cities.UAKV_Kyiv,
            Cities.ITRM_Rome,
            Cities.FRIDF_Paris,
            Cities.ROB_Bucharest,
            Cities.BYHM_Minsk,
            Cities.HUBU_Budapest,
            Cities.DE_Hamburg,
            Cities.PLMZ_Warsaw,
            Cities.AT9_Vienna,
            Cities.ES_Barcelona,
            Cities.UA_Kharkiv,
            Cities.RU_Novosibirsk,
            Cities.RU_Yekaterinburg,
            Cities.RU_NizhnyNovgorod,
            Cities.RS00_Belgrade,
            Cities.DE_Munich,
            Cities.IT_Milan,
            Cities.CZ10_Prague,
            Cities.DK84_Copenhagen,
            Cities.BG22_Sofia,
            Cities.RU_Samara,
            Cities.RU_Omsk,
            Cities.RU_Kazan,
            Cities.RU_RostovnaDonu,
            Cities.RU_Chelyabinsk,
            Cities.RU_Ufa,
            Cities.UA_Dnipro,
            Cities.UA_Donetsk,
            Cities.IEL_Dublin,
            Cities.BEBRU_Brussels,
            Cities.RU_Volgograd,
            Cities.UA_Odessa,
            Cities.GB_Birmingham,
            Cities.RU_Perm,
            Cities.DE_Cologne,
            Cities.IT_Naples,
            Cities.RU_Krasnoyarsk,
            Cities.IT_Turin,
            Cities.GB_Liverpool,
            Cities.RU_Saratov,
            Cities.RU_Voronezh,
            Cities.ES_Valencia,
            Cities.UA_Zaporizhia,
            Cities.FR_Marseille,
            Cities.PL_Lodz
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
            Cities.TO_Nukualofa,
            Cities.BT_Thimphu,
            Cities.TV_Funafuti,
            Cities.NP_Kathmandu,
            Cities.TW_Taipei
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
            Cities.BT_Thimphu,
            Cities.NP_Kathmandu,
            Cities.TW_Taipei
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
            Cities.BT_Thimphu,
            Cities.NP_Kathmandu,
            Cities.TW_Taipei
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
            Cities.TO_Nukualofa,
            Cities.TV_Funafuti
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
    },
    "airports": {
        FormatName: "The 50 largest passenger airports in the world",
        Cities: Object.values(Airports)
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
        LastAnswer = null;

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
        document.getElementById("questionimage").src = this.QuestionsToAsk[Index].Image.getImageURL();

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
        }

        // Register a keydown event
        document.addEventListener("keydown", EnterEventSubmit);

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
        // Destroy the keydown event
        document.removeEventListener("keydown", EnterEventSubmit);

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

        // Logging for summary
        this.Log[this.Round].WasCorrect = true;

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
            // Destroy the keydown event
            document.removeEventListener("keydown", EnterEventSubmit);

            // Update modal data
            document.getElementById("IncorrectModalPoints").textContent = this.Points;
            document.getElementById("IncorrectModalCorrectAnswer").textContent = this.QuestionsToAsk[this.Round].FormatName;
            document.getElementById("IncorrectModalUserAnswer").textContent = UserAnswer;

            // Logging for summary
            this.Log[this.Round].WasCorrect = false;

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
            LastAnswer = null;

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
            document.getElementById("SummaryPerRound").innerHTML += `<div class="col-12 col-md-6 col-xxl-4"><h5>Round ${i + 1}</h5><div class="d-flex justify-content-between flex-column flex-md-row"><p>Time spent: ${FormatDateDifference(this.Log[i].EndTime, this.Log[i].StartTime)}<br>Your answer: ${SummaryFormatArray(this.Log[i].Answers, this.Log[i].WasCorrect)}<br>Correct answer: ${this.QuestionsToAsk[i].FormatName}${AttemptCounter}</p><img class="img-fluid" src="${this.QuestionsToAsk[i].Image.getThumbnailURL()}"></div></div>`;
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
    if (Event.code == "Enter" || Event.code == "NumpadEnter") {
        // Hide modals
        CorrectModal.hide();
        IncorrectModal.hide();

        // Progress to next question
        ActiveQuiz.NextQuestion();
    }
}

// Submit multiple choice on enter
function EnterEventSubmit(Event) {
    if (Event.code == "Enter" || Event.code == "NumpadEnter") {
        // Check what input mode is used
        if (ActiveQuiz.IsMultipleChoice) {
            // Submit answer
            ActiveQuiz.SubmitAnswer(document.getElementById('mcform').elements['mc'].value)
        }
        else {
            let Answer = document.getElementById("cityinput").value;
            if (Answer != LastAnswer && Answer) {
                LastAnswer = Answer;
                ActiveQuiz.SubmitAnswer(Answer);
            }
        }
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
function SummaryFormatArray(Array, WasRight) {
    // Format each element according to WasRight
    
    let LastWrongIndex = Array.length - 1;

    // Sanitize and wrap last element in text-success if right
    if (WasRight) {
        Array[Array.length - 1] = `<span class="text-success">${Array[Array.length - 1].replace("<", "&lt;").replace(">", "&gt;")}</span>`;
        LastWrongIndex--;
    }

    // Iterate through array, formatting each answer within range with text-danger
    for (let i = LastWrongIndex; i > -1; i--) {
        Array[i] = `<span class="text-danger">${Array[i].replace("<", "&lt;").replace(">", "&gt;")}</span>`;
    }

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
