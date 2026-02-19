'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, QuerySnapshot, DocumentData } from 'firebase/firestore';

interface Question {
  id: string;
  section: string;
  title: string;
  question: string;
  answer: string;
  checked: boolean;
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Firestore から読み込み
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        console.log('🔄 Firestore から読み込み開始...');
        console.log('db object:', db);

        // タイムアウト機能付きクエリ（30秒に設定）
        const timeoutPromise = new Promise<QuerySnapshot<DocumentData>>((_, reject) =>
          setTimeout(() => reject(new Error('Firestore query timeout after 30s')), 30000)
        );

        const queryPromise = getDocs(collection(db, 'checklist_items'));
        const querySnapshot = await Promise.race([queryPromise, timeoutPromise]) as QuerySnapshot<DocumentData>;

        console.log('✅ クエリ成功。取得件数:', querySnapshot.size);
        const items: Question[] = [];
        querySnapshot.forEach((docSnapshot) => {
          items.push(docSnapshot.data() as Question);
        });
        // セクション順にソート
        items.sort((a, b) => a.id.localeCompare(b.id));
        console.log('📋 アイテム数:', items.length);
        setQuestions(items);
      } catch (error) {
        console.error('❌ Firestore 読み込みエラー:', error);
        // ダミーデータを表示（デバッグ用）
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Firestore に保存
  const handleSave = async () => {
    try {
      for (const question of questions) {
        await updateDoc(doc(db, 'checklist_items', question.id), {
          answer: question.answer,
          checked: question.checked,
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save to Firestore:', error);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">データを読み込み中...</p>
        </div>
      </div>
    );
  }

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
