/**
 * 07 Japanese Class 宿題フォーム（PHRASE 07「わたしは〇〇です。」）
 *
 * 使い方：
 * 1. https://script.google.com を開き「新しいプロジェクト」を作成
 * 2. このファイルの中身をすべて貼り付けて保存
 * 3. 上のメニューで関数「updateForm07」を選び「実行」
 *    （初回のみ Google アカウントの許可画面が出ます）
 *
 * 対象：Day 7 フォルダの「07 Japanese Class」
 *（「05 Japanese Class のコピー」を複製したもの。
 *  名前欄・記述式・ファイルアップロードの構成と設定はそのまま使い、文章だけ差し替えます）
 */
const FORM_ID = '1HBl_qfYHGqozJivJBU_XIAKDeQhKVLqv0WCUULK42Ec';

const FORM_TITLE = '07 Japanese Class';

const FORM_DESCRIPTION = [
  'このフォームで、日本語（にほんご）の宿題（しゅくだい）を提出（ていしゅつ）してください。',
  '宿題①と宿題②を提出してください。',
  '',
  'Please submit both assignments:',
  '① Write a self-introduction in Japanese using "わたしは〇〇です."',
  '② Record a first-meeting conversation using "わたしは〇〇です" and "よろしく おねがいします."',
].join('\n');

const Q1_TITLE = '① 日本語（にほんご）の宿題（しゅくだい）：自己紹介（じこしょうかい）';

const Q1_HELP = [
  'Write a short self-introduction in Japanese.',
  '',
  'Use "わたしは〇〇です。" to talk about your name, your nationality, your job or school, and other things about yourself.',
  '',
  '4～6文（ぶん）ぐらいで書（か）いてください。',
  'Write approximately 4–6 short sentences.',
  '',
  'Use the following questions to help you:',
  '・お名前（なまえ）は何（なん）ですか？',
  '・何人（なにじん）ですか？',
  '・お仕事（しごと）は何（なん）ですか？ 学生（がくせい）ですか？',
  '・どこに住（す）んでいますか？',
  '・好（す）きなものは何（なん）ですか？',
  '',
  'Model Answer (Example):',
  '1. はじめまして。',
  '   Nice to meet you.',
  '2. わたしは ジョン・スミスです。',
  '   I\'m John Smith.',
  '3. わたしは アメリカ人（じん）です。',
  '   I\'m American.',
  '4. わたしは エンジニアです。',
  '   I\'m an engineer.',
  '5. すしが 好（す）きです。',
  '   I like sushi.',
  '6. よろしく おねがいします。',
  '   Nice to meet you. (I look forward to working with you.)',
  '',
  'Useful Expressions:',
  '・はじめまして。 — Hajimemashite. — Nice to meet you.',
  '・わたしは〇〇です。 — Watashi wa 〇〇 desu. — I\'m 〇〇.',
  '・〇〇人（じん）です。 — 〇〇 jin desu. — I\'m (nationality).',
  '・〇〇が 好（す）きです。 — 〇〇 ga suki desu. — I like 〇〇.',
  '・よろしく おねがいします。 — Yoroshiku onegai shimasu. — Nice to meet you.',
  '',
  'Useful Vocabulary:',
  '・名前（なまえ） — Namae — Name',
  '・名字（みょうじ） — Myooji — Family name',
  '・日本人（にほんじん） — Nihonjin — Japanese (person)',
  '・アメリカ人（じん） — Amerikajin — American',
  '・タイ人（じん） — Taijin — Thai',
  '・学生（がくせい） — Gakusei — Student',
  '・会社員（かいしゃいん） — Kaishain — Office worker',
  '・エンジニア — Enjinia — Engineer',
  '',
  'Tip: In Japanese, names are usually written family name first, then given name (e.g. 田中 太郎 / Tanaka Taro).',
  '',
  'You may use hiragana and katakana. You do not need to use kanji you have not learned.',
  'Use the model as a guide, but write about yourself. Change the name, nationality, job, or likes to make it personal.',
  'Please write your answer in Japanese characters, not only in rōmaji.',
].join('\n');

const Q2_TITLE = '② 日本語（にほんご）の宿題（しゅくだい）：はじめての会話（かいわ）';

const Q2_HELP = [
  'Recorded Conversation: Meeting Someone for the First Time',
  'Record a short conversation in Japanese lasting approximately 20–35 seconds.',
  '',
  'Situation:',
  'You meet someone for the first time. The other person thinks you are someone else.',
  'You politely say "いいえ、わたしは〇〇です" and introduce yourself.',
  '',
  'Roles:',
  '・A：話（はな）しかける人（ひと） — Person who starts the conversation',
  '・B：自己紹介（じこしょうかい）をする人（ひと） — Person introducing themselves',
  'You may play both roles yourself or record with another person.',
  '',
  '会話（かいわ）の中（なか）で、次（つぎ）の言葉（ことば）を使（つか）ってください。',
  'Use the following expressions in your conversation:',
  '・〇〇さんですか？ — 〇〇-san desu ka? — Are you 〇〇?',
  '・いいえ、わたしは〇〇です。 — Iie, watashi wa 〇〇 desu. — No, I\'m 〇〇.',
  '・〇〇人（じん）です。 — 〇〇 jin desu. — I\'m (nationality).',
  '・よろしく おねがいします。 — Yoroshiku onegai shimasu. — Nice to meet you.',
  '',
  'Model Dialogue (Example):',
  'A：すみません、田中（たなか）さんですか？ — Sumimasen, Tanaka-san desu ka? — Excuse me, are you Tanaka-san?',
  'B：いいえ、わたしは ジョンです。 — Iie, watashi wa Jon desu. — No, I\'m John.',
  'A：あ、すみません。わたしは 佐藤（さとう）です。 — A, sumimasen. Watashi wa Satoo desu. — Oh, sorry. I\'m Sato.',
  'B：はじめまして。わたしは アメリカ人（じん）です。 — Hajimemashite. Watashi wa amerikajin desu. — Nice to meet you. I\'m American.',
  'A：そうですか。よろしく おねがいします。 — Soo desu ka. Yoroshiku onegai shimasu. — I see. Nice to meet you.',
  'B：よろしく おねがいします。 — Yoroshiku onegai shimasu. — Nice to meet you, too.',
  '',
  'Your Task:',
  'Create your own conversation based on the model.',
  '・Ask "〇〇さんですか？"',
  '・Answer with "いいえ、わたしは〇〇です。"',
  '・Say one more thing about yourself (nationality, job, or something you like).',
  '・End the conversation with "よろしく おねがいします。"',
  '',
  'Change the names, nationality, or other details to create your own version. Do not simply read the model without changing anything.',
  'Speak clearly at a comfortable pace. You do not need to make the conversation longer just to reach the suggested duration. A slightly shorter recording is fine if the conversation is complete.',
  '',
  'File Name:',
  'Individual: Name_じこしょうかい',
  'Pair: Name1_Name2_じこしょうかい',
  '',
  'Please upload your audio or video recording.',
].join('\n');

function updateForm07() {
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
