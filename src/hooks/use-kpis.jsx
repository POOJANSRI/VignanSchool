import { useState, useEffect } from "react";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import app from "@/lib/firebase";

const db = getFirestore(app);

export function useKpis() {
  const [kpis, setKpis] = useState({ loading: true });

  useEffect(() => {
    const docRef = doc(db, "metrics", "current");
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        const DEFAULT_KPIS = {
          parentsContacted: 0,
          responseRate: 0,
          avgSatisfaction: 0,
          sentimentPositive: 0,
          sentimentNeutral: 0,
          sentimentNegative: 0,
          sentimentMixed: 0,
          responsesThisWeek: 0,
          criticalIssues: 0,
          callsMade: 0,
          responses: 0,
          callCompletion: 0,
          resolutionRate: 0,
          consentCaptured: 0,
          recordingRetention: 90,
          optOutsHonoured: 0,
          unreadAlerts: 0,
        };

        if (snap.exists()) {
          setKpis({ ...DEFAULT_KPIS, ...snap.data(), loading: false });
        } else {
          setKpis({ ...DEFAULT_KPIS, loading: false });
        }
      },
      (error) => {
        console.error("Failed to fetch KPIs:", error);
        setKpis((prev) => ({ ...prev, loading: false }));
      }
    );

    return () => unsubscribe();
  }, []);

  return kpis;
}
