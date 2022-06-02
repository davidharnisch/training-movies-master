# training-movies

*This is backend for client side development training. It is not meant for real use.*

## Instalace

K spuštění backendu budete potřebovat mít instalován https://nodejs.org/, stačí LTS verze.

1. Naklonovat si repository
1. `npm install --production` v adresáři, kde je umístěn package.json nainstaluje použité npm moduly.
1. `npm start` spustí webserver, který bude dostupný na adrese http://localhost:8080/

## Zadání práce

Vytvořte webovou aplikaci pro evidenci shlédnutých filmů a seriálů spolu s jejich hodnocením. Aplikace umožňuje filmy a seriály prohlížet, přidávat, upravovat a mazat. Filmy i seriály je možno hodnotit. U seriálů je možné hodnotit i jednotlivé díly.

V aplikaci je možné evidovat následující data (`[]` značí, že se jedná o více možných hodnot, `?` označuje pole, která nejsou povinná):

### Movie

    id?: string
    name: string
    type: string
    yearOfRelease?: number
    mainDirector?: string
    starring?[]:
        actorName: string
    genres?[]:
        genre: string
    description?: string
    rating?:
        dateOfWatching?: date
        seenItWhole: boolean
        score: number

Atribut `id` uživatel nevyplňuje, přiděluje ho server.

Atribut type musí mít hodnotu "movie" nebo "series". Klient by měl zároveň kontrolovat, že `yearOfRelease` spadá do rozumného časového rozsahu (rozhodněte se sami, co považujete za rozumný rozsah). Pro genre si může klient připravit výčet hodnot, nebo je nechat uživateli zadat. `Description` by měl mít uživatel možnost zadat víceřádkovým textem. `Rating` je hodnocení uživatelem (může vyplnit, kdy to viděl, zda shlédnul celé, a nějaké `score`). Jakých hodnot nabývá `score` (zda menší je lepší či obráceně a v jakém rozsahu) je na Vašem rozhodnutí.

### Series

Seriál má stejná data jako film. Navíc ještě kolekci sezón a v ní kolekci dílů. Každý díl může mít vlastní rating.

    seasons[]:
        number: number
        episodes[]:
            episodeName?: string
            rating?:
                dateOfWatching?: date
                seenItWhole: boolean
                score: number

## UI

UI by mělo poskytovat dobrou "user experience". Můžete samozřejmě řešit písma, barvy, obrázky, ale to není v tomto případě důležitým kritériem. Podstatná je především přehlednost UI, intuitivnost a celkové ovládání aplikace.

### Seznam filmů/seriálů

Aplikace by měla při spuštění zobrazit seznam filmů. Nad tímto seznamem jde filtrovat těmito způsoby:

- uživatel zadá třeba jen částečný název některého z herců (starring); implementujte ručně pomocí textboxu
- uživatel může zvolit, že chce vidět jen filmy nebo jen seriály

Seznam nemusí být stránkován.

### Detail

Ze seznamu je možné se dostat na detail, kde jsou zobrazeny a je možné tam upravovat informace k danému záznamu. Formulář by měl kontrolovat správnost dat, čili povinnosti polí, neměl by filmům umožnit mít sezóny dílů apod. V průběhu editace by mělo být možné změnit typ záznamu z filmu na seriál a obráceně. V takovém případě ale uživatel potenciálně ztrácí informaci o sezónách a dílech, protože film to mít nemůže. Před smazáním dat by tedy měl uživatel potvrdit, že to opravdu chce. Ve chvíli, kdy klient odesílá vytvořená nebo upravená data na server, nemělo by se už stát, že by typ film měl atributy, které na něj nepatří.

Stejně jako úprava záznamů je možné záznamy i přidávat a mazat. Ze které obrazovky bude možné záznamy mazat už je na Vás.

### Statistiky

Ze seznamu se uživatel může přepnout na stránku statistik, kde se zobrazují nějaká smysluplná agregovaná data. Z této stránky se jde přepnout zpět na seznam, případně prokliknout na detail filmu/seriálu. Tato stránka by měla zobrazovat

- celkový počet filmů (s rozpadem podle toho, zda je uživatel shlédnul celé nebo ne)
- celkový počet seriálů (opět s rozpadem)
- tři filmy a tři seriály s nejlepším hodnocením

Vedle toho najděte ještě alespoň tři další statistiky/reporty, které budou aspoň trochu smysluplné.

### Další funkce

- seznam, detail a statistiky by měly být samostatné formuláře
- použijte breadcrumbs pro přehlednější navigaci mezi formuláři
- uživatel by měl mít možnost použít back/forward pro pohyb mezi formuláři a měl by mít možnost si třeba uložit url na detail konkrétního filmu/seriálu (použijte urlRouter)
- kdykoli se načítají či ukládají data, měla by aplikace tento prostoj indikovat uživateli (použijte busyindicator)
- pokud by kdekoli při zadávání či úpravě dat mohl uživatel přijít o zadávaná data (např. pokud stiskne nějakou komponentu pro navigaci), nemělo by se to stát bez toho, že ho na to aplikace nejprve upozorní a dá mu možnost takovou operaci zrušit; toto neplatí pro triviální věci jako je vyhledávací pole

## API

Backend server běží na adrese http://localhost:8080/. Vystavuje následující služby:

- `http://localhost:8080/list` (GET - vrací jen základní údaje o dílech)
- `http://localhost:8080/record?id=`*(začátek názvu díla)* (GET - vrací všechna data daného záznamu)
- `http://localhost:8080/create` (POST s obsahem Movie nebo Series)
- `http://localhost:8080/update` (POST s obsahem Movie nebo Series)
- `http://localhost:8080/delete` (POST s objektem `{ "id": `*(id záznamu, který má být smazán)* `})`

Pokud se operace zdaří, vrací server status code **200 OK**. Pokud služba record nenanjde záznam s daným ID vrací **404 Not Found**. Pokud služby `create`, `update` či `delete` dostanou nekorektní data, vrazí server status **400 Bad request**. Pokud došlo při práci serveru k nějaké jiné chybě, vrací **500 Internal Server Error**. Chybové odpovědi navíc mohou obsahovat objekt s popisem chyby ve formátu `{ "error": "`(*popis chyby*)`" }`.

Služby `create` a `update` vrací výsledný záznam. To je důležité především u `create`, při které dojde k přidělení id.

Server si ukládá data do souboru data.json. Tento soubor lze tedy smazat nebo naopak předvyplnit. Pokud soubor neexistuje nebo má nekorektní strukturu server ho automaticky smaže a založí prázdný s několika výchozími filmy (ty je samozřejmě možné smazat).
