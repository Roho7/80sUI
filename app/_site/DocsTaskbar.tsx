"use client"

import { useRouter } from "next/navigation"

import { TaskbarTask } from "@/components/retro/taskbar"
import { SITE_NAME } from "@/lib/site"

import { Taskbar } from "./Taskbar"

function DocsTaskbar() {
  const router = useRouter()

  return (
    <Taskbar onShutDown={() => router.push("/")}>
      <TaskbarTask isActive>{SITE_NAME}</TaskbarTask>
    </Taskbar>
  )
}

export { DocsTaskbar }
