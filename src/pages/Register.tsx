import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";
import { PasswordInput } from "@/components/ui/password-input";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";

// Translation object
const translations = {
  en: {
    titleGovernment: "Government Office Registration",
    titleResident: "Resident Registration",
    firstName: "First Name",
    lastName: "Last Name",
    officeName: "Office Name",
    email: "Email",
    phoneNumber: "Phone Number",
    nationalId: "National ID",
    location: "Location",
    description: "Description",
    password: "Password",
    confirmPassword: "Confirm Password",
    register: "Register",
    registering: "Registering...",
    haveAccount: "Already have an account?",
    loginHere: "Login here",
    verificationRequired: "Email Verification Required",
    verificationDescription: "Please verify your email before registering",
    verificationExpired: "Email verification has expired. Please verify your email again.",
    passwordMismatch: "Passwords do not match",
    successGovernment: "Registration successful! Please wait for approval.",
    successResident: "Registration successful! You can now login.",
    error: "Error",
    registrationFailed: "Registration failed"
  },
  am: {
    titleGovernment: "የመንግስት ቢሮ ምዝገባ",
    titleResident: "የነዋሪ ምዝገባ",
    firstName: "የመጀመሪያ ስም",
    lastName: "የአባት ስም",
    officeName: "የቢሮ ስም",
    email: "ኢሜይል",
    phoneNumber: "ስልክ ቁጥር",
    nationalId: "ብሔራዊ መታወቂያ",
    location: "አድራሻ",
    description: "መግለጫ",
    password: "የይለፍ ቃል",
    confirmPassword: "የይለፍ ቃል አረጋግጥ",
    register: "ይመዝገቡ",
    registering: "ይመዝገባል...",
    haveAccount: "አካውንት አለዎት?",
    loginHere: "እዚህ ይግቡ",
    verificationRequired: "የኢሜል ማረጋገጫ ያስፈልጋል",
    verificationDescription: "እባክዎ ከምዝገባው በፊት ኢሜልዎን ያረጋግጡ",
    verificationExpired: "የኢሜል ማረጋገጫው ጊዜው አልፏል። እባክዎ እንደገና ያረጋግጡ።",
    passwordMismatch: "የይለፍ ቃላት አይዛመዱም",
    successGovernment: "ምዝገባ ተሳክቷል! እባክዎ ለፀድቂያ ይጠብቁ።",
    successResident: "ምዝገባ ተሳክቷል! አሁን መግባት ይችላሉ።",
    error: "ስህተት",
    registrationFailed: "ምዝገባ አልተሳካም"
  }
};

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nationalId: "",
    password: "",
    confirmPassword: "",
    location: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { language } = useAuth();

  // Get translations based on current language
  const t = translations[language as keyof typeof translations] || translations.en;

  // Get user type and verified email from location state
  const userType = location.state?.userType || "resident";
  const verifiedEmail = location.state?.verifiedEmail;

  // Check for verified email on component mount
  useEffect(() => {
    if (!verifiedEmail || !authService.isEmailVerified(verifiedEmail, userType)) {
      navigate("/verify-email");
      return;
    }

    // Pre-fill the email field with verified email
    setFormData(prev => ({
      ...prev,
      email: verifiedEmail
    }));
  }, [verifiedEmail, userType, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number format
    const phoneNumber = formData.phoneNumber;
    const isValidFormat = /^(\+2519|09)\d{8}$/.test(phoneNumber);
    
    if (!isValidFormat) {
      toast({
        title: t.error,
        description: "Phone number must start with +2519 or 09 followed by 8 digits (e.g., +251912345678 or 0912345678)",
        variant: "destructive",
      });
      return;
    }

    // Double check email verification
    if (!authService.isEmailVerified(formData.email, userType)) {
      toast({
        title: t.error,
        description: t.verificationExpired,
        variant: "destructive",
      });
      navigate("/verify-email");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t.error,
        description: t.passwordMismatch,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (userType === 'government') {
        const governmentData = {
          name: formData.firstName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          location: formData.location,
          description: formData.description,
        };
        await authService.registerGovernment(governmentData);
      } else {
        await authService.registerResident({
          name: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          nationalId: formData.nationalId
        });
      }
      
      // Clear email verification after successful registration
      authService.clearEmailVerification();
      
      toast({
        title: "Success",
        description: userType === 'government' ? t.successGovernment : t.successResident,
      });
      navigate("/login");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || t.registrationFailed;
      toast({
        title: t.error,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Theme-based styles
  const lightModeStyles = {
    background: "bg-gray-50",
    cardBackground: "bg-white",
    textColor: "text-gray-800",
    inputBackground: "bg-gray-100",
    borderColor: "border-gray-200",
    buttonHover: "hover:bg-blue-600",
  };

  const darkModeStyles = {
    background: "bg-[#1A1A1A]",
    cardBackground: "bg-[#2D2D2D]",
    textColor: "text-white",
    inputBackground: "bg-[#1A1A1A]",
    borderColor: "border-[#404040]",
    buttonHover: "hover:bg-blue-700",
  };

  const currentStyles = theme === "dark" ? darkModeStyles : lightModeStyles;

  return (
    <div className={`flex flex-col min-h-screen ${currentStyles.background}`}>
      <Header />
      <main className={`flex-1 flex items-center justify-center py-16 ${currentStyles.background}`}>
        <div className={`w-full max-w-md p-8 rounded-lg shadow-lg transition-all duration-300 ${currentStyles.cardBackground} ${currentStyles.borderColor} border`}>
          <h1 className={`${currentStyles.textColor} text-3xl font-bold mb-6 text-center`}>
            {userType === 'government' ? t.titleGovernment : t.titleResident}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {userType === 'resident' ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className={currentStyles.textColor}>{t.firstName}</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder={t.firstName}
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`${currentStyles.inputBackground} ${currentStyles.textColor} ${currentStyles.borderColor}`}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className={currentStyles.textColor}>{t.lastName}</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder={t.lastName}
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`${currentStyles.inputBackground} ${currentStyles.textColor} ${currentStyles.borderColor}`}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="firstName" className={currentStyles.textColor}>{t.officeName}</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder={t.officeName}
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`${currentStyles.inputBackground} ${currentStyles.textColor} ${currentStyles.borderColor}`}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className={currentStyles.textColor}>{t.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t.email}
                value={formData.email}
                onChange={handleChange}
                className={`${currentStyles.inputBackground} ${currentStyles.textColor} ${currentStyles.borderColor}`}
                required
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className={currentStyles.textColor}>{t.phoneNumber}</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder={t.phoneNumber}
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`${currentStyles.inputBackground} ${currentStyles.textColor} ${currentStyles.borderColor}`}
                required
              />
            </div>

            {userType === 'resident' && (
              <div className="space-y-2">
                <Label htmlFor="nationalId" className={currentStyles.textColor}>{t.nationalId}</Label>
                <Input
                  id="nationalId"
                  name="nationalId"
                  placeholder={t.nationalId}
                  value={formData.nationalId}
                  onChange={handleChange}
                  className={`${currentStyles.inputBackground} ${currentStyles.textColor} ${currentStyles.borderColor}`}
                  required
                />
              </div>
            )}

            {userType === 'government' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="location" className={currentStyles.textColor}>{t.location}</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder={t.location}
                    value={formData.location}
                    onChange={handleChange}
                    className={`${currentStyles.inputBackground} ${currentStyles.textColor} ${currentStyles.borderColor}`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className={currentStyles.textColor}>{t.description}</Label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder={t.description}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className={`w-full min-h-[100px] rounded-md ${currentStyles.inputBackground} ${currentStyles.textColor} ${currentStyles.borderColor} border p-2`}
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className={currentStyles.textColor}>{t.password}</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder={t.password}
                value={formData.password}
                onChange={handleChange}
                className={`${currentStyles.inputBackground} ${currentStyles.textColor} ${currentStyles.borderColor}`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={currentStyles.textColor}>{t.confirmPassword}</Label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                placeholder={t.confirmPassword}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`${currentStyles.inputBackground} ${currentStyles.textColor} ${currentStyles.borderColor}`}
                required
              />
            </div>

            <Button 
              type="submit" 
              className={`w-full bg-blue-500 ${currentStyles.buttonHover} text-white mt-4 transition-colors duration-300`}
              disabled={isLoading}
            >
              {isLoading ? t.registering : t.register}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className={currentStyles.textColor}>
              {t.haveAccount}{" "}
              <Link to="/login" className="text-blue-500 hover:underline font-medium">
                {t.loginHere}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer text="© 2024 Community Reports. All rights reserved." darkMode={theme === "dark"} />
    </div>
  );
};

export default Register;