"use client";

import React from "react";
import { redirect, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function GoogleOAuth() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const { data, error, isLoading } = useQuery({
    queryKey: ["google-oauth", code],
    queryFn: async () => {
      const res = await fetch(
        `/api/auth/google-calendar/callback?code=${code}`,
      );
      console.log("---", res);
      return (await res.json()) as { refresh_token: string };
    },
  });

  React.useEffect(() => {
    if (!isLoading && data?.refresh_token) {
      localStorage.setItem("google_refresh_token", data.refresh_token);
      redirect("/");
    }
  }, [data, isLoading]);

  if (!code) {
    return <div>Error: No code provided</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <div>Loading...</div>;
}
