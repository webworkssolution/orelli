export default function LoginLayout({ children }: { children: React.ReactNode }) {
  // This layout exists so Next.js knows /admin/login is a nested route.
  // The AdminShell component detects the login path and strips the sidebar/header.
  return <>{children}</>;
}
