import { createClient } from './server'

/**
 * ポスター画像をアップロード
 */
export async function uploadPosterImage(file: File): Promise<string> {
  const supabase = await createClient()

  // ファイル名を生成（UUID + 拡張子）
  const fileExt = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`
  const filePath = `posters/${fileName}`

  // ファイルをアップロード
  const { error } = await supabase.storage
    .from('performance-posters')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`画像のアップロードに失敗しました: ${error.message}`)
  }

  // 公開URLを取得
  const { data } = supabase.storage
    .from('performance-posters')
    .getPublicUrl(filePath)

  return data.publicUrl
}

/**
 * ポスター画像を削除
 */
export async function deletePosterImage(url: string): Promise<void> {
  if (!url) return

  const supabase = await createClient()

  // URLからファイルパスを抽出
  const urlParts = url.split('/storage/v1/object/public/performance-posters/')
  if (urlParts.length < 2) return

  const filePath = urlParts[1]

  // ファイルを削除
  const { error } = await supabase.storage
    .from('performance-posters')
    .remove([filePath])

  if (error) {
    console.error('画像の削除に失敗しました:', error.message)
  }
}
