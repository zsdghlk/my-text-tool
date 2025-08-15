import React, { useEffect, useMemo, useState } from "react";

// =============================================
// デザイン刷新（中央配置・テキストは左寄せのまま）
// ・機能はそのまま：全て=1カウントで N 文字ごとに改行
// ・ウィンドウ幅に関係なく「枠（カード）全体」を中央に配置
// ・textarea のテキスト整形/入力は従来どおり左寄せ
// =============================================

export default function App() {
  const [text, setText] = useState(
    `朝焼けのホームに珈琲の香り満ち、人の足音が重なり、冷えた指先もほぐれて、今日はやさしく始まる、胸の奥が少し軽く、気がした。
`
  );
  const [n, setN] = useState(2); // N文字ごとに改行（機能は不変）
  const [out, setOut] = useState("");

  // 合計文字数（改行は除く）
  const totalChars = useMemo(
    () => Array.from(text.replace(/\r?\n/g, "")).length,
    [text]
  );

  // N文字ごとに機械的に折り返す（全て1カウント）
  function wrapLineByN(line: string, N: number): string {
    if (N <= 0) return line;
    const cps = Array.from(line);
    let res = "";
    for (let i = 0; i < cps.length; i++) {
      res += cps[i];
      const atChunkEnd = (i + 1) % N === 0;
      const isLast = i + 1 === cps.length;
      if (atChunkEnd && !isLast) res += "\n"; // 末尾に余計な改行は入れない
    }
    return res;
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
      alert("整形結果をコピーしました。");
    } catch {
      alert("コピーに失敗しました（HTTPS 環境でお試しください）");
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors">
      {/* ヘッダー（中央寄せ） */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 text-center">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">N文字ごとに改行（全て=1）</h1>
          <p className="text-xs md:text-sm opacity-70 mt-1">ローカル処理／軽量・高速</p>
        </div>
      </header>

      {/* コンテンツ（中央寄せラッパー） */}
      <main className="px-4 py-6 md:py-8">
        <div className="mx-auto w-full max-w-2xl grid gap-4 md:gap-6">
          {/* コントロールカード（中央配置、要素は扱いやすいサイズ） */}
          <section aria-label="設定" className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <label htmlFor="n-input" className="block text-sm font-semibold mb-2">N文字ごとに改行</label>
            <div className="flex flex-col items-center gap-3">
              <input
                id="n-input"
                type="number"
                inputMode="numeric"
                min={1}
                value={n}
                onChange={(e) => setN(Math.max(1, Number(e.target.value || 1)))}
                className="w-40 h-11 rounded-xl px-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base text-center"
                aria-describedby="n-help"
              />
              <p id="n-help" className="text-xs opacity-70">数字・記号・絵文字も 1 文字として数えます。</p>
              <div className="mt-2 text-center">
                <div className="text-[11px] uppercase tracking-wide opacity-70">合計カウント（改行除く）</div>
                <div className="text-4xl md:text-5xl font-extrabold leading-none tabular-nums">{totalChars}</div>
              </div>
            </div>
          </section>

          {/* 整形結果（上） */}
          <section aria-label="整形結果" className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <h2 className="text-sm md:text-base font-semibold mb-3">整形結果</h2>
            <textarea
              readOnly
              spellCheck={false}
              className="font-mono whitespace-pre-wrap leading-6 md:leading-7 text-[13px] md:text-[14px] w-full min-h-[160px] md:min-h-[200px] rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 focus:outline-none text-left"
              value={out}
              aria-label="整形結果テキスト"
            ></textarea>
            <div className="mt-3 text-center">
              <button onClick={copyOut} className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                コピー
              </button>
            </div>
          </section>

          {/* 入力エリア（下） */}
          <section aria-label="入力テキスト" className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <h2 className="text-sm md:text-base font-semibold mb-3">入力テキスト</h2>
            <textarea
              className="font-mono whitespace-pre-wrap leading-6 md:leading-7 text-[13px] md:text-[14px] w-full min-h-[320px] md:min-h-[420px] rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label="入力テキスト"
              placeholder="ここにテキストを貼り付け…"
            ></textarea>
          </section>

          <footer className="text-xs opacity-70 text-center py-2">
            <p>※ ブラウザだけで動作します。データは送信されません。</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
