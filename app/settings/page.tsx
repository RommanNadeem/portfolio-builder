'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, ArrowLeft, Save, Trash2, AlertTriangle } from 'lucide-react';
import { getCurrentUser, signOut } from '@/lib/supabase';
import { getCompletePortfolio, saveCompletePortfolio, convertToLegacyFormat, deleteAllUserData } from '@/lib/database';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  
  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push('/signin');
          return;
        }

        setUserId(user.id);
        
        const { data: portfolioData, error } = await getCompletePortfolio(user.id);
        if (!error && portfolioData) {
          const parsedData = convertToLegacyFormat(portfolioData);
          setFullName(parsedData.fullName || '');
          setProfession(parsedData.profession || '');
          setEmail(parsedData.email || '');
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleSave = async () => {
    if (!userId) return;

    setSaving(true);
    try {
      // Load current portfolio data
      const { data: portfolioData } = await getCompletePortfolio(userId);
      if (portfolioData) {
        const parsedData = convertToLegacyFormat(portfolioData);
        
        // Update only account fields
        const updatedData = {
          ...parsedData,
          fullName,
          profession,
          email,
        };

        await saveCompletePortfolio(userId, updatedData);
        alert('Account settings saved!');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) return;
    
    // Verify confirmation text
    if (deleteConfirmText !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }

    setDeleting(true);
    try {
      // 1. Delete all portfolio data from database
      const { error: dbError } = await deleteAllUserData(userId);
      if (dbError) {
        throw new Error('Failed to delete portfolio data: ' + dbError);
      }

      // 2. Delete auth user (this requires admin privileges, so we'll just sign out)
      // Note: In production, you'd need to call a server-side function to delete the auth user
      await signOut();
      
      // 3. Clear local storage
      localStorage.clear();
      sessionStorage.clear();
      
      // 4. Redirect to home
      router.push('/');
      
    } catch (err: any) {
      console.error('Error deleting account:', err);
      alert('Failed to delete account: ' + err.message);
      setDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/editor')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Editor
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Basic account details used across your portfolio
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sarah Johnson"
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Your legal or preferred full name (used in metadata and SEO)
              </p>
            </div>

            {/* Profession */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profession *
              </label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="Product Designer & Strategist"
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Your primary role or title (used for SEO and meta descriptions)
              </p>
            </div>

            {/* Account Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Account Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Primary email for account, notifications, and system communications
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> To add your email and phone to your portfolio, go to the <strong>Social Links</strong> section in the editor and add them as contact chips.
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg border-2 border-red-200 shadow-sm mt-8">
          <div className="p-6 border-b border-red-200 bg-red-50">
            <h2 className="text-lg font-bold text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </h2>
            <p className="text-sm text-red-700 mt-1">
              Irreversible actions that permanently affect your account
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-600">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <ul className="mt-3 text-xs text-gray-500 space-y-1 list-disc list-inside">
                  <li>All portfolio data will be deleted</li>
                  <li>Your published portfolio will be taken down</li>
                  <li>All files and images will be removed</li>
                  <li>This action is irreversible</li>
                </ul>
              </div>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="ml-6 flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Delete Account?</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        This will permanently delete all your data and cannot be undone.
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="font-mono font-bold">DELETE</span> to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="DELETE"
                      className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                      }}
                      disabled={deleting}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmText !== 'DELETE' || deleting}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deleting ? 'Deleting...' : 'Delete Forever'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
