export type GrowthCombo = { id:string; name:string; requiredTags:string[]; statEffects:Record<string,number>; description:string; };
export const GROWTH_COMBOS: GrowthCombo[] = [
{id:'study_rest',name:'안정적인 학습 습관',requiredTags:['study','rest'],statEffects:{지능:2,감수성:3},description:'배움과 쉼의 균형이 보입니다.'},
{id:'exercise_social',name:'활발한 사교성',requiredTags:['exercise','social'],statEffects:{체력:2,사회성:3},description:'움직임이 관계를 열어줍니다.'},
{id:'emotion_bond',name:'섬세한 애정 표현',requiredTags:['emotion','bond'],statEffects:{감수성:3,자존감:3},description:'감정 표현이 따뜻해지고 있어요.'},
{id:'curiosity_study',name:'탐구형 호기심',requiredTags:['curiosity','study'],statEffects:{지능:2,창의력:2},description:'질문이 배움으로 이어집니다.'},
{id:'triple_exercise',name:'넘치는 에너지',requiredTags:['exercise','exercise','exercise'],statEffects:{체력:5},description:'활동성이 뚜렷해졌어요.'},
{id:'rest_emotion',name:'조용한 회복력',requiredTags:['rest','emotion'],statEffects:{감수성:1,자존감:2},description:'쉬는 시간의 질이 좋아졌어요.'},
{id:'routine_focus',name:'차분한 루틴',requiredTags:['routine','focus'],statEffects:{집중력:3},description:'하루의 리듬이 안정적입니다.'},
{id:'music_emotion',name:'감성 리듬',requiredTags:['music','emotion'],statEffects:{감수성:2,창의력:1},description:'소리에 반응하는 폭이 넓어졌어요.'},
{id:'observe_curiosity',name:'관찰의 눈',requiredTags:['observe','curiosity'],statEffects:{호기심:3},description:'사소한 장면도 놓치지 않아요.'},
{id:'creative_social',name:'놀이 리더십',requiredTags:['creative','social'],statEffects:{창의력:2,사회성:2},description:'놀이를 주도하는 기질이 보입니다.'},
];
