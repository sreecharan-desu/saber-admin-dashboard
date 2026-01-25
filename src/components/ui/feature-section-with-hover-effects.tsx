import { cn } from "@/lib/utils";
import {
    IconActivity,
    IconBrain,
    IconEyeOff,
    IconFilter,
    IconInfinity,
    IconLock,
    IconTarget,
    IconUserCheck,
} from "@tabler/icons-react";

export function FeaturesSectionWithHoverEffects() {
    const features = [
        {
            title: "Blind Hiring Engine",
            description:
                "Candidates and recruiters interact without identity signals, eliminating pedigree bias at the decision stage.",
            icon: <IconEyeOff />,
        },
        {
            title: "Skill-First Candidate Profiles",
            description:
                "Profiles are built from verified skills, projects, and assessments rather than resumes or brand names.",
            icon: <IconUserCheck />,
        },
        {
            title: "Challenge-Based Evaluation",
            description:
                "Role-specific technical and real-world challenges replace resume shortlisting.",
            icon: <IconTarget />,
        },
        {
            title: "Signal Scoring System",
            description: "Every interaction generates measurable signals that quantify true role fit over time.",
            icon: <IconActivity />,
        },
        {
            title: "Bias-Controlled Reveal Flow",
            description: "Identity is revealed only after objective thresholds are met, not upfront.",
            icon: <IconLock />,
        },
        {
            title: "Recruiter Noise Reduction",
            description:
                "Cuts down application spam by forcing intent, effort, and relevance from candidates.",
            icon: <IconFilter />,
        },
        {
            title: "AI Match Intelligence",
            description:
                "AI continuously matches candidates and roles using behavior, performance, and growth signals.",
            icon: <IconBrain />,
        },
        {
            title: "End-to-End Hiring Pipeline",
            description: "From discovery to final reveal, SABER manages the entire hiring flow in one system.",
            icon: <IconInfinity />,
        },
    ];
    return (
        <div className="max-w-7xl mx-auto py-10 relative z-10">
            <div className="text-center mb-16 px-4">
                <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-neutral-900 to-neutral-600">
                    SABER – Top 8 Core Features
                </h2>
                <p className="mt-4 text-neutral-600 text-lg max-w-2xl mx-auto">
                    A complete recruitment ecosystem designed for skills, not signals.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {features.map((feature, index) => (
                    <Feature key={feature.title} {...feature} index={index} />
                ))}
            </div>
        </div>
    );
}

const Feature = ({
    title,
    description,
    icon,
    index,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
}) => {
    return (
        <div
            className={cn(
                "flex flex-col lg:border-r border-neutral-200 py-10 relative group/feature",
                (index === 0 || index === 4) && "lg:border-l border-neutral-200",
                index < 4 && "lg:border-b border-neutral-200"
            )}
        >
            {index < 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-blue-50 to-transparent pointer-events-none" />
            )}
            {index >= 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-blue-50 to-transparent pointer-events-none" />
            )}
            <div className="mb-4 relative z-10 px-10 text-neutral-900">
                {icon}
            </div>
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-200 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-900">
                    {title}
                </span>
            </div>
            <p className="text-sm text-neutral-600 max-w-xs relative z-10 px-10">
                {description}
            </p>
        </div>
    );
};
