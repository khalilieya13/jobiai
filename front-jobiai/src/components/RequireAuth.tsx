// components/RequireAuth.tsx
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function RequireAuth({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must sign in first.");
            navigate("/login", { state: { from: location }, replace: true });
        } else {
            setIsAuthChecked(true);
        }
    }, [navigate, location]);

    if (!isAuthChecked) return null;
    return <>{children}</>;
}
