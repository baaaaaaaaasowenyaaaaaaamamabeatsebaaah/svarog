// src/components/PhoneRepairForm/index.js
import PhoneRepairForm from './PhoneRepairForm.js';
import createPhoneRepairFormContainer from './PhoneRepairFormContainer.js';

// Export the factory function directly for the container
export const PhoneRepairFormContainer = createPhoneRepairFormContainer;

// Export the Form component
export { PhoneRepairForm };

// Default export is the form component
export default PhoneRepairForm;
