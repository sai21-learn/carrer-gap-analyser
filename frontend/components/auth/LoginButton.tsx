'use client';

import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';

export default function LoginButton() {
  const { user, isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium">Signed in as {user.primaryEmailAddress?.emailAddress}</p>
        <SignOutButton>
          <button className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
            Sign out
          </button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <SignInButton mode="modal">
      <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Sign in
      </button>
    </SignInButton>
  );
}
