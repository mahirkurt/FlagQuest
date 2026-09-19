export interface Country {
  code: string;
  name: string;
  capital: string;
  region: string;
  funFact: string;
}

export const countries: Country[] = [
  // --- AVRUPA (44 BM Üyesi + 1 Gözlemci) ---
  {
    code: 'de',
    name: 'Almanya',
    capital: 'Berlin',
    region: 'Avrupa',
    funFact: "Almanya'da otoyolların (Autobahn) büyük kısmında hız sınırı yoktur ve ülkede 1.000'den fazla sosis çeşidi üretilir."
  },
  {
    code: 'ad',
    name: 'Andorra',
    capital: 'Andorra la Vella',
    region: 'Avrupa',
    funFact: "Resmi dili Katalanca olan dünyadaki tek bağımsız devlettir ve ordusu bulunmayan ender ülkelerdendir."
  },
  {
    code: 'al',
    name: 'Arnavutluk',
    capital: 'Tiran',
    region: 'Avrupa',
    funFact: "Arnavutluk'ta kafayı yukarı aşağı sallamak 'hayır', sağa sola sallamak ise 'evet' anlamına gelir."
  },
  {
    code: 'at',
    name: 'Avusturya',
    capital: 'Viyana',
    region: 'Avrupa',
    funFact: "1752 yılında Viyana'da kurulan Tiergarten Schönbrunn, dünyanın halen faal olan en eski hayvanat bahçesidir."
  },
  {
    code: 'by',
    name: 'Belarus',
    capital: 'Minsk',
    region: 'Avrupa',
    funFact: "Avrupa'nın son ilkel bakir yağmur ormanı olan Belovezhskaya Pushcha'ya ve dev Avrupa bizonlarına ev sahipliği yapar."
  },
  {
    code: 'be',
    name: 'Belçika',
    capital: 'Brüksel',
    region: 'Avrupa',
    funFact: "Tarihteki ilk basılı gazete 1605 yılında Anvers kentinde basılmıştır ve dünyada kişi başına en çok çikolata üretilen yerlerdendir."
  },
  {
    code: 'gb',
    name: 'Birleşik Krallık',
    capital: 'Londra',
    region: 'Avrupa',
    funFact: "İngiltere'de tüm pasaportlar hükümdar adına düzenlendiği için Kral veya Kraliçe'nin pasaporta sahip olmasına gerek yoktur."
  },
  {
    code: 'ba',
    name: 'Bosna-Hersek',
    capital: 'Saraybosna',
    region: 'Avrupa',
    funFact: "Başkenti Saraybosna, 1885 yılında Avrupa kıtasında tüm gün kesintisiz hizmet veren ilk elektrikli tramvay hattına sahip olmuştur."
  },
  {
    code: 'bg',
    name: 'Bulgaristan',
    capital: 'Sofya',
    region: 'Avrupa',
    funFact: "Dünya gül yağı ihtiyacının neredeyse yarısını karşılayan Gül Vadisi'ne ev sahipliği yapar ve yoğurdun mayalandığı özel bakteriye adını vermiştir."
  },
  {
    code: 'cz',
    name: 'Çekya',
    capital: 'Prag',
    region: 'Avrupa',
    funFact: "Kişi başına dünyada en çok bira tüketilen ülkedir ve Prag'da 1410'dan beri çalışan dünyanın en eski astronomik saati bulunur."
  },
  {
    code: 'dk',
    name: 'Danimarka',
    capital: 'Kopenhag',
    region: 'Avrupa',
    funFact: "Dünyaca ünlü Lego oyuncakları Danimarka'da icat edilmiştir ve Danimarka bayrağı (Dannebrog) dünyanın en eski kesintisiz kullanılan bayrağıdır."
  },
  {
    code: 'ee',
    name: 'Estonya',
    capital: 'Tallinn',
    region: 'Avrupa',
    funFact: "Dünyada parlamento seçimlerinde internet üzerinden oy kullanmayı başlatan ilk ülkedir; Skype burada geliştirilmiştir."
  },
  {
    code: 'fi',
    name: 'Finlandiya',
    capital: 'Helsinki',
    region: 'Avrupa',
    funFact: "Finlandiya'da 3 milyondan fazla sauna vardır; bu sayı neredeyse ülkedeki toplam otomobil sayısından fazladır."
  },
  {
    code: 'fr',
    name: 'Fransa',
    capital: 'Paris',
    region: 'Avrupa',
    funFact: "Denizaşırı topraklarıyla birlikte toplam 12 farklı zaman dilimine yayılmıştır ve dünyada en çok zaman dilimine sahip ülkedir."
  },
  {
    code: 'hr',
    name: 'Hırvatistan',
    capital: 'Zagreb',
    region: 'Avrupa',
    funFact: "Siyah benekleriyle tanınan Dalmaçyalı köpek ırkı, kökenini Hırvatistan'ın Adriyatik kıyısındaki Dalmaçya bölgesinden alır."
  },
  {
    code: 'nl',
    name: 'Hollanda',
    capital: 'Amsterdam',
    region: 'Avrupa',
    funFact: "Topraklarının yaklaşık üçte biri deniz seviyesinin altındadır ve ülkede yaşayan insan sayısından daha fazla bisiklet vardır."
  },
  {
    code: 'ie',
    name: 'İrlanda',
    capital: 'Dublin',
    region: 'Avrupa',
    funFact: "İrlanda'nın doğal ekosisteminde hiç yılan yaşamaz; Cadılar Bayramı (Halloween) geleneği antik İrlanda festivali Samhain'e dayanır."
  },
  {
    code: 'es',
    name: 'İspanya',
    capital: 'Madrid',
    region: 'Avrupa',
    funFact: "Dünyadaki toplam zeytinyağı üretiminin neredeyse yarısını tek başına karşılar ve Madrid'de 1725'ten beri açık dünyanın en eski restoranı (Sobrino de Botín) yer alır."
  },
  {
    code: 'se',
    name: 'İsveç',
    capital: 'Stockholm',
    region: 'Avrupa',
    funFact: "267.000'den fazla adasıyla dünyada en çok adaya sahip ülkedir ve atıklarının %99'unu geri dönüştürerek çöpten enerji üretir."
  },
  {
    code: 'ch',
    name: 'İsviçre',
    capital: 'Bern',
    region: 'Avrupa',
    funFact: "İsviçre bayrağı, Vatikan ile birlikte dünyada tam kare şeklinde olan sadece iki ulusal bayraktan biridir."
  },
  {
    code: 'it',
    name: 'İtalya',
    capital: 'Roma',
    region: 'Avrupa',
    funFact: "UNESCO Dünya Mirası Listesi'nde en çok tarihi ve kültürel varlığı (59 alan) tescil edilmiş dünya lideri ülkedir."
  },
  {
    code: 'is',
    name: 'İzlanda',
    capital: 'Reykjavik',
    region: 'Avrupa',
    funFact: "Ülkede tek bir sivrisinek bile yaşamaz ve evlerin ısıtma ile elektriğinin %99'u yer altı jeotermal kaynaklarından sağlanır."
  },
  {
    code: 'me',
    name: 'Karadağ',
    capital: 'Podgorica',
    region: 'Avrupa',
    funFact: "Bar kentinde bulunan 'Stara Maslina' zeytin ağacı, 2.200 yaşını aşmış gövdesiyle Avrupa'nın en yaşlı canlı ağaçlarındandır."
  },
  {
    code: 'cy',
    name: 'Kıbrıs',
    capital: 'Lefkoşa',
    region: 'Avrupa',
    funFact: "Ülke sınırlarının haritasını ulusal bayrağında gururla taşıyan dünyadaki tek Birleşmiş Milletler üyesi devlettir."
  },
  {
    code: 'mk',
    name: 'Kuzey Makedonya',
    capital: 'Üsküp',
    region: 'Avrupa',
    funFact: "Nobel Barış Ödüllü yardım meleği Rahibe Teresa, 1910 yılında Kuzey Makedonya'nın başkenti Üsküp'te dünyaya gelmiştir."
  },
  {
    code: 'lv',
    name: 'Letonya',
    capital: 'Riga',
    region: 'Avrupa',
    funFact: "Dünyada süslenen ilk açık hava Noel ağacı geleneğinin 1510 yılında Letonya'nın başkenti Riga'da başladığı kabul edilir."
  },
  {
    code: 'li',
    name: 'Lihtenştayn',
    capital: 'Vaduz',
    region: 'Avrupa',
    funFact: "Dünyada Özbekistan ile birlikte 'çift karasal' (komşularının da denize kıyısı olmayan) sadece iki ülkeden biridir."
  },
  {
    code: 'lt',
    name: 'Litvanya',
    capital: 'Vilnius',
    region: 'Avrupa',
    funFact: "Litvanya, resmi olarak tescil edilmiş kendi ulusal parfüm kokusuna ('Lietuvos kvapas') sahip dünyadaki tek ülkedir."
  },
  {
    code: 'lu',
    name: 'Lüksemburg',
    capital: 'Lüksemburg',
    region: 'Avrupa',
    funFact: "2020 yılında tren, tramvay ve otobüs dahil tüm toplu taşıma araçlarını ülke genelinde tamamen ücretsiz yapan ilk devlettir."
  },
  {
    code: 'hu',
    name: 'Macaristan',
    capital: 'Budapeşte',
    region: 'Avrupa',
    funFact: "Dünyanın en çok satan zeka bulmacası Rubik Küpü, 1974 yılında Macar mimar Ernő Rubik tarafından icat edilmiştir."
  },
  {
    code: 'mt',
    name: 'Malta',
    capital: 'Valletta',
    region: 'Avrupa',
    funFact: "Başkenti Valletta, 0.8 kilometrekarelik alanıyla Avrupa Birliği'nin en küçük başkenti olup tamamı açık hava müzesi gibidir."
  },
  {
    code: 'md',
    name: 'Moldova',
    capital: 'Kişinev',
    region: 'Avrupa',
    funFact: "Mileștii Mici yeraltı şarap mahzeni, yaklaşık 200 kilometrelik tünelleri ve 2 milyondan fazla şişesiyle Guinness rekoruna sahiptir."
  },
  {
    code: 'mc',
    name: 'Monako',
    capital: 'Monako',
    region: 'Avrupa',
    funFact: "Dünyanın en yoğun nüfuslu ülkesidir ancak Monako vatandaşlarının ünlü Monte Carlo kumarhanelerinde kumar oynaması yasaktır."
  },
  {
    code: 'no',
    name: 'Norveç',
    capital: 'Oslo',
    region: 'Avrupa',
    funFact: "Kutup dairesindeki Longyearbyen kasabasında, donmuş toprak cesetlerin çürümesini engellediği için insanların gömülmesi yasal olarak yasaktır."
  },
  {
    code: 'pl',
    name: 'Polonya',
    capital: 'Varşova',
    region: 'Avrupa',
    funFact: "3 Mayıs 1791'de kabul edilen Polonya Anayasası, Avrupa'nın ilk ve dünyanın ABD'den sonra ikinci modern yazılı anayasasıdır."
  },
  {
    code: 'pt',
    name: 'Portekiz',
    capital: 'Lizbon',
    region: 'Avrupa',
    funFact: "Dünya mantar meşesi üretiminin %50'den fazlasını karşılar ve Lizbon'daki Bertrand Kitabevi 1732'den beri açık kalarak dünya rekoru kırmıştır."
  },
  {
    code: 'ro',
    name: 'Romanya',
    capital: 'Bükreş',
    region: 'Avrupa',
    funFact: "Bükreş'teki Parlamento Sarayı, Pentagon'dan sonra dünyanın en büyük ikinci idari binası ve en ağır yapısıdır."
  },
  {
    code: 'ru',
    name: 'Rusya',
    capital: 'Moskova',
    region: 'Avrupa',
    funFact: "Dünyanın en geniş yüzölçümüne sahip ülkesidir (17 milyon km²); yüzölçümü Plüton cüce gezegeninin yüzeyinden daha büyüktür."
  },
  {
    code: 'sm',
    name: 'San Marino',
    capital: 'San Marino',
    region: 'Avrupa',
    funFact: "M.S. 301 yılında kurulan dünyanın en eski bağımsız cumhuriyetidir ve ülkede kayıtlı araç sayısı insan sayısından fazladır."
  },
  {
    code: 'rs',
    name: 'Sırbistan',
    capital: 'Belgrad',
    region: 'Avrupa',
    funFact: "Modern elektrik çağını başlatan dahi mucit Nikola Tesla Sırp kökenlidir ve kişisel mirası ile külleri Belgrad Müzesi'ndedir."
  },
  {
    code: 'sk',
    name: 'Slovakya',
    capital: 'Bratislava',
    region: 'Avrupa',
    funFact: "Kişi başına dünyada en çok tarihi kale ve şato düşen ülkedir; sınırları içinde 180'den fazla kale ve 400'den fazla konak yer alır."
  },
  {
    code: 'si',
    name: 'Slovenya',
    capital: 'Ljubljana',
    region: 'Avrupa',
    funFact: "Yüzölçümünün %60'ı ormanlarla kaplıdır ve ülkede her 200 kişiden birine bir arı kovanı düşecek kadar güçlü bir arıcılık kültürü vardır."
  },
  {
    code: 'tr',
    name: 'Türkiye',
    capital: 'Ankara',
    region: 'Avrupa/Asya',
    funFact: "İki kıtaya yayılan dünyadaki tek metropol İstanbul'dur ve Şanlıurfa'daki Göbeklitepe 12.000 yıllık geçmişiyle bilinen en eski tapınaktır."
  },
  {
    code: 'ua',
    name: 'Ukrayna',
    capital: 'Kiev',
    region: 'Avrupa',
    funFact: "Kiev metrosundaki Arsenalna İstasyonu, yerin 105.5 metre derinliğinde yer alarak dünyanın en derin metro istasyonlarından biridir."
  },
  {
    code: 'gr',
    name: 'Yunanistan',
    capital: 'Atina',
    region: 'Avrupa',
    funFact: "Yunanistan Ulusal Marşı (Özgürlük İlahisi), 158 kıtadan oluşarak dünyadaki en uzun sözlü resmi marş rekorunu elinde tutar."
  },
  {
    code: 'va',
    name: 'Vatikan',
    capital: 'Vatikan',
    region: 'Avrupa',
    funFact: "0.44 kilometrekarelik alanıyla dünyanın hem yüzölçümü hem de nüfus bakımından en küçük bağımsız devletidir."
  },

  // --- ASYA (47 BM Üyesi + 1 Gözlemci) ---
  {
    code: 'af',
    name: 'Afganistan',
    capital: 'Kabil',
    region: 'Asya',
    funFact: "Afganistan'ın geleneksel milli sporu 'Buzkaşi'dir; atlı süvarilerin keçi postunu kapıp kaleye taşımaya çalıştığı asırlık bir oyundur."
  },
  {
    code: 'az',
    name: 'Azerbaycan',
    capital: 'Bakü',
    region: 'Asya',
    funFact: "Dünyadaki tüm çamur volkanlarının yarıdan fazlası Azerbaycan'dadır ve yüzyıllardır kendiliğinden yanan 'Yanardağ' ateş tepesi buradadır."
  },
  {
    code: 'bh',
    name: 'Bahreyn',
    capital: 'Manama',
    region: 'Asya',
    funFact: "Çölün ortasında hiçbir su kaynağı olmadan 400 yıldan uzun süredir yeşil kalan efsanevi 'Hayat Ağacı' (Shajarat al-Hayah) buradadır."
  },
  {
    code: 'bd',
    name: 'Bangladeş',
    capital: 'Dakka',
    region: 'Asya',
    funFact: "Cox's Bazar, 120 kilometrelik kesintisiz uzunluğuyla dünyanın en uzun doğal kumsal plajına ev sahipliği yapar."
  },
  {
    code: 'ae',
    name: 'Birleşik Arap Emirlikleri',
    capital: 'Abu Dabi',
    region: 'Asya',
    funFact: "Dubai'deki 828 metre yüksekliğindeki Burj Khalifa, insan eliyle inşa edilmiş dünyanın en yüksek binasıdır."
  },
  {
    code: 'bn',
    name: 'Brunei',
    capital: 'Bandar Seri Begawan',
    region: 'Asya',
    funFact: "Sultanın resmi sarayı Istana Nurul Iman, 1.788 odası ve 257 banyosuyla dünyanın konut olarak kullanılan en büyük sarayıdır."
  },
  {
    code: 'bt',
    name: 'Butan',
    capital: 'Thimphu',
    region: 'Asya',
    funFact: "Maddi kalkınma yerine 'Gayri Safi Milli Mutluluk' endeksini anayasasına koyan ve dünyada karbon negatif olan tek ülkedir."
  },
  {
    code: 'cn',
    name: 'Çin',
    capital: 'Pekin',
    region: 'Asya',
    funFact: "İnsanlık tarihini değiştiren kağıt, barut, matbaa ve pusula Çin'de icat edilmiştir; 21.000 km'lik Çin Seddi insan yapımı en uzun savunma hattıdır."
  },
  {
    code: 'tl',
    name: 'Doğu Timor',
    capital: 'Dili',
    region: 'Asya',
    funFact: "2002 yılında bağımsızlığını kazanan Asya'nın en genç ülkelerindendir ve halkı adanın timsah efsanesine dayandığına inanır."
  },
  {
    code: 'id',
    name: 'Endonezya',
    capital: 'Cakarta',
    region: 'Asya',
    funFact: "17.500'den fazla adadan oluşan dünyanın en büyük takımada ülkesidir ve yaşayan en büyük kertenkele olan Komodo ejderinin tek vatanıdır."
  },
  {
    code: 'am',
    name: 'Ermenistan',
    capital: 'Erivan',
    region: 'Asya',
    funFact: "M.S. 301 yılında Hristiyanlığı resmi devlet dini kabul eden tarihteki ilk ülkedir ve okullarda satranç zorunlu ders olarak okutulur."
  },
  {
    code: 'ph',
    name: 'Filipinler',
    capital: 'Manila',
    region: 'Asya',
    funFact: "7.641 adadan oluşur ve günde gönderilen yüz milyonlarca mesajla uzun yıllar 'Dünyanın Kısa Mesaj (SMS) Başkenti' unvanını taşımıştır."
  },
  {
    code: 'ps',
    name: 'Filistin',
    capital: 'Kudüs / Ramallah',
    region: 'Asya',
    funFact: "Batı Şeria'daki Eriha (Jericho) kenti, 11.000 yıllık yerleşim geçmişiyle dünyada kesintisiz insan yaşayan en eski şehirlerdendir."
  },
  {
    code: 'ge',
    name: 'Gürcistan',
    capital: 'Tiflis',
    region: 'Asya',
    funFact: "Arkeologların bulduğu 8.000 yıllık şarap küpleriyle dünyanın en eski şarap üretim kültürünün başladığı yer olarak tescillenmiştir."
  },
  {
    code: 'in',
    name: 'Hindistan',
    capital: 'Yeni Delhi',
    region: 'Asya',
    funFact: "Satranç oyunu (Çaturanga), '0' (sıfır) matematiksel kavramı ve yoga pratikleri antik Hindistan'da doğmuştur."
  },
  {
    code: 'iq',
    name: 'Irak',
    capital: 'Bağdat',
    region: 'Asya',
    funFact: "Yazının, tekerleğin ve tarihteki ilk yazılı kanunların (Hammurabi) doğduğu antik Mezopotamya ve Sümer uygarlıklarının beşiğidir."
  },
  {
    code: 'ir',
    name: 'İran',
    capital: 'Tahran',
    region: 'Asya',
    funFact: "Dünya kaliteli safran üretiminin %90'ını sağlar ve 2.500 yıllık antik Pers İmparatorluğu'nun başkenti Persepolis'e ev sahipliği yapar."
  },
  {
    code: 'il',
    name: 'İsrail',
    capital: 'Kudüs',
    region: 'Asya',
    funFact: "Deniz seviyesinin 430 metre altındaki Lut Gölü (Ölü Deniz), aşırı tuzluluğu sayesinde batmadan su üzerinde kalabileceğiniz dünyanın en alçak noktasıdır."
  },
  {
    code: 'jp',
    name: 'Japonya',
    capital: 'Tokyo',
    region: 'Asya',
    funFact: "Japonya'da hızlı trenlerin (Şinkansen) yıllık ortalama gecikme süresi 1 dakikanın altındadır ve ülkede 5 milyondan fazla otomat bulunur."
  },
  {
    code: 'kh',
    name: 'Kamboçya',
    capital: 'Phnom Penh',
    region: 'Asya',
    funFact: "Dünyanın en büyük dini tapınak kompleksi olan Angkor Wat Kamboçya'dadır ve ulusal bayrağında bu tapınağın silüeti yer alır."
  },
  {
    code: 'qa',
    name: 'Katar',
    capital: 'Doha',
    region: 'Asya',
    funFact: "Doğal ormanı bulunmayan nadir ülkelerdendir ve kişi başına düşen milli gelir bakımından dünyanın en zengin ülkeleri arasındadır."
  },
  {
    code: 'kz',
    name: 'Kazakistan',
    capital: 'Astana',
    region: 'Asya',
    funFact: "Dünyanın denize kıyısı olmayan en büyük yüzölçümlü ülkesidir ve genetik araştırmalara göre elmanın dünyaya ilk yayıldığı yer Almatı bölgesidir."
  },
  {
    code: 'kg',
    name: 'Kırgızistan',
    capital: 'Bişkek',
    region: 'Asya',
    funFact: "500.000'den fazla dizeden oluşan ve Homeros destanlarından katbekat uzun olan Manas Destanı, Kırgız kültürünün yaşayan mirasıdır."
  },
  {
    code: 'kw',
    name: 'Kuveyt',
    capital: 'Kuveyt',
    region: 'Asya',
    funFact: "Kuveyt Dinarı dünyanın en değerli ulusal para birimidir ve ülkede tek bir kalıcı göl veya nehir bulunmaz."
  },
  {
    code: 'kp',
    name: 'Kuzey Kore',
    capital: 'Pyongyang',
    region: 'Asya',
    funFact: "Miladi takvim yerine ülkenin kurucusu Kim Il-sung'un doğum yılını (1912) 1. yıl kabul eden 'Juche Takvimi'ni kullanır."
  },
  {
    code: 'kr',
    name: 'Güney Kore',
    capital: 'Seul',
    region: 'Asya',
    funFact: "Dünyanın en hızlı fiber internet altyapısına sahiptir ve elektronik sporu (e-spor) resmi bir spor branşı olarak tanıyan ilk devlettir."
  },
  {
    code: 'la',
    name: 'Laos',
    capital: 'Vientiane',
    region: 'Asya',
    funFact: "Tarihte 'Milyon Fil Ülkesi' (Lan Xang) olarak bilinen Laos, Güneydoğu Asya'da denize kıyısı olmayan tek ülkedir."
  },
  {
    code: 'lb',
    name: 'Lübnan',
    capital: 'Beyrut',
    region: 'Asya',
    funFact: "Ortadoğu'da çölü bulunmayan tek ülkedir ve bayrağında yer alan efsanevi Lübnan sedir ağaçları binlerce yıldır saygıyla korunur."
  },
  {
    code: 'mv',
    name: 'Maldivler',
    capital: 'Male',
    region: 'Asya',
    funFact: "Deniz seviyesinden ortalama yüksekliği sadece 1.5 metre olup yeryüzünün en düz ve en alçak rakımlı ülkesidir."
  },
  {
    code: 'my',
    name: 'Malezya',
    capital: 'Kuala Lumpur',
    region: 'Asya',
    funFact: "Çapı 1 metreyi, ağırlığı 10 kilogramı bulan dünyanın en büyük çiçeği Rafflesia, Malezya'nın yağmur ormanlarında açar."
  },
  {
    code: 'mn',
    name: 'Moğolistan',
    capital: 'Ulanbator',
    region: 'Asya',
    funFact: "Kilometrekareye sadece 2 kişinin düştüğü dünyanın en seyrek nüfuslu ülkesidir; ülkede insan sayısından çok daha fazla at yaşar."
  },
  {
    code: 'mm',
    name: 'Myanmar',
    capital: 'Nepido',
    region: 'Asya',
    funFact: "Halk, yüzyıllardır güneşten korunmak ve serinlemek için 'Thanaka' adı verilen sarımtırak ağaç kabuğu macununu yüzlerine sürer."
  },
  {
    code: 'np',
    name: 'Nepal',
    capital: 'Katmandu',
    region: 'Asya',
    funFact: "Dünyanın en yüksek zirvesi Everest (8.848m) buradadır ve bayrağı dikdörtgen veya kare olmayan dünyadaki tek ülke bayrağıdır."
  },
  {
    code: 'uz',
    name: 'Özbekistan',
    capital: 'Taşkent',
    region: 'Asya',
    funFact: "Tarihi İpek Yolu'nun kalbindeki Semerkant, Buhara ve Hive gibi göz kamaştırıcı mavi çinili şehirlere ev sahipliği yapar."
  },
  {
    code: 'pk',
    name: 'Pakistan',
    capital: 'İslamabad',
    region: 'Asya',
    funFact: "Dünya Kupası maçlarında kullanılanlar dahil dünya el yapımı profesyonel futbol toplarının %70'inden fazlası Sialkot kentinde üretilir."
  },
  {
    code: 'sg',
    name: 'Singapur',
    capital: 'Singapur',
    region: 'Asya',
    funFact: "Aynı anda hem bir ada, hem bir şehir, hem de tam bağımsız bir devlet olan dünyadaki yegane ada-şehir-devlettir."
  },
  {
    code: 'lk',
    name: 'Sri Lanka',
    capital: 'Kolombo',
    region: 'Asya',
    funFact: "Gerçek Seylan tarçınının anavatanıdır ve 1960 yılında dünyanın ilk kadın başbakanını (Sirimavo Bandaranaike) seçerek tarihe geçmiştir."
  },
  {
    code: 'sy',
    name: 'Suriye',
    capital: 'Şam',
    region: 'Asya',
    funFact: "Başkenti Şam, M.Ö. 3. bin yıldan beri kesintisiz olarak insan yerleşiminin devam ettiği dünyanın en eski başkentlerindendir."
  },
  {
    code: 'sa',
    name: 'Suudi Arabistan',
    capital: 'Riyad',
    region: 'Asya',
    funFact: "Topraklarında tek bir kalıcı akarsu veya doğal nehir bulunmayan dünyanın en büyük yüzölçümlü ülkesidir."
  },
  {
    code: 'tj',
    name: 'Tacikistan',
    capital: 'Duşanbe',
    region: 'Asya',
    funFact: "Topraklarının %93'ü sarp dağlarla kaplıdır ve 300 metrelik Nurek Barajı dünyanın en yüksek baraj setlerinden biridir."
  },
  {
    code: 'th',
    name: 'Tayland',
    capital: 'Bangkok',
    region: 'Asya',
    funFact: "Güneydoğu Asya'da Avrupalı sömürgeci güçler tarafından hiçbir zaman işgal edilmemiş ve sömürgeleştirilmemiş tek ülkedir."
  },
  {
    code: 'tm',
    name: 'Türkmenistan',
    capital: 'Aşkabat',
    region: 'Asya',
    funFact: "Karakum Çölü'nde 1971 yılından beri aralıksız alev alev yanan devasa gaz krateri 'Cehennem Kapısı' (Darvaza) buradadır."
  },
  {
    code: 'om',
    name: 'Umman',
    capital: 'Maskat',
    region: 'Asya',
    funFact: "Dünyanın en kaliteli tütsü ve buhuru (günlük ağacı reçinesi) Umman'da üretilir ve Arap Yarımadası'nın en eski bağımsız devletidir."
  },
  {
    code: 'jo',
    name: 'Ürdün',
    capital: 'Amman',
    region: 'Asya',
    funFact: "Kızıl kumtaşı kayalıklarına oyulmuş 2.000 yıllık efsanevi Petra antik şehri, Dünyanın Yeni Yedi Harikası'ndan biridir."
  },
  {
    code: 'vn',
    name: 'Vietnam',
    capital: 'Hanoi',
    region: 'Asya',
    funFact: "İçine 40 katlı bir gökdelenin ve kendi yağmur ormanının sığabildiği dünyanın en büyük mağarası Hang Son Doong Vietnam'dadır."
  },
  {
    code: 'ye',
    name: 'Yemen',
    capital: 'Sana',
    region: 'Asya',
    funFact: "500 yıllık kerpiçten yapılmış çok katlı gökdelenleriyle ünlü Shibam kenti, tarihte 'Çölün Manhattan'ı' olarak anılır."
  },

  // --- AFRİKA (54 BM Üyesi) ---
  {
    code: 'ao',
    name: 'Angola',
    capital: 'Luanda',
    region: 'Afrika',
    funFact: "Afrika'nın en görkemli su perdelerinden Kalandula Şelaleleri'ne ve 1.000 yıldan uzun yaşayabilen tuhaf Welwitschia bitkisine ev sahipliği yapar."
  },
  {
    code: 'bj',
    name: 'Benin',
    capital: 'Porto-Novo',
    region: 'Afrika',
    funFact: "Vudu (Voodoo) inancının resmi bir din olarak tanındığı ve doğduğu ülkedir; her yıl ulusal Vudu festivali kutlanır."
  },
  {
    code: 'bw',
    name: 'Botsvana',
    capital: 'Gaborone',
    region: 'Afrika',
    funFact: "Dünyadaki en zengin elmas madenlerine sahiptir ve 130.000'den fazla fille dünyadaki en yoğun vahşi fil nüfusunu barındırır."
  },
  {
    code: 'bf',
    name: 'Burkina Faso',
    capital: 'Uagadugu',
    region: 'Afrika',
    funFact: "Ülkenin adı yerel dilde 'Dürüst ve Onurlu İnsanlar Ülkesi' anlamına gelir ve Afrika'nın en prestijli film festivaline (FESPACO) ev sahipliği yapar."
  },
  {
    code: 'bi',
    name: 'Burundi',
    capital: 'Gitega',
    region: 'Afrika',
    funFact: "Kraliyet davulcularının UNESCO korumasındaki senkronize akrobatik davul gösterileri, Burundi'nin en ünlü kültürel mirasıdır."
  },
  {
    code: 'cv',
    name: 'Cabo Verde',
    capital: 'Praia',
    region: 'Afrika',
    funFact: "Atlas Okyanusu'nda 10 volkanik adadan oluşur; ünlü 'Çıplak Ayaklı Diva' Cesaria Evora'nın dünyaya armağan ettiği Morna müziğinin vatanıdır."
  },
  {
    code: 'dz',
    name: 'Cezayir',
    capital: 'Cezayir',
    region: 'Afrika',
    funFact: "Afrika kıtasının yüzölçümü olarak en büyük ülkesidir ve topraklarının %80'inden fazlası devasa Sahra Çölü ile kaplıdır."
  },
  {
    code: 'dj',
    name: 'Cibuti',
    capital: 'Cibuti',
    region: 'Afrika',
    funFact: "Kızıldeniz ile Aden Körfezi'nin kesişiminde yer alır ve göç mevsiminde kıyılarına gelen devasa balina köpekbalıklarıyla yüzülebilir."
  },
  {
    code: 'td',
    name: 'Çad',
    capital: "N'Djamena",
    region: 'Afrika',
    funFact: "Kıtanın tam ortasındaki konumu ve denizden uzaklığı sebebiyle coğrafyacılar tarafından 'Afrika'nın Ölü Kalbi' olarak adlandırılmıştır."
  },
  {
    code: 'gq',
    name: 'Ekvator Ginesi',
    capital: 'Malabo',
    region: 'Afrika',
    funFact: "Afrika kıtasında İspanyolca'nın resmi dil olduğu tek bağımsız devlettir; başkenti anakarada değil Bioko adasındadır."
  },
  {
    code: 'er',
    name: 'Eritre',
    capital: 'Asmara',
    region: 'Afrika',
    funFact: "Başkenti Asmara, 1930'lardan kalma mükemmel korunmuş fütüristik Art Deco İtalyan mimarisiyle UNESCO Dünya Mirası Listesi'ndedir."
  },
  {
    code: 'sz',
    name: 'Esvatini',
    capital: 'Mbabane',
    region: 'Afrika',
    funFact: "Afrika kıtasında mutlak monarşiyle yönetilen son krallıktır; eski adı Svaziland olup 2018 yılında resmi adını Esvatini yapmıştır."
  },
  {
    code: 'et',
    name: 'Etiyopya',
    capital: 'Addis Ababa',
    region: 'Afrika',
    funFact: "Kahvenin (Arabica) dünyadaki doğum yeridir; 13 aydan oluşan kendi antik takvimini kullanır ve Avrupa güçlerince hiç sömürgeleştirilmemiştir."
  },
  {
    code: 'ci',
    name: 'Fildişi Sahili',
    capital: 'Yamoussoukro',
    region: 'Afrika',
    funFact: "Dünya kakao üretiminde 1 numaradır ve başkentindeki Notre-Dame de la Paix Bazilikası dünyanın en büyük kilisesidir."
  },
  {
    code: 'ga',
    name: 'Gabon',
    capital: 'Libreville',
    region: 'Afrika',
    funFact: "Topraklarının %85'i el değmemiş yağmur ormanlarıyla kaplıdır ve okyanus dalgalarında sörf yapan suaygırlarıyla meşhurdur."
  },
  {
    code: 'gm',
    name: 'Gambiya',
    capital: 'Banjul',
    region: 'Afrika',
    funFact: "Gambiya Nehri'nin iki yakası boyunca uzanan dar şeridiyle Afrika anakarasının yüzölçümü en küçük bağımsız ülkesidir."
  },
  {
    code: 'gh',
    name: 'Gana',
    capital: 'Akra',
    region: 'Afrika',
    funFact: "Sahra Altı Afrika'da 1957 yılında sömürgecilikten kurtulup bağımsızlığını kazanan ilk devlettir ve tarihi Altın Sahili'dir."
  },
  {
    code: 'gn',
    name: 'Gine',
    capital: 'Konakri',
    region: 'Afrika',
    funFact: "Dünya boksit (alüminyum cevheri) rezervlerinin neredeyse üçte birine sahiptir ve Batı Afrika'nın büyük nehirlerinin su kaynağıdır."
  },
  {
    code: 'gw',
    name: 'Gine-Bissau',
    capital: 'Bissau',
    region: 'Afrika',
    funFact: "Açıklarındaki Bijagos Takımadaları, dünyada tuzlu deniz suyunda yaşayan ender suaygırı popülasyonuna ev sahipliği yapar."
  },
  {
    code: 'za',
    name: 'Güney Afrika',
    capital: 'Pretoria',
    region: 'Afrika',
    funFact: "Dünyada resmi olarak üç farklı başkenti (İdari: Pretoria, Yasama: Cape Town, Yargı: Bloemfontein) bulunan tek ülkedir."
  },
  {
    code: 'ss',
    name: 'Güney Sudan',
    capital: 'Cuba',
    region: 'Afrika',
    funFact: "9 Temmuz 2011 tarihinde bağımsızlığını ilan ederek Birleşmiş Milletler'e katılan en genç (193.) üye devlet olmuştur."
  },
  {
    code: 'cm',
    name: 'Kamerun',
    capital: 'Yaounde',
    region: 'Afrika',
    funFact: "Çöl, yağmur ormanı, savan ve plajları tek coğrafyada topladığı için coğrafyacılar tarafından 'Minyatür Afrika' olarak anılır."
  },
  {
    code: 'ke',
    name: 'Kenya',
    capital: 'Nairobi',
    region: 'Afrika',
    funFact: "Dünyanın en hızlı uzun mesafe maratoncularını yetiştirir ve başkentinde gökdelenlerin yanında aslanların gezdiği vahşi milli park bulunur."
  },
  {
    code: 'km',
    name: 'Komorlar',
    capital: 'Moroni',
    region: 'Afrika',
    funFact: "Dünya parfüm endüstrisinin ana hammaddesi olan 'Ylang-ylang' çiçeği ve vanilya üretiminden dolayı 'Parfüm Adaları' olarak anılır."
  },
  {
    code: 'cg',
    name: 'Kongo Cumhuriyeti',
    capital: 'Brazzaville',
    region: 'Afrika',
    funFact: "Yoksulluğa meydan okurcasına en kaliteli şık takım elbiseleri bir zarafet sanatına dönüştüren ünlü 'Sapeurs' beyefendiler alt kültürü buradadır."
  },
  {
    code: 'cd',
    name: 'Demokratik Kongo Cumhuriyeti',
    capital: 'Kinşasa',
    region: 'Afrika',
    funFact: "220 metreye varan derinliğiyle dünyanın en derin nehri Kongo Nehri'ne ve nesli tükenmekte olan dağ gorillerine ev sahipliği yapar."
  },
  {
    code: 'ls',
    name: 'Lesotho',
    capital: 'Maseru',
    region: 'Afrika',
    funFact: "Topraklarının tamamı deniz seviyesinden en az 1.400 metre yüksekte olan dünyadaki tek ülkedir ('Gökyüzündeki Krallık')."
  },
  {
    code: 'lr',
    name: 'Liberya',
    capital: 'Monrovia',
    region: 'Afrika',
    funFact: "1847 yılında Amerika'dan dönen özgür bırakılmış köleler tarafından kurulan Afrika kıtasının ilk demokratik cumhuriyetidir."
  },
  {
    code: 'ly',
    name: 'Libya',
    capital: 'Trablus',
    region: 'Afrika',
    funFact: "1922'de El-Aziziye'de ölçülen 58°C sıcaklık uzun yıllar yeryüzünün en yüksek gölge sıcaklığı rekoru olarak kayıtlara geçmiştir."
  },
  {
    code: 'mg',
    name: 'Madagaskar',
    capital: 'Antananarivo',
    region: 'Afrika',
    funFact: "Dünyanın 4. büyük adasıdır ve adadaki bitki ile hayvan türlerinin (lemurlar ve bukalemunlar dahil) %90'ı sadece burada yaşar."
  },
  {
    code: 'mw',
    name: 'Malavi',
    capital: 'Lilongwe',
    region: 'Afrika',
    funFact: "Malavi Gölü, dünyadaki tüm tatlı su gölleri arasında en çok balık türü çeşitliliğine (1.000'den fazla renkli tür) sahip göldür."
  },
  {
    code: 'ml',
    name: 'Mali',
    capital: 'Bamako',
    region: 'Afrika',
    funFact: "Tarihin en zengin insanı kabul edilen Mansa Musa'nın yurdudur ve dünyanın kilden yapılmış en büyük binası Büyük Djenne Camii buradadır."
  },
  {
    code: 'mu',
    name: 'Mauritius',
    capital: 'Port Louis',
    region: 'Afrika',
    funFact: "İnsanların avlanmasıyla 17. yüzyılda nesli tükenen efsanevi uçamayan Dodo kuşunun dünya üzerindeki tek anavatanıydı."
  },
  {
    code: 'mr',
    name: 'Moritanya',
    capital: 'Nuakşot',
    region: 'Afrika',
    funFact: "Uzaydan bakıldığında devasa bir mavi göz bebeği gibi görünen 40 kilometre çapındaki gizemli 'Sahra'nın Gözü' (Richat Oluşumu) buradadır."
  },
  {
    code: 'ma',
    name: 'Fas',
    capital: 'Rabat',
    region: 'Afrika',
    funFact: "Fas'ın Fes kentindeki Karaviyyin Üniversitesi, 859 yılından beri kesintisiz eğitim veren dünyanın en eski üniversitesidir."
  },
  {
    code: 'mz',
    name: 'Mozambik',
    capital: 'Maputo',
    region: 'Afrika',
    funFact: "Ulusal bayrağında tarımı simgeleyen çapa ve eğitimi simgeleyen kitabın yanında modern bir ateşli silah (AK-47) bulunan tek ülkedir."
  },
  {
    code: 'na',
    name: 'Namibya',
    capital: 'Windhoek',
    region: 'Afrika',
    funFact: "55 milyon yıllık geçmişiyle dünyanın en eski çölü kabul edilen Namib Çölü'ne ve 300 metrelik devasa kızıl kum tepelerine sahiptir."
  },
  {
    code: 'ne',
    name: 'Nijer',
    capital: 'Niamey',
    region: 'Afrika',
    funFact: "Gadoufaoua çöl bölgesi, bozulmamış dev etobur dinozor iskeletleriyle dünyanın en zengin dinozor fosili yataklarından biridir."
  },
  {
    code: 'ng',
    name: 'Nijerya',
    capital: 'Abuja',
    region: 'Afrika',
    funFact: "220 milyonu aşan nüfusuyla Afrika'nın en kalabalık ülkesidir ve 'Nollywood' film sektörü yıllık üretilen film adedinde Hollywood'u geçer."
  },
  {
    code: 'cf',
    name: 'Orta Afrika Cumhuriyeti',
    capital: 'Bangui',
    region: 'Afrika',
    funFact: "Işık kirliliği haritalarına göre dünyada gökyüzünün en karanlık olduğu ve Samanyolu galaksisinin en net izlendiği coğrafyalardandır."
  },
  {
    code: 'rw',
    name: 'Ruanda',
    capital: 'Kigali',
    region: 'Afrika',
    funFact: "Parlamentosundaki kadın milletvekili oranı (%61) ile dünyada 1 numaradır ve plastik poşetin tamamen yasak olduğu tertemiz bir ülkedir."
  },
  {
    code: 'st',
    name: 'Sao Tome ve Principe',
    capital: 'Sao Tome',
    region: 'Afrika',
    funFact: "Tam ekvator çizgisi üzerinde yer alan iki volkanik adadır; 1900'lerin başında dünyanın en büyük kaliteli kakao üreticisiydi."
  },
  {
    code: 'sn',
    name: 'Senegal',
    capital: 'Dakar',
    region: 'Afrika',
    funFact: "İçindeki özel tuz seven yosunlar ve mineraller sayesinde suyunun rengi parlak pembe olan ünlü Retba Pembe Gölü buradadır."
  },
  {
    code: 'sc',
    name: 'Seyşeller',
    capital: 'Victoria',
    region: 'Afrika',
    funFact: "Afrika'nın en küçük bağımsız ülkesidir ve 25 kilograma kadar ulaşabilen dünyanın en büyük tohumuna (Coco de Mer) ev sahipliği yapar."
  },
  {
    code: 'sl',
    name: 'Sierra Leone',
    capital: 'Freetown',
    region: 'Afrika',
    funFact: "Başkenti Freetown (Özgür Şehir), 1792 yılında kölelikten kurtarılan Afrikalılar tarafından bir özgürlük yurdu olarak kurulmuştur."
  },
  {
    code: 'so',
    name: 'Somali',
    capital: 'Mogadişu',
    region: 'Afrika',
    funFact: "3.333 kilometrelik kıyı uzunluğuyla Afrika anakarasında en uzun sahil şeridine sahip olan ülkedir."
  },
  {
    code: 'sd',
    name: 'Sudan',
    capital: 'Hartum',
    region: 'Afrika',
    funFact: "Antik Nubiya ve Kuş Krallığı'ndan kalan 250'den fazla piramidiyle komşusu Mısır'dan bile daha fazla piramide ev sahipliği yapar."
  },
  {
    code: 'tz',
    name: 'Tanzanya',
    capital: 'Dodoma',
    region: 'Afrika',
    funFact: "Afrika'nın karlı çatısı Klimanjaro Dağı (5.895m) ve milyonlarca hayvanın katıldığı Büyük Serengeti Göçü buradadır."
  },
  {
    code: 'tg',
    name: 'Togo',
    capital: 'Lome',
    region: 'Afrika',
    funFact: "Başkenti Lome'deki Akodessewa Pazarı, geleneksel şifacılar ve ritüeller için dünyanın en büyük geleneksel fetiş pazarıdır."
  },
  {
    code: 'tn',
    name: 'Tunus',
    capital: 'Tunus',
    region: 'Afrika',
    funFact: "Antik Romalıların korkulu rüyası Kartaca medeniyetinin yurdudur ve Star Wars filmlerinin çöl gezegeni sahneleri burada çekilmiştir."
  },
  {
    code: 'ug',
    name: 'Uganda',
    capital: 'Kampala',
    region: 'Afrika',
    funFact: "Zengin yeşil doğası ve benzersiz iklimi nedeniyle Winston Churchill tarafından 'Afrika'nın İncisi' olarak tanımlanmıştır."
  },
  {
    code: 'zm',
    name: 'Zambiya',
    capital: 'Lusaka',
    region: 'Afrika',
    funFact: "Dünyanın en görkemli su perdesi Victoria Şelaleleri'nin tepesindeki doğal kaya havuzu 'Şeytan Havuzu' (Devil's Pool) buradadır."
  },
  {
    code: 'zw',
    name: 'Zimbabve',
    capital: 'Harare',
    region: 'Afrika',
    funFact: "Ülkenin adı yerel Şona dilinde 'Taştan Evler' anlamına gelir ve harç kullanılmadan inşa edilen antik Büyük Zimbabve harabelerinden gelir."
  },
  {
    code: 'eg',
    name: 'Mısır',
    capital: 'Kahire',
    region: 'Afrika',
    funFact: "4.500 yıllık Keops Piramidi, Antik Dünyanın Yedi Harikası arasından günümüze kadar ayakta kalmayı başarmış tek eserdir."
  },

  // --- AMERİKA (35 BM Üyesi) ---
  {
    code: 'us',
    name: 'Amerika Birleşik Devletleri',
    capital: 'Washington D.C.',
    region: 'Kuzey Amerika',
    funFact: "1872'de kurulan dünyanın ilk milli parkı Yellowstone buradadır; internet, uçak ve ay yürüyüşü gibi teknolojilere öncülük etmiştir."
  },
  {
    code: 'ag',
    name: 'Antigua ve Barbuda',
    capital: "Saint John's",
    region: 'Kuzey Amerika',
    funFact: "Yılın her bir gününe bir plaj düşecek şekilde tam 365 adet turkuaz sularla çevrili beyaz kumlu plaja sahiptir."
  },
  {
    code: 'ar',
    name: 'Arjantin',
    capital: 'Buenos Aires',
    region: 'Güney Amerika',
    funFact: "Tangonun anavatanıdır ve başkentindeki Avenida 9 de Julio, 140 metrelik genişliğiyle dünyanın en geniş caddelerinden biridir."
  },
  {
    code: 'bs',
    name: 'Bahamalar',
    capital: 'Nassau',
    region: 'Kuzey Amerika',
    funFact: "Exuma adasındaki 'Pig Beach' kumsalında, berrak turkuaz denizde insanlarla birlikte keyifle yüzen evcilleşmiş domuzlar yaşar."
  },
  {
    code: 'bb',
    name: 'Barbados',
    capital: 'Bridgetown',
    region: 'Kuzey Amerika',
    funFact: "1703 yılından beri üretilen Mount Gay ile rom içkisinin doğduğu yer kabul edilir ve dünya yıldızı Rihanna'nın anavatanıdır."
  },
  {
    code: 'bz',
    name: 'Belize',
    capital: 'Belmopan',
    region: 'Kuzey Amerika',
    funFact: "124 metre derinliğindeki kusursuz dairesel denizaltı obruğu 'Great Blue Hole' (Büyük Mavi Delik), dalgıçların rüya merkezidir."
  },
  {
    code: 'bo',
    name: 'Bolivya',
    capital: 'Sucre / La Paz',
    region: 'Güney Amerika',
    funFact: "10.500 kilometrekarelik Salar de Uyuni, yağmur yağdığında gökyüzünü kusursuz yansıtan dünyanın en büyük doğal aynasıdır."
  },
  {
    code: 'br',
    name: 'Brezilya',
    capital: 'Brasília',
    region: 'Güney Amerika',
    funFact: "Dünyanın en büyük yağmur ormanı Amazon'un %60'ına ev sahipliği yapar ve futbolda 5 Dünya Kupası kazanan tek ülkedir."
  },
  {
    code: 'ca',
    name: 'Kanada',
    capital: 'Ottawa',
    region: 'Kuzey Amerika',
    funFact: "Dünyadaki tüm doğal göllerin yarısından fazlasına sahiptir ve 202.080 kilometre ile dünyanın en uzun sahil şeridine sahiptir."
  },
  {
    code: 'cl',
    name: 'Şili',
    capital: 'Santiago',
    region: 'Güney Amerika',
    funFact: "Kuzeyindeki Atacama Çölü dünyanın en kurak çölüdür; bazı istasyonlarında tarihte hiç yağmur kaydedilmemiştir."
  },
  {
    code: 'co',
    name: 'Kolombiya',
    capital: 'Bogota',
    region: 'Güney Amerika',
    funFact: "Dünyadaki en kaliteli zümrütlerin ana kaynağıdır ve hem Pasifik Okyanusu'na hem de Karayip Denizi'ne kıyısı olan tek Güney Amerika ülkesidir."
  },
  {
    code: 'cr',
    name: 'Kosta Rika',
    capital: 'San Jose',
    region: 'Kuzey Amerika',
    funFact: "1948 yılından beri ordusunu tamamen lağvetmiş barışçıl bir ülkedir ve tükettiği elektriğin %99'unu yenilenebilir kaynaklardan üretir."
  },
  {
    code: 'cu',
    name: 'Küba',
    capital: 'Havana',
    region: 'Kuzey Amerika',
    funFact: "Sokaklarında çalışan binlerce klasik 1950'ler Amerikan arabasıyla açık hava müzesi gibidir ve okuma yazma oranı %99.8'dir."
  },
  {
    code: 'dm',
    name: 'Dominika',
    capital: 'Roseau',
    region: 'Kuzey Amerika',
    funFact: "El değmemiş doğasıyla 'Karayiplerin Doğa Adası' olarak anılır ve dünyanın en büyük ikinci kaynayan gölü (Boiling Lake) buradadır."
  },
  {
    code: 'do',
    name: 'Dominik Cumhuriyeti',
    capital: 'Santo Domingo',
    region: 'Kuzey Amerika',
    funFact: "Amerika kıtasında inşa edilen ilk Katolik katedrali, ilk kale ve ilk üniversite 1500'lerin başında Santo Domingo'da yapılmıştır."
  },
  {
    code: 'ec',
    name: 'Ekvador',
    capital: 'Kito',
    region: 'Güney Amerika',
    funFact: "Charles Darwin'e Evrim Teorisi için ilham veren Galapagos Adaları Ekvador'a aittir ve ülke adını Ekvator çizgisinden almıştır."
  },
  {
    code: 'sv',
    name: 'El Salvador',
    capital: 'San Salvador',
    region: 'Kuzey Amerika',
    funFact: "Onlarca aktif yanardağı nedeniyle 'Volkanlar Ülkesi' olarak anılır ve 2021'de Bitcoin'i resmi para birimi ilan eden ilk devlettir."
  },
  {
    code: 'gd',
    name: 'Grenada',
    capital: "Saint George's",
    region: 'Kuzey Amerika',
    funFact: "Küçük hindistancevizi (muskat) ve tarçın kokulu bahçeleri nedeniyle 'Baharat Adası' olarak anılır."
  },
  {
    code: 'gt',
    name: 'Guatemala',
    capital: 'Guatemala',
    region: 'Kuzey Amerika',
    funFact: "Antik Maya uygarlığının kalbidir; çikolata ilk kez Mayalar tarafından kutsal bir acı içecek olarak burada tüketilmiştir."
  },
  {
    code: 'gy',
    name: 'Guyana',
    capital: 'Georgetown',
    region: 'Güney Amerika',
    funFact: "Güney Amerika kıtasında resmi dili İngilizce olan tek devlettir ve 226 metre serbest düşüş yapan görkemli Kaieteur Şelalesi buradadır."
  },
  {
    code: 'ht',
    name: 'Haiti',
    capital: 'Port-au-Prince',
    region: 'Kuzey Amerika',
    funFact: "1804 yılında kölelerin başlattığı devrimle bağımsızlığını kazanan dünyanın ilk siyah cumhuriyetidir."
  },
  {
    code: 'hn',
    name: 'Honduras',
    capital: 'Tegucigalpa',
    region: 'Kuzey Amerika',
    funFact: "Yoro kasabasında her yaz şiddetli fırtınanın ardından gökten canlı gümüş balıkların yağdığı doğa olayıyla (Lluvia de Peces) tanınır."
  },
  {
    code: 'jm',
    name: 'Jamaika',
    capital: 'Kingston',
    region: 'Kuzey Amerika',
    funFact: "Reggae müziğin efsanesi Bob Marley'nin anavatanıdır ve Usain Bolt gibi dünyanın gelmiş geçmiş en hızlı sprinterlerini yetiştirmiştir."
  },
  {
    code: 'mx',
    name: 'Meksika',
    capital: 'Meksiko',
    region: 'Kuzey Amerika',
    funFact: "Çikolata, mısır, domates, acı biber ve vanilya dünyaya Meksika'dan yayılmıştır; başkenti antik Texcoco gölü üzerine inşa edilmiştir."
  },
  {
    code: 'ni',
    name: 'Nikaragua',
    capital: 'Managua',
    region: 'Kuzey Amerika',
    funFact: "İçinde okyanus köpekbalıklarının tatlı suya uyum sağlayarak yaşadığı dünyadaki tek büyük tatlı su gölü olan Nikaragua Gölü buradadır."
  },
  {
    code: 'pa',
    name: 'Panama',
    capital: 'Panama City',
    region: 'Kuzey Amerika',
    funFact: "Atlas ve Pasifik Okyanusu'nu birleştiren Panama Kanalı'na ev sahipliği yapar ve güneşin Pasifik'ten doğup Atlantik'ten battığı tek ülkedir."
  },
  {
    code: 'py',
    name: 'Paraguay',
    capital: 'Asuncion',
    region: 'Güney Amerika',
    funFact: "Yerli dili Guarani'yi nüfusunun %90'ının konuştuğu ve İspanyolca ile eşit anayasal resmi dil sayan Latin Amerika'daki tek ülkedir."
  },
  {
    code: 'pe',
    name: 'Peru',
    capital: 'Lima',
    region: 'Güney Amerika',
    funFact: "Bulutların üzerindeki İnka harikası Machu Picchu Peru'dadır ve ülkede 3.000'den fazla yerel patates çeşidi yetiştirilir."
  },
  {
    code: 'kn',
    name: 'Saint Kitts ve Nevis',
    capital: 'Basseterre',
    region: 'Kuzey Amerika',
    funFact: "Hem yüzölçümü (261 km²) hem de nüfus (50.000 kişi) bakımından tüm Amerika kıtasının en küçük bağımsız devletidir."
  },
  {
    code: 'lc',
    name: 'Saint Lucia',
    capital: 'Castries',
    region: 'Kuzey Amerika',
    funFact: "Adını tarihteki gerçek bir kadından (Azize Lucia) alan dünyadaki tek ülkedir ve arabayla içine girilebilen aktif sülfür yanardağına sahiptir."
  },
  {
    code: 'vc',
    name: 'Saint Vincent ve Grenadinler',
    capital: 'Kingstown',
    region: 'Kuzey Amerika',
    funFact: "Karayip Korsanları filmlerinin birçoğunun çekildiği kristal lagünlere ve Tobago Cays deniz koruma alanına ev sahipliği yapar."
  },
  {
    code: 'sr',
    name: 'Surinam',
    capital: 'Paramaribo',
    region: 'Güney Amerika',
    funFact: "Yüzölçümünün %93'ü el değmemiş balta girmemiş yağmur ormanlarıyla kaplıdır ve Güney Amerika'da resmi dili Felemenkçe olan tek ülkedir."
  },
  {
    code: 'tt',
    name: 'Trinidad ve Tobago',
    capital: 'Port of Spain',
    region: 'Kuzey Amerika',
    funFact: "20. yüzyılda icat edilen tek yeni akustik müzik aleti olan çelik petrol varili davulu (Steelpan) burada doğmuştur."
  },
  {
    code: 'uy',
    name: 'Uruguay',
    capital: 'Montevideo',
    region: 'Güney Amerika',
    funFact: "1930'da ilk FIFA Dünya Kupası'na ev sahipliği yapıp şampiyon olmuştur ve dünyada her ilkokul öğrencisine ücretsiz dizüstü bilgisayar veren ilk devlettir."
  },
  {
    code: 've',
    name: 'Venezuela',
    capital: 'Karakas',
    region: 'Güney Amerika',
    funFact: "979 metre yükseklikten dökülen Angel Şelalesi, yeryüzünün en yüksek kesintisiz şelalesidir; suyu aşağıya inmeden sise dönüşür."
  },

  // --- OKYANUSYA (14 BM Üyesi) ---
  {
    code: 'au',
    name: 'Avustralya',
    capital: 'Canberra',
    region: 'Okyanusya',
    funFact: "Uzaydan görülebilen 2.300 km'lik Büyük Set Resifi buradadır ve kıtada yaşayan vahşi kanguru sayısı insan nüfusunun neredeyse iki katıdır."
  },
  {
    code: 'fj',
    name: 'Fiji',
    capital: 'Suva',
    region: 'Okyanusya',
    funFact: "180 derece boylamı (tarih değiştirme çizgisi) Taveuni adasından geçer; böylece tek adımla bugünden düne geçebilirsiniz."
  },
  {
    code: 'ki',
    name: 'Kiribati',
    capital: 'Güney Tarawa',
    region: 'Okyanusya',
    funFact: "Dünyada dört yarımkürenin (kuzey, güney, doğu, batı) tamamında toprağı olan tek devlettir ve her yeni yıla ilk giren ülkedir."
  },
  {
    code: 'mh',
    name: 'Marshall Adaları',
    capital: 'Majuro',
    region: 'Okyanusya',
    funFact: "Mercan atolleri üzerine kuruludur ve yaklaşık 2 milyon kilometrekarelik alanıyla dünyanın en büyük köpekbalığı koruma bölgesine sahiptir."
  },
  {
    code: 'fm',
    name: 'Mikronezya',
    capital: 'Palikir',
    region: 'Okyanusya',
    funFact: "Okyanus üzerinde bazalt taş bloklarla inşa edilmiş gizemli kanallı antik şehir Nan Madol ('Pasifik'in Venedik'i') buradadır."
  },
  {
    code: 'nr',
    name: 'Nauru',
    capital: 'Yaren',
    region: 'Okyanusya',
    funFact: "21 kilometrekarelik yüzölçümüyle dünyanın en küçük bağımsız ada cumhuriyetidir ve resmi olarak kanunen belirlenmiş bir başkenti yoktur."
  },
  {
    code: 'nz',
    name: 'Yeni Zelanda',
    capital: 'Wellington',
    region: 'Okyanusya',
    funFact: "1893 yılında kadınlara genel oy hakkı tanıyan tarihteki ilk bağımsız ülkedir; uçamayan sevimli kivi kuşu ülkenin simgesidir."
  },
  {
    code: 'pw',
    name: 'Palau',
    capital: 'Ngerulmud',
    region: 'Okyanusya',
    funFact: "Milyonlarca yıldır yırtıcılardan izole yaşadığı için yakıcı iğnelerini kaybetmiş altın denizanalarıyla yüzülebilen ünlü Denizanası Gölü buradadır."
  },
  {
    code: 'pg',
    name: 'Papua Yeni Gine',
    capital: 'Port Moresby',
    region: 'Okyanusya',
    funFact: "Ülkede 840'tan fazla farklı yerli dil konuşulur ve yeryüzünün dilsel açıdan en zengin ve en çeşitli ülkesidir."
  },
  {
    code: 'ws',
    name: 'Samoa',
    capital: 'Apia',
    region: 'Okyanusya',
    funFact: "3.000 yıllık geleneksel el dövmesi sanatı 'Tatau'nun doğduğu yerdir; 'dövme' (tattoo) kelimesi dünya dillerine buradan yayılmıştır."
  },
  {
    code: 'sb',
    name: 'Solomon Adaları',
    capital: 'Honiara',
    region: 'Okyanusya',
    funFact: "Afrika dışındaki yerli halkta doğal sarı saç genine (TYRP1 mutasyonu) sahip insanların en sık görüldüğü tropikal adalardır."
  },
  {
    code: 'to',
    name: 'Tonga',
    capital: "Nuku'alofa",
    region: 'Okyanusya',
    funFact: "Güney Pasifik'te Avrupalı güçler tarafından hiçbir zaman sömürgeleştirilmemiş ve kendi yerli monarşisini korumuş tek ada krallığıdır."
  },
  {
    code: 'tv',
    name: 'Tuvalu',
    capital: 'Funafuti',
    region: 'Okyanusya',
    funFact: "İnternetteki popüler '.tv' ülke kodu alan adının sahibidir ve bu alan adının lisans gelirleri ülke bütçesinin önemli kısmını finanse eder."
  },
  {
    code: 'vu',
    name: 'Vanuatu',
    capital: 'Port Vila',
    region: 'Okyanusya',
    funFact: "Modern bungy-jumping sporuna ilham veren ve ayaklarına sarmaşık bağlayarak 30 metrelik ahşap kuleden atlanan 'Naghol' geleneğinin yurdudur."
  }
];

export const getFlagUrl = (code: string) => `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
