# Vercel デプロイガイド

このガイドでは、Notion 投票サイトを Vercel にデプロイする手順を説明します。

## 前提条件

- GitHub アカウント
- Vercel アカウント（[vercel.com](https://vercel.com) で無料登録可能）
- Notion Integration Token と Database ID

## デプロイ手順

### 1. GitHub にプッシュ

```bash
# Git リポジトリを初期化（まだの場合）
git init

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: Notion voting site"

# GitHub にリポジトリを作成後
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**注意**: `.env.local` ファイルは自動的に除外されます（.gitignore に記載済み）

### 2. Vercel でプロジェクトをインポート

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. "New Project" をクリック
3. GitHub リポジトリをインポート
4. プロジェクト名を設定（オプション）

### 3. 環境変数の設定

Vercel のプロジェクト設定で以下の環境変数を追加：

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `NOTION_TOKEN` | `ntn_...` | Notion Integration Token |
| `DATABASE_ID` | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` | Notion Database ID |
| `NEXT_PUBLIC_BASE_URL` | `https://your-app.vercel.app` | デプロイ後のURL |

#### 環境変数の追加方法：

1. Vercel Dashboard でプロジェクトを選択
2. "Settings" タブをクリック
3. "Environment Variables" セクションへ
4. 各変数を追加：
   - Key: 変数名（例: `NOTION_TOKEN`）
   - Value: 実際の値
   - Environment: Production, Preview, Development すべてにチェック
5. "Save" をクリック

### 4. デプロイ

環境変数を設定後、自動的にデプロイが開始されます。

手動でデプロイする場合：
1. "Deployments" タブへ
2. "Redeploy" をクリック
3. "Use existing Environment Variables" を選択

## デプロイ後の確認

1. デプロイが完了したら、提供されたURLにアクセス
2. 投票フォームが正しく表示されることを確認
3. テスト投票を行い、Notion データベースに反映されることを確認

## トラブルシューティング

### エラー: "Missing required environment variables"

- Vercel の環境変数設定を確認
- すべての必要な変数が設定されているか確認

### エラー: "Could not find database"

- `DATABASE_ID` が正しいか確認
- Notion Integration がデータベースにアクセスできるか確認

### 投票が保存されない

- Notion API の書き込み権限を確認
- Vercel のログでエラーを確認

## セキュリティのベストプラクティス

1. **環境変数の管理**
   - 本番環境の認証情報は Vercel の環境変数でのみ管理
   - ローカルの `.env.local` は絶対にコミットしない

2. **アクセス制限**
   - 必要に応じて Vercel の認証機能を使用
   - Notion Integration の権限は最小限に

3. **監視**
   - Vercel のログで異常なアクセスパターンを確認
   - Notion データベースの変更履歴を定期的にチェック

## 自動デプロイ

GitHub にプッシュすると自動的に Vercel にデプロイされます：

```bash
git add .
git commit -m "Update: your changes"
git push
```

## カスタムドメイン（オプション）

1. Vercel Dashboard で "Domains" へ
2. カスタムドメインを追加
3. DNS 設定を更新
4. `NEXT_PUBLIC_BASE_URL` を新しいドメインに更新

## 問題が発生した場合

- Vercel のビルドログを確認
- Notion API の状態を確認
- 環境変数が正しく設定されているか再確認