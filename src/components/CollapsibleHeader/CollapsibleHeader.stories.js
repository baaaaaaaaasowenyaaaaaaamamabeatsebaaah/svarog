// src/components/CollapsibleHeader/CollapsibleHeader.stories.js
import CollapsibleHeader from './CollapsibleHeader.js';

export default {
  title: 'Components/Layout/CollapsibleHeader',
  component: CollapsibleHeader,
};

// Sample navigation items
const navigationItems = [
  { id: 'repair', label: 'Reparatur', href: '/reparatur' },
  { id: 'purchase', label: 'Ankauf', href: '/ankauf' },
  { id: 'used', label: 'Gebrauchte', href: '/gebrauchte' },
  { id: 'services', label: 'Services', href: '/services' },
  { id: 'find-us', label: 'So Finden Sie Uns', href: '/kontakt' },
  { id: 'call', label: 'Anrufen', href: '/anrufen' },
];

// Sample navigation for second example
const navigationItems2 = [
  { id: 'appointment', label: 'Termin vereinbaren', href: '/termin' },
  { id: 'repair-select', label: 'Reparatur wählen', href: '/reparatur' },
  { id: 'consulting', label: 'Tarifberatung', href: '/beratung' },
  { id: 'contact', label: 'Kontakt', href: '/kontakt' },
  { id: 'directions', label: 'Anfahrt', href: '/anfahrt' },
  { id: 'shop', label: 'Shop', href: '/shop' },
];

export const MuchandyHeader = () => {
  // Create a wrapper with scroll area
  const wrapper = document.createElement('div');
  wrapper.style.height = '500px';
  wrapper.style.overflow = 'auto';
  wrapper.style.position = 'relative';
  wrapper.style.border = '1px solid #ccc';

  // Create content to allow scrolling
  const content = document.createElement('div');
  content.style.height = '1200px';
  content.style.padding = '20px';
  content.style.paddingTop = '200px';
  content.innerHTML =
    '<h2>Scroll down to see header collapse</h2><p>The header will collapse after scrolling past the threshold.</p>';

  // Create SVG logo string
  const svgLogo = `
    <svg width="120" height="80" viewBox="0 0 200 140">
      <g>
        <path d="M103 19.7c0 16-12.6 28.7-28.3 28.7S46.4 35.6 46.4 19.7 59 -9 74.7 -9s28.3 12.6 28.3 28.7z" fill="#4294d0"/>
        <path d="M132.5 19.7c0 16-12.6 28.7-28.3 28.7S76 35.6 76 19.7 88.6 -9 104.3 -9s28.2 12.6 28.2 28.7z" fill="#4294d0"/>
        <path d="M103 49.3c0 16-12.6 28.7-28.3 28.7S46.4 65.3 46.4 49.3 59 20.7 74.7 20.7s28.3 12.6 28.3 28.6z" fill="#4294d0"/>
        <text x="67" y="110" font-family="Arial" font-weight="bold" font-size="40" fill="#333">HANDY</text>
        <text x="72" y="130" font-family="Arial" font-size="12" fill="#666">Reparatur & Tarifberatung</text>
      </g>
    </svg>
  `;

  // Create compact SVG logo string
  const compactSvgLogo = `
    <svg width="60" height="60" viewBox="0 0 120 80">
      <g>
        <path d="M73 19.7c0 16-12.6 28.7-28.3 28.7S16.4 35.6 16.4 19.7 29 -9 44.7 -9s28.3 12.6 28.3 28.7z" fill="#4294d0"/>
        <path d="M102.5 19.7c0 16-12.6 28.7-28.3 28.7S46 35.6 46 19.7 58.6 -9 74.3 -9s28.2 12.6 28.2 28.7z" fill="#4294d0"/>
        <path d="M73 49.3c0 16-12.6 28.7-28.3 28.7S16.4 65.3 16.4 49.3 29 20.7 44.7 20.7s28.3 12.6 28.3 28.6z" fill="#4294d0"/>
      </g>
    </svg>
  `;

  // Create data URLs for the logos
  const svgDataUrl =
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgLogo);
  const compactSvgDataUrl =
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(compactSvgLogo);

  // Create the header
  const header = new CollapsibleHeader({
    siteName: 'MUCHANDY',
    navigation: {
      items: navigationItems,
    },
    contactInfo: {
      location: 'Luisenstr. 1',
      phone: '0176/88778877',
      email: 'info@muchandy.de',
    },
    logo: svgDataUrl,
    compactLogo: compactSvgDataUrl,
    collapseThreshold: 50,
  });

  // Append header and content to the wrapper
  wrapper.appendChild(header.getElement());
  wrapper.appendChild(content);

  // Add instructions
  const instructions = document.createElement('div');
  instructions.style.position = 'absolute';
  instructions.style.bottom = '20px';
  instructions.style.right = '20px';
  instructions.style.padding = '10px';
  instructions.style.background = 'rgba(0,0,0,0.7)';
  instructions.style.color = 'white';
  instructions.style.borderRadius = '5px';
  instructions.style.zIndex = '1000';
  instructions.innerHTML = 'Scroll down to see the header collapse';

  wrapper.appendChild(instructions);

  // Set up the scroll listener after the header is added to the DOM
  setTimeout(() => {
    header.componentDidMount(wrapper);
  }, 0);

  return wrapper;
};

export const SecondDesign = () => {
  // Create a wrapper with scroll area
  const wrapper = document.createElement('div');
  wrapper.style.height = '400px';
  wrapper.style.overflow = 'auto';
  wrapper.style.position = 'relative';
  wrapper.style.border = '1px solid #ccc';

  // Create content to allow scrolling
  const content = document.createElement('div');
  content.style.height = '1200px';
  content.style.padding = '20px';
  content.style.paddingTop = '200px';
  content.innerHTML =
    '<h2>Alternative Design Example</h2><p>Scroll to see how this design collapses.</p>';

  // Create SVG logo string for second design
  const svgLogo = `
    <svg width="80" height="60" viewBox="0 0 120 80">
      <g>
        <path d="M73 19.7c0 16-12.6 28.7-28.3 28.7S16.4 35.6 16.4 19.7 29 -9 44.7 -9s28.3 12.6 28.3 28.7z" fill="#4294d0"/>
        <path d="M102.5 19.7c0 16-12.6 28.7-28.3 28.7S46 35.6 46 19.7 58.6 -9 74.3 -9s28.2 12.6 28.2 28.7z" fill="#4294d0"/>
      </g>
    </svg>
  `;

  // Create data URL for the logo
  const svgDataUrl =
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgLogo);

  // Create the header
  const header = new CollapsibleHeader({
    navigation: {
      items: navigationItems2,
    },
    contactInfo: {
      location: 'Luisenstr. 1',
      phone: '0176/88778877',
      email: 'info@muchandy.de',
    },
    logo: svgDataUrl,
    collapseThreshold: 50,
    className: 'second-design',
  });

  // Add custom styles for the second design
  const style = document.createElement('style');
  style.textContent = `
    .second-design {
      --nav-link-color: #333;
      --nav-link-hover-color: #4294d0;
      --nav-link-active-color: #4294d0;
    }
    
    .second-design .collapsible-header__navigation {
      padding: 0.5rem 0;
    }
    
    .second-design .nav__link {
      font-weight: 500;
    }
  `;
  document.head.appendChild(style);

  // Append header and content to the wrapper
  wrapper.appendChild(header.getElement());
  wrapper.appendChild(content);

  // Set up the scroll listener after the header is added to the DOM
  setTimeout(() => {
    header.componentDidMount(wrapper);
  }, 0);

  return wrapper;
};
