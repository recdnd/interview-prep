window.PACK = {
  name: "simulation-tech-interview-spiral-core-20q",
  displayName: "🕹️simulation-tech-interview(Spiral core 20Q)",
  questions: [
    {
      id: 1,
      title: "まず簡単に自己紹介をお願いします。",
      emoji: "👤",
      variants: [
        `立教大学文学部史学科4年のセツ・シュントウです。普段は個人で、AIを含むツールやシステム寄りのプロダクトを作っていて、曖昧なやり取りや履歴をあとから説明できる形で扱う設計に関心があります。`
      ]
    },
    {
      id: 2,
      title: "今はどういう軸で就職活動を見ていますか。",
      emoji: "🧭",
      variants: [
        `今は、単に実装できるかどうかというより、曖昧な業務課題や要件を整理して設計や実装につなげられる環境かどうかを重視しています。実装だけでなく、その前段も含めて見られる場所に関心があります。`
      ]
    },
    {
      id: 3,
      title: "エンジニア職の中でも、どういう役割に一番関心がありますか。",
      emoji: "⚙️",
      variants: [
        `純粋なbackend専業というより、複雑な内部構造を使えるinterfaceやworkflowに落としていく側に一番関心があります。要件整理、設計、プロトタイピングが近い役割が自然です。`
      ]
    },
    {
      id: 4,
      title: "これまで作ってきたものの中で、一番自分らしいものは何ですか。",
      emoji: "🧱",
      variants: [
        `一番自分らしいのはSpiral系のプロジェクトです。会話や操作の履歴を、ただのログではなく、あとから説明できる構造として扱うものです。内部は構造的ですが、外からは自然に使える形にしている点が一番自分らしいです。`
      ]
    },
    {
      id: 5,
      title: "そのプロジェクトは、何を解決したくて作ったものですか。",
      emoji: "🎯",
      variants: [
        `普通のシステムだと、最新状態は見えても、そこに至るまでの流れや因果が落ちやすいと思っています。特にAIや派生イベントが絡むと「なぜそうなったか」が追いにくいので、履歴から説明可能性を作りたいところから始めました。`
      ]
    },
    {
      id: 6,
      title: "既存のやり方と何が違うんですか。",
      emoji: "🧠",
      variants: [
        `一言でいうと、recent contextを時間窓ではなく、最近の挙動を説明するのに必要な最小の因果閉包として見ているところです。最近かどうかと、なぜそこにあるかを分けて扱っています。`
      ]
    },
    {
      id: 7,
      title: "システムの中で一番コアの設計思想は何ですか。",
      emoji: "🪵",
      variants: [
        `大きく二つで、履歴をappend-onlyで持つことと、parent_idsで因果関係を明示することです。この二つがあるので、「何が起きたか」だけでなく「どうつながっているか」も見られます。`
      ]
    },
    {
      id: 8,
      title: "append-onlyにした理由は何ですか。",
      emoji: "📚",
      variants: [
        `更新後の状態より、変化そのものを記録対象にしたかったからです。状態を上書きしていくと途中の判断や派生が落ちやすいので、まずhistoryをtruthとして持つ方を選びました。`
      ]
    },
    {
      id: 9,
      title: "Event DAGを使ったのはなぜですか。",
      emoji: "🕸️",
      variants: [
        `時系列だけだと順番は分かっても説明関係は弱いからです。observeやnoiseのようなderived eventが何に由来するのかを明示したくて、parent_idsを持たせてDAGとして扱っています。`
      ]
    },
    {
      id: 10,
      title: "v0.46で何が変わったんですか。",
      emoji: "🧪",
      variants: [
        `v0.46はinterpretabilityを前に出した版で、view上でparentsを直接見えるようにし、observe/noiseがconcreteなinput pairに必ずbindされるようにしました。「why is this event here?」をinspectionで追いやすくした版です。`
      ]
    },
    {
      id: 11,
      title: "実装面で一番難しかったポイントはどこですか。",
      emoji: "🧩",
      variants: [
        `closureを保ちつつrecentを小さく保つところが一番難しかったです。説明可能性を残そうとするとviewが膨らみやすいので、どこまで祖先を含めるか、どのreactive eventを足すかの境界が難しかったです。`
      ]
    },
    {
      id: 12,
      title: "将来的なボトルネックはどこですか。",
      emoji: "🚧",
      variants: [
        `条件が変わる場合はまずボトルネックを見ます。この構成だとhistory自体より、recent viewを作る時のclosureとranking周辺が先に詰まりやすいです。スケールを強く意識するならprojection側を先に見直します。`
      ]
    },
    {
      id: 13,
      title: "データ量が増えた場合、どうしますか。",
      emoji: "📦",
      variants: [
        `まず探索回数と変換処理を見ます。closureを作る時のancestor/reactive childの取り方が効いてくるので、historyのinvariantは守りつつprojectionの作り方を別構造に寄せると思います。`
      ]
    },
    {
      id: 14,
      title: "ユーザー価値としてはどこにあるんですか。",
      emoji: "💡",
      variants: [
        `一番の価値は内部のDAGそのものより、「最近何が起きたかをあとから説明できる形で見られる」ことです。原因追跡や認識合わせのコストを下げられるのが大きいです。`
      ]
    },
    {
      id: 15,
      title: "user feedbackは取っていますか。",
      emoji: "🗒️",
      variants: [
        `継続的な外部user feedbackはまだこれからです。今はresearch prototypeとして内部設計を詰めている段階で、次は「説明可能な履歴が本当に業務上の摩擦を減らすか」を検証したいと思っています。`
      ]
    },
    {
      id: 16,
      title: "Spiralのplayground側はどういう位置づけですか。",
      emoji: "🖥️",
      variants: [
        `spiral.oooのplaygroundはuser-facingな体験を見せるlayerです。自然言語のflameを入口にしてdocumentやfragmentを扱うeditor/workspaceとして作っています。一方でDSLのコア実装そのものとはレイヤが分かれています。`
      ]
    },
    {
      id: 17,
      title: "DSLは全部つながっているんですか。",
      emoji: "🔍",
      variants: [
        `このplaygroundではuser-facingなflowを優先していて、DSLのコア実装そのものは別プロジェクト側で持っています。なのでここはfull engine demoというより、interactionとdocument/fragment modelのdemoです。`
      ]
    },
    {
      id: 18,
      title: "playground側で一番自分らしい部分はどこですか。",
      emoji: "🧬",
      variants: [
        `内部構造をそのまま露出させず、意味が落ちない形でinterfaceに落としているところです。純粋なbackend実装そのものより、複雑さをuser-facingに翻訳する方に重心があります。`
      ]
    },
    {
      id: 19,
      title: "チームに入るとしたら、どういうところで価値を出しやすいですか。",
      emoji: "🤝",
      variants: [
        `曖昧な論点が混ざっている時に、それを分けてチームで扱える単位にするところだと思っています。いきなり答えを出すより、どこが混ざっていてどこから確かめると前に進むかを整理する方が自然です。`
      ]
    },
    {
      id: 20,
      title: "LoglassのようなB2B SaaSだと、強みはどこで活きますか。",
      emoji: "🏢",
      variants: [
        `業務要件が最初からきれいに定義されている場面より、少し曖昧さや文脈の重さがある場面で価値を出しやすいです。業務の流れや認識のずれを前提に、どう切ると実装しやすいかを考える場面では相性があると思っています。`
      ]
    },
    {
      id: 21,
      title: "逆に、まだ足りないと思う部分はありますか。",
      emoji: "🪜",
      variants: [
        `あります。実際のB2B SaaSの現場で、顧客文脈や業務要件の複雑さをチームの中でどう優先順位づけるかは、もっと実務の中で学びたいです。`
      ]
    },
    {
      id: 22,
      title: "今日は何を見てもらいたいですか。",
      emoji: "👀",
      variants: [
        `技術そのものというより、自分がどう問題設定して、どう設計判断しているかを見ていただけると嬉しいです。`
      ]
    },
    {
      id: 23,
      title: "最後に一言ありますか。",
      emoji: "👋",
      variants: [
        `自分は、曖昧なものを整理して設計や実装につなげる前段で一番価値を出しやすいと思っています。今日お話しして、その強みが実際の現場でどう価値になるかの解像度が上がりました。ありがとうございました。`
      ]
    }
  ]
};
