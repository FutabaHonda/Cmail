/**
 * 06 Japanese Class 宿題フォーム（PHRASE 06「わかりました。」）
 *
 * 使い方：
 * 1. https://script.google.com を開き「新しいプロジェクト」を作成
 * 2. このファイルの中身をすべて貼り付けて保存
 * 3. 上のメニューで関数「updateForm06」を選び「実行」
 *    （初回のみ Google アカウントの許可画面が出ます）
 *
 * 対象：Day 6 フォルダの「06 Japanese Class」
 *（「05 Japanese Class のコピー」を複製したもの。
 *  名前欄・記述式・ファイルアップロードの構成と設定はそのまま使い、文章だけ差し替えます）
 */
const FORM_ID = '1auYUWiLwmjQdX83rA8tERPBYJUeu6IGH4RdUCp4w1ZQ';

const FORM_TITLE = '06 Japanese Class';

const FORM_DESCRIPTION = [
  'このフォームで、日本語（にほんご）の宿題（しゅくだい）を提出（ていしゅつ）してください。',
  '宿題①と宿題②を提出してください。',
  '',
  'Please submit both assignments:',
  '① Write about a time you asked for directions (or did not understand something) in Japanese.',
  '② Record a conversation asking for directions using "わかりました" and "もういちど おねがいします."',
].join('\n');

const Q1_TITLE = '① 日本語（にほんご）の宿題（しゅくだい）：道（みち）を聞（き）いた経験（けいけん）';

const Q1_HELP = [
  'Write in Japanese about a time you asked someone for directions, or a time you did not understand what someone said.',
  '',
  'For example, you can describe asking the way to a station, a shop, or a school, or a time you asked someone to say something again.',
  '',
  '4～6文（ぶん）ぐらいで書（か）いてください。',
  'Write approximately 4–6 short sentences.',
  '',
  'Use the following questions to help you:',
  '・いつ、どこで道（みち）を聞（き）きましたか？',
  '・どこに行（い）きたかったですか？',
  '・相手（あいて）は何（なん）と言（い）いましたか？',
  '・あなたは何（なん）と答（こた）えましたか？',
  '・わからなかった時（とき）、何（なん）と言（い）いましたか？',
  '',
  'If you cannot remember a personal experience, you may describe something you observed or invent a realistic situation.',
  '',
  'Model Answer (Example):',
  '1. 先週（せんしゅう）、駅（えき）で道（みち）を聞（き）きました。',
  '   Last week, I asked for directions at a station.',
  '2. 「すみません、大阪駅（おおさかえき）はどこですか？」と聞（き）きました。',
  '   I asked, "Excuse me, where is Osaka Station?"',
  '3. 駅員（えきいん）さんは「まっすぐ行（い）って、右（みぎ）に行（い）ってください」と言（い）いました。',
  '   The station staff said, "Go straight, then go right."',
  '4. 私（わたし）は「すみません、もういちど おねがいします」と言（い）いました。',
  '   I said, "Sorry, could you say that again?"',
  '5. 駅員（えきいん）さんは、もういちど ゆっくり言（い）いました。',
  '   The station staff said it again slowly.',
  '6. 私（わたし）は「わかりました。ありがとうございます」と答（こた）えました。',
  '   I answered, "I understand. Thank you."',
  '',
  'Useful Expressions:',
  '・わかりました。 — Wakarimashita. — Understood.',
  '・わかりません。 — Wakarimasen. — I don\'t understand.',
  '・もういちど おねがいします。 — Moo ichido onegai shimasu. — Could you say that again?',
  '・もっと ゆっくり おねがいします。 — Motto yukkuri onegai shimasu. — More slowly, please.',
  '・〇〇は どこですか？ — 〇〇 wa doko desu ka? — Where is 〇〇?',
  '',
  'Useful Vocabulary:',
  '・道（みち） — Michi — Road / Way',
  '・駅（えき） — Eki — Station',
  '・右（みぎ） — Migi — Right',
  '・左（ひだり） — Hidari — Left',
  '・まっすぐ — Massugu — Straight',
  '・地図（ちず） — Chizu — Map',
  '・駅員（えきいん）さん — Ekiin-san — Station staff',
  '',
  'You may use hiragana and katakana. You do not need to use kanji you have not learned.',
  'Use the model as a guide, but write your own experience. Change the place, the directions, or the answers to make it personal.',
  'Please write your answer in Japanese characters, not only in rōmaji.',
].join('\n');

const Q2_TITLE = '② 日本語（にほんご）の宿題（しゅくだい）：道案内（みちあんない）の会話（かいわ）';

const Q2_HELP = [
  'Recorded Conversation: Asking for Directions',
  'Record a short conversation in Japanese lasting approximately 20–35 seconds.',
  '',
  'Situation:',
  'You are looking for a place (a station, a convenience store, a school, etc.). You ask someone the way.',
  'You do not understand the first time, so you ask them to say it again. Then you say "わかりました."',
  '',
  'Roles:',
  '・A：道（みち）を聞（き）く人（ひと） — Person asking the way',
  '・B：道（みち）を教（おし）える人（ひと） — Person giving directions',
  'You may play both roles yourself or record with another person.',
  '',
  '会話（かいわ）の中（なか）で、次（つぎ）の言葉（ことば）を使（つか）ってください。',
  'Use the following expressions in your conversation:',
  '・すみません、〇〇は どこですか？ — Sumimasen, 〇〇 wa doko desu ka? — Excuse me, where is 〇〇?',
  '・もういちど おねがいします。 — Moo ichido onegai shimasu. — Could you say that again?',
  '・わかりました。 — Wakarimashita. — Understood.',
  '・右（みぎ）／左（ひだり）／まっすぐ — Migi / Hidari / Massugu — Right / Left / Straight',
  '',
  'Model Dialogue (Example):',
  'A：すみません、駅（えき）は どこですか？ — Sumimasen, eki wa doko desu ka? — Excuse me, where is the station?',
  'B：まっすぐ行（い）って、左（ひだり）に行（い）ってください。 — Massugu itte, hidari ni itte kudasai. — Go straight, then go left.',
  'A：すみません、もういちど おねがいします。 — Sumimasen, moo ichido onegai shimasu. — Sorry, could you say that again?',
  'B：まっすぐ行（い）って、左（ひだり）です。 — Massugu itte, hidari desu. — Go straight, then left.',
  'A：わかりました。ありがとうございます！ — Wakarimashita. Arigatoo gozaimasu! — Understood. Thank you!',
  'B：いいえ。 — Iie. — No problem.',
  '',
  'Your Task:',
  'Create your own conversation based on the model.',
  '・Ask where a place is.',
  '・Give at least one direction (右／左／まっすぐ).',
  '・Ask to hear it again once using "もういちど おねがいします."',
  '・Say "わかりました" and end the conversation politely.',
  '',
  'Change the place, the directions, or the order to create your own version. Do not simply read the model without changing anything.',
  'Speak clearly at a comfortable pace. You do not need to make the conversation longer just to reach the suggested duration. A slightly shorter recording is fine if the conversation is complete.',
  '',
  'File Name:',
  'Individual: Name_道案内の会話',
  'Pair: Name1_Name2_道案内の会話',
  '',
  'Please upload your audio or video recording.',
].join('\n');

function updateForm06() {
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
