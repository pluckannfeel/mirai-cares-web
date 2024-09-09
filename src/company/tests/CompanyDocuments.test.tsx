// CompanyDocuments.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // for extended matchers like "toBeInTheDocument"
import CompanyDocuments from "../pages/CompanyDocuments"
import { useStaffSelect } from '../../staff/hooks/useStaffSelection';
import { usePatientSelect } from '../../patients/hooks/usePatientSelection';
import { useInstitutionsSelect } from '../../medical_institution/hooks/useInstitutionSelection';
import { useCompanyGenerateDocument } from '../hooks/useCompanyGenerateDocument';

// Mock dependencies
jest.mock('../../staff/hooks/useStaffSelection');
jest.mock('../../patients/hooks/usePatientSelection');
jest.mock('../../medical_institution/hooks/useInstitutionSelection');
jest.mock('../hooks/useCompanyGenerateDocument');

const mockGenerateDocument = jest.fn();
const mockSnackbar = jest.fn();

// Mock necessary hooks
(useStaffSelect as jest.Mock).mockReturnValue({ data: [] });
(usePatientSelect as jest.Mock).mockReturnValue({ data: [] });
(useInstitutionsSelect as jest.Mock).mockReturnValue({ data: [] });
(useCompanyGenerateDocument as jest.Mock).mockReturnValue({
  isGenerating: false,
  generateDocument: mockGenerateDocument,
});

// Mock Snackbar
jest.mock('../../core/contexts/SnackbarProvider', () => ({
  useSnackbar: () => ({
    success: mockSnackbar,
    error: mockSnackbar,
  }),
}));

describe('CompanyDocuments Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form fields', () => {
    render(<CompanyDocuments />);

    // Check for some of the key fields to ensure the form is rendered
    expect(screen.getByLabelText(/document name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/staff/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/place of work/i)).toBeInTheDocument();
  });

  test('handles user input correctly', async () => {
    render(<CompanyDocuments />);

    // Fill out the form
    const documentNameField = screen.getByLabelText(/document name/i);
    fireEvent.change(documentNameField, { target: { value: 'mys_contract' } });

    const placeOfWorkField = screen.getByLabelText(/place of work/i);
    fireEvent.change(placeOfWorkField, { target: { value: 'Tokyo' } });

    // Submit the form
    const submitButton = screen.getByText(/generate/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockGenerateDocument).toHaveBeenCalledTimes(1);
      expect(mockGenerateDocument).toHaveBeenCalledWith(
        expect.objectContaining({
          document_name: 'mys_contract',
          place_of_work: 'Tokyo',
        }),
      );
    });
  });

  test('validates required fields', async () => {
    render(<CompanyDocuments />);

    // Submit the form without filling anything
    const submitButton = screen.getByText(/generate/i);
    fireEvent.click(submitButton);

    // Check that error messages are displayed
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });

    expect(mockGenerateDocument).not.toHaveBeenCalled();
  });

  test('conditionally renders Docusign-related fields', () => {
    render(<CompanyDocuments />);

    // Change the document type to "mys_contract" to enable esignature
    fireEvent.change(screen.getByLabelText(/document name/i), {
      target: { value: 'mys_contract' },
    });

    // Check that esignature option is displayed
    expect(
      screen.getByLabelText(/requestSignature/i),
    ).toBeInTheDocument();
  });
});
