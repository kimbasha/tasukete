# タスケテ - デプロイガイド

このアプリを本番環境にデプロイして、誰でもアクセスできるようにする手順です。

## 推奨デプロイ先

**Vercel** - Next.jsアプリに最適なホスティングサービス
- 無料プランあり
- 自動デプロイ（GitHubにpushすると自動で更新）
- カスタムドメイン対応

## Vercelでのデプロイ手順

### 1. Vercelアカウント作成

https://vercel.com にアクセスして、GitHubアカウントでサインアップ

### 2. プロジェクトをインポート

1. Vercelダッシュボードで「Add New...」→「Project」
2. GitHubリポジトリ `tasukete` を選択
3. 「Import」をクリック

### 3. 環境変数を設定

「Environment Variables」セクションで以下を設定：

```
NEXT_PUBLIC_SUPABASE_URL = https://cxnklzfenpnnuaeptlnr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = (Publishable key)
SUPABASE_SECRET_KEY = (Secret key)
```

**注意**: すべての環境（Production, Preview, Development）にチェックを入れる

### 4. デプロイ

「Deploy」ボタンをクリック

数分後、デプロイが完了し、URLが発行されます（例: `https://tasukete-xxx.vercel.app`）

### 5. カスタムドメイン設定（オプション）

独自ドメインを設定する場合：

1. Vercelプロジェクト → Settings → Domains
2. ドメインを入力（例: `tasukete.yourdomain.com`）
3. DNSレコードを設定（Vercelが指示を表示）

## 公開後のURL

### 本番環境

```
https://tasukete-xxx.vercel.app/admin/login
```

このURLを劇団メンバーに共有すれば、ログインして使用できます。

### アカウント作成フロー

1. Super Adminがログイン
2. ユーザー管理 → アカウントを追加
3. 劇団を選択してアカウント作成
4. メールアドレスとパスワードを劇団に共有

## 自動デプロイ設定

Vercelでは、GitHubにpushすると自動でデプロイされます：

- `master`ブランチ → 本番環境に自動デプロイ
- その他のブランチ → プレビュー環境を自動生成

## マイグレーションの適用

**重要**: 本番環境のデータベースに対してマイグレーションを適用する必要があります。

### 方法1: ローカルから実行（推奨）

```bash
# 本番環境にマイグレーション適用
supabase db push
```

### 方法2: Supabase Dashboardで手動実行

1. Supabase Dashboard → SQL Editor
2. マイグレーションファイルの内容をコピー&ペースト
3. 実行

## 他のデプロイオプション

### Railway

https://railway.app
- 簡単なCLIベースのデプロイ
- データベースも一緒にホスティング可能

### Netlify

https://www.netlify.com
- Vercelの代替
- 同様の機能

### 自前サーバー

```bash
# ビルド
npm run build

# 起動
npm run start
```

## セキュリティのベストプラクティス

### 環境変数の管理

- ✅ Vercelの環境変数機能を使用
- ❌ `.env.local`をGitにコミットしない（.gitignoreに含まれている）

### データベースアクセス

- Supabaseの管理画面でIPホワイトリストを設定（オプション）
- RLSポリシーで権限を制限（すでに設定済み）

### 認証

- 強力なパスワードを使用
- 定期的にアカウントを見直す

## 監視とログ

### Vercelの機能

- Vercel Dashboard → Analytics - デプロイ履歴とログ
- エラーログ

### Supabaseの機能

- Supabase Dashboard → Logs
- クエリパフォーマンス
- エラーログ

## コスト

### 無料プラン

**Vercel**:
- 月100GBの帯域幅
- 無制限のデプロイ

**Supabase**:
- 500MBのデータベース
- 1GBのストレージ
- 2GBの帯域幅

小規模な劇団管理システムなら無料プランで十分です。

### アップグレードが必要な場合

- Vercel Pro: $20/月
- Supabase Pro: $25/月

## トラブルシューティング

### デプロイエラー

1. Vercelのログを確認
2. ビルドエラーの場合、ローカルで`npm run build`を実行して確認

### データベース接続エラー

1. 環境変数が正しく設定されているか確認
2. SupabaseプロジェクトURLが正しいか確認

### マイグレーションエラー

1. ローカルとリモートのマイグレーション状態を確認
2. `supabase migration list`で確認

## サポート

- Vercel: https://vercel.com/support
- Supabase: https://supabase.com/support
