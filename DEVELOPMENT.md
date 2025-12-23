# タスケテ - 開発環境セットアップガイド

## 必要な環境

- Node.js 18以上
- npm または yarn
- Supabase CLI
- Git

## 初回セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/kimbasha/tasukete.git
cd tasukete
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```bash
# Supabase
# Settings > API > "Publishable and secret API keys"から取得
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SECRET_KEY=your_supabase_secret_key

# Supabase CLI用（任意）
SUPABASE_ACCESS_TOKEN=your_supabase_access_token
```

**取得方法**:
- Supabase Dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
- Settings → API → "Publishable and secret API keys"

### 4. Supabase CLIのセットアップ

#### Homebrewでインストール（macOS）

```bash
brew install supabase/tap/supabase
```

#### 他のOS

https://supabase.com/docs/guides/cli/getting-started を参照

#### プロジェクトをリンク

```bash
# アクセストークンを環境変数に設定
export SUPABASE_ACCESS_TOKEN=your_access_token

# プロジェクトをリンク
supabase link --project-ref cxnklzfenpnnuaeptlnr
```

**データベースパスワード**: プロジェクトオーナーに確認してください

#### マイグレーションを適用

```bash
supabase db push
```

### 5. 開発サーバー起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く

## 開発ワークフロー

### ブランチ戦略

```bash
# 新機能開発
git checkout -b feature/your-feature-name

# 作業
# ... コーディング ...

# コミット
git add .
git commit -m "feat: your feature description"

# プッシュ
git push origin feature/your-feature-name

# GitHub上でPR作成
```

### データベース変更がある場合

#### マイグレーションファイルを作成

```bash
# ファイル名: supabase/migrations/XXX_your_change_name.sql
# XXXは次の番号（現在007まで使用済み）
```

#### マイグレーションを適用

```bash
supabase db push
```

#### Gitにコミット

```bash
git add supabase/migrations/XXX_your_change_name.sql
git commit -m "feat: add database migration for XXX"
```

### 他のメンバーの変更を取り込む

```bash
# 最新のコードを取得
git pull origin master

# 依存パッケージを更新（package.jsonが変更されている場合）
npm install

# マイグレーションを適用（新しいマイグレーションがある場合）
supabase db push
```

## よく使うコマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 型チェック
npm run type-check

# マイグレーション一覧
supabase migration list

# マイグレーション適用
supabase db push

# データベースに接続
supabase db remote connect
```

## 管理画面へのアクセス

### Super Admin（システム管理者）

- URL: http://localhost:3000/admin/login
- 権限: 全劇団・全公演を管理可能
- アカウント: プロジェクトオーナーに確認

### Theater Admin（劇団管理者）

- URL: http://localhost:3000/admin/login
- 権限: 自分の劇団のみ管理可能
- アカウント作成: Super Adminが管理画面から作成

## トラブルシューティング

### マイグレーションエラー

```bash
# マイグレーション状態を確認
supabase migration list

# リモートとローカルが一致しない場合は、プロジェクトオーナーに相談
```

### 環境変数エラー

- `.env.local`ファイルが正しく設定されているか確認
- サーバーを再起動（環境変数変更後は必須）

### データベース接続エラー

- Supabaseプロジェクトが起動しているか確認
- 環境変数のURLが正しいか確認

## 参考リンク

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
