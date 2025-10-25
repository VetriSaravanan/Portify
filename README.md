# AI Instant Portfolio Generator (with Supabase Backend)

> **IMPORTANT SECURITY WARNING**: This application is intended as a demonstration and portfolio-building tool. It contains a hardcoded **Vercel API token** in `App.tsx`. For a real-world production application, you should **never** expose API keys on the client-side. The recommended approach is to create a secure backend proxy (e.g., a Vercel Serverless Function) to handle API requests to Vercel, keeping the token safe on the server.

Go from a resume document to a live, beautiful, multi-page portfolio website in under 30 seconds. This application leverages Google's Gemini AI to parse any resume and generates a portfolio that is saved to your secure user account, powered by Supabase.

## Table of Contents

1.  [Key Features](#key-features)
2.  [Technology Stack](#technology-stack)
3.  [Backend Setup with Supabase (Required)](#backend-setup-with-supabase-required)
4.  [How It Works: End-to-End Process](#how-it-works-end-to-end-process)
5.  [How to Use the Application](#how-to-use-the-application)
6.  [Troubleshooting](#troubleshooting)
7.  [Project File Structure](#project-file-structure)

---

## Key Features

-   **Secure User Accounts**: Sign up and log in to create and manage your portfolio.
-   **Cloud-Based Persistence**: Your portfolio data, original resume file, and a complete history of your live deployment URLs are securely saved to your account in the cloud (via Supabase).
-   **Instant AI Resume Parsing**: Upload a PDF or image of your resume, and the AI will read and structure the content.
-   **Live Preview & Editing**: Edit any detail of your portfolio and see the changes in real-time.
-   **Multi-Page Experience**: A fluid, modern user experience with seamless navigation between portfolio pages.
-   **Thematic Customization**: Instantly switch between multiple professional themes (e.g., Tech, Creative, Executive).
-   **Drag-and-Drop Reordering**: Easily change the order of your portfolio sections and individual items.
-   **Undo/Redo Functionality**: A complete history of your changes allows you to undo and redo any action.
-   **One-Click Export**: Download your entire portfolio as a self-contained Single Page Application, ready for hosting anywhere.
-   **One-Click Vercel Deployment**: Host your portfolio on Vercel instantly to get a live, shareable URL, with every deployment saved to your profile.

---

## Technology Stack

-   **Frontend**: React, TypeScript, React Router
-   **Backend**: Supabase (Authentication, PostgreSQL Database, Storage)
-   **Styling**: Tailwind CSS
-   **AI**: Google Gemini API (`@google/genai` SDK)
-   **Deployment**: Vercel API
-   **Utilities**: JSZip, ReactDOMServer

---

## Backend Setup with Supabase (Required)

You **must** complete these steps to make the application functional.

### Step 1: Create a Supabase Project

1.  Go to [supabase.com](https://supabase.com) and sign up or log in.
2.  Create a new project. Save your **Project URL** and **anon (public) key**.

### Step 2: Configure Supabase Credentials

1.  Open the file `lib/supabaseClient.ts` in your project.
2.  Replace the placeholder values with your actual Supabase Project URL and anon key. While hardcoding is acceptable for this tool, the best practice for production is to use environment variables.

    ```javascript
    const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL_HERE';
    const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY_HERE';
    ```

### Step 3: Run SQL Commands to Set Up Database

1.  In your Supabase project dashboard, navigate to the **SQL Editor**.
2.  Click **"+ New query"**.
3.  Copy and run each of the following SQL commands one by one.

    **1. Create the `portfolios` table:**
    This table will store all the portfolio data for your users.

    ```sql
    CREATE TABLE public.portfolios (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
      resume_data JSONB,
      theme TEXT,
      is_dark_mode BOOLEAN,
      resume_file_path TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    ```
    > **Note for Existing Users**: If you already have a `portfolios` table, run this command to remove the old deployment column: 
    > `ALTER TABLE public.portfolios DROP COLUMN IF EXISTS deployment_url;`


    **2. Create the `deployments` table for deployment history:**
    This table stores a record of every successful Vercel deployment.
    ```sql
    CREATE TABLE public.deployments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      url TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    ```

    **3. Create a function to auto-update timestamps:**
    This ensures the `updated_at` column is always current on the main portfolio table.

    ```sql
    CREATE FUNCTION public.handle_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    ```

    **4. Create a trigger to use the function:**
    This automatically runs the function whenever a portfolio is updated.

    ```sql
    CREATE TRIGGER on_portfolio_update
      BEFORE UPDATE ON public.portfolios
      FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
    ```

    **5. Enable Row-Level Security (RLS) on both tables:**
    This is a **critical security step**. It ensures users can ONLY access their own data.

    ```sql
    ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
    ```

    **6. Create Security Policies for the `portfolios` table:**

    ```sql
    -- Policy: Allow users to view their own portfolio.
    CREATE POLICY "Allow individual read access"
    ON public.portfolios
    FOR SELECT
    USING (auth.uid() = user_id);

    -- Policy: Allow users to create their own portfolio.
    CREATE POLICY "Allow individual insert access"
    ON public.portfolios
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

    -- Policy: Allow users to update their own portfolio.
    CREATE POLICY "Allow individual update access"
    ON public.portfolios
    FOR UPDATE
    USING (auth.uid() = user_id);
    
    -- Policy: Allow users to delete their own portfolio.
    CREATE POLICY "Allow individual delete access" 
    ON public.portfolios 
    FOR DELETE 
    USING (auth.uid() = user_id);
    ```

    **7. Create Security Policies for the new `deployments` table:**
    
    ```sql
    -- Policy: Allow users to view their own deployment history.
    CREATE POLICY "Allow individual read access on deployments"
    ON public.deployments
    FOR SELECT
    USING (auth.uid() = user_id);

    -- Policy: Allow users to save new deployment links.
    CREATE POLICY "Allow individual insert access on deployments"
    ON public.deployments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    ```

### Step 4: Disable Email Confirmation (Recommended for Development)

To make testing easier, you can disable the requirement for users to confirm their email after signing up.

1.  In your Supabase dashboard, go to **Authentication** -> **Providers**.
2.  Click on the **Email** provider.
3.  Toggle OFF the **"Confirm email"** option.

### Step 5: Set Up Supabase Storage (Required)

This is where the original resume files will be stored.

1.  In your Supabase project dashboard, click the **Storage** icon.
2.  Click **"New Bucket"**.
3.  Name the bucket `resumes` and click **"Create Bucket"**.
4.  Once created, navigate to **Storage** -> **Policies**.
5.  Click **"New Policy"** next to `resumes` bucket policies.
6.  Select the **"Get started quickly"** template option.
7.  Choose the **"Give users access to their own files"** template.
8.  Make sure `INSERT`, `SELECT`, and `DELETE` are checked, then click **"Review"** and **"Save policy"**.

Your backend is now fully configured for authentication, database, and storage!

---

## How It Works: End-to-End Process

1.  **Authentication**: The user signs up or logs in via the `Auth.tsx` component, which communicates with Supabase Auth.
2.  **Data Fetching**: Upon successful login, the application queries the `portfolios` and `deployments` tables in Supabase to fetch the user's saved data and deployment history.
3.  **Portfolio Generation/Loading**: If data exists, it's loaded into the app. If not, the user is prompted to upload a resume.
4.  **File Upload**: The uploaded resume is sent to Supabase Storage.
5.  **AI Parsing**: The file is simultaneously sent to the Gemini API to be parsed into structured JSON.
6.  **Editing & Saving**: The user can edit every detail. When they click "Save", the application performs an `upsert`, sending the latest portfolio data *and* the path to the stored resume file to the Supabase database.
7.  **Deployment**: Clicking "Deploy" sends the portfolio's generated HTML to the Vercel API, creates a new public deployment, and programmatically disables Vercel's login protection. The resulting URL is then saved as a new entry in the `deployments` table.
8.  **Export**: The export functionality packages the current state of the portfolio into a single, self-contained `index.html` file for download.

---

## How to Use the Application

1.  **Sign Up/Login**: Create an account or sign in.
2.  **Upload**: If it's your first time, upload your resume. The AI will analyze it and generate your portfolio.
3.  **Customize**: Use the sidebar and inline editing tools to perfect your portfolio. Click "Save" to persist your changes.
4.  **Deploy**: Click the deploy icon to instantly host your portfolio on Vercel. Each deployment is saved.
5.  **Access History**: Visit your Profile page at any time to find a complete history of all your deployment links.
6.  **Download**: Click the download icon to export your finished portfolio as a `.zip` file, ready for hosting.

---

## Troubleshooting

### Vercel Deployment Asks for Login ("Access Required")

The application is designed to prevent this automatically. When you deploy, the app makes a second API call to Vercel to disable "Deployment Protection" on your new project. This should make your portfolio public and shareable immediately.

If, for some reason, that API call fails and your link still requires a login, you can fix it manually with these steps:

1.  **Go to Vercel**: Log in to your [Vercel dashboard](https://vercel.com).
2.  **Select Your Project**: Find and click on the portfolio project. The project name will typically be something like `portfolio-your-name-xxxxxx`.
3.  **Go to Project Settings**: Click on the **"Settings"** tab for that project.
4.  **Find Deployment Protection**: In the left sidebar, click on **"Deployment Protection"**.
5.  **Disable Protection**: Under the **Vercel Authentication** section, ensure that protection is **disabled**. You might see a dropdown or toggle switch. Set it to "Disabled" or "No protection".
6.  **Redeploy**: Go back to the portfolio app and deploy again. The new link should now be public.

---

## Project File Structure

Here's a breakdown of the key files and directories in the project:

### Frontend Files

-   **`index.html`**: The main HTML entry point for the application.
-   **`index.tsx`**: The root of the React application, where the `App` component is mounted.
-   **`App.tsx`**: The core component that manages application state, routing, user sessions, and data flow.
-   **`types.ts`**: Contains all TypeScript type definitions for the application data structures (e.g., `ResumeData`, `Experience`).
-   **`EditableField.tsx`**: a reusable React component for inline editing of text fields.

-   **`components/`**: Contains all the React components.
    -   **`Auth.tsx`**: Handles user sign-up and login.
    -   **`UploadScreen.tsx`**: The initial screen for users to upload their resume.
    -   **`Loader.tsx`**: A loading spinner with messages displayed during AI processing.
    -   **`portfolio/`**: Components specific to the portfolio display and editing.
        -   **`PortfolioLayout.tsx`**: The main layout for the portfolio view, including the header and editor sidebar.
        -   **`Header.tsx`**: The top navigation bar.
        -   **`PortfolioEditor.tsx`**: The sidebar panel for editing global styles, section order, and adding content.
        -   **`HomePage.tsx`**, **`ExperiencePage.tsx`**, etc.: Components for each page/section of the portfolio.
        -   **`DownloadModal.tsx`**: The modal for selecting export options.
        -   **`PortfolioExport.tsx`**: The component rendered to a static string for the downloadable HTML file.
    -   **`icons/`**: A collection of SVG icon components.

-   **`hooks/`**: Contains reusable React hooks.
    -   **`useResumeParser.ts`**: The core logic for communicating with the Google Gemini API to parse the resume.
    -   **`useHistoryState.ts`**: A custom hook that provides undo/redo functionality for the portfolio data.

### Backend & Database (Supabase)

The backend and database are managed entirely by Supabase. The configuration and schema are defined as follows:

-   **`lib/supabaseClient.ts`**: This frontend file initializes and exports the Supabase client instance. **This is where you must add your Supabase project credentials.**
-   **`README.md`**: The "Backend Setup with Supabase" section of this file contains all the necessary **SQL commands** to create and configure the `portfolios` and `deployments` tables, set up Row-Level Security policies, and create storage buckets. This acts as the database schema definition for the project.