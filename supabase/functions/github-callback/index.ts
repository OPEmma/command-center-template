import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state"); // Captures the user ID

    // VALIDATION: Strict verification of required parameters
    if (!code) {
      throw new Error("Missing authorization code from GitHub.");
    }
    if (!state) {
      throw new Error(
        "Missing state parameter (authenticated user ID verification failed).",
      );
    }

    // 1. Exchange temporary code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: Deno.env.get("GITHUB_CLIENT_ID"),
          client_secret: Deno.env.get("GITHUB_CLIENT_SECRET"),
          code,
        }),
      },
    );

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error("Failed to retrieve a valid access token from GitHub.");
    }

    // 2. Fetch GitHub Profile data
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userResponse.ok) {
      throw new Error(
        "Failed to authenticate profile ownership request with GitHub.",
      );
    }

    const userData = await userResponse.json();
    const githubUsername = userData.login;

    // 3. Clone/Fork your template repo into their new repo space
    const repoName = "my-devhub-portfolio";
    const generateResponse = await fetch(
      `https://api.github.com/repos/OPEmma/command-center-template/generate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "User-Agent": "DevHub-Platform",
        },
        body: JSON.stringify({
          owner: githubUsername,
          name: repoName,
          description: "Deployed instantly via DevHub Platform",
          private: false,
        }),
      },
    );

    const generateData = await generateResponse.json();

    // ERROR HANDLING: Handle duplicate repository naming conflicts or API blocks
    if (!generateResponse.ok) {
      throw new Error(
        `GitHub repository generation failed: ${generateData.message || generateResponse.statusText}`,
      );
    }

    const deployedRepoUrl = generateData.html_url;

    // 4. Safely update user profile record in Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const { error: dbError } = await supabaseClient
      .from("profiles")
      .update({
        github_repo_url: deployedRepoUrl,
        github_username: githubUsername,
      })
      .eq("id", state);

    if (dbError) {
      throw new Error(`Database profile update failed: ${dbError.message}`);
    }

    // Seamless UX redirect to app dashboard workspace root
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: `https://devhub.ng/dashboard?connect=success`,
      },
    });
  } catch (error) {
    console.error(`[OAuth Error Context]: ${error.message}`);
    // Redirect cleanly to frontend with the descriptive URL error parameter
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: `https://devhub.ng/dashboard?connect=error&message=${encodeURIComponent(error.message)}`,
      },
    });
  }
});
