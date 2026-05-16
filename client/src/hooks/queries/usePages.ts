import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { handleRequest } from "@/lib/api";
import {
  type Page,
  type PageMessage,
} from "@doospace/shared";

export const usePages = () => {
  const queryClient = useQueryClient();

  const useListPages = () => {
    return useQuery({
      queryKey: ["pages"],
      queryFn: async () => {
        const res = await handleRequest<Page[]>(api.get("/pages"));
        return res.data || [];
      },
    });
  };

  const usePage = (id: string) => {
    return useQuery({
      queryKey: ["pages", id],
      queryFn: async () => {
        const res = await handleRequest<{ page: Page; messages: PageMessage[] }>(
          api.get(`/pages/${id}`)
        );
        return res.data;
      },
      enabled: !!id,
    });
  };

  const useCreatePage = () => {
    return useMutation({
      mutationFn: async (name: string) => {
        const res = await handleRequest<Page>(api.post("/pages", { name }));
        if (!res.ok) throw new Error(res.message);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pages"] });
      },
    });
  };

  const useDeletePage = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        await handleRequest(api.delete(`/pages/${id}`));
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pages"] });
      },
    });
  };

  const usePageChat = (id: string) => {
    return useMutation({
      mutationFn: async (message: string) => {
        const res = await handleRequest<{ content: string }>(
          api.post(`/pages/${id}/chat`, { message })
        );
        if (!res.ok) throw new Error(res.message);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pages", id] });
      },
    });
  };

  return {
    useListPages,
    usePage,
    useCreatePage,
    useDeletePage,
    usePageChat,
  };
};
