/**
 * @param sentence 要说的句子
 */
import store from '@/store';

export default (sentence: string) => {
  const isSpeak = store.state.isSpeak;
  if (isSpeak === 'speak') {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.pitch = 2; // 语调 0-2 默认 1
    utterance.rate = 0.7; // 语速 0.1-10 默认 1
    utterance.volume = 1; // 音量 0-1 默认 0.5
    window.speechSynthesis.speak(utterance);
  }
};
