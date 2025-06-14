// src/index.js
/**
 * @file Main library entry point for Svarog UI
 * @description Provides both individual and categorized component exports
 * Note: CSS styles should be imported separately by the consuming application
 */

// ---- LAYOUT COMPONENTS ----
import Accordion from './components/Accordion/index.js';
import Grid from './components/Grid/index.js';
import ProductGrid from './components/ProductGrid/ProductGrid.js';
import Section from './components/Section/index.js';
import Header from './components/Header/index.js';
import Footer from './components/Footer/index.js';
import Hero from './components/Hero/index.js';
import MuchandyHero from './components/MuchandyHero/index.js';
import CollapsibleHeader, {
  CollapsibleHeaderContainer,
} from './components/CollapsibleHeader/index.js';
import Page from './components/Page/index.js';
import ContactSection from './components/ContactSection/index.js';

// ---- NAVIGATION COMPONENTS ----
import Navigation from './components/Navigation/index.js';
import Link from './components/Link/index.js';
import Tabs from './components/Tabs/index.js';
import Pagination from './components/Pagination/index.js';
import StickyContactIcons from './components/StickyContactIcons/index.js';

// ---- UI COMPONENTS ----
import Button from './components/Button/index.js';
import Tag from './components/Tag/Tag.js';
import Typography from './components/Typography/index.js';
import RichText from './components/RichText/RichText.js';
import Logo from './components/Logo/index.js';
import Card from './components/Card/index.js';
import Rating from './components/Rating/index.js';
import StepsIndicator from './components/StepsIndicator/index.js';
import PriceDisplay from './components/PriceDisplay/index.js';
import ContactInfo from './components/ContactInfo/index.js';
import ProductCard from './components/ProductCard/index.js';
import ProductDetail from './components/ProductDetail/ProductDetail.js';
import Image from './components/Image/index.js';
import Modal from './components/Modal/index.js';
import BackToTop from './components/BackToTop/index.js';
import CookieConsent from './components/CookieConsent/index.js';
import ImageSlider from './components/ImageSlider/ImageSlider.js';

// ---- FORM COMPONENTS ----
import Input from './components/Input/index.js';
import Select from './components/Select/index.js';
import Checkbox from './components/Checkbox/index.js';
import { Radio, RadioGroup } from './components/Radio/index.js';
import {
  Form,
  FormGroup,
  FormSection,
  FormActions,
} from './components/Form/index.js';
import PhoneRepairForm, {
  PhoneRepairFormContainer,
} from './components/PhoneRepairForm/index.js';
import UsedPhonePriceForm, {
  UsedPhonePriceFormContainer,
} from './components/UsedPhonePriceForm/index.js';
import ConditionSelector from './components/ConditionSelector/index.js';
import Textarea from './components/Textarea/index.js';

// ---- BLOG/CONTENT COMPONENTS ----
import BlogCard from './components/BlogCard/index.js';
import BlogList from './components/BlogList/index.js';
import BlogDetail from './components/BlogDetail/index.js';

// ---- MAP COMPONENTS ----
import Map from './components/Map/index.js';

// ---- META COMPONENTS ----
import Head from './components/Head/index.js';

// ---- UTILITIES ----
import {
  ThemeManager,
  themeManager,
  loadTheme,
  loadCustomTheme,
  checkRequiredVariables,
  onThemeChange,
  switchTheme,
  getCurrentTheme,
} from './utils/themeManager.js';

// ===============================================
// PRIMARY EXPORTS - Individual Components
// ===============================================
// This is what most users will import

export {
  // Layout Components
  Accordion,
  Grid,
  ProductGrid,
  Section,
  Header,
  Footer,
  Hero,
  MuchandyHero,
  CollapsibleHeader,
  CollapsibleHeaderContainer,
  Page,
  ContactSection,

  // Navigation Components
  Navigation,
  Link,
  Tabs,
  Pagination,
  StickyContactIcons,

  // UI Components
  Button,
  Tag,
  Typography,
  RichText,
  Logo,
  Card,
  Rating,
  StepsIndicator,
  PriceDisplay,
  ContactInfo,
  ProductCard,
  ProductDetail,
  Image,
  Modal,
  BackToTop,
  CookieConsent,
  ImageSlider,

  // Form Components
  Input,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Form,
  FormGroup,
  FormSection,
  FormActions,
  PhoneRepairForm,
  PhoneRepairFormContainer,
  UsedPhonePriceForm,
  UsedPhonePriceFormContainer,
  ConditionSelector,
  Textarea,

  // Content Components
  BlogCard,
  BlogList,
  BlogDetail,

  // Map Components
  Map,

  // Meta Components
  Head,

  // Theme Utilities
  ThemeManager,
  themeManager,
  loadTheme,
  loadCustomTheme,
  checkRequiredVariables,
  onThemeChange,
  switchTheme,
  getCurrentTheme,
};

// ===============================================
// CATEGORIZED EXPORTS - For Organized Imports
// ===============================================
// Advanced users can import by category

export const Layout = {
  Accordion,
  Grid,
  ProductGrid,
  Section,
  Header,
  Footer,
  Hero,
  MuchandyHero,
  CollapsibleHeader,
  CollapsibleHeaderContainer,
  Page,
  ContactSection,
};

export const Nav = {
  Navigation,
  Link,
  Tabs,
  Pagination,
  StickyContactIcons,
};

export const UI = {
  Button,
  Tag,
  Typography,
  RichText,
  Logo,
  Card,
  Rating,
  StepsIndicator,
  PriceDisplay,
  ContactInfo,
  ProductCard,
  ProductDetail,
  Image,
  Modal,
  BackToTop,
  CookieConsent,
  ImageSlider,
};

export const Forms = {
  Input,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Form,
  FormGroup,
  FormSection,
  FormActions,
  PhoneRepairForm,
  PhoneRepairFormContainer,
  UsedPhonePriceForm,
  UsedPhonePriceFormContainer,
  ConditionSelector,
  Textarea,
};

export const Content = {
  BlogCard,
  BlogList,
  BlogDetail,
};

export const Maps = {
  Map,
};

export const Meta = {
  Head,
};

export const Utils = {
  ThemeManager,
  themeManager,
  loadTheme,
  loadCustomTheme,
  checkRequiredVariables,
  onThemeChange,
  switchTheme,
  getCurrentTheme,
};

// ===============================================
// DEFAULT EXPORT - Complete Library Object
// ===============================================

const Svarog = {
  // Categories
  Layout,
  Nav,
  UI,
  Forms,
  Content,
  Maps,
  Meta,
  Utils,

  // Individual components (for backward compatibility)
  Accordion,
  Grid,
  ProductGrid,
  Section,
  Header,
  Footer,
  Hero,
  MuchandyHero,
  CollapsibleHeader,
  CollapsibleHeaderContainer,
  ContactSection,
  Page,
  Navigation,
  Link,
  Tabs,
  Pagination,
  StickyContactIcons,
  Button,
  Tag,
  Typography,
  RichText,
  Logo,
  Card,
  Rating,
  StepsIndicator,
  PriceDisplay,
  ContactInfo,
  ProductCard,
  ProductDetail,
  Image,
  Modal,
  BackToTop,
  CookieConsent,
  ImageSlider,
  Input,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Form,
  FormGroup,
  FormSection,
  FormActions,
  PhoneRepairForm,
  PhoneRepairFormContainer,
  UsedPhonePriceForm,
  UsedPhonePriceFormContainer,
  ConditionSelector,
  Textarea,
  BlogCard,
  BlogList,
  BlogDetail,
  Map,
  Head,
  ThemeManager,
  themeManager,
  loadTheme,
  loadCustomTheme,
  checkRequiredVariables,
  onThemeChange,
  switchTheme,
  getCurrentTheme,
};

export default Svarog;
