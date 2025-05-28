// src/components/CookieConsent/CookieConsent.stories.js
import CookieConsent from './CookieConsent.js';
import Button from '../Button/index.js';

export default {
  title: 'Components/CookieConsent',
  component: CookieConsent,
};

// Default banner at bottom
export const Default = () => {
  const triggerButton = Button({
    text: 'Show Cookie Consent',
    variant: 'primary',
  });

  const cookieConsent = CookieConsent({
    autoShow: false,
    onAccept: (preferences) => {
      console.log('Cookie preferences accepted:', preferences);
      showMessage('Cookie-Einstellungen gespeichert!', 'success');
    },
    onDismiss: () => {
      console.log('Cookie consent dismissed');
    },
  });

  triggerButton.getElement().addEventListener('click', () => {
    cookieConsent.show();
  });

  return triggerButton.getElement();
};

// Modal mode
export const ModalMode = () => {
  const triggerButton = Button({
    text: 'Show Modal Cookie Consent',
    variant: 'primary',
  });

  const cookieConsent = CookieConsent({
    modal: true,
    showCloseButton: true,
    closeOnBackdrop: true,
    autoShow: false,
    onAccept: (preferences) => {
      console.log('Modal cookie preferences:', preferences);
      showMessage('Einstellungen im Modal gespeichert!', 'info');
    },
  });

  triggerButton.getElement().addEventListener('click', () => {
    cookieConsent.show();
  });

  return triggerButton.getElement();
};

// Top position banner
export const TopBanner = () => {
  const triggerButton = Button({
    text: 'Show Top Banner',
    variant: 'secondary',
  });

  const cookieConsent = CookieConsent({
    position: 'top',
    autoShow: false,
    title: 'Cookie-Hinweis',
    description:
      '<p>Diese Website verwendet Cookies, um Ihnen die bestmögliche Nutzererfahrung zu bieten.</p>',
    onAccept: (preferences) => {
      console.log('Top banner preferences:', preferences);
    },
  });

  triggerButton.getElement().addEventListener('click', () => {
    cookieConsent.show();
  });

  return triggerButton.getElement();
};

// Detailed view with all categories
export const DetailedView = () => {
  const triggerButton = Button({
    text: 'Show Detailed Settings',
    variant: 'primary',
  });

  const cookieConsent = CookieConsent({
    mode: 'detailed',
    autoShow: false,
    customCategories: {
      necessary: {
        id: 'necessary',
        name: 'Notwendige Cookies',
        description:
          'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.',
        required: true,
        enabled: true,
      },
      functional: {
        id: 'functional',
        name: 'Funktionale Cookies',
        description:
          'Diese Cookies ermöglichen verbesserte Funktionalitäten wie Live-Chat, Karten und Videos.',
        required: false,
        enabled: false,
      },
      analytics: {
        id: 'analytics',
        name: 'Analytische Cookies',
        description:
          'Diese Cookies helfen uns dabei, die Nutzung unserer Website zu verstehen (Google Analytics, Hotjar).',
        required: false,
        enabled: false,
      },
      marketing: {
        id: 'marketing',
        name: 'Marketing Cookies',
        description:
          'Diese Cookies werden für Werbezwecke verwendet (Facebook Pixel, Google Ads).',
        required: false,
        enabled: false,
      },
    },
    onAccept: (preferences) => {
      console.log('Detailed preferences:', preferences);
      showMessage('Detaillierte Einstellungen gespeichert!', 'success');
    },
    onCategoryChange: (categoryId, enabled) => {
      console.log(`Category ${categoryId} changed to:`, enabled);
    },
  });

  triggerButton.getElement().addEventListener('click', () => {
    cookieConsent.show();
  });

  return triggerButton.getElement();
};

// With custom content and legal links
export const WithLegalLinks = () => {
  const triggerButton = Button({
    text: 'Show With Legal Links',
    variant: 'primary',
  });

  const cookieConsent = CookieConsent({
    autoShow: false,
    title: 'Datenschutz & Cookies',
    description: `
      <p><strong>Wir respektieren Ihre Privatsphäre.</strong> Diese Website verwendet Cookies, um Ihnen die bestmögliche Erfahrung zu bieten.</p>
      <p>Notwendige Cookies sind für die Funktion der Website erforderlich. Andere Cookies helfen uns dabei, die Website zu verbessern und relevante Inhalte anzuzeigen.</p>
      <p>Sie können Ihre Einstellungen jederzeit ändern oder nur notwendige Cookies akzeptieren.</p>
    `,
    privacyPolicyUrl: '/datenschutz',
    imprintUrl: '/impressum',
    onAccept: (preferences) => {
      console.log('Legal consent preferences:', preferences);
      showMessage('Einstellungen mit Rechtslinks gespeichert!', 'info');
    },
  });

  triggerButton.getElement().addEventListener('click', () => {
    cookieConsent.show();
  });

  return triggerButton.getElement();
};

// E-commerce specific (with tracking categories)
export const ECommerceSetup = () => {
  const triggerButton = Button({
    text: 'E-Commerce Cookie Setup',
    variant: 'primary',
  });

  const cookieConsent = CookieConsent({
    autoShow: false,
    modal: true,
    title: 'Cookie-Einstellungen für Ihren Einkauf',
    description: `
      <p><strong>Für das beste Einkaufserlebnis</strong> verwenden wir verschiedene Cookies.</p>
      <p>Technisch notwendige Cookies ermöglichen Ihren Warenkorb und den Checkout. Analyse-Cookies helfen uns, beliebte Produkte zu identifizieren und unser Sortiment zu verbessern.</p>
      <p>Marketing-Cookies zeigen Ihnen relevante Produktempfehlungen und Angebote, die Sie interessieren könnten.</p>
    `,
    customCategories: {
      necessary: {
        id: 'necessary',
        name: 'Shop-Funktionen',
        description:
          'Warenkorb, Checkout, Benutzeranmeldung, Zahlungsabwicklung und Bestellverfolgung. Diese Cookies sind für Ihren Einkauf unerlässlich.',
        required: true,
        enabled: true,
      },
      functional: {
        id: 'functional',
        name: 'Komfort-Features',
        description:
          'Speichern Ihre Präferenzen wie Sprache, Währung, Größenangaben und zuletzt angesehene Produkte für ein personalisiertes Einkaufserlebnis.',
        required: false,
        enabled: false,
      },
      analytics: {
        id: 'analytics',
        name: 'Shop-Optimierung',
        description:
          'Google Analytics E-Commerce, Hotjar Heatmaps - helfen uns zu verstehen, welche Produkte beliebt sind und wie wir den Shop verbessern können.',
        required: false,
        enabled: false,
      },
      marketing: {
        id: 'marketing',
        name: 'Personalisierte Werbung',
        description:
          'Facebook Pixel, Google Ads, Criteo - ermöglichen personalisierte Produktempfehlungen und Retargeting-Anzeigen basierend auf Ihren Interessen.',
        required: false,
        enabled: false,
      },
      recommendations: {
        id: 'recommendations',
        name: 'Produktempfehlungen',
        description:
          'KI-basierte Empfehlungen für "Kunden kauften auch" und personalisierte Produktvorschläge basierend auf Ihrem Browsing-Verhalten.',
        required: false,
        enabled: false,
      },
    },
    privacyPolicyUrl: '/datenschutzerklaerung',
    imprintUrl: '/impressum',
    onAccept: (preferences) => {
      console.log('E-commerce preferences:', preferences);

      // Simulate tracking setup based on preferences
      if (preferences.analytics) {
        console.log('🔍 Google Analytics E-Commerce wird aktiviert...');
        console.log('📊 Hotjar Heatmap-Tracking wird aktiviert...');
      }
      if (preferences.marketing) {
        console.log('📈 Facebook Pixel wird aktiviert...');
        console.log('🎯 Google Ads Conversion-Tracking wird aktiviert...');
        console.log('🔄 Criteo Retargeting wird aktiviert...');
      }
      if (preferences.recommendations) {
        console.log('🤖 KI-Produktempfehlungen werden aktiviert...');
      }

      showMessage(
        'E-Commerce Tracking wurde entsprechend Ihren Präferenzen konfiguriert!',
        'success'
      );
    },
  });

  triggerButton.getElement().addEventListener('click', () => {
    cookieConsent.show();
  });

  return triggerButton.getElement();
};

// Agency/Corporate setup
export const CorporateSetup = () => {
  const triggerButton = Button({
    text: 'Corporate Cookie Banner',
    variant: 'secondary',
  });

  const cookieConsent = CookieConsent({
    autoShow: false,
    title: 'Datenschutz-Einstellungen',
    description: `
      <p><strong>Transparenz bei der Datenverarbeitung</strong></p>
      <p>Als verantwortungsvolles Unternehmen informieren wir Sie umfassend über unsere Datenverarbeitung. 
      Wir halten uns strikt an die DSGVO und geben Ihnen die volle Kontrolle über Ihre Daten.</p>
      <p>Sie können jederzeit Ihre Einstellungen ändern oder Ihre Einwilligung widerrufen. 
      Detaillierte Informationen zu den verwendeten Cookies finden Sie in unserer Datenschutzerklärung.</p>
    `,
    customCategories: {
      necessary: {
        id: 'necessary',
        name: 'Technisch erforderliche Cookies',
        description:
          'Session-Management, CSRF-Schutz, Load-Balancing und grundlegende Sicherheitsfunktionen. Diese Cookies sind für den sicheren Betrieb unserer Website unerlässlich.',
        required: true,
        enabled: true,
      },
      performance: {
        id: 'performance',
        name: 'Performance-Cookies',
        description:
          'Messen Website-Geschwindigkeit, Server-Response-Zeiten und Ladezeiten verschiedener Bereiche zur kontinuierlichen Optimierung der Nutzererfahrung.',
        required: false,
        enabled: false,
      },
      analytics: {
        id: 'analytics',
        name: 'Webanalyse-Cookies',
        description:
          'Anonymisierte Erfassung von Seitenaufrufen, Verweildauer und Navigationspfaden mittels Google Analytics zur statistischen Auswertung des Nutzerverhaltens.',
        required: false,
        enabled: false,
      },
      marketing: {
        id: 'marketing',
        name: 'Marketing-Cookies',
        description:
          'LinkedIn Insight Tag, Google Ads Conversion-Tracking und andere B2B-Marketing-Tools zur Erfolgsmessung unserer Unternehmenskommunikation.',
        required: false,
        enabled: false,
      },
    },
    privacyPolicyUrl: '/datenschutz',
    imprintUrl: '/impressum',
    className: 'corporate-theme',
    onAccept: (preferences) => {
      console.log('Corporate preferences:', preferences);

      if (preferences.performance) {
        console.log('⚡ Performance-Monitoring wird aktiviert...');
      }
      if (preferences.analytics) {
        console.log('📊 Google Analytics (anonymisiert) wird aktiviert...');
      }
      if (preferences.marketing) {
        console.log('💼 LinkedIn Insight Tag wird aktiviert...');
        console.log('🎯 B2B Conversion-Tracking wird aktiviert...');
      }

      showMessage(
        'Corporate Datenschutz-Einstellungen wurden gespeichert!',
        'info'
      );
    },
  });

  triggerButton.getElement().addEventListener('click', () => {
    cookieConsent.show();
  });

  return triggerButton.getElement();
};

// Management functions demo
export const ManagementFunctions = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '16px';
  container.style.maxWidth = '400px';

  // Status display
  const statusDisplay = document.createElement('div');
  statusDisplay.style.padding = '12px';
  statusDisplay.style.border = '1px solid #e2e8f0';
  statusDisplay.style.borderRadius = '4px';
  statusDisplay.style.backgroundColor = '#f7fafc';

  const updateStatus = () => {
    const consent = CookieConsent.getConsent();
    if (consent) {
      statusDisplay.innerHTML = `
        <strong>Cookie-Status:</strong><br>
        Zustimmung erteilt: ${new Date(consent.timestamp).toLocaleString('de-DE')}<br>
        Einstellungen: ${Object.entries(consent.preferences)
          .map(([key, value]) => `${key}: ${value ? '✓' : '✗'}`)
          .join(', ')}
      `;
    } else {
      statusDisplay.innerHTML =
        '<strong>Cookie-Status:</strong><br>Keine Zustimmung vorhanden';
    }
  };

  // Initial status
  updateStatus();

  // Show consent button
  const showButton = Button({
    text: 'Cookie-Einstellungen anzeigen',
    variant: 'primary',
  });

  // Check consent button
  const checkButton = Button({
    text: 'Zustimmung prüfen',
    variant: 'secondary',
  });

  // Revoke consent button
  const revokeButton = Button({
    text: 'Zustimmung widerrufen',
    variant: 'danger',
  });

  const cookieConsent = CookieConsent({
    autoShow: false,
    onAccept: (preferences) => {
      console.log('Management demo preferences:', preferences);
      updateStatus();
      showMessage('Einstellungen aktualisiert!', 'success');
    },
  });

  showButton.getElement().addEventListener('click', () => {
    cookieConsent.show();
  });

  checkButton.getElement().addEventListener('click', () => {
    const hasConsent = CookieConsent.hasConsent();
    const analyticsConsent = CookieConsent.hasConsent('analytics');

    showMessage(
      `Allgemeine Zustimmung: ${hasConsent ? 'Ja' : 'Nein'}\nAnalytics: ${analyticsConsent ? 'Ja' : 'Nein'}`,
      hasConsent ? 'success' : 'warning'
    );
    updateStatus();
  });

  revokeButton.getElement().addEventListener('click', () => {
    CookieConsent.revokeConsent();
    updateStatus();
    showMessage('Zustimmung widerrufen! Banner wird erneut angezeigt.', 'info');
    // Cookie banner will auto-show due to revoked consent
  });

  container.appendChild(statusDisplay);
  container.appendChild(showButton.getElement());
  container.appendChild(checkButton.getElement());
  container.appendChild(revokeButton.getElement());

  return container;
};

// Auto-show demo (simulates first visit)
export const AutoShowDemo = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 4px; background: #f7fafc;">
      <h3>Auto-Show Demo</h3>
      <p>Simuliert einen ersten Besuch der Website. Das Cookie-Banner erscheint automatisch nach 1 Sekunde.</p>
      <p><strong>Hinweis:</strong> Wenn Sie bereits eine Zustimmung erteilt haben, verwenden Sie "Zustimmung widerrufen" aus dem Management-Beispiel.</p>
    </div>
  `;

  // Create auto-showing consent
  CookieConsent({
    autoShow: true,
    onAccept: (preferences) => {
      console.log('Auto-show preferences:', preferences);
      showMessage('Auto-Banner: Einstellungen gespeichert!', 'success');
    },
  });

  return container;
};

// All positions demo
export const AllPositions = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '12px';

  const positions = [
    { name: 'Bottom Banner', position: 'bottom', modal: false },
    { name: 'Top Banner', position: 'top', modal: false },
    { name: 'Center Modal', position: 'center', modal: true },
  ];

  positions.forEach(({ name, position, modal }) => {
    const button = Button({
      text: name,
      variant: 'secondary',
    });

    const cookieConsent = CookieConsent({
      position,
      modal,
      autoShow: false,
      showCloseButton: modal,
      title: `${name} Demo`,
      onAccept: (preferences) => {
        console.log(`${name} preferences:`, preferences);
        showMessage(`${name}: Einstellungen gespeichert!`, 'success');
      },
    });

    button.getElement().addEventListener('click', () => {
      cookieConsent.show();
    });

    container.appendChild(button.getElement());
  });

  return container;
};

// News/Blog website setup
export const NewsWebsiteSetup = () => {
  const triggerButton = Button({
    text: 'News Website Cookies',
    variant: 'primary',
  });

  const cookieConsent = CookieConsent({
    autoShow: false,
    position: 'top',
    title: 'Cookie-Hinweis',
    description: `
      <p><strong>Qualitätsjournalismus braucht Ihre Unterstützung.</strong></p>
      <p>Wir verwenden Cookies, um Ihnen die besten Inhalte zu liefern und unsere Berichterstattung zu verbessern.</p>
      <p>Analyse-Cookies helfen uns zu verstehen, welche Artikel Sie interessieren. 
      Social-Media-Cookies ermöglichen das Teilen wichtiger Nachrichten.</p>
    `,
    customCategories: {
      necessary: {
        id: 'necessary',
        name: 'Website-Grundfunktionen',
        description:
          'Artikel-Zugriff, Newsletter-Anmeldung, Kommentar-System und Anti-Spam-Schutz. Unverzichtbar für die Nutzung unseres Nachrichtenportals.',
        required: true,
        enabled: true,
      },
      personalization: {
        id: 'personalization',
        name: 'Inhalts-Personalisierung',
        description:
          'Speichern Ihre Lesevorlieben, bevorzugte Themenbereiche und Artikel-Empfehlungen für eine personalisierte Nachrichten-Experience.',
        required: false,
        enabled: false,
      },
      analytics: {
        id: 'analytics',
        name: 'Leseranalyse',
        description:
          'Google Analytics, Chartbeat - verstehen welche Artikel gelesen werden, Verweildauer und Leser-Engagement zur Verbesserung unseres Journalismus.',
        required: false,
        enabled: false,
      },
      social: {
        id: 'social',
        name: 'Social Media',
        description:
          'Facebook, Twitter, WhatsApp Share-Buttons und Social Login. Ermöglichen das einfache Teilen wichtiger Nachrichten mit Ihrem Netzwerk.',
        required: false,
        enabled: false,
      },
      advertising: {
        id: 'advertising',
        name: 'Werbung & Refinanzierung',
        description:
          'Google AdSense, Amazon Affiliate Links - helfen uns, kostenlosen Qualitätsjournalismus zu finanzieren durch relevante, nicht-aufdringliche Werbung.',
        required: false,
        enabled: false,
      },
    },
    privacyPolicyUrl: '/datenschutz',
    imprintUrl: '/impressum',
    onAccept: (preferences) => {
      console.log('News website preferences:', preferences);

      if (preferences.personalization) {
        console.log('📰 Artikel-Personalisierung wird aktiviert...');
      }
      if (preferences.analytics) {
        console.log('📊 Leser-Analytics wird aktiviert...');
        console.log('📈 Chartbeat Real-Time Analytics wird aktiviert...');
      }
      if (preferences.social) {
        console.log('📱 Social Media Sharing wird aktiviert...');
      }
      if (preferences.advertising) {
        console.log('💰 Werbe-Monetarisierung wird aktiviert...');
        console.log('🔗 Affiliate-Marketing wird aktiviert...');
      }

      showMessage(
        'Ihre Präferenzen unterstützen unseren Journalismus!',
        'success'
      );
    },
  });

  triggerButton.getElement().addEventListener('click', () => {
    cookieConsent.show();
  });

  return triggerButton.getElement();
};

// Restaurant/Local Business setup
export const RestaurantSetup = () => {
  const triggerButton = Button({
    text: 'Restaurant Website',
    variant: 'secondary',
  });

  const cookieConsent = CookieConsent({
    autoShow: false,
    title: 'Cookie-Hinweis',
    description: `
      <p><strong>Willkommen in unserem Restaurant!</strong></p>
      <p>Wir verwenden Cookies, um Ihnen den besten Service zu bieten - online wie offline.</p>
      <p>Funktionale Cookies ermöglichen Tischreservierungen und Bestellungen. 
      Analytics helfen uns, beliebte Gerichte zu identifizieren.</p>
    `,
    customCategories: {
      necessary: {
        id: 'necessary',
        name: 'Restaurant-Grundfunktionen',
        description:
          'Tischreservierung, Online-Bestellungen, Speisekarte und Kontaktformular. Notwendig für alle Restaurant-Services.',
        required: true,
        enabled: true,
      },
      functional: {
        id: 'functional',
        name: 'Komfort-Features',
        description:
          'Speichern Ihrer Lieblingsgerichte, Allergiehinweise, bevorzugte Tischzeiten und Lieferadresse für ein besseres Gastoerlebnis.',
        required: false,
        enabled: false,
      },
      analytics: {
        id: 'analytics',
        name: 'Gäste-Feedback',
        description:
          'Verstehen, welche Gerichte beliebt sind, Stoßzeiten analysieren und unser Angebot entsprechend anpassen.',
        required: false,
        enabled: false,
      },
      maps: {
        id: 'maps',
        name: 'Standort-Services',
        description:
          'Google Maps Integration für Anfahrt, Lieferbereich-Anzeige und Standort-basierte Services.',
        required: false,
        enabled: false,
      },
    },
    privacyPolicyUrl: '/datenschutz',
    imprintUrl: '/impressum',
    onAccept: (preferences) => {
      console.log('Restaurant preferences:', preferences);

      if (preferences.functional) {
        console.log('🍽️ Gäste-Personalisierung wird aktiviert...');
      }
      if (preferences.analytics) {
        console.log('📊 Speisekarten-Analytics wird aktiviert...');
      }
      if (preferences.maps) {
        console.log('🗺️ Google Maps Integration wird aktiviert...');
      }

      showMessage('Danke! Ihre Einstellungen wurden gespeichert.', 'success');
    },
  });

  triggerButton.getElement().addEventListener('click', () => {
    cookieConsent.show();
  });

  return triggerButton.getElement();
};

// Simple vs Detailed comparison with realistic content
export const SimpleVsDetailed = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = '16px';

  // Simple mode button
  const simpleButton = Button({
    text: 'Simple Mode',
    variant: 'primary',
  });

  const simpleCookieConsent = CookieConsent({
    autoShow: false,
    mode: 'simple',
    title: 'Cookie-Einstellungen',
    description: `
      <p><strong>Ihre Privatsphäre ist uns wichtig.</strong></p>
      <p>Wir verwenden Cookies für eine bessere Nutzererfahrung. Sie können alle akzeptieren oder nur die notwendigen Cookies zulassen.</p>
    `,
    onAccept: (preferences) => {
      console.log('Simple mode preferences:', preferences);
      showMessage('Einfache Einstellungen gespeichert!', 'success');
    },
  });

  simpleButton.getElement().addEventListener('click', () => {
    simpleCookieConsent.show();
  });

  // Detailed mode button
  const detailedButton = Button({
    text: 'Detailed Mode',
    variant: 'secondary',
  });

  const detailedCookieConsent = CookieConsent({
    autoShow: false,
    mode: 'detailed',
    title: 'Detaillierte Cookie-Einstellungen',
    description: `
      <p><strong>Volle Kontrolle über Ihre Daten.</strong></p>
      <p>Hier können Sie genau auswählen, welche Cookie-Kategorien Sie zulassen möchten. Jede Kategorie hat einen spezifischen Zweck.</p>
    `,
    onAccept: (preferences) => {
      console.log('Detailed mode preferences:', preferences);
      showMessage('Detaillierte Einstellungen gespeichert!', 'info');
    },
  });

  detailedButton.getElement().addEventListener('click', () => {
    detailedCookieConsent.show();
  });

  container.appendChild(simpleButton.getElement());
  container.appendChild(detailedButton.getElement());

  return container;
};

// Helper function for showing messages
function showMessage(message, type = 'info') {
  // Create a simple toast notification
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 4px;
    color: white;
    z-index: 10001;
    max-width: 300px;
    word-wrap: break-word;
    white-space: pre-line;
  `;

  switch (type) {
    case 'success':
      toast.style.backgroundColor = '#4caf50';
      break;
    case 'warning':
      toast.style.backgroundColor = '#ff9800';
      break;
    case 'danger':
      toast.style.backgroundColor = '#f44336';
      break;
    default:
      toast.style.backgroundColor = '#00bcd4';
  }

  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}
