"use client";

import { useEffect, useState, useId } from "react";
import Image from "next/image";
import {
  X,
  Phone,
  CalendarDays,
  BadgeCheck,
  ShieldCheck,
  Clock,
  Mail,
  CheckCircle2,
  ChevronDown,
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

      // Default contact preference to action
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
      const agentFirstName = context.agent?.name ? context.agent.name.split(" ")[0] : (context.agency?.name || "Advisor");
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

      // 2. Perform the action-specific redirection/action
      if (context.action === "call") {
        setTimeout(() => {
          window.location.href = `tel:${agentPhone}`;
          closeLeadModal();
        }, 1200);
      } else if (context.action === "whatsapp") {
        setTimeout(() => {
          const encodedMsg = encodeURIComponent(
            `${message.trim()}\n\n— Sent via SpaceFlex by ${name.trim()} (${selectedCountry.dialCode} ${phoneNumber.trim()})`
          );
          window.open(`https://wa.me/${waAgentPhone}?text=${encodedMsg}`, "_blank");
          closeLeadModal();
        }, 1000);
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  const isCall = context.action === "call";
  const isWhatsApp = context.action === "whatsapp";
  const isViewing = context.action === "viewing";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-xs transition-all duration-300 sm:items-center sm:p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={closeLeadModal}
        aria-hidden="true"
      />

      {/* Modal / Bottom Sheet Box */}
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] border border-line bg-paper shadow-modal sm:rounded-3xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header Strip */}
        <div className="flex items-center justify-between border-b border-line bg-surface/70 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brass-tint text-brass">
              {isCall && <Phone size={14} />}
              {isWhatsApp && <WhatsAppIcon size={15} className="text-[#25D366]" />}
              {isViewing && <CalendarDays size={14} />}
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              {isCall ? "Call Advisor" : isWhatsApp ? "Direct WhatsApp" : "Private Viewing"}
            </span>
          </div>

          <button
            type="button"
            onClick={closeLeadModal}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 no-scrollbar">
          {success ? (
            /* ── Success State ── */
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-tint text-success ring-8 ring-success-tint/40">
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
                    ? `Dialling ${agentName}. Your details have been transmitted directly to their secure CRM.`
                    : isWhatsApp
                      ? `Redirecting to WhatsApp chat with ${agentName}. Your enquiry record has been logged.`
                      : `Thank you, ${name}. ${agentFirstName} from ${agentAgency} has received your schedule for ${viewingDate} (${viewingTimeSlot}) and will confirm via WhatsApp shortly.`}
                </p>
              </div>

              {isViewing && (
                <div className="mt-6 rounded-2xl border border-line bg-surface/70 p-4 text-left space-y-2 text-xs">
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
                    <span>Customer Contact</span>
                    <span className="font-medium text-ink">{selectedCountry.dialCode} {phoneNumber}</span>
                  </div>
                </div>
              )}

              {isViewing && (
                <button
                  type="button"
                  onClick={closeLeadModal}
                  className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-ink text-sm font-semibold text-paper shadow-xs transition-colors hover:bg-ink/90 cursor-pointer"
                >
                  Done
                </button>
              )}
            </div>
          ) : (
            /* ── Form State ── */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Context Summary Box */}
              <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-surface/60 p-3.5">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-brass/20">
                  <Image
                    src={agentPhoto}
                    alt={agentName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-ink truncate">
                      {agentName}
                    </span>
                    <BadgeCheck size={14} className="text-brass shrink-0" />
                  </div>
                  <p className="text-xs text-muted truncate">{agentAgency}</p>
                  {context.property && (
                    <p className="mt-1 text-[0.6875rem] font-medium text-brass truncate">
                      Re: {context.property.title} {context.property.price !== undefined && `(${typeof context.property.price === "number" ? formatPrice(context.property.price, context.property.currency || "QAR", true) : context.property.price})`}
                    </p>
                  )}
                </div>
              </div>

              {/* Informative Header Text */}
              <div>
                <h2 id="lead-modal-title" className="font-display text-lg font-semibold text-ink">
                  {isCall
                    ? `Call ${agentName}`
                    : isWhatsApp
                      ? `Chat with ${agentName} on WhatsApp`
                      : `Schedule a viewing with ${agentName}`}
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Confirm your details below to directly connect with this verified advisor.
                </p>
              </div>

              {errorMessage && (
                <div className="rounded-xl border border-danger/20 bg-danger-tint p-3 text-xs text-danger font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Name field */}
              <div className="space-y-1.5">
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

              {/* Phone Input with Qatar default & Country selector */}
              <div className="space-y-1.5">
                <label htmlFor={phoneInputId} className="block text-xs font-semibold text-ink">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <div className="group relative flex w-full items-center rounded-xl border border-line bg-raised transition-all duration-200 focus-within:border-brass focus-within:ring-2 focus-within:ring-brass/20">
                  {/* Country Code Dropdown Trigger */}
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

              {/* Email (Optional) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor={emailInputId} className="block text-xs font-semibold text-ink">
                    Email Address
                  </label>
                  <span className="text-[0.6875rem] text-faint">Optional</span>
                </div>
                <input
                  id={emailInputId}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="h-11 w-full rounded-xl border border-line bg-raised px-3.5 text-sm text-ink placeholder:text-faint transition-colors focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20"
                />
              </div>

              {/* Preferred Contact Method Pills */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ink">
                  Preferred Contact Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["whatsapp", "phone", "email"] as ContactPreference[]).map((method) => {
                    const active = contactPreference === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setContactPreference(method)}
                        className={cn(
                          "flex h-9 items-center justify-center gap-1.5 rounded-xl border text-xs font-semibold transition-all capitalize cursor-pointer",
                          active
                            ? "border-brass bg-brass-tint text-brass shadow-2xs"
                            : "border-line bg-surface/50 text-muted hover:bg-surface hover:text-ink"
                        )}
                      >
                        {method === "whatsapp" && <WhatsAppIcon size={14} className={active ? "text-brass" : "text-muted"} />}
                        {method === "phone" && <Phone size={13} />}
                        {method === "email" && <Mail size={13} />}
                        <span>{method}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Viewing Date & Time (Only for Viewing action) */}
              {isViewing && (
                <div className="rounded-2xl border border-line bg-surface/40 p-3.5 space-y-3">
                  <p className="text-xs font-semibold text-ink flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-brass" />
                    Preferred Viewing Schedule
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[0.6875rem] font-medium text-muted mb-1">
                        Select Date
                      </label>
                      <input
                        type="date"
                        required
                        value={viewingDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setViewingDate(e.target.value)}
                        className="h-10 w-full rounded-xl border border-line bg-raised px-3 text-xs text-ink focus:border-brass focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.6875rem] font-medium text-muted mb-1">
                        Time Window
                      </label>
                      <select
                        value={viewingTimeSlot}
                        onChange={(e) => setViewingTimeSlot(e.target.value)}
                        className="h-10 w-full rounded-xl border border-line bg-raised px-3 text-xs text-ink focus:border-brass focus:outline-none"
                      >
                        <option value="Morning (9am - 12pm)">Morning (9am - 12pm)</option>
                        <option value="Afternoon (12pm - 4pm)">Afternoon (12pm - 4pm)</option>
                        <option value="Evening (4pm - 7pm)">Evening (4pm - 7pm)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Message field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-ink">
                    Message to Advisor
                  </label>
                  <span className="text-[0.6875rem] text-faint">Editable</span>
                </div>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-line bg-raised p-3 text-xs text-ink leading-relaxed placeholder:text-faint transition-colors focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20 resize-none"
                />
              </div>

              {/* Trust Badge & Terms Note */}
              <div className="flex items-center gap-2 rounded-xl bg-surface p-2.5 text-[0.6875rem] text-muted">
                <ShieldCheck size={16} className="shrink-0 text-success" />
                <span>
                  Verified Licence {context.agency?.name ? `· ${context.agency.name}` : ""}. Your contact is protected and never spammed.
                </span>
              </div>

              {/* Action Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    "flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white shadow-lift transition-all duration-200 active:scale-[0.99] cursor-pointer",
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
                      {isCall && <Phone size={16} />}
                      {isWhatsApp && <WhatsAppIcon size={17} className="text-white" />}
                      {isViewing && <CalendarDays size={16} />}
                      <span>
                        {isCall
                          ? "Continue to Call"
                          : isWhatsApp
                            ? "Continue to WhatsApp"
                            : "Submit Viewing Request"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
