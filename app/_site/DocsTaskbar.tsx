"use client"

import { useRouter } from "next/navigation"

import { SITE_NAME } from "@/lib/site"

import { Taskbar, TaskButton } from "./Taskbar"

function DocsTaskbar() {
  const router = useRouter()

  return (
    <Taskbar onShutDown={() => router.push("/")}>
      <TaskButton label={SITE_NAME} isPressed />
    </Taskbar>
  )
}

export { DocsTaskbar }
