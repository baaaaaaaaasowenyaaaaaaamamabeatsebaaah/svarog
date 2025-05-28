# Cookie Consent Component

A fully GDPR-compliant cookie consent component for German websites built on top of the Svarog Modal component. This component meets all legal requirements of the General Data Protection Regulation (GDPR) and provides user-friendly cookie settings management.

## 🎯 Features

- ✅ **GDPR Compliant**: Meets all German data protection requirements
- 🏗️ **Modal-Based**: Built on the reliable Svarog Modal component
- 🎨 **Flexible Design**: Banner or modal, various positions
- 🍪 **Granular Control**: Detailed cookie categories
- ♿ **Accessible**: Full keyboard navigation and screen reader support (inherited from Modal)
- 📱 **Responsive**: Optimized for all screen sizes
- 🔒 **Secure**: Safe storage of consent
- 🎭 **Themeable**: Automatic theme integration
- 🚀 **Performant**: Minimal impact on website performance
- 🔧 **Focus Management**: Automatic focus handling via Modal

## 📋 GDPR Compliance

This component fulfills the following GDPR requirements:

- **Explicit Consent**: No pre-checking of optional categories
- **Granular Control**: Separate consent for different cookie types
- **Opt-out Available**: "Necessary only" option available
- **Information Obligation**: Clear descriptions for each cookie category
- **Revocation Possibility**: Easy revocation of consent
- **Versioning**: Tracking of consent versions
- **Timestamps**: Documentation of when consent was given
- **Legal Links**: Integration of privacy policy and imprint

## 🚀 Installation

```javascript
import { CookieConsent } from 'svarog-ui';
```

## 📖 Basic Usage

### Automatic Banner (First Visit)

```javascript
// Automatic display on first visit
const cookieConsent = CookieConsent({
  privacyPolicyUrl: '/privacy-policy',
  imprintUrl: '/imprint',
  onAccept: (preferences) => {
    console.log('Cookie settings:', preferences);
    // Activate tracking scripts based on consent
    if (preferences.analytics) {
      // Enable Google Analytics
    }
    if (preferences.marketing) {
      // Enable Facebook Pixel
    }
  },
});
```

### Manual Button for Settings

```javascript
// Button to show cookie settings
const showSettingsButton = Button({
  text: 'Cookie Settings',
  onClick: () => {
    const cookieConsent = CookieConsent({
      autoShow: false,
      mode: 'detailed',
    });
    cookieConsent.show();
  },
});
```

## 🔧 API Reference

### Props

| Prop               | Type    | Default                  | Description                               |
| ------------------ | ------- | ------------------------ | ----------------------------------------- |
| `autoShow`         | boolean | `true`                   | Automatic display when consent is missing |
| `mode`             | string  | `'simple'`               | Display mode: `'simple'` or `'detailed'`  |
| `position`         | string  | `'bottom'`               | Banner position: `'top'`, `'bottom'`      |
| `modal`            | boolean | `false`                  | Display as modal with backdrop            |
| `title`            | string  | `'Cookie-Einstellungen'` | Modal/Banner title                        |
| `description`      | string  | Default text             | HTML description of cookie usage          |
| `showCloseButton`  | boolean | `false`                  | Show X button to close (modal only)       |
| `closeOnBackdrop`  | boolean | `false`                  | Close when clicking backdrop (modal only) |
| `closeOnEscape`    | boolean | `true`                   | Close with ESC key                        |
| `privacyPolicyUrl` | string  | -                        | Link to privacy policy                    |
| `imprintUrl`       | string  | -                        | Link to imprint                           |
| `customCategories` | object  | Default categories       | Custom cookie categories                  |
| `className`        | string  | -                        | Additional CSS classes                    |

### Event Callbacks

| Callback           | Parameters            | Description                      |
| ------------------ | --------------------- | -------------------------------- |
| `onAccept`         | `preferences`         | Called when consent is given     |
| `onDismiss`        | -                     | Called when banner is closed     |
| `onShowDetails`    | -                     | Called when switching to details |
| `onCategoryChange` | `categoryId, enabled` | Called on category change        |

### Methods

| Method                  | Description                   |
| ----------------------- | ----------------------------- |
| `show()`                | Show banner/modal             |
| `hide()`                | Hide banner/modal             |
| `showDetails()`         | Switch to detailed view       |
| `showSimple()`          | Switch to simple view         |
| `getPreferences()`      | Get current cookie settings   |
| `hasConsent(category?)` | Check if consent exists       |
| `revokeConsent()`       | Revoke consent                |
| `destroy()`             | Destroy component and cleanup |

### Static Methods

```javascript
// Global consent management
CookieConsent.getConsent(); // Get current consent
CookieConsent.hasConsent(); // Check general consent
CookieConsent.hasConsent('analytics'); // Check specific category
CookieConsent.revokeConsent(); // Revoke consent
```

## 🍪 Cookie Categories

### Default Categories

```javascript
const categories = {
  necessary: {
    id: 'necessary',
    name: 'Notwendige Cookies',
    description:
      'Diese Cookies sind für die Grundfunktionen der Website erforderlich.',
    required: true, // Cannot be disabled
    enabled: true,
  },
  functional: {
    id: 'functional',
    name: 'Funktionale Cookies',
    description: 'Diese Cookies ermöglichen verbesserte Funktionalitäten.',
    required: false,
    enabled: false, // GDPR: Explicit consent required
  },
  analytics: {
    id: 'analytics',
    name: 'Analytische Cookies',
    description: 'Diese Cookies helfen uns, die Website zu verbessern.',
    required: false,
    enabled: false, // GDPR: Explicit consent required
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing Cookies',
    description: 'Diese Cookies werden für Werbezwecke verwendet.',
    required: false,
    enabled: false, // GDPR: Explicit consent required
  },
};
```

### Custom Categories

```javascript
const customCategories = {
  necessary: {
    id: 'necessary',
    name: 'Technically Required Cookies',
    description: 'Session management, security, shopping cart functions.',
    required: true,
    enabled: true,
  },
  performance: {
    id: 'performance',
    name: 'Performance Cookies',
    description: 'Website performance monitoring and optimization.',
    required: false,
    enabled: false,
  },
  social: {
    id: 'social',
    name: 'Social Media Cookies',
    description: 'Integration of social networks and sharing functions.',
    required: false,
    enabled: false,
  },
};

const cookieConsent = CookieConsent({
  customCategories,
  mode: 'detailed',
});
```

## 🎨 Display Modes

### Banner Mode (Default)

```javascript
// Bottom banner (default)
const bannerConsent = CookieConsent({
  position: 'bottom', // or 'top'
  modal: false,
});

// Top banner
const topBannerConsent = CookieConsent({
  position: 'top',
  modal: false,
});
```

### Modal Mode

```javascript
// Full modal with backdrop
const modalConsent = CookieConsent({
  modal: true,
  showCloseButton: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
});
```

## 💡 Usage Examples

### E-Commerce Shop

```javascript
const ecommerceConsent = CookieConsent({
  title: 'Cookie Policy',
  description: `
    <p><strong>For the best shopping experience</strong> we use cookies.</p>
    <p>Necessary cookies enable cart and checkout. 
    Others help us show you relevant products and offers.</p>
  `,
  customCategories: {
    necessary: {
      id: 'necessary',
      name: 'Shop Functions',
      description: 'Shopping cart, checkout, user account, payment processing.',
      required: true,
      enabled: true,
    },
    analytics: {
      id: 'analytics',
      name: 'Shop Optimization',
      description:
        'Google Analytics for conversion tracking and shop improvement.',
      required: false,
      enabled: false,
    },
    marketing: {
      id: 'marketing',
      name: 'Personalized Advertising',
      description:
        'Facebook Pixel, Google Ads for relevant product advertising.',
      required: false,
      enabled: false,
    },
    recommendations: {
      id: 'recommendations',
      name: 'Product Recommendations',
      description: 'Personalized product suggestions based on your behavior.',
      required: false,
      enabled: false,
    },
  },
  privacyPolicyUrl: '/privacy-policy',
  imprintUrl: '/imprint',
  onAccept: (preferences) => {
    if (preferences.analytics) {
      // Google Analytics for E-Commerce
      gtag('config', 'GA_MEASUREMENT_ID', {
        enhanced_ecommerce: true,
      });
    }

    if (preferences.marketing) {
      // Facebook Pixel
      fbq('init', 'FB_PIXEL_ID');
      fbq('track', 'PageView');
    }

    if (preferences.recommendations) {
      // Enable recommendation engine
      window.recommendationEngine = true;
    }
  },
});
```

### Blog/Content Website

```javascript
const blogConsent = CookieConsent({
  position: 'top',
  title: 'Privacy Notice',
  description: `
    <p>We use cookies to deliver the best content to you.</p>
    <p>Analytics help us understand which articles interest you. 
    Social media cookies enable sharing of articles.</p>
  `,
  customCategories: {
    necessary: {
      id: 'necessary',
      name: 'Website Functions',
      description: 'Basic website functions, comments, newsletter.',
      required: true,
      enabled: true,
    },
    analytics: {
      id: 'analytics',
      name: 'Content Analytics',
      description:
        'Understanding which content is interesting (Matomo, Google Analytics).',
      required: false,
      enabled: false,
    },
    social: {
      id: 'social',
      name: 'Social Media',
      description: 'Sharing articles on Facebook, Twitter, LinkedIn.',
      required: false,
      enabled: false,
    },
    comments: {
      id: 'comments',
      name: 'Comment System',
      description: 'Disqus or similar comment systems for article discussions.',
      required: false,
      enabled: false,
    },
  },
  privacyPolicyUrl: '/privacy-policy',
  onAccept: (preferences) => {
    if (preferences.analytics) {
      // Matomo Analytics
      _paq.push(['trackPageView']);
    }

    if (preferences.social) {
      // Load social media widgets
      loadSocialWidgets();
    }

    if (preferences.comments) {
      // Load Disqus
      loadDisqusComments();
    }
  },
});
```

## 🔧 Tracking Integration

### Google Analytics 4

```javascript
const setupGA4 = (preferences) => {
  if (preferences.analytics) {
    // GA4 Configuration
    gtag('config', 'G-XXXXXXXXXX', {
      anonymize_ip: true,
      allow_google_signals: preferences.marketing,
      allow_ad_personalization_signals: preferences.marketing,
    });

    // E-Commerce tracking if allowed
    if (preferences.marketing) {
      gtag('config', 'G-XXXXXXXXXX', {
        custom_map: { custom_parameter: 'dimension1' },
      });
    }
  }
};
```

### Facebook Pixel

```javascript
const setupFacebookPixel = (preferences) => {
  if (preferences.marketing) {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    // ... Facebook Pixel Code

    fbq('init', 'YOUR_PIXEL_ID');
    fbq('track', 'PageView');

    // Advanced matching with consent
    fbq('init', 'YOUR_PIXEL_ID', {
      em: 'user@email.com' // Only with explicit consent
    });
  }
};
```

## 🎨 Styling and Themes

The component inherits Modal styling and adds cookie-specific classes:

### CSS Classes

```css
/* Extends Modal classes with cookie-specific styles */
.cookie-consent--banner          /* Banner mode modifier */
.cookie-consent--modal           /* Modal mode modifier */
.cookie-consent--top             /* Top position banner */
.cookie-consent--bottom          /* Bottom position banner */

.cookie-consent__content         /* Content container */
.cookie-consent__description     /* Description text */

.cookie-consent__categories      /* Categories container */
.cookie-consent__category        /* Individual category */
.cookie-consent__category--required /* Required category */
.cookie-consent__category-header /* Category header */
.cookie-consent__category-label  /* Category label */
.cookie-consent__category-checkbox /* Category checkbox */
.cookie-consent__category-name   /* Category name */
.cookie-consent__required-badge  /* "Required" badge */
.cookie-consent__category-description /* Category description */

.cookie-consent__legal           /* Legal links container */
.cookie-consent__legal-link      /* Individual legal link */
```

## 🧪 Testing

```javascript
import { describe, it, expect } from 'vitest';
import CookieConsent from './CookieConsent.js';

describe('CookieConsent GDPR Compliance', () => {
  it('should require explicit consent for non-necessary cookies', () => {
    const consent = CookieConsent({ autoShow: false, mode: 'detailed' });
    consent.show();

    // All optional categories should be disabled by default
    const optionalCheckboxes = document.querySelectorAll(
      '.cookie-consent__category-checkbox:not(:disabled)'
    );

    optionalCheckboxes.forEach((checkbox) => {
      expect(checkbox.checked).toBe(false);
    });
  });

  it('should store consent with proper versioning', async () => {
    const consent = CookieConsent({ autoShow: false });
    consent.show();

    const acceptButton = document.querySelector('[data-action="accept-all"]');
    acceptButton.click();

    const storedConsent = CookieConsent.getConsent();
    expect(storedConsent.version).toBe('1.0');
    expect(storedConsent.timestamp).toBeTruthy();
    expect(storedConsent.expires).toBeTruthy();
  });
});
```

## 🚀 Performance

### Lazy Loading

```javascript
// Load Cookie Consent only when needed
const loadCookieConsent = async () => {
  if (!CookieConsent.hasConsent()) {
    const { CookieConsent } = await import('./CookieConsent.js');
    return CookieConsent();
  }
};

// Check on page load
document.addEventListener('DOMContentLoaded', loadCookieConsent);
```

## 📱 Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)
- Internet Explorer 11 (with polyfills)

## 🏗️ Architecture

The CookieConsent component is built on top of the Svarog Modal component, providing:

- **Reliability**: Uses the battle-tested Modal component as foundation
- **Consistency**: Inherits Modal's accessibility and keyboard navigation
- **Maintainability**: Reduces code duplication and complexity
- **Focus Management**: Automatic focus handling via Modal's implementation
- **Animation System**: Smooth transitions handled by Modal

## 🔗 Related Components

- [Modal](../Modal/README.md) - Base component for cookie consent modal
- [Button](../Button/README.md) - For action buttons
- [Form](../Form/README.md) - For extended settings

## 📚 Legal Notes

This component provides a technical solution for GDPR compliance but does not replace legal advice. Please consult a lawyer for specific legal requirements of your company.

**Important GDPR Points:**

- Consent must be freely given, specific, informed and unambiguous
- Withdrawal must be as easy as giving consent
- Documentation of consent is required
- Regular review and updates necessary

## 🤝 Contributing

Contributions to improve GDPR compliance are welcome:

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Test compliance requirements
5. Create a pull request

For legal requirements, please include appropriate documentation.

## 🆕 Migration from v3

If upgrading from Svarog v3:

- API remains largely compatible
- Now built on Modal component (more reliable)
- Better accessibility and keyboard navigation
- Improved focus management
- Enhanced animations and transitions
- Same GDPR compliance features
