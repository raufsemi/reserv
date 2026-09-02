"use client";

import { useEffect, useState } from "react";
import { useBookingSettings } from "./useBookingSettings";
import {
  DAYS_OF_WEEK,
  type BookingSettingsUpdate,
} from "./booking-settings.types";

import { Button, Card, Checkbox, Input, Label, Switch } from "@heroui/react";

export function BookingSettingsForm() {
  const { settings, loading, saving, error, updateSettings } =
    useBookingSettings();

  const [form, setForm] = useState<BookingSettingsUpdate | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!settings) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      id: settings.id,
      booking_enabled: settings.booking_enabled,
      min_days_ahead: settings.min_days_ahead,
      max_days_ahead: settings.max_days_ahead,
      max_slots_per_user_per_day: settings.max_slots_per_user_per_day,
      allowed_days: settings.allowed_days ?? [],
    });
  }, [settings]);

  if (loading || !form) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loading booking settings...</p>
      </div>
    );
  }

  const updateField = <K extends keyof BookingSettingsUpdate>(
    field: K,
    value: BookingSettingsUpdate[K],
  ) => {
    setForm((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current,
    );

    setSaved(false);
  };

  const toggleDay = (day: number) => {
    setForm((current) => {
      if (!current) return current;

      const exists = current.allowed_days?.includes(day);

      return {
        ...current,
        allowed_days: exists
          ? current.allowed_days.filter((value) => value !== day)
          : [...current.allowed_days, day].sort((a, b) => a - b),
      };
    });

    setSaved(false);
  };

  const handleSave = async () => {
    if (form.min_days_ahead > form.max_days_ahead) {
      return;
    }
    if (form.allowed_days.length === 0) {
      return;
    }
    const success = await updateSettings(form);
    if (success) {
      setSaved(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Booking Settings
        </h1>

        <p className="mt-1 text-sm text-default-500">
          Control when and how users can make reservations.
        </p>
      </div>

      <div className="space-y-5">
        {/* Booking status */}
        <section className="rounded-2xl border border-default-200 bg-content1 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Booking status
              </h2>

              <p className="mt-1 text-sm text-default-500">
                Turn the booking system on or off.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={form.booking_enabled}
              onClick={() =>
                updateField("booking_enabled", !form.booking_enabled)
              }
              className={[
                "relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2",
                form.booking_enabled ? "bg-accent" : "bg-default-300",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all",
                  form.booking_enabled ? "left-5" : "left-0.5",
                ].join(" ")}
              />
            </button>
          </div>
        </section>

        {/* Booking window */}
        <section className="rounded-2xl border border-default-200 bg-content1 p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-foreground">
              Booking window
            </h2>

            <p className="mt-1 text-sm text-default-500">
              Control how far before or after today users can make reservations.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="min-days"
                className="block text-sm font-medium text-foreground"
              >
                Users can book
              </label>

              <div className="mt-2 flex items-center gap-3">
                <input
                  id="min-days"
                  type="number"
                  min={0}
                  value={form.min_days_ahead}
                  onChange={(event) =>
                    updateField("min_days_ahead", Number(event.target.value))
                  }
                  className="h-10 w-24 rounded-lg border border-default-200 bg-background px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />

                <span className="text-sm text-default-500">day(s) ahead</span>
              </div>
            </div>

            <div>
              <label
                htmlFor="max-days"
                className="block text-sm font-medium text-foreground"
              >
                Maximum
              </label>

              <div className="mt-2 flex items-center gap-3">
                <input
                  id="max-days"
                  type="number"
                  min={0}
                  value={form.max_days_ahead}
                  onChange={(event) =>
                    updateField("max_days_ahead", Number(event.target.value))
                  }
                  className="h-10 w-24 rounded-lg border border-default-200 bg-background px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />

                <span className="text-sm text-default-500">day(s) ahead</span>
              </div>
            </div>
          </div>
        </section>

        {/* Daily limit */}
        <section className="rounded-2xl border border-default-200 bg-content1 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">
            Reservation limit
          </h2>

          <p className="mt-1 text-sm text-default-500">
            Maximum number of slots one user can book per day.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <input
              type="number"
              min={1}
              value={form.max_slots_per_user_per_day}
              onChange={(event) =>
                updateField(
                  "max_slots_per_user_per_day",
                  Number(event.target.value),
                )
              }
              className="h-10 w-24 rounded-lg border border-default-200 bg-background px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />

            <span className="text-sm text-default-500">
              slot(s) per user per day
            </span>
          </div>
        </section>

        {/* Allowed days */}
        <section className="rounded-2xl border border-default-200 bg-content1 p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-foreground">
              Allowed booking days
            </h2>

            <p className="mt-1 text-sm text-default-500">
              Users can only book on the selected days.
            </p>
          </div>

          <div className="space-y-2">
            {DAYS_OF_WEEK.map((day) => {
              const checked = form.allowed_days.includes(day.value);

              return (
                <label
                  key={day.value}
                  className={[
                    "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                    checked
                      ? "border-accent/30 bg-accent/5"
                      : "border-default-200 bg-background hover:bg-default-100",
                  ].join(" ")}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleDay(day.value)}
                    className="h-4 w-4 cursor-pointer accent-accent"
                  />

                  <span className="text-sm font-medium text-foreground">
                    {day.label}
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-danger-200 bg-danger-50 p-4 text-sm font-medium text-danger-700">
            {error}
          </div>
        )}

        {/* Validation */}
        {form.min_days_ahead > form.max_days_ahead && (
          <div className="rounded-xl border border-danger-200 bg-danger-50 p-4 text-sm font-medium text-danger-700">
            Maximum booking days must be greater than or equal to minimum
            booking days.
          </div>
        )}

        {form.allowed_days.length === 0 && (
          <div className="rounded-xl border border-danger-200 bg-danger-50 p-4 text-sm font-medium text-danger-700">
            At least one booking day must be selected.
          </div>
        )}

        {/* Save */}
        <div className="flex items-center justify-end gap-4 pt-1">
          {saved && (
            <span className="text-sm font-medium text-success-600">
              Settings saved.
            </span>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              form.min_days_ahead > form.max_days_ahead ||
              form.allowed_days.length === 0
            }
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
