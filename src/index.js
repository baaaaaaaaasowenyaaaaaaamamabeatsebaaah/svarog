// src/index.js
/**
 * @file Main library entry point for Svarog UI
 * @description Provides both individual and categorized component exports
 * Note: CSS styles should be imported separately by the consuming application
 */

// ---- LAYOUT COMPONENTS ----
import Accordion from './components/Accordion/index.js';
import Grid from './components/Grid/index.js';
import { Section } from './components/Section/index.js';
import Header from './components/Header/index.js';
import Footer from './components/Footer/index.js';
import Hero from './components/Hero/index.js';
import MuchandyHero from './components/MuchandyHero/index.js';
import CollapsibleHeader from './components/CollapsibleHeader/index.js';
import Page from './components/Page/Page.js';

// ---- NAVIGATION COMPONENTS ----
import Navigation from './components/Navigation/index.js';
import Link from './components/Link/index.js';
import Tabs from './components/Tabs/index.js';
import Pagination from './components/Pagination/index.js';
import StickyContactIcons from './components/StickyContactIcons/index.js';

// ---- UI COMPONENTS ----
import Button from './components/Button/index.js';
import Typography from './components/Typography/index.js';
import Logo from './components/Logo/index.js';
import Card from './components/Card/index.js';
import Rating from './components/Rating/index.js';
import StepsIndicator from './components/StepsIndicator/index.js';
import PriceDisplay from './components/PriceDisplay/index.js';
import ContactInfo from './components/ContactInfo/index.js';
import ProductCard from './components/ProductCard/index.js';
import Image from './components/Image/index.js';
import Modal from './components/Modal/index.js';
import BackToTop from './components/BackToTop/index.js';

// ---- FORM COMPONENTS ----
import Input from './components/Input/index.js';
import Select from './components/Select/index.js';
import Checkbox from './components/Checkbox/index.js';
import Radio from './components/Radio/index.js';
import RadioGroup from './components/Radio/index.js';
import {
  Form,
  FormGroup,
  FormSection,
  FormActions,
} from './components/Form/index.js';
import PhoneRepairForm from './components/PhoneRepairForm/index.js';
import UsedPhonePriceForm from './components/UsedPhonePriceForm/index.js';
import PhoneRepairFormContainer from './components/PhoneRepairForm/PhoneRepairFormContainer.js';
import UsedPhonePriceFormContainer from './components/UsedPhonePriceForm/UsedPhonePriceFormContainer.js';
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
  themeManager,
  switchTheme,
  getCurrentTheme,
  setThemeVariable,
} from './utils/theme.js';

// ===============================================
// PRIMARY EXPORTS - Individual Components
// ===============================================
// This is what most users will import

export {
  // Layout Components
  Accordion,
  Grid,
  Section,
  Header,
  Footer,
  Hero,
  MuchandyHero,
  CollapsibleHeader,
  Page,

  // Navigation Components
  Navigation,
  Link,
  Tabs,
  Pagination,
  StickyContactIcons,

  // UI Components
  Button,
  Typography,
  Logo,
  Card,
  Rating,
  StepsIndicator,
  PriceDisplay,
  ContactInfo,
  ProductCard,
  Image,
  Modal,
  BackToTop,

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
  themeManager,
  switchTheme,
  getCurrentTheme,
  setThemeVariable,
};

// ===============================================
// CATEGORIZED EXPORTS - For Organized Imports
// ===============================================
// Advanced users can import by category

export const Layout = {
  Accordion,
  Grid,
  Section,
  Header,
  Footer,
  Hero,
  MuchandyHero,
  CollapsibleHeader,
  Page,
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
  Typography,
  Logo,
  Card,
  Rating,
  StepsIndicator,
  PriceDisplay,
  ContactInfo,
  ProductCard,
  Image,
  Modal,
  BackToTop,
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

export const Utils = {
  themeManager,
  switchTheme,
  getCurrentTheme,
  setThemeVariable,
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
  Utils,

  // Individual components (for backward compatibility)
  Accordion,
  BackToTop,
  Modal,
  Grid,
  Section,
  Header,
  Footer,
  Hero,
  MuchandyHero,
  CollapsibleHeader,
  Page,
  Navigation,
  Link,
  Tabs,
  Textarea,
  Pagination,
  StickyContactIcons,
  Button,
  Typography,
  Logo,
  Card,
  Rating,
  StepsIndicator,
  PriceDisplay,
  ContactInfo,
  ProductCard,
  Image,
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
  BlogCard,
  BlogList,
  BlogDetail,
  Map,
  Head,
  themeManager,
  switchTheme,
  getCurrentTheme,
  setThemeVariable,
};

export default Svarog;
