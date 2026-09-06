"use client";

import { useEffect, useState, useId } from "react";
import Image from "next/image";
import {
  X,
  Phone,
  CalendarDays,
  BadgeCheck,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { useLeadCapture } from "@/lib/store/lead-store";
import { COUNTRIES, type CountryCode } from "@/components/ui/phone-input";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ContactPreference, ContactTimeSlot } from "@/lib/types/leads-and-reviews";

export function LeadCaptureModal() {
  const { activeModal, closeLeadModal, submitLead, savedProfile } = useLeadCapture();
  const { isOpen, context } = activeModal;

  const [name, setName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [contactPreference, setContactPreference] = useState<ContactPreference>("whatsapp");
  const [preferredTime, setPreferredTime] = useState<ContactTimeSlot>("Any time");
  const [viewingDate, setViewingDate] = useState("");
  const [viewingTimeSlot, setViewingTimeSlot] = useState("Morning (9am - 12pm)");
  const [message, setMessage] = useState("");
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const nameInputId = useId();
  const phoneInputId = useId();
  const emailInputId = useId();

  // Reset and pre-populate fields when modal opens
  useEffect(() => {
    if (isOpen && context) {
      setSuccess(false);
      setSubmitting(false);
      setErrorMessage("");
      setShowOptionalDetails(false);

      // Pre-fill from remembered customer profile if available
      if (savedProfile) {
        setName(savedProfile.name || "");
        setPhoneNumber(savedProfile.phone || "");
        setEmail(savedProfile.email || "");
        const foundCountry = COUNTRIES.find((c) => c.dialCode === savedProfile.countryCode);
        if (foundCountry) setSelectedCountry(foundCountry);
      } else {
        setName("");
        setPhoneNumber("");
        setEmail("");
        setSelectedCountry(COUNTRIES[0]); // Qatar +974
      }

      // Automatically determine preferred contact method based on action
      if (context.action === "call") {
        setContactPreference("phone");
      } else if (context.action === "whatsapp") {
        setContactPreference("whatsapp");
      } else {
        setContactPreference(savedProfile?.contactPreference || "whatsapp");
      }

      // Default viewing date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setViewingDate(tomorrow.toISOString().split("T")[0]);
      setViewingTimeSlot("Morning (9am - 12pm)");

      // Default contextual message
      const agentFirstName = context.agent?.name
        ? context.agent.name.split(" ")[0]
        : (context.agency?.name || "Advisor");
      const propertyTitle = context.property?.title || "your listing";
      const community = context.property?.community ? ` in ${context.property.community}` : "";

      if (context.action === "viewing") {
        setMessage(`Hi ${agentFirstName}, I would like to schedule a private viewing of ${propertyTitle}${community}.`);
      } else if (context.action === "call") {
        setMessage(`Hi ${agentFirstName}, I am interested in ${propertyTitle}${community}. Please call me regarding pricing and availability.`);
      } else {
        setMessage(`Hi ${agentFirstName}, I am interested in ${propertyTitle}${community}. I would like to know more details.`);
      }
    }
  }, [isOpen, context, savedProfile]);

  // Lock background body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeLeadModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeLeadModal]);

  if (!isOpen || !context) return null;

  const agentName = context.agent?.name || context.agency?.name || "Advisor";
  const agentFirstName = context.agent?.name ? context.agent.name.split(" ")[0] : (context.agency?.name || "Advisor");
  const agentAgency = context.agent?.agency || context.agency?.name || "Licensed Brokerage";
  const agentPhoto = context.agent?.photo || context.agency?.logo || "/ai-avatar.png";
  const agentPhone = (context.agent?.phone || "+974 5555 0100").replace(/[^0-9+]/g, "");
  const waAgentPhone = (context.agent?.phone || "+974 5555 0100").replace(/[^0-9]/g, "");

  const isCall = context.action === "call";
  const isWhatsApp = context.action === "whatsapp";
  const isViewing = context.action === "viewing";

  const headerTitle = isCall
    ? `Call ${agentFirstName}`
    : isWhatsApp
      ? `WhatsApp ${agentFirstName}`
      : isViewing
        ? "Request a Viewing"
        : `Connect with ${agentFirstName}`;

  const submitButtonText = isCall
    ? `Call ${agentFirstName}`
    : isWhatsApp
      ? "Continue to WhatsApp"
      : isViewing
        ? "Schedule Viewing"
        : "Send Enquiry";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate phone number
    const cleanDigits = phoneNumber.replace(/[^0-9]/g, "");
    if (cleanDigits.length < 7) {
      setErrorMessage("Please enter a valid phone number.");
      return;
    }

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Save the lead in the central store
      await submitLead({
        customerName: name.trim(),
        phone: `${selectedCountry.dialCode} ${phoneNumber.trim()}`,
        countryCode: selectedCountry.dialCode,
        email: email.trim() || undefined,
        contactPreference,
        preferredTime,
        message: message.trim(),
        action: context.action,
        propertyId: context.property?.id,
        propertyName: context.property?.title,
        propertySlug: context.property?.slug,
        agencyId: context.agency?.id || context.agent?.agencyId || "ag1",
        agencyName: context.agency?.name || context.agent?.agency || "Agency",
        agentId: context.agent?.id || "agent-main",
        agentName: context.agent?.name || context.agency?.name || "Agency Advisor",
        sourcePage: typeof window !== "undefined" ? window.location.pathname : "",
        viewingDate: context.action === "viewing" ? viewingDate : undefined,
        viewingTimeSlot: context.action === "viewing" ? viewingTimeSlot : undefined,
      });

      setSuccess(true);

      // 2. Perform the action-specific redirection
      if (context.action === "call") {
        setTimeout(() => {
          window.location.href = `tel:${agentPhone}`;
          closeLeadModal();
        }, 1200);
      } else if (context.action === "whatsapp") {
        setTimeout(() => {
          const encodedMsg = encodeURIComponent(
            message ||
              `Hi ${agentFirstName}, I'm interested in ${context.property?.title || "your listing"}. I'd like more details.`
          );
          window.open(`https://wa.me/${waAgentPhone}?text=${encodedMsg}`, "_blank");
          closeLeadModal();
        }, 1200);
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-xs transition-all duration-300 sm:items-center sm:p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={closeLeadModal}
        aria-hidden="true"
      />

      {/* ── Modal / Mobile Screen Container ── */}
      <div className="relative flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-paper sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-3xl sm:border sm:border-line sm:shadow-modal animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* ── Compact Sticky Header ── */}
        <div className="sticky top-0 z-20 shrink-0 flex items-center justify-between border-b border-line bg-paper/95 px-4 py-3 sm:px-6 sm:py-3.5 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] sm:pt-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Back button on mobile */}
            <button
              type="button"
              onClick={closeLeadModal}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink sm:hidden cursor-pointer shrink-0 -ml-1"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brass-tint text-brass shrink-0">
              {isCall && <Phone size={13} />}
              {isWhatsApp && <WhatsAppIcon size={14} className="text-[#25D366]" />}
              {isViewing && <CalendarDays size={13} />}
            </div>

            <div className="min-w-0">
              <h2 id="lead-modal-title" className="text-sm font-semibold text-ink truncate leading-tight">
                {headerTitle}
              </h2>
              <p className="text-[0.6875rem] text-muted truncate leading-tight mt-0.5">
                {agentAgency}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeLeadModal}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Success State or Form Flow ── */}
        {success ? (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-4 overscroll-contain">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-tint text-success ring-8 ring-success-tint/40">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-ink">
                  {isCall
                    ? "Connecting you to advisor…"
                    : isWhatsApp
                      ? "Opening WhatsApp…"
                      : "Viewing Request Submitted!"}
                </h3>
                <p className="mt-2 text-xs text-muted max-w-sm mx-auto leading-relaxed">
                  {isCall
                    ? `Dialling ${agentName}. Your contact details have been transmitted directly to their secure CRM.`
                    : isWhatsApp
                      ? `Redirecting to WhatsApp chat with ${agentName}. Your enquiry has been registered.`
                      : `Thank you, ${name}. ${agentFirstName} from ${agentAgency} has received your schedule for ${viewingDate} (${viewingTimeSlot}) and will confirm via WhatsApp shortly.`}
                </p>
              </div>

              {isViewing && (
                <div className="mt-4 w-full max-w-sm rounded-2xl border border-line bg-surface/70 p-4 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between text-muted">
                    <span>Advisor</span>
                    <span className="font-medium text-ink">{agentName} ({agentAgency})</span>
                  </div>
                  {context.property && (
                    <div className="flex items-center justify-between text-muted">
                      <span>Property</span>
                      <span className="font-medium text-ink truncate max-w-[200px]">{context.property.title}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-muted">
                    <span>Requested Date</span>
                    <span className="font-medium text-ink">{viewingDate} · {viewingTimeSlot}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span>Your Contact</span>
                    <span className="font-medium text-ink">{selectedCountry.dialCode} {phoneNumber}</span>
                  </div>
                </div>
              )}
            </div>

            {isViewing && (
              <div className="sticky bottom-0 z-20 shrink-0 border-t border-line bg-paper/95 p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md">
                <button
                  type="button"
                  onClick={closeLeadModal}
                  className="flex h-11 sm:h-12 w-full items-center justify-center rounded-2xl bg-ink text-sm font-semibold text-paper shadow-xs transition-colors hover:bg-ink/90 cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        ) : (
          <form
            id="lead-capture-form"
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* ── Scrollable Form Area ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3.5 sm:px-6 sm:py-5 space-y-3.5">
              {/* Compact Agent & Property Summary Strip */}
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface/60 p-2.5 sm:p-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-brass/20">
                  <Image
                    src={agentPhoto}
                    alt={agentName}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="font-semibold text-xs text-ink truncate">
                      {agentName}
                    </span>
                    <BadgeCheck size={13} className="text-brass shrink-0" />
                    <span className="text-[0.6875rem] text-muted truncate">
                      · {agentAgency}
                    </span>
                  </div>
                  {context.property && (
                    <p className="mt-0.5 text-[0.6875rem] font-medium text-brass truncate leading-tight">
                      Re: {context.property.title}
                      {context.property.price !== undefined &&
                        ` (${typeof context.property.price === "number" ? formatPrice(context.property.price, context.property.currency || "QAR", true) : context.property.price})`}
                    </p>
                  )}
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-xl border border-danger/20 bg-danger-tint p-2.5 text-xs text-danger font-medium">
                  {errorMessage}
                </div>
              )}

              {/* ── Primary Core Fields (Direct Conversion) ── */}
              <div className="space-y-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label htmlFor={nameInputId} className="block text-xs font-semibold text-ink">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    id={nameInputId}
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sheikh Mohammed"
                    className="h-11 w-full rounded-xl border border-line bg-raised px-3.5 text-sm text-ink placeholder:text-faint transition-colors focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20"
                  />
                </div>

                {/* Phone Number Input with Country Code */}
                <div className="space-y-1">
                  <label htmlFor={phoneInputId} className="block text-xs font-semibold text-ink">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <div className="group relative flex w-full items-center rounded-xl border border-line bg-raised transition-all duration-200 focus-within:border-brass focus-within:ring-2 focus-within:ring-brass/20">
                    <div className="relative flex shrink-0 items-center border-r border-line/80 bg-surface/60 px-3 h-11 text-sm font-medium text-ink rounded-l-xl select-none">
                      <span className="mr-1.5 text-base leading-none" aria-hidden="true">
                        {selectedCountry.flag}
                      </span>
                      <span className="font-semibold text-xs text-ink">{selectedCountry.dialCode}</span>
                      <ChevronDown size={13} className="ml-1 text-muted" />

                      <select
                        aria-label="Country Dial Code"
                        value={selectedCountry.code}
                        onChange={(e) => {
                          const found = COUNTRIES.find((c) => c.code === e.target.value);
                          if (found) setSelectedCountry(found);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none text-base"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name} ({c.dialCode})
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      id={phoneInputId}
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={selectedCountry.placeholder}
                      className="h-11 w-full bg-transparent px-3.5 text-sm text-ink placeholder:text-faint focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* ── Viewing Schedule (Only for Viewing action) ── */}
              {isViewing && (
                <div className="rounded-2xl border border-line bg-surface/40 p-3 space-y-2.5">
                  <p className="text-xs font-semibold text-ink flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-brass" />
                    <span>Preferred Viewing Schedule</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[0.6875rem] font-medium text-muted mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        value={viewingDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setViewingDate(e.target.value)}
                        className="h-10 w-full rounded-xl border border-line bg-raised px-2.5 text-xs text-ink focus:border-brass focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.6875rem] font-medium text-muted mb-1">
                        Time Window
                      </label>
                      <select
                        value={viewingTimeSlot}
                        onChange={(e) => setViewingTimeSlot(e.target.value)}
                        className="h-10 w-full rounded-xl border border-line bg-raised px-2 text-xs text-ink focus:border-brass focus:outline-none"
                      >
                        <option value="Morning (9am - 12pm)">Morning (9am - 12pm)</option>
                        <option value="Afternoon (12pm - 4pm)">Afternoon (12pm - 4pm)</option>
                        <option value="Evening (4pm - 7pm)">Evening (4pm - 7pm)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Expandable Optional Details (Email & Custom Message) ── */}
              <div className="rounded-2xl border border-line bg-surface/30 overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => setShowOptionalDetails(!showOptionalDetails)}
                  className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs font-semibold text-ink hover:bg-surface/60 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 text-muted">
                    <MessageSquare size={13} className="text-brass" />
                    <span>Add email or custom message (optional)</span>
                  </span>
                  {showOptionalDetails ? (
                    <ChevronUp size={14} className="text-muted" />
                  ) : (
                    <ChevronDown size={14} className="text-muted" />
                  )}
                </button>

                {showOptionalDetails && (
                  <div className="p-3.5 pt-1 space-y-3 border-t border-line/60 animate-in fade-in slide-in-from-top-1 duration-150">
                    {/* Email field */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label htmlFor={emailInputId} className="block text-[0.6875rem] font-semibold text-muted">
                          Email Address
                        </label>
                        <span className="text-[0.625rem] text-faint">Optional</span>
                      </div>
                      <input
                        id={emailInputId}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="h-9 w-full rounded-xl border border-line bg-raised px-3 text-xs text-ink placeholder:text-faint focus:border-brass focus:outline-none"
                      />
                    </div>

                    {/* Message field */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[0.6875rem] font-semibold text-muted">
                          Message to Advisor
                        </label>
                        <span className="text-[0.625rem] text-faint">Prefilled</span>
                      </div>
                      <textarea
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full rounded-xl border border-line bg-raised p-2.5 text-xs text-ink leading-relaxed placeholder:text-faint focus:border-brass focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ── Trust Note ── */}
              <div className="flex items-center gap-2 rounded-xl bg-surface/80 p-2 text-[0.6875rem] text-muted">
                <ShieldCheck size={14} className="shrink-0 text-success" />
                <span className="truncate">
                  Verified Licence {context.agency?.name ? `· ${context.agency.name}` : ""}. Your contact is protected.
                </span>
              </div>
            </div>

            {/* ── Sticky Bottom Action Area ── */}
            <div className="sticky bottom-0 z-20 shrink-0 border-t border-line bg-paper/95 p-3 sm:p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  "flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-2xl text-xs sm:text-sm font-semibold text-white shadow-lift transition-all duration-200 active:scale-[0.99] cursor-pointer",
                  isWhatsApp
                    ? "bg-[#25D366] hover:bg-[#20bd5a]"
                    : isCall
                      ? "bg-brass hover:bg-brass-deep"
                      : "bg-ink hover:bg-ink/90",
                  submitting && "opacity-75 cursor-not-allowed"
                )}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Connecting…
                  </span>
                ) : (
                  <>
                    {isCall && <Phone size={15} />}
                    {isWhatsApp && <WhatsAppIcon size={16} className="text-white" />}
                    {isViewing && <CalendarDays size={15} />}
                    <span>{submitButtonText}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
