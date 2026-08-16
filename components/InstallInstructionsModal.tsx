"use client";

import { useEffect, useRef } from "react";
import { X, Share, Home, Plus, Menu, Download } from "lucide-react";
import type { InstallInstructions } from "@/hooks/usePwaInstall";

interface InstallInstructionsModalProps {
  instructions: InstallInstructions;
  onClose: () => void;
}

/**
 * Polished, responsive modal explaining how to install the PWA in browsers
 * that don't expose a native install prompt (iOS Safari, Safari macOS, Firefox,
 * and other browsers). Accessible: focus trap, Escape to close, backdrop click
 * to close, `role="dialog"` + `aria-modal`.
 */
export default function InstallInstructionsModal({
  instructions,
  onClose,
}: InstallInstructionsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus the close button on open; restore focus on unmount.
  useEffect(() => {
    closeButtonRef.current?.focus();
    const previouslyFocused = document.activeElement as HTMLElement | null;
    return () => {
      previouslyFocused?.focus?.();
    };
  }, []);

  // Escape to close.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Simple focus trap: keep Tab/Shift+Tab within the dialog.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Lock body scroll while the modal is open.
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const renderContent = () => {
    switch (instructions.kind) {
      case "ios":
        return (
          <>
            <h2 className="install-modal-title">অ্যাপটি ইনস্টল করুন</h2>
            <p className="install-modal-subtitle">
              আপনার iPhone / iPad-এ এই অ্যাপটি হোম স্ক্রিনে যোগ করতে নিচের
              ধাপগুলো অনুসরণ করুন:
            </p>
            <ol className="install-modal-steps">
              <li>
                <span className="install-modal-step-icon">
                  <Share size={18} aria-hidden="true" />
                </span>
                <span>
                  ব্রাউজারের নিচে <strong>Share</strong> (শেয়ার) বাটনে চাপুন
                </span>
              </li>
              <li>
                <span className="install-modal-step-icon">
                  <Home size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>Add to Home Screen</strong> (হোম স্ক্রিনে যোগ করুন)
                  নির্বাচন করুন
                </span>
              </li>
              <li>
                <span className="install-modal-step-icon">
                  <Plus size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>Add</strong> (যোগ করুন) বাটনে চাপুন
                </span>
              </li>
            </ol>
          </>
        );

      case "safari":
        return (
          <>
            <h2 className="install-modal-title">অ্যাপটি ইনস্টল করুন</h2>
            <p className="install-modal-subtitle">
              Safari-এ এই অ্যাপটি ডকে যোগ করতে নিচের ধাপগুলো অনুসরণ করুন:
            </p>
            <ol className="install-modal-steps">
              <li>
                <span className="install-modal-step-icon">
                  <Share size={18} aria-hidden="true" />
                </span>
                <span>
                  টুলবারের <strong>Share</strong> (শেয়ার) বাটনে চাপুন
                </span>
              </li>
              <li>
                <span className="install-modal-step-icon">
                  <Download size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>Add to Dock</strong> (ডকে যোগ করুন) নির্বাচন করুন
                </span>
              </li>
            </ol>
          </>
        );

      case "firefox":
        return (
          <>
            <h2 className="install-modal-title">অ্যাপটি ইনস্টল করুন</h2>
            <p className="install-modal-subtitle">
              Firefox-এ এই অ্যাপটি ইনস্টল করতে নিচের ধাপগুলো অনুসরণ করুন:
            </p>
            <ol className="install-modal-steps">
              <li>
                <span className="install-modal-step-icon">
                  <Menu size={18} aria-hidden="true" />
                </span>
                <span>
                  অ্যাড্রেস বারের পাশে <strong>মেনু (☰)</strong> বাটনে চাপুন
                </span>
              </li>
              <li>
                <span className="install-modal-step-icon">
                  <Download size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>Install App</strong> (অ্যাপ ইনস্টল করুন) বা{" "}
                  <strong>Add to Home Screen</strong> নির্বাচন করুন
                </span>
              </li>
            </ol>
          </>
        );

      case "generic":
      default:
        return (
          <>
            <h2 className="install-modal-title">অ্যাপটি ইনস্টল করুন</h2>
            <p className="install-modal-subtitle">
              এই অ্যাপটি আপনার ডিভাইসে ইনস্টল করতে ব্রাউজারের মেনু থেকে নিচের
              যেকোনো একটি অপশন খুঁজে বের করুন:
            </p>
            <ul className="install-modal-steps install-modal-list">
              <li>
                <span className="install-modal-step-icon">
                  <Download size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>Install App</strong> (অ্যাপ ইনস্টল করুন)
                </span>
              </li>
              <li>
                <span className="install-modal-step-icon">
                  <Home size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>Add to Home Screen</strong> (হোম স্ক্রিনে যোগ করুন)
                </span>
              </li>
              <li>
                <span className="install-modal-step-icon">
                  <Download size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>Add to Dock</strong> (ডকে যোগ করুন)
                </span>
              </li>
              <li>
                <span className="install-modal-step-icon">
                  <Menu size={18} aria-hidden="true" />
                </span>
                <span>অথবা ব্রাউজারের অনুরূপ যেকোনো অপশন</span>
              </li>
            </ul>
          </>
        );
    }
  };

  return (
    <div
      className="install-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="install-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-modal-title"
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="install-modal-close"
          onClick={onClose}
          aria-label="বন্ধ করুন"
          title="বন্ধ করুন"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <div className="install-modal-content">{renderContent()}</div>
      </div>
    </div>
  );
}