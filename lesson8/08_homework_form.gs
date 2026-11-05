/**
 * 08 Japanese Class 宿題フォーム（PHRASE 08「〇〇から きました。」）
 *
 * 使い方：
 * 1. https://script.google.com を開き「新しいプロジェクト」を作成
 * 2. このファイルの中身をすべて貼り付けて保存
 * 3. 上のメニューで関数「updateForm08」を選び「実行」
 *    （初回のみ Google アカウントの許可画面が出ます）
 *
 * 対象：Day 8 フォルダの「08 Japanese Class」
 *（「05 Japanese Class のコピー」を複製したもの。
 *  名前欄・記述式・ファイルアップロードの構成と設定はそのまま使い、文章だけ差し替えます）
 */
const FORM_ID = '1YSNjPW-rLTv6jnmpA2KfxiDWcNfaTNVhKdKeEG0kRYk';

const FORM_TITLE = '08 Japanese Class';

const FORM_DESCRIPTION = [
  'このフォームで、日本語（にほんご）の宿題（しゅくだい）を提出（ていしゅつ）してください。',
  '宿題①と宿題②を提出してください。',
  '',
  'Please submit both assignments:',
  '① Write in Japanese about where you are from and what your hometown or country is like.',
  '② Record a conversation using "どこから きましたか？" and "〇〇から きました."',
].join('\n');

const Q1_TITLE = '① 日本語（にほんご）の宿題（しゅくだい）：わたしの国（くに）・まち';

const Q1_HELP = [
  'Write in Japanese about where you are from.',
  '',
  'Use "〇〇から きました。" and introduce your country or hometown — for example, what kind of place it is, famous food, or famous places.',
  '',
  '4～6文（ぶん）ぐらいで書（か）いてください。',
  'Write approximately 4–6 short sentences.',
  '',
  'Use the following questions to help you:',
  '・どこから きましたか？（国（くに）やまちの名前（なまえ））',
  '・そこは どんなところですか？',
  '・有名（ゆうめい）なたべものは何（なん）ですか？',
  '・有名（ゆうめい）なところは どこですか？',
  '・日本（にほん）と どこがちがいますか？',
  '',
  'If you prefer, you may write about a city or country you know well instead of your hometown.',
  '',
  'Model Answer (Example):',
  '1. わたしは フィリピンから きました。',
  '   I\'m from the Philippines.',
  '2. マニラから きました。',
  '   I\'m from Manila.',
  '3. フィリピンは とても あついところです。',
  '   The Philippines is a very hot place.',
  '4. うみが とても きれいです。',
  '   The ocean is very beautiful.',
  '5. たべものも おいしいです。アドボが 有名（ゆうめい）です。',
  '   The food is delicious, too. Adobo is famous.',
  '6. ちょっと ホームシックです。',
  '   I miss my country a bit.',
  '',
  'Useful Expressions:',
  '・〇〇から きました。 — 〇〇 kara kimashita. — I\'m from 〇〇.',
  '・どこから きましたか？ — Doko kara kimashita ka? — Where are you from?',
  '・お国（くに）は どちらですか？ — Okuni wa dochira desu ka? — Which country are you from?',
  '・とても いいところです。 — Totemo ii tokoro desu. — It\'s a very nice place.',
  '・たべものも おいしいです。 — Tabemono mo oishii desu. — The food is delicious, too.',
  '・ちょっと ホームシックです。 — Chotto hoomushikku desu. — I miss home a bit.',
  '',
  'Useful Vocabulary:',
  '・国（くに） — Kuni — Country',
  '・まち — Machi — Town / City',
  '・ところ — Tokoro — Place',
  '・たべもの — Tabemono — Food',
  '・有名（ゆうめい） — Yuumei — Famous',
  '・あつい／さむい — Atsui / Samui — Hot / Cold',
  '・にぎやか／しずか — Nigiyaka / Shizuka — Lively / Quiet',
  '',
  'You may use hiragana and katakana. You do not need to use kanji you have not learned.',
  'Use the model as a guide, but write about your own country or town.',
  'Please write your answer in Japanese characters, not only in rōmaji.',
].join('\n');

const Q2_TITLE = '② 日本語（にほんご）の宿題（しゅくだい）：どこから きましたか？';

const Q2_HELP = [
  'Recorded Conversation: Where Are You From?',
  'Record a short conversation in Japanese lasting approximately 20–35 seconds.',
  '',
  'Situation:',
  'You meet someone new. They ask where you are from. You answer and say one or two things about your country or town.',
  '',
  'Roles:',
  '・A：聞（き）く人（ひと） — Person asking',
  '・B：答（こた）える人（ひと） — Person answering',
  'You may play both roles yourself or record with another person.',
  '',
  '会話（かいわ）の中（なか）で、次（つぎ）の言葉（ことば）を使（つか）ってください。',
  'Use the following expressions in your conversation:',
  '・どこから きましたか？／お国（くに）は どちらですか？ — Where are you from?',
  '・〇〇から きました。 — 〇〇 kara kimashita. — I\'m from 〇〇.',
  '・〇〇は どんなところですか？ — 〇〇 wa donna tokoro desu ka? — What kind of place is 〇〇?',
  '・とても 〇〇ところです。 — Totemo 〇〇 tokoro desu. — It\'s a very 〇〇 place.',
  '',
  'Model Dialogue (Example):',
  'A：はじめまして。どこから きましたか？ — Hajimemashite. Doko kara kimashita ka? — Nice to meet you. Where are you from?',
  'B：フランスから きました。 — Furansu kara kimashita. — I\'m from France.',
  'A：フランスは どんなところですか？ — Furansu wa donna tokoro desu ka? — What kind of place is France?',
  'B：とても いいところですよ。たべものも おいしいです。 — Totemo ii tokoro desu yo. Tabemono mo oishii desu. — It\'s a very nice place. The food is delicious, too.',
  'A：いいですね！ — Ii desu ne! — That sounds nice!',
  'B：でも、ちょっと ホームシックです。 — Demo, chotto hoomushikku desu. — But I miss home a bit.',
  '',
  'Your Task:',
  'Create your own conversation based on the model.',
  '・Ask where the other person is from.',
  '・Answer with "〇〇から きました。"',
  '・Say at least one thing about the country or town (what kind of place, food, etc.).',
  '・End the conversation naturally.',
  '',
  'Change the country, the town, or the details to create your own version. Do not simply read the model without changing anything.',
  'Speak clearly at a comfortable pace. You do not need to make the conversation longer just to reach the suggested duration. A slightly shorter recording is fine if the conversation is complete.',
  '',
  'File Name:',
  'Individual: Name_どこからきましたか',
  'Pair: Name1_Name2_どこからきましたか',
  '',
  'Please upload your audio or video recording.',
].join('\n');

function updateForm08() {
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
