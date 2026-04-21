import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Language = 'en' | 'fr' | 'rw';
type Theme = 'light' | 'dark';

type Dict = Record<string, string>;

const dictionary: Record<Language, Dict> = {
  en: {
    navHome: 'Home',
    navReport: 'Report Incident',
    navAbout: 'About Us',
    navContact: 'Contact',
    navDashboard: 'Dashboard',
    navLanguage: 'Language',
    navMode: 'Mode',
    navSignIn: 'Sign In',
    navSignOut: 'Sign Out',
    heroBadge: 'Official Kigali Smart City Initiative',
    heroTitleLine1: 'Kigali',
    heroTitleAccent: 'CivicGuard',
    heroTitleLine2: 'Portal.',
    heroText:
      'Enhancing community safety through smart reporting. Connect directly with district authorities to report safety concerns, utility disruptions, or emergencies in real time.',
    heroPrimary: 'Report Incident',
    heroSecondary: 'Authority Access',
    trustTitle: 'Built for transparency',
    trustText: 'A reliable digital bridge between citizens, districts, and response teams.',
    featureReports: 'Verified Reports',
    featureReportsText: 'Structured incident reporting improves trust, clarity, and response speed.',
    featureGeo: 'Location Awareness',
    featureGeoText: 'Geospatial data helps teams identify the exact site and coordinate the right action.',
    featureUpdates: 'Live Updates',
    featureUpdatesText: 'Citizens receive status visibility as incidents move from report to resolution.',
    visionTitle: 'Kigali 2026: The Smart City Vision.',
    visionOne: 'Integrated Monitoring',
    visionOneText: 'Community reporting and district operations connected in one digital channel.',
    visionTwo: 'Community Resilience',
    visionTwoText: 'Local safety monitoring that strengthens accountability and faster interventions.',
    visionThree: 'Data Governance',
    visionThreeText: 'Operational visibility for planning, prioritization, and continuous service improvement.',
    impactLabel: 'Strategic Impact',
    impactQuote:
      'CivicGuard is not just a reporting tool; it is the digital pulse of Kigali for safer, faster, and more accountable response.',
    footerText: 'Community safety monitoring aligned with the Kigali Smart City Initiative.',
    footerPlatform: 'Platform',
    footerConnect: 'Connect',
    footerTwitter: 'Twitter',
    footerFacebook: 'Facebook',
    footerInstagram: 'Instagram',
    footerLinkedin: 'LinkedIn',
    authTagline: 'Enhancing Community Safety Through Smart Reporting',
    authTitleSignIn: 'Welcome Back',
    authTitleSignUp: 'Create Your Account',
    authTitleForgot: 'Reset Password',
    authSubtitle: 'Login to access incident reporting and response tools.',
    authSubtitleAdmin: 'Authorized admin accounts can access the city response dashboard.',
    authEmail: 'Email',
    authPassword: 'Password',
    authConfirmPassword: 'Confirm Password',
    authFullName: 'Full Name',
    authForgot: 'Forgot Password',
    authShow: 'Show',
    authHide: 'Hide',
    authLogin: 'Login',
    authRegister: 'Register',
    authCreate: 'Create Account',
    authNoAccount: 'No account yet?',
    authHaveAccount: 'Already have an account?',
    authReset: 'Send Reset Link',
  },
  fr: {
    navHome: 'Accueil',
    navReport: 'Signaler',
    navAbout: 'A Propos',
    navContact: 'Contact',
    navDashboard: 'Tableau',
    navLanguage: 'Langue',
    navMode: 'Mode',
    navSignIn: 'Connexion',
    navSignOut: 'Deconnexion',
    heroBadge: 'Initiative officielle Kigali Smart City',
    heroTitleLine1: 'Kigali',
    heroTitleAccent: 'CivicGuard',
    heroTitleLine2: 'Portail.',
    heroText:
      'Renforcer la securite communautaire grace au signalement intelligent. Connectez-vous directement aux autorites de district pour signaler les incidents en temps reel.',
    heroPrimary: 'Signaler un incident',
    heroSecondary: 'Acces autorite',
    trustTitle: 'Concu pour la transparence',
    trustText: 'Un pont numerique fiable entre citoyens, districts et equipes de reponse.',
    featureReports: 'Signalements verifies',
    featureReportsText: 'Un signalement structure ameliore la confiance, la clarte et la rapidite.',
    featureGeo: 'Conscience geographique',
    featureGeoText: 'Les donnees geographiques aident les equipes a localiser le bon site.',
    featureUpdates: 'Mises a jour en direct',
    featureUpdatesText: 'Les citoyens suivent chaque incident jusqu a sa resolution.',
    visionTitle: 'Kigali 2026 : la vision Smart City.',
    visionOne: 'Surveillance integree',
    visionOneText: 'Le signalement communautaire et les operations de district dans un seul canal.',
    visionTwo: 'Resilience communautaire',
    visionTwoText: 'Un suivi local pour des interventions plus rapides et responsables.',
    visionThree: 'Gouvernance des donnees',
    visionThreeText: 'Une meilleure visibilite pour planifier et prioriser les services.',
    impactLabel: 'Impact strategique',
    impactQuote:
      'CivicGuard n est pas seulement un outil de signalement ; c est le pouls numerique de Kigali pour une reponse plus sure et plus responsable.',
    footerText: 'Suivi de la securite communautaire aligne sur l initiative Kigali Smart City.',
    footerPlatform: 'Plateforme',
    footerConnect: 'Reseaux',
    footerTwitter: 'Twitter',
    footerFacebook: 'Facebook',
    footerInstagram: 'Instagram',
    footerLinkedin: 'LinkedIn',
    authTagline: 'Renforcer la securite communautaire grace au signalement intelligent',
    authTitleSignIn: 'Bon retour',
    authTitleSignUp: 'Creer votre compte',
    authTitleForgot: 'Reinitialiser le mot de passe',
    authSubtitle: 'Connectez-vous pour acceder au signalement et aux outils de reponse.',
    authSubtitleAdmin: 'Les comptes admin autorises peuvent acceder au tableau de reponse.',
    authEmail: 'Email',
    authPassword: 'Mot de passe',
    authConfirmPassword: 'Confirmer le mot de passe',
    authFullName: 'Nom complet',
    authForgot: 'Mot de passe oublie',
    authShow: 'Voir',
    authHide: 'Masquer',
    authLogin: 'Connexion',
    authRegister: 'Inscription',
    authCreate: 'Creer un compte',
    authNoAccount: 'Pas encore de compte ?',
    authHaveAccount: 'Vous avez deja un compte ?',
    authReset: 'Envoyer le lien',
  },
  rw: {
    navHome: 'Ahabanza',
    navReport: 'Tanga Raporo',
    navAbout: 'Ibyerekeye',
    navContact: 'Twandikire',
    navDashboard: 'Dashboard',
    navLanguage: 'Ururimi',
    navMode: 'Mode',
    navSignIn: 'Injira',
    navSignOut: 'Sohoka',
    heroBadge: 'Official Kigali Smart City Initiative',
    heroTitleLine1: 'Kigali',
    heroTitleAccent: 'CivicGuard',
    heroTitleLine2: 'Portal.',
    heroText:
      'Kongerera umutekano w abaturage imbaraga binyuze mu gutanga raporo zubatswe neza. Vugana n ubuyobozi bw akarere mu gihe nyacyo.',
    heroPrimary: 'Tanga ikibazo',
    heroSecondary: 'Aho admin binjira',
    trustTitle: 'Yubakiwe gukorera mu mucyo',
    trustText: 'Ihuza ryizewe hagati y abaturage, uturere n abashinzwe gutabara.',
    featureReports: 'Raporo zizewe',
    featureReportsText: 'Raporo iteguye neza yongera icyizere, ibisobanuro n umuvuduko.',
    featureGeo: 'Kumenya aho ikibazo kiri',
    featureGeoText: 'Amakuru y aho ikibazo kiri afasha itsinda kugera aho gikenewe.',
    featureUpdates: 'Amakuru ahoraho',
    featureUpdatesText: 'Abaturage bakurikirana buri kibazo kugeza gikemutse.',
    visionTitle: 'Kigali 2026: Icyerekezo cya Smart City.',
    visionOne: 'Gukurikirana bihuriweho',
    visionOneText: 'Raporo z abaturage n ibikorwa by akarere bihuriye mu muyoboro umwe.',
    visionTwo: 'Kwihagararaho kw abaturage',
    visionTwoText: 'Gukurikirana umutekano ku rwego rw aho batuye kugira ngo ibikorwa byihute.',
    visionThree: 'Imiyoborere y amakuru',
    visionThreeText: 'Kugaragara kw amakuru bifasha igenamigambi n iyemezwa ry ibyihutirwa.',
    impactLabel: 'Ingaruka z ingenzi',
    impactQuote:
      'CivicGuard si igikoresho cyo gutanga raporo gusa; ni umutima wa digitale wa Kigali mu gutanga ibisubizo byizewe kandi byihuse.',
    footerText: 'Gukurikirana umutekano w abaturage bijyanye na Kigali Smart City Initiative.',
    footerPlatform: 'Urubuga',
    footerConnect: 'Imbuga',
    footerTwitter: 'Twitter',
    footerFacebook: 'Facebook',
    footerInstagram: 'Instagram',
    footerLinkedin: 'LinkedIn',
    authTagline: 'Kongerera umutekano w abaturage imbaraga binyuze mu gutanga raporo zubatswe neza',
    authTitleSignIn: 'Murakaza neza',
    authTitleSignUp: 'Fungura konti yawe',
    authTitleForgot: 'Subizaho ijambobanga',
    authSubtitle: 'Injira ukoreshe ibikoresho byo gutanga raporo no gukurikirana ibisubizo.',
    authSubtitleAdmin: 'Admin bemerewe ni bo bagera kuri dashboard y ibisubizo by umujyi.',
    authEmail: 'Imeyili',
    authPassword: 'Ijambobanga',
    authConfirmPassword: 'Emeza ijambobanga',
    authFullName: 'Amazina yose',
    authForgot: 'Wibagiwe ijambobanga',
    authShow: 'Reba',
    authHide: 'Hisha',
    authLogin: 'Injira',
    authRegister: 'Iyandikishe',
    authCreate: 'Fungura konti',
    authNoAccount: 'Nta konti ufite?',
    authHaveAccount: 'Usanzwe ufite konti?',
    authReset: 'Ohereza link',
  },
};

interface PreferencesContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: string) => string;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('civicguard_lang') as Language) || 'en');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('civicguard_theme') as Theme) || 'light');

  useEffect(() => {
    localStorage.setItem('civicguard_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('civicguard_theme', theme);
    document.body.dataset.theme = theme;
  }, [theme]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      theme,
      toggleTheme: () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
      t: (key: string) => dictionary[language][key] || dictionary.en[key] || key,
    }),
    [language, theme]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within PreferencesProvider');
  return context;
}
