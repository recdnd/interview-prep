/** Loglass 面試用：5min intro / Spiral / 志望動機 */
window.PACK = {
  name: "loglass",
  displayName: "Loglass",
  questions: [
    {
      id: 1,
      title: "5min intro + project presentation",
      emoji: "🪐",
      variants: [
        `立教大学文学部史学科4年の、セツシュントウと申します。
古代地中海史ゼミに所属していて、2027年9月に卒業予定です。
出身は中国・上海です。

もともとはアメリカのバージニア工科大学に進学する予定だったのですが、コロナの影響で進路を見直すことになりました。そこで日本語を独学しながら新たに受験準備を進め、最終的に東京で進学し直しました。

エンジニアを志したきっかけは、大学で制度史を学ぶ中で、履歴や制度のような「複雑な構造」そのものに強く関心を持つようになったことです。
そうした構造が、時間の中でどう変化して、なおかつ人にどう理解されるのかを考えるうちに、その関心が自然とソフトウェア設計やシステム設計にもつながっていきました。
その後、複雑なものを構造化して、人に分かる形で扱えるようにすることに、だんだん興味を持つようになりました。

次のページですが、開発経験は3年以上あります。
フルスタックの個人開発を中心に、抽象度の高いシステム設計や、プロトタイプの設計・実装、動的・静的なWebサービスの運営などに取り組んできました。
そのほかにも、Pythonによる自動化、GUIツール、小規模ツールの設計など、幅広く触ってきました。
また、実験的な取り組みとして、Custom DSLの設計や命令系の設計にも取り組んできました。
たとえば、AIワークフロー向けの制御構文設計、権限モデル設計、ドキュメント駆動型のシステム設計なども、自分で構想しながら進めてきました。
その中でも特に、開発環境の最適化やAI連携、意味解析や簡易パーサーの設計、そしてUX/UI設計から実装までを一貫して行ってきました。

主な技術スタックはこちらになります。

……では、次のページに移ります。
今後は、改善や効率向上につながる課題を見つけて、企画から設計、実装まで一貫して関われるビルダーになりたいと考えています。
特に、AIワークフロー設計や要件定義、開発プロセス改善、あるいは業務改善につながる社内ツールの提案や設計・実装に関心があります。
自分は、与えられた機能をそのまま作るというより、課題を見つけて、全体像を踏まえて整理し、実際に使いやすい形に落としていくところに一番強みがあると思っています。
なので、フロントエンド・バックエンド・設計を細かく分断せずに、プロダクトの目的やユーザー価値、業務全体の流れまで含めて考えられる環境で働きたいです。
複雑な課題を構造化して、プロダクトとして価値に変えていけるようになりたいと思っています。

では早速、私のメーンプロジェクトであるSpiralについて、ご紹介したいと思います。
プロジェクトの概要は左側にまとめておりますので、もしご興味を持っていただけましたら、ぜひ後ほどアクセスしてご覧いただければと思います。
このプロジェクトは、開発や設計の多くを英語ベースで進めてきたものですので、ここからは英語でご説明いたします。

Let me introduce Spiral, which is my main project.
Spiral is a system for handling conversation and document structure on top of history.
It is both a full-stack product and a research prototype, and in this project I worked as the founder, architect, and developer.

From the technical implementation side, one major point was the design of an append-only event history.
I wanted the system to preserve operations and transitions as history, rather than treating state as something opaque or constantly overwritten.

Another implementation point was causal relationship management using an event DAG.
This allowed me to derive meaningful recent context from the structure of events themselves.

I also designed an interaction model that combines natural language and DSL, and I integrated conversational UX with structural manipulation.
This was important because I wanted users not only to talk to the system, but also to operate it in a way that remains structured and explainable.

At the higher design level, I worked on defining the system model of Spiral itself.
That included the RWX-based permission and operation model, the unification of documents, conversations, and actions inside a single workspace, and the product design that consistently treats modules, permissions, and identity as one connected system.

So, in summary, Spiral was an attempt to unify complex concepts and system structures into one interface that is easier to use and easier to understand.
More than a single prototype, Spiral was also a way for me to think through how interaction, structure, and system history can be designed as one coherent product.

Spiral is a system for handling dialogue and document structure on top of event history.
When I designed it, I did not start from implementation details first.
I started by organizing the requirements: how to keep the internal structure complex, while making the interaction feel simple from the outside.

Then I separated the experience into a Desktop layer and a Fragment Editor layer, so browsing, editing, and execution would not collapse into one confusing screen.
After that, I designed the permission model by separating Read, Write, and Execute, so the boundary between visibility and action would stay clear. The model was inspired by the Linux permission system, but adapted to an interactive product context.
Then I structured the metadata layer for document types and module definitions, so the system could decide how to display and execute different objects consistently.

I also separated AI responsibilities from normal backend logic.
Interpretation and completion are handled by AI, while permission checks and state updates remain in ordinary logic.

Finally, I integrated all of that into a workspace that looks simple from the outside, even though the internal system is quite complex.

以上がSpiralの概要です。
内部はかなり複雑なんですが、外からはなるべく自然に触れるように整理した、というのが一番大きい考え方でした。
まだ発展途中ではありますが、自分の設計の考え方が一番よく出ているプロジェクトだと思っています。
もしどこか気になるところがあれば、日本語でも補足します。`
      ]
    },
    {
      id: 2,
      title: "Spiral で一番こだわった点",
      emoji: "🧩",
      variants: [
        `一番こだわったのは、内部構造はかなり複雑でも、外から触ったときにはできるだけ自然で分かりやすく見えるようにした点です。
そのために、イベント履歴や権限モデルのような内部設計と、ユーザーが触れるworkspaceの体験設計を分けずに考えました。`
      ]
    },
    {
      id: 3,
      title: "なぜ event history / event DAG を採用したか",
      emoji: "🕸️",
      variants: [
        `状態を単に上書きしてしまうより、変化の理由や流れを追えるほうが、自分の関心にも合っていたからです。
特にSpiralでは、文書・対話・操作が絡むので、因果関係をある程度構造として持っていたほうが、後から理解しやすいと考えました。`
      ]
    },
    {
      id: 4,
      title: "RWX 権限モデルの発想",
      emoji: "🔐",
      variants: [
        `見えることと、変更できることと、実行できることは、本来かなり性質が違うと思っています。
そこを分けたほうが、操作の境界が明確になりますし、システム全体の理解もしやすくなると考えました。
発想としてはLinuxのpermission modelに影響を受けていますが、それをそのままではなく、対話型プロダクト向けに再構成しました。`
      ]
    },
    {
      id: 5,
      title: "AI と通常ロジックを分けた理由",
      emoji: "🤖",
      variants: [
        `AIは解釈や補完には強いですが、権限判定や状態更新のような責務まで曖昧にしてしまうと、システムとして不安定になると思っています。
なので、AIに任せる部分と、通常ロジックで厳密に持つ部分は意識的に分けました。`
      ]
    },
    {
      id: 6,
      title: "なぜ経営管理・業務 SaaS に関心があるのか",
      emoji: "📊",
      variants: [
        `自分はもともと、複雑な構造を整理して、人が理解・運用できる形にすることに強く関心があります。
経営管理の領域も、数字だけではなく、組織や業務の流れ、意思決定の構造が絡むと思うので、その意味でかなり相性があると感じています。`
      ]
    },
    {
      id: 7,
      title: "個人開発中心だが、チームでどう価値を出すか",
      emoji: "🤝",
      variants: [
        `たしかに今までは個人開発の比重が大きかったです。
ただ、一人で全部やっていたからこそ、要件・設計・実装のつながりを強く意識してきました。
チームでは、その全体像を踏まえて整理したり、設計上の認識をそろえたりするところでも価値を出したいと思っています。`
      ]
    },
    {
      id: 8,
      title: "自分の強みを一言で",
      emoji: "💡",
      variants: [
        `課題を見つけて、全体像を踏まえて構造化し、実際に使える形まで落とし込むところです。
単に実装するだけではなく、何をどう整理すれば価値になるかを考えながら作るのが自分の強みだと思っています。`
      ]
    },
    {
      id: 9,
      title: "Loglass で気になっていること",
      emoji: "🏢",
      variants: [
        `特に気になっているのは、経営管理という複雑なドメインを扱う中で、プロダクト側で「汎用性」と「顧客ごとの業務文脈」のバランスをどう取っているのか、という点です。
また、顧客価値に近い課題設定と技術的な設計判断が、実際の開発現場でどのようにつながっているのかも伺ってみたいです。`
      ]
    },
    {
      id: 10,
      title: "Loglass の説明を聞いた後の感想",
      emoji: "🌙",
      variants: [
        `経営管理という領域そのものに独自の複雑さがある、という点が特に印象に残りました。
自分も、複雑な構造を整理して、実際に使える形に落とし込むことに関心があるので、その意味でかなり接点があると感じました。`
      ]
    },
    {
      id: 11,
      title: "職種への関心（抽象度・構造化寄り）",
      emoji: "🧭",
      variants: [
        `まだ強く職種を絞っているわけではないのですが、拝見した中では、実装特化というより、複雑な課題や要件を整理して構造化する比重の高いポジションのほうが、自分には近い気がしています。`
      ]
    },
    {
      id: 12,
      title: "職種への関心（要件整理・上流寄り）",
      emoji: "🧩",
      variants: [
        `自分は、細かい実装そのものより、課題や要件の整理、構造化、全体設計のほうにより強みがあるので、そうした比重の高いポジションのほうが近いのかなと思いました。`
      ]
    },
    {
      id: 13,
      title: "職種名より役割の中身を見る",
      emoji: "🪞",
      variants: [
        `正直、職種名そのものより、実際に何を整理して、どこまで構造化や判断に関われるのか、のほうを見ています。その意味では、上流で考える比重が高い役割のほうが近そうです。`
      ]
    },
    {
      id: 14,
      title: "構造化する仕事への関心",
      emoji: "📐",
      variants: [
        `特に、複雑な情報や課題をそのまま扱うのではなく、整理して人に伝わる形にする仕事にはかなり関心があります。なので、そういう役割を含むポジションには自然に惹かれました。`
      ]
    },
    {
      id: 15,
      title: "自分に近い役割のイメージ",
      emoji: "🔎",
      variants: [
        `たとえば、顧客課題や業務要件を整理して、社内のプロダクトや仕組みに橋渡ししていくような役割は、比較的イメージしやすいです。`
      ]
    },
    {
      id: 16,
      title: "今の自分が価値を出しやすい方向",
      emoji: "🧠",
      variants: [
        `プロダクトそのものを作ることにも関心はあるのですが、今の自分だと、複雑な課題を整理して、関係者の間で構造をそろえるような役割のほうが、より自然に価値を出せそうだとは思っています。`
      ]
    },
    {
      id: 17,
      title: "高抽象の課題を扱いたい",
      emoji: "🌐",
      variants: [
        `自分は高抽象の課題を扱うほうが得意なので、そういう役割には自然と興味があります。`
      ]
    },
    {
      id: 18,
      title: "複雑な構造を整理する仕事が合う",
      emoji: "🪜",
      variants: [
        `構造が複雑なものを整理する仕事のほうが、自分には合っていそうだと思いました。`
      ]
    },
    {
      id: 19,
      title: "実装だけに閉じない役割",
      emoji: "⚙️",
      variants: [
        `実装だけに閉じるより、要件や構造を考える比重が高いほうが近い気がします。`
      ]
    },
    {
      id: 20,
      title: "フラットに適職を聞く",
      emoji: "🫧",
      variants: [
        `御社の中だと、どの職種が自分の強みに一番近いのか、少しフラットに伺ってみたいです。`
      ]
    },
    {
      id: 21,
      title: "收着问：先理解角色如何运作",
      emoji: "🌫️",
      variants: [
        `今日のお話を伺っていて、どの職種が自分に近いかを今すぐ決めたいというより、まずは御社の中でそれぞれの役割がどう機能しているのかを理解したい気持ちが強いです。その前提で、もし一つ伺えるとしたら、複雑な課題を整理して前に進める役割は、どのあたりのポジションが担うことが多いのでしょうか。`
      ]
    },
    {
      id: 22,
      title: "複雑な顧客課題を誰が構造化するか",
      emoji: "🧭",
      variants: [
        `今日お話を伺っていて、特に気になったのは、複雑な顧客課題を社内でどのように整理しているのか、という点です。実際には、どの職種がその構造化の中心を担うことが多いのでしょうか。`
      ]
    },
    {
      id: 23,
      title: "標準化と個別性のバランス",
      emoji: "⚖️",
      variants: [
        `拝見した中では、標準化と個別性の両立がかなり難しい領域だと感じたのですが、実際の現場では、そのバランスはどのように判断されることが多いのでしょうか。`
      ]
    },
    {
      id: 24,
      title: "CS / Presales の要件整理とプロダクト連携",
      emoji: "🔗",
      variants: [
        `もし差し支えなければ、カスタマーサクセスやプリセールスの方が、どの程度まで要件整理やプロダクト側へのフィードバックに関わるのかを伺ってみたいです。`
      ]
    },
    {
      id: 25,
      title: "役割は固定か、横断的に広がるか",
      emoji: "🪜",
      variants: [
        `入社後の役割は固定的というより、比較的横断的に広がっていくこともあるのでしょうか。そのあたりのキャリアの持ち方は少し気になっています。`
      ]
    },
    {
      id: 26,
      title: "課題定義や業務構造整理を担う職種",
      emoji: "📐",
      variants: [
        `御社の中では、課題そのものを定義し直したり、業務構造を整理し直したりするような役割は、主にどのポジションが担うことが多いのでしょうか。`
      ]
    },
    {
      id: 27,
      title: "成長フェーズで未整備な領域はどこか",
      emoji: "🏗️",
      variants: [
        `今はかなり成長フェーズにあると思うのですが、役割分担が明確に決まっている部分と、まだこれから作っていく部分は、それぞれどのあたりに多いのでしょうか。`
      ]
    },
    {
      id: 28,
      title: "顧客の声がプロダクトにどう接続されるか",
      emoji: "📮",
      variants: [
        `顧客の声や個別の要望が、実際にどのような形でプロダクト開発側に接続されているのか、その流れを伺えたら嬉しいです。`
      ]
    },
    {
      id: 29,
      title: "職種名より役割の中身を見ている",
      emoji: "🪞",
      variants: [
        `まだ自分の中でも職種名そのものより、実際の役割の中身を見ている段階なのですが、御社の中で、構造化や要件整理の比重が高いポジションはどのあたりになるのか、参考までに伺ってみたいです。`
      ]
    },
    {
      id: 30,
      title: "会社説明後の短い受け止め",
      emoji: "🫧",
      variants: [
        `ありがとうございます。かなり全体像が見えてきました。経営管理の領域そのものを、データやAIも含めて再設計しようとしている会社なんだな、という理解になりました。`
      ]
    },
    {
      id: 31,
      title: "会社説明後の短い受け止め（事業の捉え方）",
      emoji: "🌙",
      variants: [
        `ありがとうございます。単に一つのSaaSを提供しているというより、経営管理の構造そのものを変えようとしている印象を受けました。`
      ]
    },
    {
      id: 32,
      title: "説明を聞いた後の第一問：標準化と個別性",
      emoji: "⚖️",
      variants: [
        `その上で、一点だけ少し構造的なところを伺ってみたいのですが、ログラスさんは標準化されたプロダクトでありながら、顧客ごとのかなり複雑な業務文脈にも向き合っている印象があります。実際には、その両立の中で今いちばん難しいのはどのあたりなのでしょうか。`
      ]
    },
    {
      id: 33,
      title: "説明を聞いた後の第一問：顧客課題とプロダクト接続",
      emoji: "🔗",
      variants: [
        `もう一点、もし差し支えなければ伺いたいのですが、顧客課題や業務要件を整理した内容が、実際にプロダクトの進化や社内の仕組みづくりにどう接続されているのか、その流れが気になっています。`
      ]
    },
    {
      id: 34,
      title: "説明を聞いた後の第一問：AI-native の現在地",
      emoji: "🤖",
      variants: [
        `AI-native company というお話もかなり印象に残ったのですが、実際には、AIを便利なツールとして使う段階と、事業やプロダクトの前提そのものを変える段階との間に大きな差があると思っています。御社の中では、今どのあたりまで進んでいる感覚なのか、少し伺ってみたいです。`
      ]
    },
    {
      id: 35,
      title: "如果只问一个，最推荐：標準化 vs 個別文脈",
      emoji: "🎯",
      variants: [
        `今日のお話を伺っていて、ログラスさんは単なるSaaSというより、経営管理の構造そのものを変えようとしている印象を受けました。その中で、今いちばん難しいのは、プロダクトの標準化と、顧客ごとの複雑な業務文脈の両立のどのあたりなのか、少し伺ってみたいです。`
      ]
    },
    {
      id: 36,
      title: "如果问两个，第二问：要件整理如何进入产品",
      emoji: "📮",
      variants: [
        `もう一点だけ伺えるとしたら、顧客の声や個別の要望が、実際にどのような形でプロダクト開発側に接続されているのか、その流れも気になっています。`
      ]
    },
    {
      id: 37,
      title: "顺着对方回答再追问：谁来做结构化",
      emoji: "🧭",
      variants: [
        `ありがとうございます。今のお話を伺っていて、その整理や構造化の役割を実際にどの職種がどの程度担うのかも、少し気になりました。`
      ]
    },
    {
      id: 38,
      title: "顺着对方回答再追问：判断发生在什么层",
      emoji: "📐",
      variants: [
        `その場合、個別の顧客文脈をどこまで吸収するか、あるいはプロダクトとして標準化するかの判断は、主にどのレイヤーで行われることが多いのでしょうか。`
      ]
    },
    {
      id: 39,
      title: "顺着对方回答再追问：角色边界",
      emoji: "🪞",
      variants: [
        `今のお話を聞いていて、プロダクト側とビジネス側の境界がかなり面白いなと感じました。実際には、その間をつなぐ役割はどのポジションが担うことが多いのでしょうか。`
      ]
    },
    {
      id: 40,
      title: "对方回答后的短回应：先承接再收",
      emoji: "🌫️",
      variants: [
        `なるほど、かなりよく分かりました。単に機能を増やすというより、構造そのものをどう扱うかの判断が重要なんですね。`
      ]
    },
    {
      id: 41,
      title: "对方回答后的短回应：接到自己关心点",
      emoji: "🧠",
      variants: [
        `ありがとうございます。自分も、複雑なものをそのまま受け取るのではなく、いったん整理して扱える形にするところに関心があるので、その点は特に印象に残りました。`
      ]
    },
    {
      id: 42,
      title: "自然过渡：先听懂，再发问",
      emoji: "🪜",
      variants: [
        `ありがとうございます。かなり全体像が見えてきました。その上で、一点だけ少し構造的なところを伺ってみたいのですが……`
      ]
    },
    {
      id: 43,
      title: "自然过渡：不急着判断职种，先理解业务",
      emoji: "🫧",
      variants: [
        `どの職種が近いかを今すぐ判断したいというより、まずは御社の事業や組織の動き方をちゃんと理解したい気持ちが強いです。その前提で、一点だけ伺ってもよろしいでしょうか。`
      ]
    }
  ]
};
