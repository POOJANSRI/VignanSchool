import { useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import app from "@/lib/firebase";
import { useRole } from "@/components/app/role-context";

const db = getFirestore(app);

export function useReports() {
  const { user } = useRole();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setReports([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setReports(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Failed to fetch reports:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  return { reports, loading };
}
