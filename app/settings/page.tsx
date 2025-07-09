"use client"
import React, { useState, ChangeEvent } from 'react';
import {
    Save,
    User,
    Mail,
    Building,
    Globe,
    Phone,
    MapPin,
    Shield,
    Lock,
    Bell,
    Image as ImageIcon,
    Palette,
    FileText,
    RefreshCw,
    FileWarning,
    AlertCircle,
    Key,
    Smartphone,
    Users,
    MessageSquare,
    Tag,
    CheckSquare,
    UserPlus,
    Edit,
    Menu,
    ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import BrandTabs from "@/settings/componenet/BrandTabs";

export default function BrandSettings() {
    // Add state for active tab
    const [activeTab, setActiveTab] = useState('brand-info');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Add global styles for webkit scrollbar hiding
    React.useEffect(() => {
        // Add a style tag to the head element to hide scrollbars for WebKit browsers
        const style = document.createElement('style');
        style.textContent = `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `;
        document.head.appendChild(style);

        // Clean up the style when the component unmounts
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Brand Information Form State
    const [brandInfo, setBrandInfo] = useState({
        name: 'Acme Corporation',
        email: 'contact@acmecorp.com',
        phone: '+1 (555) 123-4567',
        website: 'https://www.acmecorp.com',
        address: '123 Business Street, Suite 100',
        city: 'San Francisco',
        state: 'CA',
        zip: '94107',
        country: 'United States',
        description: 'Acme Corporation is a fictional company that manufactures everything from portable holes to rocket-powered products.',
        founded: '1952',
        employees: '500-1000',
        industry: 'Manufacturing, Technology'
    });

    // Logo and Brand Colors
    const [brandAssets, setBrandAssets] = useState({
        primaryColor: '#4f46e5',
        secondaryColor: '#8b5cf6',
        logoUrl: 'https://via.placeholder.com/150',
        bannerUrl: 'https://via.placeholder.com/800x200'
    });

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        reviewAlerts: true,
        productQuestions: true,
        weeklyReports: true,
        marketingUpdates: false,
        criticalIssues: true
    });

    // Privacy and Data Settings
    const [privacySettings, setPrivacySettings] = useState({
        dataSharing: false,
        analyticsConsent: true,
        marketingConsent: false,
        thirdPartySharing: false
    });

    // Data Export and Account Management
    const [dataSettings, setDataSettings] = useState({
        dataRetention: '1 year'
    });

    // Security Settings State
    const [securitySettings, setSecuritySettings] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        newEmail: '',
        verificationCode: '',
        twoFactorEnabled: false,
        recoveryCodesGenerated: false
    });

    // Community Settings State
    const [communitySettings, setCommunitySettings] = useState({
        communityName: 'Acme Community',
        communityDescription: 'Official community for Acme Corporation customers and enthusiasts.',
        isPublic: true,
        allowGuestViewing: true,
        requireApproval: false,
        allowUserPosts: true,
        allowUserComments: true,
        allowPolls: true,
        communityTags: ['Product Discussions', 'Support', 'Announcements', 'General'],
        newTag: '',
        moderators: [
            { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Moderator' }
        ],
        rules: [
            'Be respectful and kind to other members',
            'No spam or self-promotion',
            'Stay on topic in discussions',
            'No offensive language or content'
        ],
        newRule: '',
        newModeratorEmail: '',
        autoModeration: true,
        keywordFilters: 'spam, scam, offensive, inappropriate'
    });

    // Tab data for easier rendering
    const tabs = [
        { id: 'brand-info', label: 'Brand Information', icon: Building },
        { id: 'brand-assets', label: 'Brand Assets', icon: ImageIcon },
        { id: 'community', label: 'Community', icon: Users },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy & Data', icon: Shield },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'account', label: 'Account', icon: User }
    ];

    // Handle input changes for brand info form
    const handleBrandInfoChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBrandInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle checkbox changes for notification settings
    const handleNotificationChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setNotificationSettings(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    // Handle checkbox changes for privacy settings
    const handlePrivacyChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setPrivacySettings(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    // Handle color picker changes
    const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBrandAssets(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle data retention setting
    const handleDataRetentionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setDataSettings(prev => ({
            ...prev,
            dataRetention: e.target.value
        }));
    };

    // Handle security settings change
    const handleSecurityChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSecuritySettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Change password function
    const handleChangePassword = () => {
        if (securitySettings.newPassword !== securitySettings.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        // In a real app, you would validate the current password and update the password
        alert('Password changed successfully!');
        setSecuritySettings(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }));
    };

    // Change email function
    const handleChangeEmail = () => {
        // In a real app, you would send a verification code to the new email
        alert('Verification code sent to your new email address');
    };

    // Verify email code
    const handleVerifyEmail = () => {
        // In a real app, you would verify the code and update the email
        alert('Email updated successfully!');
        setSecuritySettings(prev => ({
            ...prev,
            newEmail: '',
            verificationCode: ''
        }));
    };

    // Toggle 2FA
    const handleToggle2FA = () => {
        // In a real app, you would enable/disable 2FA and generate recovery codes
        setSecuritySettings(prev => ({
            ...prev,
            twoFactorEnabled: !prev.twoFactorEnabled,
            recoveryCodesGenerated: prev.twoFactorEnabled ? false : prev.recoveryCodesGenerated
        }));

        if (!securitySettings.twoFactorEnabled) {
            alert('Two-factor authentication enabled. Please set up your authenticator app with the provided QR code.');
        } else {
            alert('Two-factor authentication disabled.');
        }
    };

    // Generate recovery codes
    const handleGenerateRecoveryCodes = () => {
        // In a real app, you would generate and display recovery codes
        setSecuritySettings(prev => ({
            ...prev,
            recoveryCodesGenerated: true
        }));
        alert('Recovery codes generated. Please save these codes in a safe place.');
    };

    // Save settings
    const handleSave = () => {
        // In a real app, you'd send the updated settings to your backend here
        alert('Settings saved successfully!');
    };

    // Reset account (mock function)
    const handleReset = () => {
        if (confirm('Are you sure you want to reset your account settings? This cannot be undone.')) {
            alert('Account settings have been reset to default.');
        }
    };

    // Export data (mock function)
    const handleExportData = () => {
        alert('Your data export has been initiated. You will receive a download link via email shortly.');
    };

    // Handle community settings change
    const handleCommunityChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setCommunitySettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    // Add new community tag
    const handleAddTag = () => {
        if (communitySettings.newTag.trim() !== '') {
            setCommunitySettings(prev => ({
                ...prev,
                communityTags: [...prev.communityTags, prev.newTag.trim()],
                newTag: ''
            }));
        }
    };

    // Remove community tag
    const handleRemoveTag = (tagToRemove: string) => {
        setCommunitySettings(prev => ({
            ...prev,
            communityTags: prev.communityTags.filter(tag => tag !== tagToRemove)
        }));
    };

    // Add new community rule
    const handleAddRule = () => {
        if (communitySettings.newRule.trim() !== '') {
            setCommunitySettings(prev => ({
                ...prev,
                rules: [...prev.rules, prev.newRule.trim()],
                newRule: ''
            }));
        }
    };

    // Remove community rule
    const handleRemoveRule = (index: number) => {
        setCommunitySettings(prev => ({
            ...prev,
            rules: prev.rules.filter((_, i) => i !== index)
        }));
    };

    // Add new moderator
    const handleAddModerator = () => {
        if (communitySettings.newModeratorEmail.trim() !== '') {
            // In a real app, you would validate the email and invite the user
            const newModerator = {
                id: Math.random().toString(36).substr(2, 9),
                name: 'New Moderator',
                email: communitySettings.newModeratorEmail,
                role: 'Moderator'
            };

            setCommunitySettings(prev => ({
                ...prev,
                moderators: [...prev.moderators, newModerator],
                newModeratorEmail: ''
            }));

            alert(`Invitation sent to ${communitySettings.newModeratorEmail}`);
        }
    };

    // Remove moderator
    const handleRemoveModerator = (id: string) => {
        setCommunitySettings(prev => ({
            ...prev,
            moderators: prev.moderators.filter(mod => mod.id !== id)
        }));
    };

    // Handle tab selection and close mobile menu
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="flex-1 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Main Content - 12 Column Grid */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Sidebar - 3 Columns */}
                    <div className="col-span-12 md:col-span-3 lg:col-span-3">
                        <BrandTabs />
                    </div>

                    {/* Main Content - 9 Columns */}
                    <div className="col-span-12 md:col-span-9 lg:col-span-9">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Brand Settings</h1>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </button>
                            </div>

                            {/* Settings Navigation Tabs - Mobile responsive version */}
                            <div className="border-b border-gray-200 mb-6">
                                {/* Mobile dropdown menu */}
                                <div className="md:hidden mb-4 relative">
                                    <button
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        aria-expanded={isMobileMenuOpen}
                                    >
                    <span className="flex items-center">
                      {tabs.find(tab => tab.id === activeTab)?.icon && (
                          <span className="mr-2">
                          {React.createElement(tabs.find(tab => tab.id === activeTab)?.icon as React.ElementType, { size: 16 })}
                        </span>
                      )}
                        {tabs.find(tab => tab.id === activeTab)?.label}
                    </span>
                                        <ChevronDown className={`h-5 w-5 transition-transform ${isMobileMenuOpen ? 'transform rotate-180' : ''}`} />
                                    </button>

                                    {isMobileMenuOpen && (
                                        <div className="mt-2 py-1 bg-white rounded-md shadow-lg absolute z-10 left-0 right-0 border border-gray-200 max-h-80 overflow-y-auto">
                                            {tabs.map(tab => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => handleTabChange(tab.id)}
                                                    className={`w-full text-left px-4 py-2 flex items-center ${
                                                        activeTab === tab.id
                                                            ? 'bg-indigo-50 text-indigo-600'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {React.createElement(tab.icon, { size: 16, className: "mr-2" })}
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Desktop and tablet horizontal tabs - now with overflow scroll on small screens */}
                                <div className="hidden md:block">
                                    <nav className="-mb-px flex overflow-x-auto pb-1 scrollbar-hide" style={{
                                        msOverflowStyle: 'none', /* IE and Edge */
                                        scrollbarWidth: 'none' /* Firefox */
                                    }}>
                                        {tabs.map(tab => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm flex items-center flex-shrink-0 mr-8 ${
                                                    activeTab === tab.id
                                                        ? 'border-indigo-500 text-indigo-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                {React.createElement(tab.icon, { size: 16, className: "mr-2" })}
                                                {tab.label}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {/* Conditionally render section based on active tab */}
                            {activeTab === 'brand-info' && (
                                <section id="brand-info" className="mb-10">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <Building className="h-5 w-5 mr-2 text-indigo-500" />
                                        Brand Information
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Update your brand's basic information. This information will be displayed publicly on your brand profile.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                Brand Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={brandInfo.name}
                                                onChange={handleBrandInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Business Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={brandInfo.email}
                                                onChange={handleBrandInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                Business Phone
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={brandInfo.phone}
                                                onChange={handleBrandInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                                                Website URL
                                            </label>
                                            <input
                                                type="url"
                                                id="website"
                                                name="website"
                                                value={brandInfo.website}
                                                onChange={handleBrandInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                                Business Address
                                            </label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={brandInfo.address}
                                                onChange={handleBrandInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                value={brandInfo.city}
                                                onChange={handleBrandInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                                State/Province
                                            </label>
                                            <input
                                                type="text"
                                                id="state"
                                                name="state"
                                                value={brandInfo.state}
                                                onChange={handleBrandInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                                                ZIP/Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                id="zip"
                                                name="zip"
                                                value={brandInfo.zip}
                                                onChange={handleBrandInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                id="country"
                                                name="country"
                                                value={brandInfo.country}
                                                onChange={handleBrandInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                                Brand Description
                                            </label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                rows={4}
                                                value={brandInfo.description}
                                                onChange={handleBrandInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="founded" className="block text-sm font-medium text-gray-700 mb-1">
                                                Year Founded
                                            </label>
                                            <input
                                                type="text"
                                                id="founded"
                                                name="founded"
                                                value={brandInfo.founded}
                                                onChange={handleBrandInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="employees" className="block text-sm font-medium text-gray-700 mb-1">
                                                Number of Employees
                                            </label>
                                            <select
                                                id="employees"
                                                name="employees"
                                                value={brandInfo.employees}
                                                onChange={handleBrandInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                <option value="1-10">1-10</option>
                                                <option value="11-50">11-50</option>
                                                <option value="51-200">51-200</option>
                                                <option value="201-500">201-500</option>
                                                <option value="500-1000">500-1000</option>
                                                <option value="1000+">1000+</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                                                Industry
                                            </label>
                                            <input
                                                type="text"
                                                id="industry"
                                                name="industry"
                                                value={brandInfo.industry}
                                                onChange={handleBrandInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Enter your primary industry and any secondary industries, separated by commas.
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'brand-assets' && (
                                <section id="brand-assets" className="mb-10">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <ImageIcon className="h-5 w-5 mr-2 text-indigo-500" />
                                        Brand Assets
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Upload your brand logo, banner image, and set your brand colors.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 flex flex-col md:flex-row items-start gap-6">
                                            <div className="w-full md:w-1/2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Brand Logo
                                                </label>
                                                <div className="flex items-center justify-center bg-gray-50 border-2 border-gray-300 border-dashed rounded-lg p-6 mb-2">
                                                    <div className="space-y-1 text-center">
                                                        <img
                                                            src={brandAssets.logoUrl}
                                                            alt="Brand Logo"
                                                            className="mx-auto h-32 w-32 object-contain"
                                                        />
                                                        <div className="flex justify-center mt-4">
                                                            <button type="button" className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                                Change Logo
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    Recommended size: 400x400px. JPG, PNG or SVG.
                                                </p>
                                            </div>

                                            <div className="w-full md:w-1/2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Brand Banner
                                                </label>
                                                <div className="flex items-center justify-center bg-gray-50 border-2 border-gray-300 border-dashed rounded-lg p-6 mb-2">
                                                    <div className="space-y-1 text-center">
                                                        <img
                                                            src={brandAssets.bannerUrl}
                                                            alt="Brand Banner"
                                                            className="mx-auto h-32 w-full object-cover rounded"
                                                        />
                                                        <div className="flex justify-center mt-4">
                                                            <button type="button" className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                                Change Banner
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    Recommended size: 1200x300px. JPG or PNG.
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Primary Brand Color
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="color"
                                                    id="primaryColor"
                                                    name="primaryColor"
                                                    value={brandAssets.primaryColor}
                                                    onChange={handleColorChange}
                                                    className="h-10 w-10 border border-gray-300 rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={brandAssets.primaryColor}
                                                    onChange={handleColorChange}
                                                    name="primaryColor"
                                                    className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                                <p className="text-sm text-gray-500">Used for main brand elements</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Secondary Brand Color
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="color"
                                                    id="secondaryColor"
                                                    name="secondaryColor"
                                                    value={brandAssets.secondaryColor}
                                                    onChange={handleColorChange}
                                                    className="h-10 w-10 border border-gray-300 rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={brandAssets.secondaryColor}
                                                    onChange={handleColorChange}
                                                    name="secondaryColor"
                                                    className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                                <p className="text-sm text-gray-500">Used for accents and highlights</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'community' && (
                                <section id="community" className="mb-10">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <Users className="h-5 w-5 mr-2 text-indigo-500" />
                                        Community Management
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Manage your brand's community settings, rules, and moderators. Build a thriving community around your products and services.
                                    </p>

                                    {/* Community Profile */}
                                    <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
                                        <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                                            <Building className="h-4 w-4 mr-2 text-indigo-500" />
                                            Community Profile
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="communityName" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Community Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="communityName"
                                                    name="communityName"
                                                    value={communitySettings.communityName}
                                                    onChange={handleCommunityChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="communityDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Community Description
                                                </label>
                                                <textarea
                                                    id="communityDescription"
                                                    name="communityDescription"
                                                    rows={3}
                                                    value={communitySettings.communityDescription}
                                                    onChange={handleCommunityChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Community Rules */}
                                    <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
                                        <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                                            <CheckSquare className="h-4 w-4 mr-2 text-indigo-500" />
                                            Community Rules
                                        </h3>

                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-600">
                                                Define rules that members must follow to participate in your community.
                                            </p>

                                            <ul className="space-y-2 mb-4">
                                                {communitySettings.rules.map((rule, index) => (
                                                    <li key={index} className="flex items-start justify-between bg-gray-50 p-3 rounded-md">
                                                        <div className="flex items-start space-x-2">
                                                            <span className="text-indigo-600 font-medium text-sm">{index + 1}.</span>
                                                            <span className="text-sm text-gray-700">{rule}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveRule(index)}
                                                            className="text-red-500 hover:text-red-700 text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="flex space-x-2">
                                                <input
                                                    type="text"
                                                    id="newRule"
                                                    name="newRule"
                                                    value={communitySettings.newRule}
                                                    onChange={handleCommunityChange}
                                                    placeholder="Add a new rule..."
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                                <button
                                                    onClick={handleAddRule}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                >
                                                    Add Rule
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Community Tags */}
                                    <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
                                        <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                                            <Tag className="h-4 w-4 mr-2 text-indigo-500" />
                                            Community Tags & Categories
                                        </h3>

                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-600">
                                                Tags help organize discussions and make content discoverable.
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {communitySettings.communityTags.map((tag, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
                                                    >
                                                        {tag}
                                                        <button
                                                            onClick={() => handleRemoveTag(tag)}
                                                            className="ml-2 text-indigo-500 hover:text-indigo-700"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex space-x-2">
                                                <input
                                                    type="text"
                                                    id="newTag"
                                                    name="newTag"
                                                    value={communitySettings.newTag}
                                                    onChange={handleCommunityChange}
                                                    placeholder="Add a new tag..."
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                                <button
                                                    onClick={handleAddTag}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                >
                                                    Add Tag
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Community Permissions */}
                                    <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
                                        <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                                            <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                                            Community Permissions
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-800">Public Community</h4>
                                                    <p className="text-xs text-gray-500">Make your community visible to everyone</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="isPublic"
                                                        name="isPublic"
                                                        checked={communitySettings.isPublic}
                                                        onChange={handleCommunityChange}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-800">Allow Guest Viewing</h4>
                                                    <p className="text-xs text-gray-500">Let non-members view community content</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="allowGuestViewing"
                                                        name="allowGuestViewing"
                                                        checked={communitySettings.allowGuestViewing}
                                                        onChange={handleCommunityChange}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-800">Require Membership Approval</h4>
                                                    <p className="text-xs text-gray-500">Manually approve new member requests</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="requireApproval"
                                                        name="requireApproval"
                                                        checked={communitySettings.requireApproval}
                                                        onChange={handleCommunityChange}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-800">Allow User Posts</h4>
                                                    <p className="text-xs text-gray-500">Let members create new posts in your community</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="allowUserPosts"
                                                        name="allowUserPosts"
                                                        checked={communitySettings.allowUserPosts}
                                                        onChange={handleCommunityChange}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-800">Allow User Comments</h4>
                                                    <p className="text-xs text-gray-500">Let members comment on posts</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="allowUserComments"
                                                        name="allowUserComments"
                                                        checked={communitySettings.allowUserComments}
                                                        onChange={handleCommunityChange}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-800">Allow Polls</h4>
                                                    <p className="text-xs text-gray-500">Let members create and vote on polls</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="allowPolls"
                                                        name="allowPolls"
                                                        checked={communitySettings.allowPolls}
                                                        onChange={handleCommunityChange}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Moderation */}
                                    <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
                                        <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                                            <FileWarning className="h-4 w-4 mr-2 text-indigo-500" />
                                            Content Moderation
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-800">Auto-Moderation</h4>
                                                    <p className="text-xs text-gray-500">Automatically filter content based on keywords</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="autoModeration"
                                                        name="autoModeration"
                                                        checked={communitySettings.autoModeration}
                                                        onChange={handleCommunityChange}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    />
                                                </div>
                                            </div>

                                            {communitySettings.autoModeration && (
                                                <div>
                                                    <label htmlFor="keywordFilters" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Keyword Filters (comma-separated)
                                                    </label>
                                                    <textarea
                                                        id="keywordFilters"
                                                        name="keywordFilters"
                                                        rows={2}
                                                        value={communitySettings.keywordFilters}
                                                        onChange={handleCommunityChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Content containing these keywords will be automatically flagged for review.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Moderators */}
                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                        <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                                            <UserPlus className="h-4 w-4 mr-2 text-indigo-500" />
                                            Community Moderators
                                        </h3>

                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-600 mb-2">
                                                Invite trusted people to help moderate your community.
                                            </p>

                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Name
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Email
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Role
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                    {communitySettings.moderators.map((moderator) => (
                                                        <tr key={moderator.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {moderator.name}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {moderator.email}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      moderator.role === 'Admin'
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {moderator.role}
                                  </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {moderator.role !== 'Admin' && (
                                                                    <button
                                                                        onClick={() => handleRemoveModerator(moderator.id)}
                                                                        className="text-red-500 hover:text-red-700 mr-3"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                )}
                                                                <button className="text-indigo-600 hover:text-indigo-900">
                                                                    Edit
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="mt-6">
                                                <h4 className="text-sm font-medium text-gray-800 mb-2">Invite New Moderator</h4>
                                                <div className="flex space-x-2">
                                                    <input
                                                        type="email"
                                                        id="newModeratorEmail"
                                                        name="newModeratorEmail"
                                                        value={communitySettings.newModeratorEmail}
                                                        onChange={handleCommunityChange}
                                                        placeholder="Email address"
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                    <button
                                                        onClick={handleAddModerator}
                                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                    >
                                                        Send Invite
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'notifications' && (
                                <section id="notifications" className="mb-10">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <Bell className="h-5 w-5 mr-2 text-indigo-500" />
                                        Notification Settings
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Configure which notifications you receive and how they're delivered.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-800">Email Notifications</h3>
                                                <p className="text-xs text-gray-500">Receive all notifications via email</p>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="emailNotifications"
                                                    name="emailNotifications"
                                                    checked={notificationSettings.emailNotifications}
                                                    onChange={handleNotificationChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-800">Review Alerts</h3>
                                                <p className="text-xs text-gray-500">Get notified when you receive a new review</p>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="reviewAlerts"
                                                    name="reviewAlerts"
                                                    checked={notificationSettings.reviewAlerts}
                                                    onChange={handleNotificationChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-800">Product Questions</h3>
                                                <p className="text-xs text-gray-500">Get notified when customers ask questions about your products</p>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="productQuestions"
                                                    name="productQuestions"
                                                    checked={notificationSettings.productQuestions}
                                                    onChange={handleNotificationChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-800">Weekly Reports</h3>
                                                <p className="text-xs text-gray-500">Receive a weekly summary of your brand performance</p>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="weeklyReports"
                                                    name="weeklyReports"
                                                    checked={notificationSettings.weeklyReports}
                                                    onChange={handleNotificationChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-800">Marketing Updates</h3>
                                                <p className="text-xs text-gray-500">Receive marketing tips and platform updates</p>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="marketingUpdates"
                                                    name="marketingUpdates"
                                                    checked={notificationSettings.marketingUpdates}
                                                    onChange={handleNotificationChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-800">Critical Issues</h3>
                                                <p className="text-xs text-gray-500">Get immediate notifications for urgent issues</p>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="criticalIssues"
                                                    name="criticalIssues"
                                                    checked={notificationSettings.criticalIssues}
                                                    onChange={handleNotificationChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'privacy' && (
                                <section id="privacy" className="mb-10">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <Shield className="h-5 w-5 mr-2 text-indigo-500" />
                                        Privacy & Data Settings
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Control how your data is used and shared on the platform.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-800">Analytics Consent</h3>
                                                <p className="text-xs text-gray-500">Allow us to collect anonymous usage data to improve our services</p>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="analyticsConsent"
                                                    name="analyticsConsent"
                                                    checked={privacySettings.analyticsConsent}
                                                    onChange={handlePrivacyChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-800">Marketing Consent</h3>
                                                <p className="text-xs text-gray-500">Allow us to use your data for personalized marketing</p>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="marketingConsent"
                                                    name="marketingConsent"
                                                    checked={privacySettings.marketingConsent}
                                                    onChange={handlePrivacyChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-800">Third-Party Data Sharing</h3>
                                                <p className="text-xs text-gray-500">Allow sharing your data with trusted third parties</p>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="thirdPartySharing"
                                                    name="thirdPartySharing"
                                                    checked={privacySettings.thirdPartySharing}
                                                    onChange={handlePrivacyChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <h3 className="text-sm font-medium text-gray-800 mb-3">Data Retention Period</h3>
                                            <select
                                                id="dataRetention"
                                                name="dataRetention"
                                                value={dataSettings.dataRetention}
                                                onChange={handleDataRetentionChange}
                                                className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                <option value="90days">90 days</option>
                                                <option value="6months">6 months</option>
                                                <option value="1year">1 year</option>
                                                <option value="2years">2 years</option>
                                                <option value="indefinite">Indefinite</option>
                                            </select>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Choose how long we retain your data after account closure.
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'security' && (
                                <section id="security" className="mb-10">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <Lock className="h-5 w-5 mr-2 text-indigo-500" />
                                        Security Settings
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Manage your account security settings, passwords, and two-factor authentication.
                                    </p>

                                    {/* Password Change */}
                                    <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
                                        <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                                            <Key className="h-4 w-4 mr-2 text-indigo-500" />
                                            Change Password
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="currentPassword"
                                                    name="currentPassword"
                                                    value={securitySettings.currentPassword}
                                                    onChange={handleSecurityChange}
                                                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="newPassword"
                                                    name="newPassword"
                                                    value={securitySettings.newPassword}
                                                    onChange={handleSecurityChange}
                                                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    value={securitySettings.confirmPassword}
                                                    onChange={handleSecurityChange}
                                                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div>
                                                <button
                                                    onClick={handleChangePassword}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                >
                                                    Update Password
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Change */}
                                    <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
                                        <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                                            <Mail className="h-4 w-4 mr-2 text-indigo-500" />
                                            Change Email Address
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                                    New Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="newEmail"
                                                    name="newEmail"
                                                    value={securitySettings.newEmail}
                                                    onChange={handleSecurityChange}
                                                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div>
                                                <button
                                                    onClick={handleChangeEmail}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                >
                                                    Send Verification Code
                                                </button>
                                            </div>

                                            {securitySettings.newEmail && (
                                                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        Please enter the verification code sent to your new email address.
                                                    </p>
                                                    <div className="flex space-x-3">
                                                        <input
                                                            type="text"
                                                            id="verificationCode"
                                                            name="verificationCode"
                                                            value={securitySettings.verificationCode}
                                                            onChange={handleSecurityChange}
                                                            placeholder="000000"
                                                            className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        />
                                                        <button
                                                            onClick={handleVerifyEmail}
                                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        >
                                                            Verify
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Two-Factor Authentication */}
                                    <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-md font-medium text-gray-800 flex items-center">
                                                <Smartphone className="h-4 w-4 mr-2 text-indigo-500" />
                                                Two-Factor Authentication (2FA)
                                            </h3>
                                            <div className="flex items-center">
                        <span className="mr-3 text-sm text-gray-600">
                          {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                                                <button
                                                    onClick={handleToggle2FA}
                                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                                        securitySettings.twoFactorEnabled
                                                            ? 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500'
                                                            : 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500'
                                                    }`}
                                                >
                                                    {securitySettings.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-4">
                                            Two-factor authentication adds an extra layer of security to your account.
                                            When enabled, you'll need to provide a code from your phone in addition to your password when signing in.
                                        </p>

                                        {securitySettings.twoFactorEnabled && (
                                            <div className="mt-4">
                                                <div className="bg-gray-50 p-4 rounded-md mb-4">
                                                    <h4 className="text-sm font-medium text-gray-800 mb-2">Authentication App</h4>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        Scan the QR code below with your authentication app (like Google Authenticator, Authy, or Microsoft Authenticator).
                                                    </p>
                                                    <div className="bg-white p-4 border border-gray-200 rounded-md inline-block">
                                                        {/* Placeholder for QR code - in a real app you would generate this */}
                                                        <div className="w-40 h-40 bg-gray-200 flex items-center justify-center">
                                                            <span className="text-xs text-gray-500">QR Code Placeholder</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <h4 className="text-sm font-medium text-gray-800 mb-2">Recovery Codes</h4>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        Recovery codes can be used to access your account if you lose your phone or cannot access your authenticator app.
                                                    </p>

                                                    {securitySettings.recoveryCodesGenerated ? (
                                                        <div className="bg-gray-50 p-4 rounded-md mb-4">
                                                            <p className="text-sm font-medium text-gray-800 mb-2">Save these recovery codes:</p>
                                                            <div className="bg-white p-3 border border-gray-200 rounded-md font-mono text-sm">
                                                                ABCD-EFGH-IJKL<br />
                                                                MNOP-QRST-UVWX<br />
                                                                YZAB-CDEF-GHIJ<br />
                                                                KLMN-OPQR-STUV<br />
                                                                WXYZ-1234-5678
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-2">
                                                                Keep these codes in a safe place. Each code can only be used once.
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={handleGenerateRecoveryCodes}
                                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                                        >
                                                            Generate Recovery Codes
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Login History */}
                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                        <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                                            <FileText className="h-4 w-4 mr-2 text-indigo-500" />
                                            Recent Login Activity
                                        </h3>

                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date & Time
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        IP Address
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Location
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Device
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        Today, 10:15 AM
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        192.168.1.1
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        New York, USA
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        Chrome on macOS
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Successful
                              </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        Yesterday, 6:30 PM
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        192.168.1.1
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        New York, USA
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        Safari on iPhone
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Successful
                              </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        Aug 15, 2023, 3:45 PM
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        192.168.1.2
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        London, UK
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        Firefox on Windows
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Failed
                              </span>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'account' && (
                                <section id="account" className="mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <User className="h-5 w-5 mr-2 text-indigo-500" />
                                        Account Management
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Manage your account settings and data export options.
                                    </p>

                                    <div className="space-y-6">
                                        {/*<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">*/}
                                        {/*    <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center">*/}
                                        {/*        <FileText className="h-4 w-4 mr-2 text-indigo-500" />*/}
                                        {/*        Export Account Data*/}
                                        {/*    </h3>*/}
                                        {/*    <p className="text-xs text-gray-500 mb-4">*/}
                                        {/*        Download a copy of all your brand data, including reviews, product information, and analytics.*/}
                                        {/*    </p>*/}
                                        {/*    <button*/}
                                        {/*        onClick={handleExportData}*/}
                                        {/*        className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"*/}
                                        {/*    >*/}
                                        {/*        Export Data*/}
                                        {/*    </button>*/}
                                        {/*</div>*/}

                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                                                <RefreshCw className="h-4 w-4 mr-2 text-amber-500" />
                                                Reset Account Settings
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-4">
                                                Reset all your account settings to default values. This won't delete any of your data.
                                            </p>
                                            <button
                                                onClick={handleReset}
                                                className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                            >
                                                Reset Settings
                                            </button>
                                        </div>

                                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                            <h3 className="text-sm font-medium text-red-800 mb-2 flex items-center">
                                                <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                                                Danger Zone
                                            </h3>
                                            <p className="text-xs text-red-700 mb-4">
                                                These actions are irreversible. Please proceed with caution.
                                            </p>
                                            <div className="flex space-x-4">
                                                <button className="px-3 py-2 bg-white border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                                    Delete Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 