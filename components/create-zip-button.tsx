"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreateZipModal } from "@/components/create-zip-modal"
import type { GenerateLandingPageResponse } from "@/lib/openai"

interface CreateZipButtonProps {
  onZipCreated: (landingPage: GenerateLandingPageResponse) => void
}

export function CreateZipButton({ onZipCreated }: CreateZipButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Create Zip</Button>
      <CreateZipModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onZipCreated={onZipCreated} />
    </>
  )
}

