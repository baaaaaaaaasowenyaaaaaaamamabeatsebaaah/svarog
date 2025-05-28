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
    position: 'center',
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
    position: 'center',
    customCategories: {
      necessary: {
        id: 'necessary',
        name: 'Technisch notwendige Cookies',
        description:
          'Diese Cookies sind für den Warenkorb, Anmeldung und Zahlungsabwicklung erforderlich.',
        required: true,
        enabled: true,
      },
      functional: {
        id: 'functional',
        name: 'Komfort-Cookies',
        description:
          'Speichern Ihre Einstellungen wie Sprache, Währung und zuletzt angesehene Produkte.',
        required: false,
        enabled: false,
      },
      analytics: {
        id: 'analytics',
        name: 'Analyse-Cookies',
        description:
          'Google Analytics, Facebook Analytics - helfen uns, unser Angebot zu verbessern.',
        required: false,
        enabled: false,
      },
      marketing: {
        id: 'marketing',
        name: 'Marketing-Cookies',
        description:
          'Facebook Pixel, Google Ads, Remarketing - für personalisierte Werbung.',
        required: false,
        enabled: false,
      },
      social: {
        id: 'social',
        name: 'Social Media Cookies',
        description:
          'Ermöglichen das Teilen von Inhalten auf sozialen Netzwerken.',
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
        console.log('🔍 Setting up Google Analytics...');
      }
      if (preferences.marketing) {
        console.log('📈 Setting up Facebook Pixel...');
      }
      if (preferences.social) {
        console.log('📱 Setting up Social Media tracking...');
      }

      showMessage('E-Commerce Tracking konfiguriert!', 'success');
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
    title: 'Cookie-Richtlinie',
    description: `
      <p><strong>Transparenz bei der Datenverarbeitung</strong></p>
      <p>Als Unternehmen sind wir verpflichtet, Sie über die Verwendung von Cookies auf unserer Website zu informieren. 
      Wir halten uns strikt an die DSGVO und geben Ihnen die volle Kontrolle über Ihre Daten.</p>
      <p>Bitte wählen Sie, welche Cookie-Kategorien Sie akzeptieren möchten:</p>
    `,
    customCategories: {
      necessary: {
        id: 'necessary',
        name: 'Technisch erforderliche Cookies',
        description:
          'Session-Management, Sicherheit, grundlegende Website-Funktionen. Diese können nicht deaktiviert werden.',
        required: true,
        enabled: true,
      },
      performance: {
        id: 'performance',
        name: 'Performance-Cookies',
        description:
          'Messen die Website-Performance und helfen bei der Optimierung der Ladezeiten.',
        required: false,
        enabled: false,
      },
      analytics: {
        id: 'analytics',
        name: 'Analyse-Cookies',
        description:
          'Anonymisierte Nutzungsstatistiken zur Verbesserung unseres Angebots (Google Analytics).',
        required: false,
        enabled: false,
      },
      marketing: {
        id: 'marketing',
        name: 'Marketing-Cookies',
        description:
          'Personalisierte Inhalte und zielgerichtete Werbung basierend auf Ihren Interessen.',
        required: false,
        enabled: false,
      },
    },
    privacyPolicyUrl: '/datenschutz',
    imprintUrl: '/impressum',
    className: 'corporate-theme',
    onAccept: (preferences) => {
      console.log('Corporate preferences:', preferences);
      showMessage('Corporate Cookie-Einstellungen gespeichert!', 'info');
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

  // Create auto-showing consent - store reference for potential cleanup
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
