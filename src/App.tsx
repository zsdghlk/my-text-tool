import React, { useEffect, useMemo, useState } from "react";

// =============================
// 完全等価カウント・禁則なし版
// ・数え方：すべての文字（記号/数字/英字/かな漢字/絵文字）= 1
// ・機能：N文字ごとに機械的に改行（記号優先や禁則などの微調整は一切しない）
// ・改行コード（CRLFなど）は正規化
// ・整形結果は上部に表示 / 合計カウントは大きく表示
// =============================

export default function App() {
  const [text, setText] = useState(
    "例）東京都千代田区丸の内1-1-1\n電話: 03-1234-5678\n; ; 1 ; ;😊"
  );
  const [n, setN] = useState(2); // ご要望通り、初期値は 2 文字ごとに改行
  const [out, setOut] = useState("");

  // 合計文字数（改行は除く）
  const totalChars = useMemo(
    () => Array.from(text.replace(/\r?\n/g, "")).length,
    [text]
  );

  // N文字ごとに機械的に折り返す
  function wrapLineByN(line: string, N: number): string {
    if (N <= 0) return line;
    const cps = Array.from(line);
    let out = "";
    for (let i = 0; i < cps.length; i++) {
      out += cps[i];
      const atChunkEnd = (i + 1) % N === 0;
      const isLast = i + 1 === cps.length;
      if (atChunkEnd && !isLast) out += "\n"; // 末尾に余計な改行は入れない
    }
    return out;
  }

  function processText(input: string): string {
    // 改行を正規化（\r\n, \r, U+2028/2029 → \n）
    const normalized = input.replace(/\r\n?|\u2028|\u2029/g, "\n");
    return normalized
      .split("\n")
      .map((line) => wrapLineByN(line, n))
      .join("\n");
  }

  useEffect(() => {
    setOut(processText(text));
  }, [text, n]);

  async function copyOut() {
    try {
      await navigator.clipboard.writeText(out);
      alert("整形済みテキストをコピーしました。");
    } catch {
      alert("コピーに失敗しました…（HTTPS環境でお試しください）");
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto grid gap-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">N文字ごとに改行（すべて=1・禁則なし）</h1>
          <div className="text-xs md:text-sm opacity-80">全てローカルで処理</div>
        </header>

        {/* 上部：整形結果 */}
        <section className="bg-slate-800/60 rounded-2xl p-3 md:p-4 shadow">
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-semibold">整形結果（上部表示）</label>
            <div className="flex gap-2">
              <button
                onClick={copyOut}
                className="px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm shadow"
              >
                コピー
              </button>
            </div>
          </div>
          <textarea
            className="mt-2 w-full h-36 md:h-40 rounded-xl bg-slate-900/70 border border-slate-700 p-3 focus:outline-none"
            readOnly
            value={out}
          />
        </section>

        {/* 設定 */}
        <section className="bg-slate-800/60 rounded-2xl p-3 md:p-4 shadow grid gap-3">
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <label className="text-sm font-semibold">N文字ごとに改行</label>
            <input
              type="number"
              min={1}
              value={n}
              onChange={(e) => setN(Math.max(1, Number(e.target.value || 1)))}
              className="w-28 bg-slate-900/70 border border-slate-700 rounded-lg px-2 py-1 focus:outline-none"
            />
            <div className="ml-auto text-right">
              <div className="text-[11px] opacity-80">合計カウント（改行除く）</div>
              <div className="text-2xl md:text-3xl font-extrabold tracking-tight leading-none">{totalChars}</div>
            </div>
          </div>
          <p className="text-[11px] opacity-80">※ 記号・数字・英字・日本語・絵文字も全て同列の「1文字」として扱います。禁則・区切り優先などの特別処理は行いません。</p>
        </section>

        {/* 入力 */}
        <section className="bg-slate-800/60 rounded-2xl p-3 md:p-4 shadow">
          <label className="text-sm font-medium">入力テキスト</label>
          <textarea
            className="mt-2 w-full h-[320px] md:h-[420px] rounded-xl bg-slate-900/70 border border-slate-700 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ここにテキストを貼り付け…"
          />
        </section>
      </div>
    </div>
  );
}
