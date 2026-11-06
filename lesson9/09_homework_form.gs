/**
 * 09 Japanese Class 宿題フォーム（PHRASE 09「日本語を べんきょうしています。」）
 *
 * 使い方：
 * 1. https://script.google.com を開き「新しいプロジェクト」を作成
 * 2. このファイルの中身をすべて貼り付けて保存
 * 3. 上のメニューで関数「updateForm09」を選び「実行」
 *    （初回のみ Google アカウントの許可画面が出ます）
 *
 * 対象：Day 9 フォルダの「09 Japanese Class」
 *（「05 Japanese Class のコピー」を複製したもの。
 *  名前欄・記述式・ファイルアップロードの構成と設定はそのまま使い、文章だけ差し替えます）
 *
 * 表記ルール：漢字とカタカナの後に（ひらがな）をつける
 */
const FORM_ID = '1XBQJpEKKa4ehDkfS8HGJcVXgnH4km1fYT593pVl-sJQ';

const FORM_TITLE = '09 Japanese Class';

const FORM_DESCRIPTION = [
  'このフォームで、日本語（にほんご）の宿題（しゅくだい）を提出（ていしゅつ）してください。',
  '宿題（しゅくだい）①と宿題（しゅくだい）②を提出（ていしゅつ）してください。',
  '',
  'Please submit both assignments:',
  '① Write in Japanese about how you study Japanese.',
  '② Record a conversation about studying Japanese using "日本語をべんきょうしています" and "いいえ、まだまだです."',
].join('\n');

const Q1_TITLE = '① 日本語（にほんご）の宿題（しゅくだい）：わたしの日本語（にほんご）のべんきょう';

const Q1_HELP = [
  'Write in Japanese about how you study Japanese.',
  '',
  'Use "日本語（にほんご）をべんきょうしています。" and explain when, how, and how long you study.',
  '',
  '4～6文（ぶん）ぐらいで書（か）いてください。',
  'Write approximately 4–6 short sentences.',
  '',
  'Use the following questions to help you:',
  '・いつから日本語（にほんご）をべんきょうしていますか？',
  '・どうやってべんきょうしていますか？',
  '・まいにち何時間（なんじかん）べんきょうしていますか？',
  '・日本語（にほんご）のべんきょうは たのしいですか？ むずかしいですか？',
  '・どんな日本語（にほんご）をはなしたいですか？',
  '',
  'Model Answer (Example):',
  '1. わたしは きょねんから 日本語（にほんご）を べんきょうしています。',
  '   I have been studying Japanese since last year.',
  '2. まいにち アプリ（あぷり）で べんきょうしています。',
  '   I study with an app every day.',
  '3. アニメ（あにめ）も 1時間（いちじかん）みています。',
  '   I also watch anime for one hour.',
  '4. 日本語（にほんご）は むずかしいですが、たのしいです。',
  '   Japanese is difficult, but it is fun.',
  '5. 日本語（にほんご）を すこし はなせます。',
  '   I can speak a little Japanese.',
  '6. もっと じょうずに なりたいです。',
  '   I want to get better.',
  '',
  'Useful Expressions:',
  '・日本語（にほんご）を べんきょうしています。 — Nihongo o benkyoo shite imasu. — I\'m studying Japanese.',
  '・日本語（にほんご）が 上手（じょうず）ですね。 — Nihongo ga joozu desu ne. — Your Japanese is good.',
  '・いいえ、まだまだです。 — Iie, madamada desu. — No, I still have a long way to go.',
  '・日本語（にほんご）を すこし はなせます。 — Nihongo o sukoshi hanasemasu. — I can speak a little Japanese.',
  '・どうやって べんきょうしていますか？ — Dooyatte benkyoo shite imasu ka? — How do you study?',
  '',
  'Useful Vocabulary:',
  '・まいにち — Mainichi — Every day',
  '・きょねん — Kyonen — Last year',
  '・〇時間（じかん） — 〇 jikan — 〇 hours',
  '・アニメ（あにめ） — Anime — Anime',
  '・アプリ（あぷり） — Apuri — App',
  '・本（ほん） — Hon — Book',
  '・はなします／みます／よみます — Hanashimasu / Mimasu / Yomimasu — Speak / Watch / Read',
  '',
  'You may use hiragana and katakana. You do not need to use kanji you have not learned.',
  'Use the model as a guide, but write about your own way of studying.',
  'Please write your answer in Japanese characters, not only in rōmaji.',
].join('\n');

const Q2_TITLE = '② 日本語（にほんご）の宿題（しゅくだい）：日本語（にほんご）が上手（じょうず）ですね';

const Q2_HELP = [
  'Recorded Conversation: "Your Japanese Is Good!"',
  'Record a short conversation in Japanese lasting approximately 20–35 seconds.',
  '',
  'Situation:',
  'Someone praises your Japanese. You answer modestly, then talk about how you study.',
  '',
  'Roles:',
  '・A：聞（き）く人（ひと） — Person asking',
  '・B：日本語（にほんご）をべんきょうしている人（ひと） — Person studying Japanese',
  'You may play both roles yourself or record with another person.',
  '',
  '会話（かいわ）の中（なか）で、次（つぎ）の言葉（ことば）を使（つか）ってください。',
  'Use the following expressions in your conversation:',
  '・日本語（にほんご）が上手（じょうず）ですね。 — Your Japanese is good.',
  '・いいえ、まだまだです。 — No, I still have a long way to go.',
  '・〇〇から 日本語（にほんご）を べんきょうしています。 — I have been studying Japanese since 〇〇.',
  '・どうやって べんきょうしていますか？ — How do you study?',
  '',
  'Model Dialogue (Example):',
  'A：日本語（にほんご）が上手（じょうず）ですね。 — Nihongo ga joozu desu ne. — Your Japanese is good.',
  'B：いいえ、まだまだです。 — Iie, madamada desu. — No, I still have a long way to go.',
  'A：いつから べんきょうしていますか？ — Itsu kara benkyoo shite imasu ka? — Since when have you been studying?',
  'B：きょねんから 日本語（にほんご）を べんきょうしています。 — Kyonen kara nihongo o benkyoo shite imasu. — I\'ve been studying Japanese since last year.',
  'A：どうやって べんきょうしていますか？ — Dooyatte benkyoo shite imasu ka? — How do you study?',
  'B：まいにち アニメ（あにめ）を 1時間（いちじかん）みています。 — Mainichi anime o ichi-jikan mite imasu. — I watch anime for one hour every day.',
  '',
  'Your Task:',
  'Create your own conversation based on the model.',
  '・Praise the other person\'s Japanese.',
  '・Answer with "いいえ、まだまだです。"',
  '・Say since when and how you study Japanese.',
  '・End the conversation naturally.',
  '',
  'Change the details (since when, how, how long) to create your own version. Do not simply read the model without changing anything.',
  'Speak clearly at a comfortable pace. You do not need to make the conversation longer just to reach the suggested duration. A slightly shorter recording is fine if the conversation is complete.',
  '',
  'File Name:',
  'Individual: Name_にほんごのべんきょう',
  'Pair: Name1_Name2_にほんごのべんきょう',
  '',
  'Please upload your audio or video recording.',
].join('\n');

function updateForm09() {
  const form = FormApp.openById(FORM_ID);
  form.setTitle(FORM_TITLE);
  form.setDescription(FORM_DESCRIPTION);

  const items = form.getItems();
  // 05 のフォーム構成：[0] 名前（記述・短文） / [1] 宿題①（段落） / [2] 宿題②（ファイルアップロード）
  const writing = items.find(function (it) { return it.getType() === FormApp.ItemType.PARAGRAPH_TEXT; });
  const upload = items.find(function (it) { return it.getType() === FormApp.ItemType.FILE_UPLOAD; });

  if (!writing) throw new Error('記述式（段落）の質問が見つかりません。');
  writing.setTitle(Q1_TITLE).setHelpText(Q1_HELP);

  if (upload) {
    upload.setTitle(Q2_TITLE).setHelpText(Q2_HELP);
  } else {
    Logger.log('ファイルアップロードの質問が見つかりませんでした。宿題②はフォーム画面で追加してください。');
  }

  Logger.log('更新しました: ' + form.getEditUrl());
}
