// "use client";
// import {
//     fetchExploreCommunities,
//     setCommunityJoinOrLeave,
// } from "@/store/slices/communityGroupsSlice";
// import {
//     getProfile,
//     selectUserProfile,
//     setProfile,
//     setProfilePrivacy,
//     setProfileSecurity,
// } from "@/store/slices/usersProfileSlice";
// import { Dialog, Transition } from "@headlessui/react";
// import {
//     AlertOctagon,
//     Camera,
//     CheckCircle2,
//     Clock,
//     Database,
//     EyeOff,
//     Globe,
//     Lock,
//     LogOut,
//     MessageSquare,
//     Shield,
//     Smartphone,
//     Trash2,
//     Upload,
//     Users,
//     X,
// } from "lucide-react";
// import { Fragment, useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import {useRouter} from "next/navigation";
// import {AppDispatch} from "@/store";
// import {forgotChangePassword} from "@/store/slices/usersAuthSlice";
//
// export default function UserProfileSettings({
//                                                 isOpen,
//                                                 onClose,
//                                                 userCommunityList,
//                                             }: any) {
//     const [popularCommunity, setPopularCommunity] = useState([]);
//     const userProfileData = useSelector(selectUserProfile);
//     const communityExploreData = useSelector(
//         (state: any) => state.communityGroups.communityExploreCommunitiesData
//     );
//     const router=useRouter();
//     const dispatch = useDispatch<AppDispatch>();
//     const getCommunityColor = (communityId: string, style?: string) => {
//         const colors = [
//             "red",
//             "green",
//             "indigo",
//             "yellow",
//             "purple",
//             "pink",
//             "blue",
//             "teal",
//         ];
//         const colorIndex = parseInt(communityId) % colors.length;
//         return colors[colorIndex];
//     };
//     const fetchPopularCommunities = async () => {
//         try {
//             await dispatch(fetchExploreCommunities({ limit: 4, project: {} }));
//         } catch (error) {
//             console.error("Error fetching popular communities:", error);
//         }
//     };
//
//     const handleEditUserInformation = async () => {
//         try {
//             let result;
//
//             switch (activeSection) {
//                 case "profile":
//                     result = await dispatch(
//                         setProfile({
//                             user_fullname: profileForm.name,
//                             user_bio: profileForm.bio,
//                             user_live_in: profileForm.location,
//                             // Profil resmi varsa ekle (file upload için ayrı işlem gerekebilir)
//                             project: {},
//                         })
//                     );
//                     break;
//
//                 case "security":
//                     const securityData: any = {
//                         notification_receive_message:
//                             userProfileData?.data?.notification_receive_message || "1",
//                         notification_review_comment:
//                             userProfileData?.data?.notification_review_comment || "1",
//                         notification_favorite_share:
//                             userProfileData?.data?.notification_favorite_share || "1",
//                         notification_content_like:
//                             userProfileData?.data?.notification_content_like || "1",
//                         notification_security_account:
//                             userProfileData?.data?.notification_security_account || "1",
//                         project: {},
//                     };
//                     if (
//                         securityForm.currentPassword &&
//                         securityForm.newPassword &&
//                         securityForm.confirmPassword
//                     ) {
//                         if (securityForm.newPassword === securityForm.confirmPassword) {
//                             try {
//                                 const passwordResult = await dispatch(forgotChangePassword({
//                                     user_email: userProfileData?.data?.user_email || profileForm.email,
//                                     user_password: securityForm.newPassword,
//                                     current_password: securityForm.currentPassword,
//                                     project: {}
//                                 }));
//
//                                 if (forgotChangePassword.fulfilled.match(passwordResult)) {
//                                     if (passwordResult.payload.status) {
//                                         toast.success("Password changed successfully!");
//                                         setSecurityForm(prev => ({
//                                             ...prev,
//                                             currentPassword: '',
//                                             newPassword: '',
//                                             confirmPassword: ''
//                                         }));
//                                     } else {
//                                         toast.error('Failed to change password. Please try again or use the \'Forgot Password\' option');
//                                         return;
//                                     }
//                                 } else {
//                                     toast.error("Failed to change password");
//                                     return;
//                                 }
//                             } catch (error) {
//                                 toast.error("An error occurred while changing password");
//                                 return;
//                             }
//                         } else {
//                             toast.error("New passwords do not match!");
//                             return;
//                         }
//                     }
//
//                     result = await dispatch(setProfileSecurity(securityData));
//                     break;
//
//                 case "privacy":
//                     // Gizlilik ayarlarını güncelle
//                     let profileVisibility = "Everyone";
//                     if (privacySettings.profileVisibility === "following") {
//                         profileVisibility = "Following";
//                     } else if (privacySettings.profileVisibility === "private") {
//                         profileVisibility = "Private";
//                     }
//
//                     let contentVisibility = "Everyone";
//                     if (privacySettings.activityVisibility === "following") {
//                         contentVisibility = "Following";
//                     }
//
//                     result = await dispatch(
//                         setProfilePrivacy({
//                             privacy_see_profile: profileVisibility,
//                             privacy_see_content: contentVisibility,
//                             privacy_see_special_ads: privacySettings.dataSharing
//                                 ? "Yes"
//                                 : "No",
//                             privacy_holiday_mode: "No", // Default değer
//                             project: {},
//                         })
//                     );
//                     break;
//
//                 case "notifications":
//                     // Bildirim ayarları (güvenlik altında da gönderiliyor)
//                     result = await dispatch(
//                         setProfileSecurity({
//                             notification_receive_message:
//                                 userProfileData?.data?.notification_receive_message || "1",
//                             notification_review_comment:
//                                 userProfileData?.data?.notification_review_comment || "1",
//                             notification_favorite_share:
//                                 userProfileData?.data?.notification_favorite_share || "1",
//                             notification_content_like:
//                                 userProfileData?.data?.notification_content_like || "1",
//                             notification_security_account:
//                                 userProfileData?.data?.notification_security_account || "1",
//                             project: {},
//                         })
//                     );
//                     break;
//
//                 default:
//                     alert("This section is not yet supported.");
//                     return;
//             }
//
//             // Başarılı ise profili yeniden yükle
//             if (result?.payload?.status) {
//                 toast.success("Profile updated successfully!");
//                 await dispatch(getProfile({ project: {} }));
//                 onClose(); // Modal'ı kapat
//             } else {
//             }
//         } catch (error) {
//             console.log("Update error:", error);
//         }
//     };
//     useEffect(() => {
//         dispatch(getProfile({ project: {} }));
//         fetchPopularCommunities();
//     }, []);
//
//     // userProfileData güncellendiğinde form state'lerini güncelle
//     useEffect(() => {
//         if (userProfileData?.data) {
//             setProfileForm({
//                 name: userProfileData.data.user_fullname || "John Doe",
//                 username: userProfileData.data.user_name || "johndoe",
//                 email: userProfileData.data.user_email || "john.doe@example.com",
//                 bio: userProfileData.data.user_bio || "",
//                 location:
//                     userProfileData.data.user_live_in !== "Unspecified"
//                         ? userProfileData.data.user_live_in
//                         : "London, UK",
//             });
//
//             setPrivacySettings({
//                 profileVisibility:
//                     userProfileData.data.privacy_see_profile?.toLowerCase() === "everyone"
//                         ? "public"
//                         : userProfileData.data.privacy_see_profile?.toLowerCase() ===
//                         "following"
//                             ? "following"
//                             : "private",
//                 messagePrivacy: "following",
//                 activityVisibility:
//                     userProfileData.data.privacy_see_content?.toLowerCase() === "everyone"
//                         ? "everyone"
//                         : "following",
//                 dataSharing: userProfileData.data.privacy_see_special_ads === "Yes",
//                 searchVisibility: true,
//             });
//
//             if (
//                 userProfileData.data.user_profile_image &&
//                 userProfileData.data.user_profile_image !== "default.jpg"
//             ) {
//                 setProfileImage(
//                     userProfileData.data.user_profile_image
//                 );
//             }
//         }
//     }, [userProfileData]);
//     const [activeSection, setActiveSection] = useState("profile");
//     const [profileImage, setProfileImage] = useState(
//         userProfileData?.data?.user_profile_image
//     );
//
//     const menuItems = [
//         { id: "profile", name: "Profile" },
//         { id: "security", name: "Security" },
//         { id: "privacy", name: "Privacy" },
//         { id: "community", name: "Community" },
//         { id: "rank", name: "Rank" },
//         { id: "notifications", name: "Notifications" },
//     ];
//
//     // Profile form state
//     const [profileForm, setProfileForm] = useState({
//         name: "John Doe",
//         username: "johndoe",
//         email: "john.doe@example.com",
//         bio: "Software developer and tech enthusiast. Passionate about creating beautiful user experiences and exploring new technologies.",
//         location: "London, UK",
//     });
//
//     // Security form state
//     const [securityForm, setSecurityForm] = useState({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//     });
//
//     const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
//
//     // Privacy settings state
//     const [privacySettings, setPrivacySettings] = useState({
//         profileVisibility: "public",
//         messagePrivacy: "following",
//         activityVisibility: "everyone",
//         dataSharing: false,
//         searchVisibility: true,
//     });
//
//     const handleProfileChange = (e: { target: { name: any; value: any } }) => {
//         const { name, value } = e.target;
//         setProfileForm((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };
//
//     const handleSecurityChange = (e: { target: { name: any; value: any } }) => {
//         const { name, value } = e.target;
//         setSecurityForm((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };
//
//     // Handle profile image change
//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (event: ProgressEvent<FileReader>) => {
//                 if (event.target?.result) {
//                     setProfileImage(event.target.result as string);
//                 }
//             };
//             reader.readAsDataURL(file);
//         }
//     };
//     // Login sessions from real data
//     const loginSessions = userProfileData?.data?.login_log
//         ?.slice(0, 5)
//         .map((log: any, index: any) => ({
//             id: log.log_id,
//             device: index === 0 ? "MacBook Pro" : `Session ${log.log_id}`,
//             location: "Istanbul, Turkey",
//             ip: "192.168.1." + (index + 1),
//             lastActive: index === 0 ? "Now" : log.created_date,
//             current: index === 0,
//         })) || [
//         {
//             id: 1,
//             device: "MacBook Pro",
//             location: "Istanbul, Turkey",
//             ip: "192.168.1.1",
//             lastActive: "Now",
//             current: true,
//         },
//     ];
//     const handleCommunityJoinLeave = async (communityId: string) => {
//         try {
//             const result = await dispatch(
//                 setCommunityJoinOrLeave({
//                     community_id: communityId,
//                     project: {},
//                 })
//             );
//
//             if (result?.payload?.status) {
//                 // Refresh explore communities after join/leave
//                 await fetchPopularCommunities();
//             }
//         } catch (error) {
//             console.error("Error joining/leaving community:", error);
//         }
//     };
//     // Handle privacy change
//     const handlePrivacyChange = (setting: any, value: any) => {
//         setPrivacySettings((prev) => ({
//             ...prev,
//             [setting]: value,
//         }));
//     };
//
//     // Define the animation styles
//     const animationStyles = `
//     @keyframes titan-pulse {
//       0%, 100% {
//         opacity: 0.8;
//         box-shadow: 0 0 10px 2px rgba(251, 191, 36, 0.7);
//       }
//       50% {
//         opacity: 1;
//         box-shadow: 0 0 15px 4px rgba(251, 191, 36, 0.9);
//       }
//     }
//
//     @keyframes titan-glow {
//       0%, 100% {
//         text-shadow: 0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(251, 191, 36, 0.5);
//       }
//       50% {
//         text-shadow: 0 0 8px rgba(255, 255, 255, 0.9), 0 0 20px rgba(251, 191, 36, 0.8);
//       }
//     }
//
//     @keyframes shine {
//       0% {
//         left: -100%;
//       }
//       100% {
//         left: 100%;
//       }
//     }
//
//     @keyframes rotate {
//       from {
//         transform: rotate(0deg);
//       }
//       to {
//         transform: rotate(360deg);
//       }
//     }
//
//     .titan-text {
//       animation: titan-glow 2s infinite ease-in-out;
//     }
//
//     .titan-star {
//       animation: rotate 4s infinite linear, pulse 2s infinite ease-in-out;
//     }
//
//     .titan-badge {
//       box-shadow: 0 0 15px 2px rgba(251, 191, 36, 0.3);
//     }
//
//     .titan-badge:hover {
//       box-shadow: 0 0 20px 5px rgba(251, 191, 36, 0.5);
//       transform: translateY(-1px) scale(1.03);
//     }
//
//     .animate-titan-pulse {
//       animation: titan-pulse 1.5s infinite ease-in-out;
//     }
//
//     .animate-shine {
//       animation: shine 3s infinite linear;
//     }
//   `;
//
//     return (
//         <Transition show={isOpen} as={Fragment}>
//             <Dialog onClose={onClose} className="relative z-50">
//                 {/* Background overlay */}
//                 <Transition.Child
//                     as={Fragment}
//                     enter="ease-out duration-300"
//                     enterFrom="opacity-0"
//                     enterTo="opacity-100"
//                     leave="ease-in duration-200"
//                     leaveFrom="opacity-100"
//                     leaveTo="opacity-0"
//                 >
//                     <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
//                 </Transition.Child>
//
//                 <style
//                     dangerouslySetInnerHTML={{
//                         __html: `
//           ${animationStyles}
//
//           /* Responsive fixes for mobile modal */
//           @media (max-width: 768px) {
//             .modalgrid {
//               display: grid;
//               grid-template-columns: 1fr;
//               gap: 1rem;
//             }
//
//             .modalcard {
//               margin-bottom: 1rem;
//             }
//
//             /* Improve scrolling on mobile */
//             .modal-scroll-container {
//               -webkit-overflow-scrolling: touch;
//               overflow-y: auto;
//             }
//
//             /* Prevent content overflow */
//             .modal-content-wrapper {
//               max-width: 100%;
//               word-break: break-word;
//             }
//
//             /* Better spacing for mobile forms */
//             .form-field-mobile {
//               margin-bottom: 1.25rem;
//             }
//
//             /* Improve mobile touch targets */
//             .mobile-touch-target {
//               min-height: 44px;
//               min-width: 44px;
//             }
//           }
//         `,
//                     }}
//                 />
//
//                 <div className="fixed inset-0 overflow-y-auto">
//                     <div className="flex min-h-full items-center justify-center p-0 sm:p-4">
//                         <Transition.Child
//                             as={Fragment}
//                             enter="ease-out duration-300"
//                             enterFrom="opacity-0 scale-95"
//                             enterTo="opacity-100 scale-100"
//                             leave="ease-in duration-200"
//                             leaveFrom="opacity-100 scale-100"
//                             leaveTo="opacity-0 scale-95"
//                         >
//                             <Dialog.Panel className="w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-6xl transform overflow-hidden sm:rounded-2xl bg-white p-0 sm:p-1 shadow-2xl transition-all">
//                                 <div className="flex flex-col md:flex-row h-full sm:h-[80vh] max-h-screen modal-scroll-container">
//                                     {/* Left Menu - Responsive */}
//                                     <div className="w-full md:w-64 flex-shrink-0 bg-gray-50 p-4 md:p-6 rounded-t-xl md:rounded-t-none md:rounded-l-xl overflow-y-auto md:overflow-y-visible border-b md:border-b-0 md:border-r border-gray-200">
//                                         <div className="flex items-center justify-between mb-4 md:mb-8">
//                                             <h2 className="text-xl font-bold text-gray-900">
//                                                 Profile Settings
//                                             </h2>
//                                             <button
//                                                 type="button"
//                                                 className="rounded-full p-1 text-gray-400 hover:text-gray-500 block md:hidden"
//                                                 onClick={onClose}
//                                             >
//                                                 <X className="h-6 w-6" />
//                                             </button>
//                                         </div>
//
//                                         <nav className="flex overflow-x-auto pb-2 md:block md:overflow-visible md:pb-0 md:space-y-1 hide-scrollbar">
//                                             {menuItems.map((item) => (
//                                                 <button
//                                                     key={item.id}
//                                                     onClick={() => setActiveSection(item.id)}
//                                                     className={`
//                             flex items-center whitespace-nowrap md:whitespace-normal px-3 py-2 md:py-3 text-left rounded-lg
//                             mr-2 md:mr-0 mb-0 md:mb-1 flex-shrink-0 md:flex-shrink-1 md:w-full
//                             ${
//                                                         activeSection === item.id
//                                                             ? "bg-indigo-50 text-indigo-600 font-medium"
//                                                             : "text-gray-700 hover:bg-gray-100"
//                                                     }
//                           `}
//                                                 >
//                           <span className="ml-1 md:ml-3 text-sm md:text-base">
//                             {item.name}
//                           </span>
//                                                 </button>
//                                             ))}
//                                         </nav>
//                                     </div>
//
//                                     {/* Main Content */}
//                                     <div className="flex-1 flex flex-col overflow-hidden">
//                                         {/* Header - Only visible on larger screens */}
//                                         <div className="hidden md:flex px-6 py-4 border-b justify-between items-center">
//                                             <Dialog.Title className="text-lg font-medium text-gray-900">
//                                                 {menuItems.find((item) => item.id === activeSection)
//                                                     ?.name || "Profil"}
//                                             </Dialog.Title>
//                                             <button
//                                                 type="button"
//                                                 className="rounded-full p-1 text-gray-400 hover:text-gray-500"
//                                                 onClick={onClose}
//                                             >
//                                                 <X className="h-6 w-6" />
//                                             </button>
//                                         </div>
//
//                                         {/* Section header - Visible only on mobile */}
//                                         <div className="flex md:hidden px-4 py-3 border-b justify-between items-center bg-gray-50">
//                                             <h3 className="text-base font-medium text-gray-900">
//                                                 {menuItems.find((item) => item.id === activeSection)
//                                                     ?.name || "Profil"}
//                                             </h3>
//                                         </div>
//
//                                         {/* Content */}
//                                         <div className="flex-1 overflow-y-auto p-4 md:p-6 modal-content-wrapper">
//                                             {activeSection === "profile" && (
//                                                 <div className="space-y-6">
//                                                     {/* Profile Picture */}
//                                                     <div className="form-field-mobile">
//                                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                             Profile Picture
//                                                         </label>
//                                                         <div className="flex items-center space-x-5">
//                                                             <div className="relative">
//                                                                 <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-200">
//                                                                     <img
//                                                                         src={profileImage || '/default.jpg'}
//                                                                         alt="Profile"
//                                                                         className="h-full w-full object-cover"
//                                                                     />
//                                                                 </div>
//                                                                 <div className="absolute -bottom-1 -right-1 flex space-x-1">
//                                                                     <label
//                                                                         htmlFor="profile-upload"
//                                                                         className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700 transition-colors"
//                                                                     >
//                                                                         <Camera className="h-4 w-4" />
//                                                                         <input
//                                                                             id="profile-upload"
//                                                                             type="file"
//                                                                             className="hidden"
//                                                                             accept="image/*"
//                                                                             onChange={handleImageChange}
//                                                                         />
//                                                                     </label>
//                                                                 </div>
//                                                             </div>
//                                                             <div>
//                                                                 <p className="text-sm text-gray-500 mb-2">
//                                                                     Upload a high-quality image for your profile
//                                                                     picture.
//                                                                 </p>
//                                                                 <div className="flex gap-2">
//                                                                     <label
//                                                                         htmlFor="profile-file"
//                                                                         className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
//                                                                     >
//                                                                         <Upload className="h-4 w-4 mr-2" />
//                                                                         Upload
//                                                                         <input
//                                                                             id="profile-file"
//                                                                             type="file"
//                                                                             className="hidden"
//                                                                             accept="image/*"
//                                                                             onChange={handleImageChange}
//                                                                         />
//                                                                     </label>
//                                                                     {/*<button*/}
//                                                                     {/*    type="button"*/}
//                                                                     {/*    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none"*/}
//                                                                     {/*    onClick={() =>*/}
//                                                                     {/*        setProfileImage(*/}
//                                                                     {/*            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"*/}
//                                                                     {/*        )*/}
//                                                                     {/*    }*/}
//                                                                     {/*>*/}
//                                                                     {/*    <Trash2 className="h-4 w-4 mr-2" />*/}
//                                                                     {/*    Reset*/}
//                                                                     {/*</button>*/}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Name, Username */}
//                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                                         <div className="space-y-2">
//                                                             <label
//                                                                 htmlFor="name"
//                                                                 className="block text-sm font-medium text-gray-700"
//                                                             >
//                                                                 Full Name
//                                                             </label>
//                                                             <div className="mt-1">
//                                                                 <input
//                                                                     type="text"
//                                                                     name="name"
//                                                                     id="name"
//                                                                     value={profileForm.name}
//                                                                     onChange={handleProfileChange}
//                                                                     className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                         <div className="space-y-2">
//                                                             <label
//                                                                 htmlFor="username"
//                                                                 className="block text-sm font-medium text-gray-700"
//                                                             >
//                                                                 Username
//                                                             </label>
//                                                             <div className="mt-1">
//                                                                 <div className="flex rounded-md shadow-sm">
//                                   <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
//                                     muscleconnect.com/profile
//                                   </span>
//                                                                     <input
//                                                                         type="text"
//                                                                         name="username"
//                                                                         id="username"
//                                                                         value={profileForm.username}
//                                                                         onChange={handleProfileChange}
//                                                                         className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                                                     />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Email, Location */}
//                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                                         <div className="space-y-2">
//                                                             <label
//                                                                 htmlFor="email"
//                                                                 className="block text-sm font-medium text-gray-700"
//                                                             >
//                                                                 Email Address
//                                                             </label>
//                                                             <input
//                                                                 type="email"
//                                                                 id="email"
//                                                                 name="email"
//                                                                 value={profileForm.email}
//                                                                 onChange={handleProfileChange}
//                                                                 className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border mobile-touch-target"
//                                                             />
//                                                         </div>
//                                                         <div className="space-y-2">
//                                                             <label
//                                                                 htmlFor="location"
//                                                                 className="block text-sm font-medium text-gray-700"
//                                                             >
//                                                                 Location
//                                                             </label>
//                                                             <input
//                                                                 type="text"
//                                                                 id="location"
//                                                                 name="location"
//                                                                 value={profileForm.location}
//                                                                 onChange={handleProfileChange}
//                                                                 className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border mobile-touch-target"
//                                                                 placeholder="City, Country"
//                                                             />
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Bio */}
//                                                     <div className="space-y-2">
//                                                         <label
//                                                             htmlFor="bio"
//                                                             className="block text-sm font-medium text-gray-700"
//                                                         >
//                                                             Bio
//                                                         </label>
//                                                         <textarea
//                                                             id="bio"
//                                                             name="bio"
//                                                             rows={4}
//                                                             value={profileForm.bio}
//                                                             onChange={handleProfileChange}
//                                                             className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
//                                                             placeholder="Write a short bio about yourself..."
//                                                         />
//                                                         <p className="text-sm text-gray-500">
//                                                             Brief description for your profile. Max 160
//                                                             characters.
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             )}
//
//                                             {activeSection === "security" && (
//                                                 <div className="space-y-8">
//                                                     {/* Password Change */}
//                                                     <div className="space-y-4">
//                                                         <div className="flex items-center justify-between">
//                                                             <h3 className="text-lg font-medium text-gray-900">
//                                                                 Change Password
//                                                             </h3>
//                                                             <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full flex items-center">
//                                 <Shield className="w-3.5 h-3.5 mr-1" />
//                                 Secure
//                               </span>
//                                                         </div>
//                                                         <p className="text-sm text-gray-500">
//                                                             It's a good idea to use a strong password that
//                                                             you're not using elsewhere.
//                                                         </p>
//
//                                                         <div className="grid grid-cols-1 gap-4">
//                                                             <div className="space-y-2">
//                                                                 <label
//                                                                     htmlFor="currentPassword"
//                                                                     className="block text-sm font-medium text-gray-700"
//                                                                 >
//                                                                     Current Password
//                                                                 </label>
//                                                                 <input
//                                                                     type="password"
//                                                                     id="currentPassword"
//                                                                     name="currentPassword"
//                                                                     value={securityForm.currentPassword}
//                                                                     onChange={handleSecurityChange}
//                                                                     className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
//                                                                 />
//                                                             </div>
//
//                                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                                 <div className="space-y-2">
//                                                                     <label
//                                                                         htmlFor="newPassword"
//                                                                         className="block text-sm font-medium text-gray-700"
//                                                                     >
//                                                                         New Password
//                                                                     </label>
//                                                                     <input
//                                                                         type="password"
//                                                                         id="newPassword"
//                                                                         name="newPassword"
//                                                                         value={securityForm.newPassword}
//                                                                         onChange={handleSecurityChange}
//                                                                         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
//                                                                     />
//                                                                 </div>
//                                                                 <div className="space-y-2">
//                                                                     <label
//                                                                         htmlFor="confirmPassword"
//                                                                         className="block text-sm font-medium text-gray-700"
//                                                                     >
//                                                                         Confirm New Password
//                                                                     </label>
//                                                                     <input
//                                                                         type="password"
//                                                                         id="confirmPassword"
//                                                                         name="confirmPassword"
//                                                                         value={securityForm.confirmPassword}
//                                                                         onChange={handleSecurityChange}
//                                                                         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
//                                                                     />
//                                                                 </div>
//                                                             </div>
//
//                                                             <div className="mt-1">
//                                                                 <button
//                                                                     type="button"
//                                                                     onClick={handleEditUserInformation}
//                                                                     className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                                                                 >
//                                                                     <Lock className="h-4 w-4 mr-2" />
//                                                                     Update Password
//                                                                 </button>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Divider */}
//                                                     {/*<div className="border-t border-gray-200 my-6"></div>*/}
//
//                                                     {/* Two-Factor Authentication */}
//                               {/*                      <div className="space-y-4">*/}
//                               {/*                          <div className="flex items-center justify-between">*/}
//                               {/*                              <h3 className="text-lg font-medium text-gray-900">*/}
//                               {/*                                  Two-Factor Authentication*/}
//                               {/*                              </h3>*/}
//                               {/*                              <span*/}
//                               {/*                                  className={`text-xs px-2.5 py-1 rounded-full flex items-center ${*/}
//                               {/*                                      twoFactorEnabled*/}
//                               {/*                                          ? "bg-green-50 text-green-600"*/}
//                               {/*                                          : "bg-yellow-50 text-yellow-600"*/}
//                               {/*                                  }`}*/}
//                               {/*                              >*/}
//                               {/*  {twoFactorEnabled ? (*/}
//                               {/*      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />*/}
//                               {/*  ) : (*/}
//                               {/*      <AlertOctagon className="w-3.5 h-3.5 mr-1" />*/}
//                               {/*  )}*/}
//                               {/*                                  {twoFactorEnabled ? "Enabled" : "Disabled"}*/}
//                               {/*</span>*/}
//                               {/*                          </div>*/}
//                               {/*                          <p className="text-sm text-gray-500">*/}
//                               {/*                              Add an extra layer of security to your account by*/}
//                               {/*                              requiring more than just a password to sign in.*/}
//                               {/*                          </p>*/}
//
//                               {/*                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">*/}
//                               {/*                              <div className="flex items-start">*/}
//                               {/*                                  <div className="flex-shrink-0 mt-0.5">*/}
//                               {/*                                      <Smartphone className="h-6 w-6 text-gray-400" />*/}
//                               {/*                                  </div>*/}
//                               {/*                                  <div className="ml-3">*/}
//                               {/*                                      <h4 className="text-sm font-medium text-gray-900">*/}
//                               {/*                                          Authenticator App*/}
//                               {/*                                      </h4>*/}
//                               {/*                                      <p className="mt-1 text-xs text-gray-500">*/}
//                               {/*                                          Use an authenticator app like Google*/}
//                               {/*                                          Authenticator, Microsoft Authenticator, or*/}
//                               {/*                                          Authy to get security codes when signing in.*/}
//                               {/*                                      </p>*/}
//                               {/*                                      <div className="mt-3">*/}
//                               {/*                                          <button*/}
//                               {/*                                              type="button"*/}
//                               {/*                                              onClick={() =>*/}
//                               {/*                                                  setTwoFactorEnabled(!twoFactorEnabled)*/}
//                               {/*                                              }*/}
//                               {/*                                              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${*/}
//                               {/*                                                  twoFactorEnabled*/}
//                               {/*                                                      ? "text-red-700 bg-red-50 hover:bg-red-100"*/}
//                               {/*                                                      : "text-indigo-700 bg-indigo-50 hover:bg-indigo-100"*/}
//                               {/*                                              }`}*/}
//                               {/*                                          >*/}
//                               {/*                                              {twoFactorEnabled ? "Disable" : "Enable"}*/}
//                               {/*                                          </button>*/}
//                               {/*                                      </div>*/}
//                               {/*                                  </div>*/}
//                               {/*                              </div>*/}
//                               {/*                          </div>*/}
//                               {/*                      </div>*/}
//
//                                                     {/* Divider */}
//                                                     {/*<div className="border-t border-gray-200 my-6"></div>*/}
//
//                                                     {/* Active Sessions */}
//                                             {/*        <div className="space-y-4">*/}
//                                             {/*            <h3 className="text-lg font-medium text-gray-900">*/}
//                                             {/*                Active Sessions*/}
//                                             {/*            </h3>*/}
//                                             {/*            <p className="text-sm text-gray-500">*/}
//                                             {/*                These are the devices that are currently logged*/}
//                                             {/*                into your account. If you don't recognize a*/}
//                                             {/*                session, sign out of it.*/}
//                                             {/*            </p>*/}
//
//                                             {/*            <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">*/}
//                                             {/*                <table className="min-w-full divide-y divide-gray-300">*/}
//                                             {/*                    <thead className="bg-gray-50">*/}
//                                             {/*                    <tr>*/}
//                                             {/*                        <th*/}
//                                             {/*                            scope="col"*/}
//                                             {/*                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"*/}
//                                             {/*                        >*/}
//                                             {/*                            Device*/}
//                                             {/*                        </th>*/}
//                                             {/*                        <th*/}
//                                             {/*                            scope="col"*/}
//                                             {/*                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"*/}
//                                             {/*                        >*/}
//                                             {/*                            Location*/}
//                                             {/*                        </th>*/}
//                                             {/*                        <th*/}
//                                             {/*                            scope="col"*/}
//                                             {/*                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"*/}
//                                             {/*                        >*/}
//                                             {/*                            Last Active*/}
//                                             {/*                        </th>*/}
//                                             {/*                        <th*/}
//                                             {/*                            scope="col"*/}
//                                             {/*                            className="relative px-6 py-3"*/}
//                                             {/*                        >*/}
//                                             {/*                            <span className="sr-only">Sign Out</span>*/}
//                                             {/*                        </th>*/}
//                                             {/*                    </tr>*/}
//                                             {/*                    </thead>*/}
//                                             {/*                    <tbody className="divide-y divide-gray-200 bg-white">*/}
//                                             {/*                    {loginSessions.map((session:any) => (*/}
//                                             {/*                        <tr*/}
//                                             {/*                            key={session.id}*/}
//                                             {/*                            className={*/}
//                                             {/*                                session.current ? "bg-blue-50" : ""*/}
//                                             {/*                            }*/}
//                                             {/*                        >*/}
//                                             {/*                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">*/}
//                                             {/*                                <div className="flex items-center">*/}
//                                             {/*                                    <div className="h-8 w-8 flex-shrink-0 rounded-md bg-gray-100 flex items-center justify-center">*/}
//                                             {/*                                        {session.device.includes(*/}
//                                             {/*                                            "iPhone"*/}
//                                             {/*                                        ) ? (*/}
//                                             {/*                                            <svg*/}
//                                             {/*                                                xmlns="http://www.w3.org/2000/svg"*/}
//                                             {/*                                                className="h-5 w-5 text-gray-500"*/}
//                                             {/*                                                viewBox="0 0 20 20"*/}
//                                             {/*                                                fill="currentColor"*/}
//                                             {/*                                            >*/}
//                                             {/*                                                <path*/}
//                                             {/*                                                    fillRule="evenodd"*/}
//                                             {/*                                                    d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"*/}
//                                             {/*                                                    clipRule="evenodd"*/}
//                                             {/*                                                />*/}
//                                             {/*                                            </svg>*/}
//                                             {/*                                        ) : (*/}
//                                             {/*                                            <svg*/}
//                                             {/*                                                xmlns="http://www.w3.org/2000/svg"*/}
//                                             {/*                                                className="h-5 w-5 text-gray-500"*/}
//                                             {/*                                                viewBox="0 0 20 20"*/}
//                                             {/*                                                fill="currentColor"*/}
//                                             {/*                                            >*/}
//                                             {/*                                                <path*/}
//                                             {/*                                                    fillRule="evenodd"*/}
//                                             {/*                                                    d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"*/}
//                                             {/*                                                    clipRule="evenodd"*/}
//                                             {/*                                                />*/}
//                                             {/*                                            </svg>*/}
//                                             {/*                                        )}*/}
//                                             {/*                                    </div>*/}
//                                             {/*                                    <div className="ml-4">*/}
//                                             {/*                                        <div className="text-sm font-medium text-gray-900">*/}
//                                             {/*                                            {session.device}*/}
//                                             {/*                                        </div>*/}
//                                             {/*                                        <div className="text-xs text-gray-500">*/}
//                                             {/*                                            {session.ip}*/}
//                                             {/*                                        </div>*/}
//                                             {/*                                    </div>*/}
//                                             {/*                                    {session.current && (*/}
//                                             {/*                                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">*/}
//                                             {/*  Current*/}
//                                             {/*</span>*/}
//                                             {/*                                    )}*/}
//                                             {/*                                </div>*/}
//                                             {/*                            </td>*/}
//                                             {/*                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">*/}
//                                             {/*                                {session.location}*/}
//                                             {/*                            </td>*/}
//                                             {/*                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">*/}
//                                             {/*                                <div className="flex items-center">*/}
//                                             {/*                                    <Clock className="h-4 w-4 mr-1.5 text-gray-400" />*/}
//                                             {/*                                    {session.lastActive}*/}
//                                             {/*                                </div>*/}
//                                             {/*                            </td>*/}
//                                             {/*                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">*/}
//                                             {/*                                {!session.current && (*/}
//                                             {/*                                    <button*/}
//                                             {/*                                        type="button"*/}
//                                             {/*                                        className="inline-flex items-center text-red-600 hover:text-red-900"*/}
//                                             {/*                                    >*/}
//                                             {/*                                        <LogOut className="h-4 w-4 mr-1" />*/}
//                                             {/*                                        Sign Out*/}
//                                             {/*                                    </button>*/}
//                                             {/*                                )}*/}
//                                             {/*                            </td>*/}
//                                             {/*                        </tr>*/}
//                                             {/*                    ))}*/}
//                                             {/*                    </tbody>*/}
//                                             {/*                </table>*/}
//                                             {/*            </div>*/}
//                                             {/*        </div>*/}
//                                                 </div>
//                                             )}
//
//                                             {activeSection === "privacy" && (
//                                                 <div className="space-y-8">
//                                                     {/* Profile Visibility */}
//                                                     <div className="space-y-4">
//                                                         <div className="flex items-center justify-between">
//                                                             <h3 className="text-lg font-medium text-gray-900">
//                                                                 Profile Visibility
//                                                             </h3>
//                                                             <span
//                                                                 className={`text-xs px-2.5 py-1 rounded-full flex items-center ${
//                                                                     privacySettings.profileVisibility === "public"
//                                                                         ? "bg-green-50 text-green-600"
//                                                                         : privacySettings.profileVisibility ===
//                                                                         "following"
//                                                                             ? "bg-blue-50 text-blue-600"
//                                                                             : "bg-gray-50 text-gray-600"
//                                                                 }`}
//                                                             >
//                                 {privacySettings.profileVisibility ===
//                                 "public" ? (
//                                     <Globe className="w-3.5 h-3.5 mr-1" />
//                                 ) : privacySettings.profileVisibility ===
//                                 "following" ? (
//                                     <Users className="w-3.5 h-3.5 mr-1" />
//                                 ) : (
//                                     <Lock className="w-3.5 h-3.5 mr-1" />
//                                 )}
//                                                                 {privacySettings.profileVisibility === "public"
//                                                                     ? "Public"
//                                                                     : privacySettings.profileVisibility ===
//                                                                     "following"
//                                                                         ? "Following Only"
//                                                                         : "Private"}
//                               </span>
//                                                         </div>
//                                                         <p className="text-sm text-gray-500">
//                                                             Control who can see your profile information and
//                                                             activity.
//                                                         </p>
//
//                                                         <div className="space-y-3">
//                                                             <div className="flex items-center">
//                                                                 <input
//                                                                     id="profile-public"
//                                                                     name="profileVisibility"
//                                                                     type="radio"
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                                                                     checked={
//                                                                         privacySettings.profileVisibility ===
//                                                                         "public"
//                                                                     }
//                                                                     onChange={() =>
//                                                                         handlePrivacyChange(
//                                                                             "profileVisibility",
//                                                                             "public"
//                                                                         )
//                                                                     }
//                                                                 />
//                                                                 <label
//                                                                     htmlFor="profile-public"
//                                                                     className="ml-3 block text-sm font-medium text-gray-700"
//                                                                 >
//                                                                     <div className="flex items-center">
//                                                                         <Globe className="w-4 h-4 mr-2 text-gray-500" />
//                                                                         <span>Public</span>
//                                                                     </div>
//                                                                     <p className="text-xs text-gray-500 mt-1 ml-6">
//                                                                         Anyone can view your profile, posts, and
//                                                                         activity
//                                                                     </p>
//                                                                 </label>
//                                                             </div>
//
//                                                             <div className="flex items-center">
//                                                                 <input
//                                                                     id="profile-following"
//                                                                     name="profileVisibility"
//                                                                     type="radio"
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                                                                     checked={
//                                                                         privacySettings.profileVisibility ===
//                                                                         "following"
//                                                                     }
//                                                                     onChange={() =>
//                                                                         handlePrivacyChange(
//                                                                             "profileVisibility",
//                                                                             "following"
//                                                                         )
//                                                                     }
//                                                                 />
//                                                                 <label
//                                                                     htmlFor="profile-following"
//                                                                     className="ml-3 block text-sm font-medium text-gray-700"
//                                                                 >
//                                                                     <div className="flex items-center">
//                                                                         <Users className="w-4 h-4 mr-2 text-gray-500" />
//                                                                         <span>Following Only</span>
//                                                                     </div>
//                                                                     <p className="text-xs text-gray-500 mt-1 ml-6">
//                                                                         Only people you follow can view your full
//                                                                         profile
//                                                                     </p>
//                                                                 </label>
//                                                             </div>
//
//                                                             <div className="flex items-center">
//                                                                 <input
//                                                                     id="profile-private"
//                                                                     name="profileVisibility"
//                                                                     type="radio"
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                                                                     checked={
//                                                                         privacySettings.profileVisibility ===
//                                                                         "private"
//                                                                     }
//                                                                     onChange={() =>
//                                                                         handlePrivacyChange(
//                                                                             "profileVisibility",
//                                                                             "private"
//                                                                         )
//                                                                     }
//                                                                 />
//                                                                 <label
//                                                                     htmlFor="profile-private"
//                                                                     className="ml-3 block text-sm font-medium text-gray-700"
//                                                                 >
//                                                                     <div className="flex items-center">
//                                                                         <Lock className="w-4 h-4 mr-2 text-gray-500" />
//                                                                         <span>Private</span>
//                                                                     </div>
//                                                                     <p className="text-xs text-gray-500 mt-1 ml-6">
//                                                                         Your profile is only visible to you and
//                                                                         selected users
//                                                                     </p>
//                                                                 </label>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Divider */}
//                                                     <div className="border-t border-gray-200 my-6"></div>
//
//                                                     {/* Message Privacy */}
//                                                     <div className="space-y-4">
//                                                         <h3 className="text-lg font-medium text-gray-900">
//                                                             Message Privacy
//                                                         </h3>
//                                                         <p className="text-sm text-gray-500">
//                                                             Control who can send you messages or contact you
//                                                             directly.
//                                                         </p>
//
//                                                         <div className="space-y-3">
//                                                             <div className="flex items-center">
//                                                                 <input
//                                                                     id="message-everyone"
//                                                                     name="messagePrivacy"
//                                                                     type="radio"
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                                                                     checked={
//                                                                         privacySettings.messagePrivacy ===
//                                                                         "everyone"
//                                                                     }
//                                                                     onChange={() =>
//                                                                         handlePrivacyChange(
//                                                                             "messagePrivacy",
//                                                                             "everyone"
//                                                                         )
//                                                                     }
//                                                                 />
//                                                                 <label
//                                                                     htmlFor="message-everyone"
//                                                                     className="ml-3 block text-sm font-medium text-gray-700"
//                                                                 >
//                                                                     <div className="flex items-center">
//                                                                         <Globe className="w-4 h-4 mr-2 text-gray-500" />
//                                                                         <span>Everyone</span>
//                                                                     </div>
//                                                                     <p className="text-xs text-gray-500 mt-1 ml-6">
//                                                                         Anyone can send you messages
//                                                                     </p>
//                                                                 </label>
//                                                             </div>
//
//                                                             <div className="flex items-center">
//                                                                 <input
//                                                                     id="message-following"
//                                                                     name="messagePrivacy"
//                                                                     type="radio"
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                                                                     checked={
//                                                                         privacySettings.messagePrivacy ===
//                                                                         "following"
//                                                                     }
//                                                                     onChange={() =>
//                                                                         handlePrivacyChange(
//                                                                             "messagePrivacy",
//                                                                             "following"
//                                                                         )
//                                                                     }
//                                                                 />
//                                                                 <label
//                                                                     htmlFor="message-following"
//                                                                     className="ml-3 block text-sm font-medium text-gray-700"
//                                                                 >
//                                                                     <div className="flex items-center">
//                                                                         <Users className="w-4 h-4 mr-2 text-gray-500" />
//                                                                         <span>People You Follow</span>
//                                                                     </div>
//                                                                     <p className="text-xs text-gray-500 mt-1 ml-6">
//                                                                         Only people you follow can message you
//                                                                     </p>
//                                                                 </label>
//                                                             </div>
//
//                                                             <div className="flex items-center">
//                                                                 <input
//                                                                     id="message-nobody"
//                                                                     name="messagePrivacy"
//                                                                     type="radio"
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                                                                     checked={
//                                                                         privacySettings.messagePrivacy === "nobody"
//                                                                     }
//                                                                     onChange={() =>
//                                                                         handlePrivacyChange(
//                                                                             "messagePrivacy",
//                                                                             "nobody"
//                                                                         )
//                                                                     }
//                                                                 />
//                                                                 <label
//                                                                     htmlFor="message-nobody"
//                                                                     className="ml-3 block text-sm font-medium text-gray-700"
//                                                                 >
//                                                                     <div className="flex items-center">
//                                                                         <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
//                                                                         <span>Nobody</span>
//                                                                     </div>
//                                                                     <p className="text-xs text-gray-500 mt-1 ml-6">
//                                                                         No one can message you directly
//                                                                     </p>
//                                                                 </label>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Divider */}
//                                                     <div className="border-t border-gray-200 my-6"></div>
//
//                                                     {/* Activity Privacy */}
//                                                     <div className="space-y-4">
//                                                         <h3 className="text-lg font-medium text-gray-900">
//                                                             Activity & Content
//                                                         </h3>
//                                                         <p className="text-sm text-gray-500">
//                                                             Control what information is visible to others and
//                                                             how your content is displayed.
//                                                         </p>
//
//                                                         <div className="space-y-4 mt-4">
//                                                             <div className="flex items-start">
//                                                                 <div className="flex items-center h-5">
//                                                                     <input
//                                                                         id="search-visibility"
//                                                                         name="searchVisibility"
//                                                                         type="checkbox"
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                         checked={privacySettings.searchVisibility}
//                                                                         onChange={(e) =>
//                                                                             handlePrivacyChange(
//                                                                                 "searchVisibility",
//                                                                                 e.target.checked
//                                                                             )
//                                                                         }
//                                                                     />
//                                                                 </div>
//                                                                 <div className="ml-3 text-sm">
//                                                                     <label
//                                                                         htmlFor="search-visibility"
//                                                                         className="font-medium text-gray-700"
//                                                                     >
//                                                                         Show profile in search results
//                                                                     </label>
//                                                                     <p className="text-gray-500">
//                                                                         Allow your profile to appear in search
//                                                                         engines and platform search.
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//
//                                                             <div className="flex items-start">
//                                                                 <div className="flex items-center h-5">
//                                                                     <input
//                                                                         id="activity-tracking"
//                                                                         name="activityVisibility"
//                                                                         type="checkbox"
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                         checked={
//                                                                             privacySettings.activityVisibility ===
//                                                                             "everyone"
//                                                                         }
//                                                                         onChange={(e) =>
//                                                                             handlePrivacyChange(
//                                                                                 "activityVisibility",
//                                                                                 e.target.checked
//                                                                                     ? "everyone"
//                                                                                     : "following"
//                                                                             )
//                                                                         }
//                                                                     />
//                                                                 </div>
//                                                                 <div className="ml-3 text-sm">
//                                                                     <label
//                                                                         htmlFor="activity-tracking"
//                                                                         className="font-medium text-gray-700"
//                                                                     >
//                                                                         Show activity status
//                                                                     </label>
//                                                                     <p className="text-gray-500">
//                                                                         Let others see when you're active or
//                                                                         recently active.
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//
//                                                             <div className="flex items-start">
//                                                                 <div className="flex items-center h-5">
//                                                                     <input
//                                                                         id="data-sharing"
//                                                                         name="dataSharing"
//                                                                         type="checkbox"
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                         checked={privacySettings.dataSharing}
//                                                                         onChange={(e) =>
//                                                                             handlePrivacyChange(
//                                                                                 "dataSharing",
//                                                                                 e.target.checked
//                                                                             )
//                                                                         }
//                                                                     />
//                                                                 </div>
//                                                                 <div className="ml-3 text-sm">
//                                                                     <label
//                                                                         htmlFor="data-sharing"
//                                                                         className="font-medium text-gray-700"
//                                                                     >
//                                                                         Data personalization
//                                                                     </label>
//                                                                     <p className="text-gray-500">
//                                                                         Allow us to use your activity to personalize
//                                                                         your experience.
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Divider */}
//                                                     <div className="border-t border-gray-200 my-6"></div>
//
//                                                     {/* Data Management */}
//                                                     <div className="space-y-4">
//                                                         <h3 className="text-lg font-medium text-gray-900">
//                                                             Data Management
//                                                         </h3>
//                                                         <p className="text-sm text-gray-500">
//                                                             Control and manage your personal data.
//                                                         </p>
//
//                                                         <div className="space-y-4">
//                                                             <button
//                                                                 type="button"
//                                                                 className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
//                                                             >
//                                                                 <Database className="h-4 w-4 mr-2 text-gray-500" />
//                                                                 Download your data
//                                                             </button>
//
//                                                             <button
//                                                                 type="button"
//                                                                 className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 shadow-sm text-red-600 bg-white hover:bg-red-50 focus:outline-none"
//                                                             >
//                                                                 <EyeOff className="h-4 w-4 mr-2 text-red-500" />
//                                                                 Temporarily disable account
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}
//
//                                             {activeSection === "community" && (
//                                                 <div className="space-y-8">
//                                                     {/* Followed Communities */}
//                                                     <div className="space-y-4">
//                                                         <div className="flex items-center justify-between">
//                                                             <h3 className="text-lg font-medium text-gray-900">
//                                                                 Followed Communities
//                                                             </h3>
//                                                             <span className="bg-green-50 text-green-600 text-xs px-2.5 py-1 rounded-full flex items-center">
//                                 <Users className="w-3.5 h-3.5 mr-1" />
//                                                                 {userCommunityList.length || 0} Communities
//                               </span>
//                                                         </div>
//                                                         <p className="text-sm text-gray-500">
//                                                             Manage the communities you follow and customize
//                                                             your feed.
//                                                         </p>
//
//                                                         <div className="grid grid-cols-1 gap-3 mt-4">
//                                                             {/* Community list from props */}
//                                                             {userCommunityList &&
//                                                             userCommunityList.length > 0 ? (
//                                                                 userCommunityList.map((community: any) => {
//                                                                     // Extract color from community_style (e.g., "bg-community-4" -> determine a color)
//                                                                     const colorMap: Record<string, { bg: string; text: string }> = {
//                                                                         "bg-community-1": {
//                                                                             bg: "bg-blue-100",
//                                                                             text: "text-blue-600",
//                                                                         },
//                                                                         "bg-community-2": {
//                                                                             bg: "bg-green-100",
//                                                                             text: "text-green-600",
//                                                                         },
//                                                                         "bg-community-3": {
//                                                                             bg: "bg-purple-100",
//                                                                             text: "text-purple-600",
//                                                                         },
//                                                                         "bg-community-4": {
//                                                                             bg: "bg-indigo-100",
//                                                                             text: "text-indigo-600",
//                                                                         },
//                                                                         "bg-community-5": {
//                                                                             bg: "bg-pink-100",
//                                                                             text: "text-pink-600",
//                                                                         },
//                                                                         "bg-community-6": {
//                                                                             bg: "bg-yellow-100",
//                                                                             text: "text-yellow-600",
//                                                                         },
//                                                                     };
//
//                                                                     const colors = colorMap[
//                                                                         community.community_style
//                                                                         ] || {
//                                                                         bg: "bg-gray-100",
//                                                                         text: "text-gray-600",
//                                                                     };
//
//                                                                     return (
//                                                                         <div
//                                                                             key={community.community_id}
//                                                                             className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
//                                                                         >
//                                                                             <div className="flex items-center">
//                                                                                 <div
//                                                                                     className={`w-10 h-10 rounded-md flex items-center justify-center ${colors.bg} ${colors.text} mr-3`}
//                                                                                 >
//                                                                                     {community.community_name
//                                                                                         .charAt(0)
//                                                                                         .toUpperCase()}
//                                                                                 </div>
//                                                                                 <div>
//                                                                                     <h4 className="text-sm font-medium text-gray-900">
//                                                                                         {community.community_name}
//                                                                                     </h4>
//                                                                                     <p className="text-xs text-gray-500">
//                                                                                         Community
//                                                                                     </p>
//                                                                                 </div>
//                                                                             </div>
//                                                                             <button
//                                                                                 type="button"
//                                                                                 className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
//                                                                             >
//                                                                                 Unfollow
//                                                                             </button>
//                                                                         </div>
//                                                                     );
//                                                                 })
//                                                             ) : (
//                                                                 <div className="text-center p-6 border border-gray-200 border-dashed rounded-lg">
//                                                                     <p className="text-sm text-gray-500">
//                                                                         You are not following any communities yet.
//                                                                     </p>
//                                                                 </div>
//                                                             )}
//
//                                                             {userCommunityList &&
//                                                                 userCommunityList.length > 0 && (
//                                                                     <button
//                                                                         onClick={() => router.push('/all-community-list')}
//                                                                         type="button"
//                                                                         className="mt-2 w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
//                                                                     >
//                                                                         Show More
//                                                                     </button>
//                                                                 )}
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Divider */}
//                                                     <div className="border-t border-gray-200 my-6"></div>
//
//                                                     {/* Community Notification Settings */}
//                                                     <div className="space-y-4">
//                                                         <h3 className="text-lg font-medium text-gray-900">
//                                                             Community Notifications
//                                                         </h3>
//                                                         <p className="text-sm text-gray-500">
//                                                             Control which notifications you receive from
//                                                             communities.
//                                                         </p>
//
//                                                         <div className="space-y-3 mt-4">
//                                                             <div className="flex items-start p-3 border border-gray-200 rounded-lg">
//                                                                 <div className="flex items-center h-5">
//                                                                     <input
//                                                                         id="notify-posts"
//                                                                         name="notify-posts"
//                                                                         type="checkbox"
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                         defaultChecked
//                                                                     />
//                                                                 </div>
//                                                                 <div className="ml-3 text-sm">
//                                                                     <label
//                                                                         htmlFor="notify-posts"
//                                                                         className="font-medium text-gray-700"
//                                                                     >
//                                                                         New Posts
//                                                                     </label>
//                                                                     <p className="text-gray-500">
//                                                                         Get notified about new posts from
//                                                                         communities you follow.
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//
//                                                             <div className="flex items-start p-3 border border-gray-200 rounded-lg">
//                                                                 <div className="flex items-center h-5">
//                                                                     <input
//                                                                         id="notify-trending"
//                                                                         name="notify-trending"
//                                                                         type="checkbox"
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                         defaultChecked
//                                                                     />
//                                                                 </div>
//                                                                 <div className="ml-3 text-sm">
//                                                                     <label
//                                                                         htmlFor="notify-trending"
//                                                                         className="font-medium text-gray-700"
//                                                                     >
//                                                                         Trending Content
//                                                                     </label>
//                                                                     <p className="text-gray-500">
//                                                                         Get notified about trending content in
//                                                                         communities you follow.
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//
//                                                             <div className="flex items-start p-3 border border-gray-200 rounded-lg">
//                                                                 <div className="flex items-center h-5">
//                                                                     <input
//                                                                         id="notify-events"
//                                                                         name="notify-events"
//                                                                         type="checkbox"
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                         defaultChecked
//                                                                     />
//                                                                 </div>
//                                                                 <div className="ml-3 text-sm">
//                                                                     <label
//                                                                         htmlFor="notify-events"
//                                                                         className="font-medium text-gray-700"
//                                                                     >
//                                                                         Events and Announcements
//                                                                     </label>
//                                                                     <p className="text-gray-500">
//                                                                         Get notified about community events and
//                                                                         important announcements.
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Divider */}
//                                                     <div className="border-t border-gray-200 my-6"></div>
//
//                                                     {/* Blocked Communities */}
//                                                     <div className="space-y-4">
//                                                         <h3 className="text-lg font-medium text-gray-900">
//                                                             Blocked Communities
//                                                         </h3>
//                                                         <p className="text-sm text-gray-500">
//                                                             Manage communities whose content you don't want to
//                                                             see.
//                                                         </p>
//
//                                                         <div className="mt-4">
//                                                             {/* Empty state */}
//                                                             <div className="text-center p-6 border border-gray-200 border-dashed rounded-lg">
//                                                                 <svg
//                                                                     className="mx-auto h-12 w-12 text-gray-400"
//                                                                     fill="none"
//                                                                     viewBox="0 0 24 24"
//                                                                     stroke="currentColor"
//                                                                     aria-hidden="true"
//                                                                 >
//                                                                     <path
//                                                                         strokeLinecap="round"
//                                                                         strokeLinejoin="round"
//                                                                         strokeWidth={2}
//                                                                         d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
//                                                                     />
//                                                                 </svg>
//                                                                 <h3 className="mt-2 text-sm font-medium text-gray-900">
//                                                                     No blocked communities
//                                                                 </h3>
//                                                                 <p className="mt-1 text-sm text-gray-500">
//                                                                     You haven't blocked any communities yet.
//                                                                 </p>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Divider */}
//                                                     <div className="border-t border-gray-200 my-6"></div>
//
//                                                     {/* Content Filters */}
//                                                     <div className="space-y-4">
//                                                         <h3 className="text-lg font-medium text-gray-900">
//                                                             Content Filters
//                                                         </h3>
//                                                         <p className="text-sm text-gray-500">
//                                                             Customize the types of content you want to see.
//                                                         </p>
//
//                                                         <div className="space-y-4 mt-4">
//                                                             <div>
//                                                                 <label
//                                                                     htmlFor="default-sort"
//                                                                     className="block text-sm font-medium text-gray-700"
//                                                                 >
//                                                                     Default Content Sorting
//                                                                 </label>
//                                                                 <select
//                                                                     id="default-sort"
//                                                                     name="default-sort"
//                                                                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//                                                                     defaultValue="hot"
//                                                                 >
//                                                                     <option value="hot">Hot</option>
//                                                                     <option value="new">New</option>
//                                                                     <option value="top">Top</option>
//                                                                     <option value="rising">Rising</option>
//                                                                 </select>
//                                                             </div>
//
//                                                             <div>
//                                                                 <label
//                                                                     htmlFor="content-quality"
//                                                                     className="block text-sm font-medium text-gray-700"
//                                                                 >
//                                                                     Content Quality Filter
//                                                                 </label>
//                                                                 <select
//                                                                     id="content-quality"
//                                                                     name="content-quality"
//                                                                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//                                                                     defaultValue="standard"
//                                                                 >
//                                                                     <option value="strict">
//                                                                         Strict (Filter low-quality content)
//                                                                     </option>
//                                                                     <option value="standard">Standard</option>
//                                                                     <option value="relaxed">
//                                                                         Relaxed (Show more content)
//                                                                     </option>
//                                                                 </select>
//                                                             </div>
//
//                                                             <div className="flex items-start">
//                                                                 <div className="flex items-center h-5">
//                                                                     <input
//                                                                         id="adult-content"
//                                                                         name="adult-content"
//                                                                         type="checkbox"
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                     />
//                                                                 </div>
//                                                                 <div className="ml-3 text-sm">
//                                                                     <label
//                                                                         htmlFor="adult-content"
//                                                                         className="font-medium text-gray-700"
//                                                                     >
//                                                                         Show Adult Content
//                                                                     </label>
//                                                                     <p className="text-gray-500">
//                                                                         Enable or disable adult content.
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Divider */}
//                                                     <div className="border-t border-gray-200 my-6"></div>
//
//                                                     {/* Community Suggestions */}
//                                                     <div className="space-y-4">
//                                                         <h3 className="text-lg font-medium text-gray-900">
//                                                             Community Suggestions
//                                                         </h3>
//                                                         <p className="text-sm text-gray-500">
//                                                             Discover communities recommended for you.
//                                                         </p>
//
//                                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
//                                                             {/* Display real community data from API */}
//                                                             {communityExploreData?.data &&
//                                                             communityExploreData.data.length > 0 ? (
//                                                                 communityExploreData.data
//                                                                     .map((community: any) => {
//                                                                         const color = getCommunityColor(
//                                                                             community.community_id,
//                                                                             community.community_style
//                                                                         );
//
//                                                                         return (
//                                                                             <div
//                                                                                 key={community.community_id}
//                                                                                 className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
//                                                                             >
//                                                                                 <div className="flex items-center">
//                                                                                     <div
//                                                                                         className={`w-8 h-8 rounded-md flex items-center justify-center bg-${color}-100 text-${color}-600 mr-3`}
//                                                                                     >
//                                                                                         {community.community_name
//                                                                                             .charAt(0)
//                                                                                             .toUpperCase()}
//                                                                                     </div>
//                                                                                     <div>
//                                                                                         <h4 className="text-sm font-medium text-gray-900">
//                                                                                             {community.community_name}
//                                                                                         </h4>
//                                                                                         <p className="text-xs text-gray-500">
//                                                                                             {community.member_count} member
//                                                                                             {parseInt(
//                                                                                                 community.member_count
//                                                                                             ) > 1
//                                                                                                 ? "s"
//                                                                                                 : ""}
//                                                                                         </p>
//                                                                                     </div>
//                                                                                 </div>
//                                                                                 <button
//                                                                                     type="button"
//                                                                                     onClick={() =>
//                                                                                         handleCommunityJoinLeave(
//                                                                                             community.community_id
//                                                                                         )
//                                                                                     }
//                                                                                     className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors"
//                                                                                 >
//                                                                                     Follow
//                                                                                 </button>
//                                                                             </div>
//                                                                         );
//                                                                     })
//                                                                     .map((community: any) => (
//                                                                         <div
//                                                                             key={community.slug}
//                                                                             className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
//                                                                         >
//                                                                             <div className="flex items-center">
//                                                                                 <div
//                                                                                     className={`w-8 h-8 rounded-md flex items-center justify-center bg-${community.color}-100 text-${community.color}-600 mr-3`}
//                                                                                 >
//                                                                                     {community?.name
//                                                                                         ?.charAt(0)
//                                                                                         ?.toUpperCase()}
//                                                                                 </div>
//                                                                                 <div>
//                                                                                     <h4 className="text-sm font-medium text-gray-900">
//                                                                                         c/{community.slug}
//                                                                                     </h4>
//                                                                                     <p className="text-xs text-gray-500">
//                                                                                         {community.members}
//                                                                                     </p>
//                                                                                 </div>
//                                                                             </div>
//                                                                             <button
//                                                                                 type="button"
//                                                                                 className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
//                                                                             >
//                                                                                 Follow
//                                                                             </button>
//                                                                         </div>
//                                                                     ))
//                                                             ) : (
//                                                                 <div> there is no data </div>
//                                                             )}
//                                                         </div>
//
//                                                         {/* Show loading state */}
//                                                         {!communityExploreData?.data && (
//                                                             <div className="text-center p-4">
//                                                                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
//                                                                 <p className="text-sm text-gray-500 mt-2">
//                                                                     Loading community suggestions...
//                                                                 </p>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             )}
//                                             {activeSection === "rank" && (
//                                                 <div className="space-y-8">
//                                                     {/* Current Rank Section */}
//                                                     <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-4 sm:p-6 text-white modalcard">
//                                                         <div className="flex justify-between items-center">
//                                                             <h3 className="text-xl font-bold">
//                                                                 Your Current Rank
//                                                             </h3>
//                                                             <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
//                                 <span className="text-sm font-semibold">
//                                   {userProfileData?.data?.user_score || 427}{" "}
//                                     Karma Points
//                                 </span>
//                                                             </div>
//                                                         </div>
//
//                                                         <div className="mt-6 flex items-center gap-4">
//                                                             <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
//                                                                 <div className="h-16 w-16 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         className="h-10 w-10 text-white"
//                                                                         viewBox="0 0 20 20"
//                                                                         fill="currentColor"
//                                                                     >
//                                                                         <path
//                                                                             fillRule="evenodd"
//                                                                             d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                                                                             clipRule="evenodd"
//                                                                         />
//                                                                     </svg>
//                                                                 </div>
//                                                             </div>
//                                                             <div>
//                                                                 <h4 className="text-2xl font-bold">
//                                                                     {userProfileData?.data?.user_rank
//                                                                         ?.rank_name || "Iron Seeker"}
//                                                                 </h4>
//                                                                 <p className="text-white/80">
//                                                                     Level{" "}
//                                                                     {userProfileData?.data?.user_rank?.rank_no ||
//                                                                         4}{" "}
//                                                                     - You're making great progress!
//                                                                 </p>
//                                                                 <div className="mt-2 flex items-center gap-2">
//                                                                     <div className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
//                                                                         Impact:{" "}
//                                                                         {userProfileData?.data?.user_rank?.impact ||
//                                                                             10}
//                                                                         %
//                                                                     </div>
//                                                                     <div className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
//                                                                         {userProfileData?.data?.next_ranks?.[0]
//                                                                             ?.rank_score
//                                                                             ? userProfileData.data.next_ranks[0]
//                                                                                 .rank_score -
//                                                                             userProfileData.data.user_score
//                                                                             : 74}{" "}
//                                                                         points to next rank
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//
//                                                         <div className="mt-6">
//                                                             <div className="w-full bg-white/20 rounded-full h-2.5">
//                                                                 <div
//                                                                     className="bg-white h-2.5 rounded-full"
//                                                                     style={{
//                                                                         width: `${
//                                                                             userProfileData?.data?.next_ranks?.[0]
//                                                                                 ?.rank_score
//                                                                                 ? Math.min(
//                                                                                     85,
//                                                                                     (userProfileData.data.user_score /
//                                                                                         userProfileData.data.next_ranks[0]
//                                                                                             .rank_score) *
//                                                                                     100
//                                                                                 )
//                                                                                 : 85
//                                                                         }%`,
//                                                                     }}
//                                                                 ></div>
//                                                             </div>
//                                                             <div className="flex justify-between mt-2 text-xs">
//                                 <span>
//                                   {userProfileData?.data?.user_rank?.rank_no ===
//                                   1
//                                       ? 101
//                                       : userProfileData?.data?.user_score ||
//                                       101}{" "}
//                                     points
//                                 </span>
//                                                                 <span>
//                                   {userProfileData?.data?.next_ranks?.[0]
//                                       ?.rank_score || 500}{" "}
//                                                                     points
//                                 </span>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Rank System */}
//                                                     <div className="space-y-4">
//                                                         <h3 className="text-lg font-medium text-gray-900">
//                                                             Rank System
//                                                         </h3>
//                                                         <p className="text-sm text-gray-500">
//                                                             Earn karma points by being active on the platform,
//                                                             providing valuable content, and receiving positive
//                                                             feedback.
//                                                         </p>
//
//                                                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 modalgrid">
//                                                             {/* Iron Seeker */}
//                                                             <div className="relative border border-gray-200 rounded-xl p-4 flex flex-col items-center bg-gradient-to-b from-white to-gray-50 modalcard">
//                                                                 <div className="absolute -top-4 left-0 right-0 flex justify-center">
//                                                                     <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center transform transition-transform hover:scale-110">
//                                                                         <svg
//                                                                             xmlns="http://www.w3.org/2000/svg"
//                                                                             className="h-8 w-8 text-white"
//                                                                             fill="none"
//                                                                             viewBox="0 0 24 24"
//                                                                             stroke="currentColor"
//                                                                         >
//                                                                             <path
//                                                                                 strokeLinecap="round"
//                                                                                 strokeLinejoin="round"
//                                                                                 strokeWidth={2}
//                                                                                 d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
//                                                                             />
//                                                                             <path
//                                                                                 strokeLinecap="round"
//                                                                                 strokeLinejoin="round"
//                                                                                 strokeWidth={2}
//                                                                                 d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                                                                             />
//                                                                         </svg>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="mt-14 text-center">
//                                                                     <h4 className="text-lg font-semibold text-gray-900">
//                                                                         Iron Seeker
//                                                                     </h4>
//                                                                     <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                                                                         Level 1
//                                                                     </div>
//                                                                     <p className="mt-4 text-sm text-gray-500">
//                                                                         101+ Karma Points
//                                                                     </p>
//                                                                 </div>
//                                                                 <div className="mt-4 w-full">
//                                                                     <div className="flex items-center justify-between text-sm mb-1">
//                                     <span className="font-medium">
//                                       Review Impact
//                                     </span>
//                                                                         <span className="text-green-600 font-medium">
//                                       10%
//                                     </span>
//                                                                     </div>
//                                                                     <div className="w-full bg-gray-200 rounded-full h-1.5">
//                                                                         <div
//                                                                             className="bg-gray-500 h-1.5 rounded-full"
//                                                                             style={{ width: "10%" }}
//                                                                         ></div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//
//                                                             {/* Steel Grinder */}
//                                                             <div className="relative border border-gray-200 rounded-xl p-4 flex flex-col items-center bg-gradient-to-b from-white to-blue-50 modalcard">
//                                                                 <div className="absolute -top-4 left-0 right-0 flex justify-center">
//                                                                     <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-300 to-blue-600 flex items-center justify-center transform transition-transform hover:scale-110">
//                                                                         <svg
//                                                                             xmlns="http://www.w3.org/2000/svg"
//                                                                             className="h-8 w-8 text-white"
//                                                                             fill="none"
//                                                                             viewBox="0 0 24 24"
//                                                                             stroke="currentColor"
//                                                                         >
//                                                                             <path
//                                                                                 strokeLinecap="round"
//                                                                                 strokeLinejoin="round"
//                                                                                 strokeWidth={2}
//                                                                                 d="M13 10V3L4 14h7v7l9-11h-7z"
//                                                                             />
//                                                                         </svg>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="mt-14 text-center">
//                                                                     <h4 className="text-lg font-semibold text-gray-900">
//                                                                         Steel Grinder
//                                                                     </h4>
//                                                                     <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                                                         Level 2
//                                                                     </div>
//                                                                     <p className="mt-4 text-sm text-gray-500">
//                                                                         501+ Karma Points
//                                                                     </p>
//                                                                 </div>
//                                                                 <div className="mt-4 w-full">
//                                                                     <div className="flex items-center justify-between text-sm mb-1">
//                                     <span className="font-medium">
//                                       Review Impact
//                                     </span>
//                                                                         <span className="text-green-600 font-medium">
//                                       25%
//                                     </span>
//                                                                     </div>
//                                                                     <div className="w-full bg-gray-200 rounded-full h-1.5">
//                                                                         <div
//                                                                             className="bg-blue-500 h-1.5 rounded-full"
//                                                                             style={{ width: "25%" }}
//                                                                         ></div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//
//                                                             {/* Muscle Architect */}
//                                                             <div className="relative border border-gray-200 rounded-xl p-4 flex flex-col items-center bg-gradient-to-b from-white to-purple-50 modalcard">
//                                                                 <div className="absolute -top-4 left-0 right-0 flex justify-center">
//                                                                     <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-300 to-purple-600 flex items-center justify-center transform transition-transform hover:scale-110">
//                                                                         <svg
//                                                                             xmlns="http://www.w3.org/2000/svg"
//                                                                             className="h-8 w-8 text-white"
//                                                                             fill="none"
//                                                                             viewBox="0 0 24 24"
//                                                                             stroke="currentColor"
//                                                                         >
//                                                                             <path
//                                                                                 strokeLinecap="round"
//                                                                                 strokeLinejoin="round"
//                                                                                 strokeWidth={2}
//                                                                                 d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//                                                                             />
//                                                                         </svg>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="mt-14 text-center">
//                                                                     <h4 className="text-lg font-semibold text-gray-900">
//                                                                         Muscle Architect
//                                                                     </h4>
//                                                                     <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//                                                                         Level 3
//                                                                     </div>
//                                                                     <p className="mt-4 text-sm text-gray-500">
//                                                                         1501+ Karma Points
//                                                                     </p>
//                                                                 </div>
//                                                                 <div className="mt-4 w-full">
//                                                                     <div className="flex items-center justify-between text-sm mb-1">
//                                     <span className="font-medium">
//                                       Review Impact
//                                     </span>
//                                                                         <span className="text-green-600 font-medium">
//                                       50%
//                                     </span>
//                                                                     </div>
//                                                                     <div className="w-full bg-gray-200 rounded-full h-1.5">
//                                                                         <div
//                                                                             className="bg-purple-500 h-1.5 rounded-full"
//                                                                             style={{ width: "50%" }}
//                                                                         ></div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//
//                                                             {/* Titan of Iron */}
//                                                             <div className="relative border border-gray-200 rounded-xl p-4 flex flex-col items-center bg-gradient-to-b from-white to-amber-50 modalcard">
//                                                                 <div className="absolute -top-4 left-0 right-0 flex justify-center">
//                                                                     <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center transform transition-transform hover:scale-110">
//                                                                         <svg
//                                                                             xmlns="http://www.w3.org/2000/svg"
//                                                                             className="h-8 w-8 text-white"
//                                                                             fill="none"
//                                                                             viewBox="0 0 24 24"
//                                                                             stroke="currentColor"
//                                                                         >
//                                                                             <path
//                                                                                 strokeLinecap="round"
//                                                                                 strokeLinejoin="round"
//                                                                                 strokeWidth={2}
//                                                                                 d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
//                                                                             />
//                                                                         </svg>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="mt-14 text-center">
//                                                                     <h4 className="text-lg font-semibold text-gray-900">
//                                                                         Titan of Iron
//                                                                     </h4>
//                                                                     <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
//                                                                         Level 4
//                                                                     </div>
//                                                                     <p className="mt-4 text-sm text-gray-500">
//                                                                         5001+ Karma Points
//                                                                     </p>
//                                                                 </div>
//                                                                 <div className="mt-4 w-full">
//                                                                     <div className="flex items-center justify-between text-sm mb-1">
//                                     <span className="font-medium">
//                                       Review Impact
//                                     </span>
//                                                                         <span className="text-green-600 font-medium">
//                                       100%
//                                     </span>
//                                                                     </div>
//                                                                     <div className="w-full bg-gray-200 rounded-full h-1.5">
//                                                                         <div
//                                                                             className="bg-amber-500 h-1.5 rounded-full"
//                                                                             style={{ width: "100%" }}
//                                                                         ></div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Rank Badge Collection */}
//                                                     <div className="space-y-4">
//                                                         <div className="flex justify-between items-center">
//                                                             <h3 className="text-lg font-medium text-gray-900">
//                                                                 Your Badge Collection
//                                                             </h3>
//                                                             <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full">
//                                 {(userProfileData?.data?.total_reviews || 0) > 0
//                                     ? Math.min(
//                                         7,
//                                         (userProfileData?.data?.total_reviews ||
//                                             0) +
//                                         (userProfileData?.data?.total_likes ||
//                                             0) /
//                                         10
//                                     )
//                                     : 3}{" "}
//                                                                 Badges Earned
//                               </span>
//                                                         </div>
//
//                                                         {/* Rank Badges - Horizontal Display */}
//                                                         <div className="flex flex-wrap gap-3 mb-6">
//                                                             {/* Iron Seeker Badge */}
//                                                             <span className="relative overflow-hidden bg-gradient-to-r from-gray-400 to-gray-600 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-md hover:shadow-lg transition-shadow">
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="h-4 w-4"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                   <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
//                                   />
//                                 </svg>
//                                 Iron Seeker
//                                 <div className="absolute -inset-full top-0 block w-1/2 z-5 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-30 animate-shine"></div>
//                               </span>
//
//                                                             {/* Steel Grinder Badge */}
//                                                             <span className="relative overflow-hidden bg-gradient-to-r from-blue-400 to-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-md hover:shadow-lg transition-shadow">
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="h-4 w-4"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                   <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//                                   />
//                                 </svg>
//                                 Steel Grinder
//                                 <div className="absolute -inset-full top-0 block w-1/2 z-5 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-30 animate-shine"></div>
//                               </span>
//
//                                                             {/* Muscle Architect Badge */}
//                                                             <span className="relative overflow-hidden bg-gradient-to-r from-purple-400 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-md hover:shadow-lg transition-shadow">
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="h-4 w-4"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                   <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
//                                   />
//                                 </svg>
//                                 Muscle Architect
//                                 <div className="absolute -inset-full top-0 block w-1/2 z-5 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-30 animate-shine"></div>
//                               </span>
//
//                                                             {/* Titan of Iron Badge - Animated */}
//                                                             <span className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-md hover:shadow-xl transition-all border border-amber-300 group titan-badge">
//                                 {/* Glow effect */}
//                                                                 <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-amber-500 opacity-0 group-hover:opacity-80 transition-opacity duration-300 blur-md"></div>
//
//                                                                 {/* Sparkle particles */}
//                                                                 <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-200 animate-ping opacity-75"></div>
//                                 <div
//                                     className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-yellow-200 animate-ping opacity-75"
//                                     style={{ animationDelay: "0.5s" }}
//                                 ></div>
//                                 <div
//                                     className="absolute top-1 left-1/4 w-1 h-1 rounded-full bg-white animate-ping opacity-60"
//                                     style={{ animationDelay: "0.8s" }}
//                                 ></div>
//
//                                                                 {/* Icon with animation */}
//                                                                 <svg
//                                                                     xmlns="http://www.w3.org/2000/svg"
//                                                                     className="h-5 w-5 text-yellow-100 titan-star filter drop-shadow-md"
//                                                                     fill="none"
//                                                                     viewBox="0 0 24 24"
//                                                                     stroke="currentColor"
//                                                                 >
//                                   <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
//                                   />
//                                 </svg>
//
//                                                                 {/* Badge text */}
//                                                                 <span className="z-10 relative font-bold text-yellow-50 titan-text">
//                                   Titan of Iron
//                                 </span>
//
//                                                                 {/* Animated shine effect */}
//                                                                 <div className="absolute -inset-full top-0 block w-1/2 z-5 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-90 animate-shine"></div>
//
//                                                                 {/* Pulsing dot */}
//                                                                 <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-titan-pulse"></div>
//                               </span>
//                                                         </div>
//
//                                                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
//                                                             {/* Badge 1 - Unlocked */}
//                                                             <div className="relative group">
//                                                                 <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg p-4 flex items-center justify-center aspect-square">
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         className="h-12 w-12 text-white"
//                                                                         fill="none"
//                                                                         viewBox="0 0 24 24"
//                                                                         stroke="currentColor"
//                                                                     >
//                                                                         <path
//                                                                             strokeLinecap="round"
//                                                                             strokeLinejoin="round"
//                                                                             strokeWidth={2}
//                                                                             d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
//                                                                         />
//                                                                     </svg>
//                                                                 </div>
//                                                                 <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
//                                                                     <div className="text-center text-white p-2">
//                                                                         <p className="font-medium">First Review</p>
//                                                                         <p className="text-xs mt-1">
//                                                                             Completed your first review
//                                                                         </p>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//
//                                                             {/* Badge 2 - Unlocked */}
//                                                             <div className="relative group">
//                                                                 <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg p-4 flex items-center justify-center aspect-square">
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         className="h-12 w-12 text-white"
//                                                                         fill="none"
//                                                                         viewBox="0 0 24 24"
//                                                                         stroke="currentColor"
//                                                                     >
//                                                                         <path
//                                                                             strokeLinecap="round"
//                                                                             strokeLinejoin="round"
//                                                                             strokeWidth={2}
//                                                                             d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                                                                         />
//                                                                     </svg>
//                                                                 </div>
//                                                                 <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
//                                                                     <div className="text-center text-white p-2">
//                                                                         <p className="font-medium">
//                                                                             Community Supporter
//                                                                         </p>
//                                                                         <p className="text-xs mt-1">
//                                                                             Helped 10+ community members
//                                                                         </p>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//
//                                                             {/* Badge 3 - Locked */}
//                                                             <div className="relative group">
//                                                                 <div className="bg-gray-200 rounded-lg p-4 flex items-center justify-center aspect-square">
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         className="h-12 w-12 text-gray-400"
//                                                                         fill="none"
//                                                                         viewBox="0 0 24 24"
//                                                                         stroke="currentColor"
//                                                                     >
//                                                                         <path
//                                                                             strokeLinecap="round"
//                                                                             strokeLinejoin="round"
//                                                                             strokeWidth={2}
//                                                                             d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                                                                         />
//                                                                     </svg>
//                                                                 </div>
//                                                                 <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
//                                                                     <div className="text-center text-white p-2">
//                                                                         <p className="font-medium">
//                                                                             Power Reviewer
//                                                                         </p>
//                                                                         <p className="text-xs mt-1">
//                                                                             Complete 50 reviews (
//                                                                             {userProfileData?.data?.total_reviews ||
//                                                                                 2}
//                                                                             /50)
//                                                                         </p>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//
//                                                             {/* Badge 4 - Unlocked */}
//                                                             <div className="relative group">
//                                                                 <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg p-4 flex items-center justify-center aspect-square">
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         className="h-12 w-12 text-white"
//                                                                         fill="none"
//                                                                         viewBox="0 0 24 24"
//                                                                         stroke="currentColor"
//                                                                     >
//                                                                         <path
//                                                                             strokeLinecap="round"
//                                                                             strokeLinejoin="round"
//                                                                             strokeWidth={2}
//                                                                             d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
//                                                                         />
//                                                                     </svg>
//                                                                 </div>
//                                                                 <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
//                                                                     <div className="text-center text-white p-2">
//                                                                         <p className="font-medium">
//                                                                             Quality Contributor
//                                                                         </p>
//                                                                         <p className="text-xs mt-1">
//                                                                             Received{" "}
//                                                                             {userProfileData?.data?.total_likes || 50}
//                                                                             + likes
//                                                                         </p>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//
//                                                         <button
//                                                             type="button"
//                                                             className="mt-4 w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
//                                                         >
//                                                             View All Badges
//                                                         </button>
//                                                     </div>
//
//                                                     {/* Karma History */}
//                                                     <div className="space-y-4">
//                                                         <h3 className="text-lg font-medium text-gray-900">
//                                                             Recent Karma Activity
//                                                         </h3>
//                                                         <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
//                                                             <ul className="divide-y divide-gray-200">
//                                                                 <li className="p-4 flex justify-between items-center hover:bg-gray-50">
//                                                                     <div className="flex items-center space-x-3">
//                                                                         <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
//                                                                             <svg
//                                                                                 xmlns="http://www.w3.org/2000/svg"
//                                                                                 className="h-6 w-6 text-green-600"
//                                                                                 fill="none"
//                                                                                 viewBox="0 0 24 24"
//                                                                                 stroke="currentColor"
//                                                                             >
//                                                                                 <path
//                                                                                     strokeLinecap="round"
//                                                                                     strokeLinejoin="round"
//                                                                                     strokeWidth={2}
//                                                                                     d="M7 11l5-5m0 0l5 5m-5-5v12"
//                                                                                 />
//                                                                             </svg>
//                                                                         </div>
//                                                                         <div>
//                                                                             <p className="text-sm font-medium text-gray-900">
//                                                                                 Content received likes
//                                                                             </p>
//                                                                             <p className="text-xs text-gray-500">
//                                                                                 Total:{" "}
//                                                                                 {userProfileData?.data?.total_likes ||
//                                                                                     10}{" "}
//                                                                                 likes
//                                                                             </p>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="text-sm font-semibold text-green-600">
//                                                                         +
//                                                                         {userProfileData?.data?.total_likes * 0.5 ||
//                                                                             5}{" "}
//                                                                         points
//                                                                     </div>
//                                                                 </li>
//                                                                 <li className="p-4 flex justify-between items-center hover:bg-gray-50">
//                                                                     <div className="flex items-center space-x-3">
//                                                                         <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                                                                             <svg
//                                                                                 xmlns="http://www.w3.org/2000/svg"
//                                                                                 className="h-6 w-6 text-blue-600"
//                                                                                 fill="none"
//                                                                                 viewBox="0 0 24 24"
//                                                                                 stroke="currentColor"
//                                                                             >
//                                                                                 <path
//                                                                                     strokeLinecap="round"
//                                                                                     strokeLinejoin="round"
//                                                                                     strokeWidth={2}
//                                                                                     d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                                                                                 />
//                                                                             </svg>
//                                                                         </div>
//                                                                         <div>
//                                                                             <p className="text-sm font-medium text-gray-900">
//                                                                                 Published reviews
//                                                                             </p>
//                                                                             <p className="text-xs text-gray-500">
//                                                                                 Total:{" "}
//                                                                                 {userProfileData?.data?.total_reviews ||
//                                                                                     2}{" "}
//                                                                                 reviews
//                                                                             </p>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="text-sm font-semibold text-blue-600">
//                                                                         +
//                                                                         {userProfileData?.data?.total_reviews *
//                                                                             10 || 20}{" "}
//                                                                         points
//                                                                     </div>
//                                                                 </li>
//                                                                 <li className="p-4 flex justify-between items-center hover:bg-gray-50">
//                                                                     <div className="flex items-center space-x-3">
//                                                                         <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
//                                                                             <svg
//                                                                                 xmlns="http://www.w3.org/2000/svg"
//                                                                                 className="h-6 w-6 text-purple-600"
//                                                                                 fill="none"
//                                                                                 viewBox="0 0 24 24"
//                                                                                 stroke="currentColor"
//                                                                             >
//                                                                                 <path
//                                                                                     strokeLinecap="round"
//                                                                                     strokeLinejoin="round"
//                                                                                     strokeWidth={2}
//                                                                                     d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                                                                                 />
//                                                                             </svg>
//                                                                         </div>
//                                                                         <div>
//                                                                             <p className="text-sm font-medium text-gray-900">
//                                                                                 Member since
//                                                                             </p>
//                                                                             <p className="text-xs text-gray-500">
//                                                                                 {userProfileData?.data?.member_since ||
//                                                                                     "5 months ago"}
//                                                                             </p>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="text-sm font-semibold text-purple-600">
//                                                                         +50 points
//                                                                     </div>
//                                                                 </li>
//                                                             </ul>
//                                                         </div>
//                                                         <button
//                                                             type="button"
//                                                             className="mt-2 w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
//                                                         >
//                                                             View Full History
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             )}
//
//                                             {activeSection === "notifications" && (
//                                                 <div className="space-y-8">
//                                                     {/* Email Notifications */}
//                                                     <div className="space-y-4">
//                                                         <h3 className="text-lg font-medium text-gray-900">
//                                                             Email Notifications
//                                                         </h3>
//                                                         <p className="text-sm text-gray-500">
//                                                             Choose which notifications you'd like to receive
//                                                             via email.
//                                                         </p>
//
//                                                         <div className="space-y-4 mt-4">
//                                                             <div className="flex items-start p-3 border border-gray-200 rounded-lg">
//                                                                 <div className="flex items-center h-5">
//                                                                     <input
//                                                                         id="notify-messages"
//                                                                         name="notify-messages"
//                                                                         type="checkbox"
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                         checked={
//                                                                             userProfileData?.data
//                                                                                 ?.notification_receive_message === "1"
//                                                                         }
//                                                                         readOnly
//                                                                     />
//                                                                 </div>
//                                                                 <div className="ml-3 text-sm">
//                                                                     <label
//                                                                         htmlFor="notify-messages"
//                                                                         className="font-medium text-gray-700"
//                                                                     >
//                                                                         New Messages
//                                                                     </label>
//                                                                     <p className="text-gray-500">
//                                                                         Get notified when someone sends you a
//                                                                         message.
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//
//                                                             <div className="flex items-start p-3 border border-gray-200 rounded-lg">
//                                                                 <div className="flex items-center h-5">
//                                                                     <input
//                                                                         id="notify-comments"
//                                                                         name="notify-comments"
//                                                                         type="checkbox"
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                         checked={
//                                                                             userProfileData?.data
//                                                                                 ?.notification_review_comment === "1"
//                                                                         }
//                                                                         readOnly
//                                                                     />
//                                                                 </div>
//                                                                 <div className="ml-3 text-sm">
//                                                                     <label
//                                                                         htmlFor="notify-comments"
//                                                                         className="font-medium text-gray-700"
//                                                                     >
//                                                                         Review Comments
//                                                                     </label>
//                                                                     <p className="text-gray-500">
//                                                                         Get notified when someone comments on your
//                                                                         reviews.
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//
//                                                             <div className="flex items-start p-3 border border-gray-200 rounded-lg">
//                                                                 <div className="flex items-center h-5">
//                                                                     <input
//                                                                         id="notify-likes"
//                                                                         name="notify-likes"
//                                                                         type="checkbox"
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                         checked={
//                                                                             userProfileData?.data
//                                                                                 ?.notification_content_like === "1"
//                                                                         }
//                                                                         readOnly
//                                                                     />
//                                                                 </div>
//                                                                 <div className="ml-3 text-sm">
//                                                                     <label
//                                                                         htmlFor="notify-likes"
//                                                                         className="font-medium text-gray-700"
//                                                                     >
//                                                                         Content Likes
//                                                                     </label>
//                                                                     <p className="text-gray-500">
//                                                                         Get notified when someone likes your
//                                                                         content.
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//
//                                                             <div className="flex items-start p-3 border border-gray-200 rounded-lg">
//                                                                 <div className="flex items-center h-5">
//                                                                     <input
//                                                                         id="notify-favorites"
//                                                                         name="notify-favorites"
//                                                                         type="checkbox"
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                         checked={
//                                                                             userProfileData?.data
//                                                                                 ?.notification_favorite_share === "1"
//                                                                         }
//                                                                         readOnly
//                                                                     />
//                                                                 </div>
//                                                                 <div className="ml-3 text-sm">
//                                                                     <label
//                                                                         htmlFor="notify-favorites"
//                                                                         className="font-medium text-gray-700"
//                                                                     >
//                                                                         Favorites & Shares
//                                                                     </label>
//                                                                     <p className="text-gray-500">
//                                                                         Get notified when someone favorites or
//                                                                         shares your content.
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//
//                                                             <div className="flex items-start p-3 border border-gray-200 rounded-lg">
//                                                                 <div className="flex items-center h-5">
//                                                                     <input
//                                                                         id="notify-security"
//                                                                         name="notify-security"
//                                                                         type="checkbox"
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                         checked={
//                                                                             userProfileData?.data
//                                                                                 ?.notification_security_account === "1"
//                                                                         }
//                                                                         readOnly
//                                                                     />
//                                                                 </div>
//                                                                 <div className="ml-3 text-sm">
//                                                                     <label
//                                                                         htmlFor="notify-security"
//                                                                         className="font-medium text-gray-700"
//                                                                     >
//                                                                         Security & Account
//                                                                     </label>
//                                                                     <p className="text-gray-500">
//                                                                         Get notified about security alerts and
//                                                                         account changes.
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Divider */}
//                                                     <div className="border-t border-gray-200 my-6"></div>
//
//                                                     {/* Push Notifications */}
//                                                     <div className="space-y-4">
//                                                         <h3 className="text-lg font-medium text-gray-900">
//                                                             Push Notifications
//                                                         </h3>
//                                                         <p className="text-sm text-gray-500">
//                                                             Control which push notifications you receive on
//                                                             your devices.
//                                                         </p>
//
//                                                         <div className="space-y-4 mt-4">
//                                                             <div className="flex items-start p-3 border border-gray-200 rounded-lg">
//                                                                 <div className="flex items-center h-5">
//                                                                     <input
//                                                                         id="push-messages"
//                                                                         name="push-messages"
//                                                                         type="checkbox"
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                         defaultChecked
//                                                                     />
//                                                                 </div>
//                                                                 <div className="ml-3 text-sm">
//                                                                     <label
//                                                                         htmlFor="push-messages"
//                                                                         className="font-medium text-gray-700"
//                                                                     >
//                                                                         Direct Messages
//                                                                     </label>
//                                                                     <p className="text-gray-500">
//                                                                         Instant notifications for new direct
//                                                                         messages.
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//
//                                                             <div className="flex items-start p-3 border border-gray-200 rounded-lg">
//                                                                 <div className="flex items-center h-5">
//                                                                     <input
//                                                                         id="push-mentions"
//                                                                         name="push-mentions"
//                                                                         type="checkbox"
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                         defaultChecked
//                                                                     />
//                                                                 </div>
//                                                                 <div className="ml-3 text-sm">
//                                                                     <label
//                                                                         htmlFor="push-mentions"
//                                                                         className="font-medium text-gray-700"
//                                                                     >
//                                                                         Mentions & Replies
//                                                                     </label>
//                                                                     <p className="text-gray-500">
//                                                                         Get notified when someone mentions you or
//                                                                         replies to your content.
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//
//                                                             <div className="flex items-start p-3 border border-gray-200 rounded-lg">
//                                                                 <div className="flex items-center h-5">
//                                                                     <input
//                                                                         id="push-follows"
//                                                                         name="push-follows"
//                                                                         type="checkbox"
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                     />
//                                                                 </div>
//                                                                 <div className="ml-3 text-sm">
//                                                                     <label
//                                                                         htmlFor="push-follows"
//                                                                         className="font-medium text-gray-700"
//                                                                     >
//                                                                         New Followers
//                                                                     </label>
//                                                                     <p className="text-gray-500">
//                                                                         Get notified when someone starts following
//                                                                         you.
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Divider */}
//                                                     <div className="border-t border-gray-200 my-6"></div>
//
//                                                     {/* Notification Frequency */}
//                                                     <div className="space-y-4">
//                                                         <h3 className="text-lg font-medium text-gray-900">
//                                                             Notification Frequency
//                                                         </h3>
//                                                         <p className="text-sm text-gray-500">
//                                                             Choose how often you'd like to receive
//                                                             notification summaries.
//                                                         </p>
//
//                                                         <div className="space-y-3">
//                                                             <div className="flex items-center">
//                                                                 <input
//                                                                     id="freq-instant"
//                                                                     name="notification-frequency"
//                                                                     type="radio"
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                                                                     defaultChecked
//                                                                 />
//                                                                 <label
//                                                                     htmlFor="freq-instant"
//                                                                     className="ml-3 block text-sm font-medium text-gray-700"
//                                                                 >
//                                                                     Instant notifications
//                                                                     <p className="text-xs text-gray-500 mt-1">
//                                                                         Receive notifications as they happen
//                                                                     </p>
//                                                                 </label>
//                                                             </div>
//
//                                                             <div className="flex items-center">
//                                                                 <input
//                                                                     id="freq-daily"
//                                                                     name="notification-frequency"
//                                                                     type="radio"
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                                                                 />
//                                                                 <label
//                                                                     htmlFor="freq-daily"
//                                                                     className="ml-3 block text-sm font-medium text-gray-700"
//                                                                 >
//                                                                     Daily summary
//                                                                     <p className="text-xs text-gray-500 mt-1">
//                                                                         Get a daily digest of your notifications
//                                                                     </p>
//                                                                 </label>
//                                                             </div>
//
//                                                             <div className="flex items-center">
//                                                                 <input
//                                                                     id="freq-weekly"
//                                                                     name="notification-frequency"
//                                                                     type="radio"
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                                                                 />
//                                                                 <label
//                                                                     htmlFor="freq-weekly"
//                                                                     className="ml-3 block text-sm font-medium text-gray-700"
//                                                                 >
//                                                                     Weekly summary
//                                                                     <p className="text-xs text-gray-500 mt-1">
//                                                                         Get a weekly digest of your notifications
//                                                                     </p>
//                                                                 </label>
//                                                             </div>
//
//                                                             <div className="flex items-center">
//                                                                 <input
//                                                                     id="freq-none"
//                                                                     name="notification-frequency"
//                                                                     type="radio"
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                                                                 />
//                                                                 <label
//                                                                     htmlFor="freq-none"
//                                                                     className="ml-3 block text-sm font-medium text-gray-700"
//                                                                 >
//                                                                     No notifications
//                                                                     <p className="text-xs text-gray-500 mt-1">
//                                                                         Turn off all notifications
//                                                                     </p>
//                                                                 </label>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}
//
//                                             {activeSection !== "profile" &&
//                                                 activeSection !== "security" &&
//                                                 activeSection !== "privacy" &&
//                                                 activeSection !== "community" &&
//                                                 activeSection !== "rank" &&
//                                                 activeSection !== "notifications" && (
//                                                     <div className="h-full flex items-center justify-center">
//                                                         <div className="text-center">
//                                                             <h3 className="text-lg font-medium text-gray-500">
//                                                                 {activeSection.charAt(0).toUpperCase() +
//                                                                     activeSection.slice(1)}{" "}
//                                                                 settings will be implemented soon
//                                                             </h3>
//                                                             <p className="mt-2 text-sm text-gray-400">
//                                                                 This section is currently under development.
//                                                             </p>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                         </div>
//
//                                         {/* Footer Buttons */}
//                                         <div className="px-6 py-4 border-t flex justify-end space-x-3">
//                                             <button
//                                                 type="button"
//                                                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-300"
//                                                 onClick={onClose}
//                                             >
//                                                 Cancel
//                                             </button>
//                                             <button
//                                                 onClick={handleEditUserInformation}
//                                                 type="button"
//                                                 className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
//                                             >
//                                                 Save
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </Dialog.Panel>
//                         </Transition.Child>
//                     </div>
//                 </div>
//             </Dialog>
//         </Transition>
//     );
// }
