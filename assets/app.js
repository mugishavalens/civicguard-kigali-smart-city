(function () {
  const STORAGE_KEYS = {
    theme: "civicguard-theme",
    lang: "civicguard-lang",
    session: "civicguard-session",
    incidents: "civicguard-incidents",
    users: "civicguard-users",
  };

  const translations = {
    en: {
      openPortal: "Sign In",
      navHome: "Home",
      navReport: "Report Incident",
      navAbout: "About Us",
      navContact: "Contact",
      navDashboard: "Dashboard",
      navLanguage: "Language",
      navMode: "Mode",
      heroPill: "Official Kigali Smart City Initiative",
      heroCity: "Kigali",
      heroBrand: "CivicGuard",
      heroPortal: "Portal.",
      heroText:
        "Empowering the Kigali Smart City Initiative. Connect directly with district authorities to report community safety concerns, utility disruptions, or emergencies in real-time.",
      heroPrimary: "Start Reporting",
      heroSecondary: "View System Overview",
      featureSectionTag: "Platform highlights",
      featureSectionTitle: "A complete safety reporting experience for citizens and city teams.",
      featureCitizenTitle: "Citizen Reporting",
      featureCitizenText:
        "Residents can submit incidents with category, location, urgency, and descriptions, then track response progress in real time.",
      featureAdminTitle: "Admin Operations",
      featureAdminText:
        "Authorities review reports, update statuses, coordinate field response, and send feedback to the reporting citizen.",
      metricsLabel: "Live demo metrics",
      statReports: "Reports tracked in demo",
      statResolved: "Resolved incidents",
      trustTag: "Built for transparency",
      trustTitle: "A real-time bridge between citizens and district response teams.",
      trustOneTitle: "Verified reports",
      trustOneText:
        "Structured reporting fields reduce noise and give authorities actionable, traceable incident data.",
      trustTwoTitle: "Location context",
      trustTwoText:
        "Exact location, district, and urgency details help teams dispatch the right response faster.",
      trustThreeTitle: "Live status updates",
      trustThreeText:
        "Citizens can follow each report from submission to review and final resolution without losing visibility.",
      visionTag: "Kigali 2026 vision",
      visionTitle: "A smarter safety platform for stronger local community resilience.",
      visionOneTitle: "Integrated monitoring",
      visionOneText:
        "Connect citizen reporting with local digital services so community risks are seen and escalated earlier.",
      visionTwoTitle: "Community resilience",
      visionTwoText:
        "Support district officers and local leaders with clearer data for faster, evidence-based interventions.",
      visionThreeTitle: "Public accountability",
      visionThreeText:
        "Transparent status tracking helps residents see how incidents are handled and where response gaps remain.",
      impactTag: "Strategic impact",
      impactQuote:
        "CivicGuard is more than a reporting tool. It is a shared operating layer for citizens, district authorities, and the Kigali Smart City Initiative.",
      impactAuthor: "Smart City Coordination Office",
      impactRole: "Kigali community safety monitoring",
      contactTag: "Contact",
      contactTitle: "Stay connected with the CivicGuard response network.",
      contactOfficeLabel: "Coordination Office",
      contactOfficeText: "Kigali Smart City Initiative, Community Safety Monitoring Unit",
      contactEmailLabel: "Email",
      contactPhoneLabel: "Phone",
      experienceTag: "Platform experience",
      experienceTitle: "See how CivicGuard serves citizens, administrators, and the city as one system.",
      expCitizenTab: "Citizen Flow",
      expAdminTab: "Admin Flow",
      expImpactTab: "City Impact",
      expCitizenTitle: "Simple reporting from any community member",
      expCitizenText: "Citizens log in, submit incidents with location and urgency, and immediately start tracking status changes in one dashboard.",
      expCitizenPointOne: "Fast report submission with clear categories",
      expCitizenPointTwo: "Personal case tracking and response visibility",
      expCitizenPointThree: "Multilingual access in English, French, and Kinyarwanda",
      expAdminTitle: "Operational control for response teams",
      expAdminText: "Administrators review open cases, update status, add responses, and monitor incident patterns from one control surface.",
      expAdminPointOne: "Prioritize urgent incidents quickly",
      expAdminPointTwo: "Respond directly to reporting citizens",
      expAdminPointThree: "Track trends for planning and resource allocation",
      expImpactTitle: "Built for measurable public value",
      expImpactText: "The platform creates a more transparent incident lifecycle, better accountability, and stronger district-level coordination.",
      expImpactPointOne: "Clearer reporting data for city teams",
      expImpactPointTwo: "Better communication with residents",
      expImpactPointThree: "Evidence for smart city decision-making",
      faqTag: "Questions",
      faqTitle: "Frequently asked questions from users and response teams.",
      faqOneQ: "Who can use CivicGuard?",
      faqOneA: "Citizens can report and track incidents, while administrators manage operational response and city-level analytics.",
      faqTwoQ: "How are incidents prioritized?",
      faqTwoA: "Each report captures urgency, location, and type so district teams can identify high-risk cases and respond faster.",
      faqThreeQ: "Can users follow status updates?",
      faqThreeA: "Yes. Citizens can track their submitted incidents as they move from submitted to review and finally to resolution.",
      footerText: "Community safety monitoring aligned with the Kigali Smart City Initiative.",
      footerCopyright: "© 2026 CivicGuard Kigali • Official Republic of Rwanda Portal",
      authEyebrow: "Secure Access",
      authTagline: "Enhancing Community Safety Through Smart Reporting",
      authPointOne: "Report safety concerns quickly and clearly.",
      authPointTwo: "Track every incident from submission to resolution.",
      authPointThree: "Support administrators with structured operational data.",
      authPanelTitle: "Welcome back to CivicGuard",
      authPanelText: "Login to continue, or register a new citizen account.",
      loginTab: "Login",
      registerTab: "Register",
      emailAddress: "Email address",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      showPassword: "Show",
      hidePassword: "Hide",
      forgotPassword: "Forgot Password",
      loginButton: "Login",
      registerButton: "Create Account",
      noAccount: "No account yet?",
      registerLink: "Register",
      haveAccount: "Already have an account?",
      loginLink: "Login",
      fullName: "Full Name",
      logoutButton: "Logout",
      demoCredentials: "Use your authorized account credentials to continue.",
      forgotPasswordMessage: "Password reset is currently managed by the system administrator.",
      loginError: "Wrong email or password.",
      registerErrorExists: "An account with this email already exists.",
      registerErrorMatch: "Passwords do not match.",
      registerErrorLength: "Password must be at least 6 characters.",
      registerSuccess: "Registration successful. You can now login.",
      citizenEyebrow: "Citizen dashboard",
      citizenLineOne: "Report local",
      citizenLineTwo: "safety incidents",
      citizenTitle: "Report local safety incidents and follow every update.",
      reportsFiled: "Reports filed",
      activeCases: "Active cases",
      newIncidentTitle: "New incident report",
      newIncidentText: "Provide accurate details so the city team can respond faster.",
      incidentType: "Incident type",
      typeRoad: "Road hazard",
      typeStreetlight: "Streetlight outage",
      typeSuspicious: "Suspicious activity",
      typeEmergency: "Emergency",
      typeWaste: "Waste dumping",
      locationLabel: "Location",
      urgencyLabel: "Urgency",
      urgencyLow: "Low",
      urgencyMedium: "Medium",
      urgencyHigh: "High",
      urgencyCritical: "Critical",
      descriptionLabel: "Description",
      submitIncident: "Submit incident",
      statusTrackerTitle: "My report status",
      statusTrackerText: "Track the lifecycle of each incident you submitted.",
      filterAll: "All",
      statusSubmitted: "Submitted",
      statusReview: "In Review",
      statusResolved: "Resolved",
      adminEyebrow: "Admin control center",
      adminLineOne: "Review and",
      adminLineTwo: "respond faster",
      adminTitle: "Review incidents, respond quickly, and measure city safety performance.",
      metricTotal: "Total reports",
      metricCritical: "Critical cases",
      metricResolved: "Resolved",
      analyticsTitle: "Incident analytics",
      analyticsText: "High-level indicators for operational planning.",
      queueTitle: "Response queue",
      queueText: "Open incidents that require action or communication.",
      validationError: "Please complete all incident fields.",
      incidentCreated: "Incident submitted successfully.",
      noCitizenReports: "No reports match the current filter yet.",
      noAdminReports: "No incidents available. Citizen reports will appear here.",
      adminResponseLabel: "Admin response",
      sendResponse: "Save response",
      statusUpdated: "Status updated",
      reportBy: "Reported by",
      submittedOn: "Submitted",
      urgency: "Urgency",
      district: "District",
      sessionCitizen: "Logged in as citizen",
      sessionAdmin: "Logged in as admin",
      signOutLabel: "Sign Out",
    },
    fr: {
      openPortal: "Connexion",
      navHome: "Accueil",
      navReport: "Signaler",
      navAbout: "A Propos",
      navContact: "Contact",
      navDashboard: "Tableau",
      navLanguage: "Langue",
      navMode: "Mode",
      heroPill: "Initiative officielle Kigali Smart City",
      heroCity: "Kigali",
      heroBrand: "CivicGuard",
      heroPortal: "Portail.",
      heroText:
        "Renforcez l'initiative Kigali Smart City. Connectez-vous directement aux autorites de district pour signaler en temps reel les problemes de securite, les perturbations de services ou les urgences.",
      heroPrimary: "Commencer un signalement",
      heroSecondary: "Voir la vue d'ensemble",
      featureSectionTag: "Points forts",
      featureSectionTitle: "Une experience complete de signalement pour les citoyens et les equipes de la ville.",
      featureCitizenTitle: "Signalement citoyen",
      featureCitizenText:
        "Les residents soumettent des incidents avec categorie, lieu, urgence et description, puis suivent l'avancement en temps reel.",
      featureAdminTitle: "Operations admin",
      featureAdminText:
        "Les autorites examinent les signalements, mettent a jour les statuts, coordonnent la reponse et renvoient un retour au citoyen.",
      metricsLabel: "Indicateurs demo",
      statReports: "Signalements dans la demo",
      statResolved: "Incidents resolus",
      trustTag: "Concu pour la transparence",
      trustTitle: "Un pont en temps reel entre les citoyens et les equipes de reponse des districts.",
      trustOneTitle: "Signalements verifies",
      trustOneText:
        "Des champs structures reduisent le bruit et donnent aux autorites des donnees exploitables et tracables.",
      trustTwoTitle: "Contexte geographique",
      trustTwoText: "Le lieu exact, le district et le niveau d'urgence aident les equipes a intervenir plus vite.",
      trustThreeTitle: "Mises a jour en direct",
      trustThreeText: "Les citoyens suivent chaque signalement du depot jusqu'a la resolution finale.",
      visionTag: "Vision Kigali 2026",
      visionTitle: "Une plateforme de securite plus intelligente pour une resilience locale renforcee.",
      visionOneTitle: "Surveillance integree",
      visionOneText:
        "Relier le signalement citoyen aux services numeriques locaux afin de detecter plus tot les risques communautaires.",
      visionTwoTitle: "Resilience communautaire",
      visionTwoText: "Donner aux agents de district et aux leaders locaux de meilleures donnees pour agir plus vite.",
      visionThreeTitle: "Responsabilite publique",
      visionThreeText: "Le suivi transparent permet aux residents de voir comment les incidents sont traites.",
      impactTag: "Impact strategique",
      impactQuote:
        "CivicGuard est plus qu'un outil de signalement. C'est une couche operationnelle partagee entre citoyens, autorites de district et initiative Kigali Smart City.",
      impactAuthor: "Bureau de coordination Smart City",
      impactRole: "Suivi communautaire de la securite a Kigali",
      contactTag: "Contact",
      contactTitle: "Restez connecte au reseau de reponse CivicGuard.",
      contactOfficeLabel: "Bureau de coordination",
      contactOfficeText: "Initiative Kigali Smart City, Unite de suivi de la securite communautaire",
      contactEmailLabel: "Email",
      contactPhoneLabel: "Telephone",
      experienceTag: "Experience plateforme",
      experienceTitle: "Voyez comment CivicGuard relie citoyens, administrateurs et ville dans un meme systeme.",
      expCitizenTab: "Parcours citoyen",
      expAdminTab: "Parcours admin",
      expImpactTab: "Impact ville",
      expCitizenTitle: "Un signalement simple pour chaque citoyen",
      expCitizenText: "Les citoyens se connectent, soumettent les incidents et suivent directement les changements de statut.",
      expCitizenPointOne: "Signalement rapide avec categories claires",
      expCitizenPointTwo: "Suivi personnel des dossiers",
      expCitizenPointThree: "Acces multilingue en anglais, francais et kinyarwanda",
      expAdminTitle: "Controle operationnel pour les equipes",
      expAdminText: "Les administrateurs examinent les dossiers, mettent a jour le statut et suivent les tendances d'incidents.",
      expAdminPointOne: "Prioriser rapidement les incidents urgents",
      expAdminPointTwo: "Repondre directement aux citoyens",
      expAdminPointThree: "Suivre les tendances pour la planification",
      expImpactTitle: "Concu pour une vraie valeur publique",
      expImpactText: "La plateforme cree plus de transparence, une meilleure responsabilite et une coordination locale renforcee.",
      expImpactPointOne: "Des donnees plus claires pour les equipes de la ville",
      expImpactPointTwo: "Une meilleure communication avec les residents",
      expImpactPointThree: "Des preuves pour les decisions smart city",
      faqTag: "Questions",
      faqTitle: "Questions frequentes des utilisateurs et des equipes de reponse.",
      faqOneQ: "Qui peut utiliser CivicGuard ?",
      faqOneA: "Les citoyens signalent et suivent les incidents, tandis que les admins gerent la reponse et les analyses.",
      faqTwoQ: "Comment les incidents sont-ils priorises ?",
      faqTwoA: "Chaque rapport capte l'urgence, le lieu et le type pour aider les equipes a agir plus vite.",
      faqThreeQ: "Les utilisateurs peuvent-ils suivre les mises a jour ?",
      faqThreeA: "Oui. Les citoyens suivent leurs incidents du depot jusqu'a la resolution.",
      footerText: "Suivi de la securite communautaire aligne sur l'initiative Kigali Smart City.",
      footerCopyright: "© 2026 CivicGuard Kigali • Official Republic of Rwanda Portal",
      authEyebrow: "Acces securise",
      authTagline: "Renforcer la securite communautaire grace au signalement intelligent",
      authPointOne: "Signalez rapidement et clairement les problemes de securite.",
      authPointTwo: "Suivez chaque incident jusqu'a sa resolution.",
      authPointThree: "Aidez les admins avec des donnees structurees.",
      authPanelTitle: "Bienvenue sur CivicGuard",
      authPanelText: "Connectez-vous pour continuer, ou enregistrez un nouveau compte citoyen.",
      loginTab: "Connexion",
      registerTab: "Inscription",
      emailAddress: "Adresse e-mail",
      passwordLabel: "Mot de passe",
      confirmPasswordLabel: "Confirmer le mot de passe",
      showPassword: "Voir",
      hidePassword: "Masquer",
      forgotPassword: "Mot de passe oublie",
      loginButton: "Connexion",
      registerButton: "Creer un compte",
      noAccount: "Pas encore de compte ?",
      registerLink: "S'inscrire",
      haveAccount: "Vous avez deja un compte ?",
      loginLink: "Se connecter",
      fullName: "Nom complet",
      logoutButton: "Se deconnecter",
      demoCredentials: "Utilisez les identifiants autorises de votre compte pour continuer.",
      forgotPasswordMessage: "La reinitialisation du mot de passe est geree par l'administrateur du systeme.",
      loginError: "Email ou mot de passe incorrect.",
      registerErrorExists: "Un compte avec cet email existe deja.",
      registerErrorMatch: "Les mots de passe ne correspondent pas.",
      registerErrorLength: "Le mot de passe doit contenir au moins 6 caracteres.",
      registerSuccess: "Inscription reussie. Vous pouvez maintenant vous connecter.",
      citizenEyebrow: "Tableau citoyen",
      citizenLineOne: "Signalez les",
      citizenLineTwo: "incidents locaux",
      citizenTitle: "Signalez les incidents locaux et suivez chaque mise a jour.",
      reportsFiled: "Signalements soumis",
      activeCases: "Dossiers actifs",
      newIncidentTitle: "Nouveau signalement",
      newIncidentText: "Donnez des details exacts pour accelerer la reponse de la ville.",
      incidentType: "Type d'incident",
      typeRoad: "Danger routier",
      typeStreetlight: "Panne d'eclairage public",
      typeSuspicious: "Activite suspecte",
      typeEmergency: "Urgence",
      typeWaste: "Depot sauvage",
      locationLabel: "Lieu",
      urgencyLabel: "Urgence",
      urgencyLow: "Faible",
      urgencyMedium: "Moyenne",
      urgencyHigh: "Elevee",
      urgencyCritical: "Critique",
      descriptionLabel: "Description",
      submitIncident: "Soumettre l'incident",
      statusTrackerTitle: "Statut de mes signalements",
      statusTrackerText: "Suivez le cycle de vie de chaque incident soumis.",
      filterAll: "Tous",
      statusSubmitted: "Soumis",
      statusReview: "En revue",
      statusResolved: "Resolus",
      adminEyebrow: "Centre de controle admin",
      adminLineOne: "Examinez et",
      adminLineTwo: "repondez plus vite",
      adminTitle: "Examinez les incidents, repondez vite et mesurez la performance de securite.",
      metricTotal: "Total des signalements",
      metricCritical: "Cas critiques",
      metricResolved: "Resolus",
      analyticsTitle: "Analyses des incidents",
      analyticsText: "Indicateurs de haut niveau pour la planification operationnelle.",
      queueTitle: "File de reponse",
      queueText: "Incidents ouverts qui exigent une action ou une communication.",
      validationError: "Veuillez remplir tous les champs de l'incident.",
      incidentCreated: "Incident soumis avec succes.",
      noCitizenReports: "Aucun signalement ne correspond au filtre actuel.",
      noAdminReports: "Aucun incident disponible. Les signalements citoyens apparaitront ici.",
      adminResponseLabel: "Reponse admin",
      sendResponse: "Enregistrer la reponse",
      statusUpdated: "Statut mis a jour",
      reportBy: "Signale par",
      submittedOn: "Soumis",
      urgency: "Urgence",
      district: "District",
      sessionCitizen: "Connecte comme citoyen",
      sessionAdmin: "Connecte comme admin",
      signOutLabel: "Se deconnecter",
    },
    rw: {
      openPortal: "Injira",
      navHome: "Ahabanza",
      navReport: "Tanga Raporo",
      navAbout: "Ibyerekeye",
      navContact: "Twandikire",
      navDashboard: "Dashboard",
      navLanguage: "Ururimi",
      navMode: "Mode",
      heroPill: "Official Kigali Smart City Initiative",
      heroCity: "Kigali",
      heroBrand: "CivicGuard",
      heroPortal: "Portal.",
      heroText:
        "Shyigikira Kigali Smart City Initiative. Vugana n'ubuyobozi bw'akarere ako kanya kugira ngo utange amakuru ku bibazo by'umutekano, serivisi zahagaze cyangwa ubutabazi bwihuse.",
      heroPrimary: "Tangira gutanga raporo",
      heroSecondary: "Reba incamake ya sisitemu",
      featureSectionTag: "Ibikubiyemo",
      featureSectionTitle: "Uburyo bwuzuye bwo gutanga raporo ku muturage no ku bakozi b'umujyi.",
      featureCitizenTitle: "Raporo z'abaturage",
      featureCitizenText:
        "Abaturage batanga ikibazo hamwe n'icyiciro, aho cyabereye, ubukana n'ibisobanuro, hanyuma bakurikirana aho kigeze.",
      featureAdminTitle: "Imikorere y'ubuyobozi",
      featureAdminText: "Abayobozi bareba raporo, bahindura status, bagategura igisubizo kandi bagasubiza abaturage.",
      metricsLabel: "Imibare ya demo",
      statReports: "Raporo ziri muri demo",
      statResolved: "Ibibazo byakemutse",
      trustTag: "Yubakiwe gukorera mu mucyo",
      trustTitle: "Ihuza abaturage n'abashinzwe gutabara ku rwego rw'akarere mu gihe nyacyo.",
      trustOneTitle: "Raporo zizewe",
      trustOneText: "Imiterere ya raporo ituma habaho amakuru asobanutse kandi akoreshwa n'ubuyobozi.",
      trustTwoTitle: "Aho ikibazo kiri",
      trustTwoText: "Aho ikibazo cyabereye, akarere n'ubukana bifasha gutuma igikorwa gifatwa vuba.",
      trustThreeTitle: "Status ihora ivugururwa",
      trustThreeText: "Umuturage akurikirana raporo kuva yoherejwe kugeza ikibazo gikemutse.",
      visionTag: "Icyerekezo Kigali 2026",
      visionTitle: "Urubuga rw'umutekano rufite ubwenge kurushaho kugira ngo abaturage barusheho kwihagararaho.",
      visionOneTitle: "Gukurikirana bihuriweho",
      visionOneText: "Huza raporo z'abaturage na serivisi z'ikoranabuhanga z'aho batuye kugira ngo ibibazo bibonwe hakiri kare.",
      visionTwoTitle: "Kwihagararaho kw'abaturage",
      visionTwoText: "Fasha abakozi b'akarere n'abayobozi b'inzego z'ibanze gufata ibyemezo bishingiye ku makuru.",
      visionThreeTitle: "Kubazwa inshingano",
      visionThreeText: "Gukurikirana mu mucyo bifasha abaturage kubona uko ibibazo byabo byitabwaho.",
      impactTag: "Ingaruka z'ingenzi",
      impactQuote:
        "CivicGuard si urubuga rwo gutanga raporo gusa. Ni uburyo busangiwe bukora hagati y'abaturage, ubuyobozi bw'akarere na Kigali Smart City Initiative.",
      impactAuthor: "Ibiro bishinzwe guhuza Smart City",
      impactRole: "Gukurikirana umutekano w'abaturage i Kigali",
      contactTag: "Twandikire",
      contactTitle: "Komeza guhuza na CivicGuard response network.",
      contactOfficeLabel: "Ibiro bishinzwe guhuza",
      contactOfficeText: "Kigali Smart City Initiative, Ishami rikurikirana umutekano w'abaturage",
      contactEmailLabel: "Imeyili",
      contactPhoneLabel: "Telefone",
      experienceTag: "Uburyo ikora",
      experienceTitle: "Reba uko CivicGuard ihuza abaturage, admin n'umujyi muri sisitemu imwe.",
      expCitizenTab: "Umuturage",
      expAdminTab: "Admin",
      expImpactTab: "Ingaruka",
      expCitizenTitle: "Gutanga raporo byoroshye ku muturage wese",
      expCitizenText: "Abaturage binjira muri sisitemu, bagatanga ibibazo kandi bagahita bakurikirana ihinduka rya status.",
      expCitizenPointOne: "Raporo zihuse zifite ibyiciro bisobanutse",
      expCitizenPointTwo: "Gukurikirana ikibazo cyawe bwite",
      expCitizenPointThree: "Kuboneka mu Cyongereza, Igifaransa n'Ikinyarwanda",
      expAdminTitle: "Igenzura ku bakozi bashinzwe ibisubizo",
      expAdminText: "Admin bareba dosiye zifunguye, bagahindura status kandi bagakurikirana trends z'ibibazo.",
      expAdminPointOne: "Gushyira imbere ibibazo byihutirwa",
      expAdminPointTwo: "Gusubiza abaturage ako kanya",
      expAdminPointThree: "Gukoresha imibare mu igenamigambi",
      expImpactTitle: "Yubakiwe gutanga agaciro nyakuri",
      expImpactText: "Urubuga ruzana gukorera mu mucyo, kubazwa inshingano no gukorana neza ku rwego rw'akarere.",
      expImpactPointOne: "Amakuru asobanutse ku bakozi b'umujyi",
      expImpactPointTwo: "Itumanaho ryiza n'abaturage",
      expImpactPointThree: "Ibimenyetso bifasha ibyemezo bya smart city",
      faqTag: "Ibibazo",
      faqTitle: "Ibibazo bikunze kubazwa n'abakoresha n'abatabazi.",
      faqOneQ: "Who can use CivicGuard?",
      faqOneA: "Citizens can report and track incidents, while administrators manage operational response and city-level analytics.",
      faqTwoQ: "How are incidents prioritized?",
      faqTwoA: "Each report captures urgency, location, and type so district teams can identify high-risk cases and respond faster.",
      faqThreeQ: "Can users follow status updates?",
      faqThreeA: "Yes. Citizens can track their submitted incidents as they move from submitted to review and finally to resolution.",
      footerText: "Gukurikirana umutekano w'abaturage bijyanye na Kigali Smart City Initiative.",
      footerCopyright: "© 2026 CivicGuard Kigali • Official Republic of Rwanda Portal",
      authEyebrow: "Kwinjira mu mutekano",
      authTagline: "Kongerera umutekano w'abaturage imbaraga binyuze mu gutanga raporo zubatswe neza",
      authPointOne: "Tanga raporo z'ibibazo by'umutekano vuba kandi mu buryo bunoze.",
      authPointTwo: "Kurikira buri kibazo kuva cyoherejwe kugeza gikemutse.",
      authPointThree: "Fasha admin n'amakuru ateguwe neza.",
      authPanelTitle: "Murakaza neza kuri CivicGuard",
      authPanelText: "Injira kugira ngo ukomeze, cyangwa fungura konti nshya y'umuturage.",
      loginTab: "Injira",
      registerTab: "Iyandikishe",
      emailAddress: "Imeyili",
      passwordLabel: "Ijambobanga",
      confirmPasswordLabel: "Emeza ijambobanga",
      showPassword: "Reba",
      hidePassword: "Hisha",
      forgotPassword: "Wibagiwe ijambobanga",
      loginButton: "Injira",
      registerButton: "Fungura konti",
      noAccount: "Nta konti ufite?",
      registerLink: "Iyandikishe",
      haveAccount: "Usanzwe ufite konti?",
      loginLink: "Injira",
      fullName: "Amazina yose",
      logoutButton: "Sohoka",
      demoCredentials: "Koresha amakuru yemewe ya konti yawe kugirango ukomeze.",
      forgotPasswordMessage: "Gusubizaho ijambobanga bicungwa n'umuyobozi wa sisitemu.",
      loginError: "Imeyili cyangwa ijambobanga si byo.",
      registerErrorExists: "Iyi email isanzwe ifite konti.",
      registerErrorMatch: "Amapassword ntahura.",
      registerErrorLength: "Password igomba kuba nibura inyuguti 6.",
      registerSuccess: "Kwiyandikisha byagenze neza. Ubu ushobora kwinjira.",
      citizenEyebrow: "Dashboard y'umuturage",
      citizenLineOne: "Tanga raporo ku",
      citizenLineTwo: "bibazo by'umutekano",
      citizenTitle: "Tanga raporo y'ibibazo by'umutekano kandi ukurikirane buri gihinduka.",
      reportsFiled: "Raporo zatanzwe",
      activeCases: "Imanza zikora",
      newIncidentTitle: "Raporo nshya y'ikibazo",
      newIncidentText: "Tanga amakuru yuzuye kugira ngo umujyi ubashe gutabara vuba.",
      incidentType: "Ubwoko bw'ikibazo",
      typeRoad: "Ikibazo cyo mu muhanda",
      typeStreetlight: "Amatara yo ku muhanda yazimye",
      typeSuspicious: "Igikorwa giteye amakenga",
      typeEmergency: "Ubutabazi bwihuse",
      typeWaste: "Imyanda yamenwe nabi",
      locationLabel: "Aho byabereye",
      urgencyLabel: "Ubukana",
      urgencyLow: "Buke",
      urgencyMedium: "Hagati",
      urgencyHigh: "Bukomeye",
      urgencyCritical: "Burenze urugero",
      descriptionLabel: "Ibisobanuro",
      submitIncident: "Ohereza ikibazo",
      statusTrackerTitle: "Status ya raporo zanjye",
      statusTrackerText: "Kurikira urugendo rwa buri raporo watanze.",
      filterAll: "Byose",
      statusSubmitted: "Byoherejwe",
      statusReview: "Birimo gusuzumwa",
      statusResolved: "Byakemutse",
      adminEyebrow: "Ikigo cy'igenzura cya admin",
      adminLineOne: "Suzuma kandi",
      adminLineTwo: "subiza vuba",
      adminTitle: "Suzuma ibibazo, subiza vuba kandi upime imikorere y'umutekano w'umujyi.",
      metricTotal: "Raporo zose",
      metricCritical: "Ibibazo bikomeye",
      metricResolved: "Byakemutse",
      analyticsTitle: "Isesengura ry'ibibazo",
      analyticsText: "Imibare y'ingenzi yo gufasha igenamigambi.",
      queueTitle: "Urutonde rwo gusubiza",
      queueText: "Ibibazo bifunguye bisaba igikorwa cyangwa itumanaho.",
      validationError: "Uzuza ibisabwa byose kuri raporo.",
      incidentCreated: "Raporo yoherejwe neza.",
      noCitizenReports: "Nta raporo ihuye n'iyi filteri.",
      noAdminReports: "Nta kibazo gihari. Raporo z'abaturage zizagaragara hano.",
      adminResponseLabel: "Ubutumwa bwa admin",
      sendResponse: "Bika igisubizo",
      statusUpdated: "Status yahinduwe",
      reportBy: "Byatanzwe na",
      submittedOn: "Byatanzwe",
      urgency: "Ubukana",
      district: "Akarere",
      sessionCitizen: "Winjiye nk'umuturage",
      sessionAdmin: "Winjiye nka admin",
      signOutLabel: "Sohoka",
    },
  };

  function read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getTheme() {
    return read(STORAGE_KEYS.theme, "light");
  }

  function setTheme(theme) {
    write(STORAGE_KEYS.theme, theme);
    document.body.dataset.theme = theme;
  }

  function getLanguage() {
    return read(STORAGE_KEYS.lang, "en");
  }

  function setLanguage(lang) {
    write(STORAGE_KEYS.lang, lang);
    applyTranslations();
    hydrateDynamicViews();
  }

  function getUsers() {
    return read(STORAGE_KEYS.users, []);
  }

  function saveUsers(users) {
    write(STORAGE_KEYS.users, users);
  }

  function getIncidents() {
    return read(STORAGE_KEYS.incidents, []);
  }

  function saveIncidents(incidents) {
    write(STORAGE_KEYS.incidents, incidents);
  }

  function getSession() {
    return read(STORAGE_KEYS.session, null);
  }

  function setSession(session) {
    write(STORAGE_KEYS.session, session);
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.session);
  }

  function seedUsers() {
    const users = getUsers();
    const seeded = Array.isArray(users) ? [...users] : [];

    const adminEmail = "admin@civicguard.rw";
    const hasAdmin = seeded.some((entry) => String(entry.email || "").toLowerCase() === adminEmail);
    if (!hasAdmin) {
      seeded.push({
        id: crypto.randomUUID(),
        name: "City Admin",
        email: adminEmail,
        password: "Admin123!",
        role: "admin",
        district: "Gasabo",
      });
    }

    const citizenEmail = "aline@example.com";
    const hasCitizen = seeded.some((entry) => String(entry.email || "").toLowerCase() === citizenEmail);
    if (!hasCitizen) {
      seeded.push({
        id: crypto.randomUUID(),
        name: "Aline Uwimana",
        email: citizenEmail,
        password: "Citizen123!",
        role: "citizen",
        district: "Gasabo",
      });
    }

    saveUsers(seeded);
  }

  function seedIncidents() {
    if (getIncidents().length) return;
    saveIncidents([
      {
        id: crypto.randomUUID(),
        citizenName: "Aline Uwimana",
        citizenEmail: "aline@example.com",
        district: "Gasabo",
        type: "Streetlight outage",
        location: "Kacyiru near KG 7 Ave",
        urgency: "Medium",
        description: "Three streetlights have been off for two nights near the pedestrian crossing.",
        status: "In Review",
        adminResponse: "Maintenance team assigned for inspection before 20:00.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
      },
      {
        id: crypto.randomUUID(),
        citizenName: "Eric Mugisha",
        citizenEmail: "eric@example.com",
        district: "Nyarugenge",
        type: "Road hazard",
        location: "Nyabugogo junction",
        urgency: "High",
        description: "Large pothole causing vehicles to swerve into the bus lane.",
        status: "Submitted",
        adminResponse: "",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      },
      {
        id: crypto.randomUUID(),
        citizenName: "Keza Irakoze",
        citizenEmail: "keza@example.com",
        district: "Kicukiro",
        type: "Waste dumping",
        location: "Gikondo industrial access road",
        urgency: "Low",
        description: "Illegal dumping growing near the drainage edge.",
        status: "Resolved",
        adminResponse: "Cleanup completed and enforcement notified.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
      },
    ]);
  }

  function t(key) {
    const lang = getLanguage();
    return translations[lang][key] || translations.en[key] || key;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatDate(iso) {
    return new Intl.DateTimeFormat(getLanguage(), {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  }

  function statusTone(status) {
    if (status === "Resolved") return "success";
    if (status === "In Review") return "medium";
    return "critical";
  }

  function urgencyTone(urgency) {
    if (urgency === "Critical" || urgency === "High") return "critical";
    if (urgency === "Medium") return "medium";
    return "success";
  }

  function getDashboardHref(session) {
    if (!session) return "auth.html";
    return session.role === "admin" ? "admin.html" : "citizen.html";
  }

  function applyTranslations() {
    document.documentElement.lang = getLanguage();
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });
    const languageSelect = document.getElementById("language-select");
    if (languageSelect) languageSelect.value = getLanguage();
  }

  function updateNavLinks() {
    const session = getSession();
    const authLink = document.querySelector("[data-auth-link]");
    if (authLink) {
      authLink.textContent = session ? t("signOutLabel") : t("openPortal");
      authLink.setAttribute("href", session ? "auth.html" : "auth.html");
      if (session) {
        authLink.addEventListener(
          "click",
          function (event) {
            event.preventDefault();
            clearSession();
            window.location.href = "auth.html";
          },
          { once: true }
        );
      }
    }

    document.querySelectorAll("[data-dashboard-link]").forEach((link) => {
      link.setAttribute("href", getDashboardHref(session));
    });

    document.querySelectorAll("[data-report-link]").forEach((link) => {
      const href = session && session.role === "citizen" ? "citizen.html#report-form" : "auth.html";
      link.setAttribute("href", href);
    });
  }

  function updateLandingStats() {
    const incidents = getIncidents();
    const reportsNode = document.querySelector('[data-stat="reports"]');
    const resolvedNode = document.querySelector('[data-stat="resolved"]');
    if (reportsNode) reportsNode.textContent = String(incidents.length);
    if (resolvedNode) {
      resolvedNode.textContent = String(incidents.filter((incident) => incident.status === "Resolved").length);
    }
  }

  var CCTV_CAMERAS = {
    Gasabo: [
      { unitId: 'CAM-GSB-001', location: 'Kacyiru – KG 7 Ave junction', streamUrl: 'rtsp://cctv.kigali.gov.rw/gasabo/cam001/live', online: true },
      { unitId: 'CAM-GSB-002', location: 'Kimironko Market entrance', streamUrl: 'rtsp://cctv.kigali.gov.rw/gasabo/cam002/live', online: false },
    ],
    Nyarugenge: [
      { unitId: 'CAM-NYR-001', location: 'Nyabugogo Bus Terminal', streamUrl: 'rtsp://cctv.kigali.gov.rw/nyarugenge/cam001/live', online: true },
      { unitId: 'CAM-NYR-002', location: 'CBD – KN 4 Ave & KN 3 Rd', streamUrl: 'rtsp://cctv.kigali.gov.rw/nyarugenge/cam002/live', online: true },
    ],
    Kicukiro: [
      { unitId: 'CAM-KIC-001', location: 'Sonatubes roundabout', streamUrl: 'rtsp://cctv.kigali.gov.rw/kicukiro/cam001/live', online: true },
      { unitId: 'CAM-KIC-002', location: 'Gikondo Industrial Zone gate', streamUrl: 'rtsp://cctv.kigali.gov.rw/kicukiro/cam002/live', online: false },
    ],
  };

  var cctvState = { district: 'Gasabo', selectedUnitId: 'CAM-GSB-001' };

  function classifySeverity(type, urgency) {
    var t = String(type).toLowerCase();
    if (urgency === 'Critical' || t.includes('emergency') || t.includes('fire')) return 'P1';
    if (urgency === 'High' || t.includes('suspicious') || t.includes('crime')) return 'P2';
    return 'P3';
  }

  function severityBadgeHtml(severity) {
    var palettes = { P1: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }, P2: { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' }, P3: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' } };
    var p = palettes[severity] || palettes['P3'];
    return '<span style="display:inline-block;padding:2px 8px;border-radius:4px;background:' + p.bg + ';color:' + p.color + ';border:1px solid ' + p.border + ';font-size:10px;font-weight:900;letter-spacing:0.08em;">' + severity + '</span>';
  }

  function camIconOnline() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 10 4.553-2.069A1 1 0 0 1 21 8.845v6.31a1 1 0 0 1-1.447.916L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/></svg>';
  }

  function camIconOffline() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.66 6H14a2 2 0 0 1 2 2v2.34l1 1L21 8.845v6.31a1 1 0 0 1-1.447.916L15 14"/><path d="M16 16a2 2 0 0 1-2 2H5a2 2 0 0 0-2-2V8a2 2 0 0 1 .414-1.318"/><line x1="2" y1="2" x2="22" y2="22"/></svg>';
  }

  function renderCctvMonitor() {
    var container = document.getElementById('cctv-monitor');
    if (!container) return;
    var districts = ['Gasabo', 'Nyarugenge', 'Kicukiro'];
    var cameras = CCTV_CAMERAS[cctvState.district] || [];
    var selectedCam = cameras.find(function(c) { return c.unitId === cctvState.selectedUnitId; }) || cameras[0];
    var allCams = [].concat(CCTV_CAMERAS.Gasabo, CCTV_CAMERAS.Nyarugenge, CCTV_CAMERAS.Kicukiro);
    var totalOnline = allCams.filter(function(c) { return c.online; }).length;

    var districtTabs = districts.map(function(d) {
      var active = cctvState.district === d;
      return '<button onclick="window.selectCctvDistrict(\'' + d + '\')" style="flex:1;padding:10px 4px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;border:none;cursor:pointer;background:' + (active ? '#059669' : 'transparent') + ';color:' + (active ? '#fff' : '#64748b') + ';">' + d + '</button>';
    }).join('');

    var cameraItems = cameras.map(function(cam) {
      var sel = selectedCam && selectedCam.unitId === cam.unitId;
      return '<button onclick="window.selectCctvCamera(\'' + cam.unitId + '\')" style="width:100%;display:flex;align-items:center;gap:12px;padding:14px 20px;border:none;cursor:pointer;text-align:left;background:' + (sel ? '#1e293b' : 'transparent') + ';border-left:3px solid ' + (sel ? '#10b981' : 'transparent') + ';">' +
        '<div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:' + (cam.online ? '#10b98120' : '#334155') + ';">' + (cam.online ? camIconOnline() : camIconOffline()) + '</div>' +
        '<div style="min-width:0;">' +
          '<div style="font-size:11px;font-weight:900;color:#f1f5f9;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + cam.unitId + '</div>' +
          '<div style="font-size:10px;color:#64748b;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + cam.location + '</div>' +
          '<div style="margin-top:3px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:0.12em;color:' + (cam.online ? '#10b981' : '#475569') + ';">' + (cam.online ? '● Online' : '○ Offline') + '</div>' +
        '</div></button>';
    }).join('');

    var feedHtml = '';
    if (selectedCam) {
      var videoPanel = selectedCam.online
        ? '<div style="text-align:center;">' +
            '<div style="width:56px;height:56px;border-radius:50%;background:#10b98115;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="10" ry="6"/><ellipse cx="12" cy="12" rx="4" ry="2"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="18" x2="12" y2="22"/></svg>' +
            '</div>' +
            '<p style="color:#94a3b8;font-size:12px;font-weight:700;">Simulated Live Stream</p>' +
            '<p style="color:#334155;font-size:10px;font-family:monospace;margin-top:4px;padding:0 16px;word-break:break-all;">' + selectedCam.streamUrl + '</p>' +
          '</div>' +
          '<div style="position:absolute;top:10px;left:10px;display:flex;align-items:center;gap:6px;background:rgba(0,0,0,0.65);padding:4px 10px;border-radius:6px;">' +
            '<span style="width:7px;height:7px;border-radius:50%;background:#ef4444;display:inline-block;"></span>' +
            '<span style="font-size:9px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:0.15em;">REC</span>' +
          '</div>' +
          '<div style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.65);padding:4px 10px;border-radius:6px;">' +
            '<span id="cctv-clock" style="font-size:10px;font-weight:900;color:#10b981;font-family:monospace;">' + new Date().toLocaleTimeString() + '</span>' +
          '</div>' +
          '<div style="position:absolute;bottom:10px;left:10px;background:rgba(0,0,0,0.65);padding:4px 10px;border-radius:6px;">' +
            '<span style="font-size:9px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:0.1em;">' + selectedCam.location + '</span>' +
          '</div>'
        : '<div style="text-align:center;">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 10px;display:block;"><path d="M10.66 6H14a2 2 0 0 1 2 2v2.34l1 1L21 8.845v6.31a1 1 0 0 1-1.447.916L15 14"/><path d="M16 16a2 2 0 0 1-2 2H5a2 2 0 0 0-2-2V8a2 2 0 0 1 .414-1.318"/><line x1="2" y1="2" x2="22" y2="22"/></svg>' +
            '<p style="color:#475569;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Camera Offline</p>' +
            '<p style="color:#334155;font-size:10px;margin-top:4px;">No signal from ' + selectedCam.unitId + '</p>' +
          '</div>';

      feedHtml =
        '<div style="position:relative;background:#020617;border-radius:12px;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;border:1px solid #1e293b;overflow:hidden;">' + videoPanel + '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;">' +
          '<div style="background:#1e293b;border-radius:10px;padding:12px;"><div style="font-size:9px;font-weight:900;color:#475569;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:4px;">Unit ID</div><div style="font-size:12px;font-weight:900;color:#fff;font-family:monospace;">' + selectedCam.unitId + '</div></div>' +
          '<div style="background:#1e293b;border-radius:10px;padding:12px;"><div style="font-size:9px;font-weight:900;color:#475569;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:4px;">District</div><div style="font-size:12px;font-weight:900;color:#10b981;">' + cctvState.district + '</div></div>' +
          '<div style="background:#1e293b;border-radius:10px;padding:12px;grid-column:1/-1;"><div style="font-size:9px;font-weight:900;color:#475569;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:4px;">RTSP Stream URL</div><div style="font-size:10px;font-family:monospace;color:#94a3b8;word-break:break-all;">' + selectedCam.streamUrl + '</div></div>' +
          '<div style="background:#1e293b;border-radius:10px;padding:12px;grid-column:1/-1;"><div style="font-size:9px;font-weight:900;color:#475569;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:4px;">Status</div><div style="font-size:11px;font-weight:900;color:' + (selectedCam.online ? '#10b981' : '#ef4444') + ';text-transform:uppercase;letter-spacing:0.1em;">' + (selectedCam.online ? '● Live — Streaming' : '○ Offline — No Signal') + '</div></div>' +
        '</div>';
    }

    container.innerHTML =
      '<div style="background:#0f172a;border-radius:16px;overflow:hidden;border:1px solid #1e293b;margin-bottom:0;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid #1e293b;">' +
          '<div style="display:flex;align-items:center;gap:12px;">' +
            '<div style="width:36px;height:36px;background:#10b98120;border-radius:10px;display:flex;align-items:center;justify-content:center;">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 10 4.553-2.069A1 1 0 0 1 21 8.845v6.31a1 1 0 0 1-1.447.916L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/></svg>' +
            '</div>' +
            '<div>' +
              '<div style="font-size:13px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:0.05em;">CCTV Camera Monitor</div>' +
              '<div style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Kigali Safe City — ' + totalOnline + '/' + allCams.length + ' cameras online</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<span style="width:8px;height:8px;border-radius:50%;background:#10b981;display:inline-block;"></span>' +
            '<span style="font-size:10px;font-weight:900;color:#10b981;text-transform:uppercase;letter-spacing:0.1em;">Live Feed</span>' +
          '</div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:260px 1fr;">' +
          '<div style="border-right:1px solid #1e293b;">' +
            '<div style="display:flex;border-bottom:1px solid #1e293b;">' + districtTabs + '</div>' +
            '<div>' + cameraItems + '</div>' +
          '</div>' +
          '<div style="padding:20px;">' + feedHtml + '</div>' +
        '</div>' +
      '</div>';

    if (selectedCam && selectedCam.online) {
      clearInterval(window._cctvClockInterval);
      window._cctvClockInterval = setInterval(function() {
        var clock = document.getElementById('cctv-clock');
        if (clock) clock.textContent = new Date().toLocaleTimeString();
        else clearInterval(window._cctvClockInterval);
      }, 1000);
    }
  }

  window.selectCctvDistrict = function(district) {
    cctvState.district = district;
    var cameras = CCTV_CAMERAS[district] || [];
    cctvState.selectedUnitId = cameras[0] ? cameras[0].unitId : null;
    renderCctvMonitor();
  };

  window.selectCctvCamera = function(unitId) {
    cctvState.selectedUnitId = unitId;
    renderCctvMonitor();
  };

  function renderCitizenReports() {
    const container = document.getElementById("citizen-reports");
    if (!container) return;
    const session = getSession();
    const filter = document.getElementById("citizen-filter")?.value || "all";
    const owned = getIncidents().filter((incident) => session && incident.citizenEmail === session.email);
    const reports = owned
      .filter((incident) => filter === "all" || incident.status === filter)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const totalNode = document.getElementById("citizen-total");
    const openNode = document.getElementById("citizen-open");
    if (totalNode) totalNode.textContent = String(owned.length);
    if (openNode) openNode.textContent = String(owned.filter((incident) => incident.status !== "Resolved").length);

    if (!reports.length) {
      container.innerHTML = `<div class="empty-state">${t("noCitizenReports")}</div>`;
      return;
    }

    container.innerHTML = reports
      .map(
        (incident) => `
        <article class="report-card">
          <div class="report-card__head">
            <div>
              <h3>${escapeHtml(incident.type)}</h3>
              <p>${escapeHtml(incident.location)}</p>
            </div>
            <span class="badge" data-tone="${statusTone(incident.status)}">${incident.status}</span>
          </div>
          <div class="report-card__meta">
            <span>${t("submittedOn")}: ${formatDate(incident.timestamp)}</span>
            <span>${t("urgency")}: <span class="badge" data-tone="${urgencyTone(incident.urgency)}">${incident.urgency}</span></span>
          </div>
          <p>${escapeHtml(incident.description)}</p>
          <div class="timeline">
            <span class="${incident.status === "Submitted" ? "is-active" : ""}">${t("statusSubmitted")}</span>
            <span class="${incident.status === "In Review" ? "is-active" : ""}">${t("statusReview")}</span>
            <span class="${incident.status === "Resolved" ? "is-active" : ""}">${t("statusResolved")}</span>
          </div>
          <p class="footer-note">${escapeHtml(incident.adminResponse || "-")}</p>
        </article>`
      )
      .join("");
  }

  function renderAdminReports() {
    const container = document.getElementById("admin-reports");
    if (!container) return;
    const incidents = getIncidents().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (!incidents.length) {
      container.innerHTML = `<div class="empty-state">${t("noAdminReports")}</div>`;
      return;
    }
    container.innerHTML = incidents
      .map(
        (incident) => `
          <article class="report-card">
            <div class="report-card__head">
              <div>
                <h3>${escapeHtml(incident.type)}</h3>
                <p>${escapeHtml(incident.location)}</p>
              </div>
              <span class="badge" data-tone="${statusTone(incident.status)}">${incident.status}</span>
            </div>
            <div class="report-card__meta">
              <span>${t("reportBy")}: ${escapeHtml(incident.citizenName)}</span>
              <span>${t("district")}: ${escapeHtml(incident.district)}</span>
              <span>${t("urgency")}: <span class="badge" data-tone="${urgencyTone(incident.urgency)}">${incident.urgency}</span></span>
              <span>Severity: ${severityBadgeHtml(classifySeverity(incident.type, incident.urgency))}</span>
            </div>
            <p>${escapeHtml(incident.description)}</p>
            <div class="admin-actions">
              <select data-status-id="${incident.id}">
                <option value="Submitted" ${incident.status === "Submitted" ? "selected" : ""}>${t("statusSubmitted")}</option>
                <option value="In Review" ${incident.status === "In Review" ? "selected" : ""}>${t("statusReview")}</option>
                <option value="Resolved" ${incident.status === "Resolved" ? "selected" : ""}>${t("statusResolved")}</option>
              </select>
              <input type="text" data-response-id="${incident.id}" value="${escapeHtml(incident.adminResponse || "")}" placeholder="${t("adminResponseLabel")}" />
              <button class="solid-button" type="button" data-save-id="${incident.id}">${t("sendResponse")}</button>
            </div>
          </article>`
      )
      .join("");
  }

  function renderAnalytics() {
    const container = document.getElementById("analytics-bars");
    if (!container) return;
    const incidents = getIncidents();
    const total = incidents.length || 1;
    const byType = incidents.reduce((acc, incident) => {
      acc[incident.type] = (acc[incident.type] || 0) + 1;
      return acc;
    }, {});
    const totalNode = document.getElementById("metric-total");
    const criticalNode = document.getElementById("metric-critical");
    const resolvedNode = document.getElementById("metric-resolved");
    if (totalNode) totalNode.textContent = String(incidents.length);
    if (criticalNode) criticalNode.textContent = String(incidents.filter((incident) => incident.urgency === "Critical" || incident.urgency === "High").length);
    if (resolvedNode) resolvedNode.textContent = String(incidents.filter((incident) => incident.status === "Resolved").length);
    container.innerHTML = Object.entries(byType)
      .map(
        ([type, count]) => `
          <div class="bar-row">
            <span>${escapeHtml(type)}</span>
            <div class="bar"><span style="width:${(count / total) * 100}%"></span></div>
            <strong>${count}</strong>
          </div>`
      )
      .join("");
  }

  function hydrateSessionSummary() {
    const session = getSession();
    const summary = document.getElementById("session-summary");
    if (!summary || !session) return;
    const label = session.role === "admin" ? t("sessionAdmin") : t("sessionCitizen");
    summary.textContent = `${label}: ${session.name} • ${session.district}`;
  }

  function routeProtection() {
    const page = document.body.dataset.page;
    const session = getSession();
    if (page === "citizen" && (!session || session.role !== "citizen")) window.location.href = "auth.html";
    if (page === "admin" && (!session || session.role !== "admin")) window.location.href = "auth.html";
  }

  function attachGlobalEvents() {
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        setTheme(getTheme() === "dark" ? "light" : "dark");
      });
    }

    const languageSelect = document.getElementById("language-select");
    if (languageSelect) {
      languageSelect.addEventListener("change", (event) => setLanguage(event.target.value));
    }

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        clearSession();
        window.location.href = "auth.html";
      });
    }
  }

  function showMessage(id, text, visible) {
    const node = document.getElementById(id);
    if (!node) return;
    node.hidden = !visible;
    node.textContent = visible ? text : "";
  }

  function switchAuthTab(tab) {
    const registerModal = document.getElementById("register-modal");
    const registerForm = document.getElementById("register-form");
    document.querySelectorAll("[data-auth-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.authTab === tab);
    });
    if (registerModal) registerModal.hidden = tab !== "register";
    document.body.classList.toggle("auth-modal-open", tab === "register");
    if (tab !== "register" && registerForm) registerForm.reset();
    showMessage("login-error", "", false);
    showMessage("login-info", "", false);
    showMessage("register-error", "", false);
    showMessage("register-success", "", false);
  }

  function attachAuthForms() {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const registerModal = document.getElementById("register-modal");
    const registerDialog = registerModal ? registerModal.querySelector(".auth-modal__dialog") : null;
    const createAccountButtons = document.querySelectorAll('[data-switch-tab="register"]');
    const closeModalButtons = registerModal ? registerModal.querySelectorAll('[data-switch-tab="login"]') : [];
    if (!loginForm || !registerForm) return;

    document.querySelectorAll("[data-auth-tab]").forEach((button) => {
      button.addEventListener("click", () => switchAuthTab(button.dataset.authTab));
    });

    createAccountButtons.forEach((button) => {
      button.addEventListener("click", () => switchAuthTab("register"));
    });

    closeModalButtons.forEach((button) => {
      button.addEventListener("click", () => switchAuthTab("login"));
    });

    if (registerModal) {
      registerModal.addEventListener("click", (event) => {
        if (event.target === registerModal || event.target.classList.contains("auth-modal__backdrop")) {
          switchAuthTab("login");
        }
      });
    }

    if (registerDialog) {
      registerDialog.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    }

    if (registerModal) {
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !registerModal.hidden) {
          switchAuthTab("login");
        }
      });
    }

    document.querySelectorAll("[data-toggle-password]").forEach((button) => {
      button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.togglePassword);
        if (!input) return;
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        button.textContent = show ? t("hidePassword") : t("showPassword");
      });
    });

    const forgotPassword = document.getElementById("forgot-password");
    if (forgotPassword) {
      forgotPassword.addEventListener("click", () => {
        showMessage("login-error", t("forgotPasswordMessage"), true);
      });
    }

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const email = String(formData.get("email") || "").trim().toLowerCase();
      const password = String(formData.get("password") || "");
      const user = getUsers().find((entry) => entry.email.toLowerCase() === email && entry.password === password);
      if (!user) {
        showMessage("login-error", t("loginError"), true);
        return;
      }
      setSession({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
      });
      window.location.href = getDashboardHref(user);
    });

    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim().toLowerCase();
      const password = String(formData.get("password") || "");
      const confirmPassword = String(formData.get("confirmPassword") || "");
      const users = getUsers();

      if (users.some((entry) => entry.email.toLowerCase() === email)) {
        showMessage("register-error", t("registerErrorExists"), true);
        return;
      }
      if (password.length < 6) {
        showMessage("register-error", t("registerErrorLength"), true);
        return;
      }
      if (password !== confirmPassword) {
        showMessage("register-error", t("registerErrorMatch"), true);
        return;
      }

      users.push({
        id: crypto.randomUUID(),
        name,
        email,
        password,
        role: "citizen",
        district: "Gasabo",
      });
      saveUsers(users);
      registerForm.reset();
      showMessage("register-error", "", false);
      switchAuthTab("login");
      showMessage("login-info", t("registerSuccess"), true);
      const loginEmail = document.getElementById("login-email");
      if (loginEmail) loginEmail.value = email;
    });
  }

  function attachAuthEnhancements() {
    const passwordInput = document.getElementById("register-password");
    const strengthBar = document.querySelector("[data-password-strength]");
    const strengthLabel = document.querySelector("[data-password-strength-label]");
    if (!passwordInput || !strengthBar || !strengthLabel) return;

    function computeStrength(value) {
      let score = 0;
      if (value.length >= 8) score += 1;
      if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
      if (/\d/.test(value)) score += 1;
      if (/[^A-Za-z0-9]/.test(value)) score += 1;
      return Math.min(score, 4);
    }

    function updateStrength() {
      const score = computeStrength(passwordInput.value);
      strengthBar.dataset.score = String(score);
      if (!passwordInput.value) {
        strengthLabel.textContent = "Password strength: very weak";
        return;
      }
      const labels = ["very weak", "weak", "fair", "strong", "very strong"];
      strengthLabel.textContent = `Password strength: ${labels[score]}`;
    }

    passwordInput.addEventListener("input", updateStrength);
    updateStrength();
  }

  function attachCitizenForm() {
    const form = document.getElementById("incident-form");
    if (!form) return;
    const filter = document.getElementById("citizen-filter");
    if (filter) filter.addEventListener("change", renderCitizenReports);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const session = getSession();
      const formData = new FormData(form);
      const type = String(formData.get("type") || "").trim();
      const location = String(formData.get("location") || "").trim();
      const urgency = String(formData.get("urgency") || "").trim();
      const description = String(formData.get("description") || "").trim();
      if (!type || !location || !urgency || !description || !session) {
        alert(t("validationError"));
        return;
      }
      const incidents = getIncidents();
      incidents.push({
        id: crypto.randomUUID(),
        citizenName: session.name,
        citizenEmail: session.email,
        district: session.district,
        type,
        location,
        urgency,
        description,
        status: "Submitted",
        adminResponse: "",
        timestamp: new Date().toISOString(),
      });
      saveIncidents(incidents);
      form.reset();
      alert(t("incidentCreated"));
      hydrateDynamicViews();
    });
  }

  function attachAdminActions() {
    const container = document.getElementById("admin-reports");
    if (!container) return;
    container.addEventListener("click", (event) => {
      const button = event.target.closest("[data-save-id]");
      if (!button) return;
      const incidentId = button.dataset.saveId;
      const status = container.querySelector(`[data-status-id="${incidentId}"]`)?.value || "Submitted";
      const response = container.querySelector(`[data-response-id="${incidentId}"]`)?.value || "";
      const incidents = getIncidents().map((incident) =>
        incident.id === incidentId ? { ...incident, status, adminResponse: `${t("statusUpdated")}. ${response}`.trim() } : incident
      );
      saveIncidents(incidents);
      hydrateDynamicViews();
    });
  }

  function buildMapUrl(lat, lon) {
    const lngDelta = 0.022;
    const latDelta = 0.015;
    const left = (lon - lngDelta).toFixed(5);
    const right = (lon + lngDelta).toFixed(5);
    const bottom = (lat - latDelta).toFixed(5);
    const top = (lat + latDelta).toFixed(5);
    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat.toFixed(5)}%2C${lon.toFixed(5)}`;
  }

  async function updateMapEmbed(frameId, captionId, locationLabel) {
    const frame = document.getElementById(frameId);
    const caption = document.getElementById(captionId);
    if (!frame) return;

    if (!locationLabel) {
      frame.src = "https://www.openstreetmap.org/export/embed.html?bbox=30.0300%2C-1.9800%2C30.1800%2C-1.8600&layer=mapnik";
      if (caption) caption.textContent = "Showing Kigali city center map.";
      return;
    }

    const query = `${locationLabel}, Kigali, Rwanda`;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      const places = await response.json();
      const place = Array.isArray(places) ? places[0] : null;
      if (!place) {
        if (caption) caption.textContent = `Location not found precisely: ${locationLabel}`;
        return;
      }
      const lat = Number(place.lat);
      const lon = Number(place.lon);
      frame.src = buildMapUrl(lat, lon);
      if (caption) caption.textContent = `Focused on: ${locationLabel}`;
    } catch (_error) {
      if (caption) caption.textContent = `Unable to load map lookup right now.`;
    }
  }

  function attachDashboardMaps() {
    const citizenInput = document.getElementById("incident-location");
    if (citizenInput) {
      let debounceTimer = null;
      const updateFromInput = () => {
        window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(() => {
          updateMapEmbed("citizen-map-frame", "citizen-map-caption", citizenInput.value.trim());
        }, 350);
      };
      citizenInput.addEventListener("input", updateFromInput);
      updateFromInput();
    }

    const adminMap = document.getElementById("admin-map-frame");
    if (adminMap) {
      const incidents = getIncidents().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const latestLocation = incidents[0]?.location || "";
      updateMapEmbed("admin-map-frame", "admin-map-caption", latestLocation);
    }
  }

  function hydrateDynamicViews() {
    updateNavLinks();
    updateLandingStats();
    hydrateSessionSummary();
    renderCitizenReports();
    renderAdminReports();
    renderAnalytics();
    renderCctvMonitor();
    attachDashboardMaps();
  }

  function attachLandingInteractions() {
    document.querySelectorAll("[data-experience-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.experienceTab;
        document.querySelectorAll("[data-experience-tab]").forEach((tab) => {
          tab.classList.toggle("is-active", tab === button);
        });
        document.querySelectorAll("[data-experience-panel]").forEach((panel) => {
          panel.classList.toggle("is-active", panel.dataset.experiencePanel === target);
        });
      });
    });

    document.querySelectorAll("[data-faq-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const answer = button.parentElement.querySelector(".faq-answer");
        const icon = button.querySelector("strong");
        const willOpen = answer.hidden;
        answer.hidden = !willOpen;
        icon.textContent = willOpen ? "-" : "+";
      });
    });
  }

  function init() {
    seedUsers();
    seedIncidents();
    setTheme(getTheme());
    routeProtection();
    applyTranslations();
    attachGlobalEvents();
    attachAuthForms();
    attachAuthEnhancements();
    attachCitizenForm();
    attachAdminActions();
    attachLandingInteractions();
    hydrateDynamicViews();
  }

  init();
})();
