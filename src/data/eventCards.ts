export type EventChoice = { id:string; label:string; resultText:string; statEffects:Record<string,number>; stressEffect:number; };
export type EventCard = { id:string; title:string; description:string; tags:string[]; choices:EventChoice[]; sceneTexts:string[]; };

export const EVENT_CARDS: EventCard[] = [
  { id:'stubborn', title:'갑작스러운 고집', description:'동하가 오늘은 아무것도 하기 싫다는 듯 바닥에 누웠다.', tags:['emotion'], sceneTexts:['동하가 입술을 내밀고 바닥에 드러누웠다.','작은 고집이 오늘 하루의 주제가 됐다.','동하는 고개를 돌린 채 버티기 모드에 들어갔다.'], choices:[{id:'force',label:'억지로 시킨다',resultText:'억지로라도 끝냈다.',statEffects:{집중력:2},stressEffect:5},{id:'wait',label:'기다려준다',resultText:'호흡이 가라앉을 때까지 기다렸다.',statEffects:{감수성:4},stressEffect:-1},{id:'toy',label:'장난감으로 유도한다',resultText:'놀이로 자연스럽게 전환됐다.',statEffects:{창의력:3,자존감:2},stressEffect:0}]},
  { id:'focus', title:'뜻밖의 집중', description:'동하가 아무 말 없이 한 장난감을 오래 바라보고 있다.', tags:['focus'], sceneTexts:['고요한 집중이 방 안을 채웠다.','동하는 세상 소리를 잠시 꺼둔 듯했다.','짧지만 깊은 몰입의 순간이었다.'], choices:[{id:'watch',label:'지켜본다',resultText:'집중의 리듬을 존중했다.',statEffects:{집중력:3},stressEffect:-1},{id:'talk',label:'말을 건다',resultText:'대화로 집중이 확장됐다.',statEffects:{사회성:2},stressEffect:0}]},
];
for (let i=3;i<=12;i++) {
  EVENT_CARDS.push({ id:`event_${i}`, title:`뜻밖의 하루 ${i}`, description:'작지만 인상적인 사건이 찾아왔다.', tags:['random'], sceneTexts:['예상 못 한 장면이 지나갔다.','오늘은 평소와 다른 결의 하루였다.','작은 우연이 큰 인상을 남겼다.'], choices:[{id:'a',label:'부드럽게 반응한다',resultText:'온기를 남겼다.',statEffects:{감수성:2},stressEffect:-1},{id:'b',label:'규칙을 세운다',resultText:'리듬을 바로잡았다.',statEffects:{집중력:2},stressEffect:1},{id:'c',label:'함께 웃어넘긴다',resultText:'분위기가 가벼워졌다.',statEffects:{사회성:2},stressEffect:-1}] });
}
