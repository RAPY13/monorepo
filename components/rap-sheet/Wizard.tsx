"use client";

import { useState } from "react";

import ProgressBar from "./ProgressBar";
import StepIdentity from "./StepIdentity";
import StepProfile from "./StepProfile";
import StepRole from "./StepRole";
import StepReview from "./StepReview";
import WizardNavigation from "./WizardNavigation";

import type { RapSheetData } from "./types";

type WizardProps = {
  user: {
    id: string;
    email: string;
  };
};

const TOTAL_STEPS = 4;

const INITIAL_DATA: RapSheetData = {
  rapName: "",
  username: "",
  avatarUrl: "",
  bio: "",
  city: "",
  genres: [],
  primaryRole: "",
};

export default function Wizard({ user }: WizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<RapSheetData>(INITIAL_DATA);

  function update<K extends keyof RapSheetData>(
    key: K,
    value: RapSheetData[K],
  ) {
    setData((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function next() {
    setStep((current) =>
      Math.min(current + 1, TOTAL_STEPS - 1),
    );
  }

  function previous() {
    setStep((current) =>
      Math.max(current - 1, 0),
    );
  }

  async function finish() {
    console.log("[RapSheet] Completing creator record", {
      user,
      data,
    });

    // TODO:
    // await saveRapSheet(user.id, data);
  }

  return (
    <main className="flex min-h-[70vh] flex-col">
      <ProgressBar
        currentStep={step + 1}
        totalSteps={TOTAL_STEPS}
      />

      <div className="flex-1 p-6 sm:p-8 lg:p-12">
        {step === 0 && (
          <StepIdentity
            data={data}
            update={update}
          />
        )}

        {step === 1 && (
          <StepProfile
            data={data}
            update={update}
          />
        )}

        {step === 2 && (
          <StepRole
            data={data}
            update={update}
          />
        )}

        {step === 3 && (
          <StepReview
            data={data}
            user={user}
          />
        )}
      </div>

      <WizardNavigation
        currentStep={step + 1}
        totalSteps={TOTAL_STEPS}
        progress={((step + 1) / TOTAL_STEPS) * 100}
        canGoBack={step > 0}
        canContinue={true}
        onBack={previous}
        onContinue={
          step === TOTAL_STEPS - 1
            ? finish
            : next
        }
      />
    </main>
  );
}