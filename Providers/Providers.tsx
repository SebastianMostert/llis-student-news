"use client";

import { ThemeProvider } from "next-themes";

const Providers = ({ children }: { children: React.ReactNode }) => {
  // const queryClient = new QueryClient()

  return (
    <>
      {/* <QueryClientProvider client={queryClient}> */}
      <ThemeProvider enableSystem={true} attribute="class">
        {children}
      </ThemeProvider>
      {/* </QueryClientProvider> */}
    </>
  )
}

export default Providers