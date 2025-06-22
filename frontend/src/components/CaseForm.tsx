import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Send,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import type { Lawyer, CaseFormData } from '../types';
import instance from '../utils/Axios';

interface CaseFormProps {
  lawyer: Lawyer;
  isOpen: boolean;
  user: { id: number; name: string; email: string };
  onClose: () => void;
  apiBaseUrl?: string;
}

const CaseForm: React.FC<CaseFormProps> = ({ 
  lawyer, 
  isOpen, 
  onClose,
  user,
}) => {
  const [formData, setFormData] = useState<CaseFormData>({
    name: user.name,
    email: user.email,
    contact: '',
    caseDesc: '',
    lawyerID: lawyer.id
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Partial<CaseFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CaseFormData> = {};
    
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contact.replace(/\D/g, ''))) {
      newErrors.contact = 'Contact number must be 10 digits';
    }
    
    if (!formData.caseDesc.trim()) {
      newErrors.caseDesc = 'Case description is required';
    } else if (formData.caseDesc.trim().length < 50) {
      newErrors.caseDesc = 'Case description must be at least 50 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof CaseFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await instance.post(`/sendReqToLawyer`, {
        name: formData.name,
        email: formData.email,
        contact: parseInt(formData.contact.replace(/\D/g, '')),
        caseDesc: formData.caseDesc,
        lawyerID: formData.lawyerID
      });
      
      if (response.data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          contact: '',
          caseDesc: '',
          lawyerID: lawyer.id
        });
      } else {
        throw new Error(response.data.message || 'Failed to send case request');
      }
    } catch (err: any) {
      let errorMessage = 'Failed to send case request';
      
    if (err.response?.data?.message === 'invalid') {
        errorMessage = 'You cannot send a case request to yourself';
    } else if (err.response) {
        errorMessage = err.response.data?.message || `Server Error: ${err.response.status}`;
    } else if (err.request) {
        errorMessage = 'Network Error: Unable to connect to server';
    } else {
        errorMessage = err.message || 'An unexpected error occurred';
    }
      
      setError(errorMessage);
      console.error('Error sending case request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSuccess(false);
      setError('');
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Send Your Case</h2>
            <p className="text-sm text-gray-600">
              To: <span className="font-medium">{lawyer.name}</span> - {lawyer.Specialization}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Success State */}
        {success && (
          <div className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Case Request Sent Successfully!</h3>
            <p className="text-gray-600 mb-4">
              Your case details have been sent to {lawyer.name}. They will review your case and get back to you soon.
            </p>
            <button
              onClick={handleClose}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Error Alert */}
            {error && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  readOnly
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                  disabled={loading}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Contact Field */}
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.contact ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your 10-digit contact number"
                  disabled={loading}
                />
              </div>
              {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
            </div>

            {/* Case Description Field */}
            <div>
              <label htmlFor="caseDesc" className="block text-sm font-medium text-gray-700 mb-1">
                Case Description *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  id="caseDesc"
                  name="caseDesc"
                  value={formData.caseDesc}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                    errors.caseDesc ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Please describe your case in detail. Include relevant facts, timeline, and any specific legal concerns you have. (Minimum 50 characters)"
                  disabled={loading}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                {errors.caseDesc && <p className="text-red-500 text-xs">{errors.caseDesc}</p>}
                <p className="text-gray-400 text-xs ml-auto">
                  {formData.caseDesc.length}/50 characters minimum
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Case Request
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CaseForm;