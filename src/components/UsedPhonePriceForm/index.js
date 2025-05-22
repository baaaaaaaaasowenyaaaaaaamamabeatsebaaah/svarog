// src/components/UsedPhonePriceForm/index.js
import UsedPhonePriceForm from './UsedPhonePriceForm.js';
import createUsedPhonePriceFormContainer from './UsedPhonePriceFormContainer.js';

// Export the factory function directly for the container
export const UsedPhonePriceFormContainer = createUsedPhonePriceFormContainer;

// Export the Form component
export { UsedPhonePriceForm };

// Default export is the form component
export default UsedPhonePriceForm;
