'use client';

import { useState, useEffect } from 'react';

interface Question {
  id: string;
  section: string;
  title: string;
  question: string;
  answer: string;
  checked: boolean;
}

const initialQuestions: Question[] = [
  // 病院への質問
  {
    id: 'hospital-1',
    section: '病院（青洲会病院）',
    title: '診断書の作成依頼',
    question: '診断書を作成してもらいましたか？',
    answer: '',
    checked: false,
  },
  {
    id: 'hospital-2',
    section: '病院（青洲会病院）',
    title: '診療記録の取得',
    question: '過去5年間の診療記録をもらいましたか？',
    answer: '',
    checked: false,
  },
  {
    id: 'hospital-3',
    section: '病院（青洲会病院）',
    title: '初診病院の情報',
    question: '35年前の初診病院の名前と所在地：',
    answer: '',
    checked: false,
  },
  {
    id: 'hospital-4',
    section: '病院（青洲会病院）',
    title: '費用確認',
    question: '診断書と診療記録の合計費用：',
    answer: '',
    checked: false,
  },
  {
    id: 'hospital-5',
    section: '病院（青洲会病院）',
    title: '低血糖発作の記録',
    question: '過去の低血糖発作の記録はありますか？（件数・時期など）',
    answer: '',
    checked: false,
  },

  // 年金事務所への質問
  {
    id: 'pension-1',
    section: '年金事務所',
    title: '年金加入状況',
    question: '厚生年金と国民年金のどちらで申請すべきか確認した？',
    answer: '',
    checked: false,
  },
  {
    id: 'pension-2',
    section: '年金事務所',
    title: '診断書の様式',
    question: '診断書の様式は何号か？（104号 or 101号）',
    answer: '',
    checked: false,
  },
  {
    id: 'pension-3',
    section: '年金事務所',
    title: '必要書類',
    question: '必要な書類の完全なリスト：',
    answer: '',
    checked: false,
  },
  {
    id: 'pension-4',
    section: '年金事務所',
    title: '初診日の確認',
    question: '初診日確認に必要な書類は？',
    answer: '',
    checked: false,
  },
  {
    id: 'pension-5',
    section: '年金事務所',
    title: '窓口訪問予約',
    question: '予約日時と担当者の連絡先：',
    answer: '',
    checked: false,
  },
  {
    id: 'pension-6',
    section: '年金事務所',
    title: '認定期間',
    question: '申請から認定まで何日かかる？',
    answer: '',
    checked: false,
  },

  // 父親さんへの質問
  {
    id: 'father-1',
    section: '父親さん',
    title: '厚生年金の加入期間',
    question: '会社員をしていた時期（開始年月～終了年月）：',
    answer: '',
    checked: false,
  },
  {
    id: 'father-2',
    section: '父親さん',
    title: '国民年金',
    question: '国民年金に加入していた時期：',
    answer: '',
    checked: false,
  },
  {
    id: 'father-3',
    section: '父親さん',
    title: '初診日',
    question: '35年前の初診日と病院名：',
    answer: '',
    checked: false,
  },
  {
    id: 'father-4',
    section: '父親さん',
    title: '低血糖発作の履歴',
    question: '低血糖発作の過去の記録（初回・直近・頻度など）：',
    answer: '',
    checked: false,
  },
  {
    id: 'father-5',
    section: '父親さん',
    title: '合併症',
    question: '医者から指摘されている合併症は？',
    answer: '',
    checked: false,
  },
  {
    id: 'father-6',
    section: '父親さん',
    title: '検査値',
    question: '最近の血糖値・HbA1c・Cペプチド値：',
    answer: '',
    checked: false,
  },
  {
    id: 'father-7',
    section: '父親さん',
    title: '医療費',
    question: '月の医療費自己負担額：',
    answer: '',
    checked: false,
  },
];

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [saved, setSaved] = useState(false);

  // ローカルストレージから読み込み
  useEffect(() => {
    const saved = localStorage.getItem('障害年金チェックリスト');
    if (saved) {
      try {
        setQuestions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load from localStorage:', e);
      }
    }
  }, []);

  // ローカルストレージに保存
  const handleSave = () => {
    localStorage.setItem('障害年金チェックリスト', JSON.stringify(questions));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // チェックボックスの更新
  const handleCheck = (id: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, checked: !q.checked } : q))
    );
  };

  // テキスト入力の更新
  const handleAnswerChange = (id: string, value: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, answer: value } : q))
    );
  };

  // セクションごとにグループ化
  const grouped = questions.reduce(
    (acc, q) => {
      if (!acc[q.section]) acc[q.section] = [];
      acc[q.section].push(q);
      return acc;
    },
    {} as Record<string, Question[]>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            障害年金申請 チェックリスト
          </h1>
          <p className="text-gray-600">
            父親さん（63歳、1型糖尿病）の障害年金申請に必要な確認項目
          </p>
          <p className="text-sm text-red-600 font-semibold mt-2">
            ⏰ 期限：2027年2月9日（64歳になる前）
          </p>
        </div>

        {/* セクションごとの表示 */}
        {Object.entries(grouped).map(([section, items]) => (
          <div key={section} className="mb-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-3 px-2 py-2 border-l-4 border-indigo-600">
              {section}
            </h2>

            <div className="space-y-3">
              {items.map((q) => (
                <div
                  key={q.id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
                >
                  {/* タイトルとチェックボックス */}
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={q.checked}
                      onChange={() => handleCheck(q.id)}
                      className="w-6 h-6 text-indigo-600 rounded mt-1 cursor-pointer flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {q.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{q.question}</p>
                    </div>
                  </div>

                  {/* 回答入力欄 */}
                  <textarea
                    value={q.answer}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder="ここに確認内容や回答を入力してください"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-base"
                    rows={3}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 保存ボタン */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105 active:scale-95"
          >
            💾 保存
          </button>
          {saved && (
            <div className="mt-2 bg-green-500 text-white text-center py-2 px-4 rounded-lg text-sm font-semibold">
              ✓ 保存しました
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
