// src/components/UsedPhonePriceForm/index.js
import UsedPhonePriceForm from './UsedPhonePriceForm.js';
import createUsedPhonePriceFormContainer from './UsedPhonePriceFormContainer.js';

// Export the factory function with both names for backward compatibility
export const UsedPhonePriceFormContainer = createUsedPhonePriceFormContainer;
export { createUsedPhonePriceFormContainer };

// Export the Form component
export { UsedPhonePriceForm };

// Default export is the form component
export default UsedPhonePriceForm;
