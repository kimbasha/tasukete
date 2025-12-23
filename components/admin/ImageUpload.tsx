'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ImageUploadProps {
  value?: string
  onChange: (file: File | null) => void
  onRemove: () => void
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // ファイルサイズチェック（5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください')
      return
    }

    // ファイルタイプチェック
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください')
      return
    }

    // プレビュー表示
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    onChange(file)
  }

  function handleRemove() {
    setPreview(null)
    onChange(null)
    onRemove()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="max-w-xs"
        />
        {preview && (
          <Button type="button" variant="outline" onClick={handleRemove}>
            画像を削除
          </Button>
        )}
      </div>

      {preview && (
        <div className="relative h-64 w-64 overflow-hidden rounded-md border">
          <Image
            src={preview}
            alt="ポスター画像プレビュー"
            fill
            className="object-cover"
          />
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        ※ファイルサイズは5MB以下、画像形式（JPG, PNG, GIF等）
      </p>
    </div>
  )
}
