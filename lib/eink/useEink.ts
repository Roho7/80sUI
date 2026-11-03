"use client"

import { useContext } from "react"

import { EinkContext, type EinkContextValue } from "./einkContext"

export function useEink(): EinkContextValue {
  return useContext(EinkContext)
}
