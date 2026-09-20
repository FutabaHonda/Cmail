# Cmail

Gmail ライクな UI で、返信の下書きを Claude が作成してくれるメールクライアントです。

- 複数の Google アカウントを連携し、Gmail の受信トレイのようにワンクリックで切り替えられます。
- スレッドを開いて「AIで返信を下書き」を押すと、Claude が本文を読んで返信ドラフトを作成します。
- 下書きを編集して送信すると、その送信内容（元メール・AIの下書き・実際に送った文面）を学習データとして保存し、
  一定件数ごとに「文体プロファイル」を Claude で再生成します。次回以降の下書きはこのプロファイルと、
  内容が似た過去の返信例を few-shot として参照するため、使うほど本人の文体に近づいていきます。

## 使用技術

- Next.js (App Router) / TypeScript / Tailwind CSS
- Prisma + SQLite（アカウント・OAuthトークン・学習データを保存）
- Google Gmail API（`googleapis`）でメールの読み書き
- Anthropic API（`@anthropic-ai/sdk`）で返信下書き・文体プロファイル生成

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Google Cloud の設定

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成
2. 「APIとサービス」→「ライブラリ」から **Gmail API** を有効化
3. 「APIとサービス」→「認証情報」から OAuth クライアントID（ウェブアプリケーション）を作成
   - 承認済みのリダイレクトURI に `http://localhost:3000/api/auth/google/callback` を追加
4. OAuth 同意画面でテストユーザーとして利用する Google アカウントを追加（公開審査前は必須）

### 3. 環境変数

`.env.example` を参考に `.env` を作成してください（初回セットアップ時に `.env` は自動生成済みです）。

```bash
cp .env.example .env
```

| 変数名 | 説明 |
| --- | --- |
| `DATABASE_URL` | SQLiteのファイルパス。デフォルトのままで可 |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud で発行したOAuthクライアント |
| `GOOGLE_REDIRECT_URI` | OAuthコールバックURL |
| `ANTHROPIC_API_KEY` | Claude APIキー（[console.anthropic.com](https://console.anthropic.com/)） |
| `ANTHROPIC_MODEL` | 使用するモデル名（デフォルト: `claude-sonnet-5`） |
| `ENCRYPTION_KEY` / `SESSION_SECRET` | `openssl rand -hex 32` で生成したランダムな文字列 |

### 4. データベースのマイグレーション

```bash
npx prisma migrate dev
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

`http://localhost:3000` を開き、Googleでログインしてください。

## 主な機能

- **アカウント切り替え**: 右上のアカウントメニューから「別のGoogleアカウントを追加」でアカウントを追加し、
  一覧から選択するだけで受信トレイが切り替わります（トークンはアカウントごとに暗号化して保存）。
- **AI返信の学習**: 返信を送るたびに、送信内容を学習データとして保存し、5件ごとに文体プロファイルを自動更新します。
  設定画面から学習状況の確認・学習データのリセットができます。

## ディレクトリ構成（抜粋）

```
src/
  app/
    login/            ログイン画面
    mail/              受信トレイ・スレッド表示・AI返信
    settings/          アカウント管理・学習状況
    api/
      auth/google/      OAuthログイン・アカウント追加
      accounts/         アカウント切り替え・削除
      mail/threads/     スレッド一覧・詳細・AI下書き・送信
      settings/         学習データのリセット
  lib/
    gmail.ts            Gmail API ラッパー
    ai.ts                Claudeによる下書き生成・文体プロファイル生成
    learning.ts          学習データの保存・類似返信の検索・プロファイル更新のトリガー
    similarity.ts         過去の返信例を検索するための簡易類似度計算
    crypto.ts             OAuthトークンの暗号化
    session.ts             ログインセッション（署名付きCookie）
```
