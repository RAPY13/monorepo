"use client";

type WizardProps = {
  currentStep: number;
  totalSteps: number;
  progress: number;
  canGoBack: boolean;
  canContinue: boolean;
  onBack: () => void;
  onContinue: () => void | Promise<void>;
};

export default function WizardNavigation({
  currentStep,
  totalSteps,
  progress,
  canGoBack,
  canContinue,
  onBack,
  onContinue,
}: WizardProps) {
  return (
    <footer className="border-t border-white/10 p-6 flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        className="px-4 py-2 rounded bg-white/10 disabled:opacity-40"
      >
        Back
      </button>

      <div className="text-sm text-white/70">
        Step {currentStep} of {totalSteps} ({Math.round(progress)}%)
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="px-4 py-2 rounded bg-white text-black disabled:opacity-40"
      >
        {currentStep === totalSteps ? "Finish" : "Continue"}
      </button>
    </footer>
  );
}