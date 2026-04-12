import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";

export function useLoginMutation() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: any) => authService.login(data),
    onSuccess: (res) => {
      if (res.ok) {
        navigate("/dashboard");
      }
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  return () => {
    authService.logout();
    navigate("/login");
  };
}
