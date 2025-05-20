// src/index.js
// Import styles first
import './styles/index.js';

// Import components
import Button from './components/Button/Button.js';
import Grid from './components/Grid/Grid.js';
import Navigation from './components/Navigation/Navigation.js';
import Link from './components/Link/Link.js';
import { Section } from './components/Section/Section.js';
import Typography from './components/Typography/Typography.js';
import Logo from './components/Logo/Logo.js';
import Card from './components/Card/Card.js';
import Input from './components/Input/Input.js';
import Select from './components/Select/Select.js';
import Checkbox from './components/Checkbox/Checkbox.js';
import Radio from './components/Radio/Radio.js';
import RadioGroup from './components/Radio/RadioGroup.js';
import Rating from './components/Rating/Rating.js';
import {
  Form,
  FormGroup,
  FormSection,
  FormActions,
} from './components/Form/index.js';
import {
  themeManager,
  switchTheme,
  getCurrentTheme,
  setThemeVariable,
} from './utils/theme.js';
import Map from './components/Map/Map.js';
import Head from './components/Head/Head.js';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import PhoneRepairForm from './components/PhoneRepairForm/PhoneRepairForm.js';
import UsedPhonePriceForm from './components/UsedPhonePriceForm/UsedPhonePriceForm.js';
import PhoneRepairFormContainer from './components/PhoneRepairForm/PhoneRepairFormContainer.js';
import UsedPhonePriceFormContainer from './components/UsedPhonePriceForm/UsedPhonePriceFormContainer.js';
import StepsIndicator from './components/StepsIndicator/StepsIndicator.js';
import PriceDisplay from './components/PriceDisplay/PriceDisplay.js';
import ConditionSelector from './components/ConditionSelector/ConditionSelector.js';
import BlogCard from './components/BlogCard/BlogCard.js';
import BlogList from './components/BlogList/BlogList.js';
import BlogDetail from './components/BlogDetail/BlogDetail.js';
import Hero from './components/Hero/Hero.js';
import Pagination from './components/Pagination/Pagination.js';
import MuchandyHero from './components/MuchandyHero/MuchandyHero.js';
import Tabs from './components/Tabs/Tabs.js';
import ContactInfo from './components/ContactInfo/ContactInfo.js';
import CollapsibleHeader from './components/CollapsibleHeader/CollapsibleHeader.js';
import StickyContactIcons from './components/StickyContactIcons/StickyContactIcons.js';
import ProductCard from './components/ProductCard/ProductCard.js';
import Image from './components/Image/Image.js';

// Export components
const Svarog = {
  Image,
  ProductCard,
  StickyContactIcons,
  CollapsibleHeader,
  ContactInfo,
  Tabs,
  MuchandyHero,
  // Components
  Button,
  Grid,
  Navigation,
  Link,
  Section,
  Typography,
  Logo,
  Card,
  Input,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Form,
  FormGroup,
  FormSection,
  FormActions,
  Rating,
  Map,
  Head,
  Header,
  Footer,
  PhoneRepairForm,
  PhoneRepairFormContainer,
  UsedPhonePriceForm,
  UsedPhonePriceFormContainer,
  StepsIndicator,
  PriceDisplay,
  ConditionSelector,
  BlogCard,
  BlogList,
  BlogDetail,
  Hero,
  Pagination,
  // Utilities
  themeManager,
  switchTheme,
  getCurrentTheme,
  setThemeVariable,
};

// Individual named exports
export {
  Button,
  Grid,
  Navigation,
  Link,
  Section,
  Typography,
  Logo,
  Card,
  Input,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Rating,
  Form,
  FormGroup,
  FormSection,
  FormActions,
  Map,
  Head,
  Header,
  Footer,
  PhoneRepairForm,
  PhoneRepairFormContainer,
  UsedPhonePriceForm,
  UsedPhonePriceFormContainer,
  ProductCard,
  StepsIndicator,
  PriceDisplay,
  ConditionSelector,
  BlogCard,
  BlogList,
  BlogDetail,
  Hero,
  Pagination,
  themeManager,
  CollapsibleHeader,
  StickyContactIcons,
  ContactInfo,
  Tabs,
  MuchandyHero,
  switchTheme,
  getCurrentTheme,
  setThemeVariable,
};

// Default export of the whole library
export default Svarog;
