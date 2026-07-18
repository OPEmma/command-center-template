 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Missing GitHub token.");
    }

    const { repository, files } = await req.json();
    if (!repository || !Array.isArray(files)) {
      throw new Error("Missing repository or files in payload.");
    }

    // Verify the incoming request is genuinely authenticated inside that repo
    const repoCheck = await fetch(`https://api.github.com/repos/${repository}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "DevHub-Deploy",
      },
    });

    if (!repoCheck.ok) {
      throw new Error("GitHub token verification failed for this repository.");
    }

    const repoData = await repoCheck.json();
    const githubUsername = repoData.owner?.login;
    if (!githubUsername) {
      throw new Error("Could not resolve repository owner.");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Map the GitHub owner back to your DevHub user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("username")
      .eq("github_username", githubUsername)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!profile?.username) {
      throw new Error(
        `No DevHub profile linked to GitHub user "${githubUsername}".`,
      );
    }

    const username = profile.username;

    // Loop through compiled bundle assets and stream them into Supabase Storage
    for (const file of files) {
      const { path, content_base64, content_type } = file;
      if (!path || !content_base64) continue;

      const binary = Uint8Array.from(atob(content_base64), (c) => c.charCodeAt(0));

      const { error: uploadError } = await supabaseClient.storage
        .from("user-sites")
        .upload(`${username}${path}`, binary, {
          contentType: content_type || "application/octet-stream",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Failed to upload ${path}: ${uploadError.message}`);
      }
    }

    // Mark the site deployment active so Vercel knows to switch from template to custom code
    const { error: updateError } = await supabaseClient
      .from("profiles")
      .update({ has_custom_deployment: true })
      .eq("username", username);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, username, filesDeployed: files.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Deploy error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});