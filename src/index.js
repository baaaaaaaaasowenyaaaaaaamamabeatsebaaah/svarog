// src/index.js
// Import styles first
import './styles/index.js';

/**
 * @file Main library entry point for Svarog UI
 * @description Provides categorized components and utility exports
 */

// ---- LAYOUT COMPONENTS ----
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

/**
 * Component categories for organized imports
 */
const Layout = {
  Grid,
  Section,
  Header,
  Footer,
  Hero,
  MuchandyHero,
  CollapsibleHeader,
  Page,
};

// Using the name "Nav" for the category to avoid conflict with the Navigation component
const Nav = {
  Navigation,
  Link,
  Tabs,
  Pagination,
  StickyContactIcons,
};

const UI = {
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
};

const Forms = {
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
};

const Content = {
  BlogCard,
  BlogList,
  BlogDetail,
};

const Utils = {
  themeManager,
  switchTheme,
  getCurrentTheme,
  setThemeVariable,
};

// Define the library with categorized components
const Svarog = {
  Layout,
  Nav,
  UI,
  Forms,
  Content,
  Map,
  Head,
  Utils,
};

// Export all components individually to allow destructured imports
export {
  // Layout
  Grid,
  Section,
  Header,
  Footer,
  Hero,
  MuchandyHero,
  CollapsibleHeader,
  Page,

  // Navigation
  Navigation,
  Link,
  Tabs,
  Pagination,
  StickyContactIcons,

  // UI
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

  // Form
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

  // Blog/Content
  BlogCard,
  BlogList,
  BlogDetail,

  // Map
  Map,

  // Meta
  Head,

  // Utils
  themeManager,
  switchTheme,
  getCurrentTheme,
  setThemeVariable,
};

// Export categorized imports - keep Nav as Nav to avoid conflict with Navigation component
export { Layout, Nav, UI, Forms, Content, Utils };

// Default export of the whole library
export default Svarog;
