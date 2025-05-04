// src/components/Pagination/Pagination.stories.js
import Pagination from './Pagination.js';

export default {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
};

const onPageChange = (page) => {
  console.log(`Page changed to: ${page}`);
};

export const Default = () => {
  return new Pagination({
    currentPage: 1,
    totalPages: 10,
    onPageChange,
  });
};

export const MiddlePage = () => {
  return new Pagination({
    currentPage: 5,
    totalPages: 10,
    onPageChange,
  });
};

export const LastPage = () => {
  return new Pagination({
    currentPage: 10,
    totalPages: 10,
    onPageChange,
  });
};

export const ManyPages = () => {
  return new Pagination({
    currentPage: 10,
    totalPages: 50,
    onPageChange,
  });
};

export const FewPages = () => {
  return new Pagination({
    currentPage: 2,
    totalPages: 3,
    onPageChange,
  });
};

export const SinglePage = () => {
  return new Pagination({
    currentPage: 1,
    totalPages: 1,
    onPageChange,
  });
};

export const WithCustomSiblingCount = () => {
  return new Pagination({
    currentPage: 10,
    totalPages: 20,
    siblingCount: 2,
    onPageChange,
  });
};
