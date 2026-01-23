import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, User, RefreshCw, Briefcase } from "lucide-react";

interface Signal {
  signal_id: string;
  candidate_id: string;
  intent_text: string;
  skills: Array<{ name: string }>;
  job_id: string;
  job_problem: string;
  received_at: string;
}

export default function Signals() {
  const {
    data: signals = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["signals"],
    queryFn: async () => {
      const res = await api.get("/recruiters/signals");
      return res.data.signals || [];
    },
    staleTime: 1000 * 30, // 30 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-10 w-48 skeleton bg-gray-200" />
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 card-base skeleton bg-gray-50 opacity-50"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-foreground">
            Signals
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-normal">
            Candidates who expressed interest in your challenges.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="btn-secondary h-11 w-11 p-0 flex items-center justify-center border-gray-200"
          title="Refresh Signals"
          disabled={isRefetching}
        >
          <RefreshCw
            size={16}
            className={isRefetching ? "animate-spin" : "text-gray-500"}
          />
        </button>
      </div>

      {signals.length === 0 ? (
        <div className="card-base p-20 text-center border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-full border border-gray-100 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="text-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">
            No signals yet
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-2 leading-relaxed">
            As soon as candidates swipe right on your challenges, they'll appear
            here for you to review and instantly match with.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {signals.map((signal: Signal, idx: number) => (
            <motion.div
              key={signal.signal_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card-base p-0 overflow-hidden group hover:border-black transition-all bg-white"
            >
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/30">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-300">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Candidate Signal
                      </p>
                      <p className="text-xs font-mono text-gray-500">
                        {new Date(signal.received_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <blockquote className="text-lg font-bold text-foreground tracking-tight leading-snug mb-6">
                    "{signal.intent_text}"
                  </blockquote>

                  <div className="flex flex-wrap gap-2">
                    {signal.skills.map((skill: any) => (
                      <span
                        key={skill.name}
                        className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-tight"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full md:w-80 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase size={12} className="text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Interested In
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-black line-clamp-2 leading-relaxed">
                      {signal.job_problem}
                    </h4>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() =>
                        (window.location.href = `/applications?job_id=${signal.job_id}`)
                      }
                      className="w-full btn-primary h-11 flex items-center justify-center gap-2 text-xs font-bold tracking-tight uppercase"
                    >
                      Process Signal
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
