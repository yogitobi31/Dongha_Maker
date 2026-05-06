export type GrowthDirection = {
  id: string;
  title: string;
  description: string;
  boostedTags: string[];
  eventBias: string[];
};

export const GROWTH_DIRECTIONS: GrowthDirection[] = [
  { id:'curious', title:'호기심 많은 아이', description:'질문하고 관찰하며 세계를 탐색하는 한 달', boostedTags:['curiosity','study','observe','experiment'], eventBias:['question','focus'] },
  { id:'social', title:'밝고 사교적인 아이', description:'사람들과의 상호작용 속에서 자라는 한 달', boostedTags:['social','play','bond'], eventBias:['friend','gift'] },
  { id:'sensitive', title:'조용하고 섬세한 아이', description:'감정과 표현을 조심스레 키우는 한 달', boostedTags:['emotion','art','music','observe'], eventBias:['music','emotion'] },
  { id:'fit', title:'체력이 좋은 아이', description:'바깥 공기와 움직임으로 리듬을 만드는 한 달', boostedTags:['exercise','outdoor','play'], eventBias:['outdoor','energy'] },
  { id:'studyHabit', title:'공부 습관이 잡힌 아이', description:'차분한 집중과 루틴을 쌓는 한 달', boostedTags:['study','focus','routine','book'], eventBias:['focus','question'] },
  { id:'freeSoul', title:'자유로운 영혼', description:'예측 불가한 상상과 실험이 피어나는 한 달', boostedTags:['creative','random','curiosity'], eventBias:['random','turning'] },
];
