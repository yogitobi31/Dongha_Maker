export type EventTrigger = {
  minStats?: Record<string, number>; maxStats?: Record<string, number>; minRelationship?: number; maxStress?: number; minStress?: number; requiredActivities?: string[]; requiredMemoryTags?: string[]; excludedMemoryTags?: string[]; monthRange?: [number, number]; randomChance?: number;
};
export type GameEvent = { id:string; title:string; type:string; character:string; location:string; monthRange:[number,number]; trigger:EventTrigger; illustrationId:string; dialogue:{speaker:string;text:string}[]; choices:{id:string;text:string;effects:Record<string,number>;memoryNote:string}[]; effects:Record<string,number>; memoryTag:string; priority:number; repeatable?:boolean };

const mk=(id:string,type:string,character:string,location:string,memoryTag:string,priority:number,trigger:EventTrigger):GameEvent=>({id,title:id.replace(/_/g,' '),type,character,location,monthRange:trigger.monthRange??[1,12],trigger,illustrationId:id,dialogue:[{speaker:character,text:'오늘은 작은 전환점이 될 것 같아.'},{speaker:'동하',text:'내 선택이 앞으로를 바꿀지도 몰라.'}],choices:[{id:'a',text:'차분히 받아들인다',effects:{mental:2},memoryNote:'침착하게 반응했다.'},{id:'b',text:'과감히 도전한다',effects:{focus:2,stress:1},memoryNote:'도전을 택했다.'}],effects:{esteem:1},memoryTag,priority});

export const EVENTS: GameEvent[] = [
mk('study_vocab_boost','study','주원쌤','도서관','어휘돌파',7,{minStats:{study:30},requiredActivities:['english'],randomChance:0.5}),
mk('study_math_pattern','study','주원쌤','학원','수학패턴',7,{requiredActivities:['math'],randomChance:0.5}),
mk('study_focus_streak','study','동하','자습실','집중연속',6,{minStats:{focus:40},randomChance:0.4}),
mk('study_teacher_feedback','study','주원쌤','상담실','피드백메모',8,{requiredActivities:['counsel'],randomChance:0.7}),
mk('study_quiet_library','study','동하','도서관','고요한몰입',5,{requiredActivities:['english','exam'],randomChance:0.35}),
mk('study_peer_help','study','친구','교실','서로가르침',5,{minStats:{social:30},randomChance:0.4}),
mk('study_small_award','study','주원쌤','학교','학습칭찬',8,{minStats:{study:55},randomChance:0.3}),
mk('study_mistake_note','study','동하','집','오답습관',6,{minStress:20,randomChance:0.4}),
mk('exam_mock_score','exam','주원쌤','교실','모의고사',9,{requiredActivities:['exam'],monthRange:[2,11],randomChance:0.6}),
mk('exam_time_management','exam','동하','시험장','시간배분',8,{minStats:{focus:45},randomChance:0.45}),
mk('exam_nervous_start','exam','동하','시험장','긴장시작',6,{minStress:35,randomChance:0.4}),
mk('exam_rebound','exam','동하','집','반등의지',7,{requiredMemoryTags:['모의고사'],randomChance:0.35}),
mk('exam_top_percent','exam','주원쌤','학교','상위권',10,{minStats:{study:70},monthRange:[6,12],randomChance:0.3}),
mk('exam_after_relief','exam','동하','강변','시험후해방',5,{monthRange:[4,12],randomChance:0.45}),
...Array.from({length:14},(_,i)=>mk(`heeseon_event_${i+1}`,'heeseon','희선','공원',`희선추억${i+1}`,7,{minRelationship:20,randomChance:0.45})),
...Array.from({length:14},(_,i)=>mk(`friends_event_${i+1}`,'friends','친구들','번화가',`친구추억${i+1}`,6,{minStats:{social:25},randomChance:0.45})),
...Array.from({length:8},(_,i)=>mk(`game_event_${i+1}`,'game','동하','PC방',`게임순간${i+1}`,6,{requiredActivities:['pcbang','unreal'],randomChance:0.4})),
mk('food_anpan_limited','food','빵집 사장님','빵집','한정단팥빵',5,{requiredActivities:['anpan'],randomChance:0.5}),
mk('food_warm_snack','food','동하','매점','따뜻한간식',4,{randomChance:0.45}),
mk('food_share_bread','food','희선','공원','빵나눔',6,{minRelationship:30,randomChance:0.4}),
mk('food_midnight_hunger','food','동하','집','야식유혹',4,{minStress:20,randomChance:0.45}),
mk('mental_burnout_signal','mental','동하','집','번아웃신호',9,{minStress:60,randomChance:0.7}),
mk('mental_night_recovery','mental','동하','집','밤회복',8,{requiredActivities:['rest'],randomChance:0.6}),
Object.assign(mk('mental_night_recovery_repeat','mental','동하','집','밤회복반복',7,{requiredActivities:['rest'],randomChance:0.4}),{repeatable:true}),
mk('mental_overthinking','mental','동하','방','과몰입',7,{minStress:45,randomChance:0.5}),
mk('mental_support_call','mental','친구','통화','응원전화',6,{minStress:35,randomChance:0.5}),
mk('season_spring_blossom','season','희선','벚꽃길','봄의기억',7,{monthRange:[3,4],randomChance:0.5}),
mk('season_winter_first_snow','season','친구들','거리','첫눈',7,{monthRange:[12,12],randomChance:0.8}),
];
