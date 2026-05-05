export type Activity = {
  id: string;
  name: string;
  category: 'study'|'relationship'|'social'|'health'|'work'|'rest'|'hobby';
  location: string;
  description: string;
  baseEffects: Record<string, number>;
  stressEffect: number;
  fatigueEffect: number;
  possibleEventIds: string[];
  illustrationId: string;
  resultTexts: string[];
};

export const ACTIVITIES: Activity[] = [
  { id:'english', name:'영어 공부', category:'study', location:'도서관', description:'어휘와 독해를 다진다.', baseEffects:{study:4,focus:3}, stressEffect:1, fatigueEffect:2, possibleEventIds:['study_vocab_boost'], illustrationId:'act_english', resultTexts:['영단어를 소리 내어 읽으며 감을 되찾았다.','지문 한 편을 끝까지 분석해 자신감이 올랐다.','틀린 문제를 다시 보며 약점을 정리했다.']},
  { id:'exam', name:'시험 대비', category:'study', location:'자습실', description:'시험 범위를 압축 정리한다.', baseEffects:{study:5,mental:1,focus:2}, stressEffect:2, fatigueEffect:3, possibleEventIds:['exam_mock_score'], illustrationId:'act_exam', resultTexts:['오답 노트를 덮는 순간, 준비가 됐다는 느낌이 들었다.','시간 재고 문제를 풀며 실전 감각을 올렸다.','핵심 개념을 다시 묶어 머릿속이 정리됐다.']},
  { id:'math', name:'수학 공부', category:'study', location:'학원', description:'개념과 풀이 속도를 강화한다.', baseEffects:{study:4,focus:2}, stressEffect:2, fatigueEffect:3, possibleEventIds:['study_math_pattern'], illustrationId:'act_math', resultTexts:['어려운 유형을 풀어내며 집중력이 날카로워졌다.','풀이 과정을 차근차근 써 내려갔다.','막히던 문제가 풀리며 표정이 밝아졌다.']},
  { id:'unreal', name:'언리얼 개발', category:'hobby', location:'작업방', description:'직접 게임을 만들어 본다.', baseEffects:{gaming:3,focus:4,study:1}, stressEffect:1, fatigueEffect:4, possibleEventIds:['unreal_blueprint_breakthrough'], illustrationId:'act_unreal', resultTexts:['블루프린트가 연결되는 순간 손끝이 뜨거워졌다.','작은 프로토타입이 화면에서 움직였다.','에러를 고치며 한 단계 성장했다.']},
  { id:'pcbang', name:'PC방 가기', category:'hobby', location:'PC방', description:'게임을 하며 머리를 식힌다.', baseEffects:{gaming:4,humor:1}, stressEffect:-1, fatigueEffect:3, possibleEventIds:['game_rank_up'], illustrationId:'act_pcbang', resultTexts:['친구들과 웃으며 한 판을 제대로 즐겼다.','순간 판단이 살아나며 승리를 가져왔다.','몰입의 시간이 빠르게 흘러갔다.']},
  { id:'date', name:'희선과 데이트', category:'relationship', location:'강변 거리', description:'희선과 특별한 시간을 보낸다.', baseEffects:{romance:5,social:1,emotion:2}, stressEffect:-2, fatigueEffect:1, possibleEventIds:['heeseon_rainwalk'], illustrationId:'act_date', resultTexts:['서로의 하루를 나누며 천천히 걸었다.','눈이 마주칠 때마다 괜히 웃음이 났다.','작은 배려 하나가 오래 기억에 남았다.']},
  { id:'walk', name:'희선과 산책', category:'relationship', location:'공원', description:'가볍게 걸으며 대화한다.', baseEffects:{romance:3,emotion:2}, stressEffect:-1, fatigueEffect:1, possibleEventIds:['heeseon_confession_hint'], illustrationId:'act_walk', resultTexts:['바람이 부는 길에서 대화가 길어졌다.','벤치에 앉아 서로의 고민을 들었다.','평범한 시간이 오히려 소중했다.']},
  { id:'friends', name:'친구들과 놀기', category:'social', location:'번화가', description:'친구들과 어울리며 에너지를 얻는다.', baseEffects:{social:4,humor:3}, stressEffect:-1, fatigueEffect:2, possibleEventIds:['friends_teamplay'], illustrationId:'act_friends', resultTexts:['장난 섞인 대화에 분위기가 금세 풀렸다.','서로를 놀리며 크게 웃었다.','함께라서 하루가 더 빠르게 지나갔다.']},
  { id:'karaoke', name:'노래방 가기', category:'social', location:'노래방', description:'노래로 스트레스를 풀어낸다.', baseEffects:{humor:3,social:2,emotion:1}, stressEffect:-2, fatigueEffect:2, possibleEventIds:['friends_karaoke_duet'], illustrationId:'act_karaoke', resultTexts:['마이크를 잡자 긴장이 조금씩 풀렸다.','떼창으로 방 안이 들썩였다.','고음 한 소절에 모두가 박수쳤다.']},
  { id:'anpan', name:'단팥빵 사러가기', category:'hobby', location:'빵집', description:'좋아하는 빵으로 소소한 행복을 채운다.', baseEffects:{emotion:3}, stressEffect:-2, fatigueEffect:-1, possibleEventIds:['food_anpan_limited'], illustrationId:'act_anpan', resultTexts:['갓 구운 냄새가 기분을 확 끌어올렸다.','달콤한 한 입에 표정이 풀렸다.','작은 보상이 다음 하루를 버티게 했다.']},
  { id:'exercise', name:'운동하기', category:'health', location:'체육관', description:'몸을 단련해 체력을 회복한다.', baseEffects:{stamina:5,mental:1}, stressEffect:-1, fatigueEffect:2, possibleEventIds:['health_runner_high'], illustrationId:'act_exercise', resultTexts:['땀을 흘리고 나니 머리가 맑아졌다.','호흡을 맞추며 페이스를 유지했다.','끝까지 해냈다는 성취감이 남았다.']},
  { id:'parttime', name:'알바하기', category:'work', location:'편의점', description:'사회 경험과 용돈을 얻는다.', baseEffects:{social:2,esteem:3,mental:1}, stressEffect:1, fatigueEffect:3, possibleEventIds:['friends_parttime_customer'], illustrationId:'act_parttime', resultTexts:['손님 응대가 한결 자연스러워졌다.','작은 실수를 바로잡으며 침착함을 배웠다.','일 끝난 뒤 묵직한 보람이 남았다.']},
  { id:'counsel', name:'주원쌤 상담', category:'study', location:'상담실', description:'학습과 생활 방향을 점검한다.', baseEffects:{mental:3,study:2}, stressEffect:-1, fatigueEffect:0, possibleEventIds:['study_teacher_feedback'], illustrationId:'act_counsel', resultTexts:['선생님의 피드백이 길을 선명하게 만들었다.','막연했던 고민이 계획으로 바뀌었다.','한 문장이 오래 남아 동기를 다졌다.']},
  { id:'rest', name:'휴식', category:'rest', location:'집', description:'아무것도 하지 않고 쉰다.', baseEffects:{mental:2,emotion:2}, stressEffect:-3, fatigueEffect:-4, possibleEventIds:['mental_night_recovery'], illustrationId:'act_rest', resultTexts:['따뜻한 이불 속에서 깊게 숨을 골랐다.','조용한 시간을 보내며 마음을 정돈했다.','서두르지 않는 하루가 컨디션을 살렸다.']},
];
