// Sistema di traduzione multilingue per la Mappa delle Pietre
const translations = {
    it: {
        // Header
        title: "Mappa delle Pietre",
        subtitle: "Esplora la storia attraverso il tempo",
        
        // Controls
        selectStone: "Seleziona una pietra:",
        showAll: "Mostra tutte",
        showImages: "Mostra immagini:",
        lastImage: "Ultima",
        noImages: "Nessuna",
        allImages: "Tutte",
        
        // Loading
        loadingMap: "Caricamento mappa...",
        
        // History Panel
        historyOf: "Storia di",
        close: "Chiudi",
        historicalPath: "Percorso storico",
        currentPosition: "Posizione attuale",
        historicalRoute: "Percorso storico",
        timelineMovements: "Timeline degli spostamenti",
        start: "Inizio",
        currentDate: "Data attuale",
        end: "Fine",
        
        // Navigation buttons
        play: "Play",
        pause: "Pausa",
        previous: "Precedente",
        next: "Successiva",
        
        // Popup
        lastPosition: "Ultima posizione:",
        seeHistory: "Vedi la storia",
        
        // Counter
        of: "di",
        
        // Accessibility
        selectStoneAriaLabel: "Seleziona una pietra da visualizzare",
        selectImagesAriaLabel: "Seleziona modalità visualizzazione immagini",
        mapAriaLabel: "Mappa interattiva delle pietre",
        closeHistoryAriaLabel: "Chiudi pannello storia",
        fullscreenAriaLabel: "Visualizza a schermo intero",
        closeFullscreenAriaLabel: "Chiudi visualizzazione a schermo intero",
        playPauseAriaLabel: "Riproduci/Pausa automatica",
        previousAriaLabel: "Immagine precedente",
        nextAriaLabel: "Immagine successiva",
        miniMapAriaLabel: "Mini mappa del percorso",
        timelineAriaLabel: "Timeline degli spostamenti della pietra",
        
        // Language selector
        selectLanguage: "Seleziona lingua:",
        
        // Tutorial Guide
        tutorialWelcome: "Benvenuto nella Mappa delle Pietre!",
        tutorialExploreMap: "Esplora la Mappa",
        tutorialExploreMapDesc: "Questa mappa interattiva ti permette di seguire il viaggio delle pietre attraverso il tempo. Ogni pietra ha una sua storia unica da raccontare.",
        tutorialSelectStone: "Seleziona una Pietra",
        tutorialSelectStoneDesc: "Usa il menu a tendina in alto per selezionare una pietra specifica o visualizzare tutte le pietre contemporaneamente. Ogni pietra ha un colore distintivo.",
        tutorialViewImages: "Visualizza le Immagini",
        tutorialViewImagesDesc: "Puoi scegliere di mostrare tutte le immagini, solo l'ultima o nessuna immagine. Le immagini sono rappresentate da marcatori circolari sulla mappa.",
        tutorialDiscoverHistory: "Scopri la Storia",
        tutorialDiscoverHistoryDesc: "Clicca su una pietra per vedere il popup informativo, poi clicca su \"Vedi la storia\" per aprire il pannello dettagliato con timeline e galleria immagini.",
        tutorialChangeLanguage: "Cambia Lingua",
        tutorialChangeLanguageDesc: "Il sito supporta multiple lingue. Usa il selettore lingua in alto per cambiare l'interfaccia nella tua lingua preferita.",
        tutorialStartExploring: "Inizia l'Esplorazione!",
        tutorialStartExploringDesc: "Ora sei pronto per esplorare la mappa! Ricorda che puoi sempre riaprire questa guida cliccando sul pulsante \"?\" nell'angolo in basso a destra.",
        tutorialPrevious: "Precedente",
        tutorialNext: "Avanti",
        tutorialSkip: "Salta",
        tutorialStart: "Inizia!",
        tutorialClose: "Chiudi guida",
        tutorialHelp: "Guida",
        
        // About Us
        aboutUs: "Chi Siamo",
        aboutUsTitle: "Chi Siamo",
        aboutUsDescription1: "Benvenuti nel progetto <b>Mappa delle Pietre</b>! Questo progetto nasce da un'idea semplice ma profonda: trasformare oggetti comuni, come i sassi, in veicoli di gioia e connessione. L'obiettivo principale è regalare un sorriso a chi trova una delle nostre pietre viaggianti e, allo stesso tempo, creare una rete invisibile di persone che condividono un piccolo gesto di felicità.",
        aboutUsDescription2: "Ogni sasso che vedi sulla mappa ha una storia. È stato dipinto con cura, nascosto in un luogo speciale e poi trovato da qualcuno che ha deciso di farlo viaggiare ancora. Il nostro desiderio è che queste pietre continuino il loro percorso, portando un messaggio di positività e avventura in ogni angolo del mondo. È un modo per unire le persone attraverso la curiosità e la sorpresa, dimostrando come anche le cose più piccole possano generare un impatto significativo.",
        aboutUsDescription3: "Unisciti a noi in questa avventura! Puoi trovare una pietra, nasconderne una nuova, o semplicemente seguire il viaggio delle pietre esistenti sulla mappa. Ogni interazione contribuisce a rendere il mondo un posto un po' più magico e sorridente.",
        instagramFollow: "Seguici su Instagram per aggiornamenti e nuove pietre:",
        backToMap: "Torna alla Mappa"
    },
    
    en: {
        // Header
        title: "Stone Map",
        subtitle: "Explore history through time",
        
        // Controls
        selectStone: "Select a stone:",
        showAll: "Show all",
        showImages: "Show images:",
        lastImage: "Last",
        noImages: "None",
        allImages: "All",
        
        // Loading
        loadingMap: "Loading map...",
        
        // History Panel
        historyOf: "History of",
        close: "Close",
        historicalPath: "Historical path",
        currentPosition: "Current position",
        historicalRoute: "Historical route",
        timelineMovements: "Movement timeline",
        start: "Start",
        currentDate: "Current date",
        end: "End",
        
        // Navigation buttons
        play: "Play",
        pause: "Pause",
        previous: "Previous",
        next: "Next",
        
        // Popup
        lastPosition: "Last position:",
        seeHistory: "See history",
        
        // Counter
        of: "of",
        
        // Accessibility
        selectStoneAriaLabel: "Select a stone to display",
        selectImagesAriaLabel: "Select image display mode",
        mapAriaLabel: "Interactive stone map",
        closeHistoryAriaLabel: "Close history panel",
        fullscreenAriaLabel: "View fullscreen",
        closeFullscreenAriaLabel: "Close fullscreen view",
        playPauseAriaLabel: "Play/Pause automatic",
        previousAriaLabel: "Previous image",
        nextAriaLabel: "Next image",
        miniMapAriaLabel: "Mini route map",
        timelineAriaLabel: "Stone movement timeline",
        
        // Language selector
        selectLanguage: "Select language:",
        
        // Tutorial Guide
        tutorialWelcome: "Welcome to the Stone Map!",
        tutorialExploreMap: "Explore the Map",
        tutorialExploreMapDesc: "This interactive map allows you to follow the journey of stones through time. Each stone has its own unique story to tell.",
        tutorialSelectStone: "Select a Stone",
        tutorialSelectStoneDesc: "Use the dropdown menu at the top to select a specific stone or view all stones simultaneously. Each stone has a distinctive color.",
        tutorialViewImages: "View Images",
        tutorialViewImagesDesc: "You can choose to show all images, only the last one, or no images. Images are represented by circular markers on the map.",
        tutorialDiscoverHistory: "Discover the History",
        tutorialDiscoverHistoryDesc: "Click on a stone to see the information popup, then click \"See history\" to open the detailed panel with timeline and image gallery.",
        tutorialChangeLanguage: "Change Language",
        tutorialChangeLanguageDesc: "The site supports multiple languages. Use the language selector at the top to change the interface to your preferred language.",
        tutorialStartExploring: "Start Exploring!",
        tutorialStartExploringDesc: "Now you're ready to explore the map! Remember you can always reopen this guide by clicking the \"?\" button in the bottom right corner.",
        tutorialPrevious: "Previous",
        tutorialNext: "Next",
        tutorialSkip: "Skip",
        tutorialStart: "Start!",
        tutorialClose: "Close guide",
        tutorialHelp: "Guide",
        
        // About Us
        aboutUs: "About Us",
        aboutUsTitle: "About Us",
        aboutUsDescription1: "Welcome to the <b>Stone Map</b> project! This project stems from a simple yet profound idea: transforming common objects, like stones, into vehicles of joy and connection. The main goal is to bring a smile to those who find one of our traveling stones and, at the same time, create an invisible network of people sharing a small gesture of happiness.",
        aboutUsDescription2: "Every stone you see on the map has a story. It was carefully painted, hidden in a special place, and then found by someone who decided to make it travel again. Our wish is for these stones to continue their journey, carrying a message of positivity and adventure to every corner of the world. It's a way to unite people through curiosity and surprise, showing how even the smallest things can generate a significant impact.",
        aboutUsDescription3: "Join us in this adventure! You can find a stone, hide a new one, or simply follow the journey of existing stones on the map. Every interaction contributes to making the world a little more magical and cheerful.",
        instagramFollow: "Follow us on Instagram for updates and new stones:",
        backToMap: "Back to Map"
    },
    
    zh: {
        // Header
        title: "石头地图",
        subtitle: "穿越时间探索历史",
        
        // Controls
        selectStone: "选择石头：",
        showAll: "显示全部",
        showImages: "显示图片：",
        lastImage: "最后",
        noImages: "无",
        allImages: "全部",
        
        // Loading
        loadingMap: "加载地图中...",
        
        // History Panel
        historyOf: "历史记录",
        close: "关闭",
        historicalPath: "历史路径",
        currentPosition: "当前位置",
        historicalRoute: "历史路线",
        timelineMovements: "移动时间线",
        start: "开始",
        currentDate: "当前日期",
        end: "结束",
        
        // Navigation buttons
        play: "播放",
        pause: "暂停",
        previous: "上一个",
        next: "下一个",
        
        // Popup
        lastPosition: "最后位置：",
        seeHistory: "查看历史",
        
        // Counter
        of: "的",
        
        // Accessibility
        selectStoneAriaLabel: "选择要显示的石头",
        selectImagesAriaLabel: "选择图片显示模式",
        mapAriaLabel: "交互式石头地图",
        closeHistoryAriaLabel: "关闭历史面板",
        fullscreenAriaLabel: "全屏查看",
        closeFullscreenAriaLabel: "关闭全屏视图",
        playPauseAriaLabel: "播放/暂停自动",
        previousAriaLabel: "上一张图片",
        nextAriaLabel: "下一张图片",
        miniMapAriaLabel: "迷你路线地图",
        timelineAriaLabel: "石头移动时间线",
        
        // Language selector
        selectLanguage: "选择语言：",
        
        // Tutorial Guide
        tutorialWelcome: "欢迎来到石头地图！",
        tutorialExploreMap: "探索地图",
        tutorialExploreMapDesc: "这张互动地图让您追溯石头穿越时间的旅程。每块石头都有其独特的故事。",
        tutorialSelectStone: "选择一块石头",
        tutorialSelectStoneDesc: "使用顶部的下拉菜单选择一块特定的石头或同时查看所有石头。每块石头都有其独特的颜色。",
        tutorialViewImages: "查看图片",
        tutorialViewImagesDesc: "您可以选择显示所有图片、只显示最后一张或不显示任何图片。图片由地图上的圆形标记表示。",
        tutorialDiscoverHistory: "发现历史",
        tutorialDiscoverHistoryDesc: "点击一块石头查看信息弹出窗口，然后点击“查看历史”打开包含时间线和图片库的详细面板。",
        tutorialChangeLanguage: "更改语言",
        tutorialChangeLanguageDesc: "本网站支持多种语言。使用顶部的语言选择器将界面更改为您喜欢的语言。",
        tutorialStartExploring: "开始探索！",
        tutorialStartExploringDesc: "现在您已准备好探索地图！请记住，您可以随时点击右下角的“？”按钮重新打开本指南。",
        tutorialPrevious: "上一步",
        tutorialNext: "下一步",
        tutorialSkip: "跳过",
        tutorialStart: "开始！",
        tutorialClose: "关闭指南",
        tutorialHelp: "指南",
        
        // About Us
        aboutUs: "关于我们",
        aboutUsTitle: "关于我们",
        aboutUsDescription1: "欢迎来到<b>石头地图</b>项目！这个项目源于一个简单而深刻的想法：将普通物品（如石头）转化为快乐和连接的载体。主要目标是为那些找到我们旅行石头的人带来微笑，同时创建一个分享小小幸福手势的无形人际网络。",
        aboutUsDescription2: "地图上的每一块石头都有自己的故事。它被精心绘制，藏在特殊的地方，然后被决定让它继续旅行的人发现。我们希望这些石头继续它们的旅程，将积极和冒险的信息带到世界的每一个角落。这是通过好奇心和惊喜团结人们的方式，展示了即使是最小的事物也能产生重大影响。",
        aboutUsDescription3: "加入我们的冒险吧！你可以找到一块石头，藏一块新的，或者简单地跟随地图上现有石头的旅程。每一次互动都有助于让世界变得更加神奇和快乐。",
        instagramFollow: "在Instagram上关注我们获取更新和新石头：",
        backToMap: "返回地图"
    },
    
    fr: {
        // Header
        title: "Carte des Pierres",
        subtitle: "Explorez l'histoire à travers le temps",
        
        // Controls
        selectStone: "Sélectionnez une pierre :",
        showAll: "Afficher toutes",
        showImages: "Afficher les images :",
        lastImage: "Dernière",
        noImages: "Aucune",
        allImages: "Toutes",
        
        // Loading
        loadingMap: "Chargement de la carte...",
        
        // History Panel
        historyOf: "Histoire de",
        close: "Fermer",
        historicalPath: "Chemin historique",
        currentPosition: "Position actuelle",
        historicalRoute: "Route historique",
        timelineMovements: "Chronologie des déplacements",
        start: "Début",
        currentDate: "Date actuelle",
        end: "Fin",
        
        // Navigation buttons
        play: "Lecture",
        pause: "Pause",
        previous: "Précédent",
        next: "Suivant",
        
        // Popup
        lastPosition: "Dernière position :",
        seeHistory: "Voir l'histoire",
        
        // Counter
        of: "de",
        
        // Accessibility
        selectStoneAriaLabel: "Sélectionnez une pierre à afficher",
        selectImagesAriaLabel: "Sélectionnez le mode d'affichage des images",
        mapAriaLabel: "Carte interactive des pierres",
        closeHistoryAriaLabel: "Fermer le panneau d'histoire",
        fullscreenAriaLabel: "Voir en plein écran",
        closeFullscreenAriaLabel: "Fermer la vue plein écran",
        playPauseAriaLabel: "Lecture/Pause automatique",
        previousAriaLabel: "Image précédente",
        nextAriaLabel: "Image suivante",
        miniMapAriaLabel: "Mini carte du parcours",
        timelineAriaLabel: "Chronologie des déplacements de la pierre",
        
        // Language selector
        selectLanguage: "Sélectionnez la langue :",
        
        // Tutorial Guide
        tutorialWelcome: "Bienvenue sur la Carte des Pierres !",
        tutorialExploreMap: "Explorez la Carte",
        tutorialExploreMapDesc: "Cette carte interactive vous permet de suivre le voyage des pierres à travers le temps. Chaque pierre a sa propre histoire unique à raconter.",
        tutorialSelectStone: "Sélectionnez une Pierre",
        tutorialSelectStoneDesc: "Utilisez le menu déroulant en haut pour sélectionner une pierre spécifique ou afficher toutes les pierres simultanément. Chaque pierre a une couleur distinctive.",
        tutorialViewImages: "Visualisez les Images",
        tutorialViewImagesDesc: "Vous pouvez choisir d'afficher toutes les images, seulement la dernière, ou aucune image. Les images sont représentées par des marqueurs circulaires sur la carte.",
        tutorialDiscoverHistory: "Découvrez l'Histoire",
        tutorialDiscoverHistoryDesc: "Cliquez sur une pierre pour voir la fenêtre contextuelle d'informations, puis cliquez sur \"Voir l'histoire\" pour ouvrir le panneau détaillé avec la chronologie et la galerie d'images.",
        tutorialChangeLanguage: "Changez de Langue",
        tutorialChangeLanguageDesc: "Le site prend en charge plusieurs langues. Utilisez le sélecteur de langue en haut pour changer l'interface dans votre langue préférée.",
        tutorialStartExploring: "Commencez l'Exploration !",
        tutorialStartExploringDesc: "Vous êtes maintenant prêt à explorer la carte ! N'oubliez pas que vous pouvez toujours rouvrir ce guide en cliquant sur le bouton \"?\" dans le coin inférieur droit.",
        tutorialPrevious: "Précédent",
        tutorialNext: "Suivant",
        tutorialSkip: "Passer",
        tutorialStart: "Commencer !",
        tutorialClose: "Fermer le guide",
        tutorialHelp: "Guide",
        
        // About Us
        aboutUs: "À Propos",
        aboutUsTitle: "À Propos",
        aboutUsDescription1: "Bienvenue dans le projet <b>Carte des Pierres</b> ! Ce projet naît d'une idée simple mais profonde : transformer des objets communs, comme les pierres, en véhicules de joie et de connexion. L'objectif principal est d'offrir un sourire à ceux qui trouvent une de nos pierres voyageuses et, en même temps, créer un réseau invisible de personnes partageant un petit geste de bonheur.",
        aboutUsDescription2: "Chaque pierre que vous voyez sur la carte a une histoire. Elle a été peinte avec soin, cachée dans un lieu spécial puis trouvée par quelqu'un qui a décidé de la faire voyager encore. Notre souhait est que ces pierres continuent leur parcours, portant un message de positivité et d'aventure dans tous les coins du monde. C'est une façon d'unir les gens à travers la curiosité et la surprise, montrant comment même les plus petites choses peuvent générer un impact significatif.",
        aboutUsDescription3: "Rejoignez-nous dans cette aventure ! Vous pouvez trouver une pierre, en cacher une nouvelle, ou simplement suivre le voyage des pierres existantes sur la carte. Chaque interaction contribue à rendre le monde un peu plus magique et souriant.",
        instagramFollow: "Suivez-nous sur Instagram pour les mises à jour et nouvelles pierres :",
        backToMap: "Retour à la Carte"
    },
    
    ru: {
        // Header
        title: "Карта Камней",
        subtitle: "Исследуйте историю сквозь время",
        
        // Controls
        selectStone: "Выберите камень:",
        showAll: "Показать все",
        showImages: "Показать изображения:",
        lastImage: "Последнее",
        noImages: "Нет",
        allImages: "Все",
        
        // Loading
        loadingMap: "Загрузка карты...",
        
        // History Panel
        historyOf: "История",
        close: "Закрыть",
        historicalPath: "Исторический путь",
        currentPosition: "Текущая позиция",
        historicalRoute: "Исторический маршрут",
        timelineMovements: "Временная шкала перемещений",
        start: "Начало",
        currentDate: "Текущая дата",
        end: "Конец",
        
        // Navigation buttons
        play: "Воспроизвести",
        pause: "Пауза",
        previous: "Предыдущий",
        next: "Следующий",
        
        // Popup
        lastPosition: "Последняя позиция:",
        seeHistory: "Посмотреть историю",
        
        // Counter
        of: "из",
        
        // Accessibility
        selectStoneAriaLabel: "Выберите камень для отображения",
        selectImagesAriaLabel: "Выберите режим отображения изображений",
        mapAriaLabel: "Интерактивная карта камней",
        closeHistoryAriaLabel: "Закрыть панель истории",
        fullscreenAriaLabel: "Просмотр в полноэкранном режиме",
        closeFullscreenAriaLabel: "Закрыть полноэкранный просмотр",
        playPauseAriaLabel: "Воспроизведение/Пауза автоматически",
        previousAriaLabel: "Предыдущее изображение",
        nextAriaLabel: "Следующее изображение",
        miniMapAriaLabel: "Мини-карта маршрута",
        timelineAriaLabel: "Временная шкала перемещений камня",
        
        // Language selector
        selectLanguage: "Выберите язык:",
        
        // Tutorial Guide
        tutorialWelcome: "Добро пожаловать на Карту Камней!",
        tutorialExploreMap: "Исследуйте Карту",
        tutorialExploreMapDesc: "Эта интерактивная карта позволяет вам проследить путь камней сквозь время. У каждого камня есть своя уникальная история.",
        tutorialSelectStone: "Выберите Камень",
        tutorialSelectStoneDesc: "Используйте выпадающее меню вверху, чтобы выбрать конкретный камень или просмотреть все камни одновременно. Каждый камень имеет свой отличительный цвет.",
        tutorialViewImages: "Просмотр Изображений",
        tutorialViewImagesDesc: "Вы можете выбрать отображение всех изображений, только последнего или ни одного. Изображения представлены круговыми маркерами на карте.",
        tutorialDiscoverHistory: "Откройте для себя Историю",
        tutorialDiscoverHistoryDesc: "Нажмите на камень, чтобы увидеть информационное всплывающее окно, затем нажмите \"Посмотреть историю\", чтобы открыть подробную панель с временной шкалой и галереей изображений.",
        tutorialChangeLanguage: "Сменить Язык",
        tutorialChangeLanguageDesc: "Сайт поддерживает несколько языков. Используйте переключатель языка вверху, чтобы изменить интерфейс на предпочитаемый вами язык.",
        tutorialStartExploring: "Начните Исследование!",
        tutorialStartExploringDesc: "Теперь вы готовы исследовать карту! Помните, что вы всегда можете снова открыть это руководство, нажав кнопку \"?\" в правом нижнем углу.",
        tutorialPrevious: "Предыдущий",
        tutorialNext: "Следующий",
        tutorialSkip: "Пропустить",
        tutorialStart: "Начать!",
        tutorialClose: "Закрыть руководство",
        tutorialHelp: "Руководство",
        
        // About Us
        aboutUs: "О Нас",
        aboutUsTitle: "О Нас",
        aboutUsDescription1: "Добро пожаловать в проект <b>Карта Камней</b>! Этот проект родился из простой, но глубокой идеи: превратить обычные предметы, такие как камни, в носители радости и связи. Главная цель - подарить улыбку тем, кто найдет один из наших путешествующих камней, и в то же время создать невидимую сеть людей, разделяющих маленький жест счастья.",
        aboutUsDescription2: "Каждый камень, который вы видите на карте, имеет свою историю. Он был тщательно раскрашен, спрятан в особом месте, а затем найден кем-то, кто решил заставить его путешествовать снова. Наше желание состоит в том, чтобы эти камни продолжили свой путь, неся послание позитива и приключений в каждый уголок мира. Это способ объединить людей через любопытство и удивление, показывая, как даже самые маленькие вещи могут оказать значительное влияние.",
        aboutUsDescription3: "Присоединяйтесь к нам в этом приключении! Вы можете найти камень, спрятать новый или просто следить за путешествием существующих камней на карте. Каждое взаимодействие способствует тому, чтобы сделать мир немного более волшебным и радостным.",
        instagramFollow: "Следите за нами в Instagram для обновлений и новых камней:",
        backToMap: "Вернуться к Карте"
    },
    
    ar: {
        // Header
        title: "خريطة الأحجار",
        subtitle: "استكشف التاريخ عبر الزمن",
        
        // Controls
        selectStone: "اختر حجراً:",
        showAll: "إظهار الكل",
        showImages: "إظهار الصور:",
        lastImage: "الأخيرة",
        noImages: "لا شيء",
        allImages: "الكل",
        
        // Loading
        loadingMap: "تحميل الخريطة...",
        
        // History Panel
        historyOf: "تاريخ",
        close: "إغلاق",
        historicalPath: "المسار التاريخي",
        currentPosition: "الموقع الحالي",
        historicalRoute: "الطريق التاريخي",
        timelineMovements: "الجدول الزمني للحركات",
        start: "البداية",
        currentDate: "التاريخ الحالي",
        end: "النهاية",
        
        // Navigation buttons
        play: "تشغيل",
        pause: "إيقاف مؤقت",
        previous: "السابق",
        next: "التالي",
        
        // Popup
        lastPosition: "الموقع الأخير:",
        seeHistory: "رؤية التاريخ",
        
        // Counter
        of: "من",
        
        // Accessibility
        selectStoneAriaLabel: "اختر حجراً للعرض",
        selectImagesAriaLabel: "اختر وضع عرض الصور",
        mapAriaLabel: "خريطة الأحجار التفاعلية",
        closeHistoryAriaLabel: "إغلاق لوحة التاريخ",
        fullscreenAriaLabel: "عرض بملء الشاشة",
        closeFullscreenAriaLabel: "إغلاق العرض بملء الشاشة",
        playPauseAriaLabel: "تشغيل/إيقاف مؤقت تلقائي",
        previousAriaLabel: "الصورة السابقة",
        nextAriaLabel: "الصورة التالية",
        miniMapAriaLabel: "خريطة مصغرة للمسار",
        timelineAriaLabel: "الجدول الزمني لحركة الحجر",
        
        // Language selector
        selectLanguage: "اختر اللغة:",
        
        // Tutorial Guide
        tutorialWelcome: "مرحبًا بك في خريطة الأحجار!",
        tutorialExploreMap: "استكشف الخريطة",
        tutorialExploreMapDesc: "تتيح لك هذه الخريطة التفاعلية تتبع رحلة الأحجار عبر الزمن. كل حجر له قصته الفريدة ليرويها.",
        tutorialSelectStone: "اختر حجرًا",
        tutorialSelectStoneDesc: "استخدم القائمة المنسدلة في الأعلى لتحديد حجر معين أو عرض جميع الأحجار في وقت واحد. كل حجر له لون مميز.",
        tutorialViewImages: "عرض الصور",
        tutorialViewImagesDesc: "يمكنك اختيار عرض جميع الصور، أو الصورة الأخيرة فقط، أو عدم عرض أي صور. يتم تمثيل الصور بعلامات دائرية على الخريطة.",
        tutorialDiscoverHistory: "اكتشف التاريخ",
        tutorialDiscoverHistoryDesc: "انقر على حجر لمشاهدة النافذة المنبثقة للمعلومات، ثم انقر على \"مشاهدة التاريخ\" لفتح اللوحة التفصيلية مع الجدول الزمني ومعرض الصور.",
        tutorialChangeLanguage: "تغيير اللغة",
        tutorialChangeLanguageDesc: "يدعم الموقع لغات متعددة. استخدم محدد اللغة في الأعلى لتغيير الواجهة إلى لغتك المفضلة.",
        tutorialStartExploring: "ابدأ الاستكشاف!",
        tutorialStartExploringDesc: "أنت الآن جاهز لاستكشاف الخريطة! تذكر أنه يمكنك دائمًا إعادة فتح هذا الدليل بالنقر على زر \"؟\" في الزاوية اليمنى السفلية.",
        tutorialPrevious: "السابق",
        tutorialNext: "التالي",
        tutorialSkip: "تخطي",
        tutorialStart: "ابدأ!",
        tutorialClose: "إغلاق الدليل",
        tutorialHelp: "الدليل",
        
        // About Us
        aboutUs: "من نحن",
        aboutUsTitle: "من نحن",
        aboutUsDescription1: "مرحباً بكم في مشروع <b>خريطة الأحجار</b>! ينبع هذا المشروع من فكرة بسيطة ولكنها عميقة: تحويل الأشياء العادية، مثل الأحجار، إلى وسائل للفرح والتواصل. الهدف الرئيسي هو إدخال البسمة على وجوه من يجدون إحدى أحجارنا المسافرة، وفي نفس الوقت، إنشاء شبكة غير مرئية من الأشخاص الذين يتشاركون إيماءة صغيرة من السعادة.",
        aboutUsDescription2: "كل حجر تراه على الخريطة له قصة. تم رسمه بعناية، وإخفاؤه في مكان خاص، ثم وجده شخص قرر أن يجعله يسافر مرة أخرى. رغبتنا هي أن تستمر هذه الأحجار في رحلتها، حاملة رسالة إيجابية ومغامرة إلى كل زاوية في العالم. إنها طريقة لتوحيد الناس من خلال الفضول والمفاجأة، مما يظهر كيف يمكن حتى للأشياء الصغيرة أن تولد تأثيراً كبيراً.",
        aboutUsDescription3: "انضموا إلينا في هذه المغامرة! يمكنكم العثور على حجر، أو إخفاء واحد جديد، أو ببساطة متابعة رحلة الأحجار الموجودة على الخريطة. كل تفاعل يساهم في جعل العالم مكاناً أكثر سحراً وبهجة.",
        instagramFollow: "تابعونا على إنستغرام للحصول على التحديثات والأحجار الجديدة:",
        backToMap: "العودة إلى الخريطة"
    },
    
    de: {
        // Header
        title: "Steinkarte",
        subtitle: "Erkunden Sie die Geschichte durch die Zeit",
        
        // Controls
        selectStone: "Stein auswählen:",
        showAll: "Alle anzeigen",
        showImages: "Bilder anzeigen:",
        lastImage: "Letztes",
        noImages: "Keine",
        allImages: "Alle",
        
        // Loading
        loadingMap: "Karte wird geladen...",
        
        // History Panel
        historyOf: "Geschichte von",
        close: "Schließen",
        historicalPath: "Historischer Pfad",
        currentPosition: "Aktuelle Position",
        historicalRoute: "Historische Route",
        timelineMovements: "Zeitleiste der Bewegungen",
        start: "Start",
        currentDate: "Aktuelles Datum",
        end: "Ende",
        
        // Navigation buttons
        play: "Abspielen",
        pause: "Pause",
        previous: "Vorherige",
        next: "Nächste",
        
        // Popup
        lastPosition: "Letzte Position:",
        seeHistory: "Geschichte ansehen",
        
        // Counter
        of: "von",
        
        // Accessibility
        selectStoneAriaLabel: "Stein zum Anzeigen auswählen",
        selectImagesAriaLabel: "Bildanzeige-Modus auswählen",
        mapAriaLabel: "Interaktive Steinkarte",
        closeHistoryAriaLabel: "Geschichtspanel schließen",
        fullscreenAriaLabel: "Vollbild anzeigen",
        closeFullscreenAriaLabel: "Vollbildansicht schließen",
        playPauseAriaLabel: "Automatisch abspielen/pausieren",
        previousAriaLabel: "Vorheriges Bild",
        nextAriaLabel: "Nächstes Bild",
        miniMapAriaLabel: "Mini-Routenkarte",
        timelineAriaLabel: "Zeitleiste der Steinbewegung",
        
        // Language selector
        selectLanguage: "Sprache auswählen:",
        
        // Tutorial Guide
        tutorialWelcome: "Willkommen auf der Steinkarte!",
        tutorialExploreMap: "Erkunden Sie die Karte",
        tutorialExploreMapDesc: "Diese interaktive Karte ermöglicht es Ihnen, die Reise der Steine durch die Zeit zu verfolgen. Jeder Stein hat seine eigene einzigartige Geschichte zu erzählen.",
        tutorialSelectStone: "Wählen Sie einen Stein",
        tutorialSelectStoneDesc: "Verwenden Sie das Dropdown-Menü oben, um einen bestimmten Stein auszuwählen oder alle Steine gleichzeitig anzuzeigen. Jeder Stein hat eine markante Farbe.",
        tutorialViewImages: "Bilder anzeigen",
        tutorialViewImagesDesc: "Sie können wählen, ob alle Bilder, nur das letzte oder keine Bilder angezeigt werden sollen. Bilder werden durch kreisförmige Markierungen auf der Karte dargestellt.",
        tutorialDiscoverHistory: "Entdecken Sie die Geschichte",
        tutorialDiscoverHistoryDesc: "Klicken Sie auf einen Stein, um das Informations-Popup anzuzeigen, und klicken Sie dann auf \"Geschichte ansehen\", um das detaillierte Panel mit Zeitleiste und Bildergalerie zu öffnen.",
        tutorialChangeLanguage: "Sprache ändern",
        tutorialChangeLanguageDesc: "Die Website unterstützt mehrere Sprachen. Verwenden Sie die Sprachauswahl oben, um die Benutzeroberfläche in Ihre bevorzugte Sprache zu ändern.",
        tutorialStartExploring: "Beginnen Sie die Erkundung!",
        tutorialStartExploringDesc: "Jetzt sind Sie bereit, die Karte zu erkunden! Denken Sie daran, dass Sie dieses Handbuch jederzeit wieder öffnen können, indem Sie auf die Schaltfläche \"?\" in der unteren rechten Ecke klicken.",
        tutorialPrevious: "Zurück",
        tutorialNext: "Weiter",
        tutorialSkip: "Überspringen",
        tutorialStart: "Starten!",
        tutorialClose: "Anleitung schließen",
        tutorialHelp: "Anleitung",
        
        // About Us
        aboutUs: "Über Uns",
        aboutUsTitle: "Über Uns",
        aboutUsDescription1: "Willkommen beim <b>Steinkarte</b>-Projekt! Dieses Projekt entsteht aus einer einfachen, aber tiefgreifenden Idee: gewöhnliche Gegenstände wie Steine in Träger von Freude und Verbindung zu verwandeln. Das Hauptziel ist es, denjenigen ein Lächeln zu schenken, die einen unserer reisenden Steine finden, und gleichzeitig ein unsichtbares Netzwerk von Menschen zu schaffen, die eine kleine Geste des Glücks teilen.",
        aboutUsDescription2: "Jeder Stein, den Sie auf der Karte sehen, hat eine Geschichte. Er wurde sorgfältig bemalt, an einem besonderen Ort versteckt und dann von jemandem gefunden, der beschloss, ihn wieder reisen zu lassen. Unser Wunsch ist es, dass diese Steine ihre Reise fortsetzen und eine Botschaft der Positivität und des Abenteuers in jeden Winkel der Welt tragen. Es ist ein Weg, Menschen durch Neugier und Überraschung zu vereinen und zu zeigen, wie selbst die kleinsten Dinge eine bedeutende Wirkung haben können.",
        aboutUsDescription3: "Begleiten Sie uns auf diesem Abenteuer! Sie können einen Stein finden, einen neuen verstecken oder einfach die Reise der vorhandenen Steine auf der Karte verfolgen. Jede Interaktion trägt dazu bei, die Welt zu einem etwas magischeren und fröhlicheren Ort zu machen.",
        instagramFollow: "Folgen Sie uns auf Instagram für Updates und neue Steine:",
        backToMap: "Zurück zur Karte"
    },
    
    es: {
        // Header
        title: "Mapa de Piedras",
        subtitle: "Explora la historia a través del tiempo",
        
        // Controls
        selectStone: "Selecciona una piedra:",
        showAll: "Mostrar todas",
        showImages: "Mostrar imágenes:",
        lastImage: "Última",
        noImages: "Ninguna",
        allImages: "Todas",
        
        // Loading
        loadingMap: "Cargando mapa...",
        
        // History Panel
        historyOf: "Historia de",
        close: "Cerrar",
        historicalPath: "Ruta histórica",
        currentPosition: "Posición actual",
        historicalRoute: "Ruta histórica",
        timelineMovements: "Línea de tiempo de movimientos",
        start: "Inicio",
        currentDate: "Fecha actual",
        end: "Fin",
        
        // Navigation buttons
        play: "Reproducir",
        pause: "Pausa",
        previous: "Anterior",
        next: "Siguiente",
        
        // Popup
        lastPosition: "Última posición:",
        seeHistory: "Ver historia",
        
        // Counter
        of: "de",
        
        // Accessibility
        selectStoneAriaLabel: "Selecciona una piedra para mostrar",
        selectImagesAriaLabel: "Selecciona modo de visualización de imágenes",
        mapAriaLabel: "Mapa interactivo de piedras",
        closeHistoryAriaLabel: "Cerrar panel de historia",
        fullscreenAriaLabel: "Ver en pantalla completa",
        closeFullscreenAriaLabel: "Cerrar vista de pantalla completa",
        playPauseAriaLabel: "Reproducir/Pausar automático",
        previousAriaLabel: "Imagen anterior",
        nextAriaLabel: "Imagen siguiente",
        miniMapAriaLabel: "Mini mapa de ruta",
        timelineAriaLabel: "Línea de tiempo de movimiento de piedra",
        
        // Language selector
        selectLanguage: "Selecciona el idioma:",
        
        // Tutorial Guide
        tutorialWelcome: "¡Bienvenido al Mapa de Piedras!",
        tutorialExploreMap: "Explora el Mapa",
        tutorialExploreMapDesc: "Este mapa interactivo te permite seguir el viaje de las piedras a través del tiempo. Cada piedra tiene su propia historia única que contar.",
        tutorialSelectStone: "Selecciona una Piedra",
        tutorialSelectStoneDesc: "Usa el menú desplegable en la parte superior para seleccionar una piedra específica o ver todas las piedras simultáneamente. Cada piedra tiene un color distintivo.",
        tutorialViewImages: "Ver Imágenes",
        tutorialViewImagesDesc: "Puedes elegir mostrar todas las imágenes, solo la última o ninguna imagen. Las imágenes están representadas por marcadores circulares en el mapa.",
        tutorialDiscoverHistory: "Descubre la Historia",
        tutorialDiscoverHistoryDesc: "Haz clic en una piedra para ver la ventana emergente de información, luego haz clic en \"Ver historia\" para abrir el panel detallado con la línea de tiempo y la galería de imágenes.",
        tutorialChangeLanguage: "Cambiar Idioma",
        tutorialChangeLanguageDesc: "El sitio admite varios idiomas. Usa el selector de idioma en la parte superior para cambiar la interfaz a tu idioma preferido.",
        tutorialStartExploring: "¡Empieza a Explorar!",
        tutorialStartExploringDesc: "¡Ahora estás listo para explorar el mapa! Recuerda que siempre puedes volver a abrir esta guía haciendo clic en el botón \"?\" en la esquina inferior derecha.",
        tutorialPrevious: "Anterior",
        tutorialNext: "Siguiente",
        tutorialSkip: "Saltar",
        tutorialStart: "¡Empezar!",
        tutorialClose: "Cerrar guía",
        tutorialHelp: "Guía",
        
        // About Us
        aboutUs: "Acerca de Nosotros",
        aboutUsTitle: "Acerca de Nosotros",
        aboutUsDescription1: "¡Bienvenidos al proyecto <b>Mapa de Piedras</b>! Este proyecto nace de una idea simple pero profunda: transformar objetos comunes, como las piedras, en vehículos de alegría y conexión. El objetivo principal es regalar una sonrisa a quienes encuentren una de nuestras piedras viajeras y, al mismo tiempo, crear una red invisible de personas que comparten un pequeño gesto de felicidad.",
        aboutUsDescription2: "Cada piedra que ves en el mapa tiene una historia. Fue pintada con cuidado, escondida en un lugar especial y luego encontrada por alguien que decidió hacerla viajar de nuevo. Nuestro deseo es que estas piedras continúen su viaje, llevando un mensaje de positividad y aventura a cada rincón del mundo. Es una forma de unir a las personas a través de la curiosidad y la sorpresa, demostrando cómo incluso las cosas más pequeñas pueden generar un impacto significativo.",
        aboutUsDescription3: "¡Únete a nosotros en esta aventura! Puedes encontrar una piedra, esconder una nueva, o simplemente seguir el viaje de las piedras existentes en el mapa. Cada interacción contribuye a hacer del mundo un lugar un poco más mágico y sonriente.",
        instagramFollow: "Síguenos en Instagram para actualizaciones y nuevas piedras:",
        backToMap: "Volver al Mapa"
    },
    
    pl: {
        // Header
        title: "Mapa Kamieni",
        subtitle: "Odkryj historię poprzez czas",
        
        // Controls
        selectStone: "Wybierz kamień:",
        showAll: "Pokaż wszystkie",
        showImages: "Pokaż obrazy:",
        lastImage: "Ostatni",
        noImages: "Żaden",
        allImages: "Wszystkie",
        
        // Loading
        loadingMap: "Ładowanie mapy...",
        
        // History Panel
        historyOf: "Historia",
        close: "Zamknij",
        historicalPath: "Ścieżka historyczna",
        currentPosition: "Obecna pozycja",
        historicalRoute: "Trasa historyczna",
        timelineMovements: "Oś czasu ruchów",
        start: "Start",
        currentDate: "Obecna data",
        end: "Koniec",
        
        // Navigation buttons
        play: "Odtwórz",
        pause: "Pauza",
        previous: "Poprzedni",
        next: "Następny",
        
        // Popup
        lastPosition: "Ostatnia pozycja:",
        seeHistory: "Zobacz historię",
        
        // Counter
        of: "z",
        
        // Accessibility
        selectStoneAriaLabel: "Wybierz kamień do wyświetlenia",
        selectImagesAriaLabel: "Wybierz tryb wyświetlania obrazów",
        mapAriaLabel: "Interaktywna mapa kamieni",
        closeHistoryAriaLabel: "Zamknij panel historii",
        fullscreenAriaLabel: "Zobacz na pełnym ekranie",
        closeFullscreenAriaLabel: "Zamknij widok pełnoekranowy",
        playPauseAriaLabel: "Odtwórz/Wstrzymaj automatycznie",
        previousAriaLabel: "Poprzedni obraz",
        nextAriaLabel: "Następny obraz",
        miniMapAriaLabel: "Mini mapa trasy",
        timelineAriaLabel: "Oś czasu ruchu kamienia",
        
        // Language selector
        selectLanguage: "Wybierz język:",
        
        // Tutorial Guide
        tutorialWelcome: "Witaj na Mapie Kamieni!",
        tutorialExploreMap: "Odkryj Mapę",
        tutorialExploreMapDesc: "Ta interaktywna mapa pozwala śledzić podróż kamieni w czasie. Każdy kamień ma swoją unikalną historię do opowiedzenia.",
        tutorialSelectStone: "Wybierz Kamień",
        tutorialSelectStoneDesc: "Użyj rozwijanego menu u góry, aby wybrać konkretny kamień lub wyświetlić wszystkie kamienie jednocześnie. Każdy kamień ma swój charakterystyczny kolor.",
        tutorialViewImages: "Wyświetl Obrazy",
        tutorialViewImagesDesc: "Możesz wybrać wyświetlanie wszystkich obrazów, tylko ostatniego lub żadnego. Obrazy są reprezentowane przez okrągłe znaczniki na mapie.",
        tutorialDiscoverHistory: "Odkryj Historię",
        tutorialDiscoverHistoryDesc: "Kliknij na kamień, aby zobaczyć wyskakujące okienko informacyjne, a następnie kliknij \"Zobacz historię\", aby otworzyć szczegółowy panel z osią czasu i galerią obrazów.",
        tutorialChangeLanguage: "Zmień Język",
        tutorialChangeLanguageDesc: "Strona obsługuje wiele języków. Użyj selektora języka u góry, aby zmienić interfejs na preferowany język.",
        tutorialStartExploring: "Rozpocznij Eksplorację!",
        tutorialStartExploringDesc: "Teraz jesteś gotowy do eksploracji mapy! Pamiętaj, że zawsze możesz ponownie otworzyć ten przewodnik, klikając przycisk \"?\" w prawym dolnym rogu.",
        tutorialPrevious: "Poprzedni",
        tutorialNext: "Następny",
        tutorialSkip: "Pomiń",
        tutorialStart: "Rozpocznij!",
        tutorialClose: "Zamknij przewodnik",
        tutorialHelp: "Przewodnik",
        
        // About Us
        aboutUs: "O Nas",
        aboutUsTitle: "O Nas",
        aboutUsDescription1: "Witajcie w projekcie <b>Mapa Kamieni</b>! Ten projekt rodzi się z prostej, ale głębokiej idei: przekształcenia zwykłych przedmiotów, takich jak kamienie, w nośniki radości i połączenia. Głównym celem jest podarowanie uśmiechu tym, którzy znajdą jeden z naszych podróżujących kamieni, a jednocześnie stworzenie niewidzialnej sieci ludzi dzielących mały gest szczęścia.",
        aboutUsDescription2: "Każdy kamień, który widzisz na mapie, ma swoją historię. Został starannie pomalowany, ukryty w specjalnym miejscu, a następnie znaleziony przez kogoś, kto zdecydował się pozwolić mu podróżować dalej. Naszym pragnieniem jest, aby te kamienie kontynuowały swoją podróż, niosąc przesłanie pozytywności i przygody do każdego zakątka świata. To sposób na zjednoczenie ludzi poprzez ciekawość i zaskoczenie, pokazujący, jak nawet najmniejsze rzeczy mogą wywrzeć znaczący wpływ.",
        aboutUsDescription3: "Dołączcie do nas w tej przygodzie! Możecie znaleźć kamień, ukryć nowy lub po prostu śledzić podróż istniejących kamieni na mapie. Każda interakcja przyczynia się do uczynienia świata miejscem nieco bardziej magicznym i radosnym.",
        instagramFollow: "Śledźcie nas na Instagramie po aktualizacje i nowe kamienie:",
        backToMap: "Powrót do Mapy"
    },
    
    pt: {
        // Header
        title: "Mapa das Pedras",
        subtitle: "Explore a história através do tempo",
        
        // Controls
        selectStone: "Selecione uma pedra:",
        showAll: "Mostrar todas",
        showImages: "Mostrar imagens:",
        lastImage: "Última",
        noImages: "Nenhuma",
        allImages: "Todas",
        
        // Loading
        loadingMap: "Carregando mapa...",
        
        // History Panel
        historyOf: "História de",
        close: "Fechar",
        historicalPath: "Caminho histórico",
        currentPosition: "Posição atual",
        historicalRoute: "Rota histórica",
        timelineMovements: "Linha do tempo dos movimentos",
        start: "Início",
        currentDate: "Data atual",
        end: "Fim",
        
        // Navigation buttons
        play: "Reproduzir",
        pause: "Pausar",
        previous: "Anterior",
        next: "Próximo",
        
        // Popup
        lastPosition: "Última posição:",
        seeHistory: "Ver história",
        
        // Counter
        of: "de",
        
        // Accessibility
        selectStoneAriaLabel: "Selecione uma pedra para exibir",
        selectImagesAriaLabel: "Selecione o modo de exibição de imagens",
        mapAriaLabel: "Mapa interativo de pedras",
        closeHistoryAriaLabel: "Fechar painel de história",
        fullscreenAriaLabel: "Ver em tela cheia",
        closeFullscreenAriaLabel: "Fechar visualização em tela cheia",
        playPauseAriaLabel: "Reproduzir/Pausar automático",
        previousAriaLabel: "Imagem anterior",
        nextAriaLabel: "Próxima imagem",
        miniMapAriaLabel: "Mini mapa da rota",
        timelineAriaLabel: "Linha do tempo do movimento da pedra",
        
        // Language selector
        selectLanguage: "Selecionar idioma:",
        
        // Tutorial Guide
        tutorialWelcome: "Bem-vindo(a) ao Mapa das Pedras!",
        tutorialExploreMap: "Explore o Mapa",
        tutorialExploreMapDesc: "Este mapa interativo permite que você acompanhe a jornada das pedras ao longo do tempo. Cada pedra tem sua própria história única para contar.",
        tutorialSelectStone: "Selecione uma Pedra",
        tutorialSelectStoneDesc: "Use o menu suspenso na parte superior para selecionar uma pedra específica ou visualizar todas as pedras simultaneamente. Cada pedra tem uma cor distinta.",
        tutorialViewImages: "Visualizar Imagens",
        tutorialViewImagesDesc: "Você pode optar por mostrar todas as imagens, apenas a última ou nenhuma imagem. As imagens são representadas por marcadores circulares no mapa.",
        tutorialDiscoverHistory: "Descubra a História",
        tutorialDiscoverHistoryDesc: "Clique em uma pedra para ver o pop-up de informações e, em seguida, clique em \"Ver história\" para abrir o painel detalhado com a linha do tempo e a galeria de imagens.",
        tutorialChangeLanguage: "Mudar Idioma",
        tutorialChangeLanguageDesc: "O site suporta vários idiomas. Use o seletor de idioma na parte superior para mudar a interface para o seu idioma preferido.",
        tutorialStartExploring: "Comece a Explorar!",
        tutorialStartExploringDesc: "Agora você está pronto para explorar o mapa! Lembre-se de que você sempre pode reabrir este guia clicando no botão \"?\" no canto inferior direito.",
        tutorialPrevious: "Anterior",
        tutorialNext: "Próximo",
        tutorialSkip: "Pular",
        tutorialStart: "Começar!",
        tutorialClose: "Fechar guia",
        tutorialHelp: "Guia",
        
        // About Us
        aboutUs: "Sobre Nós",
        aboutUsTitle: "Sobre Nós",
        aboutUsDescription1: "Bem-vindos ao projeto <b>Mapa das Pedras</b>! Este projeto nasce de uma ideia simples mas profunda: transformar objetos comuns, como pedras, em veículos de alegria e conexão. O objetivo principal é presentear com um sorriso aqueles que encontram uma das nossas pedras viajantes e, ao mesmo tempo, criar uma rede invisível de pessoas que compartilham um pequeno gesto de felicidade.",
        aboutUsDescription2: "Cada pedra que você vê no mapa tem uma história. Foi pintada com cuidado, escondida em um lugar especial e depois encontrada por alguém que decidiu fazê-la viajar novamente. Nosso desejo é que essas pedras continuem sua jornada, levando uma mensagem de positividade e aventura para cada canto do mundo. É uma forma de unir pessoas através da curiosidade e surpresa, mostrando como até as menores coisas podem gerar um impacto significativo.",
        aboutUsDescription3: "Junte-se a nós nesta aventura! Você pode encontrar uma pedra, esconder uma nova, ou simplesmente acompanhar a jornada das pedras existentes no mapa. Cada interação contribui para tornar o mundo um lugar um pouco mais mágico e sorridente.",
        instagramFollow: "Siga-nos no Instagram para atualizações e novas pedras:",
        backToMap: "Voltar ao Mapa"
    },
    
    ja: {
        // Header
        title: "石の地図",
        subtitle: "時を通して歴史を探る",
        
        // Controls
        selectStone: "石を選択:",
        showAll: "すべて表示",
        showImages: "画像を表示:",
        lastImage: "最後",
        noImages: "なし",
        allImages: "すべて",
        
        // Loading
        loadingMap: "地図を読み込み中...",
        
        // History Panel
        historyOf: "の歴史",
        close: "閉じる",
        historicalPath: "歴史的経路",
        currentPosition: "現在位置",
        historicalRoute: "歴史的ルート",
        timelineMovements: "移動のタイムライン",
        start: "開始",
        currentDate: "現在の日付",
        end: "終了",
        
        // Navigation buttons
        play: "再生",
        pause: "一時停止",
        previous: "前",
        next: "次",
        
        // Popup
        lastPosition: "最後の位置:",
        seeHistory: "歴史を見る",
        
        // Counter
        of: "の",
        
        // Accessibility
        selectStoneAriaLabel: "表示する石を選択",
        selectImagesAriaLabel: "画像表示モードを選択",
        mapAriaLabel: "インタラクティブな石の地図",
        closeHistoryAriaLabel: "履歴パネルを閉じる",
        fullscreenAriaLabel: "フルスクリーンで表示",
        closeFullscreenAriaLabel: "フルスクリーン表示を閉じる",
        playPauseAriaLabel: "自動再生/一時停止",
        previousAriaLabel: "前の画像",
        nextAriaLabel: "次の画像",
        miniMapAriaLabel: "ルートのミニマップ",
        timelineAriaLabel: "石の移動タイムライン",
        
        // Language selector
        selectLanguage: "言語を選択:"
    }
};

// Lingue disponibili con nomi nativi
const availableLanguages = {
    it: "Italiano",
    en: "English",
    zh: "中文",
    fr: "Français",
    ru: "Русский",
    ar: "العربية",
    de: "Deutsch",
    es: "Español",
    pl: "Polski",
    pt: "Português",
    ja: "日本語"
};

// Lingua corrente (default: italiano)
let currentLanguage = 'it';

// Funzione per ottenere il testo tradotto
function t(key) {
    return translations[currentLanguage][key] || translations['it'][key] || key;
}

// Funzione per cambiare lingua
function changeLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('selectedLanguage', lang);
        updatePageTexts();
        
        // Aggiorna la guida se è attiva
        if (typeof tutorialGuide !== 'undefined' && tutorialGuide) {
            tutorialGuide.updateLanguage(lang);
        }
        
        // Aggiorna anche la mappa se necessario
        const selectedStone = document.getElementById('stone-select').value;
        displayStonesOnMap(selectedStone);
    }
}

// Funzione per aggiornare tutti i testi della pagina
function updatePageTexts() {
    // Header
    const titleElement = document.querySelector('h1');
    if (titleElement) {
        titleElement.innerHTML = `<span class="header-icon">🗺️</span>${t('title')}`;
    }
    
    const subtitleElement = document.querySelector('.header-subtitle');
    if (subtitleElement) {
        subtitleElement.textContent = t('subtitle');
    }
    
    // Controls
    const stoneLabel = document.querySelector('label[for="stone-select"]');
    if (stoneLabel) {
        stoneLabel.innerHTML = `<span class="control-icon">🪨</span>${t('selectStone')}`;
    }
    
    const imageLabel = document.querySelector('label[for="image-display-select"]');
    if (imageLabel) {
        imageLabel.innerHTML = `<span class="control-icon">📸</span>${t('showImages')}`;
    }
    
    const languageLabel = document.querySelector('label[for="language-select"]');
    if (languageLabel) {
        languageLabel.innerHTML = `<span class="control-icon">🌐</span>${t('selectLanguage')}`;
    }
    
    // Select options
    const stoneSelect = document.getElementById('stone-select');
    if (stoneSelect && stoneSelect.options[0]) {
        stoneSelect.options[0].textContent = t('showAll');
    }
    
    const imageSelect = document.getElementById('image-display-select');
    if (imageSelect) {
        imageSelect.options[0].textContent = t('lastImage');
        imageSelect.options[1].textContent = t('noImages');
        imageSelect.options[2].textContent = t('allImages');
    }
    
    // Loading overlay
    const loadingText = document.querySelector('.loading-content p');
    if (loadingText) {
        loadingText.textContent = t('loadingMap');
    }
    
    // History panel
    const historyTitle = document.getElementById('history-title');
    if (historyTitle && historyTitle.textContent.includes('Storia di')) {
        const stoneName = historyTitle.textContent.replace('Storia di ', '').replace('History of ', '').replace('历史记录 ', '').replace('Histoire de ', '').replace('История ', '').replace('تاريخ ', '').replace('Geschichte von ', '').replace('Historia de ', '').replace('Historia ', '').replace('História de ', '').replace('の歴史', '');
        historyTitle.textContent = `${t('historyOf')} ${stoneName}`;
    }
    
    const miniMapTitle = document.querySelector('.mini-map-title');
    if (miniMapTitle) {
        miniMapTitle.textContent = t('historicalPath');
    }
    
    const timelineTitle = document.querySelector('.timeline-title');
    if (timelineTitle) {
        timelineTitle.textContent = t('timelineMovements');
    }
    
    // Legend
    const legendItems = document.querySelectorAll('.legend-item span:not(.legend-dot)');
    if (legendItems.length >= 2) {
        legendItems[0].textContent = t('currentPosition');
        legendItems[1].textContent = t('historicalRoute');
    }
    
    // Timeline info
    const timelineStart = document.querySelector('.timeline-start');
    const timelineEnd = document.querySelector('.timeline-end');
    if (timelineStart) timelineStart.textContent = t('start');
    if (timelineEnd) timelineEnd.textContent = t('end');
    
    // Navigation buttons
    const playBtn = document.querySelector('.btn-text');
    if (playBtn && playBtn.textContent.includes('Play')) {
        playBtn.textContent = t('play');
    }
    
    const prevBtn = document.querySelector('.prev-btn .btn-text');
    if (prevBtn) {
        prevBtn.textContent = t('previous');
    }
    
    const nextBtn = document.querySelector('.next-btn .btn-text');
    if (nextBtn) {
        nextBtn.textContent = t('next');
    }
    
    // Aria labels
    const stoneSelectElement = document.getElementById('stone-select');
    if (stoneSelectElement) {
        stoneSelectElement.setAttribute('aria-label', t('selectStoneAriaLabel'));
    }
    
    const imageSelectElement = document.getElementById('image-display-select');
    if (imageSelectElement) {
        imageSelectElement.setAttribute('aria-label', t('selectImagesAriaLabel'));
    }
    
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.setAttribute('aria-label', t('mapAriaLabel'));
    }
    
    // Aggiorna la direzione del testo per l'arabo
    if (currentLanguage === 'ar') {
        document.body.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
    } else {
        document.body.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', currentLanguage);
    }
}

// Funzione per inizializzare il selettore di lingua
function initializeLanguageSelector() {
    // Carica la lingua salvata o usa quella del browser
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const browserLanguage = navigator.language.split('-')[0];
    
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    } else if (translations[browserLanguage]) {
        currentLanguage = browserLanguage;
    }
    
    // Aggiorna i testi della pagina
    updatePageTexts();
    
    // Imposta il valore del selettore
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
}

// Esporta le funzioni per uso globale
window.t = t;
window.changeLanguage = changeLanguage;
window.updatePageTexts = updatePageTexts;
window.initializeLanguageSelector = initializeLanguageSelector;
window.availableLanguages = availableLanguages;
window.currentLanguage = currentLanguage;

