import React, { createContext, useContext, useState } from 'react';

const translations = {
  EN: {
    // Nav
    home: "HOME",
    findRoute: "FIND ROUTE",
    complaint: "COMPLAINT",
    heatmap: "HEATMAP",
    howItWorks: "HOW IT WORKS",
    aboutUs: "ABOUT US",
    loginSignup: "Login / Signup",
    profile: "Account Profile",
    logout: "Sign Out",
    
    // Hero
    heroTitle: "Welcome To Lumina",
    heroSubtitle: "Plan Wisely , Your Safety Matters!",
    heroCtaPrimary: "Calculate Safe Route",
    heroCtaSecondary: "Report Incident",

    // Home Sections
    pillar1Title: "AI Route Risk Scoring",
    pillar1Desc: "Multi-layered dynamic route evaluation that analyzes street illumination, historic incident density, and active police patrol zones in real time.",
    pillar2Title: "Community Verified Reporting",
    pillar2Desc: "Grassroots safety alerts powered by community reports, protected by our dual rate-limiting and anti-spam verification pipeline.",
    pillar3Title: "Live City Risk Heatmaps",
    pillar3Desc: "High-resolution color-coded spatial intelligence highlighting safe corridors, 24/7 safe havens, and caution zones.",
    
    reviewsHeading: "Voices of Lumina Community",
    reviewsSub: "Empowering thousands of women with verified urban safety insights every day.",
    
    // Find Route
    routeTitle: "Intelligent Route Safety Finder",
    routeSub: "Compare direct navigation with AI-recommended safe corridors.",
    originPlaceholder: "Enter starting location (e.g. Connaught Place)",
    destPlaceholder: "Enter destination (e.g. Hauz Khas Village)",
    calcBtn: "Analyze Route Safety",
    directRouteLabel: "Direct Standard Route",
    safeRouteLabel: "Lumina Recommended Safe Corridor",
    safetyScoreLabel: "Safety Score",
    pastIncidentsAlongPath: "Past Reported Incidents Along Route",

    // Complaint
    complaintTitle: "Community Hazard & Incident Report",
    complaintSub: "Click on the map to pinpoint exact location, detail the hazard, and guide fellow travelers.",
    locationLabel: "Location Name / Address",
    categoryLabel: "Incident Category",
    severityLabel: "Severity Level",
    descLabel: "Detailed Incident Description",
    adviceLabel: "Safety Advice for Others",
    submitReportBtn: "Submit Verified Report",
    recentFeedTitle: "Live Community Safety Feed",

    // Heatmap
    heatmapTitle: "Real-Time Urban Risk Heatmap",
    heatmapSub: "Interactive spatial intelligence visualizing risk density, police stations, and 24/7 safe havens.",

    // How it works
    howTitle: "How Lumina Works",
    howSub: "Transparent overview of our AI tagging pipeline, safety scoring algorithm, and anti-spam protection.",

    // About Us
    aboutTitle: "About Lumina",
    aboutSub: "Dedicated to designing safer urban ecosystems through technology, community data, and editorial design elegance."
  },
  HI: {
    // Nav
    home: "मुख्य पृष्ठ",
    findRoute: "सुरक्षित मार्ग खोजें",
    complaint: "शिकायत दर्ज करें",
    heatmap: "हीटमैप",
    howItWorks: "यह कैसे काम करता है",
    aboutUs: "हमारे बारे में",
    loginSignup: "लॉगिन / साइनअप",
    profile: "खाता प्रोफ़ाइल",
    logout: "साइन आउट",
    
    // Hero
    heroTitle: "लुमिना में आपका स्वागत है",
    heroSubtitle: "समझदारी से योजना बनाएं, आपकी सुरक्षा मायने रखती है!",
    heroCtaPrimary: "सुरक्षित मार्ग मापें",
    heroCtaSecondary: "घटना की रिपोर्ट करें",

    // Home Sections
    pillar1Title: "एआई मार्ग जोखिम स्कोरिंग",
    pillar1Desc: "सड़क प्रकाश व्यवस्था, ऐतिहासिक घटना घनत्व और सक्रिय पुलिस गश्त क्षेत्रों का विश्लेषण करने वाला बहुस्तरीय गतिशील मार्ग मूल्यांकन।",
    pillar2Title: "समुदाय सत्यापित रिपोर्टिंग",
    pillar2Desc: "सामुदायिक रिपोर्टों द्वारा संचालित सुरक्षा चेतावनी, हमारे एंटी-स्पैम सत्यापन पाइपलाइन द्वारा सुरक्षित।",
    pillar3Title: "लाइव सिटी रिस्क हीटमैप्स",
    pillar3Desc: "सुरक्षित गलियारों, 24/7 सुरक्षित स्थानों और सावधानी क्षेत्रों को उजागर करने वाली उच्च-रिज़ॉल्यूशन स्थानिक बुद्धिमत्ता।",
    
    reviewsHeading: "लुमिना समुदाय की आवाजें",
    reviewsSub: "हर दिन सत्यापित शहरी सुरक्षा अंतर्दृष्टि के साथ हजारों महिलाओं को सशक्त बनाना।",
    
    // Find Route
    routeTitle: "इंटेलिजेंट रूट सेफ्टी फाइंडर",
    routeSub: "एआई-अनुशंसित सुरक्षित गलियारों के साथ सीधे नेविगेशन की तुलना करें।",
    originPlaceholder: "प्रारंभिक स्थान दर्ज करें (उदा. कनाट प्लेस)",
    destPlaceholder: "गंतव्य दर्ज करें (उदा. हौज खास विलेज)",
    calcBtn: "मार्ग सुरक्षा विश्लेषण करें",
    directRouteLabel: "प्रत्यक्ष मानक मार्ग",
    safeRouteLabel: "लुमिना अनुशंसित सुरक्षित गलियारा",
    safetyScoreLabel: "सुरक्षा स्कोर",
    pastIncidentsAlongPath: "मार्ग में पिछली रिपोर्ट की गई घटनाएं",

    // Complaint
    complaintTitle: "सामुदायिक खतरा और घटना रिपोर्ट",
    complaintSub: "सटीक स्थान इंगित करने, खतरे का विवरण देने और साथी यात्रियों का मार्गदर्शन करने के लिए मानचित्र पर क्लिक करें।",
    locationLabel: "स्थान का नाम / पता",
    categoryLabel: "घटना श्रेणी",
    severityLabel: "गंभीरता स्तर",
    descLabel: "विस्तृत घटना विवरण",
    adviceLabel: "दूसरों के लिए सुरक्षा सलाह",
    submitReportBtn: "सत्यापित रिपोर्ट जमा करें",
    recentFeedTitle: "लाइव सामुदायिक सुरक्षा फीड",

    // Heatmap
    heatmapTitle: "रियल-टाइम अर्बन रिस्क हीटमैप",
    heatmapSub: "जोखिम घनत्व, पुलिस स्टेशनों और 24/7 सुरक्षित स्थानों की कल्पना करने वाला इंटरैक्टिव मानचित्र।",

    // How it works
    howTitle: "लुमिना कैसे काम करता है",
    howSub: "हमारी एआई टैगिंग पाइपलाइन, सुरक्षा स्कोरिंग एल्गोरिदम और एंटी-स्पैम सुरक्षा का पारदर्शी अवलोकन।",

    // About Us
    aboutTitle: "लुमिना के बारे में",
    aboutSub: "प्रौद्योगिकी, सामुदायिक डेटा और संपादकीय डिजाइन लालित्य के माध्यम से सुरक्षित शहरी पारिस्थितिकी तंत्र डिजाइन करने के लिए समर्पित।"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('EN');

  const toggleLanguage = () => {
    setLang(prev => (prev === 'EN' ? 'HI' : 'EN'));
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
