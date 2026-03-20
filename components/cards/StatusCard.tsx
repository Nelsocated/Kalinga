import type {
  NotificationItem,
  NotificationStatus,
} from "@/app/site/notification/page";
import BackButton from "../ui/BackButton";

type Props = {
  item: NotificationItem;
  onOpenDetails?: () => void;
  onClose?: () => void;
};

type StepKey =
  | "pending"
  | "under_review"
  | "contacting_applicant"
  | "approved"
  | "not_approved"
  | "adopted"
  | "withdrawn";

type Step = {
  key: StepKey;
  label: string;
};

const statusIndexMap: Record<NotificationStatus, number> = {
  pending: 0,
  under_review: 1,
  contacting_applicant: 2,
  not_approved: 3,
  approved: 3,
  withdrawn: 4,
  adopted: 4,
};

function getStatusColor(status: StepKey) {
  switch (status) {
    case "adopted":
      return "bg-adopted border-adopted";
    case "withdrawn":
      return "bg-withdrawn border-withdrawn";
    case "approved":
      return "bg-approved border-approved";
    case "not_approved":
      return "bg-reject border-reject";
    case "contacting_applicant":
      return "bg-contacting border-contacting";
    case "under_review":
      return "bg-under_review border-under_review";
    default:
      return "bg-submitted border-submitted";
  }
}

function getStatusTextColor(status: StepKey) {
  switch (status) {
    case "adopted":
      return "text-adopted";
    case "withdrawn":
      return "text-withdrawn";
    case "approved":
      return "text-approved";
    case "not_approved":
      return "text-reject";
    case "contacting_applicant":
      return "text-contacting";
    case "under_review":
      return "text-under_review";
    default:
      return "text-submitted";
  }
}

function getSteps(status: NotificationStatus): Step[] {
  const decisionStep: Step =
    status === "not_approved"
      ? { key: "not_approved", label: "Not Approved" }
      : { key: "approved", label: "Approved" };

  const finalStep: Step =
    status === "withdrawn"
      ? { key: "withdrawn", label: "Withdrawn" }
      : { key: "adopted", label: "Adopted" };

  return [
    { key: "pending", label: "Submitted" },
    { key: "under_review", label: "Under Review" },
    { key: "contacting_applicant", label: "Contacting Applicant" },
    decisionStep,
    finalStep,
  ];
}

export default function StatusCard({ item, onClose }: Props) {
  const activeIndex = statusIndexMap[item.status];
  const steps = getSteps(item.status);

  return (
    <div className="h-[50svh] overflow-hidden rounded-[15px] border-2 bg-white shadow-sm">
      <div className="relative bg-primary px-6 py-4">
        <div className="absolute left-6 top-1/2 -translate-y-1/2">
          <BackButton onClick={onClose} />
        </div>

        <h2 className="text-center text-2xl font-extrabold">{item.title}</h2>
      </div>

      <div className="p-6 md:p-10">
        {/* MOBILE */}
        <div className="relative flex flex-col gap-8 md:hidden">
          {/* one vertical line */}
          <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-primary" />

          {steps.map((step, index) => {
            const isReached = index <= activeIndex;
            const isCurrent = index === activeIndex;
            const stepColor = getStatusColor(step.key);
            const stepTextColor = getStatusTextColor(step.key);

            return (
              <div key={step.key} className="relative flex items-center gap-4">
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                    isReached ? `${stepColor} text-white` : "border bg-white"
                  } ${isCurrent ? "ring-4 ring-primary" : ""}`}
                />

                <p
                  className={`text-base font-medium ${
                    isReached ? stepTextColor : "text-primary"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* DESKTOP */}
        <div className="relative hidden md:block pt-15">
          {/* one horizontal line centered with circles */}
          <div className="absolute left-[10%] right-[10%] top-20 h-0.5 bg-primary " />

          <div className="grid grid-cols-5">
            {steps.map((step, index) => {
              const isReached = index <= activeIndex;
              const isCurrent = index === activeIndex;
              const stepColor = getStatusColor(step.key);
              const stepTextColor = getStatusTextColor(step.key);

              return (
                <div
                  key={step.key}
                  className="relative flex flex-col items-center"
                >
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      isReached ? `${stepColor} text-white` : "border bg-white"
                    } ${isCurrent ? "ring-4 ring-primary" : ""}`}
                  />

                  <p
                    className={`mt-4 text-center text-base font-medium ${
                      isReached ? stepTextColor : "text-primary"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
