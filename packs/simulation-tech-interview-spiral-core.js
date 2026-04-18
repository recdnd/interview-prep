window.PACK = {
  name: "simulation-tech-interview-spiral-core",
  displayName: "🕹️simulation-tech-interview(Spiral.ooo + core)",
  questions: [
    {
      id: 1,
      title: "まず軽く自己紹介をお願いします。",
      emoji: "👤",
      variants: [
        `立教大学文学部史学科4年のセツ・シュントウです。個人でAIを含むツールやシステム寄りの開発をしていて、曖昧なやり取りをあとから追えて説明できる形にする設計に関心があります。`,
        `はい。立教大学文学部史学科4年のセツ・シュントウです。
普段は個人で、AIを含むツールやシステム寄りのプロダクトを作っています。
特に、曖昧なやり取りや操作履歴をその場限りで終わらせずに、あとから追えて説明できる形で扱う設計に関心があります。
今日はその考え方が一番出ているSpiral系を中心にお話しできればと思っています。よろしくお願いします。`
      ]
    },
    {
      id: 2,
      title: "今はどういう軸で就職活動を見ていますか。",
      emoji: "🧭",
      variants: [
        `実装力だけでなく、曖昧な業務課題を整理して設計や実装につなげられる環境かを重視しています。`,
        `今は、単に実装できるかどうかというより、
曖昧な業務課題や要件を整理して、設計や実装につなげられる環境かどうかを重視しています。
自分は純粋なアルゴリズム特化より、その前段で問題の切り方を整えるところに強い関心があります。`
      ]
    },
    {
      id: 3,
      title: "エンジニア職の中でも、どういう役割に一番関心がありますか。",
      emoji: "⚙️",
      variants: [
        `複雑な内部構造を、使えるinterfaceやworkflowに落とす役割に一番関心があります。`,
        `自分は、純粋なbackend specialistというより、
複雑な内部構造を使えるinterfaceやworkflowに落としていく側に一番強みがあると思っています。
要件整理、設計、プロトタイピング、その後の改善まで比較的一続きで関われる役割に関心があります。`
      ]
    },
    {
      id: 4,
      title: "今日は特に何を見てもらいたいですか。",
      emoji: "🎯",
      variants: [
        `どう問題設定して、どう設計判断しているかを見ていただきたいです。必要なら後半でdemoやGitHubも出せます。`,
        `今日は、自分がどういう問題設定をして、どういう設計判断をしているかを見ていただけると嬉しいです。
必要であれば後半で公開できる範囲のdemoやGitHub、zenn記事もお見せできますが、
まずは口頭で整理してお話しできればと思っています。`
      ]
    },
    {
      id: 5,
      title: "メインのプロジェクトを簡単に説明してください。",
      emoji: "🧱",
      variants: [
        `Spiral系は二層で、coreはappend-only historyと因果関係、playgroundはuser-facingなeditor/workspaceです。`,
        `一番自分らしいのはSpiral系のプロジェクト群です。
大きく二層あって、一つはspiral-core-seriesで、append-onlyなevent historyと因果関係を扱うcore側の研究・実装です。
もう一つがspiral.oooのplayground側で、こちらは自然言語のflameを入口にしてdocumentやfragmentを扱うuser-facingなeditor/workspaceです。
自分の中では、coreは「最近何が起きたかをどう説明可能にするか」、
playgroundは「その内部構造をどう外側で自然に使える形にするか」を担っています。`
      ]
    },
    {
      id: 6,
      title: "技術面接として今日はどちら中心で見ればよいですか。",
      emoji: "🗺️",
      variants: [
        `まずcore側の設計判断を中心に話し、必要なら後半でplaygroundのinterface/workflowを短く見せる流れが自然です。`,
        `技術面接としては、設計判断が出やすいので、
まずはspiral-core-seriesの考え方を中心にお話しして、
必要であれば後半でplayground側のinterfaceやworkflowの画面を短くお見せするのが一番自然だと思っています。`
      ]
    },
    {
      id: 7,
      title: "core側で何を解決したくて作ったんですか。",
      emoji: "🧠",
      variants: [
        `最新状態だけでなく、なぜそうなったかを追えるように、append-only historyと親因果DAGで扱う設計にしました。`,
        `普通のシステムだと、最新状態は見えても、そこに至るまでの流れや因果関係が落ちやすいと感じています。
特にAIやderived eventが入ると、「何が起きたか」は分かっても「なぜそうなったか」が追いにくいです。
そこで、履歴をappend-onlyのevent historyとして持ち、
各eventにexplicitなparent_idsを持たせてDAGとして扱うようにしました。`
      ]
    },
    {
      id: 8,
      title: "recent contextの切り方はどう考えていますか。",
      emoji: "📎",
      variants: [
        `seedはlast Kで取り、membershipはcausal closureで決め、trace_scoreはviewのsortのみに使います。`,
        `recentを時間窓で切ると原因が落ちやすいし、importance scoreだけで切るとmembership理由が曖昧になります。
なのでseedはlast Kで取りつつ、membership自体はcausal closureで決め、
trace_scoreはviewのsortにだけ使っています。
つまり最近性と説明可能性を分離して扱う設計です。`
      ]
    },
    {
      id: 9,
      title: "append-onlyにした理由は何ですか。",
      emoji: "🪵",
      variants: [
        `状態より変化そのものを説明対象にしたかったからです。historyをtruthにし、状態はそこから読む方針です。`,
        `一番大きいのは、更新後の状態より変化そのものを説明対象にしたかったからです。
状態を上書きし続けると最新状態は取れても、途中の判断や派生が見えにくくなります。
なのでまずhistoryをtruthにして、状態はそこから読めるものとして扱っています。`
      ]
    },
    {
      id: 10,
      title: "append-onlyの難しさはどこに出ますか。",
      emoji: "⚖️",
      variants: [
        `auditabilityは強くなりますが可読性が落ちるので、frontier/recent projection側で今見るべき範囲を解いています。`,
        `historyが全部残るので、そのままだと「今どこを見ればいいか」が分かりにくくなることです。
auditabilityは強くなる一方で、可読性は落ちるので、
そこはfrontierやrecent projection側で解いています。`
      ]
    },
    {
      id: 11,
      title: "v0.46で何を強化しましたか。",
      emoji: "🧪",
      variants: [
        `interpretabilityを前に出し、parents可視化、derived eventのconflict input pairへの強binding、runtime invariant検証を強化しました。`,
        `v0.46ではinterpretabilityをかなり前に出しました。
view上でparentsを直接見えるようにして、
observeやnoiseのようなderived eventが必ずconcreteなconflict input pairにbindされるようにしました。
さらにruntime invariantでもそれをチェックしていて、
「why is this event here?」をinspectionで追えることを強化した版です。`
      ]
    },
    {
      id: 12,
      title: "将来的なボトルネックはどこになりそうですか。",
      emoji: "🚧",
      variants: [
        `history自体より、recent viewのclosureとranking周辺が先に詰まりやすいと見ています。`,
        `条件が変わる場合は、まずどこがボトルネックになるかを見ます。
この構成だとhistory自体より、recent viewを作る時のclosureとranking周辺が先に詰まりやすいです。
seedから祖先を閉じてreactive eventを足し、最後にrankingするので、
データ量やevent密度が上がるとprojection側が先に重くなりやすいです。`
      ]
    },
    {
      id: 13,
      title: "データ量が増えたらどうしますか。",
      emoji: "📦",
      variants: [
        `historyのinvariantは守ったまま、projectionの作り方を別構造に寄せます。特にclosure生成の探索回数を先に見ます。`,
        `まず探索回数と変換処理の部分を見ます。
特にclosureを作る時のancestorやreactive childの取り方が効くので、
データ量が増えた場合はhistoryのinvariantは守りつつ、
projectionの作り方だけ別の構造に寄せると思います。`
      ]
    },
    {
      id: 14,
      title: "ゼロから作り直すならどこを変えますか。",
      emoji: "♻️",
      variants: [
        `derived eventのselection policyをもっと早くpluggableにします。基盤は維持し、policy層を差し替えやすくします。`,
        `derived eventのselection policyを、もっと早くpluggableにすると思います。
今はconflict pair selectionも比較的単純なpolicyなので、
historyとcausal edgeの基盤は残しつつ、その上のpolicy層はもっと差し替えやすくしていたと思います。`
      ]
    },
    {
      id: 15,
      title: "ユーザー価値はどこにありますか。",
      emoji: "💡",
      variants: [
        `DAG自体ではなく、「最近何が起きたかをあとから説明できる形で見られること」に価値があります。`,
        `ユーザー価値としては、DAGそのものより、
「最近何が起きたかをあとから説明できる形で見られる」ことにあると思っています。
AIが絡むworkflowや複数ステップの内部ツールでは、
最終結果だけでは足りず、どの入力や操作の組み合わせで今の状態になったかを追いたい場面があります。
この仕組みは、その説明コストや原因追跡コストを下げられるのが大きいです。`
      ]
    },
    {
      id: 16,
      title: "外部ユーザーフィードバックは取れていますか。",
      emoji: "🗒️",
      variants: [
        `継続的な外部feedbackはこれからで、今はresearch prototype段階です。次は説明可能な履歴が業務摩擦を減らすかを検証したいです。`,
        `継続的な外部user feedbackはまだこれからです。
今はresearch prototypeとして内部設計をかなり詰めている段階で、
次にプロダクトとして前に進めるなら、
「説明可能な履歴が本当に業務上の摩擦を減らすか」を最初に検証したいと思っています。`
      ]
    },
    {
      id: 17,
      title: "playgroundを見せる時に先に伝えることは何ですか。",
      emoji: "🧩",
      variants: [
        `playgroundはuser-facing layerで、full DSL engine直通版ではない点を先に明確にします。`,
        `今お見せするspiral.oooのplaygroundはuser-facingな体験を見せるためのlayerで、
DSLのcore実装そのものとはレイヤが分かれています。
なので、full engine demoというより、interactionとdocument/fragment modelのdemoとして見ていただくのが分かりやすいです。`
      ]
    },
    {
      id: 18,
      title: "30〜32分の定点demoはどう説明しますか。",
      emoji: "🖥️",
      variants: [
        `editor側は自然言語flame入力をdocument/fragment modelへ反映し、workspace側はfragmentを状態単位として可視化します。`,
        `editor側では、単なるchatではなくdocumentをstructureとして扱っています。
prologueでtypeやauthor、access tierなどのmetadataを持ち、
入力欄の自然言語flameをfragment/document modelに反映する設計です。
workspace側ではfragmentを単なるファイルではなく状態を持つ単位として見せ、
open/wrappedや容量表示で内部構造や制約をUI側でも分かるようにしています。`
      ]
    },
    {
      id: 19,
      title: "DSL直通かを追問された時の守り方",
      emoji: "🛡️",
      variants: [
        `このplaygroundはflow優先で、core DSL実装は別プロジェクトと明示します。非公開部分は責務分離とデータフローで具体化して説明します。`,
        `このplaygroundではuser-facingなflowを優先していて、
DSLのcore実装そのものは別プロジェクト側で持っています。
なのでここはfull engine demoではなく、interactionとdocument modelのdemoです。
一方で、editorが自然言語入力を受け、processing layerでcommand構造に変換し、
結果をfragment/document modelに反映する責務分離は具体的に説明できます。`
      ]
    },
    {
      id: 20,
      title: "普段の優先順位はどう決めますか。",
      emoji: "📌",
      variants: [
        `作りたい順より、不確定要素を早く減らせる順で決めることが多いです。`,
        `面白い順というより、前に進むための不確定要素をどれだけ減らせるかで優先順位を決めることが多いです。
今どこが一番曖昧で、そこが分かると次の判断がしやすくなるのは何かを見ています。`
      ]
    },
    {
      id: 21,
      title: "チームで価値を出しやすい点と補強点",
      emoji: "🤝",
      variants: [
        `曖昧な論点をチームで扱える単位に切るところで価値を出しやすく、チーム速度に合わせてどこで止めるかは今後さらに磨きたいです。`,
        `一番価値を出しやすいのは、曖昧な論点が混ざっている時に、
それを分けてチームで扱える単位にするところだと思っています。
一方で、個人開発だと自由に構造を詰められる分、
チームの前提や速度に合わせてどこまでを今詰めるかの感覚は、実務の中でさらに磨きたいです。`
      ]
    },
    {
      id: 22,
      title: "LoglassのようなB2B SaaSでの相性",
      emoji: "🏢",
      variants: [
        `業務文脈の曖昧さや重さがある場面で、論点整理から設計・実装へつなぐところに相性があると感じています。`,
        `業務要件が最初からきれいに定義されている場面より、
少し曖昧さや文脈の重さがある場面で価値を出しやすいと思っています。
LoglassのようなB2B SaaSだと、機能を作るだけでなく、
業務の流れや認識のずれを前提にどう切ると実装しやすいかを考える場面が多いので、
その部分で相性があると感じています。`
      ]
    },
    {
      id: 23,
      title: "ここまでの補足と逆質問",
      emoji: "❓",
      variants: [
        `補足として強みは「曖昧なものを整理して設計・実装につなぐ前段」です。逆質問は、曖昧要件の段階からエンジニアがどこまで入るかを伺いたいです。`,
        `補足すると、自分は純粋なbackend専業というより、
複雑な内部構造を扱えるinterfaceやworkflowに落とすところに強みがあると思っています。
その上で、曖昧なものを整理して設計や実装につなげる前段で価値を出しやすいタイプです。
逆に伺いたいのは、実際の現場で仕様や業務要件がまだ曖昧な段階から、
エンジニアがどの程度入っていくのかという点です。`
      ]
    },
    {
      id: 24,
      title: "最後に一言ありますか。",
      emoji: "👋",
      variants: [
        `曖昧な業務課題を整理して前に進める強みに手応えがあり、今日のお話でその価値の解像度が上がりました。ありがとうございました。`,
        `今日はありがとうございました。
自分としても、曖昧な業務課題をどう扱うかという点にはかなり関心があります。
今日お話しして、その強みが実際の現場でどう価値になるかの解像度が上がったので、とてもありがたかったです。ありがとうございました。`
      ]
    }
  ]
};
