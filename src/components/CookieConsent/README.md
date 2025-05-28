# Cookie Consent Component

A fully GDPR-compliant cookie consent component for German websites built on top of the Svarog Modal and Checkbox components. This component meets all legal requirements of the General Data Protection Regulation (GDPR) and provides user-friendly cookie settings management with consistent UI patterns.

## 🎯 Features

- ✅ **GDPR Compliant**: Meets all German data protection requirements
- 🏗️ **Component-Based**: Built on reliable Svarog Modal and Checkbox components
- 🎨 **Flexible Design**: Banner or modal, various positions
- 🍪 **Granular Control**: Detailed cookie categories with standardized checkboxes
- ♿ **Accessible**: Full keyboard navigation and screen reader support (enhanced through component integration)
- 📱 **Responsive**: Optimized for all screen sizes
- 🔒 **Secure**: Safe storage of consent
- 🎭 **Themeable**: Automatic theme integration through component inheritance
- 🚀 **Performant**: Minimal impact on website performance
- 🔧 **Focus Management**: Automatic focus handling via Modal's implementation
- 🧩 **Consistent UI**: Uses standardized Checkbox components for uniform behavior

## 📋 GDPR Compliance

This component fulfills the following GDPR requirements:

- **Explicit Consent**: No pre-checking of optional categories (enforced by Checkbox components)
- **Granular Control**: Separate consent for different cookie types with consistent UI
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

| Callback           | Parameters            | Description                                       |
| ------------------ | --------------------- | ------------------------------------------------- |
| `onAccept`         | `preferences`         | Called when consent is given                      |
| `onDismiss`        | -                     | Called when banner is closed                      |
| `onShowDetails`    | -                     | Called when switching to details                  |
| `onCategoryChange` | `categoryId, enabled` | Called on category change (via Checkbox onChange) |

### Methods

| Method                  | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| `show()`                | Show banner/modal                                     |
| `hide()`                | Hide banner/modal                                     |
| `showDetails()`         | Switch to detailed view                               |
| `showSimple()`          | Switch to simple view                                 |
| `getPreferences()`      | Get current cookie settings                           |
| `hasConsent(category?)` | Check if consent exists                               |
| `revokeConsent()`       | Revoke consent                                        |
| `destroy()`             | Destroy component and cleanup all Checkbox components |

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
    required: true, // Cannot be disabled (Checkbox disabled prop)
    enabled: true, // Using standardized enabled/value prop
  },
  functional: {
    id: 'functional',
    name: 'Funktionale Cookies',
    description: 'Diese Cookies ermöglichen verbesserte Funktionalitäten.',
    required: false,
    enabled: false, // GDPR: Explicit consent required (Checkbox defaults to false)
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
    required: true, // Checkbox will be disabled
    enabled: true, // Checkbox will be checked and disabled
  },
  performance: {
    id: 'performance',
    name: 'Performance Cookies',
    description: 'Website performance monitoring and optimization.',
    required: false, // Checkbox will be enabled
    enabled: false, // Checkbox will start unchecked (GDPR compliance)
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
  onCategoryChange: (categoryId, enabled) => {
    console.log(`${categoryId} changed to:`, enabled);
    // This callback is triggered by Checkbox onChange events
  },
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
      enabled: false, // Checkbox components enforce GDPR compliance
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
  onCategoryChange: (categoryId, enabled) => {
    // Real-time feedback as users interact with checkboxes
    console.log(`User ${enabled ? 'enabled' : 'disabled'} ${categoryId}`);
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

The component inherits Modal and Checkbox styling and adds cookie-specific classes:

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
.cookie-consent__category-label  /* Category label (integrates with Checkbox) */
.cookie-consent__category-name   /* Category name */
.cookie-consent__required-badge  /* "Required" badge */
.cookie-consent__category-description /* Category description */

/* Checkbox integration classes */
.cookie-consent__category-checkbox-component /* Hidden Checkbox component container */

.cookie-consent__legal           /* Legal links container */
.cookie-consent__legal-link      /* Individual legal link */
```

### Checkbox Component Integration

The component seamlessly integrates with the Checkbox component while maintaining the cookie consent's specific layout requirements:

```css
/* Custom integration with Checkbox component */
.cookie-consent__category-label .checkbox-input {
  position: static !important; /* Override Checkbox positioning */
  opacity: 1 !important; /* Make visible in custom layout */
  width: auto !important;
  height: auto !important;
}

.cookie-consent__category-label .checkbox-indicator {
  margin-right: 0 !important; /* Integrate with custom spacing */
}
```

## 🧪 Testing

```javascript
import { describe, it, expect } from 'vitest';
import CookieConsent from './CookieConsent.js';

describe('CookieConsent GDPR Compliance with Checkbox Integration', () => {
  it('should require explicit consent for non-necessary cookies using Checkbox components', () => {
    const consent = CookieConsent({ autoShow: false, mode: 'detailed' });
    consent.show();

    // All optional categories should be disabled by default via Checkbox components
    const optionalCheckboxes = document.querySelectorAll(
      '.checkbox-input:not(:disabled)'
    );

    optionalCheckboxes.forEach((checkbox) => {
      expect(checkbox.checked).toBe(false); // Checkbox enforces GDPR compliance
    });
  });

  it('should handle checkbox changes through Checkbox component events', async () => {
    const onCategoryChange = vi.fn();
    const consent = CookieConsent({
      autoShow: false,
      mode: 'detailed',
      onCategoryChange,
    });
    consent.show();

    const checkbox = document.querySelector('.checkbox-input:not(:disabled)');
    checkbox.checked = true;

    // Trigger Checkbox component's onChange event
    const changeEvent = new Event('change', { bubbles: true });
    checkbox.dispatchEvent(changeEvent);

    expect(onCategoryChange).toHaveBeenCalled();
  });

  it('should properly cleanup Checkbox components on destroy', () => {
    const consent = CookieConsent({ autoShow: false, mode: 'detailed' });
    consent.show();

    const checkboxes = document.querySelectorAll('.checkbox-input');
    expect(checkboxes.length).toBeGreaterThan(0);

    consent.destroy();

    // All Checkbox components should be properly cleaned up
    expect(document.querySelectorAll('.checkbox-input')).toHaveLength(0);
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

### Component Benefits

- **Consistent Behavior**: All checkboxes behave identically to other form elements
- **Automatic Cleanup**: Checkbox components are properly destroyed preventing memory leaks
- **Event Management**: Leverages Checkbox's optimized event handling system
- **Theme Integration**: Automatic theme consistency through component inheritance
- **Validation Ready**: Can leverage Checkbox validation for complex requirements

## 📱 Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)
- Internet Explorer 11 (with polyfills)

## 🏗️ Architecture

The CookieConsent component is built on top of multiple Svarog components:

- **Modal Component**: Provides the dialog/banner container, focus management, and accessibility
- **Checkbox Component**: Handles all checkbox interactions with standardized props and behavior
- **Element Factory**: Used for creating DOM elements efficiently

**Benefits of Component Integration:**

- **Reliability**: Uses battle-tested components as foundation
- **Consistency**: Inherits accessibility, keyboard navigation, and styling from base components
- **Maintainability**: Reduces code duplication and leverages shared component logic
- **Standardization**: All checkboxes use the same `value`, `onChange`, and `disabled` props
- **Focus Management**: Automatic focus handling via Modal and Checkbox integration
- **Animation System**: Smooth transitions handled by Modal component
- **Event Cleanup**: Automatic event listener cleanup via component lifecycle management

## 🔗 Related Components

- [Modal](../Modal/README.md) - Base component for cookie consent container
- [Checkbox](../Checkbox/README.md) - Used for all category selections
- [Button](../Button/README.md) - For action buttons (via Modal)
- [Form](../Form/README.md) - For extended settings

## 📚 Legal Notes

This component provides a technical solution for GDPR compliance but does not replace legal advice. Please consult a lawyer for specific legal requirements of your company.

**Important GDPR Points:**

- Consent must be freely given, specific, informed and unambiguous
- Withdrawal must be as easy as giving consent (ensured by consistent Checkbox behavior)
- Documentation of consent is required (automatically handled)
- Regular review and updates necessary

**Component Compliance Features:**

- ✅ No pre-checked optional cookies (enforced by Checkbox component defaults)
- ✅ Clear labeling and descriptions for each category
- ✅ Consistent interaction patterns via standardized components
- ✅ Proper focus management and accessibility
- ✅ Easy revocation through same interface

## 🤝 Contributing

Contributions to improve GDPR compliance are welcome:

1. Fork the repository
2. Create a feature branch
3. Implement your changes (ensure Checkbox component integration)
4. Test compliance requirements
5. Create a pull request

For legal requirements, please include appropriate documentation.

## 🆕 Migration from v3

If upgrading from Svarog v3:

### Breaking Changes

- Now built on Modal and Checkbox components (more reliable)
- Checkbox HTML structure changed (uses Checkbox component)
- Some CSS classes changed to accommodate component integration

### Benefits

- Better accessibility and keyboard navigation
- Improved focus management
- Enhanced animations and transitions
- Consistent checkbox behavior across the application
- Automatic theme integration
- Better event handling and cleanup
- Same GDPR compliance features with improved UX

### Migration Steps

1. **Update imports**: No changes needed - same import path
2. **Update custom CSS**: Check for any custom checkbox styles that may need adjustment
3. **Test integration**: Verify all functionality works with new component architecture
4. **Update tests**: Use new Checkbox component selectors if testing custom implementations

### API Compatibility

```javascript
// ✅ All existing APIs remain compatible
const consent = CookieConsent({
  mode: 'detailed',
  onAccept: (preferences) => {
    // Same callback signature
  },
  onCategoryChange: (categoryId, enabled) => {
    // Now triggered by Checkbox component events (more reliable)
  },
});

// ✅ All methods remain the same
consent.show();
consent.hide();
consent.getPreferences();
consent.revokeConsent();
consent.destroy(); // Now also cleans up Checkbox components
```

The integration with Checkbox components provides significant improvements in consistency, accessibility, and maintainability while maintaining full API compatibility.
