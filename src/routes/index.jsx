import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Lock, Mail, ShieldCheck, Sparkles, UserPlus, LogIn } from "lucide-react";
import { toast } from "sonner";
import { ROLES } from "@/data/mock";
import { useRole } from "@/components/app/role-context";
import { useKpis } from "@/hooks/use-kpis";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import app, { auth } from "@/lib/firebase";
import { getFirestore } from "firebase/firestore";

const db = getFirestore(app);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in · VIGNAN PARENT VOICE AI" },
      {
        name: "description",
        content:
          "Secure sign-in to VIGNAN PARENT VOICE AI — the parent feedback and continuous-improvement platform for Vignan School, Kondapur, Hyderabad.",
      },
      {
        property: "og:title",
        content: "VIGNAN PARENT VOICE AI — Listen. Understand. Act. Improve.",
      },
      {
        property: "og:description",
        content:
          "AI-powered parent feedback, issue tracking and improvement measurement for Vignan School.",
      },
    ],
  }),
  component: LoginPage,
});

const PILLARS = ["Listen", "Understand", "Identify", "Act", "Measure", "Improve"];

const getRoleEmailDomain = (roleId) => {
  const domains = {
    super_admin: "@admin.vignan.edu",
    principal: "@principal.vignan.edu",
    hod: "@hod.vignan.edu",
    coordinator: "@coordinator.vignan.edu",
    management: "@management.vignan.edu",
    faculty: "@faculty.vignan.edu",
    parent: "@parent.vignan.edu",
  };
  return domains[roleId] || "@vignan.edu";
};

function LoginPage() {
  const { roleId, role, isLoading } = useRole();
  const kpis = useKpis();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("principal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted && !isLoading && roleId && role) {
    return <Navigate to={role.home} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email.trim().toLowerCase().endsWith("@vignan.edu")) {
      toast.error("Invalid Workspace Email", { description: "You must use an official @vignan.edu address." });
      setError("Email must end with @vignan.edu");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Weak Password", { description: "Password must be at least 8 characters long." });
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCred.user.uid), {
          email: userCred.user.email,
          roleId: selectedRole,
          createdAt: new Date(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // role-context listener will pick up the user, fetch role, and trigger the <Navigate> above
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to authenticate");
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
  };

  return (
    <div className="flex min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Mobile & Tablet View (Full screen gradient with floating card) */}
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-6 lg:hidden gradient-navy">
        {/* Header Content above the form */}
        <div className="mb-8 flex flex-col items-center text-center text-navy-foreground">
          <span className="mb-4 flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-white/25 shadow-xl">
            <img src="/logo.jpg" alt="Vignan Parent Voice AI" className="h-full w-full object-cover" />
          </span>
          <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
            VIGNAN PARENT VOICE AI
          </h1>
          <p className="mt-2 text-sm text-navy-foreground/80 sm:text-base">Listen. Understand. Act. Improve.</p>
        </div>

        {/* Floating Login Card */}
        <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl ring-1 ring-black/5 sm:p-8">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            {isSignUp ? "Create your workspace" : "Sign in to your workspace"}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {isSignUp ? "Register a new account and select your role." : "Use your credentials. Access is fully audited."}
          </p>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="email-mobile" className="text-xs font-medium text-foreground">
                Email
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email-mobile"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
              <p className="mt-1.5 text-[10px] text-muted-foreground">Must end with @vignan.edu</p>
            </div>
            <div>
              <label htmlFor="password-mobile" className="text-xs font-medium text-foreground">
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password-mobile"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
              <p className="mt-1.5 text-[10px] text-muted-foreground">Minimum 8 characters</p>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="role-mobile" className="text-xs font-medium text-foreground">
                  Select your role
                </label>
                <select
                  id="role-mobile"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!isSignUp && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="size-4 rounded border-border accent-primary"
                  />
                  Remember me
                </label>
                <button type="button" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isLoading}
              className="mt-2 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-70 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading || isLoading ? (
                "Processing..."
              ) : isSignUp ? (
                <><UserPlus className="size-4" /> Create Account</>
              ) : (
                <><LogIn className="size-4" /> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Need access?"}{" "}
            <button onClick={toggleMode} className="font-semibold text-primary hover:underline">
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </div>
        </div>

        <p className="mt-8 text-xs text-navy-foreground/60 text-center max-w-sm">
          Demonstration environment · sample data · no official school assets used
        </p>
      </div>

      {/* Desktop Premium Sidebar (lg only) */}
      <div className="gradient-navy relative hidden flex-col justify-between p-12 text-navy-foreground lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-white/25 shadow-lg">
            <img src="/logo.jpg" alt="Vignan Parent Voice AI Logo" className="h-full w-full object-cover" />
          </span>
          <div>
            <p className="text-sm font-semibold">Vignan School</p>
            <p className="text-xs text-navy-foreground/70">Kondapur, Hyderabad</p>
          </div>
        </div>

        <div className="max-w-lg">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            VIGNAN PARENT VOICE AI
          </h1>
          <p className="mt-3 text-lg text-navy-foreground/80">Listen. Understand. Act. Improve.</p>
          <p className="mt-6 text-sm leading-relaxed text-navy-foreground/75">
            An AI-powered parent feedback and continuous-improvement platform. Every parent
            conversation becomes a measurable insight, a tracked action and a verified improvement.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {PILLARS.map((p) => (
              <li
                key={p}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide"
              >
                {p.toUpperCase()}
              </li>
            ))}
          </ul>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { v: kpis.loading ? "..." : kpis.parentsContacted, l: "Parents contacted" },
              { v: kpis.loading ? "..." : `${kpis.responseRate}%`, l: "Response rate" },
              { v: kpis.loading ? "..." : `${kpis.avgSatisfaction}/5`, l: "Avg satisfaction" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-white/15 bg-white/8 p-3 backdrop-blur-sm">
                <p className="text-xl font-semibold">{s.v}</p>
                <p className="text-[11px] text-navy-foreground/70">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-navy-foreground/60">
          Demonstration environment · sample data · no official school assets used
        </p>
      </div>

      {/* Desktop Login Form Area (lg only) */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-background p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold text-foreground tracking-tight">
            {isSignUp ? "Create your workspace" : "Sign in to workspace"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignUp ? "Register a new account and select your role." : "Use your credentials. Access is role-based and fully audited."}
          </p>

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="email" className="text-xs font-medium text-foreground">
                Email
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all hover:bg-muted/30"
                  required
                />
              </div>
              <p className="mt-1.5 text-[10px] text-muted-foreground ml-1">Must end with @vignan.edu</p>
            </div>
            <div>
              <label htmlFor="password" className="text-xs font-medium text-foreground">
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all hover:bg-muted/30"
                  required
                />
              </div>
              <p className="mt-1.5 text-[10px] text-muted-foreground ml-1">Minimum 8 characters</p>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="role" className="text-xs font-medium text-foreground">
                  Select your role
                </label>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all hover:bg-muted/30 cursor-pointer"
                >
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-muted-foreground">
                  {ROLES.find((r) => r.id === selectedRole)?.description}
                </p>
              </div>
            )}

            {!isSignUp && (
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="size-4 rounded border-border accent-primary"
                  />
                  Remember me
                </label>
                <button type="button" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isLoading}
              className="mt-4 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow disabled:opacity-70 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading || isLoading ? (
                "Processing..."
              ) : isSignUp ? (
                <><UserPlus className="size-4" /> Create Account</>
              ) : (
                <><LogIn className="size-4" /> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Need access?"}{" "}
            <button onClick={toggleMode} className="font-semibold text-primary hover:underline">
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-accent/25 bg-accent/5 p-4 text-xs text-foreground/80">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
              Parent contact details, recordings and transcripts are permission-gated and every
              access is written to the audit log.
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-foreground/80">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
              AI assists analysis only. Serious complaints are always routed to authorised school
              personnel.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
