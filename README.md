# Notion 投票ミニサイト

Notion データベースと連携した投票システムです。ユーザーは4つの選択肢から1つを選んで投票でき、リアルタイムで結果を確認できます。

## 機能

- 4つの固定選択肢から1つを選択して投票
- Cookie + IPアドレスによる重複投票防止
- リアルタイムでの投票結果表示（棒グラフ/円グラフ）
- Notion データベースとの完全連携

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes (Edge Functions)
- **データベース**: Notion API
- **グラフ描画**: Chart.js (react-chartjs-2)

## セットアップ

### 1. Notion データベースの準備

1. Notion で新しいデータベースを作成
2. 以下のプロパティを追加:
   - `Option` (Title): 投票選択肢
   - `Votes` (Number): 投票数
   - `VoterIDs` (Rich Text): 投票者IDリスト

3. 以下の4つのレコードを作成:
   - 続！バイブコーディング！
   - AIショート動画制作チーム
   - メルマガ制作AIチーム
   - Difyでアプリ開発

### 2. Notion Integration の作成

1. [Notion Developers](https://www.notion.so/my-integrations) にアクセス
2. 新しいインテグレーションを作成
3. インテグレーショントークンをコピー
4. データベースにインテグレーションを接続

### 3. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成:

```bash
cp .env.local.example .env.local
```

`.env.local` ファイルを編集し、以下を設定:

```bash
NOTION_TOKEN=your_notion_integration_token
DATABASE_ID=your_notion_database_id
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**重要**: `.env.local` ファイルは `.gitignore` に含まれており、Git にコミットされません。

### 4. 依存関係のインストール

```bash
npm install
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## API エンドポイント

- `GET /api/options` - 投票選択肢を取得
- `POST /api/vote` - 投票を実行
- `GET /api/results` - 投票結果を取得

## デプロイ

### Vercel へのデプロイ

1. [Vercel](https://vercel.com) にプロジェクトをインポート
2. 環境変数を設定
3. デプロイ

### 環境変数

本番環境では以下の環境変数を設定してください:

- `NOTION_TOKEN`: Notion Integration Token
- `DATABASE_ID`: Notion Database ID
- `NEXT_PUBLIC_BASE_URL`: 本番環境のURL

## セキュリティ

- Notion API トークンはサーバーサイドでのみ使用
- Cookie + IPアドレスのハッシュ化による投票者識別
- HTTPS 必須（本番環境）

## トラブルシューティング

### "Missing required environment variables" エラー

`.env.local` ファイルに `NOTION_TOKEN` と `DATABASE_ID` が正しく設定されているか確認してください。

### 投票選択肢が表示されない

1. Notion データベースに4つの選択肢が正しく登録されているか確認
2. インテグレーションがデータベースに接続されているか確認

### 投票が記録されない

1. Notion API の権限設定を確認
2. データベースの書き込み権限があるか確認

## ライセンス

MIT