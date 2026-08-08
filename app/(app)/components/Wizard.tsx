"use client";

import { useState } from "react";

import Sidebar from "./Sidebar";
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

export default function Wizard({
  user,
}: WizardProps) {
  const [step, setStep] = useState(0);

  const [data, setData] = useState<RapSheetData>({
    rapName: "",
    username: "",
    avatarUrl: "",

    bio: "",
    city: "",

    genres: [],

    primaryRole: "",
  });

  function update<K extends keyof RapSheetData>(
    key: K,
    value: RapSheetData[K]
  ) {
    setData((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function next() {
    setStep((current) =>
      Math.min(current + 1, TOTAL_STEPS - 1)
    );
  }

  function previous() {
    setStep((current) =>
      Math.max(current - 1, 0)
    );
  }

  async function finish() {
    console.log({
      user,
      data,
    });

    // TODO:
    // await saveRapSheet(user.id, data);
  }

  return (
    <div className="grid min-h-screen grid-cols-[320px_1fr] bg-black text-white">
      <Sidebar />

      <main className="flex flex-col">
        <ProgressBar
          currentStep={step + 1}
          totalSteps={TOTAL_STEPS}
        />

        <div className="flex-1 p-12">
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
    user={user}
    data={data}
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
  onContinue={step === TOTAL_STEPS - 1 ? finish : next}
/>
      </main>
    </div>
  );
}