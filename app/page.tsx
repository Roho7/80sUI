import { EinkProvider } from "@/lib/eink"

import { Desktop } from "./_demo/Desktop"

export default function Page() {
  return (
    <EinkProvider>
      <Desktop />
    </EinkProvider>
  )
}
