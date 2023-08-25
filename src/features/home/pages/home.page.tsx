import FirstIssue from "@/features/home/components/first-issue";
import Welcome from "@/features/home/components/welcome";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [isStepOneCompleted, setIsStepOneCompleted] = useState(false);

  useEffect(() => {
    const isCompleted = localStorage.getItem("stepOneCompleted") === "true";
    setIsStepOneCompleted(isCompleted);
  }, []);

  function moveToStepTwo() {
    localStorage.setItem("stepOneCompleted", "true");
    setIsStepOneCompleted(true);
  }

  function moveToStepOne() {
    localStorage.setItem("stepOneCompleted", "false");
    setIsStepOneCompleted(false);
  }

  return (
    <>
      {!isStepOneCompleted && <Welcome onSubmit={() => moveToStepTwo()} />}
      {isStepOneCompleted && (
        <FirstIssue
          onGoBack={() => moveToStepOne()}
          onSubmit={() => moveToStepTwo()}
        />
      )}
    </>
  );
}
