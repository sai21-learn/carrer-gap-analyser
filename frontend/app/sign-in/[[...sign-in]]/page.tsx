import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black relative overflow-hidden font-tech">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:24px_24px]"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-md p-4">
        <div className="mb-8 text-center space-y-2">
           <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Secured_Access</h2>
           <h1 className="text-2xl font-bold uppercase tracking-tight text-white">System_Identification</h1>
        </div>
        
        <SignIn 
          appearance={{
            baseTheme: dark,
            elements: {
              card: "bg-zinc-950/50 backdrop-blur-xl border border-white/10 rounded-none shadow-2xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "border-white/10 rounded-none hover:bg-white/5 transition-colors",
              formButtonPrimary: "bg-white text-black hover:bg-zinc-200 rounded-none text-[10px] font-bold uppercase tracking-[0.2em] py-3",
              formFieldInput: "bg-white/5 border-white/10 rounded-none focus:border-white/30 text-white",
              footerActionLink: "text-white hover:text-white/70 transition-colors",
              identityPreviewText: "text-white",
              userButtonPopoverCard: "bg-zinc-900 border-white/10",
              dividerLine: "bg-white/10",
              dividerText: "text-white/20 text-[10px] font-bold uppercase tracking-widest"
            }
          }}
          signUpUrl="/sign-up"
          forceRedirectUrl="/dashboard"
        />
        
        <div className="mt-8 text-center">
           <p className="text-[8px] uppercase tracking-[0.3em] text-white/20">
             Authorization_Protocol_v2.4.0
           </p>
        </div>
      </div>
    </div>
  );
}
