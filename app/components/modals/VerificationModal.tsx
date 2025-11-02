// import React, { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//     X,
//     Mail,
//     CheckCircle,
//     AlertCircle,
//     RefreshCw,
//     Shield,
// } from "lucide-react";
// import { toast } from "react-hot-toast";
//
// interface VerificationModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     userEmail: string;
//     onSuccess?: () => void;
// }
// const VerificationModal: React.FC<VerificationModalProps> = ({
//                                                                  isOpen,
//                                                                  onClose,
//                                                                  userEmail,
//                                                                  onSuccess
//                                                              }) => {
//     const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isResending, setIsResending] = useState(false);
//     const [resendCooldown, setResendCooldown] = useState(0);
//
//     const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
//
//     // Cooldown timer
//     useEffect(() => {
//         let interval: NodeJS.Timeout;
//         if (resendCooldown > 0) {
//             interval = setInterval(() => {
//                 setResendCooldown(prev => prev - 1);
//             }, 1000);
//         }
//         return () => clearInterval(interval);
//     }, [resendCooldown]);
//
//     const resetForm = () => {
//         setVerificationCode(["", "", "", "", "", ""]);
//         setError(null);
//         setSuccess(false);
//         setIsLoading(false);
//     };
//
//     useEffect(() => {
//         if (!isOpen) {
//             setTimeout(() => {
//                 resetForm();
//             }, 300);
//         } else {
//             // Focus first input when modal opens
//             setTimeout(() => {
//                 inputRefs.current[0]?.focus();
//             }, 100);
//         }
//     }, [isOpen]);
//
//     const handleInputChange = (index: number, value: string) => {
//         if (value.length > 1) return;
//
//         const newCode = [...verificationCode];
//         newCode[index] = value;
//         setVerificationCode(newCode);
//         setError(null);
//
//         if (value && index < 5) {
//             inputRefs.current[index + 1]?.focus();
//         }
//     };
//
//     const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
//         if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
//             inputRefs.current[index - 1]?.focus();
//         }
//         if (e.key === "Enter") {
//             handleVerify();
//         }
//     };
//
//     const handlePaste = (e: React.ClipboardEvent) => {
//         e.preventDefault();
//         const paste = e.clipboardData.getData("text");
//         const digits = paste.replace(/\D/g, "").slice(0, 6);
//
//         if (digits.length === 6) {
//             const newCode = digits.split("");
//             setVerificationCode(newCode);
//             setError(null);
//             inputRefs.current[5]?.focus();
//         }
//     };
//
//     const handleVerify = async () => {
//         const code = verificationCode.join("");
//
//         if (code.length !== 6) {
//             setError("Please enter the 6-digit code in full.");
//             return;
//         }
//
//         setIsLoading(true);
//         setError(null);
//
//         try {
//             const result = await dispatch(userVerification({
//                 verification_code: code
//             })).unwrap();
//
//             if (result.status) {
//                 setSuccess(true);
//                 toast.success("Your email address has been successfully verified!");
//                 try {
//                     const tokenResult = await dispatch(getUserToken({})).unwrap();
//                     if (tokenResult) {
//                         dispatch(setLoginUser(tokenResult));
//                     }
//                 } catch (e) {
//                     console.error("there is no user ınfo:", e);
//                 }
//                 setTimeout(() => {
//                     onSuccess?.();
//                     onClose();
//                 }, 2000);
//             } else {
//                 setError("Incorrect verification code. Please try again.");
//                 setVerificationCode(["", "", "", "", "", ""]);
//                 inputRefs.current[0]?.focus();
//             }
//         } catch (error) {
//             setError("An error occurred during verification. Please try again.");
//             setVerificationCode(["", "", "", "", "", ""]);
//             inputRefs.current[0]?.focus();
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     const handleResendCode = async () => {
//         if (resendCooldown > 0) return;
//
//         setIsResending(true);
//         setError(null);
//
//         try {
//             const result = await dispatch(reUserVerification({
//                 user_email: userEmail
//             })).unwrap();
//
//             if (result.status) {
//                 toast.success("The new verification code has been sent to your email address!");
//                 setResendCooldown(60); // 60 second cooldown
//             } else {
//                 setError("There was an error sending the code. Please try again.");
//             }
//         } catch (error) {
//             setError("There was an error sending the code. Please try again.");
//         } finally {
//             setIsResending(false);
//         }
//     };
//
//     const maskEmail = (email: string) => {
//         const [username, domain] = email.split("@");
//         const maskedUsername = username.slice(0, 2) + "*".repeat(username.length - 2);
//         return `${maskedUsername}@${domain}`;
//     };
//
//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//                     onClick={onClose}
//                 >
//                     <motion.div
//                         initial={{ scale: 0.95, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         exit={{ scale: 0.95, opacity: 0 }}
//                         transition={{ type: "spring", damping: 30 }}
//                         className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         {/* Left side with illustration */}
//                         <div className="hidden md:block w-1/2 bg-gradient-to-b from-green-50 to-emerald-100 p-8 relative overflow-hidden">
//                             <div className="absolute inset-0 opacity-10">
//                                 <div
//                                     className="absolute inset-0"
//                                     style={{
//                                         backgroundImage:
//                                             "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2310b981' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E\")",
//                                         backgroundSize: "150px 150px",
//                                     }}
//                                 ></div>
//                             </div>
//
//                             <div className="relative z-10 h-full flex flex-col">
//                                 <div className="flex-1">
//                                     <h2 className="text-3xl font-bold text-emerald-900 mb-6">
//                                         Verify E-mail
//                                     </h2>
//                                     <p className="text-emerald-800 opacity-75 mb-8">
//                                         Verify your email address to keep your account secure.
//                                     </p>
//
//                                     {/* Security shield illustration */}
//                                     <div className="relative mt-12 mx-auto w-64 h-64">
//                                         <div className="absolute inset-0 flex items-center justify-center">
//                                             <motion.div
//                                                 animate={{
//                                                     scale: [1, 1.05, 1],
//                                                     rotate: [0, 2, 0],
//                                                 }}
//                                                 transition={{
//                                                     repeat: Infinity,
//                                                     duration: 4,
//                                                     ease: "easeInOut",
//                                                 }}
//                                                 className="w-40 h-40 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl"
//                                             >
//                                                 <Shield className="w-20 h-20 text-white" />
//                                             </motion.div>
//                                         </div>
//
//                                         {/* Animated floating elements */}
//                                         <motion.div
//                                             animate={{
//                                                 y: [0, -15, 0],
//                                                 x: [0, 10, 0],
//                                             }}
//                                             transition={{
//                                                 repeat: Infinity,
//                                                 duration: 3,
//                                                 ease: "easeInOut",
//                                             }}
//                                             className="absolute top-8 right-8 bg-gradient-to-br from-blue-400 to-blue-600 w-8 h-8 rounded-full"
//                                         />
//                                         <motion.div
//                                             animate={{
//                                                 y: [0, -20, 0],
//                                                 x: [0, -8, 0],
//                                             }}
//                                             transition={{
//                                                 repeat: Infinity,
//                                                 duration: 4,
//                                                 ease: "easeInOut",
//                                                 delay: 0.5,
//                                             }}
//                                             className="absolute top-16 left-4 bg-gradient-to-br from-purple-400 to-purple-600 w-6 h-6 rounded-full"
//                                         />
//                                         <motion.div
//                                             animate={{
//                                                 y: [0, -12, 0],
//                                                 x: [0, 5, 0],
//                                             }}
//                                             transition={{
//                                                 repeat: Infinity,
//                                                 duration: 2.5,
//                                                 ease: "easeInOut",
//                                                 delay: 1,
//                                             }}
//                                             className="absolute bottom-12 right-12 bg-gradient-to-br from-yellow-400 to-orange-500 w-10 h-10 rounded-lg rotate-45"
//                                         />
//                                     </div>
//                                 </div>
//
//                                 <div className="mt-auto">
//                                     <div className="flex items-center gap-3 text-emerald-800">
//                                         <CheckCircle className="w-5 h-5 text-green-500" />
//                                         <span>Secure verification system</span>
//                                     </div>
//                                     <div className="flex items-center gap-3 text-emerald-800 mt-3">
//                                         <CheckCircle className="w-5 h-5 text-green-500" />
//                                         <span>Secures your account</span>
//                                     </div>
//                                     <div className="flex items-center gap-3 text-emerald-800 mt-3">
//                                         <CheckCircle className="w-5 h-5 text-green-500" />
//                                         <span>One-time verification</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//
//                         <div className="w-full md:w-1/2 p-8 relative">
//                             <button
//                                 onClick={onClose}
//                                 className="absolute right-4 top-4 p-1 text-gray-500 hover:text-gray-700 transition-colors"
//                             >
//                                 <X className="w-6 h-6" />
//                             </button>
//
//                             <div className="flex flex-col items-center">
//                                 {!success ? (
//                                     <>
//                                         {/* Header */}
//                                         <div className="text-center mb-8">
//                                             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                                 <Mail className="w-8 h-8 text-blue-600" />
//                                             </div>
//                                             <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                                                 Verification Code
//                                             </h3>
//                                             <p className="text-gray-600 text-sm">
//                                                 <span className="font-medium">{maskEmail(userEmail)}</span> Enter the 6-digit code sent to
//                                             </p>
//                                         </div>
//
//                                         {/* Error Message */}
//                                         {error && (
//                                             <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm mb-6 flex items-center gap-2">
//                                                 <AlertCircle className="w-4 h-4" />
//                                                 {error}
//                                             </div>
//                                         )}
//
//                                         {/* Verification Code Inputs */}
//                                         <div className="flex gap-3 mb-6" onPaste={handlePaste}>
//                                             {verificationCode.map((digit, index) => (
//                                                 <input
//                                                     key={index}
//                                                     ref={(el:any) => inputRefs.current[index] = el}
//                                                     type="text"
//                                                     maxLength={1}
//                                                     value={digit}
//                                                     onChange={(e) => handleInputChange(index, e.target.value)}
//                                                     onKeyDown={(e) => handleKeyDown(index, e)}
//                                                     className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
//                                                     disabled={isLoading}
//                                                 />
//                                             ))}
//                                         </div>
//
//                                         {/* Verify Button */}
//                                         <button
//                                             onClick={handleVerify}
//                                             disabled={isLoading || verificationCode.join("").length !== 6}
//                                             className={`w-full py-3 rounded-lg font-medium transition-all ${
//                                                 isLoading || verificationCode.join("").length !== 6
//                                                     ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                                                     : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
//                                             }`}
//                                         >
//                                             {isLoading ? (
//                                                 <div className="flex items-center justify-center gap-2">
//                                                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                                                     It is being verified...
//                                                 </div>
//                                             ) : (
//                                                 "verify code"
//                                             )}
//                                         </button>
//
//                                         {/* Resend Code */}
//                                         <div className="mt-6 text-center">
//                                             <p className="text-gray-600 text-sm mb-2">If no code is received:</p>
//                                             <button
//                                                 onClick={handleResendCode}
//                                                 disabled={isResending || resendCooldown > 0}
//                                                 className={`flex items-center gap-2 text-sm transition-colors ${
//                                                     isResending || resendCooldown > 0
//                                                         ? "text-gray-400 cursor-not-allowed"
//                                                         : "text-blue-600 hover:text-blue-800"
//                                                 }`}
//                                             >
//                                                 <RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />
//                                                 {resendCooldown > 0
//                                                     ? `try again (${resendCooldown}s)`
//                                                     : isResending
//                                                         ? "sending..."
//                                                         : "sent new code"
//                                                 }
//                                             </button>
//                                         </div>
//                                     </>
//                                 ) : (
//                                     /* Success State */
//                                     <motion.div
//                                         initial={{ scale: 0.8, opacity: 0 }}
//                                         animate={{ scale: 1, opacity: 1 }}
//                                         className="text-center"
//                                     >
//                                         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                             <CheckCircle className="w-10 h-10 text-green-600" />
//                                         </div>
//                                         <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                                             Verification Successful!
//                                         </h3>
//                                         <p className="text-gray-600">
//                                             Your email address has been successfully verified. You are being redirected...
//                                         </p>
//                                     </motion.div>
//                                 )}
//                             </div>
//                         </div>
//                     </motion.div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// };
//
// export default VerificationModal;