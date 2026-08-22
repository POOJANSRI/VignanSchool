import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ROLES, roleById } from "@/data/mock";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app, { auth } from "@/lib/firebase";

const db = getFirestore(app);
const Ctx = createContext(null);

export function RoleProvider({ children }) {
  const [roleId, setRoleIdState] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("August 2026");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setRoleIdState(userDoc.data().roleId);
          } else {
            setRoleIdState("principal"); // fallback if doc missing
          }
        } catch (e) {
          console.error("Failed to fetch user role:", e);
          setRoleIdState("principal");
        }
      } else {
        setRoleIdState(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const setRoleId = useCallback((id) => {
    setRoleIdState(id);
  }, []);

  const role = roleById(roleId);

  const value = useMemo(
    () => ({
      role,
      roleId,
      setRoleId,
      user,
      isLoading,
      period,
      setPeriod,
      roles: ROLES,
      userName: !roleId
        ? ""
        : roleId === "faculty"
          ? "Mrs. Lakshmi Prasanna"
          : roleId === "hod"
            ? "Mrs. Padma Kumari"
            : roleId === "coordinator"
              ? "Priya Sharma"
              : roleId === "management"
                ? "Mr. K. Venkat Rao"
                : roleId === "super_admin"
                  ? "System Administrator"
                  : "Dr. Sudhakar Reddy",
      can: (path) => {
        if (!role) return false;
        return role.nav.includes("*") || role.nav.some((p) => path === p || path.startsWith(p + "/"));
      }
    }),
    [role, roleId, setRoleId, user, isLoading, period],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRole() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}
