'use client';

import React, { useState } from 'react';

interface FormData {
  url: string;
  root_domain: string;
  account_identifier: string;
  language: string;
  date_range: number;
  start_date: string;
  end_date: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    url: string;
    word_count: number;
    language: string;
    keyword_analysis?: string;
    semantic_scores?: string;
    content_structure?: string;
    readability_analysis?: string;
    sentiment_analysis?: string;
    speed_analysis?: string;
    seo_suggestions?: string;
    content_gaps?: string;
    advanced_keywords?: {
      long_tail_keywords?: Array<{
        keyword: string;
        score: number;
        status: string;
        exists: boolean;
        frequency: number;
        locations: string[];
        contexts: string[];
        type: string;
        type_explanation: string;
        usage_suggestion: string;
        score_explanation: string;
        score_category: string;
        placement_suggestions: unknown[];
      }>;
      collocations?: unknown[];
      question_based?: unknown[];
      topic_based?: unknown[];
      semantic_variations?: unknown[];
    };
  };
  error?: string;
}

const SEOAnalysisForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    url: '',
    root_domain: '',
    account_identifier: '',
    language: 'en',
    date_range: 30,
    start_date: '',
    end_date: ''
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ApiResponse['data'] | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'date_range' ? parseInt(value) || 30 : value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.url || !formData.root_domain || !formData.account_identifier) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('https://seo-analyzer-api-n3b8.onrender.com/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      if (data.success && data.data) {
        setResults(data.data);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during analysis';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SEO Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get comprehensive SEO insights for your website with AI-powered suggestions and Google Search Console integration
          </p>
        </div>

        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10">
            <div className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  URL to Analyze *
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  required
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/page-to-analyze"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the full URL of the page you want to analyze
                </p>
              </div>

              <div>
                <label htmlFor="root_domain" className="block text-sm font-medium text-gray-700 mb-2">
                  Root Domain *
                </label>
                <input
                  type="text"
                  id="root_domain"
                  name="root_domain"
                  required
                  value={formData.root_domain}
                  onChange={handleInputChange}
                  placeholder="example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter your domain as it appears in Google Search Console (without https://)
                </p>
              </div>

              <div>
                <label htmlFor="account_identifier" className="block text-sm font-medium text-gray-700 mb-2">
                  Account Identifier *
                </label>
                <input
                  type="text"
                  id="account_identifier"
                  name="account_identifier"
                  required
                  value={formData.account_identifier}
                  onChange={handleInputChange}
                  placeholder="my-website"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-sm text-gray-500 mt-1">
                  A unique identifier for your Google Search Console account
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="date_range" className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range (days)
                  </label>
                  <input
                    type="number"
                    id="date_range"
                    name="date_range"
                    min="1"
                    max="365"
                    value={formData.date_range}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date (optional)
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (optional)
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 focus:ring-4 focus:ring-blue-200'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Analyzing... This may take a few minutes
                    </div>
                  ) : (
                    'Analyze SEO'
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Analysis Error
                    </h3>
                    <p className="mt-2 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {results && (
              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 mb-4">
                  Analysis Complete! 🎉
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-700">URL Analyzed</div>
                    <div className="text-green-600 truncate">{results.url}</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-700">Word Count</div>
                    <div className="text-green-600">{results.word_count}</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-700">Language</div>
                    <div className="text-green-600">{results.language}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <button 
                    onClick={() => console.log('View full results clicked')}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    View Full Results
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Comprehensive Analysis
            </h3>
            <p className="text-gray-600">
              Get insights on keywords, content structure, readability, and performance
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI-Powered Suggestions
            </h3>
            <p className="text-gray-600">
              Receive intelligent recommendations for improving your SEO
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              GSC Integration
            </h3>
            <p className="text-gray-600">
              Connect with Google Search Console for real performance data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOAnalysisForm;